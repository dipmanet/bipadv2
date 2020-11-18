import React, { useState } from 'react';
import DateInput from '#rsci/DateInput';

import styles from './styles.scss';

const DateSelector = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (newStartDate: string) => {
        setStartDate(newStartDate);
    };

    const handleEndDateChange = (newEndDate: string) => {
        setEndDate(newEndDate);
    };

    return (
        <div className={styles.dateSelector}>
            <DateInput
                label="Start Date"
                className={styles.input}
                value={startDate}
                onChange={handleStartDateChange}
            />
            <div className={styles.seperator}>
                To
            </div>
            <DateInput
                label="End Date"
                className={styles.input}
                value={endDate}
                onChange={handleEndDateChange}
            />
        </div>
    );
};

export default DateSelector;
