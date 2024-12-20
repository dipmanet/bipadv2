/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-tabs */
import React, { useState, useEffect } from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import { Translation } from 'react-i18next';
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
    const [rasterLegendDataUrl, setRasterLegendDataUrl] = useState<string | undefined>();

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
        <Translation>
            {
                t => (
                    <>
                        {loadingLegend && (
                            <div className={styles.loadingMessage}>
                                {t('loading legend...')}
                            </div>
                        )}
                        {rasterLegendDataUrl && (
                            <div className={styles.rasterLegend}>
                                <img
                                    className={styles.rasterLegendImage}
                                    src={rasterLegendDataUrl}
                                    alt={layerName}
                                />
                            </div>
                        )}
                    </>
                )
            }

        </Translation>

    );
};

interface ChoroplethLegendProps {
    minValue: Layer['minValue'];
    legend: Layer['legend'];
    maxValueCapped: boolean;
}

const getPrecision = (value: number | string) => {
    const numericValue = +value;

    if (Number.isNaN(numericValue)) {
        return 0;
    }

    const diff = numericValue - Math.floor(numericValue);

    if (diff === 0) {
        return 0;
    }

    if (diff >= 0.1) {
        return 1;
    }

    return 2;
};

const ChoroplethLegend = ({ minValue, legend, maxValueCapped }: ChoroplethLegendProps) => {
    const legendKeys = Object.keys(legend);
    const lastElementKey = legendKeys.pop();
    const lastElementValue = lastElementKey ? legend[lastElementKey] : 0;

    return (
        <div className={styles.choroplethLegend}>
            {isDefined(minValue) && (
                <Numeral
                    className={styles.min}
                    normal
                    value={minValue}
                    precision={getPrecision(minValue)}
                />
            )}
            {legendKeys.map((color) => {
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
                                precision={getPrecision(value)}
                            />
                        </div>
                    </div>
                );
            })}
            <div
                className={styles.legendElement}
                key={lastElementKey}
            >
                <div
                    className={styles.color}
                    style={{ backgroundColor: lastElementKey }}
                />
                <div className={styles.value}>
                    <Numeral
                        normal
                        value={lastElementValue}
                        precision={getPrecision(lastElementValue)}
                    />
                    {maxValueCapped && '+'}
                </div>
            </div>
        </div>
    );
};

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
        language,
    } = props;

    if (!layer) {
        return null;
    }

    return (
        <div className={_cs(className, styles.legend, 'map-legend-container')}>
            <header className={styles.header}>
                <h5 className={styles.heading}>
                    {/* {layer.legendTitle || 'Legend'} */}
                    {language === 'en' ? layer.legendTitle
                        ? layer.legendTitle
                        : 'Legend'
                        : layer.legendTitleNe
                            ? layer.legendTitleNe
                            : layer.legendTitle
                                ? layer.legendTitle
                                : 'Legend'
                    }

                </h5>
            </header>
            {layer.type === 'raster' && (
                <RasterLegend
                    layerName={layer.layername}
                />
            )}
            {layer.type === 'choropleth' && (
                <ChoroplethLegend
                    minValue={layer.minValue}
                    legend={layer.legend}
                    maxValueCapped={layer.maxValueCapped}
                />
            )}
        </div>
    );
};

export default LayerLegend;
