import React from 'react';
import Map from '#components/ProjectsMap';
import CollapsibleView from '#components/CollapsibleView';

import {
    alertList,
    barChartData,
    pieChartData,
    donutChartData1,
    donutChartData2,
    hazardTypeList,
} from '#resources/data';

import Page from '#components/Page';
import Faram from '#rscg/Faram';
import Button from '#rsca/Button';
import RegionSelectInput from '#components/RegionSelectInput';
import MultiListSelection from '#components/MultiListSelection';
import PastDateRangeInput from '#components/PastDateRangeInput';
import ListView from '#rscv/List/ListView';
import { iconNames } from '#constants';
import { basicColor } from '#constants/colorScheme';

import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import PieChart from '#rscz/PieChart';
import DonutChart from '#rscz/DonutChart';

import _cs from '#cs';
import styles from './styles.scss';

const emptyObject = {};
const alertKeySelector = d => d.id;

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;

const pieChartValueSelector = d => d.value;
const pieChartLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;


const getFeatureCollectionFromPoints = (points) => {
    const geojson = {
        type: 'FeatureCollection',
        features: points.map(point => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [point.lng, point.lat],
            },
            properties: {
                title: point.title,
                description: point.description,
            },
        })),
    };

    return geojson;
};

const filterSchema = {
    fields: {
        dateRange: [],
        region: [],
        hazardType: [],
    },
};

export default class Dashboard extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showFilters: true,
            showAlerts: true,
            faramValue: {},
            faramErrors: {},
        };
    }

    getAlertRendererParams = (_, d) => ({
        data: d,
        className: styles.alert,
    });

    handleFaramChange = (faramValues, faramErrors) => {
        this.setState({
            faramValues,
            faramErrors,
        });
    }

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

    renderAlert = ({
        className,
        data: {
            title,
        } = emptyObject,
    }) => (
        <div className={className}>
            <div
                className={_cs(
                    iconNames.alert,
                    styles.icon,
                )}
            />
            <div className={styles.title}>
                { title }
            </div>
        </div>
    );

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

    renderKeyStatistics = ({ className }) => (
        <div className={className}>
            <header className={styles.header}>
                <h4 className={styles.heading}>
                    Key statistics
                </h4>
            </header>
            <div className={styles.content}>
                <div className={styles.donutCharts}>
                    <DonutChart
                        className={styles.donutChart1}
                        data={donutChartData1}
                        labelSelector={donutChartLabelSelector}
                        valueSelector={donutChartValueSelector}
                        sideLengthRatio={0.3}
                        colorScheme={basicColor}
                    />
                    <DonutChart
                        colorScheme={basicColor}
                        className={styles.donutChart2}
                        data={donutChartData2}
                        labelSelector={donutChartLabelSelector}
                        valueSelector={donutChartValueSelector}
                        sideLengthRatio={0.3}
                    />
                </div>
                <PieChart
                    className={styles.pieChart}
                    data={pieChartData}
                    labelSelector={pieChartLabelSelector}
                    colorScheme={basicColor}
                    valueSelector={pieChartValueSelector}
                />
                <SimpleVerticalBarChart
                    className={styles.barChart}
                    data={barChartData}
                    labelSelector={barChartLabelSelector}
                    valueSelector={barChartValueSelector}
                />
            </div>
        </div>
    )

    render() {
        const Alerts = this.renderAlerts;
        const KeyStatistics = this.renderKeyStatistics;
        const featureCollection = getFeatureCollectionFromPoints(alertList);

        const {
            faramValues,
            faramErrors,
            showFilters,
            showAlerts,
        } = this.state;

        return (
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
                mainContentClassName={styles.main}
                mainContent={
                    <Map
                        points={featureCollection}
                        className={styles.map}
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
                                <Faram
                                    className={styles.content}
                                    onChange={this.handleFaramChange}
                                    onValidationFailure={this.handleFaramValidationFailure}
                                    onValidationSuccess={this.handleFaramValidationSuccess}
                                    schema={this.schema}
                                    value={faramValues}
                                    error={faramErrors}
                                    disabled={false}
                                >
                                    <PastDateRangeInput
                                        label="Data range"
                                        faramElementName="dateRange"
                                        className={styles.pastDataSelectInput}
                                    />
                                    <RegionSelectInput
                                        faramElementName="region"
                                    />
                                    <MultiListSelection
                                        faramElementName="hazardType"
                                        className={styles.listSelectionInput}
                                        label="Hazard type"
                                        options={hazardTypeList}
                                    />
                                </Faram>
                            </React.Fragment>
                        }
                    />
                }
            />
        );
    }
}
