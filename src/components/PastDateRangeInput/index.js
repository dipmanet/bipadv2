import React from 'react';

import SegmentInput from '#rsci/SegmentInput';

const pastDataKeySelector = d => d.key;
const pastDataLabelSelector = d => d.label;

const pastDateRangeOptions = [
    {
        label: '3d',
        key: 'past3Days',
    },
    {
        label: '7d',
        key: 'past7Days',
    },
    {
        label: '2w',
        key: 'past2Weeks',
    },
    {
        label: '1m',
        key: 'past1Month',
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
