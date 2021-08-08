import React from 'react';
import memoize from 'memoize-one';
import {
    Obj,
    _cs,
} from '@togglecorp/fujs';

import LayerSelection from '#components/LayerSelection';
import { LayerWithGroup, LayerGroup, HazardType } from '#store/atom/page/types';

import { getLayerHierarchy } from '#utils/domain';

import styles from './styles.scss';

interface Props {
    className?: string;
    hazards: Obj<HazardType>;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
}

interface State {
}

class Hazard extends React.PureComponent<Props, State> {
    private getHierarchy = memoize(getLayerHierarchy);

    public render() {
        const {
            className,
            layerList,
            layerGroupList,
        } = this.props;

        const layers = this.getHierarchy(
            layerList,
            layerGroupList,
        );
        return (
            <LayerSelection
                className={_cs(styles.hazard, className)}
                layerList={layers}
            />
        );
    }
}

export default Hazard;
