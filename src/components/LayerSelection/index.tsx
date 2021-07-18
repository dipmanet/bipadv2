import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { LayerHierarchy } from '#types';
import ListView from '#rscv/List/ListView';

import LayerItem from '#components/LayerItem';
import styles from './styles.scss';

interface Props {
    className?: string;
    layerList: LayerHierarchy[];
    pending?: boolean;
    layerSelectionItem?: React.ReactNode;
}

class LayerSelection extends React.PureComponent<Props> {
    private getLayerRendererParams = (layerId: LayerHierarchy['id'], layer: LayerHierarchy) => ({
        data: layer,
        layerSelectionItem: this.props.layerSelectionItem,
    })

    public render() {
        const {
            className,
            layerList,
            pending,
        } = this.props;

        console.log('This', layerList);
        return (
            <ListView
                className={_cs(styles.layerSelection, className)}
                data={layerList}
                keySelector={d => d.id}
                renderer={LayerItem}
                rendererParams={this.getLayerRendererParams}
                pending={pending}
            />
        );
    }
}

export default LayerSelection;
