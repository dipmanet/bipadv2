import React from 'react';
import Button from '#rsca/Button';
import DangerButton from '#rsca/Button/DangerButton';
import RadioInput from '#rsci/RadioInput';
import Icon from '#rscg/Icon';
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

interface State {
    isExpanded: boolean;
    selectedLayer: LayerWithGroup | undefined;
    rasterTile: string[];
}

const labelSelector = (d: LayerWithGroup) => d.title;
const keySelector = (d: LayerWithGroup) => d.id;

export default class Group extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isExpanded: false,
            rasterTile: [],
            selectedLayer: undefined,
        };
    }

    private handleLayerUnselect = () => {
        this.setState({
            selectedLayer: undefined,
        });
    }

    private handleExpandButtonClick = () => {
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded,
        }));
    }

    private onChange = (layerId: number) => {
        const { layers } = this.props;
        const layer = layers.find(l => l.id === layerId);
        if (layer) {
            const rasterTile = getRasterTile(layer);
            this.setState({
                selectedLayer: layer,
                rasterTile: [rasterTile],
            });
        }
    }

    public render() {
        const {
            title,
            description,
            layers,
            className,
        } = this.props;
        const {
            isExpanded,
            selectedLayer,
            rasterTile,
        } = this.state;

        return (
            <div className={styles.group}>
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
                { isExpanded && (
                    <div
                        className={styles.bottom}
                    >
                        <div className={styles.description}>
                            {description}
                        </div>
                        <DangerButton
                            disabled={!selectedLayer}
                            onClick={this.handleLayerUnselect}
                        >
                            Unselect
                        </DangerButton>
                        <RadioInput
                            className={styles.layers}
                            options={layers}
                            labelSelector={labelSelector}
                            keySelector={keySelector}
                            onChange={this.onChange}
                            value={selectedLayer && selectedLayer.id}
                        />
                    </div>
                )}
                {selectedLayer && (
                    <MapSource
                        key={selectedLayer.id}
                        sourceKey={`flood-source-${selectedLayer && selectedLayer.id}`}
                        rasterTiles={rasterTile}
                    >
                        <MapLayer
                            layerKey={`layer-${selectedLayer && selectedLayer.id}`}
                            type="raster"
                            paint={{
                                'raster-opacity': 0.5,
                            }}
                        />
                    </MapSource>
                )}
            </div>
        );
    }
}
