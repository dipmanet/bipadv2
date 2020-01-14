import React from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import ExpandableView from '#components/ExpandableView';
import RiskDescription from '#components/RiskDescription';
import { LayerHierarchy } from '#types';
import { LayerWithGroup } from '#store/atom/page/types';
import Option from '#components/RadioInput/Option';
import ListView from '#rscv/List/ListView';

import styles from './styles.scss';

interface Props {
    layerKeySelector: (layer: LayerHierarchy) => number;
    layerLabelSelector: (layer: LayerHierarchy) => string;
    selectedLayerId: number | undefined;
    layers: LayerHierarchy[];
    onClick: (key: number | number) => void;
}
interface State {
}
interface LayerOption {
    layerKeySelector: (layer: LayerWithGroup | LayerHierarchy) => number;
    layerLabelSelector: (layer: LayerWithGroup | LayerHierarchy) => string;
    selectedLayerId: number | undefined;
    layer: LayerHierarchy;
    onClick: (key: number | string) => void;
}

function isGroup(children: LayerHierarchy[] | LayerWithGroup[]): children is LayerWithGroup[] {
    const firstElement = children[0];
    if (!firstElement) {
        return false;
    }
    return !!(firstElement as LayerWithGroup).layername;
}

const LayerRenderer = (option: LayerOption) => {
    const {
        layer,
        layerKeySelector,
        layerLabelSelector,
        onClick,
        selectedLayerId,
    } = option;

    const hasParent = isDefined(layer.parent);

    if (isGroup(layer.children)) {
        const rendererParams = (_: number, element: LayerWithGroup) => ({
            onClick,
            label: layerLabelSelector(element),
            optionKey: layerKeySelector(element),
            isActive: (selectedLayerId === layerKeySelector(element)),
        });

        return (
            <ExpandableView
                headerContent={layerLabelSelector(layer)}
                expandableContent={(
                    <>
                        <RiskDescription
                            className={styles.description}
                            text={layer.shortDescription}
                        />
                        <ListView
                            data={layer.children}
                            keySelector={layerKeySelector}
                            renderer={Option}
                            rendererParams={rendererParams}
                        />
                    </>
                )}
            />
        );
    }

    return (
        <div
            className={_cs(
                styles.expandableLayerChild,
                hasParent && styles.hasParent,
            )}
            key={`group-${layerKeySelector(layer)}`}
        >
            <ExpandableView
                headerContent={layerLabelSelector(layer)}
                expandableContent={(
                    <>
                        <RiskDescription
                            className={styles.description}
                            text={layer.shortDescription}
                        />
                        <LayerSelection
                            {...option}
                            layers={layer.children}
                        />
                    </>
                )}
            />
        </div>
    );
};

class LayerSelection extends React.PureComponent<Props, State> {
    private getLayerRendererParams = (_: number, layer: LayerHierarchy) => {
        const {
            onClick,
            layerLabelSelector,
            layerKeySelector,
            selectedLayerId,
        } = this.props;

        return ({
            layer,
            onClick,
            layerLabelSelector,
            layerKeySelector,
            selectedLayerId,
        });
    }

    public render() {
        const {
            layerKeySelector,
            layers,
        } = this.props;

        return (
            <ListView
                data={layers}
                keySelector={layerKeySelector}
                renderer={LayerRenderer}
                rendererParams={this.getLayerRendererParams}
                className={styles.layerSelection}
            />
        );
    }
}

export default LayerSelection;
