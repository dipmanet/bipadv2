import React from 'react';
import { Translation } from 'react-i18next';
import { convertDateAccToLanguage } from '#utils/common';

import styles from './styles.scss';

interface Tags {
    id: number;
    name: string;
    description: string;
}

interface Observation {
    data: {
        value: number;
        dateTime: string;
    };
    parameter_code: string;
    parameter_name: string;
    series_id: number;
    series_name: string;
    unit: string;
}
interface ReferenceData {
    fields: {
        aqi?: number;
        aqi_color: string;
        created_on?: string;
        description: string;
        elevation?: number;
        identifier: string;
        images: string;
        modified_on?: string;
        observation: Observation[];
        point: string;
        tags: Tags[];
        title: string;
    };
}

const nullData = {
    fields: {
        title: '',
        aqi: 0,
    },
};

const renderAqiIndicator = (aqi: number): string => {
    if (aqi <= 12) {
        return 'Good';
    }
    if (aqi <= 35.4) {
        return 'Moderate';
    }
    if (aqi <= 55.4) {
        return 'Unhealthy for Sensitive People';
    }
    if (aqi <= 150.4) {
        return 'Unhealthy';
    }
    if (aqi <= 350.4) {
        return 'Very Unhealthy';
    }
    if (aqi >= 500.4) {
        return 'Hazardous';
    }
    return 'N/A';
};

const PollutionTooltip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
    language,
) => {
    const { fields:
        { title: headerTitle,
            aqi } } = referenceData || nullData;
    const date = createdDate.split('T')[0];
    const time = createdDate.split('T')[1].split('+')[0];
    const timeOnly = time.split(':').slice(0, 2).join(':');
    return (
        <div className={styles.pollutionTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>{headerTitle || 'N/A'}</div>
                <div className={styles.date}>
                    {createdDate
                        ? (
                            <>
                                <span>
                                    {convertDateAccToLanguage(date, language)}
                                    {' '}
                                    |
                                    {' '}
                                    {timeOnly}
                                </span>
                                <span>
                                    {' '}
                                    <Translation>
                                        {
                                            t => <span>{t('(NPT)')}</span>
                                        }
                                    </Translation>
                                </span>
                            </>
                        )
                        : (
                            <Translation>
                                {
                                    t => <span>{t('N/A')}</span>
                                }
                            </Translation>
                        )
                    }
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.aqi}>
                    <div className={styles.title}>
                        <Translation>
                            {
                                t => <span className={styles.value}>{t('AQI')}</span>
                            }
                        </Translation>
                        :

                    </div>
                    <div className={styles.value}>{aqi ? aqi.toFixed(2) : 'N/A'}</div>
                </div>
                <div className={styles.remark}>
                    <div className={styles.title}>
                        <Translation>
                            {
                                t => <span className={styles.value}>{t('Remark')}</span>
                            }
                        </Translation>
                    </div>
                    :
                    <Translation>
                        {
                            t => <span className={styles.value}>{t(`${renderAqiIndicator(aqi)}`)}</span>
                        }
                    </Translation>
                </div>
                <div className={styles.source}>
                    <div className={styles.title}>
                        <Translation>
                            {
                                t => <span>{t('Source')}</span>
                            }
                        </Translation>
                        :
                    </div>
                    <a
                        href="http://mofe.gov.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.value}
                    >
                        <Translation>
                            {
                                t => <span>{t('Ministry of Forests and Environment')}</span>
                            }
                        </Translation>

                    </a>
                </div>
            </div>
        </div>
    );
};

export default PollutionTooltip;
