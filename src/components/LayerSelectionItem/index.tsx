import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Switch from 'react-input-switch';

import LayerDetailModalButton from '#components/LayerDetailModalButton';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';

import { LayerHierarchy } from '#types';

import styles from './styles.scss';

interface Props {
    className?: string;
    data: LayerHierarchy;
    disabled?: boolean;
}

class LayerSelectionItem extends React.PureComponent<Props> {
    private handleChange = (value: boolean) => {
        const { data } = this.props;
        const {
            addLayer,
            removeLayer,
        } = this.context;
        console.log('final data>>>', data);
        if (value) {
            addLayer(data);
        } else {
            removeLayer(data.id);
        }
    }

    // TOOD: memoize
    private getIsActive = (activeLayers: LayerHierarchy[], layerKey: LayerHierarchy['id']) => {
        // console.log('this is layer>>>', layerKey);
        // console.log('This is active inside>>>', activeLayers);
        const layerIndex = activeLayers.findIndex(d => d.id === layerKey);
        // let demo = [];
        // if (activeLayers.length > 1 && layerIndex !== -1) {
        //     demo = activeLayers.filter(item => item.id === layerKey);
        //     console.log('this demo>>>', demo);
        //     activeLayers.push(demo[0]);
        // }


        // console.log('This index>>>', layerIndex);

        return layerIndex !== -1;
    }

    public render() {
        const {
            className,
            data,
            disabled,
        } = this.props;

        const { activeLayers } = this.context;
        const isActive = this.getIsActive(activeLayers, data.id);

        return (
            <div className={_cs(className, styles.layerSelectionItem)}>
                <div className={styles.switchInput}>
                    <Switch
                        disabled={disabled}
                        className={styles.switch}
                        on
                        off={false}
                        value={isActive}
                        onChange={this.handleChange}
                    />
                    <div className={styles.title}>
                        { data.title }
                    </div>
                    <div className={styles.actions}>
                        { data.actions }
                        { (data.longDescription || data.metadata) && (
                            <LayerDetailModalButton
                                layer={data}
                                className={styles.infoButton}
                            />
                        )}
                    </div>
                </div>
                { data.shortDescription && (
                    <div className={_cs('layer-selection-item-short-description', styles.shortDescription)}>
                        { data.shortDescription }
                    </div>
                )}
            </div>
        );
    }
}

LayerSelectionItem.contextType = RiskInfoLayerContext;
export default LayerSelectionItem;
