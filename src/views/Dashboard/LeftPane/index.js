import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import VirtualizedListView from '#rscv/VirtualizedListView';
import Icon from '#rscg/Icon';
import AccentButton from '#rsca/Button/AccentButton';
import Button from '#rsca/Button';

import { getHazardColor } from '#utils/domain';
import { groupList } from '#utils/common';
import Cloak from '#components/Cloak';

import EventItem from './EventItem';
import AlertItem from './AlertItem';
import Visualizations from './Visualizations';
import AddAlertForm from './AddAlertForm';
import AddEventForm from './AddEventForm';

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

const AlertEmptyComponent = () => (
    <div className={styles.alertEmpty}>
        There are no alerts at the moment.
    </div>
);

const EventEmptyComponent = () => (
    <div className={styles.alertEmpty}>
        There are no major events at the moment.
    </div>
);

export default class LeftPane extends React.PureComponent {
    static propTypes = propTypes

    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showVisualizations: false,
            showAddAlertModal: false,
            showAddEventModal: false,
            showList: true,
            activeView: 'alerts',
        };
    }

    getAlertRendererParams = (_, d) => ({
        alert: d,
        hazardTypes: this.props.hazardTypes,
        recentDay: this.props.recentDay,
        onEditButtonClick: this.handleAlertEditButtonClick,
        onDeleteButtonClick: this.props.onDeleteAlertButtonClick,
        onHover: this.props.onAlertHover,
        isHovered: this.props.hoveredAlertId === d.id,
        className: styles.alertItem,
    });

    getEventRendererParams = (_, d) => ({
        event: d,
        hazardTypes: this.props.hazardTypes,
        onEditButtonClick: this.handleEventEditButtonClick,
        onDeleteButtonClick: this.props.onDeleteEventButtonClick,
        onHover: this.props.onEventHover,
        isHovered: this.props.hoveredEventId === d.id,
        className: styles.eventItem,
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

    handleAlertEditButtonClick = (alert) => {
        this.setState({
            showAddAlertModal: true,
            alertToEdit: alert,
        });
    }

    handleAddAlertButtonClick = () => {
        this.setState({
            showAddAlertModal: true,
            alertToEdit: undefined,
        });
    }

    handleAddAlertModalCloseButtonClick = () => {
        this.setState({
            showAddAlertModal: false,
            alertToEdit: undefined,
        });
    }

    handleAlertFormRequestSuccess = (response) => {
        this.setState({
            showAddAlertModal: false,
            alertToEdit: undefined,
        });

        const { onAlertChange } = this.props;
        onAlertChange(response);
    }

    handleEventEditButtonClick = (event) => {
        this.setState({
            showAddEventModal: true,
            eventToEdit: event,
        });
    }

    handleAddEventButtonClick = () => {
        this.setState({
            showAddEventModal: true,
            eventToEdit: undefined,
        });
    }

    handleAddEventModalCloseButtonClick = () => {
        this.setState({
            showAddEventModal: false,
            eventToEdit: undefined,
        });
    }

    handleEventFormRequestSuccess = (response) => {
        this.setState({
            showAddEventModal: false,
            eventToEdit: undefined,
        });

        const { onEventChange } = this.props;
        onEventChange(response);
    }

    handleAlertsButtonClick = () => {
        this.setState({ activeView: 'alerts' });
    }

    handleEventsButtonClick = () => {
        this.setState({ activeView: 'events' });
    }

    handleVisualizationsButtonClick = () => {
        this.setState({ activeView: 'visualizations' });
    }

    render() {
        const {
            className,
            alertList,
            eventList,
            pending,
            hazardTypes,
        } = this.props;

        const {
            showAddAlertModal,
            showAddEventModal,
            alertToEdit,
            eventToEdit,
            activeView,
        } = this.state;

        return (
            <div className={_cs(className, styles.leftPane)}>
                <header className={styles.header}>
                    <div className={styles.tabs}>
                        <div
                            className={_cs(styles.tab, activeView === 'alerts' && styles.active)}
                            onClick={this.handleAlertsButtonClick}
                            role="presentation"
                        >
                            <div className={styles.value}>
                                { alertList.length }
                            </div>
                            <div className={styles.title}>
                                <div className={_cs(styles.icon, styles.alertIcon)} />
                                <div className={styles.text}>
                                    Alerts
                                </div>
                            </div>
                        </div>
                        <div
                            className={_cs(styles.tab, activeView === 'events' && styles.active)}
                            onClick={this.handleEventsButtonClick}
                            role="presentation"
                        >
                            <div className={styles.value}>
                                { eventList.length }
                            </div>
                            <div className={styles.title}>
                                <div className={_cs(styles.icon, styles.eventIcon)} />
                                <div className={styles.text}>
                                    Events
                                </div>
                            </div>
                        </div>
                        <div
                            className={_cs(styles.tab, activeView === 'visualizations' && styles.active)}
                            role="presentation"
                            onClick={this.handleVisualizationsButtonClick}
                            iconName="bars"
                        >
                            <Icon
                                className={styles.visualizationIcon}
                                name="bars"
                            />
                            <div className={styles.text}>
                                Visualizations
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <Button
                            iconName="table"
                        />
                    </div>
                </header>
                <div className={styles.content}>
                    { activeView === 'visualizations' && (
                        <Visualizations
                            hazardTypes={hazardTypes}
                            className={styles.alertVisualizations}
                            alertList={alertList}
                        />
                    )}
                    { activeView === 'alerts' && (
                        <div className={styles.alertList}>
                            <header className={styles.header}>
                                <Cloak hiddenIf={p => !p.change_alert}>
                                    <AccentButton onClick={this.handleAddAlertButtonClick}>
                                        Add new alert
                                    </AccentButton>
                                </Cloak>
                            </header>
                            <VirtualizedListView
                                className={styles.content}
                                data={alertList}
                                renderer={AlertItem}
                                rendererParams={this.getAlertRendererParams}
                                keySelector={alertKeySelector}
                                emptyComponent={AlertEmptyComponent}
                            />
                        </div>
                    )}
                    { activeView === 'events' && (
                        <div className={styles.eventList}>
                            <header className={styles.header}>
                                <h2 className={styles.heading}>
                                    Major events
                                </h2>
                                <Cloak hiddenIf={p => !p.change_event}>
                                    <div className={styles.actions}>
                                        <AccentButton
                                            transparent
                                            onClick={this.handleAddEventButtonClick}
                                        >
                                            Add
                                        </AccentButton>
                                    </div>
                                </Cloak>
                            </header>
                            <VirtualizedListView
                                className={styles.content}
                                data={eventList}
                                renderer={EventItem}
                                rendererParams={this.getEventRendererParams}
                                keySelector={eventKeySelector}
                                emptyComponent={EventEmptyComponent}
                            />
                        </div>
                    )}
                </div>
                { showAddAlertModal && (
                    <AddAlertForm
                        data={alertToEdit}
                        onCloseButtonClick={this.handleAddAlertModalCloseButtonClick}
                        onRequestSuccess={this.handleAlertFormRequestSuccess}
                    />
                )}
                { showAddEventModal && (
                    <AddEventForm
                        data={eventToEdit}
                        onCloseButtonClick={this.handleAddEventModalCloseButtonClick}
                        onRequestSuccess={this.handleEventFormRequestSuccess}
                    />
                )}
            </div>
        );
    }
}
