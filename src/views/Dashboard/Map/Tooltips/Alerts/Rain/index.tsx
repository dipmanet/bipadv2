import React from 'react';

import styles from './styles.scss';

interface Average {
    interval: number;
    status: {
        danger: boolean;
        warning: boolean;
    };
    value: number;
}
interface ReferenceData {
    fields: {
        averages: Average[];
        basin: string;
        created_on: string;
        title: string;
    };
}

const RainTooltip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
) => {
    const {
        fields:
        { averages,
            basin,
            created_on: createdOn,
            title: referenceDataTitle },
    } = referenceData;

    const oneHourInterval = averages[0].value;
    const threeHourInterval = averages[1].value;
    const sixHourInterval = averages[2].value;
    const twelveHourInterval = averages[3].value;
    const twentyFourHourInterval = averages[4].value;

    let renderedTitle;
    if (title.toUpperCase() === 'HEAVY RAINFALL') {
        renderedTitle = `Heavy Rainfall at ${referenceDataTitle}`;
    } else {
        renderedTitle = title;
    }

    return (
        <div className={styles.rainfallTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>{renderedTitle}</div>
                <div className={styles.date}>{createdDate.split('T')[0] || 'N/A'}</div>
            </div>
            <div className={styles.content}>
                <div className={styles.basin}>
                    <div className={styles.title}>Basin:</div>
                    <div className={styles.value}>{basin || 'N/A'}</div>
                </div>
                <div className={styles.station}>
                    <div className={styles.title}>Station Name:</div>
                    <div className={styles.value}>{referenceDataTitle || 'N/A'}</div>
                </div>
                <div className={styles.rainfall}>
                    <div className={styles.title}>
                        Accumulated Rainfall:
                    </div>
                    <div className={styles.rainfallList}>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>1 Hour</div>
                            <div className={styles.value}>{`${oneHourInterval} mm`}</div>
                        </div>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>3 Hour</div>
                            <div className={styles.value}>{`${threeHourInterval} mm`}</div>
                        </div>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>6 Hour</div>
                            <div className={styles.value}>{`${sixHourInterval} mm`}</div>
                        </div>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>12 Hour</div>
                            <div className={styles.value}>{`${twelveHourInterval} mm`}</div>
                        </div>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>24 Hour</div>
                            <div className={styles.value}>{`${twentyFourHourInterval} mm`}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.source}>
                    <div className={styles.title}>Source:</div>
                    <a
                        href="http://hydrology.gov.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.value}
                    >
                        Department of Hydrology and Meteorology
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RainTooltip;
