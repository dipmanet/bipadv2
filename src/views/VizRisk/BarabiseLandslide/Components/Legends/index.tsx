import React from 'react';
import legendData from './legends';
import styles from './styles.scss';

const Legends = (props) => {
    console.log('legends comp:');
    const { currentPage } = props;
    return (
        <div className={styles.legendsContainer}>
            legendData
        </div>

    );
};
