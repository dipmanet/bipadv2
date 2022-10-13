import React from 'react';
import styles from './styles.scss';
import { nullCheck } from '#utils/common';
import { returnValueByDropdown } from '../utils/utils';

const DataCount = (props) => {
    const { data, value } = props;
    const { name, key } = value;
    const nullCondition = false;
    const dataValue = nullCheck(nullCondition, data, key);

    return (
        <div className={styles.wrapper}>
            <p className={styles.alertText}>
                {
                    `Total number of ${name}`
                }
            </p>

            {
                data.length > 0
                && (
                    <span className={styles.alertValue}>
                        {returnValueByDropdown(name, dataValue)}
                    </span>
                )
            }


        </div>
    );
};

export default DataCount;
