import React from 'react';
import memoize from 'memoize-one';
import {
    Obj,
    _cs,
} from '@togglecorp/fujs';

import { connect } from 'react-redux';
import { extent } from 'd3-array';
import LayerSelection from '#components/LayerSelection';
import { LayerWithGroup, LayerGroup, HazardType } from '#store/atom/page/types';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import { generatePaint,
    getLayerHierarchy } from '#utils/domain';

import styles from './styles.scss';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    ClientAttributes,
    methods,
} from '#request';
import { municipalitiesSelector } from '#selectors';


interface Props {
    className?: string;
    hazards: Obj<HazardType>;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
}

interface State {
}
const colorGrade = [
    '#ffe1ca',
    '#ffe1ca',

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
const transformRiskDataToLayer = (data: RiskData[], layer = {}, actions) => {
    const mapState = data.map(d => ({
        id: d.municipality,
        value: 1,

    }));

    // const layerGroup = layer.group || {};

    const [min, max] = extent(mapState, d => d.value);
    const { paint, legend } = generatePaint(colorGrade, 0, 1);

    return {
        // longDescription: layerGroup.longDescription,
        // metadata: layerGroup.metadata,
        id: layer.id,
        title: layer.title,
        type: 'choropleth',
        adminLevel: 'municipality',
        layername: layer.layername,
        legendTitle: layer.legendTitle,
        opacity: 1,
        mapState,
        paint,
        legend,
        actions,
        minValue: min,
        data,
        tooltipRenderer: RiskTooltip,
    };
};

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
        id: layer.id,
        title: layer.title,
        type: 'choropleth',
        adminLevel,
        layername: layer.layername,
        legendTitle: layer.legendTitle,
        opacity: 1,
        mapState,
        paint,
        legend,
        minValue: min,
        maxValueCapped: true,
    };
};
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    FeatureGetMunicipalityImages: {
        url: '/municipality-images/',
        method: methods.GET,
        onMount: true,

        onSuccess: ({ response, params }) => {
            // params.responseData(response);
            if (params) {
                params.municipalityData(response.results);
            }
        },
    },


};
const mapStateToProps = (state: AppState): PropsFromState => ({

    municipalities: municipalitiesSelector(state),

    // hazardList: hazardTypeListSelector(state),
});


class Hazard extends React.PureComponent<Props, State> {
    private municipalityImageData=(data) => {
        const { municipalities } = this.props;
        const { handleLandslidePolygonImageMap } = this.context;
        const munDataWithDistrict = data.map((item) => {
            const dist = municipalities
                .filter(mun => mun.id === item.municipality)
                .map(rslt => rslt.district);
            return ({
                ...item,
                district: dist[0],
            });
        });
        handleLandslidePolygonImageMap(munDataWithDistrict);
    }


    private getHierarchy = memoize(getLayerHierarchy);

    public render() {
        const {
            className,
            layerList,
            layerGroupList,
            requests: { FeatureGetMunicipalityImages },

        } = this.props;

        const layers = this.getHierarchy(
            layerList,
            layerGroupList,
        );
        const { landslidePolygonImagemap, activeLayers,
            handlelandslidePolygonChoroplethMapData,
            landslidePolygonChoroplethMapData, addLayer } = this.context;
        // if (activeLayers.length && activeLayers[activeLayers.length - 1]
        // .group.title === 'Landslide Polygon Map'
        // && landslidePolygonChoroplethMapData.length === 0) {
        //     const datas = transformRiskDataToLayer(landslidePolygonImagemap,
        //         activeLayers[activeLayers.length - 1], {});
        //     addLayer(datas);
        //     // handlelandslidePolygonChoroplethMapData(datas);
        //     console.log('This is data', datas);
        // }
        if (activeLayers.length && activeLayers[activeLayers.length - 1].type !== 'choropleth'
        && activeLayers[activeLayers.length - 1].group.title === 'Landslide Polygon Map') {
            const datas = transformRiskDataToLayer(landslidePolygonImagemap,
                activeLayers[activeLayers.length - 1], {});

            addLayer(datas);
        }

        FeatureGetMunicipalityImages.setDefaultParams({
            municipalityData: this.municipalityImageData,
        });
        // const riskLayer = transformRiskDataToLayer(riskData, earthquakeLayer[0], {});


        return (
            <LayerSelection
                className={_cs(styles.hazard, className)}
                layerList={layers}
            />
        );
    }
}

Hazard.contextType = RiskInfoLayerContext;
export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Hazard,
        ),
    ),
);
