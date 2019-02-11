import React from 'react';
import Map from '#components/ProjectsMap';

import {
    barChartData,
    pieChartData,
    donutChartData1,
    donutChartData2,
    hazardTypeList,
    resourceTypeList,
} from '#resources/data';

import Page from '#components/Page';
import RegionSelectInput from '#components/RegionSelectInput';

import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import SimpleHorizontalBarChart from '#rscz/SimpleHorizontalBarChart';
import Label from '#rsci/Label';
import RadioInput from '#rsci/RadioInput';
import ListSelection from '#components/ListSelection';
import MultiListSelection from '#components/MultiListSelection';
import PieChart from '#rscz/PieChart';
import DonutChart from '#rscz/DonutChart';
import { basicColor } from '#constants/colorScheme';

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

export default class RiskInfo extends React.PureComponent {
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
                    <SimpleVerticalBarChart
                        className={styles.barChart}
                        data={barChartData}
                        labelSelector={barChartLabelSelector}
                        valueSelector={barChartValueSelector}
                    />
                    <div className={styles.donutCharts}>
                        <DonutChart
                            className={styles.donutChart1}
                            data={donutChartData1}
                            colorScheme={basicColor}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                        />
                        <DonutChart
                            className={styles.donutChart2}
                            colorScheme={basicColor}
                            data={donutChartData2}
                            labelSelector={donutChartLabelSelector}
                            valueSelector={donutChartValueSelector}
                            sideLengthRatio={0.3}
                        />
                    </div>
                    <SimpleHorizontalBarChart
                        className={styles.horizontalBarChart}
                        data={barChartData}
                        labelSelector={barChartLabelSelector}
                        valueSelector={barChartValueSelector}
                    />
                    <PieChart
                        className={styles.pieChart}
                        data={pieChartData}
                        labelSelector={pieChartLabelSelector}
                        colorScheme={basicColor}
                        valueSelector={pieChartValueSelector}
                    />
                </div>
            </div>
        );
    }

    render() {
        const KeyStatistics = this.renderKeyStatistics;

        return (
            <Page
                className={styles.riskInfo}
                leftContentClassName={styles.left}
                leftContent={
                    <KeyStatistics
                        className={styles.keyStatistics}
                    />
                }
                mainContentClassName={styles.main}
                mainContent={
                    <Map
                        className={styles.map}
                        showColors
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
                                className={styles.resourceTypeSelection}
                                label="Resources"
                                options={resourceTypeList}
                                value={['health', 'education']}
                            />
                            <ListSelection
                                label="Hazard type"
                                className={styles.hazardTypeSelection}
                                name="Hazard type"
                                options={hazardTypeList}
                                value="earthquake"
                            />
                        </div>
                    </React.Fragment>
                }
            />
        );
    }
}
