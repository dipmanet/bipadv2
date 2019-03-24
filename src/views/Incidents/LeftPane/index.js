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

import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import Spinner from '#rscz/Spinner';
import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import DonutChart from '#rscz/DonutChart';
import Legend from '#rscz/Legend';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';
import { hazardTypesSelector } from '#selectors';
import { calculateCategorizedSeverity } from '#utils/domain';

import IncidentItem from '../IncidentItem';
import TabularView from './TabularView';

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

    getSummaryForLabel = memoize((incidentList, labelName, labelModifier = k => k) => {
        const summary = incidentList
            .filter(v => v[labelName])
            .reduce((acc, current) => {
                if (acc[current[labelName]] === undefined) {
                    acc[current[labelName]] = 0;
                } else {
                    acc[current[labelName]] += 1;
                }
                return acc;
            }, {});

        return mapToList(
            summary,
            (d, k) => ({
                label: labelModifier(k),
                value: d,
                color: colors(labelModifier(k)),
            }),
        );
    });

    getSeveritySummary = memoize((incidentList) => {
        const severity = incidentList
            .filter(v => v.severity)
            .reduce((acc, current) => {
                if (acc[current.severity] === undefined) {
                    acc[current.severity] = 0;
                } else {
                    acc[current.severity] += 1;
                }
                return acc;
            }, {});

        return mapToList(
            severity,
            (d, k) => ({
                label: k,
                value: d,
                color: colors(k),
            }),
        );
    });

    getEventSummary = memoize((incidentList) => {
        const hazardCount = incidentList
            .filter(v => v.event)
            .reduce((acc, current) => {
                if (acc[current.event.title] === undefined) {
                    acc[current.event.title] = 0;
                } else {
                    acc[current.event.title] += 1;
                }
                return acc;
            }, {});

        return mapToList(
            hazardCount,
            (d, k) => ({
                label: k,
                value: d,
            }),
        );
    });

    getIncidentRendererParams = (_, d) => ({
        data: d,
        className: styles.incident,
    });

    handleCollapseTabularViewButtonClick = () => {
        this.setState({ showTabular: false });
    }

    handleExpandButtonClick = () => {
        this.setState({ showTabular: true });
    }


    handleShowIncidentsButtonClick = () => {
        this.setState({ showIncidents: true });
    }

    handleHideIncidentsButtonClick = () => {
        this.setState({ showIncidents: false });
    }

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

        const severitySummary = this.getSummaryForLabel(incidentList, 'severity');
        const inducerSummary = this.getSummaryForLabel(incidentList, 'inducer');
        const hazardSummary = this.getSummaryForLabel(incidentList, 'hazard', k => hazardTypes[k].title);
        const eventSummary = this.getEventSummary(incidentList);

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
                        <Spinner loading={pending} />
                    </React.Fragment>
                }
                expandedViewContainerClassName={styles.incidentListContainer}
                expandedView={
                    <CollapsibleView
                        expanded={showTabular}
                        collapsedViewContainerClassName={styles.nonTabularContainer}
                        collapsedView={
                            <React.Fragment>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Incidents
                                    </h4>
                                    <Spinner loading={pending} />
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
                                <div className={styles.content}>
                                    <div className={styles.barContainer}>
                                        <header className={styles.header}>
                                            <h4 className={styles.heading}>
                                                Hazard Statistics
                                            </h4>
                                        </header>
                                        <SimpleVerticalBarChart
                                            className={styles.chart}
                                            data={hazardSummary}
                                            labelSelector={barChartLabelSelector}
                                            valueSelector={barChartValueSelector}
                                        />
                                    </div>
                                    <div className={styles.barContainer}>
                                        <header className={styles.header}>
                                            <h4 className={styles.heading}>
                                                Event Statistics
                                            </h4>
                                        </header>
                                        <SimpleVerticalBarChart
                                            className={styles.chart}
                                            data={eventSummary}
                                            labelSelector={barChartLabelSelector}
                                            valueSelector={barChartValueSelector}
                                        />
                                    </div>
                                    <div className={styles.donutContainer}>
                                        <div className={styles.severitySummary}>
                                            <header className={styles.header}>
                                                <h4 className={styles.heading}>
                                                    Severity
                                                </h4>
                                            </header>
                                            <DonutChart
                                                sideLengthRatio={0.5}
                                                className={styles.chart}
                                                data={severitySummary}
                                                labelSelector={donutChartLabelSelector}
                                                valueSelector={donutChartValueSelector}
                                                colorSelector={donutChartColorSelector}
                                            />
                                            <Legend
                                                className={styles.legend}
                                                data={severitySummary}
                                                itemClassName={styles.legendItem}
                                                keySelector={itemSelector}
                                                labelSelector={legendLabelSelector}
                                                colorSelector={legendColorSelector}
                                            />
                                        </div>
                                        <div className={styles.inducerSummary}>
                                            <header className={styles.header}>
                                                <h4 className={styles.heading}>
                                                    Inducers
                                                </h4>
                                            </header>
                                            <DonutChart
                                                sideLengthRatio={0.5}
                                                className={styles.chart}
                                                data={inducerSummary}
                                                labelSelector={donutChartLabelSelector}
                                                valueSelector={donutChartValueSelector}
                                                colorSelector={donutChartColorSelector}
                                            />
                                            <Legend
                                                className={styles.legend}
                                                data={inducerSummary}
                                                itemClassName={styles.legendItem}
                                                keySelector={itemSelector}
                                                labelSelector={legendLabelSelector}
                                                colorSelector={legendColorSelector}
                                            />
                                        </div>
                                    </div>
                                    <ListView
                                        className={styles.incidentList}
                                        data={incidentList}
                                        renderer={IncidentItem}
                                        rendererParams={this.getIncidentRendererParams}
                                        keySelector={incidentKeySelector}
                                    />
                                </div>
                            </React.Fragment>
                        }
                        expandedViewContainerClassName={styles.tabularContainer}
                        expandedView={
                            <React.Fragment>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Incidents
                                    </h4>
                                    <Spinner loading={pending} />
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
