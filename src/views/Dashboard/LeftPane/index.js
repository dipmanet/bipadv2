import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import ReactSVG from 'react-svg';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';
import DonutChart from '#rscz/DonutChart';
import Spinner from '#rscz/Spinner';
import FormattedDate from '#rscv/FormattedDate';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';
import { hazardIcons } from '#resources/data';
import { getHazardColor } from '#utils/domain';
import { groupList } from '#utils/common';

import TabularView from './TabularView';
import Visualizations from './Visualizations';

import styles from './styles.scss';

const propTypes = {
    alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    hazardTypes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    pending: PropTypes.bool,
    className: PropTypes.string,
};

const defaultProps = {
    pending: false,
    alertList: [],
    hazardTypes: {},
    className: undefined,
};

const alertKeySelector = d => d.id;
const eventKeySelector = d => d.id;
const emptyObject = {};
const aday = 24 * 60 * 60 * 1000;
const now = Date.now();

const pieChartValueSelector = d => d.value;
const pieChartLabelSelector = d => d.label;

export default class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showAlerts: true,
            showTabular: true,
            showVisualizations: false,
        };
    }

    getAlertRendererParams = (_, d) => ({
        alerts: d,
        className: styles.alert,
    });

    getEventRendererParams = (_, d) => ({
        events: d,
        className: styles.event,
    });

    groupByHazard = memoize((alerts, hazards) => {
        const freqList = groupList(
            alerts,
            alert => alert.hazard,
        );

        const alertFreq = freqList.map(item => ({
            label: (hazards[item.key] || {}).title,
            value: item.value.length,
        }));

        const alertColor = freqList.map(item => getHazardColor(hazards, item.key));

        return {
            alertFreq,
            alertColor,
        };
    });

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

    handleShowAlertsButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showAlerts: true });

        if (onExpandChange) {
            onExpandChange(true);
        }
    }

    handleHideAlertsButtonClick = () => {
        const { onExpandChange } = this.props;
        this.setState({ showAlerts: false });

        if (onExpandChange) {
            onExpandChange(false);
        }
    }

    lessThanADayAgo = (date) => {
        const timediff = now - new Date(date).getTime();
        return timediff < aday;
    }

    renderEvent = ({
        className,
        events: {
            title,
            createdOn,
        } = emptyObject,
    }) => (
        <div
            className={className}
        >
            <div className={styles.title}>
                {title}
            </div>
            <div className={styles.startDate}>
                <FormattedDate
                    date={createdOn}
                    mode="yyyy-MM-dd"
                />
            </div>
        </div>
    )

    renderAlert = ({
        className,
        alerts: {
            title,
            hazard,
            startedOn,
        } = emptyObject,
    }) => {
        const { hazardTypes } = this.props;
        const icon = hazardIcons[hazard];

        const isLatest = this.lessThanADayAgo(startedOn);

        return (
            <div
                className={className}
            >
                { isLatest ? (
                    <div className={styles.latest} />
                ) : (
                    <div className={styles.old} />
                )}
                {icon ? (
                    <ReactSVG
                        className={styles.svgContainer}
                        path={icon}
                        svgClassName={styles.icon}
                        style={{
                            color: getHazardColor(hazardTypes, hazard),
                        }}
                    />
                ) : (
                    <div
                        className={_cs(
                            iconNames.alert,
                            styles.defaultIcon,
                        )}
                    />
                )}
                <div className={styles.title}>
                    {title}
                </div>
                <div className={styles.startDate}>
                    <FormattedDate
                        date={startedOn}
                        mode="yyyy-MM-dd"
                    />
                </div>
            </div>
        );
    };

    renderAlertsAndEvents = ({
        className,
        events,
        alerts,
        pending,
    }) => {
        const { hazardTypes } = this.props;
        const { showVisualizations } = this.state;

        return (
            <div className={className}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Alerts And Events
                    </h4>
                    <Spinner loading={pending} />
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
                        className={styles.hideAlertsButton}
                        onClick={this.handleHideAlertsButtonClick}
                        iconName={iconNames.chevronUp}
                        title="Close Alerts And Events"
                        transparent
                    />
                </header>
                { showVisualizations ? (
                    <Visualizations
                        hazardTypes={hazardTypes}
                        className={styles.alertVisualizations}
                        alertList={alerts}
                    />
                ) : (
                    <React.Fragment>
                        <div className={styles.alerts}>
                            <h4 className={styles.heading}>
                                Alerts
                            </h4>
                            <ListView
                                className={styles.alertList}
                                data={alerts}
                                renderer={this.renderAlert}
                                rendererParams={this.getAlertRendererParams}
                                keySelector={alertKeySelector}
                            />
                        </div>
                        <div className={styles.events}>
                            <h4 className={styles.heading}>
                                Events
                            </h4>
                            <ListView
                                className={styles.eventList}
                                data={events}
                                renderer={this.renderEvent}
                                rendererParams={this.getEventRendererParams}
                                keySelector={eventKeySelector}
                            />
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }

    renderKeyStatistics = ({ className }) => {
        // hide stats for now
        if (true) {
            return null;
        }

        const {
            alertList,
            hazardTypes,
        } = this.props;

        const { alertFreq, alertColor } = this.groupByHazard(alertList, hazardTypes);

        return (
            <div className={className}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Alerts And Events Overview
                    </h4>
                </header>
                <div className={styles.content}>
                    <DonutChart
                        sideLengthRatio={0.4}
                        className={styles.pieChart}
                        data={alertFreq}
                        labelSelector={pieChartLabelSelector}
                        colorScheme={alertColor}
                        valueSelector={pieChartValueSelector}
                    />
                </div>
            </div>
        );
    }

    render() {
        const {
            className,
            alertList,
            eventList,
            pending,
        } = this.props;

        const {
            showAlerts,
            showTabular,
        } = this.state;

        const AlertsAndEvents = this.renderAlertsAndEvents;
        const KeyStatistics = this.renderKeyStatistics;

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={showAlerts}
                collapsedViewContainerClassName={styles.showAlertsButtonContainer}
                collapsedView={
                    <React.Fragment>
                        <Button
                            className={styles.showAlertsButton}
                            onClick={this.handleShowAlertsButtonClick}
                            iconName={iconNames.alert}
                            title="Show alerts & events"
                        />
                        <Spinner loading={pending} />
                    </React.Fragment>
                }
                expandedViewContainerClassName={styles.alertsContainer}
                expandedView={
                    <CollapsibleView
                        expanded={showTabular}
                        collapsedViewContainerClassName={styles.nonTabularContainer}
                        collapsedView={
                            <React.Fragment>
                                <AlertsAndEvents
                                    className={styles.alerts}
                                    alerts={alertList}
                                    events={eventList}
                                    pending={pending}
                                />
                                <KeyStatistics
                                    className={styles.keyStatistics}
                                />
                            </React.Fragment>
                        }
                        expandedViewContainerClassName={styles.tabularContainer}
                        expandedView={
                            <React.Fragment>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                         Alerts
                                    </h4>
                                    <Spinner loading={pending} />
                                    <Button
                                        className={styles.hideAlertsButton}
                                        onClick={this.handleCollapseTabularViewButtonClick}
                                        iconName={iconNames.shrink}
                                        title="Hide detailed view"
                                        transparent
                                    />
                                    <Button
                                        className={styles.collapseTabularViewButton}
                                        onClick={this.handleHideAlertsButtonClick}
                                        iconName={iconNames.chevronUp}
                                        title="Close Alerts"
                                        transparent
                                    />
                                </header>
                                <TabularView
                                    alertList={alertList}
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
