import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
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
import { MultiResponse } from '#store/atom/response/types';
import { NapData, NapValue } from '#types';

import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import Loading from '#components/Loading';

import chartImage from '#resources/images/mean-anual-precipitation-chart.png';
import legendImage from '#resources/images/mean-anual-precipitation-legend.png';

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
    setNapTemperature?: (data: NapData[]) => void;
    setNapPrecipitation?: (data: NapData[]) => void;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

interface State {
    scenario: string;
    temperature: NapData[];
    precipitation: NapData[];
    timePeriodKey: string;
    measurementType: string;
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

const measurementOptions = [
    { key: 'temperature', label: 'Temperature' },
    { key: 'precipitation', label: 'Precipitation' },
];

const timePeriodOptions: TimePeriod[] = [
    { key: 'reference-period', label: 'Reference period (1981-2010)', startYear: 1981, endYear: 2010 },
    { key: 'medium-term', label: 'Medium term (2016-2065)', startYear: 2016, endYear: 2065 },
    { key: 'long-term', label: 'Long Term (2036-2065)', startYear: 2036, endYear: 2065 },
];

const scenarioOptions = [
    { key: 'rcp45', label: 'RCP 4.5' },
    { key: 'rcp85', label: 'RCP 8.5' },
];

const requests: { [key: string]: ClientAttributes<ReduxProps, Params>} = {
    napTemperatureGetRequest: {
        url: '/nap-temperature/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({
            response,
            params: { setNapTemperature } = { setNapTemperature: undefined },
        }) => {
            const { results } = response as MultiResponse<NapData>;
            if (setNapTemperature) {
                setNapTemperature(results);
            }
        },
    },
    napPrecipitationGetRequest: {
        url: '/nap-precipitation/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({
            response,
            params: { setNapPrecipitation } = { setNapPrecipitation: undefined },
        }) => {
            const { results } = response as MultiResponse<NapData>;
            if (setNapPrecipitation) {
                setNapPrecipitation(results);
            }
        },
    },
};

class ClimateChange extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            temperature: [],
            precipitation: [],
            scenario: 'rcp45',
            timePeriodKey: 'reference-period',
            measurementType: 'temperature',
        };

        const {
            requests: {
                napTemperatureGetRequest,
                napPrecipitationGetRequest,
            },
        } = this.props;

        napTemperatureGetRequest.setDefaultParams({
            setNapTemperature: (data: NapData[]) => {
                this.setState({
                    temperature: data,
                });
            },
        });

        napPrecipitationGetRequest.setDefaultParams({
            setNapPrecipitation: (data: NapData[]) => {
                this.setState({
                    precipitation: data,
                });
            },
        });
    }

    private handleSetMeasurementType = (measurementType: string) => {
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
        scenario: string,
        measurementType: string,
        timePeriodKey: string,
    ) => {
        const {
            temperature,
            precipitation,
        } = this.state;

        const napData = measurementType === 'tempereature' ? temperature : precipitation;

        const timePeriod = timePeriodOptions.find(option => option.key === timePeriodKey)
                            || timePeriodOptions[0];
        const { startYear, endYear } = timePeriod;

        const filter = ({ year }: NapValue) => (year >= startYear && year <= endYear);

        const filteredData = napData.map((data) => {
            const { district, rcp45, rcp85 } = data;
            const item = scenario === 'rcp45' ? rcp45 : rcp85;
            const filteredItem = item.filter(filter);

            return ({
                district,
                value: filteredItem,
            });
        });

        return filteredData;
    }

    public render() {
        const {
            className,
            requests: {
                napPrecipitationGetRequest: {
                    pending: precipitationPending,
                },
                napTemperatureGetRequest: {
                    pending: temperaturePending,
                },
            },
        } = this.props;

        const {
            timePeriodKey,
            measurementType,
            scenario,
        } = this.state;

        const pending = precipitationPending || temperaturePending;

        const data = this.getFilteredData(scenario, measurementType, timePeriodKey);

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
                    />
                    <div className={styles.bottom}>
                        <img
                            className={styles.chart}
                            src={chartImage}
                            alt="chart"
                        />
                        <img
                            className={styles.legend}
                            src={legendImage}
                            alt="legend"
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    createRequestClient(requests),
)(ClimateChange);
