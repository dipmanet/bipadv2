/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Button from '#rsca/Button';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import alertIcon from '#resources/icons/Alert.svg';

import { getYesterday } from '#utils/common';
// import DateOutput from '#components/DateOutput';
import Cloak from '#components/Cloak';
import Icon from '#rscg/Icon';
import {
    languageSelector,
} from '#selectors';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    language: { language: 'en' },

};

const defaultProps = {
    className: undefined,
    language: { language: 'en' },
};

const isRecent = (date, recentDay) => {
    const yesterday = getYesterday(recentDay);
    const timestamp = new Date(date).getTime();
    return timestamp > yesterday;
};

const emptyReferenceData = {
    fields: {
        title: '',
        address: '',
    },
};

const mapStateToProps = state => ({
    language: languageSelector(state),
});

class AlertItem extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    handleEditButtonClick = () => {
        const {
            onEditButtonClick,
            alert,
        } = this.props;

        if (!onEditButtonClick) {
            return;
        }

        onEditButtonClick(alert);
    }

    handleDeleteButtonClick = () => {
        const {
            onDeleteButtonClick,
            alert,
        } = this.props;

        if (!onDeleteButtonClick) {
            return;
        }

        onDeleteButtonClick(alert);
    }

    handleMouseEnter = () => {
        const {
            onHover,
            alert,
        } = this.props;

        if (onHover) {
            onHover(alert.id);
        }
    }

    handleMouseLeave = () => {
        const {
            onHover,
        } = this.props;

        if (onHover) {
            onHover();
        }
    }

    parseTitle= (title, referenceData) => {
        const {
            fields:
            { title: referenceDataTitle },
        } = referenceData;

        const {
            language: { language },
        } = this.props;
        // if(language === 'en'){
        if (title.toUpperCase().trim() === 'FLOOD') {
            return (
                `
            ${
                <div>
                    <Translation>
                        {
                            t => <p>{t('Flood at')}</p>
                        }
                    </Translation>
                    <Translation>
                        {
                            t => <p>{t(`${referenceDataTitle}`)}</p>
                        }
                    </Translation>
                    <Translation>
                        {
                            t => <p>{t('Ma')}</p>
                        }
                    </Translation>
                </div>
                }
                `

            );
        }
        if (title.toUpperCase().trim() === 'HEAVY RAINFALL') {
            return `Heavy Rainfall at ${referenceDataTitle}`;
        }
        if (title.toUpperCase().trim() === 'FIRE') {
            return `${referenceDataTitle}`;
        }
        if (title.toUpperCase().trim() === 'EARTHQUAKE') {
            const {
                fields:
                    { address: epicenter },
            } = referenceData;
            return `
            ${
    <div>
        <Translation>
            {
                t => <p>{t('Earthquake at')}</p>
            }
        </Translation>
        <Translation>
            {
                t => <p>{t('Ma')}</p>
            }
        </Translation>
    </div>
}
            ${epicenter}
            
            `;
        }
        if (title.toUpperCase().trim() === 'ENVIRONMENTAL POLLUTION') {
            return `Environmental pollution at ${referenceDataTitle}`;
        }
        return title;
    }

    render() {
        const {
            alert,
            className,
            hazardTypes,
            recentDay,
            isHovered,
            language: { language },
        } = this.props;

        const {
            title,
            hazard,
            startedOn,
            // createdOn,
            referenceData,
        } = alert;
        const alertReferenceData = referenceData ? JSON.parse(referenceData) : emptyReferenceData;

        const parsedTitle = this.parseTitle(title, alertReferenceData);
        const time = startedOn ? startedOn.split('T')[1] : 'NA';
        const hour = time.split(':')[0];
        const minutes = time.split(':')[1];
        let timeIndicator;
        if (hour + minutes <= 1200) {
            if (language === 'en') {
                timeIndicator = 'AM';
            } else {
                timeIndicator = 'बिहान';
            }
        } else if ((hour + minutes) > 1200 && (hour + minutes) <= 2359) {
            if (language === 'en') {
                timeIndicator = 'PM';
            } else {
                timeIndicator = 'बेलुका';
            }
        } else {
            timeIndicator = '';
        }
        const parsedTime = `${hour}:${minutes} ${timeIndicator}`;
        // const isNew = isRecent(startedOn, recentDay);
        const isNew = isRecent(startedOn, recentDay);
        return (
            <div
                className={_cs(
                    className,
                    styles.alertItem,
                    isNew && styles.new,
                    isHovered && styles.hovered,
                )}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <ScalableVectorGraphics
                    className={styles.icon}
                    src={(hazardTypes[hazard] ? hazardTypes[hazard].icon : undefined) || alertIcon}
                    style={{ color: (hazardTypes[hazard] ? hazardTypes[hazard].color : undefined) || '#4666b0' }}
                />
                <div className={styles.right}>
                    <div className={styles.top}>
                        <h3 className={styles.title}>
                            {/* {title} */}
                            {parsedTitle}
                        </h3>
                        <Cloak hiddenIf={p => !p.change_alert}>
                            <Button
                                transparent
                                className={styles.editButton}
                                onClick={this.handleEditButtonClick}
                                iconName="edit"
                            >
                                <Translation>
                                    {
                                        t => <span>{t('Edit')}</span>
                                    }
                                </Translation>
                            </Button>
                        </Cloak>
                        <Cloak hiddenIf={p => !p.delete_alert}>
                            <DangerConfirmButton
                                iconName="delete"
                                transparent
                                className={styles.deleteButton}
                                onClick={this.handleDeleteButtonClick}
                                confirmationMessage="Are you sure to delete the Alert?"
                            >
                                <Translation>
                                    {
                                        t => <span>{t('Delete')}</span>
                                    }
                                </Translation>
                            </DangerConfirmButton>
                        </Cloak>
                    </div>
                    <div className={styles.bottom}>
                        {/* <DateOutput
                            className={styles.startedOn}
                            value={startedOn}
                        /> */}

                        <div className={styles.time}>
                            <div className={styles.date}>
                                <div className={styles.dateIcon}>
                                    <Icon
                                        className={styles.icon}
                                        name="calendar"
                                    />
                                </div>

                                <div className={styles.dateValue}>
                                    {startedOn.split('T')[0]}
                                </div>
                            </div>

                            <div className={styles.dateTime}>
                                <div className={styles.dateTimeIcon}>
                                    <Icon
                                        className={styles.icon}
                                        name="dataRange"
                                    />
                                </div>

                                <div className={styles.dateTimeValue}>
                                    {parsedTime}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, undefined)(AlertItem);
