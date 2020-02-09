import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Numeral from '#rscv/Numeral';

import { Layer } from '#types';
import { getRasterLegendUrl } from '#utils/domain';

import styles from './styles.scss';

interface Props {
    className?: string;
    layer?: Layer;
}

class LayerLegend extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            layer,
        } = this.props;

        if (!layer) {
            return null;
        }

        return (
            <div className={_cs(className, styles.legend)}>
                <header className={styles.header}>
                    <h5 className={styles.heading}>
                        { layer.legendTitle || 'Legend' }
                    </h5>
                </header>
                { layer.type === 'raster' && (
                    <div className={styles.rasterLegend}>
                        <img
                            className={styles.rasterLegendImage}
                            src={getRasterLegendUrl(layer)}
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
