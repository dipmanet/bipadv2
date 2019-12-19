import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';

import ExpandableView from '#components/ExpandableView';
import RiskDescription from '#components/RiskDescription';

import { OpacityElement } from '#types';
import { LayerWithGroup } from '#store/atom/page/types';

import { getRasterTile } from '#utils/domain';

import LandslideSelection from './LandslideSelection';

import styles from './styles.scss';

interface Props {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
    className: string;
}

interface Tile {
    id: number;
    tile: string[];
    opacity: number;
}

interface State {
    isExpanded: boolean;
    isLayerVisible: boolean;
    selectedLayers: number[];
    rasterTileList: Tile[];
}

const labelSelector = (d: LayerWithGroup) => d.title;
const keySelector = (d: LayerWithGroup) => d.id;

export default class LandslideGroup extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isExpanded: false,
            selectedLayers: [],
            rasterTileList: [],
            isLayerVisible: true,
        };
    }

    private handleLayerVisibility = (isLayerVisible: boolean) => {
        this.setState({ isLayerVisible });
    }

    private handleLayerSelection = (layerIdList: number[]) => {
        const { layers } = this.props;
        const selectedLayers = layers.filter(l => layerIdList.includes(l.id));
        const rasterTileList = selectedLayers.map((layer) => {
            const tile = getRasterTile(layer);

            return ({
                id: layer.id,
                tile: [tile],
                opacity: 1,
            });
        });

        const layersToRemove = layers.map(d => `landslide-${d.id}`);
        this.context.removeLayers(layersToRemove);

        const activeLayerList = selectedLayers.map(d => ({
            id: `landslide-${d.id}`,
            title: `${d.group.title} / ${d.title}`,
        }));
        this.context.addLayers(activeLayerList);

        this.setState({
            selectedLayers: layerIdList,
            rasterTileList,
        });
    }

    private handleExpandButtonClick = () => {
        this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
    }

    private handleOpacityChange = (
        key: OpacityElement['key'],
        value: OpacityElement['value'],
    ) => {
        this.setState(({ rasterTileList }) => {
            const newTileList = rasterTileList.map(
                tile => (tile.id === key ? { ...tile, opacity: value } : tile),
            );

            return ({
                rasterTileList: newTileList,
            });
        });
    }

    public render() {
        const {
            title,
            description,
            layers,
            className,
        } = this.props;

        const {
            selectedLayers,
            isLayerVisible,
            rasterTileList,
            isExpanded,
        } = this.state;

        return (
            <>
                <ExpandableView
                    className={_cs(className, styles.group)}
                    headerContent={title}
                    expandableContent={(
                        <>
                            <RiskDescription
                                text={description}
                            />
                            <LandslideSelection
                                className={styles.layers}
                                options={layers}
                                labelSelector={labelSelector}
                                tooltipSelector={labelSelector}
                                keySelector={keySelector}
                                onChange={this.handleLayerSelection}
                                onOpacityChange={this.handleOpacityChange}
                                value={selectedLayers}
                            />
                        </>
                    )}
                />
                {rasterTileList.map(({ id, tile, opacity }) => (
                    <MapSource
                        key={`landslide-${id}`}
                        sourceKey={`landslide-${id}`}
                        rasterTiles={tile}
                    >
                        <MapLayer
                            layerKey={`landslide-${id}`}
                            type="raster"
                            paint={{
                                'raster-opacity': opacity,
                            }}
                        />
                    </MapSource>
                ))}
            </>
        );
    }
}

LandslideGroup.contextType = RiskInfoLayerContext;
