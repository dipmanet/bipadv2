import React from 'react';
import { extent } from 'd3-array';
import memoize from 'memoize-one';
import { _cs, mean, listToMap, doesObjectHaveNoData } from '@togglecorp/fujs';
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
import LayerDetailModalButton from '#components/LayerDetailModalButton';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import SegmentInput from '#rsci/SegmentInput';
import SelectInput from '#rsci/SelectInput';
import Icon from '#rscg/Icon';

import { generatePaint } from '#utils/domain';
import { saveChart } from '#utils/common';

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

import ClimateChangeTable from './ClimateChangeTable';

import styles from './styles.scss';

const DataTableModalButton = modalize(Button);

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
    const {
        properties: { title },
        state: { value },
    } = feature;

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

interface Params {
}

type Props = NewProps<OwnProps, Params>;

type MeasurementType = 'temperature' | 'precipitation';

interface State {
    isActive: boolean;
    scenario: string;
    timePeriodKey: string;
    selectedDistrictName?: string;
    selectedDistrict?: number;
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

const measurementOptions: {
    key: MeasurementType;
    label: 'Temperature' | 'Precipitation';
    legendTitle: string;
    axisLabel: string;
    chartTitle: string;
}[] = [
    {
        key: 'temperature',
        label: 'Temperature',
        axisLabel: 'Temperature (°C)',
        legendTitle: 'Temperature (°C)',
        chartTitle: 'Ensemble Mean of Annual Temperature of',
    },
    {
        key: 'precipitation',
        label: 'Precipitation',
        axisLabel: 'Precipitation (mm/year)',
        legendTitle: 'Precipitation (mm/year)',
        chartTitle: 'Ensemble Mean of Annual Temperature of',
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

const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params>} = {
    napTemperatureGetRequest: {
        url: '/nap-temperature/?region=district',
        method: methods.GET,
        onMount: true,
    },
    napNationalTemperatureGetRequest: {
        url: '/nap-temperature/?region=national',
        method: methods.GET,
        onMount: true,
    },
    napNationalPrecipitationGetRequest: {
        url: '/nap-precipitation/?region=national',
        method: methods.GET,
        onMount: true,
    },
    napPrecipitationGetRequest: {
        url: '/nap-precipitation/?region=district',
        method: methods.GET,
        onMount: true,
    },
    napTemperatureMetadataGetRequest: {
        url: '/metadata/5/',
        method: methods.GET,
        onMount: true,
    },
    napPrecipitationMetadataGetRequest: {
        url: '/metadata/4/',
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
            selectedDistrictName: undefined,
            selectedDistrict: undefined,
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

    private getLayer = memoize((layerGroupList, measurementType) => {
        const climateChange = layerGroupList[0];
        const temperature = layerGroupList[1];
        const precipitation = layerGroupList[2];

        if (!climateChange || !temperature || !precipitation) {
            return {};
        }

        const metadata = measurementType === 'temperature' ? temperature.metadata : precipitation.metadata;

        return {
            shortDescription: climateChange.shortDescription,
            longDescription: climateChange.longDescription,
            metadata,
        };
    })

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

    private getChartData = (measurementType: string, district?: number) => {
        const {
            requests,
        } = this.props;

        const nationalTemperature = getResults(requests, 'napNationalTemperatureGetRequest') as NapData[];
        const nationalPrecipitation = getResults(requests, 'napNationalPrecipitationGetRequest') as NapData[];
        let data = measurementType === 'temperature' ? nationalTemperature : nationalPrecipitation;
        if (district) {
            const districtTemperature = getResults(requests, 'napTemperatureGetRequest') as NapData[];
            const districtPrecipitation = getResults(requests, 'napPrecipitationGetRequest') as NapData[];
            const selectedData = measurementType === 'temperature' ? districtTemperature : districtPrecipitation;
            data = selectedData.filter(d => d.district === district);
        }

        if (doesObjectHaveNoData(data)) {
            return undefined;
        }

        const { rcp45, sdRcp45, rcp85, sdRcp85 } = data[0];
        const mapSdRcp45 = listToMap(sdRcp45, d => d.year, d => d.value);
        const mapRcp85 = listToMap(rcp85, d => d.year, d => d.value);
        const mapSdRcp85 = listToMap(sdRcp85, d => d.year, d => d.value);
        const yearWiseData = rcp45.map(({ year, value }) => ({
            year,
            rcp45Value: value || 0,
            sdRcp45Value: mapSdRcp45[year] || 0,
            rcp85Value: mapRcp85[year] || 0,
            sdRcp85Value: mapSdRcp85[year] || 0,
        })).map(({ year, rcp45Value, sdRcp45Value, rcp85Value, sdRcp85Value }) => {
            if (year < 2010) {
                return {
                    year,
                    'Reference Period': Number(rcp45Value.toFixed(2)),
                };
            }

            return {
                year,
                'RCP 4.5': Number(rcp45Value.toFixed(2)),
                'SD RCP 4.5': [
                    Number((rcp45Value - sdRcp45Value).toFixed(2)),
                    Number((rcp45Value + sdRcp45Value).toFixed(2)),
                ],
                'RCP 8.5': Number(rcp85Value.toFixed(2)),
                'SD RCP 8.5': [
                    Number((rcp85Value - sdRcp85Value).toFixed(2)),
                    Number((rcp85Value + sdRcp85Value).toFixed(2)),
                ],
            };
        });

        return yearWiseData;
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
                    value: mean(filteredItemList.map(v => +v.value || 0)),
                });
            }

            const referenceAverage = mean(referenceItemList.map(v => +v.value || 0));
            const filteredAverage = mean(filteredItemList.map(v => +v.value || 0));

            return ({
                id: district,
                value: measurementType === 'temperature' && timePeriodKey !== 'reference-period'
                    ? (filteredAverage - referenceAverage)
                    : (100 * (filteredAverage - referenceAverage) / referenceAverage),
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

        const pending = isAnyRequestPending(requests);
        const temperature = getResults(requests, 'napTemperatureGetRequest') as NapData[];
        const precipitation = getResults(requests, 'napPrecipitationGetRequest') as NapData[];
        const mapState = this.getMapState(
            temperature,
            precipitation,
            scenario,
            measurementType,
            timePeriodKey,
        );

        const selectedMeasurement = measurementOptions.find(m => m.key === measurementType);
        const selectedScenario = scenarioOptions.find(s => s.key === scenario);
        const selectedTimePeriod = timePeriodOptions.find(t => t.key === timePeriodKey);

        let precipitationChangeInPercent = false;
        if (selectedMeasurement && selectedTimePeriod) {
            precipitationChangeInPercent = selectedMeasurement.key === 'precipitation' && selectedTimePeriod.key !== 'reference-period';
        }

        let temperatureChangeInPercent = false;
        if (selectedMeasurement && selectedTimePeriod) {
            temperatureChangeInPercent = selectedMeasurement.key === 'temperature' && selectedTimePeriod.key !== 'reference-period';
        }

        const legendTitle = `
            ${precipitationChangeInPercent ? 'Precipitation change (%) / ' : ''}
            ${temperatureChangeInPercent ? 'Temperature change (%) / ' : ''}
            ${(!precipitationChangeInPercent && !temperatureChangeInPercent && selectedMeasurement) ? selectedMeasurement.legendTitle : ''}
             ${selectedTimePeriod ? selectedTimePeriod.label : ''}
            [${selectedScenario ? selectedScenario.label : ''}]
        `;
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
            legendTitle,
            scenarioName,
            tooltipRenderer: ClimateChangeTooltip,
            minValue: min,
            onClick: this.handleClick,
        };
    };

    private handleClick = (feature: unknown) => {
        const { id, properties: { title } } = feature;
        const {
            requests,
        } = this.props;
        console.log('district', feature);
        this.setState({
            selectedDistrictName: title,
            selectedDistrict: id,
        });
    }

    private handleDistrictUnselect = () => {
        const { setClimateChangeSelectedDistrict } = this.context;
        setClimateChangeSelectedDistrict({ id: undefined, properties: { title: undefined } });

        this.setState({
            selectedDistrictName: undefined,
            selectedDistrict: undefined,
        });
    }

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

    private handleSaveClick = () => {
        saveChart('climateChange', 'climateChange');
    }

    private getFlatData = (data: NapData[]) => {
        const flatData = data.map((item) => {
            const { district, rcp45, sdRcp45, rcp85, sdRcp85 } = item;

            const rcp45Map = listToMap(rcp45, d => d.year);
            const sdRcp45Map = listToMap(sdRcp45, d => d.year);
            const rcp85Map = listToMap(rcp85, d => d.year);
            const sdRcp85Map = listToMap(sdRcp85, d => d.year);

            const years = Object.keys(rcp45Map);
            return years.map(year => ({
                year,
                district,
                rcp45: rcp45Map[year].value,
                sdRcp45: sdRcp45Map[year].value,
                rcp85: rcp85Map[year].value,
                sdRcp85: sdRcp85Map[year].value,
            }));
        });

        return flatData.flat();
    }

    public render() {
        const {
            className,
            requests,
            layerGroupList,
        } = this.props;

        const {
            timePeriodKey,
            measurementType,
            selectedDistrictName,
            selectedDistrict,
            scenario,
            isActive,
        } = this.state;
        const { climateChangeSelectedDistrict } = this.context;


        const temperature = getResults(requests, 'napTemperatureGetRequest') as NapData[];
        const precipitation = getResults(requests, 'napPrecipitationGetRequest') as NapData[];
        const pending = isAnyRequestPending(requests);

        const selectedOption = measurementOptions.find(m => m.key === measurementType);
        const yAxisLabel = selectedOption && selectedOption.axisLabel;
        const chartName = climateChangeSelectedDistrict.title || 'Nepal';
        const chartTitle = selectedOption && `${selectedOption.chartTitle} ${chartName}`;
        const chartData = this.getChartData(measurementType, climateChangeSelectedDistrict.id);

        const rawData = measurementType === 'temperature' ? temperature : precipitation;
        const flatData = this.getFlatData(rawData);
        const layer = this.getLayer(layerGroupList, measurementType);


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
                        {!pending && (
                            <>
                                <DataTableModalButton
                                    className={styles.showDataTableButton}
                                    modal={(
                                        <ClimateChangeTable
                                            data={flatData}
                                            title={measurementType}
                                        />
                                    )}
                                    initialShowModal={false}
                                    iconName="table"
                                    transparent
                                    disabled={pending}
                                />
                                <LayerDetailModalButton
                                    className={styles.showLayerDetailsButton}
                                    layer={layer}
                                />
                            </>
                        )}
                    </div>
                    <div className={styles.shortDescription}>
                        { layer.shortDescription }
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
                    <div className={styles.externalLinks}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Links from Climate Scenarios from Nepal (NAP)
                            </h4>
                        </header>
                        <div className={styles.content}>
                            <a
                                className={styles.externalLink}
                                rel="noopener noreferrer"
                                target="_blank"
                                href="http://rds.icimod.org/Home/DataDetail?metadataId=36003"
                            >
                                <Icon
                                    className={styles.icon}
                                    name="externalLink"
                                />
                                <div className={styles.text}>
                                    Temperature data
                                </div>
                            </a>
                            <a
                                className={styles.externalLink}
                                rel="noopener noreferrer"
                                target="_blank"
                                href="http://rds.icimod.org/Home/DataDetail?metadataId=36002"
                            >
                                <Icon
                                    className={styles.icon}
                                    name="externalLink"
                                />
                                <div className={styles.text}>
                                    Precipitation data
                                </div>
                            </a>
                        </div>
                    </div>
                    { !pending && isActive && (
                        <div
                            className={styles.bottom}
                            id="climateChange"
                        >
                            <div className={styles.heading}>
                                <div className={styles.header}>
                                    {chartTitle}
                                </div>
                                { climateChangeSelectedDistrict.id && (
                                    <Button
                                        className={styles.button}
                                        onClick={this.handleDistrictUnselect}
                                        transparent
                                    >
                                        Show National Data
                                    </Button>
                                )}
                                <Button
                                    title="Download Chart"
                                    transparent
                                    onClick={this.handleSaveClick}
                                    iconName="download"
                                />
                            </div>
                            <ResponsiveContainer className={styles.chart}>
                                <ComposedChart
                                    data={chartData}
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
                                        angle={-30}
                                    >
                                        <Label
                                            value="Year"
                                            offset={-5}
                                            position="insideBottom"
                                        />
                                    </XAxis>
                                    <YAxis
                                        type="number"
                                        domain={['auto', 'auto']}
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
                                        labelFormatter={value => `Year: ${value}`}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        wrapperStyle={{
                                            marginTop: '-16px',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="SD RCP 8.5"
                                        fill="#f45b5b"
                                        fillOpacity={0.3}
                                        stroke="none"
                                        legendType="square"
                                    />
                                    <Area
                                        type="monotone"
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
export default createRequestClient(requestOptions)(ClimateChange);
