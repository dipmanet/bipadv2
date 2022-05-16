/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import styles from './styles.scss';

const RangeStatusLegend = () => {
    const {
        setRangeValues,
    } = useContext(MainPageDataContext);

    const data = [
        {
            name: 'very_high',
            status: 'Very High(6.5 - 10)',
            color: '#e75d4f',
            range: [6.5, 10],
        },
        {
            name: 'high',
            status: 'High(5 - 6.4)',
            color: '#e79546',
            range: [5, 6.4],

        },
        {
            name: 'medium',
            status: 'Medium(3.5 - 4.9)',
            color: '#2af5ac',
            range: [3.5, 4.9],

        },
        {
            name: 'low',
            status: 'Low(2 - 3.4)',
            color: '#45c4fe',
            range: [2, 3.4],

        },
        {
            name: 'very_low',
            status: 'Very Low(0 - 1.9)',
            color: '#457ded',
            range: [0, 1.9],

        },
    ];

    return (
        <div className={styles.mainStatusLegendContainer}>
            {
                data.map(item => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <div
                        key={item.status}
                        className={styles.statusSection}
                        onClick={() => setRangeValues(item.range)}
                    >
                        <div
                            style={{ backgroundColor: item.color }}
                            className={styles.statusColor}
                        />
                        <p className={styles.statusname}>{item.status}</p>
                    </div>
                ))
            }
        </div>

    );
};

export default RangeStatusLegend;
