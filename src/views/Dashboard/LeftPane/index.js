import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import VirtualizedListView from '#rscv/VirtualizedListView';
import Button from '#rsca/Button';
import AccentButton from '#rsca/Button/AccentButton';

import TextOutput from '#components/TextOutput';
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
            showVisualizations,
            showList,
        } = this.state;

        return (
            <div className={_cs(className, styles.leftPane)}>
                <div className={styles.topContainer}>
                    <div className={styles.stats}>
                        <TextOutput
                            className={styles.stat}
                            isNumericValue
                            label="Alerts"
                            labelClassName={styles.label}
                            type="block"
                            value={alertList.length}
                            valueClassName={styles.value}
                        />
                        <TextOutput
                            className={styles.stat}
                            isNumericValue
                            label="Events"
                            labelClassName={styles.label}
                            type="block"
                            value={eventList.length}
                            valueClassName={styles.value}
                        />
                    </div>
                    <div className={styles.actions}>
                        <Button
                            className={_cs(styles.showListButton, showList && styles.active)}
                            iconName="list"
                            transparent
                            title="Show list"
                            onClick={() => this.setState({
                                showList: true,
                                showVisualizations: false,
                            })}
                        />
                        <Button
                            className={_cs(
                                styles.showVisualizationsButton,
                                showVisualizations && styles.active,
                            )}
                            onClick={() => this.setState({
                                showVisualizations: true,
                                showList: false,
                            })}
                            transparent
                            iconName="bars"
                            title="Show visualizations"
                        />
                    </div>
                </div>
                <div className={styles.bottomContainer}>
                    { showVisualizations && (
                        <Visualizations
                            hazardTypes={hazardTypes}
                            className={styles.alertVisualizations}
                            alertList={alertList}
                        />
                    )}
                    { showList && (
                        <>
                            <div className={styles.alertList}>
                                <header className={styles.header}>
                                    <div className={_cs(styles.icon, styles.alertIcon)} />
                                    <h2 className={styles.heading}>
                                        Alerts
                                    </h2>
                                    <Cloak hiddenIf={p => !p.change_alert}>
                                        <div className={styles.actions}>
                                            <AccentButton
                                                transparent
                                                onClick={this.handleAddAlertButtonClick}
                                            >
                                                Add
                                            </AccentButton>
                                        </div>
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
                            <div className={styles.eventList}>
                                <header className={styles.header}>
                                    <div className={_cs(styles.icon, styles.eventIcon)} />
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
                        </>
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
