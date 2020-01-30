import React from 'react';
import {
    _cs,
    listToMap,
} from '@togglecorp/fujs';
import { extent } from 'd3-array';
import RangeInput from 'react-input-range';
import rangeInputDefaultClassNames from 'react-input-range/src/js/input-range/default-class-names';
import memoize from 'memoize-one';

import {
    methods,
    NewProps,
    ClientAttributes,
    createRequestClient,
} from '@togglecorp/react-rest-request';

import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';

import LayerSelectionItem from '#components/LayerSelectionItem';
import Loading from '#components/Loading';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';

import DataTableModal from './DataTableModal';
// import Map from './Map';

import { LayerWithGroup, LayerGroup } from '#store/atom/page/types';
import { RiskData } from '#types';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import { generatePaint } from '#utils/domain';

import styles from './styles.scss';

const DataTableModalButton = modalize(Button);


interface OwnProps {
    className?: string;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
}
interface Params {
}

interface State {
    metricValues: {};
    showOpacitySettings: boolean;
    showMetricSettings: boolean;
    opacityValue: number;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params>} = {
    riskGetRequest: {
        url: '/earthquake-riskscore/',
        method: methods.GET,
        onMount: true,
        onSuccess: ({ params, response }) => {
            if (params.onSuccess) {
                params.onSuccess(response);
            }
        },
    },
};

type Props = NewProps<OwnProps, Params>

const metrices = {
    hdiScore: 'HDI',
    maxScore: 'Maximum fatalities',
    medScore: 'Median fatalities',
    remoteScore: 'Remoteness',
    specificityScore: 'Specificity',
    pctScore: 'Frequency',
};

const metricKeys = Object.keys(metrices);

const colorGrade = [
    '#ffe1ca',
    '#f7cbac',
    '#eeb590',
    '#e69e76',
    '#dc875e',
    '#d37047',
    '#c95733',
    '#be3b20',
    '#b31010',
];

const RiskTooltipOutput = ({ label, value }) => (
    <div className={styles.riskTooltipOutput}>
        <div className={styles.label}>
            { label }
        </div>
        <div className={styles.value}>
            { value }
        </div>
    </div>
);

const RiskTooltip = ({ layer, feature }) => (
    <div className={styles.riskTooltip}>
        <h3 className={styles.heading}>
            { feature.properties.title }
        </h3>
        <div className={styles.content}>
            <RiskTooltipOutput
                label="Risk score:"
                value={feature.state.value}
            />
            <RiskTooltipOutput
                label="Rank:"
                value={layer.rankMap[feature.id]}
            />
        </div>
    </div>
);

const getRankMap = memoize(data => (
    listToMap(data, d => d.district, d => d.rank)
));

const transformRiskDataToLayer = (data: RiskData[]) => {
    const mapState = data.map(d => ({
        id: d.district,
        value: d.data.riskScore,
    }));

    const [min, max] = extent(mapState, d => d.value);
    const paint = generatePaint(colorGrade, min || 0, max || 0);

    return {
        id: 'durham-earthquake-risk',
        title: 'Durham earthquake risk',
        type: 'choropleth',
        adminLevel: 'district',
        layername: 'Durham earthquake risk',
        opacity: 1,
        mapState,
        paint,
        tooltipRenderer: RiskTooltip,
        rankMap: getRankMap(data),
    };
};

class Risk extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            metricValues: {
                hdiScore: 1,
                maxScore: 1,
                medScore: 1,
                remoteScore: 1,
                specificityScore: 1,
                pctScore: 1,
            },
            showOpacitySettings: false,
            showMetricSettings: false,
            opacityValue: 1,
        };

        props.requests.riskGetRequest.setDefaultParams({
            onSuccess: this.handleRiskGetRequestSuccess,
        });
    }

    private handleRiskGetRequestSuccess = (response) => {
        const { addLayer } = this.context;
        const { metricValues } = this.state;
        const riskData = this.getRiskData(response.results, metricValues);
        const riskLayer = transformRiskDataToLayer(riskData);

        if (addLayer) {
            addLayer(riskLayer);
        }
    }

    private handleMetricSliderChange = (key, value) => {
        const { addLayer } = this.context;
        const { requests } = this.props;
        const { metricValues } = this.state;

        const newMetricValues = { ...metricValues };
        newMetricValues[key] = value;
        this.setState({ metricValues: newMetricValues });

        const riskDataRaw = getResults(requests, 'riskGetRequest') as RiskData[];
        const riskData = this.getRiskData(riskDataRaw, newMetricValues);
        const riskLayer = transformRiskDataToLayer(riskData);

        if (addLayer) {
            addLayer(riskLayer);
        }
    }

    private getRiskData = (riskDataRaw, metricScores) => {
        const riskScoreData = riskDataRaw.map((rd) => {
            let riskScore = 0;
            let totalWeight = 0;

            metricKeys.forEach((m) => {
                riskScore += (rd.data[m] || 0) * metricScores[m];
                totalWeight += metricScores[m];
            });

            if (totalWeight === 0) {
                totalWeight = 1;
            }

            return {
                data: { riskScore: metricKeys.length * riskScore / totalWeight },
                district: rd.district,
                rank: rd.data.rank,
            };
        });

        return riskScoreData;
    }

    private handleShowOpacityButtonClick = () => {
        this.setState(({ showOpacitySettings: prevValue }) => ({
            showOpacitySettings: !prevValue,
            showMetricSettings: false,
        }));
    }

    private handleShowMetricsButtonClick = () => {
        this.setState(({ showMetricSettings: prevValue }) => ({
            showOpacitySettings: false,
            showMetricSettings: !prevValue,
        }));
    }

    public render() {
        const {
            className,
            requests,
        } = this.props;

        const {
            showMetricSettings,
            showOpacitySettings,
            opacityValue,
        } = this.state;

        const pending = isAnyRequestPending(requests);
        const riskDataRaw = getResults(requests, 'riskGetRequest') as RiskData[];
        const riskData = this.getRiskData(riskDataRaw, this.state.metricValues);
        const riskLayer = transformRiskDataToLayer(riskData);

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.risk, className)}>
                    <header className={styles.header}>
                        <h2 className={styles.heading}>
                            Layers
                        </h2>
                    </header>
                    <div className={styles.content}>
                        <LayerSelectionItem data={riskLayer} />
                        <div className={styles.description}>
                            The map represents the spatial distribution of total
                            relative seismic risk for Nepal. The data is calculated
                            as a normalized sum of six different risk metrics:

                            <div className={styles.metric}>
                                a) Percentage of scenarios with at least one fatality
                            </div>
                            <div className={styles.metric}>
                                b) Median fatalities for all scenarios that cause fatalities
                            </div>
                            <div className={styles.metric}>
                                c) Maximum fatalities
                            </div>
                            <div className={styles.metric}>
                                d) Specificity of fatalities for all scenarios that cause fatalities
                            </div>
                            <div className={styles.metric}>
                                e) Remoteness score
                            </div>
                            <div className={styles.metric}>
                                f) HDI
                            </div>
                            All data are the property of Durham University.
                        </div>
                        <div className={styles.options}>
                            <div className={styles.actions}>
                                <Button
                                    iconName="info"
                                    transparent
                                    className={styles.optionButton}
                                    disabled
                                />
                                <DataTableModalButton
                                    modal={<DataTableModal data={riskDataRaw} />}
                                    initialShowModal={false}
                                    iconName="table"
                                    transparent
                                    className={styles.optionButton}
                                />
                                <Button
                                    iconName="contrast"
                                    disabled
                                    onClick={this.handleShowOpacityButtonClick}
                                    transparent
                                    className={_cs(
                                        showOpacitySettings && styles.active,
                                        styles.optionButton,
                                    )}
                                />
                                <Button
                                    iconName="settings"
                                    onClick={this.handleShowMetricsButtonClick}
                                    transparent
                                    className={_cs(
                                        showMetricSettings && styles.active,
                                        styles.optionButton,
                                    )}
                                />
                            </div>
                            { showMetricSettings && (
                                <div className={styles.metricSettings}>
                                    {metricKeys.map(m => (
                                        <div
                                            key={m}
                                            className={styles.metricInput}
                                        >
                                            <div className={styles.label}>
                                                { metrices[m] }
                                            </div>
                                            <RangeInput
                                                classNames={{
                                                    ...rangeInputDefaultClassNames,
                                                    minLabel: styles.minLabel,
                                                    maxLabel: styles.maxLabel,
                                                    valueLabel: styles.valueLabel,
                                                    inputRange: _cs(
                                                        rangeInputDefaultClassNames.inputRange,
                                                        styles.rangeInput,
                                                    ),
                                                }}
                                                minValue={0}
                                                maxValue={5}
                                                step={1}
                                                value={this.state.metricValues[m]}
                                                onChange={(value) => {
                                                    this.handleMetricSliderChange(m, value);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            { showOpacitySettings && (
                                <div className={styles.opacitySettings}>
                                    <RangeInput
                                        minValue={0}
                                        maxValue={1}
                                        step={0.01}
                                        value={opacityValue}
                                        onChange={this.handleOpacityInputChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

Risk.contextType = RiskInfoLayerContext;
export default createRequestClient(requestOptions)(Risk);
