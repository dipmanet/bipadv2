import React from 'react';
import styles from './styles.scss';

export const legendItems = [
    {
        name: '0-100',
        color: '#f7d8bf',
        value: 0,
    },
    {
        name: '100-200',
        color: '#f3c7a6',
        value: 100,
    },
    {
        name: '200-300',
        color: '#eeb191',
        value: 200,
    },
    {
        name: '300-400',
        color: '#e79b7a',
        value: 300,
    },
    {
        name: '400-500',
        color: '#e08466',
        value: 400,
    },
    {
        name: '500-600',
        color: '#e08466',
        value: 500,
    },
    {
        name: '600-700',
        color: '#db6e51',
        value: 600,
    },
    {
        name: '700-more',
        color: '#d4543d',
        value: 700,
    },

];

const Legend = () => (
    <div className={styles.container}>
        <div className={styles.wrapper}>
            {
                legendItems.map(item => (
                    <div className={styles.legendItem}>
                        <div
                            className={styles.legendColor}
                            style={{ background: item.color }}
                        />
                        <span className={styles.legendText}>
                            {item.name}
                        </span>
                    </div>
                ))
            }
        </div>

    </div>
);

export default Legend;
