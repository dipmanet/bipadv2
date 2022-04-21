/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Translation } from 'react-i18next';
import Icon from '#rscg/Icon';

import styles from './styles.scss';

interface ReferenceData {
    fields: {
        brightness: number;
        confidence?: number;
        created_on?: string;
        event_on?: string;
        land_cover: string;
        modified_on: string;
        point: string;
        scan: number;
        title: string;
    };
}

const nullData = {
    fields: {
        brightness: 0,
        confidence: 0,
        created_on: undefined,
        event_on: undefined,
        land_cover: '',
        modified_on: '',
        point: '',
        scan: 0,
        title: '',
    },
};

const FireTooltip = (
    title: string,
    description: string,
    createdDate: string,
    referenceData: ReferenceData,
) => {
    const { fields:
        { title: headerTitle,
            land_cover: landCover,
            brightness, confidence } } = referenceData || nullData;
    const date = createdDate.split('T')[0];
    const time = createdDate.split('T')[1].split('+')[0];
    const timeOnly = time.split(':').slice(0, 2).join(':');
    return (
        <div className={styles.fireTooltip}>
            <div className={styles.header}>
                <div className={styles.title}>
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
                <div className={styles.landCover}>
                    <div className={styles.title}>Land Cover:</div>
                    <div className={styles.value}>
                        {landCover
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
                <div className={styles.brightness}>
                    <div className={styles.title}>Brightness:</div>
                    <div className={styles.value}>
                        {brightness
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
                <div className={styles.brightness}>
                    <div className={styles.title}>Confidence:</div>
                    <div className={styles.value}>{confidence || 'N/A'}</div>
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
                        href="http://110.44.114.238//NepalForestFire"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.value}
                    >
                        <Translation>
                            {
                                t => <span>{t(' International Centre for Integrated Mountain Development')}</span>
                            }
                        </Translation>

                    </a>
                </div>
                <div className={styles.source}>

                    <div className={styles.disclaimer}>
                        <Icon
                            className={styles.infoIcon}
                            name="info"
                        />
                         Forest fires are detected by a satellite-based forest fire detection
                        and monitoring system from Moderate Resolution Imaging Spectroradiometer
                        (MODIS) sensors. It provides location information on active fires present
                        during the satellite’s twice-daily overpasses. The confidence level,
                        which ranges from 0% to 100%, help users gauge the quality
                        of individual fire.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FireTooltip;
