import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Button from '#rsca/Button';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import alertIcon from '#resources/icons/Alert.svg';

import DateOutput from '#components/DateOutput';
import Cloak from '#components/Cloak';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const emptyObject = {};

export default class EventItem extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    handleEditButtonClick = () => {
        const {
            onEditButtonClick,
            event,
        } = this.props;

        if (!onEditButtonClick) {
            return;
        }

        onEditButtonClick(event);
    }

    handleDeleteButtonClick = () => {
        const {
            onDeleteButtonClick,
            event,
        } = this.props;

        if (!onDeleteButtonClick) {
            return;
        }

        onDeleteButtonClick(event);
    }

    handleMouseEnter = () => {
        const {
            onHover,
            event,
        } = this.props;

        if (onHover) {
            onHover(event.id);
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
            event = emptyObject,
            className,
            hazardTypes,
            isHovered,
        } = this.props;

        const {
            title,
            createdOn,
            hazard,
        } = event;

        return (
            <div
                className={_cs(
                    className,
                    styles.eventItem,
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
                        <div className={styles.title}>
                            {title}
                        </div>
                        <Cloak hiddenIf={p => !p.change_event}>
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
                        </Cloak>
                    </div>
                    <div className={styles.bottom}>
                        <DateOutput
                            className={styles.createdOn}
                            value={createdOn}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
