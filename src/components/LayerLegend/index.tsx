import React, { useState, useEffect } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Numeral from '#rscv/Numeral';

import { Layer } from '#types';
import { getRasterLegendUrl } from '#utils/domain';
import { imageUrlToDataUrl } from '#utils/common';

import styles from './styles.scss';

interface RasterLegendProps {
    layerName: string;
}

const RasterLegend = (props: RasterLegendProps) => {
    const {
        layerName,
    } = props;
    const [loadingLegend, setLoadingLegend] = useState(true);
    const [rasterLegendDataUrl, setRasterLegendDataUrl] = useState<string|undefined>();

    useEffect(
        () => {
            const url = getRasterLegendUrl({ layername: layerName });
            imageUrlToDataUrl(
                url,
                (dataUrl: string) => {
                    setLoadingLegend(false);
                    setRasterLegendDataUrl(dataUrl);
                },
            );
        },
        [layerName],
    );

    return (
        <>
            { loadingLegend && (
                <div className={styles.loadingMessage}>
                    loading legend...
                </div>
            )}
            { rasterLegendDataUrl && (
                <div className={styles.rasterLegend}>
                    <img
                        className={styles.rasterLegendImage}
                        src={rasterLegendDataUrl}
                        alt={layerName}
                    />
                </div>
            )}
        </>
    );
};

interface ChoroplethLegendProps {
    minValue: Layer['minValue'];
    legend: Layer['legend'];
}

const ChoroplethLegend = ({ minValue, legend }: ChoroplethLegendProps) => (
    <div className={styles.choroplethLegend}>
        { isDefined(minValue) && (
            <Numeral
                className={styles.min}
                normal
                value={minValue}
                precision={2}
            />
        )}
        { Object.keys(legend).map((color) => {
            const value = legend[color];
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
);

interface Props {
    className?: string;
    layer?: {
        type: 'raster';
        layername: string;
        legendTitle?: string;
    } | {
        type: 'choropleth';
        minValue: number;
        legend: Layer['legend'];
        legendTitle?: string;
    };
}

const LayerLegend = (props: Props) => {
    const {
        className,
        layer,
    } = props;

    if (!layer) {
        return null;
    }

    return (
        <div className={_cs(className, styles.legend, 'map-legend-container')}>
            <header className={styles.header}>
                <h5 className={styles.heading}>
                    { layer.legendTitle || 'Legend' }
                </h5>
            </header>
            {layer.type === 'raster' && (
                <RasterLegend
                    layerName={layer.layername}
                />
            )}
            { layer.type === 'choropleth' && (
                <ChoroplethLegend
                    minValue={layer.minValue}
                    legend={layer.legend}
                />
            )}
        </div>
    );
};

export default LayerLegend;
