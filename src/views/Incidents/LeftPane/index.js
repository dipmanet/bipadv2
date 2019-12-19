import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';

import { calculateCategorizedSeverity, severityScaleFactor, calculateSeverity } from '#utils/domain';
import LossDetails from '#components/LossDetails';

import { iconNames } from '#constants';

import {
    hazardTypesSelector,
} from '#selectors';

import IncidentListView from './ListView';
import AddIncidentForm from './AddIncidentForm';
import AddDocumentForm from './AddDocumentForm';
import AddResourceForm from './AddResourceForm';
import AddInventoryForm from './AddInventoryForm';
import AddLossModal from './AddLossModal';

import styles from './styles.scss';

const ModalButton = modalize(Button);

const propTypes = {
    className: PropTypes.string,
    hazardTypes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
};

class LeftPane extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showIncidents: true,
            showTabular: false,
            showVisualizations: false,
            lossServerId: undefined,
            incidentServerId: undefined,
        };
    }

    handleToggleVisualizationButtonClick = () => {
        const { showVisualizations } = this.state;
        this.setState({
            showVisualizations: !showVisualizations,
        });
    }

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

    handleIncidentEdit = (incident) => {
        this.setState({
            incidentServerId: incident.id,
        });
    }

    handleLossEdit = (loss) => {
        this.setState({
            lossServerId: loss.id,
        });
    }

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

    render() {
        const {
            className,
            incidentList: incidentListNoSeverity,
            hazardTypes,
            recentDay,
        } = this.props;

        const {
            showIncidents,
            showTabular,
            showVisualizations,
            lossServerId,
            incidentServerId,
        } = this.state;

        // FIXME: fix this
        const incidentList = incidentListNoSeverity.map(incident => ({
            ...incident,
            severity: calculateCategorizedSeverity(
                calculateSeverity(incident.loss, severityScaleFactor),
            ),
        }));

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
                        </div>
                    </header>
                    <IncidentListView
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

export default connect(mapStateToProps)(LeftPane);
