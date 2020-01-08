import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
} from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';
import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import LayerSelection from '#components/LayerSelection';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import MapLayerLegend from '#components/MapLayerLegend';
import OpacityInput from '#components/OpacityInput';


import {
    getRasterTile,
    getRasterLegendURL,
} from '#utils/domain';
import {
    OpacityElement,
    LayerHierarchy,
    LayerMap,
} from '#types';
import { LayerWithGroup, LayerGroup, Layer } from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    className?: string;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
}

interface State {
    layerOpacity: number;
    selectedLayerId: number | undefined;
}

const layerKeySelector = (d: LayerHierarchy) => d.id;
const layerLabelSelector = (d: LayerHierarchy) => d.title;

class CapacityAndResources extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            layerOpacity: 1,
            selectedLayerId: undefined,
        };
    }

    public componentWillUnmount() {
        const { selectedLayerId } = this.state;

        if (selectedLayerId) {
            this.context.removeLayer(`layer-${selectedLayerId}`);
        }
    }

    private getLayerHierarchy = memoize((
        layerList: LayerWithGroup[],
        layerGroupList: LayerGroup[],
    ) => {
        const tree: LayerHierarchy[] = [];
        const lookup: LayerMap = {};

        const newLayers = layerList.map(layer => ({
            ...layer,
            parent: layer.group.id,
            children: [],
        }));

        const newGroups = layerGroupList.map(group => ({
            ...group,
            children: [],
        }));


        const layersAndGroups = [...newGroups, ...newLayers];

        newGroups.forEach((element) => {
            lookup[element.id] = element;
        });

        layersAndGroups.forEach((element) => {
            if (element.parent) {
                lookup[element.parent].children.push(element);
            } else {
                tree.push(element);
            }
        });

        return tree;
    });

    private handleLayerUnselect = () => {
        const { selectedLayerId } = this.state;

        if (selectedLayerId) {
            this.context.removeLayer(`layer-${selectedLayerId}`);
        }

        this.setState({
            selectedLayerId: undefined,
        });
    }

    private handleClick = (layerId: number | undefined) => {
        const { selectedLayerId } = this.state;
        if (selectedLayerId) {
            this.context.removeLayer(`layer-${selectedLayerId}`);
        }

        this.setState({
            selectedLayerId: layerId,
        });

        if (layerId) {
            const layer = this.getLayer(layerId);

            if (layer) {
                this.context.addLayer({
                    title: `${layer.group.title} / ${layer.title}`,
                    id: `layer-${layer.id}`,
                });
            }
        }
    }

    private handleOpacityInputChange = (_: OpacityElement['key'], value: OpacityElement['value']) => {
        this.setState({ layerOpacity: value });
    }

    private getLayer = (layerId: number| undefined) => {
        const { layerList } = this.props;
        const layer = layerList.find(l => l.id === layerId);
        return layer;
    };

    private getRasterTiles = (layer: Layer| LayerWithGroup | undefined) => {
        if (layer) {
            const rasterTile = getRasterTile(layer);
            return [rasterTile];
        }
        return [];
    };

    public render() {
        const {
            layerGroupList,
            layerList,
            className,
        } = this.props;

        const {
            layerOpacity,
            selectedLayerId,
        } = this.state;

        const layers = this.getLayerHierarchy(layerList, layerGroupList);
        const selectedLayer = this.getLayer(selectedLayerId);
        const rasterTiles = this.getRasterTiles(selectedLayer);

        return (
            <div className={_cs(styles.capacityAndResources, className)}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Layers
                    </h4>
                    <DangerButton
                        disabled={!selectedLayerId}
                        onClick={this.handleLayerUnselect}
                        className={styles.clearButton}
                        transparent
                    >
                        Clear
                    </DangerButton>
                </header>
                <LayerSelection
                    layers={layers}
                    onClick={this.handleClick}
                    layerKeySelector={layerKeySelector}
                    layerLabelSelector={layerLabelSelector}
                    selectedLayerId={selectedLayerId}
                />
                { selectedLayerId && (
                    <OpacityInput
                        inputKey={selectedLayerId}
                        onChange={this.handleOpacityInputChange}
                    />
                )}
                { selectedLayer && (
                    <MapLayerLegend
                        legendSrc={getRasterLegendURL(selectedLayer)}
                        layerTitle={selectedLayer.title}
                    />
                )}
                { selectedLayer && (
                    <MapSource
                        key={selectedLayer.id}
                        sourceKey={`layer-${selectedLayer.id}`}
                        rasterTiles={rasterTiles}
                    >
                        <MapLayer
                            layerKey={`layer-${selectedLayer.id}`}
                            type="raster"
                            paint={{
                                'raster-opacity': layerOpacity,
                            }}
                        />
                    </MapSource>
                )}
            </div>
        );
    }
}

CapacityAndResources.contextType = RiskInfoLayerContext;
export default CapacityAndResources;
