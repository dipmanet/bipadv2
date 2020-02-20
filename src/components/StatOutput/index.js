import React from 'react';
import { _cs } from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';

import styles from './styles.scss';

const StatOutput = ({ className, ...otherProps }) => (
    <TextOutput
        className={_cs(styles.stat, className)}
        labelClassName={styles.label}
        valueClassName={styles.value}
        isNumericValue
        normal
        type="block"
        lang="ne"
        {...otherProps}
    />
);

export default StatOutput;
