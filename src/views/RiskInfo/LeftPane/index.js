import React from 'react';

import SimpleVerticalBarChart from '#rscz/SimpleVerticalBarChart';
import SimpleHorizontalBarChart from '#rscz/SimpleHorizontalBarChart';

import PieChart from '#rscz/PieChart';
import DonutChart from '#rscz/DonutChart';

import { basicColor } from '#constants/colorScheme';

import {
    barChartData,
    pieChartData,
    donutChartData1,
    donutChartData2,
} from '#resources/data';

import _cs from '#cs';
import styles from './styles.scss';

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;

const pieChartValueSelector = d => d.value;
const pieChartLabelSelector = d => d.label;

const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;

export default class RiskInfo extends React.PureComponent {
    render() {
        const {
            className,
        } = this.props;

        return (
            <div className={_cs(className, styles.leftPane)}>
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
}
