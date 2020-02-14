import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { extent } from 'd3-array';
import { _cs, mean, listToMap } from '@togglecorp/fujs';
import Switch from 'react-input-switch';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    Label,
    Tooltip,
    Legend,
} from 'recharts';

import RiskInfoLayerContext from '#components/RiskInfoLayerContext';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import { AppState } from '#store/types';
import SegmentInput from '#rsci/SegmentInput';
import SelectInput from '#rsci/SelectInput';

import { generatePaint } from '#utils/domain';

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

const tempColors: string[] = [
    '#31a354',
    '#93ce82',
    '#ddf1b3',
    '#fef6cb',
    '#f2b294',
    '#d7595d',
    '#bd0026',
];

const rainColors: string[] = [
    '#ffffcc',
    '#c7e4b9',
    '#7fcdbb',
    '#41b6c4',
    '#1d91c0',
    '#225ea8',
    '#0c2c84',
];

const ClimateChangeTooltip = ({ feature, layer }: { feature: unknown; layer: unknown }) => {
    const { properties: { title }, state: { value } } = feature;

    if (value) {
        const valueText = `${layer.scenarioName}: ${Number(value).toFixed(2)}`;

        return (
            <div className={styles.tooltip}>
                <div className={styles.label}>{title}</div>
                <div className={styles.value}>{valueText}</div>
            </div>
        );
    }

    return (
        <div className={styles.tooltip}>
            <div className={styles.title}>{title}</div>
        </div>
    );
};

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
    isActive: boolean;
    scenario: string;
    timePeriodKey: string;
    measurementType: MeasurementType;
}

interface TimePeriod {
    key: string;
    label: string;
    startYear: number;
    endYear: number;
}

interface MapState {
    id: number;
    value: number;
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
    axisLabel: string;
    chartTitle: string;
}[] = [
    {
        key: 'temperature',
        label: 'Temperature',
        axisLabel: 'Temperature (°C)',
        chartTitle: 'Ensemble Mean of Annual Temperature of Nepal',
    },
    {
        key: 'precipitation',
        label: 'Precipitation',
        axisLabel: 'Precipitation (mm/year)',
        chartTitle: 'Ensemble Mean of Annual Temperature of Nepal',
    },
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
            isActive: false,
            scenario: 'rcp45',
            timePeriodKey: 'reference-period',
            measurementType: 'temperature',
        };
    }

    private handleSetMeasurementType = (measurementType: MeasurementType) => {
        this.setState({
            measurementType,
        });
        const { addLayer } = this.context;
        const { timePeriodKey, scenario } = this.state;
        if (addLayer) {
            const layer = this.transformClimateChangeToLayer({
                timePeriodKey,
                scenario,
                measurementType,
            });
            addLayer(layer);
        }
    }

    private handleSetScenario =(scenario: string) => {
        this.setState({
            scenario,
        });
        const { timePeriodKey, measurementType } = this.state;
        const { addLayer } = this.context;
        if (addLayer) {
            const layer = this.transformClimateChangeToLayer({
                timePeriodKey,
                measurementType,
                scenario,
            });
            addLayer(layer);
        }
    }

    private handleSetTimePeriod = (timePeriodKey: string) => {
        this.setState({
            timePeriodKey,
        });
        const { addLayer } = this.context;
        const { scenario, measurementType } = this.state;
        if (addLayer) {
            const layer = this.transformClimateChangeToLayer({
                scenario,
                measurementType,
                timePeriodKey,
            });
            addLayer(layer);
        }
    }

    private getChartData = (measurementType: string) => {
        const {
            requests,
        } = this.props;

        const temperature = getResults(requests, 'napTemperatureGetRequest') as NapData[];
        const precipitation = getResults(requests, 'napPrecipitationGetRequest') as NapData[];

        const data = measurementType === 'temperature' ? temperature : precipitation;
        const yearlyAverageData = data.map(({ rcp45, sdRcp45, rcp85, sdRcp85 }) => {
            const mapSdRcp45 = listToMap(sdRcp45, d => d.year, d => d.value);
            const mapRcp85 = listToMap(rcp85, d => d.year, d => d.value);
            const mapSdRcp85 = listToMap(sdRcp85, d => d.year, d => d.value);
            const yearWiseData = rcp45.map(({ year, value }) => ({
                year,
                rcp45: [value || 0],
                sdRcp45: [mapSdRcp45[year] || 0],
                rcp85: [mapRcp85[year] || 0],
                sdRcp85: [mapSdRcp85[year] || 0],
            }));
            return yearWiseData;
        }).reduce((acc, value) => {
            if (acc.length === 0) {
                acc.push(...value);
            } else {
                value.forEach((v) => {
                    const { year, rcp45, sdRcp45, rcp85, sdRcp85 } = v;
                    const yearlyValue = acc.find(y => y.year === year);
                    if (yearlyValue) {
                        yearlyValue.rcp45.push(...rcp45);
                        yearlyValue.sdRcp45.push(...sdRcp45);
                        yearlyValue.rcp85.push(...rcp85);
                        yearlyValue.sdRcp85.push(...sdRcp85);
                    } else {
                        acc.push(v);
                    }
                });
            }
            return acc;
        }, []).map(({ year, rcp45, sdRcp45, rcp85, sdRcp85 }) => {
            const rcp45Value = mean(rcp45);
            const rcp85Value = mean(rcp85);
            const sdRcp45Value = mean(sdRcp45);
            const sdRcp85Value = mean(sdRcp85);
            if (year < 2010) {
                return {
                    year,
                    'Reference Period': rcp45Value.toFixed(2),
                };
            }
            return {
                year,
                'RCP 4.5': rcp45Value.toFixed(2),
                'SD RCP 4.5': [
                    (rcp45Value - sdRcp45Value).toFixed(2),
                    (rcp45Value + sdRcp45Value).toFixed(2),
                ],
                'RCP 8.5': rcp85Value.toFixed(2),
                'SD RCP 8.5': [
                    (rcp85Value - sdRcp85Value).toFixed(2),
                    (rcp85Value + sdRcp85Value).toFixed(2),
                ],
            };
        });
        return yearlyAverageData;
    }

    private getMapState = (
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
        const {
            startYear: referenceStart,
            endYear: referenceEnd,
        } = timePeriodOptions.find(option => option.key === 'reference-period')
         || timePeriodOptions[0];

        const filter = ({ year }: NapValue) => (year >= startYear && year <= endYear);
        const referenceFilter = ({ year }: NapValue) => (
            year >= referenceStart && year <= referenceEnd
        );

        const filteredData = napData.map((data) => {
            const {
                district,
                rcp45,
                rcp85,
            } = data;

            const itemList = (scenario === 'rcp45') ? rcp45 : rcp85;
            const filteredItemList = itemList.filter(filter);
            const referenceItemList = itemList.filter(referenceFilter);

            if (timePeriodKey === 'reference-period') {
                return ({
                    id: district,
                    value: mean(filteredItemList.map(v => v.value)),
                });
            }

            const referenceAverage = mean(referenceItemList.map(v => v.value));
            const filteredAverage = mean(filteredItemList.map(v => v.value));

            return ({
                id: district,
                value: filteredAverage - referenceAverage,
            });
        });

        return filteredData;
    }

    private transformClimateChangeToLayer = ({
        timePeriodKey,
        measurementType,
        scenario,
    }: Omit<State, 'isActive'>) => {
        const {
            requests,
        } = this.props;

        const temperature = getResults(requests, 'napTemperatureGetRequest') as NapData[];
        const precipitation = getResults(requests, 'napPrecipitationGetRequest') as NapData[];
        const mapState = this.getMapState(
            temperature,
            precipitation,
            scenario,
            measurementType,
            timePeriodKey,
        );

        const [min, max] = extent(mapState, (d: MapState) => d.value);
        const colors = measurementType === 'temperature' ? tempColors : rainColors;
        const { paint, legend } = generatePaint(colors, min || 0, max || 0);
        const { label: scenarioName } = scenarioOptions.find(v => v.key === scenario) || {};
        return {
            id: 'climate-change-risk-info',
            title: `Climate change / ${measurementType}`,
            type: 'choropleth',
            adminLevel: 'district',
            layername: 'Climate change risk',
            opacity: 1,
            mapState,
            paint,
            legend,
            scenarioName,
            tooltipRenderer: ClimateChangeTooltip,
        };
    };

    private handleChange = (value: boolean) => {
        const {
            addLayer,
            removeLayer,
        } = this.context;

        this.setState({
            isActive: value,
        });

        const {
            timePeriodKey,
            measurementType,
            scenario,
        } = this.state;

        const layer = this.transformClimateChangeToLayer({
            timePeriodKey,
            measurementType,
            scenario,
        });
        if (value) {
            addLayer(layer);
        } else {
            removeLayer(layer.id);
        }
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
            isActive,
        } = this.state;

        const pending = isAnyRequestPending(requests);
        const data = this.getChartData(measurementType);
        const selectedOption = measurementOptions.find(m => m.key === measurementType);
        const yAxisLabel = selectedOption && selectedOption.axisLabel;
        const chartTitle = selectedOption && selectedOption.chartTitle;

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.climateChange, className)}>
                    <div className={styles.header}>
                        <Switch
                            disabled={pending}
                            className={styles.switch}
                            on
                            off={false}
                            value={isActive}
                            onChange={this.handleChange}
                        />
                        <div className={styles.title}>
                            Climate change
                        </div>
                    </div>
                    <div className={styles.top}>
                        <SegmentInput
                            className={styles.measurementTypeInput}
                            label="Measurement"
                            disabled={pending || !isActive}
                            options={measurementOptions}
                            value={measurementType}
                            onChange={this.handleSetMeasurementType}
                        />
                        <SelectInput
                            className={styles.timePeriodInput}
                            label="Time period"
                            disabled={pending || !isActive}
                            options={timePeriodOptions}
                            value={timePeriodKey}
                            onChange={this.handleSetTimePeriod}
                            hideClearButton
                        />
                        <SegmentInput
                            className={styles.scenarioInput}
                            label="Scenario"
                            disabled={pending || !isActive}
                            options={scenarioOptions}
                            value={scenario}
                            onChange={this.handleSetScenario}
                        />
                    </div>
                    { !pending && (
                        <div className={styles.bottom}>
                            <div className={styles.header}>
                                {chartTitle}
                            </div>
                            <ResponsiveContainer className={styles.chart}>
                                <ComposedChart
                                    data={data}
                                    margin={{
                                        top: 15,
                                        right: 5,
                                        left: 5,
                                        bottom: 15,
                                    }}
                                >
                                    <XAxis
                                        dataKey="year"
                                        type="number"
                                        scale="time"
                                        domain={['dataMin', 'dataMax']}
                                    >
                                        <Label
                                            value="year"
                                            offset={-5}
                                            position="insideBottom"
                                        />
                                    </XAxis>
                                    <YAxis
                                        type="number"
                                        domain={['auto', 'auto']}
                                        allowDecimals={false}
                                        padding={{ top: 5, bottom: 0 }}
                                    >
                                        <Label
                                            value={yAxisLabel}
                                            angle={270}
                                            offset={-10}
                                            position="left"
                                            style={{ textAnchor: 'middle' }}
                                        />
                                    </YAxis>
                                    <Tooltip
                                        labelFormatter={value => `year: ${value}`}
                                    />
                                    <Legend verticalAlign="top" />
                                    <Area
                                        dataKey="SD RCP 8.5"
                                        fill="#f45b5b"
                                        fillOpacity={0.3}
                                        stroke="none"
                                        legendType="square"
                                    />
                                    <Area
                                        dataKey="SD RCP 4.5"
                                        fill="#7cb5ec"
                                        fillOpacity={0.3}
                                        stroke="none"
                                        legendType="square"
                                    />
                                    <Line
                                        strokeWidth={2}
                                        type="monotone"
                                        dataKey="Reference Period"
                                        stroke="#434348"
                                        dot={false}
                                    />
                                    <Line
                                        strokeWidth={2}
                                        type="monotone"
                                        dataKey="RCP 8.5"
                                        stroke="#e41a1c"
                                        dot={false}
                                    />
                                    <Line
                                        strokeWidth={2}
                                        type="monotone"
                                        dataKey="RCP 4.5"
                                        stroke="#1f78b4"
                                        dot={false}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

ClimateChange.contextType = RiskInfoLayerContext;
export default compose(
    connect(mapStateToProps),
    createRequestClient(requestOptions),
)(ClimateChange);
