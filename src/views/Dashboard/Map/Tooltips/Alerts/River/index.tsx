import React from 'react';

import styles from './styles.scss';

interface ReferenceData {
    fields: {
        title: string;
        status: string;
        basin: string;
        water_level: number;
    };
}

const nullData = {
    fields: {
        title: '',
        status: '',
        basin: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        water_level: 0,
    },
};

const RiverTooltip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
) => {
    const { fields:
        { title: headerTitle,
            basin,
            water_level: waterLevel,
            status } } = referenceData || nullData;
    return (
        <div className={styles.riverTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>{headerTitle || 'N/A'}</div>
                <div className={styles.date}>
                    { createdDate
                        ? `${createdDate.split('T')[0]} | ${createdDate.split('T')[1].split('.')[0]} (NPT)`
                        : 'N/A' }
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.basin}>
                    <div className={styles.title}>BASIN:</div>
                    <div className={styles.value}>{basin || 'N/A'}</div>
                </div>
                <div className={styles.station}>
                    <div className={styles.title}>Station Name:</div>
                    <div className={styles.value}>{headerTitle || 'N/A'}</div>
                </div>
                <div className={styles.waterLevel}>
                    <div className={styles.title}>WATER LEVEL</div>
                    <div className={styles.value}>
                        {
                            waterLevel
                                ? `${waterLevel} m`
                                : 'N/A'
                        }
                    </div>
                </div>
                <div className={styles.status}>
                    <div className={styles.title}>STATUS</div>
                    <div className={styles.value}>{status || 'N/A'}</div>
                </div>
                <div className={styles.source}>
                    <div className={styles.title}>SOURCE:</div>
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

export default RiverTooltip;
