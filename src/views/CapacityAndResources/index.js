import React from 'react';

import DonutChart from '#rscz/DonutChart';
import PieChart from '#rscz/PieChart';
import SimpleHorizontalBarChart from '#rscz/SimpleHorizontalBarChart';
import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';

import ListSelection from '#components/ListSelection';
import MultiListSelection from '#components/MultiListSelection';
import Page from '#components/Page';
import RegionSelectInput from '#components/RegionSelectInput';
import { basicColor } from '#constants/colorScheme';
import {
    barChartData,
    pieChartData,
    donutChartData1,
    donutChartData2,
    hazardTypeList,
    resourceTypeList,
} from '#resources/data';

import styles from './styles.scss';

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;

const pieChartValueSelector = d => d.value;
const pieChartLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;

const KeyStatistics = ({ className }) => (
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
                    labelSelector={donutChartLabelSelector}
                    valueSelector={donutChartValueSelector}
                    colorScheme={basicColor}
                    sideLengthRatio={0.3}
                />
                <DonutChart
                    className={styles.donutChart2}
                    data={donutChartData2}
                    labelSelector={donutChartLabelSelector}
                    colorScheme={basicColor}
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

const CapacityAndResources = () => (
    <Page
        className={styles.capacityAndResources}
        leftContentClassName={styles.left}
        leftContent={
            <KeyStatistics
                className={styles.keyStatistics}
            />
        }
        mainContentClassName={styles.main}
        mainContent={null}
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
                        className={styles.hazardTypeSelection}
                        label="Hazard type"
                        options={hazardTypeList}
                        value="earthquake"
                    />
                </div>
            </React.Fragment>
        }
    />
);

export default CapacityAndResources;
