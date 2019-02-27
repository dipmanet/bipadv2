import React from 'react';

import SegmentInput from '#rsci/SegmentInput';

const pastDataKeySelector = d => d.key;
const pastDataLabelSelector = d => d.label;

const pastDateRangeOptions = [
    {
        label: '3d',
        key: 3,
    },
    {
        label: '7d',
        key: 7,
    },
    {
        label: '2w',
        key: 14,
    },
    {
        label: '1m',
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
