import React from 'react';
import memoize from 'memoize-one';
import {
    Obj,
    _cs,
} from '@togglecorp/fujs';

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

        return (
            <div className={_cs(styles.hazard, className)}>
                <HazardSelection
                    groupClassName={styles.group}
                    layerClassName={styles.layer}
                    className={styles.hazardSelection}
                    layers={layers}
                />
            </div>
        );
    }
}

export default Hazard;
