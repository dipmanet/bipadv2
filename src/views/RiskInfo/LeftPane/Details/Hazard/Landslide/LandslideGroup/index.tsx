import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Button from '#rsca/Button';
import ListSelection from '#rsci/ListSelection';
import Icon from '#rscg/Icon';
import Checkbox from '#rsci/Checkbox';
import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { LayerWithGroup } from '#store/atom/page/types';

import { getRasterTile } from '#utils/domain';

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
}

interface State {
    isExpanded: boolean;
    isLayerVisible: boolean;
    selectedLayers: number[];
    rasterTileList: Tile[];
}

const labelSelector = (d: LayerWithGroup) => d.title;
const keySelector = (d: LayerWithGroup) => d.id;

export default class Group extends React.PureComponent<Props, State> {
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
            });
        });

        this.setState({
            selectedLayers: layerIdList,
            rasterTileList,
        });
    }

    private handleExpandButtonClick = () => {
        this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
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
            <div className={_cs(className, styles.group)}>
                <div className={styles.heading}>
                    <Checkbox
                        value={isLayerVisible}
                        onChange={this.handleLayerVisibility}
                    />
                    <Button
                        className={styles.button}
                        transparent
                        onClick={this.handleExpandButtonClick}
                    >
                        <div
                            className={styles.title}
                        >
                            {title}
                        </div>
                        <Icon
                            className={styles.icon}
                            name={isExpanded ? 'chevronUp' : 'chevronDown'}
                        />
                    </Button>
                </div>
                { isExpanded && (
                    <div
                        className={styles.bottom}
                    >
                        <div className={styles.description}>
                            {description}
                        </div>
                        <ListSelection
                            className={styles.layers}
                            options={layers}
                            labelSelector={labelSelector}
                            keySelector={keySelector}
                            onChange={this.handleLayerSelection}
                            value={selectedLayers}
                        />
                    </div>
                )}
                { rasterTileList.map(({ id, tile }) => (
                    <MapSource
                        key={`landslide-${id}`}
                        sourceKey={`landslide-${id}`}
                        rasterTiles={tile}
                    >
                        <MapLayer
                            layerKey="raster-layer"
                            type="raster"
                            paint={{
                                'raster-opacity': 0.5,
                            }}
                        />
                    </MapSource>
                ))}
            </div>
        );
    }
}
