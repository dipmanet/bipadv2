import React from 'react';
import styles from './styles.scss';
import { nullCheck } from '#utils/common';
import Numeral from '#rscv/Numeral';

const DataCount = (props) => {
    const { data, value } = props;

    const { name, key } = value;
    const nullCondition = false;
    const dataValue = nullCheck(nullCondition, data, key);

    const estimatedLossValueFormatter = (d) => {
        const { number, normalizeSuffix } = Numeral.getNormalizedNumber({
            value: d,
            normal: true,
            precision: 0,
        });
        if (normalizeSuffix) {
            return `${number}${normalizeSuffix}`;
        }
        return number;
    };

    return (

        // <div className={styles.container}>
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
                        {dataValue && estimatedLossValueFormatter(dataValue)}
                    </span>
                )
            }


        </div>
        /* </div> */
    );
};

export default DataCount;
