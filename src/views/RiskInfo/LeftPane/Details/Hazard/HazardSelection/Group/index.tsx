import React from 'react';
import { _cs } from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';

import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import { LayerWithGroup } from '#store/atom/page/types';

import { OpacityElement } from '#types';
import ExpandableView from '#components/ExpandableView';
import RadioInput from '#components/RadioInput';
import MapLayerLegend from '#components/MapLayerLegend';
import RiskDescription from '#components/RiskDescription';
import OpacityInput from '#components/OpacityInput';
import {
    getRasterTile,
    getRasterLegendURL,
} from '#utils/domain';

import styles from './styles.scss';

interface Props {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
    className?: string;
}

interface State {
    selectedLayer: LayerWithGroup | undefined;
    rasterTile: string[];
    layerOpacity: number;
}

const labelSelector = (d: LayerWithGroup) => d.title;
const keySelector = (d: LayerWithGroup) => d.id;

class Group extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            rasterTile: [],
            selectedLayer: undefined,
            layerOpacity: 1,
        };
    }

    public componentWillUnmount() {
        const { selectedLayer } = this.state;

        if (selectedLayer) {
            this.context.removeLayer(`layer-${selectedLayer.id}`);
        }
    }

    private handleLayerUnselect = () => {
        const { selectedLayer } = this.state;

        if (selectedLayer) {
            this.context.removeLayer(`layer-${selectedLayer.id}`);
        }

        this.setState({
            selectedLayer: undefined,
        });
    }

    private onChange = (layerId: number) => {
        const { layers } = this.props;

        const layer = layers.find(l => l.id === layerId);
        if (layer) {
            const { selectedLayer } = this.state;
            if (selectedLayer) {
                this.context.removeLayer(`layer-${selectedLayer.id}`);
            }

            const rasterTile = getRasterTile(layer);
            this.setState({
                selectedLayer: layer,
                rasterTile: [rasterTile],
            });

            this.context.addLayer({
                title: `${layer.group.title} /  ${layer.title}`,
                id: `layer-${layer.id}`,
                source: `flood-source-${layer.id}`,
            });
        }
    }

    private handleOpacityInputChange = (key: OpacityElement['key'], value: OpacityElement['value']) => {
        this.setState({ layerOpacity: value });
    }

    public render() {
        const {
            title,
            description,
            layers,
            className,
        } = this.props;

        const {
            selectedLayer,
            rasterTile,
            layerOpacity,
        } = this.state;

        return (
            <>
                <ExpandableView
                    className={_cs(className, styles.group)}
                    headerClassName={styles.header}
                    headerContentClassName={styles.headerContent}
                    expandIconClassName={styles.expandIcon}
                    headerContent={title}
                    expandButtonClassName={styles.expandButton}
                    expandableContent={(
                        <>
                            <RiskDescription
                                className={styles.description}
                                text={description}
                            />
                            <RadioInput
                                title={(
                                    <header className={styles.header}>
                                        <h4 className={styles.heading}>
                                            Layers
                                        </h4>
                                        <DangerButton
                                            disabled={!selectedLayer}
                                            onClick={this.handleLayerUnselect}
                                            className={styles.clearButton}
                                            transparent
                                        >
                                            Clear
                                        </DangerButton>
                                    </header>
                                )}
                                className={styles.layerList}
                                contentClassName={styles.content}
                                options={layers}
                                labelSelector={labelSelector}
                                keySelector={keySelector}
                                onChange={this.onChange}
                                value={selectedLayer && selectedLayer.id}
                            />
                            { selectedLayer && (
                                <OpacityInput
                                    inputKey={selectedLayer.id}
                                    onChange={this.handleOpacityInputChange}
                                />
                            )}
                            {selectedLayer && (
                                <MapLayerLegend
                                    legendSrc={getRasterLegendURL(selectedLayer)}
                                    layerTitle={selectedLayer.title}
                                />
                            )}
                        </>
                    )}
                />
                {selectedLayer && (
                    <MapSource
                        sourceKey={`flood-source-${selectedLayer.id}`}
                        sourceOptions={{
                            type: 'raster',
                            tiles: rasterTile,
                            tileSize: 256,
                        }}
                    >
                        <MapLayer
                            layerKey={`layer-${selectedLayer.id}`}
                            layerOptions={{
                                type: 'raster',
                                paint: {
                                    'raster-opacity': layerOpacity,
                                },
                            }}
                        />
                    </MapSource>
                )}
            </>
        );
    }
}

Group.contextType = RiskInfoLayerContext;

export default Group;
