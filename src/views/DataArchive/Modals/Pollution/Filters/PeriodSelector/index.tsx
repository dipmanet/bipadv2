import React, { useState } from 'react';
import SelectInput from '#rsci/SelectInput';

import { Periods } from '../../types';
import styles from './styles.scss';

const periods: Periods[] = [
    { periodCode: 'hourly', periodName: 'Hourly' },
    { periodCode: 'daily', periodName: 'Daily' },
    { periodCode: 'weekly', periodName: 'Weekly' },
    { periodCode: 'monthly', periodName: 'Monthly' },
    { periodCode: 'yearly', periodName: 'Yearly' },
];

const periodKeySelector = (r: Periods) => r.periodCode;
const periodLabelSelector = (r: Periods) => r.periodName;

const PeriodSelector = () => {
    const [selectedperiod, setSelectedperiod] = useState('');

    const handlePeriodChange = (periodCode: string) => {
        setSelectedperiod(periodCode);
        const period = periods.filter(p => p.periodCode === periodCode)[0];
        console.log('Period: ', period);
    };
    return (
        <div className={styles.periodSelector}>
            <SelectInput
                className={styles.period}
                // label="periods"
                options={periods}
                keySelector={periodKeySelector}
                labelSelector={periodLabelSelector}
                value={selectedperiod}
                onChange={handlePeriodChange}
                placeholder="Select Time Period"
                // autoFocus
            />
        </div>
    );
};

export default PeriodSelector;
