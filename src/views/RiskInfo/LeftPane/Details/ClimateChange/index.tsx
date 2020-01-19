import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import { AppState } from '#store/types';
import SegmentInput from '#rsci/SegmentInput';
import SelectInput from '#rsci/SelectInput';

import Map from './Map';

import {
    Province,
    District,
    Municipality,
    Ward,
} from '#store/atom/page/types';
import {
    NapData,
    NapValue,
    Scenario,
} from '#types';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import Loading from '#components/Loading';

import {
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
} from '#selectors';

import styles from './styles.scss';


interface OwnProps {
    className?: string;
}

interface PropsFromState {
    provinces: Province[];
    districts: District[];
    municipalities: Municipality[];
    ward: Ward[];
}

interface PropsFromDispatch {
}

interface Params {
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

type MeasurementType = 'temperature' | 'precipitation';

interface State {
    scenario: string;
    timePeriodKey: string;
    measurementType: MeasurementType;
}

interface MapState {
    id: number;
    value: {
        value: number;
    };
}

interface TimePeriod {
    key: string;
    label: string;
    startYear: number;
    endYear: number;
}

const mapStateToProps = (state: AppState) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
});

const measurementOptions: {
    key: MeasurementType;
    label: 'Temperature' | 'Precipitation';
}[] = [
    { key: 'temperature', label: 'Temperature' },
    { key: 'precipitation', label: 'Precipitation' },
];

const timePeriodOptions: TimePeriod[] = [
    { key: 'reference-period', label: 'Reference period (1981-2010)', startYear: 1981, endYear: 2010 },
    { key: 'medium-term', label: 'Medium term (2016-2045)', startYear: 2016, endYear: 2045 },
    { key: 'long-term', label: 'Long Term (2036-2065)', startYear: 2036, endYear: 2065 },
];

const scenarioOptions: Scenario[] = [
    { key: 'rcp45', label: 'RCP 4.5' },
    { key: 'rcp85', label: 'RCP 8.5' },
];

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    napTemperatureGetRequest: {
        url: '/nap-temperature/',
        method: methods.GET,
        onMount: true,
    },
    napPrecipitationGetRequest: {
        url: '/nap-precipitation/',
        method: methods.GET,
        onMount: true,
    },
};

class ClimateChange extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            scenario: 'rcp45',
            timePeriodKey: 'reference-period',
            measurementType: 'temperature',
        };
    }

    private handleSetMeasurementType = (measurementType: MeasurementType) => {
        this.setState({
            measurementType,
        });
    }

    private handleSetScenario =(scenario: string) => {
        this.setState({
            scenario,
        });
    }

    private handleSetTimePeriod = (timePeriodKey: string) => {
        this.setState({
            timePeriodKey,
        });
    }

    private getFilteredData = (
        temperature: NapData[],
        precipitation: NapData[],
        scenario: string,
        measurementType: string,
        timePeriodKey: string,
    ) => {
        const napData = (measurementType === 'temperature') ? temperature : precipitation;

        const timePeriod = timePeriodOptions.find(option => option.key === timePeriodKey)
                            || timePeriodOptions[0];
        const { startYear, endYear } = timePeriod;

        const filter = ({ year }: NapValue) => (year >= startYear && year <= endYear);

        const filteredData = napData.map((data) => {
            const {
                district,
                rcp45,
                rcp85,
            } = data;

            const itemList = (scenario === 'rcp45') ? rcp45 : rcp85;
            const filteredItemList = itemList.filter(filter);

            return ({
                district,
                value: filteredItemList,
            });
        });

        return filteredData;
    }

    public render() {
        const {
            className,
            requests,
        } = this.props;

        const {
            timePeriodKey,
            measurementType,
            scenario,
        } = this.state;

        const pending = isAnyRequestPending(requests);
        const temperature = getResults(requests, 'napTemperatureGetRequest') as NapData[];
        const precipitation = getResults(requests, 'napPrecipitationGetRequest') as NapData[];
        const data = this.getFilteredData(
            temperature,
            precipitation,
            scenario,
            measurementType,
            timePeriodKey,
        );

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.climateChange, className)}>
                    <div className={styles.top}>
                        <SegmentInput
                            className={styles.measurementTypeInput}
                            label="Measurement"
                            options={measurementOptions}
                            value={measurementType}
                            onChange={this.handleSetMeasurementType}
                        />
                        <SelectInput
                            label="Time period"
                            className={styles.timePeriodInput}
                            options={timePeriodOptions}
                            value={timePeriodKey}
                            onChange={this.handleSetTimePeriod}
                            hideClearButton
                        />
                        <SegmentInput
                            className={styles.scenarioInput}
                            label="Scenario"
                            options={scenarioOptions}
                            value={scenario}
                            onChange={this.handleSetScenario}
                        />
                    </div>
                    <Map
                        data={data}
                        measurementType={measurementType}
                        scenarioOptions={scenarioOptions}
                        scenario={scenario}
                    />
                </div>
            </>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    createRequestClient(requestOptions),
)(ClimateChange);
