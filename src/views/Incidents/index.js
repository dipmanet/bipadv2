import React from 'react';
import Map from '#components/ProjectsMap';

import {
    barChartData,
    pieChartData,
    donutChartData1,
    donutChartData2,
    incidentList,
    hazardTypeList,
} from '#resources/data';

import Page from '#components/Page';
import RegionSelectInput from '#components/RegionSelectInput';
import ListView from '#rscv/List/ListView';
import { iconNames } from '#constants';

import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import MultiListSelection from '#components/MultiListSelection';
import PieChart from '#rscz/PieChart';
import DonutChart from '#rscz/DonutChart';
import { basicColor } from '#constants/colorScheme';

import _cs from '#cs';
import styles from './styles.scss';

const emptyObject = {};
const incidentKeySelector = d => d.id;

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;

const pieChartValueSelector = d => d.value;
const pieChartLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;

export default class Dashboard extends React.PureComponent {
    getIncidentRendererParams = (_, d) => ({
        data: d,
        className: styles.incident,
    });

    renderIncident = ({
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

    renderIncidents = ({
        className,
        data,
    }) => {
        console.warn('rendering incidents');

        return (
            <div className={className}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Incidents
                    </h4>
                </header>
                <ListView
                    className={styles.incidentList}
                    data={data}
                    renderer={this.renderIncident}
                    rendererParams={this.getIncidentRendererParams}
                    keySelector={incidentKeySelector}
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
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                            colorScheme={basicColor}
                        />
                        <DonutChart
                            className={styles.donutChart2}
                            data={donutChartData2}
                            colorScheme={basicColor}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                        />
                    </div>
                    <PieChart
                        className={styles.pieChart}
                        colorScheme={basicColor}
                        data={pieChartData}
                        labelSelector={pieChartLabelSelector}
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
        const Incidents = this.renderIncidents;

        return (
            <Page
                className={styles.incidents}
                leftContentClassName={styles.left}
                leftContent={
                    <Incidents
                        className={styles.incidents}
                        data={incidentList}
                    />
                }
                mainContentClassName={styles.main}
                mainContent={
                    <Map
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
                            <MultiListSelection
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
