import React from 'react';
import { _cs } from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';
import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import { LayerWithGroup } from '#store/atom/page/types';
import { getRasterTile } from '#utils/domain';
import { OpacityElement } from '#types';
import ExpandableView from '#components/ExpandableView';
import RadioInput from '#components/RadioInput';
import RiskDescription from '#components/RiskDescription';
import OpacityInput from '#components/OpacityInput';

import styles from './styles.scss';

interface Props {
    id: number;
    title: string;
    description: string;
    layers: LayerWithGroup[];
    className: string;
}

interface State {
    selectedLayer: LayerWithGroup | undefined;
    rasterTile: string[];
    layerOpacity: number;
}

const labelSelector = (d: LayerWithGroup) => d.title;
const keySelector = (d: LayerWithGroup) => d.id;

export default class Group extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            rasterTile: [],
            selectedLayer: undefined,
            layerOpacity: 1,
        };
    }

    private handleLayerUnselect = () => {
        this.setState({
            selectedLayer: undefined,
        });
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
                            { selectedLayer && (
                                <OpacityInput
                                    inputKey={selectedLayer.id}
                                    onChange={this.handleOpacityInputChange}
                                />
                            )}
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
                        </>
                    )}
                />
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
                                'raster-opacity': layerOpacity,
                            }}
                        />
                    </MapSource>
                )}
            </>
        );
    }
}
