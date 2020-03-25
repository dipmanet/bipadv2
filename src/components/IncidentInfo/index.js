import React from 'react';
import PropTypes from 'prop-types';

import {
    _cs,
    reverseRoute,
} from '@togglecorp/fujs';
import { Link } from '@reach/router';

import FormattedDate from '#rscv/FormattedDate';
import Icon from '#rscg/Icon';

import AccentButton from '#rsca/Button/AccentButton';
import TextOutput from '#components/TextOutput';
import DateOutput from '#components/DateOutput';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import Loss from '#components/Loss';

import styles from './styles.scss';


const emptyObject = {};
const emptyList = [];

// FIXME: move to constants
const inducerText = {
    artificial: 'Non Natural',
    natural: 'Natural',
};

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    incident: PropTypes.object.isRequired,
    onEditIncident: PropTypes.func,
    onDeleteIncident: PropTypes.func,
    incidentDeletePending: PropTypes.bool,
    showEditIncident: PropTypes.bool,
    showDeleteIncident: PropTypes.bool,
};

const defaultProps = {
    onEditIncident: undefined,
    onDeleteIncident: undefined,
    incidentDeletePending: false,
    showEditIncident: false,
    showDeleteIncident: false,
};

export default class IncidentInfo extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            incident,

            provincesMap,
            districtsMap,
            municipalitiesMap,
            wardsMap,

            className,
            hideLink,

            showEditIncident,
            showDeleteIncident,
            onEditIncident,
            onDeleteIncident,

            incidentDeletePending,
            showActions,
        } = this.props;

        const {
            title,
            inducer,
            cause,
            source,
            verified,
            reportedOn,

            hazard: { title: hazardType } = emptyObject,
            incidentOn,
            wards = emptyList,
            event: {
                title: eventTitle,
            } = {},

            loss = emptyObject,
            id,
        } = incident;

        const verifiedText = verified ? 'Yes' : 'No';

        // FIXME: memoize later
        const wardNames = wards.map((ward) => {
            const municipality = municipalitiesMap[ward.municipality];
            const district = districtsMap[municipality.district];
            const province = provincesMap[district.province];
            return `${municipality.title} - ${ward.title}, ${district.title}, ${province.title}`;
        });

        return (
            <div className={_cs(styles.incidentInfo, className)}>
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        {title}
                    </h3>
                    <DateOutput
                        className={styles.incidentDate}
                        value={incidentOn}
                    />
                </header>
                <div className={styles.actions}>
                    <div className={styles.left}>
                        { !hideLink && (
                            <Link
                                className={styles.gotoResponseLink}
                                to={reverseRoute('/incidents/:incidentId/response', { incidentId: id })}
                            >
                                Go to response
                            </Link>
                        )}
                    </div>
                    <div className={styles.right}>
                        { showEditIncident && onEditIncident && (
                            <AccentButton
                                className={styles.button}
                                transparent
                                onClick={onEditIncident}
                            >
                                Edit
                            </AccentButton>
                        )}
                        { showDeleteIncident && onDeleteIncident && (
                            <DangerConfirmButton
                                className={styles.button}
                                confirmationMessage="Are you sure you want to delete this incident?"
                                onClick={onDeleteIncident}
                                pending={incidentDeletePending}
                                transparent
                            >
                                Delete
                            </DangerConfirmButton>
                        )}
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.general}>
                        <TextOutput
                            className={styles.verified}
                            label="Verified"
                            value={verifiedText}
                            labelClassName={styles.label}
                            valueClassName={styles.value}
                        />
                        <TextOutput
                            className={styles.source}
                            label="Source"
                            value={source}
                            labelClassName={styles.label}
                            valueClassName={styles.value}
                        />
                        <TextOutput
                            className={styles.inducer}
                            label="Inducer"
                            value={inducerText[inducer]}
                            labelClassName={styles.label}
                            valueClassName={styles.value}
                        />
                        <TextOutput
                            className={styles.cause}
                            label="Cause"
                            value={cause}
                            labelClassName={styles.label}
                            valueClassName={styles.value}
                        />
                        <TextOutput
                            className={styles.hazardType}
                            label="Hazard"
                            value={hazardType}
                            labelClassName={styles.label}
                            valueClassName={styles.value}
                        />
                        <TextOutput
                            className={styles.event}
                            label="Event"
                            labelClassName={styles.label}
                            valueClassName={styles.value}
                            value={eventTitle}
                        />
                        <TextOutput
                            className={styles.reportedOn}
                            label="Reported On"
                            labelClassName={styles.label}
                            valueClassName={styles.value}
                            value={(
                                <FormattedDate
                                    mode="yyyy-MM-dd hh:mm"
                                    value={reportedOn}
                                />
                            )}
                        />
                    </div>
                    { wardNames.length > 0 && (
                        <div className={styles.wards}>
                            <h4 className={styles.heading}>
                                Wards
                            </h4>
                            <div className={styles.wardList}>
                                { wardNames.map(wardName => (
                                    <div
                                        className={styles.ward}
                                        key={wardName}
                                    >
                                        <Icon
                                            name="checkmarkCircle"
                                            className={styles.icon}
                                        />
                                        <div className={styles.name}>
                                            {wardName}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <Loss
                        className={styles.loss}
                        title="Loss"
                        titleClassName={styles.title}
                        contentClassName={styles.content}
                        rowClassName={styles.row}
                        labelClassName={styles.label}
                        valueClassName={styles.value}
                        loss={loss}
                    />
                </div>
            </div>
        );
    }
}
