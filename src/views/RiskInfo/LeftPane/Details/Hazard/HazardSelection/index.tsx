import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ExpandableView from '#components/ExpandableView';
import RiskDescription from '#components/RiskDescription';
import { LayerHierarchy } from '#types';
import { LayerWithGroup } from '#store/atom/page/types';
import ListView from '#rscv/List/ListView';

import Group from './Group';
import styles from './styles.scss';

interface Props {
    layers: LayerHierarchy[];
    className?: string;
    layerClassName?: string;
}

interface State {
}

function isGroup(children: LayerHierarchy[] | LayerWithGroup[]): children is LayerWithGroup[] {
    const firstElement = children[0];
    if (!firstElement) {
        return false;
    }
    return !!(firstElement as LayerWithGroup).layername;
}


const LayerRenderer = ({
    layer,
    layerClassName,
    groupClassName,
}: {
    layerClassName?: string;
    groupClassName?: string;
    layer: LayerHierarchy;
}) => {
    if (isGroup(layer.children)) {
        return (
            <Group
                id={layer.id}
                title={layer.title}
                description={layer.shortDescription}
                layers={layer.children}
                className={groupClassName}
            />
        );
    }
    return (
        <ExpandableView
            className={layerClassName}
            headerContent={layer.title}
            expandableContent={(
                <>
                    <RiskDescription
                        text={layer.shortDescription}
                    />
                    <HazardSelection
                        layers={layer.children}
                    />
                </>
            )}
        />
    );
};

const layerKeySelector = (d: LayerHierarchy) => d.id;

class HazardSelection extends React.PureComponent<Props, State> {
    private getLayerRendererParams = (_: number, layer: LayerHierarchy) => {
        const {
            layerClassName,
            groupClassName,
        } = this.props;

        return {
            groupClassName,
            layerClassName,
            layer,
        };
    }

    public render() {
        const {
            layers,
            className,
        } = this.props;

        return (
            <ListView
                className={_cs(className, styles.layerSelection)}
                data={layers}
                keySelector={layerKeySelector}
                renderer={LayerRenderer}
                rendererParams={this.getLayerRendererParams}
            />
        );
    }
}

export default HazardSelection;
