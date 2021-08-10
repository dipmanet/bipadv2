import React from 'react';
import memoize from 'memoize-one';
import {
    Obj,
    _cs,
} from '@togglecorp/fujs';

import { connect } from 'react-redux';
import LayerSelection from '#components/LayerSelection';
import { LayerWithGroup, LayerGroup, HazardType } from '#store/atom/page/types';

import { getLayerHierarchy } from '#utils/domain';

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
    public constructor(props) {
        super(props);
        this.state = {
            municipalityImagedata: [],
        };
    }

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
        this.setState({ municipalityImagedata: munDataWithDistrict });
    }

    private getHierarchy = memoize(getLayerHierarchy);

    public render() {
        const {
            className,
            layerList,
            layerGroupList,
            requests: { FeatureGetMunicipalityImages },
            municipalities,
        } = this.props;
        const { municipalityImagedata } = this.state;
        const { landslidePolygonImagemap } = this.context;
        const layers = this.getHierarchy(
            layerList,
            layerGroupList,
        );
        FeatureGetMunicipalityImages.setDefaultParams({
            municipalityData: this.municipalityImageData,
        });
        console.log('test', landslidePolygonImagemap);


        return (
            <LayerSelection
                className={_cs(styles.hazard, className)}
                layerList={layers}
            />
        );
    }
}


export default connect(mapStateToProps)(
    createConnectedRequestCoordinator<PropsWithRedux>()(
        createRequestClient(requests)(
            Hazard,
        ),
    ),
);
