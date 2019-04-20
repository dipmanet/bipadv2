import React from 'react';
import FormattedDate from '#rscv/FormattedDate';

import styles from './styles.scss';

export default ({ value }) => (
    <FormattedDate
        className={styles.dateCell}
        value={value}
        mode="yyyy-MM-dd"
    />
);
