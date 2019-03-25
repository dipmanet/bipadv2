import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { schemeAccent } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale';
import {
    _cs,
    mapToList,
} from '@togglecorp/fujs';

import Button from '#rsca/Button';
import Spinner from '#rscz/Spinner';
import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import DonutChart from '#rscz/DonutChart';
import Legend from '#rscz/Legend';

import { calculateCategorizedSeverity } from '#utils/domain';
import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';


import {
    hazardTypesSelector,
} from '#selectors';


import TabularView from './TabularView';

import IncidentListView from './ListView';

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

const colors = scaleOrdinal().range(schemeAccent);

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;
const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;
const donutChartColorSelector = d => d.color;
const incidentKeySelector = d => d.id;

const itemSelector = d => d.label;
const legendColorSelector = d => d.color;
const legendLabelSelector = d => d.label;

class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showIncidents: true,
            showTabular: false,
        };
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
            <Spinner loading={this.props.pending} />
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
            <Spinner loading={this.props.pending} />
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
        } = this.props;

        const {
            showIncidents,
            showTabular,
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
                        <Button
                            className={styles.showIncidentsButton}
                            onClick={this.handleShowIncidentsButtonClick}
                            iconName={iconNames.incident}
                            title="Show alerts"
                        />
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
                                    <IncidentListView
                                        hazardTypes={hazardTypes}
                                        className={styles.incidentList}
                                        incidentList={incidentList}
                                    />
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
