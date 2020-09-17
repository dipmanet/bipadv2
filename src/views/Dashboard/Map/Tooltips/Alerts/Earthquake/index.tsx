/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';

import styles from './styles.scss';

interface ReferenceData {
    fields: {
        created_on: string;
        modified_on: string;
        description: string;
        point: string;
        magnitude: string;
        address: string;
        event_on: string;
    };
}

const nullData = {
    fields: {
        created_on: '',
        modified_on: '',
        description: '',
        point: '',
        magnitude: '',
        address: '',
        event_on: '',
    },
};

const EarthquakeToolTip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
) => {
    const { fields:
        { address: epicenter,
            magnitude,
            created_on: measuredOn,
            description: referenceDescription } } = referenceData || nullData;
    return (
        <div className={styles.earthquakeTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>{epicenter ? `Earthquake at ${epicenter}` : title || 'N/A'}</div>
                <div className={styles.date}>
                    { createdDate
                        ? `${createdDate.split('T')[0]} | ${createdDate.split('T')[1].split('.')[0]} (NPT)`
                        : 'N/A' }
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.magnitude}>
                    <div className={styles.title}>Magnitude:</div>
                    <div className={styles.value}>{magnitude ? `${magnitude} ML` : 'N/A'}</div>
                </div>

                <div className={styles.source}>
                    <div className={styles.title}>SOURCE:</div>
                    <a
                        href="https://www.seismonepal.gov.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.value}
                    >
                    Department of Mines and Geology
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EarthquakeToolTip;
