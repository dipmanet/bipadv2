import React from 'react';
import memoize from 'memoize-one';
import {
    isDefined,
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
import { createConnectedRequestCoordinator, createRequestClient, methods } from '#request';
import { municipalitiesSelector } from '#selectors';


import LayerSelectionItem from '#components/LayerSelectionItem';
import { getResponse, getResults } from '#utils/request';


interface Props {
    className?: string;
    hazards: Obj<HazardType>;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
}

interface State {
}
const colorGrade = [
    '#F6F6F4',
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
    <div className={styles.landslideTooltip}>
        <div className={styles.header}>
            <h4>
                {label}

            </h4>
        </div>

        <div className={styles.content}>
            <div>


                <p>Click on municipality for map </p>


            </div>

        </div>


    </div>


);
const LandslideTooltip = ({ layer, feature }) => (
    <div className={styles.riskTooltip}>
        {/* <h3 className={styles.heading}>
            { feature.properties.title }
        </h3> */}
        <div className={styles.content}>
            {
                isDefined(feature.state.value) && (
                    <RiskTooltipOutput
                        label={feature.properties.title}

                    />
                )
            }
        </div>
    </div>
);
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


const transformLandslideDataToLayer = (
    data,
    layer = {},
    municipalities,

) => {
    const mapState = municipalities.map(mun => ({
        id: mun.id,
        value: (data.find(item => item.municipality === mun.id)) ? 1 : 0,
    }));


    const layerGroup = layer.group || {};


    const [min, max] = extent(mapState, d => d.value);
    const { paint, legend } = generatePaint(colorGrade, 0, 1);


    return {
        longDescription: layerGroup.longDescription,
        metadata: layerGroup.metadata,
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
        tooltipRenderer: LandslideTooltip,
        minValue: min,
        maxValueCapped: true,
        data,
    };
};
const mapStateToProps = (state: AppState): PropsFromState => ({

    municipalities: municipalitiesSelector(state),

    // hazardList: hazardTypeListSelector(state),
});

class Hazard extends React.PureComponent<Props, State> {
    public constructor() {
        super();
        this.state = {
            municipalityImages: [],
        };
    }

    private getHierarchy = memoize(getLayerHierarchy);

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
        this.setState({
            municipalityImages: munDataWithDistrict,
        });
        // handleLandslidePolygonImageMap(munDataWithDistrict);
    }

    public render() {
        const {
            className,
            layerList,
            layerGroupList,
            requests: { FeatureGetMunicipalityImages },

        } = this.props;
        const { municipalityImages } = this.state;

        // const { landslidePolygonImagemap } = this.context;


        FeatureGetMunicipalityImages.setDefaultParams({
            municipalityData: this.municipalityImageData,
        });


        const layers = this.getHierarchy(
            layerList,
            layerGroupList,
        );
        const landslideLayerToDataMap = {
            // eslint-disable-next-line @typescript-eslint/camelcase
            // durham_landslide_hazard_risk_district: {
            //     data: districtLandslideRaw.features,
            //     adminLevel: 'district',
            //     dataKey: 'district_d',
            //     dataValue: 'District_r',
            // },
            // eslint-disable-next-line @typescript-eslint/camelcase
            post_monsoon: {
                data: [],
                adminLevel: 'municipality',
                dataKey: 'municipali',
                dataValue: 'Palika_ris',
            },
            // eslint-disable-next-line @typescript-eslint/camelcase
            // durham_landslide_hazard_risk_ward: {
            //     data: wardLandslideRaw.features,
            //     adminLevel: 'ward',
            //     dataKey: 'ward_id',
            //     dataValue: 'Ward_War_4',
            // },
        };
        const RiskLayerSelectionItem = (p) => {
            const { data: layer } = p;
            const { municipalities } = this.props;
            return (
                <LayerSelectionItem
                    key={layer.id}
                    data={
                        landslideLayerToDataMap[layer.layername] ? (
                            transformLandslideDataToLayer(
                                municipalityImages,
                                layer,
                                municipalities,

                            )
                        ) : (
                            layer
                        )
                    }
                />
            );
        };

        return (
            <LayerSelection
                className={_cs(styles.hazard, className)}
                layerList={layers}
                layerSelectionItem={RiskLayerSelectionItem}

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
