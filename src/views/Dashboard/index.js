import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { mapToList } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Button from '#rsca/Button';
import ListView from '#rscv/List/ListView';
import PieChart from '#rscz/PieChart';
import Histogram from '#rscz/Histogram';

import {
    alertListSelectorDP,
    hazardTypesSelector,
} from '#redux';

import CollapsibleView from '#components/CollapsibleView';
import Page from '#components/Page';
import { iconNames } from '#constants';
import { basicColor } from '#constants/colorScheme';

import _cs from '#cs';
import Map from './Map';
import DashboardFilter from './Filter';

import styles from './styles.scss';

const emptyObject = {};
const alertKeySelector = d => d.id;

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;

const pieChartValueSelector = d => d.value;
const pieChartLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;

const propTypes = {
    alertList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    hazardTypes: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

const mapStateToProps = state => ({
    alertList: alertListSelectorDP(state),
    hazardTypes: hazardTypesSelector(state),
});

@connect(mapStateToProps)
export default class Dashboard extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            showFilters: true,
            showAlerts: true,
        };
    }

    getAlertRendererParams = (_, d) => ({
        data: d,
        className: styles.alert,
    });

    handleShowFiltersButtonClick = () => {
        this.setState({ showFilters: true });
    }

    handleHideFiltersButtonClick = () => {
        this.setState({ showFilters: false });
    }

    handleShowAlertsButtonClick = () => {
        this.setState({ showAlerts: true });
    }

    handleHideAlertsButtonClick = () => {
        this.setState({ showAlerts: false });
    }

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
                label: hazards[k].title,
                value: d.length,
            }),
        );
    });

    renderAlert = ({
        className,
        data: {
            title,
            hazard,
        } = emptyObject,
    }) => {
        const { hazardTypes } = this.props;
        const {
            icon,
            label,
        } = hazardTypes[hazard];

        return (
            <div className={className}>
                { icon ? (
                    <img
                        className={styles.icon}
                        src={icon}
                        alt={label}
                    />
                ) : (
                    <div
                        className={_cs(
                            iconNames.alert,
                            styles.icon,
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
    }) => (
        <div className={className}>
            <header className={styles.header}>
                <h4 className={styles.heading}>
                    Alerts
                </h4>
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
                        Key statistics
                    </h4>
                </header>
                <div className={styles.content}>
                    {/*
                    <div className={styles.donutCharts}>
                        <DonutChart
                            className={styles.donutChart1}
                            data={alertFreq}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                            colorScheme={basicColor}
                        />
                        <DonutChart
                            colorScheme={basicColor}
                            className={styles.donutChart2}
                            data={alertFreq}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                        />
                    </div>
                    */}
                    <PieChart
                        className={styles.pieChart}
                        data={alertFreq}
                        labelSelector={pieChartLabelSelector}
                        colorScheme={basicColor}
                        valueSelector={pieChartValueSelector}
                    />
                    {/*
                    <SimpleVerticalBarChart
                        className={styles.barChart}
                        data={barChartData}
                        labelSelector={barChartLabelSelector}
                        valueSelector={barChartValueSelector}
                    />
                    */}
                    <Histogram
                        data={alertTimeStamps}
                    />
                </div>
            </div>
        );
    }

    render() {
        const Alerts = this.renderAlerts;
        const KeyStatistics = this.renderKeyStatistics;
        const { alertList } = this.props;

        const {
            showFilters,
            showAlerts,
        } = this.state;

        return (
            <React.Fragment>
                <Map
                    alertList={alertList}
                    className={styles.map}
                />
                <Page
                    className={styles.dashboard}
                    leftContentClassName={styles.left}
                    leftContent={
                        <CollapsibleView
                            expanded={showAlerts}
                            collapsedViewContainerClassName={styles.showAlertsButtonContainer}
                            collapsedView={
                                <Button
                                    className={styles.showAlertsButton}
                                    onClick={this.handleShowAlertsButtonClick}
                                    iconName={iconNames.alert}
                                    title="Show alerts"
                                />
                            }
                            expandedViewContainerClassName={styles.alertsContainer}
                            expandedView={
                                <React.Fragment>
                                    <Alerts
                                        className={styles.alerts}
                                        data={alertList}
                                    />
                                    <KeyStatistics
                                        className={styles.keyStatistics}
                                    />
                                </React.Fragment>
                            }
                        />
                    }
                    rightContentClassName={styles.right}
                    rightContent={
                        <CollapsibleView
                            expanded={showFilters}
                            collapsedViewContainerClassName={styles.showFilterButtonContainer}
                            collapsedView={
                                <Button
                                    onClick={this.handleShowFiltersButtonClick}
                                    iconName={iconNames.filter}
                                    title="Show filters"
                                />
                            }
                            expandedViewContainerClassName={styles.filtersContainer}
                            expandedView={
                                <React.Fragment>
                                    <header className={styles.header}>
                                        <h4 className={styles.heading}>
                                            Filters
                                        </h4>
                                        <Button
                                            onClick={this.handleHideFiltersButtonClick}
                                            iconName={iconNames.chevronUp}
                                            title="Hide Filters"
                                            transparent
                                        />
                                    </header>
                                    <DashboardFilter />
                                </React.Fragment>
                            }
                        />
                    }
                />
            </React.Fragment>
        );
    }
}
