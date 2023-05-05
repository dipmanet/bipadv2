import React from 'react';
import { Translation } from 'react-i18next';
import { nullCheck } from '#utils/common';
import styles from './styles.scss';
import { formatNumeralAccLang } from '../utils/utils';
import { Data } from '../types';

interface DataCountProps {
    data: Data[];
    value: {
        name: string;
        key: string;
    };
    language?: string;
}

const DataCount = (props: DataCountProps) => {
    const { data, value, language, overallTotalIncident } = props;
    const { name, key } = value;
    const nullCondition = false;
    const dataValue = nullCheck(nullCondition, data, key);

    return (
        <div className={styles.wrapper}>
            <Translation>
                {
                    t => (
                        <p className={styles.alertText}>
                            {
                            }
                            {language === 'en'
                                ? `Total number of ${name}`
                                : `${t(name)}को कुल संख्या`

                            }
                        </p>
                    )
                }
            </Translation>

            {/* {
                data.length > 0
                && (
                    <span className={styles.alertValue}>
                        {formatNumeralAccLang(dataValue, language)}
                    </span>
                )
            } */}

            {
                data.length > 0
                && (
                    <span className={styles.alertValue}>
                        {overallTotalIncident}
                    </span>
                )
            }
        </div>
    );
};

export default DataCount;
