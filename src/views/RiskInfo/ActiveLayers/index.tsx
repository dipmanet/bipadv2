import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Button from '#rsca/Button';
import SortableListView from '#rscv/SortableListView';
import RiskInfoLayerContext from '#components/RiskInfoLayerContext';

import OpacityInput from '#components/OpacityInput';

import styles from './styles.scss';

interface Props {
    className?: string;
}

const ActiveLayer = ({
    className,
    layer,
    onRemoveButtonClick,
    onOpacityChange,
}) => (
    <div className={styles.activeLayer}>
        <header className={styles.header}>
            <h4 className={styles.heading}>
                { layer.title }
            </h4>
            <Button
                transparent
                className={styles.removeLayerButton}
                iconName="close"
                onClick={() => onRemoveButtonClick(layer)}
            />
        </header>
        <div className={styles.content}>
            <OpacityInput
                value={layer.opacity}
                onChange={(key, value) => onOpacityChange(layer, value)}
            />
        </div>
    </div>
);

class ActiveLayers extends React.PureComponent<Props> {
    private handleRemoveButtonClick = (layer) => {
        const { removeLayer } = this.context;
        removeLayer(layer.id);
    }

    private handleOpacityChange = (layer, opacity) => {
        const { addLayer } = this.context;
        addLayer({
            ...layer,
            opacity,
        });
    }

    private getRendererParams = (key, layer) => ({
        layer,
        onRemoveButtonClick: this.handleRemoveButtonClick,
        onOpacityChange: this.handleOpacityChange,
    })

    private getData = memoize(data => (
        [...data].reverse()
    ))

    private handleChange = (data) => {
        const { setLayers } = this.context;
        setLayers([...data].reverse());
    }

    public render() {
        const { className } = this.props;
        const {
            activeLayers,
        } = this.context;

        return (
            <div className={_cs(styles.activeLayers, className)}>
                <h4 className={styles.heading}>
                    Active layers
                </h4>
                <SortableListView
                    className={styles.content}
                    itemClassName={styles.activeLayerContainer}
                    data={this.getData(activeLayers)}
                    renderer={ActiveLayer}
                    rendererParams={this.getRendererParams}
                    keySelector={d => String(d.id)}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

ActiveLayers.contextType = RiskInfoLayerContext;

export default ActiveLayers;
