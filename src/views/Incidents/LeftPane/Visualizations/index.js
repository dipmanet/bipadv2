import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { schemeAccent } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale';
import { groupList } from '#utils/common';

import HorizontalBar from '#rscz/HorizontalBar';
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
const barChartColorSelector = d => d.color;
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

    getHazardSummary = memoize((incidentList) => {
        const { hazardTypes } = this.props;

        const freqCount = groupList(
            incidentList.filter(i => i.hazard),
            incident => incident.hazard,
        );

        return freqCount.map(h => (
            {
                label: (hazardTypes[h.key] || {}).title,
                value: h.value.length,
                color: (hazardTypes[h.key] || {}).color,
            }
        )).sort((a, b) => (a.value - b.value));
    })

    getSeveritySummary = memoize((incidentList) => {
        const freqCount = groupList(
            incidentList.filter(i => i.severity),
            incident => incident.severity,
        );

        return freqCount.map(s => (
            {
                label: s.key,
                value: s.value.length,
                color: colors(s.key),
            }
        ));
    });

    /* getEventSummary = memoize((incidentList) => {
     *     const freqCount = groupList(
     *         incidentList.filter(i => i.event),
     *         incident => incident.event.title,
     *     );

     *     return freqCount.map(event => ({ label: event.key, value: event.value.length }));
     * }); */

    render() {
        const {
            className,
            incidentList,
            hazardTypes,
        } = this.props;

        const severitySummary = this.getSeveritySummary(incidentList);
        const hazardSummary = this.getHazardSummary(incidentList);
        // const eventSummary = this.getEventSummary(incidentList);

        return (
            <div className={styles.visualizations}>
                <div className={styles.hazardStatisticsChart}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Hazard Occurence Statistics
                        </h4>
                    </header>
                    <HorizontalBar
                        className={styles.chart}
                        data={hazardSummary}
                        labelSelector={barChartLabelSelector}
                        valueSelector={barChartValueSelector}
                        colorSelector={barChartColorSelector}
                    />
                </div>
                {/* <div className={styles.eventStatisticsChart}>
                    <header className={styles.header}>
                    <h4 className={styles.heading}>
                    Major Event Statistics
                    </h4>
                    </header>
                    <SimpleHorizontalBarChart
                    className={styles.chart}
                    data={eventSummary}
                    labelSelector={barChartLabelSelector}
                    valueSelector={barChartValueSelector}
                    />
                    </div> */}
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
                        valueSelector={donutChartValueSelector}
                        colorSelector={legendColorSelector}
                    />
                </div>
            </div>
        );
    }
}
