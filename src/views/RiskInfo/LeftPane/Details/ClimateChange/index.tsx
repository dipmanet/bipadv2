import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { extent } from 'd3-array';
import { _cs, mean } from '@togglecorp/fujs';
import Switch from 'react-input-switch';

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

const Tooltip = ({ feature, layer }: { feature: unknown; layer: unknown }) => {
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
            tooltipRenderer: Tooltip,
        };
    };

    private handleChange = (value: boolean) => {
        const {
            addLayer,
            removeLayer,
        } = this.context;

        console.warn('value', value);
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
