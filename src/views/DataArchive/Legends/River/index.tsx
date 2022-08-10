import React, { useContext } from 'react';
import * as PageType from '#store/atom/page/types';
import { LegendItem } from '#views/DataArchive/types';

import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import RiverIcon from '#resources/icons/Wave.svg';
import Legend from '#rscz/Legend';

import styles from './styles.scss';

const riverLegendItems = [
    { order: 1, color: '#7CB342', label: 'Below Warning Level and Steady', style: styles.box },
    { order: 2, color: 'transparent', label: 'Below Warning Level and Rising', style: styles.triangleRisingBelowWarning },
    { order: 3, color: 'transparent', label: 'Below Warning Level and Falling', style: styles.triangleFallingBelowWarning },
    { order: 4, color: '#FDD835', label: 'Above Warning Level and Steady', style: styles.box },
    { order: 5, color: 'transparent', label: 'Above Warning Level and Rising', style: styles.triangleRisingAboveWarning },
    { order: 6, color: 'transparent', label: 'Above Warning Level and Falling', style: styles.triangleFallingAboveWarning },
    { order: 7, color: '#E53935', label: 'Above Danger Level and Steady', style: styles.box },
    { order: 8, color: 'transparent', label: 'Above Danger Level and Rising', style: styles.triangleRisingAboveDanger },
    { order: 9, color: 'transparent', label: 'Above Danger Level and Falling', style: styles.triangleFallingAboveDanger },
];

const noLegend = [
    { color: 'transparent', label: 'No legends to display', style: styles.noSymbol },
];

export const getAutoRealTimeRiverLegends = (
    dataList: PageType.RealTimeRiver[],
    legendItems: LegendItem[],
) => {
    const uniqueLegendItems = [...new Set(dataList.map(
        item => `${item.status} and ${item.steady || 'steady'}`.toUpperCase(),
    ))];
    const autoLegends: LegendItem[] = [];
    uniqueLegendItems.forEach((item) => {
        legendItems.forEach((legendItem) => {
            if (item === legendItem.label.toUpperCase()) {
                autoLegends.push(legendItem);
            }
        });
    });

    return autoLegends;
};

const itemSelector = (d: { label: string }) => d.label;
const legendColorSelector = (d: { color: string }) => d.color;
const legendLabelSelector = (d: { label: string }) => d.label;
const classNameSelector = (d: { style: string }) => d.style;

const RiverLegend = () => {
    const {
        data,
    }: DataArchiveContextProps = useContext(DataArchiveContext);
    const autoRiverLegends = getAutoRealTimeRiverLegends(
        data || [], riverLegendItems,
    );
    return (
        <div className={styles.legendContainer}>
            <header className={styles.header}>
                <ScalableVectorGraphics
                    className={styles.legendIcon}
                    src={RiverIcon}
                    alt="River"
                />
                <h4 className={styles.heading}>
                    River
                </h4>
            </header>
            <Legend
                className={styles.legend}
                data={
                    (data || []).length
                        ? autoRiverLegends
                        : noLegend
                }
                itemClassName={styles.legendItem}
                keySelector={itemSelector}
                labelSelector={legendLabelSelector}
                symbolClassNameSelector={classNameSelector}
                colorSelector={legendColorSelector}
                emptyComponent={null}
            />
            <div className={styles.sourceDetails}>
                <div className={styles.label}>
                    Source:
                </div>
                <a
                    className={styles.link}
                    href="http://hydrology.gov.np"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Department of Hydrology and Meteorology
                </a>
            </div>
        </div>
    );
};

export default RiverLegend;
