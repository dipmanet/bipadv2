import React from 'react';
import memoize from 'memoize-one';
import {
    Obj,
    _cs,
} from '@togglecorp/fujs';

import LayerSelection from '#components/LayerSelection';
import CommonMap from '#components/CommonMap';
import { LayerWithGroup, LayerGroup, HazardType } from '#store/atom/page/types';

import { getLayerHierarchy } from '#utils/domain';
import HazardSelection from './HazardSelection';

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

        // console.warn(layers);

        return (
            <div className={_cs(styles.hazard, className)}>
                <CommonMap sourceKey="hazard" />
                <LayerSelection
                    // groupClassName={styles.group}
                    // layerClassName={styles.layer}
                    // className={styles.hazardSelection}
                    layerList={layers}
                />
            </div>
        );
    }
}

export default Hazard;
