import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import VirtualizedListView from '#rscv/VirtualizedListView';

import TextOutput from '#components/TextOutput';
import { getHazardColor } from '#utils/domain';
import { groupList } from '#utils/common';

import EventItem from './EventItem';
import AlertItem from './AlertItem';
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
        hazardTypes: this.props.hazardTypes,
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
                { showVisualizations ? (
                    <Visualizations
                        hazardTypes={hazardTypes}
                        className={styles.alertVisualizations}
                        alertList={alerts}
                    />
                ) : (
                    <div className={styles.alertsAndEvents} />
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

        return (
            <div className={_cs(className, styles.leftPane)}>
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
                <div className={styles.bottomContainer}>
                    <div className={styles.alertList}>
                        <header className={styles.header}>
                            <div className={_cs(styles.icon, styles.alertIcon)} />
                            <h2 className={styles.heading}>
                                Alerts
                            </h2>
                        </header>
                        <VirtualizedListView
                            className={styles.content}
                            data={alertList}
                            renderer={AlertItem}
                            rendererParams={this.getAlertRendererParams}
                            keySelector={alertKeySelector}
                            itemHeight={57}
                            emptyComponent={AlertEmptyComponent}
                        />
                    </div>
                    <div className={styles.eventList}>
                        <header className={styles.header}>
                            <div className={_cs(styles.icon, styles.eventIcon)} />
                            <h2 className={styles.heading}>
                                Major events
                            </h2>
                        </header>
                        <VirtualizedListView
                            className={styles.content}
                            data={eventList}
                            renderer={EventItem}
                            rendererParams={this.getEventRendererParams}
                            keySelector={eventKeySelector}
                            itemHeight={60}
                            emptyComponent={EventEmptyComponent}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
