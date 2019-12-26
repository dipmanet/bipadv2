import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    unique,

} from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import { LayerWithGroup, LayerGroup } from '#store/atom/page/types';

import Group from '../Hazard/Group';

import styles from './styles.scss';

interface LayerGroupTreeElement {
    [key: string]: string | LayerGroup[];
}

interface CapacityAndResourceGroup {
    id: number;
    title: string;
    description: string;
    layer: LayerWithGroup[];
}

interface Props {
    className?: string;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
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

    private getTreeLayout = (layerList: LayerWithGroup[], layerGroupList: LayerGroup[]) => {
        const tree = [];
        const lookup = {};

        const l = layerList.map(layer => ({ ...layer, parent: layer.group.id }));
        const allLayers = [...l, ...layerGroupList];

        allLayers.forEach((group) => {
            lookup[group.id] = group;
            lookup[group.id].children = [];
        });

        allLayers.forEach((group) => {
            if (group.parent) {
                lookup[group.parent].children.push(group);
            } else {
                tree.push(group);
            }
        });

        return tree;
    }

    public render() {
        const {
            layerGroupList,
            layerList,
            className,
        } = this.props;

        const groups = this.getGroupedLayers(layerList);
        const groupsWithParent = this.getTreeLayout(layerList, layerGroupList);

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
