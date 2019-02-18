import React from 'react';

import SelectInput from '#rsci/SelectInput';

const pastDataKeySelector = d => d.key;
const pastDataLabelSelector = d => d.label;

const pastDateRangeOptions = [
    {
        label: 'Last 3 days',
        key: 'past3Days',
    },
    {
        label: 'Last 7 days',
        key: 'past7Days',
    },
    {
        label: 'Last 2 weeks',
        key: 'past2Weeks',
    },
    {
        label: 'Last 1 month',
        key: 'past1Month',
    },
];


const PastDateRangeInput = props => (
    <SelectInput
        keySelector={pastDataKeySelector}
        labelSelector={pastDataLabelSelector}
        options={pastDateRangeOptions}
        {...props}
    />
);

export default PastDateRangeInput;
