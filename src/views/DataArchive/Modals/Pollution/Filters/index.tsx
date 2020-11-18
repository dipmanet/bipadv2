import React from 'react';

import DateSelector from './DateSelector';
import ParameterSelector from './ParameterSelector';

import styles from './styles.scss';

const Filters = () => (
    <div className={styles.filters}>
        <div className={styles.header}>
                Filters
        </div>
        <div className={styles.selectors}>
            <div className={styles.date}>
                <div className={styles.element}>
                    <DateSelector />
                </div>
            </div>
            <div className={styles.parameters}>
                <div className={styles.title}>
                    Parameter Selector
                </div>
                <div className={styles.element}>
                    <ParameterSelector />
                </div>
            </div>
            <div className={styles.period}>
                <div className={styles.title}>
                    Period Selector
                </div>
                <div className={styles.element}>
                    Period Element
                </div>
            </div>
        </div>
    </div>
);

export default Filters;
