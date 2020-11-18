import React from 'react';
import DateInput from '#rsci/DateInput';

import styles from './styles.scss';

const DateSelector = () => {
    console.log('Date selector');
    return (
        <div className={styles.dateSelector}>
            <DateInput
                label="Start Date"
                className={styles.input}
            />
            <div className={styles.seperator}>
                To
            </div>
            <DateInput
                label="End Date"
                className={styles.input}
            />
        </div>
    );
};

export default DateSelector;
