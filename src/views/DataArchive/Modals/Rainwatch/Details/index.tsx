import React from 'react';

import { ArchiveRain } from '../types';
import styles from './styles.scss';

interface Props {
    rainDetails: ArchiveRain;
}

const defaltLngLat = [0, 0];
const emptyObject = {};
const Details = (props: Props) => {
    const { rainDetails } = props;
    const {
        title,
        point,
        description,
        province,
        district,
        basin,
    } = rainDetails || emptyObject;
    const { coordinates } = point || emptyObject;
    const [longitude, latitude] = coordinates || defaltLngLat;
    const { title: provinceTitle } = province || emptyObject;
    const { title: districtTitle } = district || emptyObject;

    const details = [
        // { title: 'Station Name', value: title || 'N/A', style: styles.full },
        // { title: 'Province', value: provinceTitle || 'N/A', style: styles.full },
        { title: 'Station Index', value: '', style: styles.full },
        { title: 'Longitude', value: longitude || 'N/A', style: styles.full },
        { title: 'Latitude', value: latitude || 'N/A', style: styles.full },
        { title: 'District', value: districtTitle || 'N/A', style: styles.full },
        { title: 'Basin', value: basin || 'N/A', style: styles.full },
        { title: 'Description', value: description || 'N/A', style: styles.full },
        { title: 'Warning level in 1 hr', value: '60 mm', style: styles.full },
        { title: 'Warning level in 24 hr', value: '140 mm', style: styles.full },
    ];
    return (
        <div className={styles.details}>
            {details.map((detail) => {
                const { title: itemTitle, value: itemValue, style: itemStyle } = detail;
                return (
                    <div key={itemTitle} className={itemStyle || styles.item}>
                        <div className={styles.title}>
                            {itemTitle}
                        </div>
                        <div className={styles.value}>
                            {itemValue}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Details;
