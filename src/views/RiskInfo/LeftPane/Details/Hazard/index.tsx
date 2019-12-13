import React from 'react';
import memoize from 'memoize-one';
import {
    Obj,
    _cs,
    unique,
} from '@togglecorp/fujs';

import { LayerWithGroup, HazardType } from '#store/atom/page/types';

import Flood from './Flood';
import Earthquake from './Earthquake';
import Landslide from './Landslide';

import styles from './styles.scss';

interface Props {
    className?: string;
    hazards: Obj<HazardType>;
    layerList: LayerWithGroup[];
}

interface State {
}

class Hazard extends React.PureComponent<Props, State> {
    private getGroup = (layerList: LayerWithGroup[], hazard: number) => {
        const layers = layerList.filter(layer => layer.hazard === hazard);
        const groups = unique(layers.map(layer => layer.group), group => group.id) || [];

        const groupWithLayers = groups.map((group) => {
            const { id } = group;
            const groupLayers = layers.filter(layer => layer.group.id === id);
            return ({ ...group, layers: groupLayers });
        });
        return groupWithLayers;
    }

    private getFloodGroups = memoize(this.getGroup);

    private getEarthquakeGroups = memoize(this.getGroup);

    private getLandslideGroups = memoize(this.getGroup);

    public render() {
        const {
            className,
            layerList,
        } = this.props;

        const floodGroups = this.getFloodGroups(layerList, 11);
        const earthquakeGroups = this.getEarthquakeGroups(layerList, 8);
        const landslideGroups = this.getLandslideGroups(layerList, 17);

        return (
            <div className={_cs(styles.hazard, className)}>
                <Flood
                    className={styles.subCategory}
                    floodGroups={floodGroups}
                />
                <Earthquake
                    className={styles.subCategory}
                    earthquakeGroups={earthquakeGroups}
                />
                <Landslide
                    className={styles.subCategory}
                    landslideGroups={landslideGroups}
                />
            </div>
        );
    }
}

export default Hazard;
