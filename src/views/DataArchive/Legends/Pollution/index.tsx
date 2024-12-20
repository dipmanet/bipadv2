import React, { useContext } from 'react';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import PollutionIcon from '#resources/icons/AirQuality.svg';
import Legend from '#rscz/Legend';
import * as PageType from '#store/atom/page/types';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';

import styles from './styles.scss';

interface LegendItem {
    key?: string;
    color: string;
    label: string;
    style: string;
    radius?: number;
    order: number;
}

const pollutionLegendItems = [
    { order: 1, color: '#00fa2f', key: 'good', label: 'Good (0 - 50)', style: styles.symbol },
    { order: 2, color: '#f7ff00', key: 'moderate', label: 'Moderate (51 - 100)', style: styles.symbol },
    { order: 3, color: '#ff7300', key: 'unhealthyForSensitive', label: 'Unhealthy for Sensitive Groups (101 - 150)', style: styles.symbol },
    { order: 4, color: '#ff0000', key: 'unhealthy', label: 'Unhealthy (151 - 200)', style: styles.symbol },
    { order: 5, color: '#9e0095', key: 'veryUnhealthy', label: 'Very Unhealthy (201 - 300)', style: styles.symbol },
    { order: 6, color: '#8a0014', key: 'hazardous', label: 'Hazardous (301 - 400)', style: styles.symbol },
    { order: 7, color: '#8a0014', key: 'veryHazardous', label: 'Very Hazardous (401 - 500)', style: styles.symbol },
];

// pollution
const getPollutionRanges = (pollutionItems: PageType.RealTimePollution[]) => {
    const allLegendKeys: string[] = [];
    pollutionItems.forEach((item) => {
        const { aqi } = item;
        if (aqi <= 50) {
            allLegendKeys.push('good');
            return;
        }
        if (aqi <= 100) {
            allLegendKeys.push('moderate');
            return;
        }
        if (aqi <= 150) {
            allLegendKeys.push('unhealthyForSensitive');
            return;
        }
        if (aqi <= 200) {
            allLegendKeys.push('unhealthy');
            return;
        }
        if (aqi <= 300) {
            allLegendKeys.push('veryUnhealthy');
            return;
        }
        if (aqi <= 400) {
            allLegendKeys.push('hazardous');
            return;
        }
        if (aqi < 400) {
            allLegendKeys.push('veryHazardous');
        }
    });
    const uniqueLegends = [...new Set(allLegendKeys)];
    return uniqueLegends;
};

export const getPollutionLegends = (
    pollutionItems: PageType.RealTimePollution[],
    items: LegendItem[],
) => {
    const pollutionRanges = getPollutionRanges(pollutionItems);
    const pollutionLegends: LegendItem[] = [];
    // eslint-disable-next-line array-callback-return
    pollutionRanges.map((ranges) => {
        // eslint-disable-next-line array-callback-return
        items.map((legendItem) => {
            const { key } = legendItem;
            if (key === ranges) {
                pollutionLegends.push(legendItem);
            }
        });
    });
    const sortedPollutionLegends = pollutionLegends.sort((a, b) => (a.order > b.order ? 1 : -1));
    return sortedPollutionLegends;
};

const itemSelector = (d: { label: string }) => d.label;
const legendColorSelector = (d: { color: string }) => d.color;
const legendLabelSelector = (d: { label: string }) => d.label;
const classNameSelector = (d: { style: string }) => d.style;

const PollutionLegend = () => {
    const {
        data,
    }: DataArchiveContextProps = useContext(DataArchiveContext);
    const autoPollutionLegends = getPollutionLegends(
        data || [],
        pollutionLegendItems,
    );
    return (
        <div className={styles.legendContainer}>
            <header className={styles.header}>
                <ScalableVectorGraphics
                    className={styles.legendIcon}
                    src={PollutionIcon}
                    alt="Pollution"
                />
                <h4 className={styles.heading}>
                        Pollution (AQI Value)
                </h4>
            </header>
            <Legend
                className={styles.legend}
                data={autoPollutionLegends || pollutionLegendItems}
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
                    href="http://mofe.gov.np"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                        Ministry of Forests and Environment
                </a>
            </div>
        </div>
    );
};

export default PollutionLegend;
