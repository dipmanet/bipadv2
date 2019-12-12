import React from 'react';
import ListView from '#rscv/List/ListView';

import { LayerWithGroup } from '#store/atom/page/types';

import FloodGroup from './FloodGroup';

interface FloodGroupElement {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
}
interface Props {
    floodGroups: FloodGroupElement[];
}

interface State {
}

const floodRendererParams = (_: number, floodGroup: FloodGroupElement) => {
    const { id, title, description, layers } = floodGroup;
    return ({ id, title, description, layers });
};

const floodGroupKeySelector = (floodGroup: FloodGroupElement) => floodGroup.id;

export default class Flood extends React.PureComponent<Props, State> {
    public render() {
        const {
            floodGroups,
        } = this.props;
        return (
            <ListView
                data={floodGroups}
                keySelector={floodGroupKeySelector}
                renderer={FloodGroup}
                rendererParams={floodRendererParams}
            />
        );
    }
}
