import React from 'react';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import PollutionIcon from '#resources/icons/AirQuality.svg';
import Legend from '#rscz/Legend';

import styles from './styles.scss';

const pollutionLegendItems = [
    { color: '#009966', label: 'Good (<= 12)', style: styles.symbol },
    { color: '#ffde33', label: 'Moderate (<= 35.4)', style: styles.symbol },
    { color: '#ff9933', label: 'Unhealthy for Sensitive Groups (<= 55.4)', style: styles.symbol },
    { color: '#cc0033', label: 'Unhealthy (<= 150.4)', style: styles.symbol },
    { color: '#660099', label: 'Very Unhealthy (<= 350.4)', style: styles.symbol },
    { color: '#7e0023', label: 'Hazardous (<= 500.4)', style: styles.symbol },
];

const itemSelector = (d: { label: string }) => d.label;
const legendColorSelector = (d: { color: string }) => d.color;
const legendLabelSelector = (d: { label: string }) => d.label;
const classNameSelector = (d: { style: string }) => d.style;

const PollutionLegend = () => {
    console.log('Pollution Legend');
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
                data={pollutionLegendItems}
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
