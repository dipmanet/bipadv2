import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Switch from 'react-input-switch';

import Option from '#components/RadioInput/Option';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';
import { LayerHierarchy } from '#types';

import styles from './styles.scss';

interface Props {
    className?: string;
    data: LayerHierarchy;
}

class LayerSelectionItem extends React.PureComponent<Props> {
    private handleChange = (value: boolean) => {
        const { data } = this.props;
        const {
            addLayer,
            removeLayer,
        } = this.context;

        if (value) {
            addLayer(data);
        } else {
            removeLayer(data.id);
        }
    }

    // TOOD: memoize
    private getIsActive = (activeLayers: LayerHierarchy[], layerKey: LayerHierarchy['id']) => {
        const layerIndex = activeLayers.findIndex(d => d.id === layerKey);
        return layerIndex !== -1;
    }

    public render() {
        const {
            className,
            data,
        } = this.props;

        const { activeLayers } = this.context;
        const isActive = this.getIsActive(activeLayers, data.id);

        return (
            <div className={_cs(className, styles.layerSelectionItem)}>
                <div className={styles.switchInput}>
                    <Switch
                        className={styles.switch}
                        on
                        off={false}
                        value={isActive}
                        onChange={this.handleChange}
                    />
                    <div className={styles.label}>
                        { data.title }
                    </div>
                </div>
            </div>
        );
    }
}

LayerSelectionItem.contextType = RiskInfoLayerContext;
export default LayerSelectionItem;
