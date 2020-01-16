import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
} from '@togglecorp/fujs';

import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';

import { calculateCategorizedSeverity, severityScaleFactor, calculateSeverity } from '#utils/domain';
import LossDetails from '#components/LossDetails';

import {
    hazardTypesSelector,
} from '#selectors';
import {
    setIncidentActionIP,
    patchIncidentActionIP,
} from '#actionCreators';
import Cloak from '#components/Cloak';

import IncidentListView from './ListView';
import AddIncidentForm from './AddIncidentForm';

import styles from './styles.scss';

const ModalButton = modalize(Button);

const propTypes = {
    className: PropTypes.string,
    hazardTypes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    setIncident: PropTypes.func.isRequired,
    patchIncident: PropTypes.func.isRequired,
    onIncidentHover: PropTypes.func.isRequired,
    recentDay: PropTypes.number.isRequired,
    hoveredIncidentId: PropTypes.number.isRequired,
};

const defaultProps = {
    className: undefined,
};

const mapDispatchToProps = dispatch => ({
    patchIncident: params => dispatch(patchIncidentActionIP(params)),
    setIncident: params => dispatch(setIncidentActionIP(params)),
});

class LeftPane extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showVisualizations: false,
            lossServerId: undefined,
            incidentServerId: undefined,
        };
    }

    getMappedIncidentList = memoize((incidentList) => {
        const newIncidentList = incidentList.map(incident => ({
            ...incident,
            severity: calculateCategorizedSeverity(
                calculateSeverity(incident.loss, severityScaleFactor),
            ),
        })).sort((a, b) => compareDate(b.incidentOn, a.incidentOn));
        return newIncidentList;
    });

    handleToggleVisualizationButtonClick = () => {
        const { showVisualizations } = this.state;

        this.setState({
            showVisualizations: !showVisualizations,
        });
    }

    /*
    handleCollapseTabularViewButtonClick = () => {
        this.setState({ showTabular: false });
    }

    handleExpandButtonClick = () => {
        this.setState({ showTabular: true });
    }

    handleShowIncidentsButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showIncidents: true });

        if (onExpandChange) {
            onExpandChange(true);
        }
    }

    handleHideIncidentsButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showIncidents: false });

        if (onExpandChange) {
            onExpandChange(false);
        }
    }
    */

    handleIncidentEdit = (incident) => {
        const { setIncident } = this.props;

        setIncident({ incident });
        this.setState({
            incidentServerId: incident.id,
        });
    }

    handleLossEdit = (loss, incident) => {
        const { patchIncident } = this.props;

        patchIncident({
            incident: {
                loss,
            },
            incidentId: incident.id,
        });

        this.setState({
            lossServerId: loss.id,
        });
    }

    /*
    renderTabularViewHeader = () => (
        <header className={styles.header}>
            <h4 className={styles.heading}>
                Incidents
            </h4>
            <Button
                className={styles.collapseTabularViewButton}
                onClick={this.handleCollapseTabularViewButtonClick}
                iconName={iconNames.chevronUp}
                title="Hide detailed view"
                transparent
            />
        </header>
    )
    */

    render() {
        const {
            className,
            incidentList: incidentListFromProps,
            hazardTypes,
            recentDay,
            onIncidentHover,
            hoveredIncidentId,
        } = this.props;

        const {
            lossServerId,
            incidentServerId,
        } = this.state;

        const incidentList = this.getMappedIncidentList(incidentListFromProps);

        return (
            <div className={_cs(className, styles.leftPane)}>
                <LossDetails
                    className={styles.lossDetails}
                    data={incidentList}
                />
                <div className={styles.incidentList}>
                    <header className={styles.header}>
                        <h2 className={styles.heading}>
                            Incidents
                        </h2>
                        <div className={styles.buttons}>
                            <Cloak hiddenIf={p => !p.change_incident}>
                                <ModalButton
                                    className={styles.addIncidentButton}
                                    title="Add"
                                    transparent
                                    modal={(
                                        <AddIncidentForm
                                            lossServerId={lossServerId}
                                            incidentServerId={incidentServerId}
                                            onIncidentChange={this.handleIncidentEdit}
                                            onLossChange={this.handleLossEdit}
                                        />
                                    )}
                                >
                                    Add
                                </ModalButton>
                            </Cloak>
                        </div>
                    </header>
                    <IncidentListView
                        onIncidentHover={onIncidentHover}
                        hoveredIncidentId={hoveredIncidentId}
                        hazardTypes={hazardTypes}
                        className={styles.content}
                        incidentList={incidentList}
                        recentDay={recentDay}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);
