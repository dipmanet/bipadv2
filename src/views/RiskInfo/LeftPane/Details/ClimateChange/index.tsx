import React from 'react';
import memoize from 'memoize-one';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs, mean, isDefined, isNotDefined } from '@togglecorp/fujs';

import { extent } from 'd3-array';
import { AppState } from '#store/types';
import SegmentInput from '#rsci/SegmentInput';
import SelectInput from '#rsci/SelectInput';
import ChoroplethMap from '#components/ChoroplethMap';

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
    scenario: string;
    temperature: NapTemperatureData[];
    precipitation: NapPrecipitationData[];
    timePeriodKey: string;
    measurementType: string;
}

interface Values {
    [key: string]: number | undefined | null;
}

interface MapState {
    id: number;
    value: {
        value: number;
    };
}

interface NapTemperatureData {
    id: number;
    createdOn: string;
    modifiedOn: string;
    district: number;
    temperatureRcp45: Values;
    sdRcp45: Values;
    temperatureRcp85: Values;
    sdRcp85: Values;
}

interface NapPrecipitationData {
    id: number;
    createdOn: string;
    modifiedOn: string;
    district: number;
    precipitationRcp45: Values;
    sdRcp45: Values;
    precipitationRcp85: Values;
    sdRcp85: Values;
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

const tempColors: string[] = [
    '#fef0d9',
    '#fdd49e',
    '#fdbb84',
    '#fc8d59',
    '#ef6548',
    '#d7301f',
    '#990000',
];

const rainColors: string[] = [
    '#f0f9e8',
    '#ccebc5',
    '#a8ddb5',
    '#7bccc4',
    '#4eb3d3',
    '#2b8cbe',
    '#08589e',
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
            scenario: 'rcp-45',
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

    private getFilteredTemperature = (temperature: NapTemperatureData[], timePeriodKey: string) => {
        const timePeriod = timePeriodOptions.find(option => option.key === timePeriodKey)
                        || timePeriodOptions[0];
        const { startYear, endYear } = timePeriod;

        const data = temperature.map((temp) => {
            const { district, temperatureRcp45, sdRcp45, temperatureRcp85, sdRcp85 } = temp;
            const filter = (key: string) => (+key >= startYear && +key <= endYear);
            const filteredTemperatureRcp45 = Object.keys(temperatureRcp45)
                .filter(filter)
                .map(value => temperatureRcp45[value]);
            const filteredsdRcp45 = Object.keys(sdRcp45)
                .filter(filter)
                .map(value => sdRcp45[value]);
            const filteredTempereatureRcp85 = Object.keys(temperatureRcp85)
                .filter(filter)
                .map(value => temperatureRcp85[value]);
            const filteredsdRcp85 = Object.keys(sdRcp85)
                .filter(filter)
                .map(value => sdRcp85[value]);
            return ({
                district,
                temperatureRcp45: filteredTemperatureRcp45,
                sdRcp45: filteredsdRcp45,
                temperatureRcp85: filteredTempereatureRcp85,
                sdRcp85: filteredsdRcp85,
            });
        });

        return data;
    }

    private getFilteredPrecipitation = (
        precipitation: NapPrecipitationData[],
        timePeriodKey: string,
    ) => {
        const timePeriod = timePeriodOptions.find(option => option.key === timePeriodKey)
                        || timePeriodOptions[0];
        const { startYear, endYear } = timePeriod;

        const data = precipitation.map((rain) => {
            const { district, precipitationRcp45, sdRcp45, precipitationRcp85, sdRcp85 } = rain;
            const filter = (key: string) => (+key >= startYear && +key <= endYear);
            const filteredPrecipitationeRcp45 = Object.keys(precipitationRcp45)
                .filter(filter)
                .map(value => precipitationRcp45[value]);
            const filteredsdRcp45 = Object.keys(sdRcp45)
                .filter(filter)
                .map(value => sdRcp45[value]);
            const filteredPrecipitationRcp85 = Object.keys(precipitationRcp85)
                .filter(filter)
                .map(value => precipitationRcp85[value]);
            const filteredsdRcp85 = Object.keys(sdRcp85)
                .filter(filter)
                .map(value => sdRcp85[value]);

            return ({
                district,
                precipitationRcp45: filteredPrecipitationeRcp45,
                sdRcp45: filteredsdRcp45,
                precipitationRcp85: filteredPrecipitationRcp85,
                sdRcp85: filteredsdRcp85,
            });
        });
        return data;
    };

    private getTemperatureMapState = (
        temperature: NapTemperatureData[],
        scenario: string,
        timePeriodKey: string,
    ) => {
        const filteredTemeperature = this.getFilteredTemperature(temperature, timePeriodKey);
        const values = filteredTemeperature.map((temp) => {
            const { district, temperatureRcp45, temperatureRcp85 } = temp;
            const value = scenario === 'rcp-45' ? temperatureRcp45 : temperatureRcp85;
            const avgValue = mean(value.filter(isDefined));

            return {
                id: district,
                value: {
                    value: avgValue,
                },
            };
        });

        return values;
    }

    private getPrecipitationMapState = (
        precipitation: NapPrecipitationData[],
        scenario: string,
        timePeriodKey: string,
    ) => {
        const filteredPrecipitation = this.getFilteredPrecipitation(precipitation, timePeriodKey);
        const values = filteredPrecipitation.map((rain) => {
            const { district, precipitationRcp45, precipitationRcp85 } = rain;
            const value = scenario === 'rcp-45' ? precipitationRcp45 : precipitationRcp85;
            const avgValue = mean(value.filter(isDefined));

            return {
                id: district,
                value: {
                    value: avgValue,
                },
            };
        });

        return values;
    }

    private generateColor = (maxValue: number, minValue: number, colorMapping: string[]) => {
        const newColor: (string | number)[] = [];
        const { length } = colorMapping;
        const range = maxValue - minValue;

        if (isNotDefined(maxValue) || isNotDefined(minValue) || maxValue === minValue) {
            return [];
        }

        colorMapping.forEach((color, i) => {
            const val = minValue + ((i * range) / (length - 1));
            newColor.push(val);
            newColor.push(color);
        });
        return newColor;
    };

    private generatePaint = memoize((color: (string|number)[]) => {
        if (color.length <= 0) {
            return {
                'fill-color': '#ccebc5',
            };
        }
        return {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['feature-state', 'value'],
                ...color,
            ],
        };
    })

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
            scenario,
        } = this.state;

        const pending = precipitationPending || temperaturePending;

        const mapState: MapState[] = measurementType === 'temperature'
            ? this.getTemperatureMapState(temperature, scenario, timePeriodKey)
            : this.getPrecipitationMapState(precipitation, scenario, timePeriodKey);

        const [min, max] = extent(mapState, (d: MapState) => d.value.value);

        const colorGrade = measurementType === 'temperature'
            ? tempColors : rainColors;

        const color = this.generateColor(max, min, colorGrade);
        const colorPaint = this.generatePaint(color);

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
                    <ChoroplethMap
                        paint={colorPaint}
                        mapState={mapState}
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
