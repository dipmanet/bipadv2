import React from 'react';
import {
    _cs,
    listToMap,
    isDefined,
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

import RiskTable from './RiskTable';

import { LayerWithGroup, LayerGroup } from '#store/atom/page/types';
import { RiskData, LandslideDataGeoJson, LandslideDataFeature } from '#types';

import {
    getResults,
    getResponse,
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
    durhamLandslideDistrictRequest: {
        url: 'https://geoserver.bipad.gov.np/geoserver/Bipad/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Bipad%3Adurham_landslide_hazard_risk_district&outputFormat=application%2Fjson&propertyName=district_d,District_r',
        method: methods.GET,
        onMount: true,
    },
    durhamLandslideMunicipalityRequest: {
        url: 'https://geoserver.bipad.gov.np/geoserver/Bipad/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Bipad%3Adurham_landslide_hazard_risk_municipality&outputFormat=application%2Fjson&propertyName=Palika_ris,municipali',
        method: methods.GET,
        onMount: true,
    },
    durhamLandslideWardRequest: {
        url: 'https://geoserver.bipad.gov.np/geoserver/Bipad/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Bipad%3Adurham_landslide_hazard_risk_ward&outputFormat=application%2Fjson&propertyName=ward_id,Ward_War_4',
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

const landslideColorGrade = [
    '#4288bd',
    '#6692b5',
    '#abddc4',
    '#e6f598',
    '#ffffbf',
    '#fee08b',
    '#fdae61',
    '#f46d43',
    '#d53e4f',
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

const LandslideTooltip = ({ layer, feature }) => (
    <div className={styles.riskTooltip}>
        <h3 className={styles.heading}>
            { feature.properties.title }
        </h3>
        <div className={styles.content}>
            {
                isDefined(feature.state.value) && (
                    <RiskTooltipOutput
                        label="Risk Score:"
                        value={feature.state.value}
                    />
                )
            }
        </div>
    </div>
);

const getRankMap = memoize(data => (
    listToMap(data, d => d.district, d => d.rank)
));

const transformLandslideDataToLayer = (
    {
        data = [],
        adminLevel,
        dataKey,
        dataValue,
    }: {
        data: LandslideDataFeature[];
        adminLevel: string;
        dataKey: string;
        dataValue: string;
    },
    layer = {},
) => {
    const mapState = data.map(d => ({
        id: d.properties[dataKey],
        value: d.properties[dataValue],
    }));

    const layerGroup = layer.group || {};

    // const [min, max] = extent(mapState, d => d.value);
    const min = 0;
    const max = 1;
    const { paint, legend } = generatePaint(landslideColorGrade, min || 0, max || 0);

    return {
        longDescription: layerGroup.longDescription,
        metadata: layerGroup.metadata,
        id: layer.title,
        title: layer.title,
        type: 'choropleth',
        adminLevel,
        layername: layer.title,
        legendTitle: layer.legendTitle,
        opacity: 1,
        mapState,
        paint,
        legend,
        tooltipRenderer: LandslideTooltip,
        minValue: min,
    };
};

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
        minValue: min,
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
        const districtLandslideRaw = getResponse(requests, 'durhamLandslideDistrictRequest') as LandslideDataGeoJson;
        const municipalityLandslideRaw = getResponse(requests, 'durhamLandslideMunicipalityRequest') as LandslideDataGeoJson;
        const wardLandslideRaw = getResponse(requests, 'durhamLandslideWardRequest') as LandslideDataGeoJson;
        const riskData = this.getRiskData(riskDataRaw, metricValues);

        const landslideLayerToDataMap = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            durham_landslide_hazard_risk_district: {
                data: districtLandslideRaw.features,
                adminLevel: 'district',
                dataKey: 'district_d',
                dataValue: 'District_r',
            },
            // eslint-disable-next-line @typescript-eslint/camelcase
            durham_landslide_hazard_risk_municipality: {
                data: municipalityLandslideRaw.features,
                adminLevel: 'municipality',
                dataKey: 'municipali',
                dataValue: 'Palika_ris',
            },
            // eslint-disable-next-line @typescript-eslint/camelcase
            durham_landslide_hazard_risk_ward: {
                data: wardLandslideRaw.features,
                adminLevel: 'ward',
                dataKey: 'ward_id',
                dataValue: 'Ward_War_4',
            },
        };

        const riskLayer = transformRiskDataToLayer(riskData, layerList[0], (
            <>
                <DataTableModalButton
                    modal={(
                        <RiskTable
                            title="Durham earthquake risk data"
                            data={riskDataRaw}
                        />
                    )}
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
                        { layerList.map(layer => (
                            layer.layername === 'durham_earthquake_risk_score' ? (
                                <React.Fragment key={layer.id}>
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
                                                            this.setState({
                                                                showMetricSettings: false,
                                                            })
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
                                                                        rangeInputDefaultClassNames
                                                                            .inputRange,
                                                                        styles.rangeInput,
                                                                    ),
                                                                }}
                                                                minValue={0}
                                                                maxValue={5}
                                                                step={1}
                                                                value={this.state.metricValues[m]}
                                                                onChange={(value) => {
                                                                    this.handleMetricSliderChange(
                                                                        m,
                                                                        value,
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            ) : (
                                <LayerSelectionItem
                                    key={layer.id}
                                    data={
                                        layer.type === 'custom' ? (
                                            transformLandslideDataToLayer(
                                                landslideLayerToDataMap[layer.layername],
                                                layer,
                                            )
                                        ) : (
                                            layer
                                        )
                                    }
                                    disabled={pending}
                                />
                            )
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

Risk.contextType = RiskInfoLayerContext;
export default createRequestClient(requestOptions)(Risk);
