import React from 'react';

import styles from './styles.scss';

interface Props {
    message?: string;
}

const DEFAULT_MESSAGE = 'No data available for selected Filter';

const NoData = (props: Props) => {
    const { message } = props;
    return (
        <div className={styles.noData}>
            { message || DEFAULT_MESSAGE }
        </div>
    );
};

export default NoData;
