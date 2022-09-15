import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import { KeyValue } from '#types';

import styles from './styles.scss';

interface Props {
    data: KeyValue;
    className?: string;
}
const SummaryItem = (props: Props) => {
    const {
        className,
        data: {
            label,
            value,
        },
    } = props;




    return (
        <div className={_cs(className, styles.summary)}>
            <h2 className={styles.streamValue}>
                {' '}
                {value && !Number.isNaN(value) && value.toFixed(2)}
            </h2>
            <div className={styles.label}>
                {label}
            </div>
        </div>
    );
};

export default SummaryItem;
