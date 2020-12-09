import React from 'react';

import styles from './styles.scss';

interface Props {
    message?: string;
    title?: string;
}

const DEFAULT_MESSAGE = 'No data available for selected Filter';

const NoData = (props: Props) => {
    const { message, title } = props;
    return (
        <div className={styles.noData}>
            <div className={styles.title}>
                {title}
            </div>
            <div className={styles.message}>
                <div>
                    { message || DEFAULT_MESSAGE }
                </div>
            </div>
        </div>
    );
};

export default NoData;
