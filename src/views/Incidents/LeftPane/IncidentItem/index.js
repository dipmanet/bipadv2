import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    isDefined,
    reverseRoute,
} from '@togglecorp/fujs';
import { Link } from '@reach/router';

import {
    createRequestClient,
    methods,
} from '#request';
import TextOutput from '#components/TextOutput';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import AccentButton from '#rsca/Button/AccentButton';
import modalize from '#rscg/Modalize';
import DateOutput from '#components/DateOutput';
import IncidentFeedbacksModal from '#components/IncidentFeedbacksModal';
import IncidentFeedbackFormModal from '#components/IncidentFeedbackFormModal';

import { getYesterday } from '#utils/common';
import DangerConfirmButton from '#rsca/ConfirmButton/DangerConfirmButton';
import Cloak from '#components/Cloak';
import { sourcesSelector } from '#selectors';

import {
    patchIncidentActionIP,
    setIncidentActionIP,
    removeIncidentActionIP,
} from '#actionCreators';

import alertIcon from '#resources/icons/Alert.svg';

import AddIncidentForm from '../AddIncidentForm';
import styles from './styles.scss';

const ModalAccentButton = modalize(AccentButton);

const propTypes = {
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
    setIncident: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    removeIncident: PropTypes.func.isRequired,
    patchIncident: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    hazardTypes: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    sources: PropTypes.object.isRequired,
    onHover: PropTypes.func,
    recentDay: PropTypes.number.isRequired,
    isHovered: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
    requests: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    sources: sourcesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    patchIncident: params => dispatch(patchIncidentActionIP(params)),
    setIncident: params => dispatch(setIncidentActionIP(params)),
    removeIncident: params => dispatch(removeIncidentActionIP(params)),
});

const defaultProps = {
    className: undefined,
    onHover: undefined,
};

const LocationOutput = ({
    provinceTitle,
    districtTitle,
    municipalityTitle,
    streetAddress,
}) => (
    <div className={styles.locationOutput}>
        { provinceTitle && (
            <div className={styles.provinceName}>
                { provinceTitle }
            </div>
        )}
        { districtTitle && (
            <div className={styles.districtName}>
                { districtTitle }
            </div>
        )}
        { municipalityTitle && (
            <div className={styles.municipalityName}>
                { municipalityTitle }
            </div>
        )}
        { streetAddress && (
            <div className={styles.streetAddress}>
                { streetAddress }
            </div>
        )}
    </div>
);

LocationOutput.propTypes = {
    provinceTitle: PropTypes.string,
    districtTitle: PropTypes.string,
    municipalityTitle: PropTypes.string,
    streetAddress: PropTypes.string,
};

LocationOutput.defaultProps = {
    provinceTitle: '',
    districtTitle: '',
    municipalityTitle: '',
    streetAddress: '',
};

const requestOptions = {
    incidentDeleteRequest: {
        url: ({ props: { data: { id: incidentId } } }) => `/incident/${incidentId}/`,
        method: methods.DELETE,
        onSuccess: ({ props: {
            data: { id: incidentId },
            removeIncident,
        } }) => {
            removeIncident({ incidentId });
        },
    },
};

class IncidentItem extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    handleIncidentEdit = (incident) => {
        const { setIncident } = this.props;

        if (isDefined(incident)) {
            setIncident({ incident });
        }
    }

    handleLossEdit = (loss, incident) => {
        const { patchIncident } = this.props;

        patchIncident({
            incident: {
                loss,
            },
            incidentId: incident.id,
        });
    }

    handleMouseEnter = () => {
        const {
            onHover,
            data,
        } = this.props;

        if (onHover) {
            onHover(data.id);
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

    handleIncidentDelete = () => {
        const { requests: { incidentDeleteRequest } } = this.props;
        incidentDeleteRequest.do();
    }

    isRecent = memoize((date, recentDay) => {
        const yesterday = getYesterday(recentDay);
        const timestamp = new Date(date).getTime();
        return timestamp > yesterday;
    })

    render() {
        const {
            className,
            data,
            hazardTypes,
            recentDay,
            isHovered,
            sources,
            requests: {
                incidentDeleteRequest: {
                    pending: incidentDeletePending,
                },
            },
        } = this.props;

        const {
            id: incidentServerId,
            title,
            incidentOn,
            streetAddress,
            source,
            verified,
            hazard: hazardId,
            id: incidentId,
            loss: {
                id: lossServerId,
            } = {},
            provinceTitle,
            districtTitle,
            municipalityTitle,
            unacknowledgedFeedbackCount,
        } = data;

        const isNew = this.isRecent(incidentOn, recentDay);
        const hazard = hazardTypes[hazardId];

        return (
            // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
            <div
                className={_cs(
                    className,
                    styles.incidentItem,
                    isNew && styles.new,
                    isHovered && styles.hovered,
                )}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <div className={styles.left}>
                    <ScalableVectorGraphics
                        className={styles.icon}
                        src={hazard.icon || alertIcon}
                        style={{ color: hazard.color || '#4666b0' }}
                    />
                </div>
                <div className={styles.right}>
                    <header className={styles.header}>
                        <h3
                            title={title}
                            className={styles.heading}
                        >
                            { title }
                        </h3>
                        <DateOutput
                            className={styles.date}
                            value={incidentOn}
                        />
                    </header>
                    <div className={styles.adminActions}>
                        <Cloak hiddenIf={p => !p.change_feedback}>
                            <ModalAccentButton
                                className={styles.button}
                                transparent
                                iconName="chatBoxes"
                                modal={(
                                    <IncidentFeedbacksModal
                                        incidentId={incidentId}
                                    />
                                )}
                            >
                                {`Feedbacks (${unacknowledgedFeedbackCount || 0})`}
                            </ModalAccentButton>
                        </Cloak>
                        <Cloak hiddenIf={p => !p.change_incident}>
                            <ModalAccentButton
                                className={styles.button}
                                transparent
                                iconName="edit"
                                modal={(
                                    <AddIncidentForm
                                        lossServerId={lossServerId}
                                        incidentServerId={incidentServerId}
                                        incidentDetails={data}
                                        onIncidentChange={this.handleIncidentEdit}
                                        onLossChange={this.handleLossEdit}
                                    />
                                )}
                            >
                                Edit
                            </ModalAccentButton>
                        </Cloak>
                        <Cloak hiddenIf={p => !p.change_incident}>
                            <DangerConfirmButton
                                iconName="delete"
                                className={styles.button}
                                confirmationMessage="Are you sure you want to delete this incident?"
                                onClick={this.handleIncidentDelete}
                                pending={incidentDeletePending}
                                transparent
                            >
                                Delete
                            </DangerConfirmButton>
                        </Cloak>
                    </div>
                    <div className={styles.content}>
                        <LocationOutput
                            provinceTitle={provinceTitle}
                            municipalityTitle={municipalityTitle}
                            districtTitle={districtTitle}
                            streetAddress={streetAddress}
                            alwaysVisible
                        />
                        <div className={styles.outputGroup}>
                            <TextOutput
                                label="Source"
                                value={sources[source]}
                                alwaysVisible
                                className={styles.source}
                            />
                            <TextOutput
                                value={verified ? 'Verified' : 'Not verified'}
                                label="Status"
                                alwaysVisible
                                className={styles.status}
                            />
                        </div>
                    </div>
                    <div className={styles.publicActions}>
                        <Link
                            className={styles.link}
                            to={reverseRoute('incidents/:incidentId/response', { incidentId })}
                        >
                            Go to response
                        </Link>
                        <ModalAccentButton
                            className={styles.button}
                            transparent
                            iconName="chatBox"
                            modal={(
                                <IncidentFeedbackFormModal
                                    incidentId={incidentId}
                                />
                            )}
                        >
                            Leave Feedback
                        </ModalAccentButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createRequestClient(requestOptions)(IncidentItem),
);
