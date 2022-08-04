import React from 'react';
import styles from './styles.scss';
import { nullCheck } from '#utils/common';

const DataCount = (props) => {
    const { data, value } = props;

    const { name, key } = value;
    const nullCondition = false;
    const dataValue = nullCheck(nullCondition, data, key);
    return (

        // <div className={styles.container}>
        <div className={styles.wrapper}>
            <p className={styles.alertText}>
                {
                    `Total number of ${name}`
                }
            </p>
            <span className={styles.alertValue}>
                {dataValue}
            </span>
        </div>
        /* </div> */
    );
};

export default DataCount;
