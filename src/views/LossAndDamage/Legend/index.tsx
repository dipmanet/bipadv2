import React from 'react';
import styles from './styles.scss';

export const legentItemsTest = [
    {
        name: '0-100',
        color: 'red',
        value: ['>0', '<=100'],
    },
    {
        name: '100-200',
        color: 'orange',
        value: ['>100', '<=200'],
    },
    {
        name: '200-300',
        color: 'yellow',
        value: ['>200', '<=300'],
    },
    {
        name: '300-400',
        color: 'green',
        value: ['>300', '<=400'],
    },
    {
        name: '400-500',
        color: 'blue',
        value: ['>400', '<=500'],
    },
    {
        name: '500-600',
        color: 'pink',
        value: ['>500', '<=600'],
    },
    {
        name: '600-700',
        color: 'aquamarine',
        value: ['>600', '<=700'],
    },
    {
        name: '700-more',
        color: 'black',
        value: ['>700', '>700'],
    },

];

const Legend = () => {
    const legentItems = [
        {
            name: '0-100',
            color: '#f7d8bf',
            value: '0-100',
        },
        {
            name: '100-200',
            color: '#f3c6a7',
            value: '100-200',
        },
        {
            name: '200-300',
            color: '#eeb191',
            value: '200-300',
        },
        {
            name: '300-400',
            color: '#e69a7a',
            value: '300-400',
        },
        {
            name: '400-500',
            color: '#e08466',
            value: '400-500',
        },
        {
            name: '500-600',
            color: '#e08466',
            value: '500-600',
        },
        {
            name: '600-700',
            color: '#db6e51',
            value: '600-700',
        },
        {
            name: '700-more',
            color: '#d4543d',
            value: '700-more',
        },

    ];
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {
                    legentItemsTest.map(item => (
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
};

export default Legend;
