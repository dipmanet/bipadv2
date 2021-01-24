import React from 'react';
import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    average?: PageType.WaterLevelAverage;
}
const DEFAULT_VALUE = 'N/A';

const dummyObject = {
    value: DEFAULT_VALUE,
    interval: DEFAULT_VALUE,
};

const AverageBlock = (props: Props) => {
    const { average } = props;
    const { value = DEFAULT_VALUE, interval } = average || dummyObject;
    return (
        <div className={styles.averageBlock}>
            <div className={styles.value}>
                {value === DEFAULT_VALUE
                    ? value
                    : `${value} mm`}
            </div>
            <div className={styles.interval}>
                {`${interval} HR`}
            </div>
        </div>
    );
};

export default AverageBlock;
