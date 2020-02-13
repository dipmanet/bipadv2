import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Numeral from '#rscv/Numeral';

import { Layer } from '#types';
import { getRasterLegendUrl } from '#utils/domain';
import { imageUrlToDataUrl } from '#utils/common';

import styles from './styles.scss';

interface Props {
    className?: string;
    layer?: Layer;
}

class LayerLegend extends React.PureComponent<Props> {
    public state = {
        loadingLegend: false,
        rasterLegendDataUrl: undefined,
    }

    private loadLegendImage = memoize((layer) => {
        if (layer.type !== 'raster') {
            return;
        }

        this.setState({ loadingLegend: true });
        imageUrlToDataUrl(getRasterLegendUrl(layer), (dataUrl) => {
            this.setState({
                loadingLegend: false,
                rasterLegendDataUrl: dataUrl,
            });
        });
    })

    public render() {
        const {
            className,
            layer,
        } = this.props;

        if (!layer) {
            return null;
        }

        this.loadLegendImage(layer);

        return (
            <div className={_cs(className, styles.legend, 'map-legend-container')}>
                <header className={styles.header}>
                    <h5 className={styles.heading}>
                        { layer.legendTitle || 'Legend' }
                    </h5>
                </header>
                { layer.type === 'raster' && this.state.loadingLegend && (
                    <div className={styles.loadingMessage}>
                        loading legend...
                    </div>
                )}
                { layer.type === 'raster' && this.state.rasterLegendDataUrl && (
                    <div className={styles.rasterLegend}>
                        <img
                            className={styles.rasterLegendImage}
                            src={this.state.rasterLegendDataUrl}
                            alt={layer.layername}
                        />
                    </div>
                )}
                { layer.type === 'choropleth' && (
                    <div className={styles.choroplethLegend}>
                        { Object.keys(layer.legend).map((color) => {
                            const value = layer.legend[color];

                            return (
                                <div
                                    className={styles.legendElement}
                                    key={color}
                                >
                                    <div
                                        className={styles.color}
                                        style={{ backgroundColor: color }}
                                    />
                                    <div className={styles.value}>
                                        <Numeral
                                            normal
                                            value={value}
                                            precision={1}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}

export default LayerLegend;
