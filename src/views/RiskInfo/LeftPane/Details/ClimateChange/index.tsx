import React from 'react';
import memoize from 'memoize-one';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import { AppState } from '#store/types';
import SegmentInput from '#rsci/SegmentInput';
import SelectInput from '#rsci/SelectInput';

import {
    Province,
    District,
    Municipality,
    Ward,
} from '#store/atom/page/types';
import { MultiResponse } from '#store/atom/response/types';

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

import Map from './Map';

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
    setNapTemperature?: (data: NapTemperatureData[]) => void;
    setNapPrecipitation?: (data: NapPrecipitationData[]) => void;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

interface State {
    temperature: NapTemperatureData[];
    precipitation: NapPrecipitationData[];
    timePeriodKey: string;
    measurementType: string;
}

interface NapTemperatureData {
    id: number;
    createdOn: string;
    modifiedOn: string;
    district: number;
    temperatureRcp45: object;
    sdRcp45: object;
    temperatureRcp85: object;
    sdRcp85: object;
}

interface NapPrecipitationData {
    id: number;
    createdOn: string;
    modifiedOn: string;
    district: number;
    precipitationRcp45: object;
    sdRcp45: object;
    precipitationRcp85: object;
    sdRcp85: object;
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
    { key: 'rcp-45', label: 'RCP 4.5' },
    { key: 'rcp-85', label: 'RCP 8.5' },
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
            const { results } = response as MultiResponse<NapTemperatureData>;
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
            const { results } = response as MultiResponse<NapPrecipitationData>;
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
            timePeriodKey: 'reference-period',
            measurementType: 'temeperature',
        };

        const {
            requests: {
                napTemperatureGetRequest,
                napPrecipitationGetRequest,
            },
        } = this.props;

        napTemperatureGetRequest.setDefaultParams({
            setNapTemperature: (data: NapTemperatureData[]) => {
                this.setState({
                    temperature: data,
                });
            },
        });

        napPrecipitationGetRequest.setDefaultParams({
            setNapPrecipitation: (data: NapPrecipitationData[]) => {
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

    private handleSetTimePeriod = (timePeriodKey: string) => {
        this.setState({
            timePeriodKey,
        });
    }

    private getFilteredTemperature = (temperature: NapTemperatureData[], timePeriodKey: string) => {
        const timePeriod = timePeriodOptions.find(option => option.key === timePeriodKey)
            || timePeriodOptions[0];
        const { startYear, endYear } = timePeriod;

        const data = temperature.map((temp) => {
            const { temperatureRcp45, sdRcp45, temperatureRcp85, sdRcp85 } = temp;
            const filter = (key: string) => (+key >= startYear && +key <= endYear);
            const filteredTemperatureRcp45 = Object.keys(temperatureRcp45).filter(filter);
            const filteredsdRcp45 = Object.keys(sdRcp45).filter(filter);
            const filteredTempereatureRcp85 = Object.keys(temperatureRcp85).filter(filter);
            const filteredsdRcp85 = Object.keys(sdRcp85).filter(filter);
            return ({
                ...temp,
                temperatureRcp45: filteredTemperatureRcp45,
                sdRcp45: filteredsdRcp45,
                temperatureRcp85: filteredTempereatureRcp85,
                sdRcp85: filteredsdRcp85,
            });
        });

        return data;
    }

    private getFilteredPrecipitation = memoize(
        (precipitation: NapPrecipitationData[], timePeriodKey: string) => {
            const timePeriod = timePeriodOptions.find(option => option.key === timePeriodKey)
                || timePeriodOptions[0];
            const { startYear, endYear } = timePeriod;

            const data = precipitation.map((rain) => {
                const { precipitationRcp45, sdRcp45, precipitationRcp85, sdRcp85 } = rain;
                const filter = (key: string) => (+key >= startYear && +key <= endYear);
                const filteredPrecipitationeRcp45 = Object.keys(precipitationRcp45).filter(filter);
                const filteredsdRcp45 = Object.keys(sdRcp45).filter(filter);
                const filteredPrecipitationRcp85 = Object.keys(precipitationRcp85).filter(filter);
                const filteredsdRcp85 = Object.keys(sdRcp85).filter(filter);
                return ({
                    ...rain,
                    precipitationRcp45: filteredPrecipitationeRcp45,
                    sdRcp45: filteredsdRcp45,
                    precipitationRcp85: filteredPrecipitationRcp85,
                    sdRcp85: filteredsdRcp85,
                });
            });
            return data;
        },
    );

    public render() {
        const {
            districts,
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
            temperature,
            precipitation,
            timePeriodKey,
            measurementType,
        } = this.state;

        const pending = precipitationPending || temperaturePending;
        const data = measurementType === 'temperature' ? this.getFilteredTemperature(temperature, timePeriodKey)
            : this.getFilteredPrecipitation(precipitation, timePeriodKey);

        return (
            <>
                <Loading pending={pending} />
                <Map
                    districts={districts}
                />
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
                            value="rcp-45"
                        />
                    </div>
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
