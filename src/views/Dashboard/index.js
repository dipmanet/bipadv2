import React from 'react';
import Map from '#components/ProjectsMap';

import {
    alertList,
    barChartData,
    pieChartData,
    donutChartData1,
    donutChartData2,
    hazardTypeList,
} from '#resources/data';

import Page from '#components/Page';
import RegionSelectInput from '#components/RegionSelectInput';
import ListView from '#rscv/List/ListView';
import { iconNames } from '#constants';

import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import ListSelection from '#rsci/ListSelection';
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
const colors = [
    '#fb8072',
    '#80b1d3',
    '#fdb462',
];

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

export default class Dashboard extends React.PureComponent {
    getAlertRendererParams = (_, d) => ({
        data: d,
        className: styles.alert,
    });

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
    }) => {
        console.warn('rendering alerts');

        return (
            <div className={className}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Alerts
                    </h4>
                </header>
                <ListView
                    className={styles.alertList}
                    data={data}
                    renderer={this.renderAlert}
                    rendererParams={this.getAlertRendererParams}
                    keySelector={alertKeySelector}
                />
            </div>
        );
    }

    renderKeyStatistics = ({ className }) => {
        console.warn('rendering key statistics');

        return (
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
                            colorScheme={colors}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                        />
                        <DonutChart
                            colorScheme={colors}
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
                        colorScheme={colors}
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
        );
    }

    render() {
        const Alerts = this.renderAlerts;
        const KeyStatistics = this.renderKeyStatistics;
        const featureCollection = getFeatureCollectionFromPoints(alertList);

        return (
            <Page
                className={styles.dashboard}
                leftContentClassName={styles.left}
                leftContent={
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
                mainContentClassName={styles.main}
                mainContent={
                    <Map
                        points={featureCollection}
                        className={styles.map}
                    />
                }
                rightContentClassName={styles.right}
                rightContent={
                    <React.Fragment>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Filters
                            </h4>
                        </header>
                        <div className={styles.content}>
                            <RegionSelectInput />
                            <ListSelection
                                className={styles.listSelectionInput}
                                label="Hazard type"
                                options={hazardTypeList}
                                value={['earthquake', 'wildfire']}
                            />
                        </div>
                    </React.Fragment>
                }
            />
        );
    }
}
