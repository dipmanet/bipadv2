import React from 'react';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';

import CommonMap from '#components/CommonMap';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import MapLayerLegend from '#components/MapLayerLegend';
import LayerSelection from '#components/LayerSelection';
import {
    getRasterTile,
    getRasterLegendURL,
    getLayerHierarchy,
} from '#utils/domain';


import { LayerWithGroup, LayerGroup, Layer } from '#store/atom/page/types';
import { LayerHierarchy } from '#types';

import styles from './styles.scss';

interface Props {
    className?: string;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
}

interface State {
    selectedLayerId: number | undefined;
}

const layerKeySelector = (d: LayerHierarchy) => d.id;
const layerLabelSelector = (d: LayerHierarchy) => d.title;

class Risk extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            selectedLayerId: undefined,
        };
    }

    public componentWillUnmount() {
        const { selectedLayerId } = this.state;

        if (selectedLayerId) {
            this.context.removeLayer(`layer-${selectedLayerId}`);
        }
    }

    private handleLayerUnselect = () => {
        const { selectedLayerId } = this.state;

        if (selectedLayerId) {
            this.context.removeLayer(`layer-${selectedLayerId}`);
        }

        this.setState({
            selectedLayerId: undefined,
        });
    }

    private getLayer = (layerId: number| undefined) => {
        const { layerList } = this.props;
        const layer = layerList.find(l => l.id === layerId);
        return layer;
    };

    private getRasterTiles = (layer: Layer | LayerWithGroup | undefined) => {
        if (layer) {
            const rasterTile = getRasterTile(layer);
            return [rasterTile];
        }
        return [];
    };

    private getHierarchy = memoize(getLayerHierarchy);

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

    public render() {
        const {
            className,
            layerList,
            layerGroupList,
        } = this.props;

        const {
            selectedLayerId,
        } = this.state;

        const layers = this.getHierarchy(
            layerList,
            layerGroupList,
        );

        const selectedLayer = this.getLayer(selectedLayerId);
        const rasterTiles = this.getRasterTiles(selectedLayer);

        return (
            <div className={_cs(styles.risk, className)}>
                <CommonMap sourceKey="risk" />
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
                { selectedLayer && (
                    <MapLayerLegend
                        legendSrc={getRasterLegendURL(selectedLayer)}
                        layerTitle={selectedLayer.title}
                    />
                )}
                { selectedLayer && (
                    <MapSource
                        sourceKey={`risk-${selectedLayer.id}`}
                        sourceOptions={{
                            type: 'raster',
                            tiles: rasterTiles,
                            tileSize: 256,
                        }}
                    >
                        <MapLayer
                            layerKey={`layer-${selectedLayer.id}`}
                            layerOptions={{
                                type: 'raster',
                                paint: {
                                    'raster-opacity': 1,
                                },
                            }}
                        />
                    </MapSource>
                )}
            </div>
        );
    }
}

Risk.contextType = RiskInfoLayerContext;
export default Risk;
