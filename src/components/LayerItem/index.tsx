import React from 'react';

import { LayerHierarchy } from '#types';
import LayerGroup from '#components/LayerGroup';
import DefaultLayerSelectionItem from '#components/LayerSelectionItem';

interface Props {
    className?: string;
    data: LayerHierarchy;
    layerSelectionItem?: React.ReactNode;
}

class LayerItem extends React.PureComponent<Props> {
    public render() {
        const {
            data,
            layerSelectionItem: LayerSelectionItem = DefaultLayerSelectionItem,
        } = this.props;

        if (data.children && data.children.length !== 0) {
            return <LayerGroup {...this.props} />;
        }

        return (
            <LayerSelectionItem {...this.props} />
        );
    }
}

export default LayerItem;
