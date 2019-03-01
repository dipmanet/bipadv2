import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {
    _cs,
    mapToList,
} from '@togglecorp/fujs';
import ReactSVG from 'react-svg';

import { hazardIcons } from '#resources/data';
import Button from '#rsca/Button';
// import PieChart from '#rscz/PieChart';
import DonutChart from '#rscz/DonutChart';
import ListView from '#rscv/List/ListView';
import Histogram from '#rscz/Histogram';
import Spinner from '#rscz/Spinner';

import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';
import { basicColor } from '#constants/colorScheme';

import TabularView from './TabularView';

import styles from './styles.scss';

const propTypes = {
    alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    pending: PropTypes.bool,
    className: PropTypes.string,
};

const defaultProps = {
    pending: false,
    alertList: [],
    className: undefined,
};

const alertKeySelector = d => d.id;
const emptyObject = {};

const pieChartValueSelector = d => d.value;
const pieChartLabelSelector = d => d.label;

export default class LeftPane extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showAlerts: true,
            showTabular: false,
        };
    }

    getAlertRendererParams = (_, d) => ({
        data: d,
        className: styles.alert,
    });

    groupByHazard = memoize((alerts, hazards) => {
        const freqObj = alerts.reduce((total, obj) => {
            const key = obj.hazard;
            if (!total[key]) {
                total[key] = []; // eslint-disable-line no-param-reassign
            }
            total[key].push(obj.hazard);
            return total;
        }, {});

        return mapToList(
            freqObj,
            (d, k) => ({
                label: (hazards[k] || {}).title,
                value: d.length,
            }),
        );
    });

    handleCollapseTabularViewButtonClick = () => {
        this.setState({ showTabular: false });
    }

    handleExpandButtonClick = () => {
        this.setState({ showTabular: true });
    }

    handleShowAlertsButtonClick = () => {
        this.setState({ showAlerts: true });
    }

    handleHideAlertsButtonClick = () => {
        this.setState({ showAlerts: false });
    }

    renderAlert = ({
        className,
        data: {
            title,
            hazard,
        } = emptyObject,
    }) => {
        const { hazardTypes } = this.props;
        const {
            // icon,
            label,
        } = hazardTypes[hazard] || {};
        const icon = hazardIcons[hazard];

        /*
        <img
            className={styles.icon}
            src={icon}
            alt={label}
        />
        */

        return (
            <div className={className}>
                { icon ? (
                    <ReactSVG
                        className={styles.svgContainer}
                        path={icon}
                        svgClassName={styles.icon}
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
                    { title }
                </div>
            </div>
        );
    };

    renderAlerts = ({
        className,
        data,
        pending,
    }) => (
        <div className={className}>
            <header className={styles.header}>
                <h4 className={styles.heading}>
                    Alerts
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
                    className={styles.hideAlertsButton}
                    onClick={this.handleHideAlertsButtonClick}
                    iconName={iconNames.chevronUp}
                    title="Close Alerts"
                    transparent
                />
            </header>
            <ListView
                className={styles.alertList}
                data={data}
                renderer={this.renderAlert}
                rendererParams={this.getAlertRendererParams}
                keySelector={alertKeySelector}
            />
        </div>
    )

    renderKeyStatistics = ({ className }) => {
        const {
            alertList,
            hazardTypes,
        } = this.props;

        const alertFreq = this.groupByHazard(alertList, hazardTypes);
        const alertTimeStamps = alertList.map(a => a.alertOn);

        return (
            <div className={className}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Alerts Overview
                    </h4>
                </header>
                <div className={styles.content}>
                    <DonutChart
                        sideLengthRatio={0.2}
                        className={styles.pieChart}
                        data={alertFreq}
                        labelSelector={pieChartLabelSelector}
                        colorScheme={basicColor}
                        valueSelector={pieChartValueSelector}
                    />
                    {/*
                    <Histogram
                        data={alertTimeStamps}
                    />
                    */}
                </div>
            </div>
        );
    }

    render() {
        const {
            className,
            alertList,
            pending,
        } = this.props;

        const {
            showAlerts,
            showTabular,
        } = this.state;

        const Alerts = this.renderAlerts;
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
                            title="Show alerts"
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
                                <Alerts
                                    className={styles.alerts}
                                    data={alertList}
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
