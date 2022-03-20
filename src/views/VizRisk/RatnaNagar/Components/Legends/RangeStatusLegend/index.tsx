/* eslint-disable max-len */
import React from 'react';
import styles from './styles.scss';

const RangeStatusLegend = () => {
    const data = [
        {
            status: 'Very High',
            color: '#e75d4f',
        },
        {
            status: 'High',
            color: '#e79546',
        },
        {
            status: 'Medium',
            color: '#2af5ac',
        },
        {
            status: 'Low',
            color: '#45c4fe',
        },
        {
            status: 'Very Low',
            color: '#457ded',
        },
    ];

    return (
        <div className={styles.mainStatusLegendContainer}>
            {
                data.map(item => (
                    <div key={item.status} className={styles.statusSection}>
                        <div style={{ backgroundColor: item.color }} className={styles.statusColor} />
                        <p className={styles.statusname}>{item.status}</p>
                    </div>
                ))
            }
        </div>

    );
};

export default RangeStatusLegend;
