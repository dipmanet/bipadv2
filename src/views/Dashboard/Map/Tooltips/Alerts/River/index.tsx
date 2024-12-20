import React from 'react';
import { Translation } from 'react-i18next';
import { convertDateAccToLanguage } from '#utils/common';
import styles from './styles.scss';

interface ReferenceData {
    fields: {
        title: string;
        status: string;
        basin: string;
        water_level: number;
    };
}

const nullData = {
    fields: {
        title: '',
        status: '',
        basin: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        water_level: 0,
    },
};

const RiverTooltip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
    language,
) => {
    const { fields:
        { title: headerTitle,
            basin,
            water_level: waterLevel,
            status } } = referenceData || nullData;
    const date = createdDate.split('T')[0];
    const time = createdDate.split('T')[1].split('+')[0];
    const timeOnly = time.split(':').slice(0, 2).join(':');
    return (
        <div className={styles.riverTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>{headerTitle || 'N/A'}</div>
                <div className={styles.date}>
                    {createdDate
                        ? `${convertDateAccToLanguage(date, language)} | ${timeOnly} (NPT)`
                        : 'N/A'}
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.basin}>
                    <div className={styles.title}>
                        <Translation>
                            {
                                t => <span>{t('Basin')}</span>
                            }
                        </Translation>
                        :

                    </div>
                    <div className={styles.value}>
                        {basin
                            || (
                                <Translation>
                                    {
                                        t => <span>{t('N/A')}</span>
                                    }
                                </Translation>
                            )
                        }

                    </div>
                </div>
                <div className={styles.station}>
                    <Translation>
                        {
                            t => (
                                <div className={styles.title}>
                                    {t('Station Name')}
                                    :
                                </div>
                            )
                        }
                    </Translation>
                    <div className={styles.value}>
                        {headerTitle
                            || (
                                <Translation>
                                    {
                                        t => <span>{t('N/A')}</span>
                                    }
                                </Translation>
                            )
                        }

                    </div>
                </div>
                <div className={styles.waterLevel}>
                    <div className={styles.title}>
                        <Translation>
                            {
                                t => (
                                    <span>
                                        {t('WATER LEVEL')}
                                    </span>
                                )
                            }
                        </Translation>

                    </div>
                    <div className={styles.value}>
                        {
                            waterLevel
                                ? `${waterLevel} m`
                                : 'N/A'
                        }
                    </div>
                </div>
                <div className={styles.status}>
                    <div className={styles.title}>
                        <Translation>
                            {
                                t => <span>{t('Status')}</span>
                            }
                        </Translation>
                    </div>
                    <div className={styles.value}>{status || 'N/A'}</div>
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
                        href="http://hydrology.gov.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.value}
                    >
                        <Translation>
                            {
                                t => <span>{t('Department of Hydrology and Meteorology')}</span>
                            }
                        </Translation>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RiverTooltip;
