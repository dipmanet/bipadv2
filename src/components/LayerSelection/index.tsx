import React from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import ExpandableView from '#components/ExpandableView';
import RiskDescription from '#components/RiskDescription';
import { LayerHierarchy } from '#types';
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
    layerKeySelector: (layer: LayerHierarchy) => number;
    layerLabelSelector: (layer: LayerHierarchy) => string;
    selectedLayerId: number | undefined;
    layer: LayerHierarchy;
    onClick: (key: number | number) => void;
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

    return (
        layer.children && (
            layer.children.length < 1 ? (
                <div
                    className={_cs(
                        styles.layerChild,
                        hasParent && styles.hasParent,
                    )}
                    key={layerKeySelector(layer)}
                >
                    <Option
                        label={layerLabelSelector(layer)}
                        onClick={onClick}
                        optionKey={layerKeySelector(layer)}
                        checked={selectedLayerId === layerKeySelector(layer)}
                    />
                </div>
            ) : (
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
                                    text={layer.description}
                                />
                                <LayerSelection
                                    {...option}
                                    layers={layer.children}
                                />
                            </>
                        )}
                    />
                </div>
            )
        )
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
