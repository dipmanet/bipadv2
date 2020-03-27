import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Button from '#rsca/Button';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import alertIcon from '#resources/icons/Alert.svg';

import { getYesterday } from '#utils/common';
import DateOutput from '#components/DateOutput';
import Cloak from '#components/Cloak';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const isRecent = (date, recentDay) => {
    const yesterday = getYesterday(recentDay);
    const timestamp = new Date(date).getTime();
    return timestamp > yesterday;
};

export default class AlertItem extends React.PureComponent {
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

    render() {
        const {
            alert,
            className,
            hazardTypes,
            recentDay,
            isHovered,
        } = this.props;

        const {
            title,
            hazard,
            startedOn,
        } = alert;

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
                            {title}
                        </h3>
                        <Cloak hiddenIf={p => !p.change_alert}>
                            <Button
                                transparent
                                className={styles.editButton}
                                onClick={this.handleEditButtonClick}
                                iconName="edit"
                            >
                                Edit
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
                                Delete
                            </DangerConfirmButton>
                        </Cloak>
                    </div>
                    <div className={styles.bottom}>
                        <DateOutput
                            className={styles.startedOn}
                            value={startedOn}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
