import React from 'react';

import SegmentInput from '#rsci/SegmentInput';

const pastDataKeySelector = d => d.key;
const pastDataLabelSelector = d => d.label;

const pastDateRangeOptions = [
    {
        label: 'Last 3 days',
        key: 3,
    },
    {
        label: 'Last 7 days',
        key: 7,
    },
    {
        label: 'Last 2 weeks',
        key: 14,
    },
    {
        label: 'Last 1 month',
        key: 30,
    },
];


const PastDateRangeInput = props => (
    <SegmentInput
        keySelector={pastDataKeySelector}
        labelSelector={pastDataLabelSelector}
        options={pastDateRangeOptions}
        {...props}
    />
);

export default PastDateRangeInput;
