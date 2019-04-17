import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import { calculateCategorizedSeverity } from '#utils/domain';
import { iconNames } from '#constants';
import CollapsibleView from '#components/CollapsibleView';

import {
    hazardTypesSelector,
} from '#selectors';


import TabularView from './TabularView';
import IncidentListView from './ListView';
import Visualizations from './Visualizations';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    hazardTypes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    pending: PropTypes.bool,
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    pending: false,
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

    renderListViewHeader = () => (
        <header className={styles.header}>
            <h4 className={styles.heading}>
                Incidents
            </h4>
            <Button
                className={styles.toggleVisualizationButton}
                onClick={this.handleToggleVisualizationButtonClick}
                iconName={this.state.showVisualizations ? iconNames.list : iconNames.pulse}
                title="Toggle visualization"
                transparent
            />
            <Button
                className={styles.expandTabularViewButton}
                onClick={this.handleExpandButtonClick}
                iconName={iconNames.expand}
                title="Show detailed view"
                transparent
            />
            <Button
                className={styles.hideIncidentsButton}
                onClick={this.handleHideIncidentsButtonClick}
                iconName={iconNames.chevronUp}
                title="Hide Incidents"
                transparent
            />
        </header>
    )

    renderTabularViewHeader = () => (
        <header className={styles.header}>
            <h4 className={styles.heading}>
                Incidents
            </h4>
            <Button
                className={styles.collapseTabularViewButton}
                onClick={this.handleCollapseTabularViewButtonClick}
                iconName={iconNames.shrink}
                title="Hide detailed view"
                transparent
            />
            <Button
                className={styles.hideIncidentsButton}
                onClick={this.handleHideIncidentsButtonClick}
                iconName={iconNames.chevronUp}
                title="Hide Incidents"
                transparent
            />
        </header>
    )

    render() {
        const {
            className,
            incidentList: incidentListNoSeverity,
            hazardTypes,
            pending,
            recentDay,
        } = this.props;

        const {
            showIncidents,
            showTabular,
            showVisualizations,
        } = this.state;

        const incidentList = incidentListNoSeverity.map(incident => ({
            ...incident,
            severity: calculateCategorizedSeverity(incident.loss),
        }));

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={showIncidents}
                collapsedViewContainerClassName={styles.showIncidentsButtonContainer}
                collapsedView={
                    <React.Fragment>
                        <PrimaryButton
                            className={styles.showIncidentsButton}
                            onClick={this.handleShowIncidentsButtonClick}
                            title="Show incidents"
                        >
                            Show Incidents
                        </PrimaryButton>
                    </React.Fragment>
                }
                expandedViewContainerClassName={styles.incidentsContainer}
                expandedView={
                    <CollapsibleView
                        expanded={showTabular}
                        collapsedViewContainerClassName={styles.nonTabularContainer}
                        collapsedView={
                            <React.Fragment>
                                { this.renderListViewHeader() }
                                <div className={styles.content}>
                                    { showVisualizations ? (
                                        <Visualizations
                                            hazardTypes={hazardTypes}
                                            className={styles.incidentVisualizations}
                                            incidentList={incidentList}
                                        />
                                    ) : (
                                        <IncidentListView
                                            hazardTypes={hazardTypes}
                                            className={styles.incidentList}
                                            incidentList={incidentList}
                                            recentDay={recentDay}
                                        />
                                    )}
                                </div>
                            </React.Fragment>
                        }
                        expandedViewContainerClassName={styles.tabularContainer}
                        expandedView={
                            <React.Fragment>
                                { this.renderTabularViewHeader() }
                                <TabularView
                                    incidentList={incidentList}
                                    className={styles.tabularView}
                                />
                            </React.Fragment>
                        }
                    />
                }
            />
        );
    }
}

const mapStateToProps = state => ({
    hazardTypes: hazardTypesSelector(state),
});

export default connect(mapStateToProps)(LeftPane);
