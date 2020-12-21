/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';

import styles from './styles.scss';

interface ReferenceData {
    fields: {
        brightness: number;
        confidence?: number;
        created_on?: string;
        event_on?: string;
        land_cover: string;
        modified_on: string;
        point: string;
        scan: number;
        title: string;
    };
}

const nullData = {
    fields: {
        brightness: 0,
        confidence: 0,
        created_on: undefined,
        event_on: undefined,
        land_cover: '',
        modified_on: '',
        point: '',
        scan: 0,
        title: '',
    },
};

const FireTooltip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
) => {
    const { fields:
        { title: headerTitle,
            land_cover: landCover,
            brightness } } = referenceData || nullData;
    const date = createdDate.split('T')[0];
    const time = createdDate.split('T')[1].split('+')[0];
    const timeOnly = time.split(':').slice(0, 2).join(':');
    return (
        <div className={styles.fireTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>{headerTitle || 'N/A'}</div>
                <div className={styles.date}>
                    { createdDate
                        ? `${date} | ${timeOnly} (NPT)`
                        : 'N/A' }
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.landCover}>
                    <div className={styles.title}>Land Cover:</div>
                    <div className={styles.value}>{landCover || 'N/A'}</div>
                </div>
                <div className={styles.brightness}>
                    <div className={styles.title}>Brightness:</div>
                    <div className={styles.value}>{brightness || 'N/A'}</div>
                </div>
                <div className={styles.source}>
                    <div className={styles.title}>SOURCE:</div>
                    <a
                        href="https://www.icimod.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.value}
                    >
                        International Centre for Integrated Mountain Development
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FireTooltip;
