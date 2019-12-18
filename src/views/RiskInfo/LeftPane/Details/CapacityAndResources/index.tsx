import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    unique,

} from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import { LayerWithGroup } from '#store/atom/page/types';

import Group from '../Hazard/Group';

import styles from './styles.scss';

interface CapacityAndResourceGroup {
    id: number;
    title: string;
    description: string;
    layer: LayerWithGroup[];
}

interface Props {
    className?: string;
    layerList: LayerWithGroup[];
}

interface State {
}

const keySelector = (d: CapacityAndResourceGroup) => d.id;

export default class CapacityAndResources extends React.PureComponent<Props, State> {
    private getGroupedLayers = memoize((layerList: LayerWithGroup[]) => {
        const groups = unique(layerList.map(layer => layer.group), group => group.id) || [];

        const groupWithLayers = groups.map((group) => {
            const { id } = group;
            const groupLayers = layerList.filter(layer => layer.group.id === id);

            return ({ ...group, layers: groupLayers });
        });

        return groupWithLayers;
    });

    private getRendererParams = (_: number, group: CapacityAndResourceGroup) => group;

    public render() {
        const {
            layerList,
            className,
        } = this.props;

        const groups = this.getGroupedLayers(layerList);

        return (
            <div className={_cs(styles.capacityAndResources, className)}>
                <ListView
                    className={styles.group}
                    data={groups}
                    keySelector={keySelector}
                    renderer={Group}
                    rendererParams={this.getRendererParams}
                />
            </div>
        );
    }
}
