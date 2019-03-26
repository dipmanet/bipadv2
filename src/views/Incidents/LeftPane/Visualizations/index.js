import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { schemeAccent } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale';

import {
    _cs,
    mapToList,
} from '@togglecorp/fujs';

import SimpleHorizontalBarChart from '#rscz/SimpleHorizontalBarChart';
import DonutChart from '#rscz/DonutChart';
import Legend from '#rscz/Legend';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    incidentList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    incidentList: [],
};

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;
const donutChartValueSelector = d => d.value;
const donutChartLabelSelector = d => d.label;
const donutChartColorSelector = d => d.color;

const colors = scaleOrdinal().range(schemeAccent);

const itemSelector = d => d.label;
const legendColorSelector = d => d.color;
const legendLabelSelector = d => d.label;

export default class Visualizations extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    getSummaryForLabel = memoize((incidentList, labelName, labelModifier = k => k) => {
        // FIXME: use groupList
        const summary = incidentList
            .filter(v => v[labelName])
            .reduce((acc, current) => {
                if (acc[current[labelName]] === undefined) {
                    acc[current[labelName]] = 0;
                } else {
                    acc[current[labelName]] += 1;
                }
                return acc;
            }, {});

        return mapToList(
            summary,
            (d, k) => ({
                label: labelModifier(k),
                value: d,
                color: colors(labelModifier(k)),
            }),
        );
    });

    getSeveritySummary = memoize((incidentList) => {
        // FIXME: use groupList
        const severity = incidentList
            .filter(v => v.severity)
            .reduce((acc, current) => {
                if (acc[current.severity] === undefined) {
                    acc[current.severity] = 0;
                } else {
                    acc[current.severity] += 1;
                }
                return acc;
            }, {});

        return mapToList(
            severity,
            (d, k) => ({
                label: k,
                value: d,
                color: colors(k),
            }),
        );
    });

    getEventSummary = memoize((incidentList) => {
        // FIXME: use groupList
        const hazardCount = incidentList
            .filter(v => v.event)
            .reduce((acc, current) => {
                if (acc[current.event.title] === undefined) {
                    acc[current.event.title] = 0;
                } else {
                    acc[current.event.title] += 1;
                }
                return acc;
            }, {});

        return mapToList(
            hazardCount,
            (d, k) => ({
                label: k,
                value: d,
            }),
        );
    });

    render() {
        const {
            className,
            incidentList,
            hazardTypes,
        } = this.props;

        const severitySummary = this.getSummaryForLabel(incidentList, 'severity');
        const inducerSummary = this.getSummaryForLabel(incidentList, 'inducer');
        const hazardSummary = this.getSummaryForLabel(incidentList, 'hazard', k => hazardTypes[k].title);
        const eventSummary = this.getEventSummary(incidentList);

        return (
            <div className={styles.visualizations}>
                <div className={styles.hazardStatisticsChart}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Hazard Statistics
                        </h4>
                    </header>
                    <SimpleHorizontalBarChart
                        className={styles.chart}
                        data={hazardSummary}
                        labelSelector={barChartLabelSelector}
                        valueSelector={barChartValueSelector}
                    />
                </div>
                <div className={styles.eventStatisticsChart}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Event Statistics
                        </h4>
                    </header>
                    <SimpleHorizontalBarChart
                        className={styles.chart}
                        data={eventSummary}
                        labelSelector={barChartLabelSelector}
                        valueSelector={barChartValueSelector}
                    />
                </div>
                <div className={styles.severitySummary}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Severity
                        </h4>
                    </header>
                    <DonutChart
                        sideLengthRatio={0.5}
                        className={styles.chart}
                        data={severitySummary}
                        labelSelector={donutChartLabelSelector}
                        valueSelector={donutChartValueSelector}
                        colorSelector={donutChartColorSelector}
                    />
                    <Legend
                        className={styles.legend}
                        data={severitySummary}
                        itemClassName={styles.legendItem}
                        keySelector={itemSelector}
                        labelSelector={legendLabelSelector}
                        colorSelector={legendColorSelector}
                    />
                </div>
                <div className={styles.inducerSummary}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Inducers
                        </h4>
                    </header>
                    <DonutChart
                        sideLengthRatio={0.5}
                        className={styles.chart}
                        data={inducerSummary}
                        labelSelector={donutChartLabelSelector}
                        valueSelector={donutChartValueSelector}
                        colorSelector={donutChartColorSelector}
                    />
                    <Legend
                        className={styles.legend}
                        data={inducerSummary}
                        itemClassName={styles.legendItem}
                        keySelector={itemSelector}
                        labelSelector={legendLabelSelector}
                        colorSelector={legendColorSelector}
                    />
                </div>
            </div>
        );
    }
}
