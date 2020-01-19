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
import GeoOutput from '#components/GeoOutput';
import { getHazardColor, getHazardIcon } from '#utils/domain';
import { getYesterday } from '#utils/common';
import Cloak from '#components/Cloak';

import {
    patchIncidentActionIP,
    setIncidentActionIP,
} from '#actionCreators';

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
    isHovered: PropTypes.boolean.isRequired,
};

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
        } = this.props;

        const {
            id: incidentServerId,
            title,
            incidentOn,
            streetAddress,
            source,
            verified,
            hazard,
            id: incidentId,
            loss: {
                id: lossServerId,
            } = {},
        } = data;

        const verifiedIconClass = verified
            ? _cs(styles.icon, iconNames.check, styles.verified)
            : _cs(styles.icon, iconNames.close);

        const icon = getHazardIcon(hazardTypes, hazard);
        const isNew = isRecent(incidentOn, recentDay);

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
                        src={icon}
                        style={{ color: getHazardColor(hazardTypes, hazard) }}
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
                        <span className={verifiedIconClass} />
                    </header>
                    <div className={styles.content}>
                        <DateOutput
                            value={incidentOn}
                            alwaysVisible
                        />
                        <GeoOutput
                            geoareaName={streetAddress}
                            alwaysVisible
                        />
                        <TextOutput
                            label="Source"
                            value={source}
                            alwaysVisible
                        />
                    </div>
                    <div className={styles.footer}>
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
                            <Link
                                className={styles.link}
                                to={reverseRoute('incidents/:incidentId/response', { incidentId })}
                            >
                                Go to response
                            </Link>
                        </Cloak>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(IncidentItem);
