import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import AccentButton from '#rsca/Button/AccentButton';
import PrimaryButton from '#rsca/Button/PrimaryButton';
import VirtualizedListView from '#rscv/VirtualizedListView';

import TextOutput from '#components/TextOutput';
import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';
import { getHazardColor } from '#utils/domain';
import { groupList } from '#utils/common';

import EventItem from './EventItem';
import AlertItem from './AlertItem';
import AlertTable from './AlertTable';
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

export default class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showAlerts: true,
            showTabular: false,
            showVisualizations: false,
        };
    }

    getAlertRendererParams = (_, d) => ({
        alert: d,
        hazardTypes: this.props.hazardTypes,
        recentDay: this.props.recentDay,
    });

    getEventRendererParams = (_, d) => ({
        event: d,
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

    renderAlertsAndEvents = ({
        events,
        alerts,
        pending,
    }) => {
        const { hazardTypes } = this.props;
        const { showVisualizations } = this.state;

        return (
            <React.Fragment>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Overview
                    </h4>
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
                        title="Close overview"
                        transparent
                    />
                </header>
                <div className={styles.statsContainer}>
                    <TextOutput
                        className={styles.stat}
                        type="block"
                        label="No. of Alerts"
                        value={alerts.length}
                        isNumericValue
                    />
                    <TextOutput
                        className={styles.stat}
                        type="block"
                        label="No. of Events"
                        value={events.length}
                        isNumericValue
                    />
                </div>
                <div className={styles.listHeaderContainer}>
                    <AccentButton
                        transparent
                        onClick={this.handleToggleVisualizationButtonClick}
                    >
                        {
                            showVisualizations
                                ? 'Show list'
                                : 'Show charts'
                        }
                    </AccentButton>
                </div>
                { showVisualizations ? (
                    <Visualizations
                        hazardTypes={hazardTypes}
                        className={styles.alertVisualizations}
                        alertList={alerts}
                    />
                ) : (
                    <div className={styles.alertsAndEvents}>
                        <div className={styles.alertsContainer}>
                            <h4 className={styles.heading}>
                                Alerts
                            </h4>
                            <VirtualizedListView
                                className={styles.alertList}
                                data={alerts}
                                renderer={AlertItem}
                                rendererParams={this.getAlertRendererParams}
                                keySelector={alertKeySelector}
                            />
                        </div>
                        <div className={styles.eventsContainer}>
                            <h4 className={styles.heading}>
                                Events
                            </h4>
                            <VirtualizedListView
                                className={styles.eventList}
                                data={events}
                                renderer={EventItem}
                                rendererParams={this.getEventRendererParams}
                                keySelector={eventKeySelector}
                            />
                        </div>
                    </div>
                )}
            </React.Fragment>
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

        return (
            <CollapsibleView
                className={_cs(className, styles.leftPane)}
                expanded={showAlerts}
                collapsedViewContainerClassName={styles.showAlertsButtonContainer}
                collapsedView={
                    <React.Fragment>
                        <PrimaryButton
                            onClick={this.handleShowAlertsButtonClick}
                            title="Show alerts and events"
                        >
                            Show Overview
                        </PrimaryButton>
                    </React.Fragment>
                }
                expandedViewContainerClassName={styles.overviewContainer}
                expandedView={
                    <CollapsibleView
                        expanded={showTabular}
                        collapsedViewContainerClassName={styles.nonTabularContainer}
                        collapsedView={
                            <AlertsAndEvents
                                alerts={alertList}
                                events={eventList}
                                pending={pending}
                            />
                        }
                        expandedViewContainerClassName={styles.tabularContainer}
                        expandedView={
                            <React.Fragment>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Alerts
                                    </h4>
                                    <Button
                                        className={styles.hideAlertsButton}
                                        onClick={this.handleCollapseTabularViewButtonClick}
                                        iconName={iconNames.chevronUp}
                                        title="Hide detailed view"
                                        transparent
                                    />
                                </header>
                                <AlertTable
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
