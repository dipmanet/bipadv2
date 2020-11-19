import React, { useState } from 'react';
import { FaramInputElement } from '@togglecorp/faram';
import DateInput from '#rsci/DateInput';

import styles from './styles.scss';

interface Props {
    onChange: Function;
    value: {
        startDate: string;
        endDate: string;
    };
}
const DateSelector = (props: Props) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { onChange, value } = props;
    const handleStartDateChange = (newStartDate: string) => {
        setStartDate(newStartDate);
        onChange({ ...value, startDate: newStartDate, endDate });
    };

    const handleEndDateChange = (newEndDate: string) => {
        setEndDate(newEndDate);
        onChange({ ...value, endDate: newEndDate, startDate });
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

export default FaramInputElement(DateSelector);
