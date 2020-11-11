import React from 'react';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

interface ArchivePollution extends PageType.DataArchivePollution {
    createdOn: string;
    province: string;
    district: string;
    point: {
        type: string;
        coordinates: [number, number];
    };
}

interface Props {
    latestPollutionDetail: ArchivePollution;
}

const defaltLngLat = [0, 0];
const emptyObject = {};
const Details = (props: Props) => {
    const { latestPollutionDetail } = props;
    console.log('Latest Data: ', latestPollutionDetail);
    const { title, point, description, province, district } = latestPollutionDetail || emptyObject;
    const { coordinates } = point || emptyObject;
    const [longitude, latittude] = coordinates || defaltLngLat;
    return (
        <div className={styles.details}>
            <div className={styles.item}>
                <div className={styles.title}>
                    Station Name
                </div>
                <div className={styles.value}>
                    {title || 'N/A'}
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.title}>
                    Province
                </div>
                <div className={styles.value}>
                    {province || 'N/A'}
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.title}>
                    Longitude
                </div>
                <div className={styles.value}>
                    {longitude || 'N/A'}
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.title}>
                    District
                </div>
                <div className={styles.value}>
                    {district || 'N/A'}
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.title}>
                    Latitude
                </div>
                <div className={styles.value}>
                    {latittude || 'N/A'}
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.title}>
                    Description
                </div>
                <div className={styles.value}>
                    {description || 'N/A'}
                </div>
            </div>
        </div>
    );
};

export default Details;
