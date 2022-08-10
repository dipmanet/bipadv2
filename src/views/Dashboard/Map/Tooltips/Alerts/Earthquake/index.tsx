/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Translation } from 'react-i18next';
import { convertDateAccToLanguage } from '#utils/common';

import styles from './styles.scss';

interface ReferenceData {
    fields: {
        created_on: string;
        modified_on: string;
        description: string;
        point: string;
        magnitude: string;
        address: string;
        event_on: string;
    };
}

const nullData = {
    fields: {
        created_on: '',
        modified_on: '',
        description: '',
        point: '',
        magnitude: '',
        address: '',
        event_on: '',
    },
};

const EarthquakeToolTip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
    language,
) => {
    const { fields:
        { address: epicenter,
            magnitude,
            created_on: measuredOn,
            description: referenceDescription } } = referenceData || nullData;
    const date = createdDate.split('T')[0];
    const time = createdDate.split('T')[1].split('+')[0];
    const timeOnly = time.split(':').slice(0, 2).join(':');
    return (
        <div className={styles.earthquakeTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>
                    {epicenter
                        ? (
                            <>

                                <Translation>
                                    {
                                        t => <span>{t('Earthquake at')}</span>
                                    }
                                </Translation>
                                {' '}
                                <span>{epicenter}</span>
                            </>
                        )
                        : title

                        || (
                            <Translation>
                                {
                                    t => <span>{t('N/A')}</span>
                                }
                            </Translation>
                        )
                    }
                </div>
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
                <div className={styles.magnitude}>
                    <div className={styles.title}>
                        <Translation>
                            {
                                t => <span>{t('Magnitude')}</span>
                            }
                        </Translation>
                        :
                    </div>
                    <div className={styles.value}>
                        {magnitude
                            ? (
                                <span>
                                    {magnitude}
                                    {' '}
                                    {<Translation>
                                        {
                                            t => <span>{t('ML')}</span>
                                        }
                                    </Translation>}
                                </span>
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
                        href="https://www.seismonepal.gov.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.value}
                    >
                        <Translation>
                            {
                                t => <span>{t('Department of Mines and Geology')}</span>
                            }
                        </Translation>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EarthquakeToolTip;
