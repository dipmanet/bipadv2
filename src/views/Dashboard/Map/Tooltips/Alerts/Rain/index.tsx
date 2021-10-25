import React from 'react';
import { Translation } from 'react-i18next';

import styles from './styles.scss';

interface Average {
    interval: number;
    status: {
        danger: boolean;
        warning: boolean;
    };
    value: number;
}
interface ReferenceData {
    fields: {
        averages: Average[];
        basin: string;
        created_on: string;
        title: string;
    };
}

const nullData = {
    fields: {
        averages: [],
        basin: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        created_on: '',
        title: '',
    },
};

const RainTooltip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
) => {
    const {
        fields:
        { averages,
            basin,
            created_on: createdOn,
            title: referenceDataTitle },
    } = referenceData || nullData;

    const oneHourInterval = averages[0].value;
    const threeHourInterval = averages[1].value;
    const sixHourInterval = averages[2].value;
    const twelveHourInterval = averages[3].value;
    const twentyFourHourInterval = averages[4].value;

    let renderedTitle;
    if (title.toUpperCase() === 'HEAVY RAINFALL') {
        renderedTitle = `Heavy Rainfall at ${referenceDataTitle}`;
    } else {
        renderedTitle = title;
    }
    const date = createdDate.split('T')[0];
    const time = createdDate.split('T')[1].split('+')[0];
    const timeOnly = time.split(':').slice(0, 2).join(':');
    return (
        <div className={styles.rainfallTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>{renderedTitle}</div>
                <div className={styles.date}>
                    { createdDate
                        ? (
                            <>
                                <span>
                                    {date}
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
                    <div className={styles.title}>
                        <Translation>
                            {
                                t => <span>{t('Station Name')}</span>
                            }
                        </Translation>

                        :

                    </div>
                    <div className={styles.value}>
                        {referenceDataTitle
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
                <div className={styles.rainfall}>
                    <div className={styles.title}>
                        Accumulated Rainfall:
                    </div>
                    <div className={styles.rainfallList}>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>
                                    1
                                <Translation>
                                    {
                                        t => <span>{t('Hour')}</span>
                                    }
                                </Translation>


                            </div>
                            <div className={styles.value}>{`${oneHourInterval} mm`}</div>
                        </div>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>
                                    3
                                <Translation>
                                    {
                                        t => <span>{t('Hour')}</span>
                                    }
                                </Translation>


                            </div>
                            <div className={styles.value}>{`${threeHourInterval} mm`}</div>
                        </div>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>
                                    6
                                <Translation>
                                    {
                                        t => <span>{t('Hour')}</span>
                                    }
                                </Translation>


                            </div>
                            <div className={styles.value}>{`${sixHourInterval} mm`}</div>
                        </div>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>
                                    12
                                <Translation>
                                    {
                                        t => <span>{t('Hour')}</span>
                                    }
                                </Translation>


                            </div>
                            <div className={styles.value}>{`${twelveHourInterval} mm`}</div>
                        </div>
                        <div className={styles.rainfallItem}>
                            <div className={styles.hour}>
                                    24
                                <Translation>
                                    {
                                        t => <span>{t('Hour')}</span>
                                    }
                                </Translation>


                            </div>
                            <div className={styles.value}>{`${twentyFourHourInterval} mm`}</div>
                        </div>
                    </div>
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

export default RainTooltip;
