import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Button from '#rsca/Button';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';

import { getYesterday } from '#utils/common';
import {
    getHazardColor,
    getHazardIcon,
} from '#utils/domain';
import DateOutput from '#components/DateOutput';

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

    render() {
        const {
            alert,
            className,
            hazardTypes,
            recentDay,
        } = this.props;

        const {
            title,
            hazard,
            startedOn,
        } = alert;

        const icon = getHazardIcon(hazardTypes, hazard);
        const isNew = isRecent(startedOn, recentDay);

        return (
            <div
                className={_cs(
                    className,
                    styles.alertItem,
                    isNew && styles.new,
                )}
            >
                <ScalableVectorGraphics
                    className={styles.icon}
                    src={icon}
                    style={{ color: getHazardColor(hazardTypes, hazard) }}
                />
                <div className={styles.right}>
                    <div className={styles.top}>
                        <div className={styles.title}>
                            {title}
                        </div>
                        <Button
                            transparent
                            className={styles.editButton}
                            onClick={this.handleEditButtonClick}
                        >
                            Edit
                        </Button>
                        <DangerConfirmButton
                            transparent
                            className={styles.deleteButton}
                            onClick={this.handleDeleteButtonClick}
                            confirmationMessage="Are you sure to delete the Alert?"
                        >
                            Delete
                        </DangerConfirmButton>
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
