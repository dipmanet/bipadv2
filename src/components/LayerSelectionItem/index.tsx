/* eslint-disable no-nested-ternary */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Switch from 'react-input-switch';

import { connect } from 'react-redux';
import LayerDetailModalButton from '#components/LayerDetailModalButton';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';

import { LayerHierarchy } from '#types';

import { languageSelector } from '#selectors';
import styles from './styles.scss';


interface Props {
    className?: string;
    data: LayerHierarchy;
    disabled?: boolean;
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});
class LayerSelectionItem extends React.PureComponent<Props> {
    private handleChange = (value: boolean) => {
        const { closeTooltip } = this.context;
        const { data } = this.props;
        const {
            addLayer,
            removeLayer,
        } = this.context;
        closeTooltip(undefined);

        if (value) {
            addLayer(data);
        } else {
            removeLayer(data.id);
        }
    }

    // TOOD: memoize
    private getIsActive = (activeLayers: LayerHierarchy[], layerKey: LayerHierarchy['id']) => {
        const layerIndex = activeLayers.findIndex(d => d.id === layerKey);
        // let demo = [];
        // if (activeLayers.length > 1 && layerIndex !== -1) {
        //     demo = activeLayers.filter(item => item.id === layerKey);

        //     activeLayers.push(demo[0]);
        // }


        return layerIndex !== -1;
    }

    public render() {
        const {
            className,
            data,
            disabled,
            language: { language },
        } = this.props;

        const { activeLayers, closeTooltip } = this.context;
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
                        {language === 'en'
                            ? data.title
                            : data.titleNe === undefined
                                ? data.title
                                : data.titleNe

                        }
                    </div>
                    <div className={styles.actions}>
                        {data.actions}
                        {(data.longDescription || data.metadata) && (
                            <LayerDetailModalButton
                                layer={data}
                                className={styles.infoButton}
                            />
                        )}
                    </div>
                </div>
                {data.shortDescription && (
                    <div className={_cs('layer-selection-item-short-description', styles.shortDescription)}>
                        {language === 'en'
                            ? data.shortDescription
                            : data.shortDescriptionNe === undefined
                                ? data.shortDescription
                                : data.shortDescriptionNe

                        }
                    </div>
                )}
            </div>
        );
    }
}

LayerSelectionItem.contextType = RiskInfoLayerContext;
export default connect(mapStateToProps)(LayerSelectionItem);
