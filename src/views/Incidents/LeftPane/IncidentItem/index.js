import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    _cs,
    isDefined,
    reverseRoute,
} from '@togglecorp/fujs';
import { Link } from '@reach/router';

import { iconNames } from '#constants';
import TextOutput from '#components/TextOutput';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import AccentButton from '#rsca/Button/AccentButton';
import modalize from '#rscg/Modalize';
import DateOutput from '#components/DateOutput';

import { getHazardColor, getHazardIcon } from '#utils/domain';
import GeoOutput from '#components/GeoOutput';

import { getYesterday } from '#utils/common';
import Cloak from '#components/Cloak';
import { sourcesSelector } from '#selectors';

import {
    patchIncidentActionIP,
    setIncidentActionIP,
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
    patchIncident: PropTypes.func.isRequired,
    onHover: PropTypes.func,
    recentDay: PropTypes.number.isRequired,
    isHovered: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    sources: sourcesSelector(state),
});

const mapDispatchToProps = dispatch => ({
    patchIncident: params => dispatch(patchIncidentActionIP(params)),
    setIncident: params => dispatch(setIncidentActionIP(params)),
});

const defaultProps = {
    className: undefined,
    onHover: undefined,
};

const isRecent = (date, recentDay) => {
    const yesterday = getYesterday(recentDay);
    const timestamp = new Date(date).getTime();
    return timestamp > yesterday;
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

    render() {
        const {
            className,
            data,
            hazardTypes,
            recentDay,
            isHovered,
            sources,
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
        } = data;


        const verifiedIconClass = verified
            ? _cs(styles.icon, iconNames.check, styles.verified)
            : _cs(styles.icon, iconNames.close);

        const isNew = isRecent(incidentOn, recentDay);
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
                            hideIcon
                            className={styles.date}
                            value={incidentOn}
                        />
                    </header>
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
                    <div className={styles.actions}>
                        <Cloak hiddenIf={p => !p.change_incident}>
                            <ModalAccentButton
                                className={styles.button}
                                transparent
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
                        <Link
                            className={styles.link}
                            to={reverseRoute('incidents/:incidentId/response', { incidentId })}
                        >
                            Go to response
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentItem);
