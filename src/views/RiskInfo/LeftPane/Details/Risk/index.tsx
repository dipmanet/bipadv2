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
import LayerDetailModalButton from '#components/LayerDetailModalButton';

import DataTableModal from './DataTableModal';

import { LayerWithGroup, LayerGroup } from '#store/atom/page/types';
import { RiskData } from '#types';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import { generatePaint } from '#utils/domain';

import metadata from './metadata.json';
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

const transformRiskDataToLayer = (data: RiskData[], layer = {}, actions) => {
    const mapState = data.map(d => ({
        id: d.district,
        value: d.data.riskScore,
    }));

    const layerGroup = layer.group || {};

    const [min, max] = extent(mapState, d => d.value);
    const { paint, legend } = generatePaint(colorGrade, min || 0, max || 0);

    return {
        longDescription: layerGroup.longDescription,
        metadata: layerGroup.metadata,
        id: 'durham-earthquake-risk',
        title: 'Durham earthquake risk',
        type: 'choropleth',
        adminLevel: 'district',
        layername: 'Durham earthquake risk',
        legendTitle: 'Risk score',
        opacity: 1,
        mapState,
        paint,
        legend,
        tooltipRenderer: RiskTooltip,
        rankMap: getRankMap(data),
        actions,
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
            layerList,
        } = this.props;

        const {
            showMetricSettings,
            showOpacitySettings,
            opacityValue,
            metricValues,
        } = this.state;

        const pending = isAnyRequestPending(requests);
        const riskDataRaw = getResults(requests, 'riskGetRequest') as RiskData[];
        const riskData = this.getRiskData(riskDataRaw, metricValues);
        const riskLayer = transformRiskDataToLayer(riskData, layerList[0], (
            <>
                <DataTableModalButton
                    modal={<DataTableModal data={riskDataRaw} />}
                    initialShowModal={false}
                    iconName="table"
                    transparent
                    disabled={pending}
                    className={styles.showDataTableButton}
                />
                <Button
                    title="Show / hide risk configurations parameter settings"
                    iconName="settings"
                    disabled={pending}
                    onClick={this.handleShowMetricsButtonClick}
                    transparent
                    className={styles.showMetricsButton}
                />
            </>
        ));
        const layer = layerList[0];

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
                        <LayerSelectionItem
                            data={riskLayer}
                            disabled={pending}
                        />
                        <div className={styles.description}>
                            { layer && layer.group && layer.group.shortDescription }
                        </div>
                        <div className={styles.options}>
                            { showMetricSettings && (
                                <div className={styles.metricSettings}>
                                    <header className={styles.header}>
                                        <h4 className={styles.heading}>
                                            Configure risk parameters
                                        </h4>
                                        <Button
                                            title="Hide risk parameter configuration settings"
                                            transparent
                                            iconName="chevronUp"
                                            onClick={() => (
                                                this.setState({ showMetricSettings: false })
                                            )}
                                        />
                                    </header>
                                    <div className={styles.content}>
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
