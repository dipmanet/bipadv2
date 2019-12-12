import React from 'react';
import {
    Obj,
    _cs,
    unique,
} from '@togglecorp/fujs';

import { LayerWithGroup, HazardType } from '#store/atom/page/types';

import Flood from './Flood';

import styles from './styles.scss';

interface Props {
    className?: string;
    hazards: Obj<HazardType>;
    layerList: LayerWithGroup[];
}

interface State {
}


class Hazard extends React.PureComponent<Props, State> {
    private getFloodGroups = (layerList: LayerWithGroup[]) => {
        const floodList = layerList.filter(layer => layer.hazard === 11);
        const groups = unique(floodList.map(flood => flood.group), group => group.id) || [];
        const floodGroups = groups.map((group) => {
            const { id } = group;
            const layers = floodList.filter(flood => flood.group.id === id);
            return ({ ...group, layers });
        });

        return floodGroups;
    }

    public render() {
        const {
            className,
            hazards,
            layerList,
        } = this.props;

        const floodGroups = this.getFloodGroups(layerList);

        return (
            <div className={_cs(styles.hazard, className)}>
                <Flood
                    floodGroups={floodGroups}
                />
            </div>
        );
    }
}

export default Hazard;
