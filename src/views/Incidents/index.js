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

import Navbar from '#components/Navbar';
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
                        />
                        <DonutChart
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
        const KeyStatistics = this.renderKeyStatistics;

        return (
            <div className={styles.dashboard}>
                <Navbar />
                <aside className={styles.aside}>
                    <div className={styles.container}>
                        <Incidents
                            className={styles.incidents}
                            data={incidentList}
                        />
                    </div>
                </aside>
                <aside className={styles.filterContainer}>
                    <div className={styles.container}>
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
                    </div>
                </aside>

                <Map className={styles.map} />
            </div>
        );
    }
}
