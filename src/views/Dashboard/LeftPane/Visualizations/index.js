import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { groupList } from '#utils/common';

import SimpleHorizontalBarChart from '#rscz/SimpleHorizontalBarChart';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    alertList: [],
};

const barChartValueSelector = d => d.value;
const barChartLabelSelector = d => d.label;

export default class Visualization extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getHazardSummary = memoize((alertList) => {
        const { hazardTypes } = this.props;

        const freqCount = groupList(
            alertList.filter(i => i.hazard),
            alert => alert.hazard,
        );

        return freqCount.map(h => (
            {
                label: (hazardTypes[h.key] || {}).title,
                value: h.value.length,
                color: (hazardTypes[h.key] || {}).color,
            }
        ));
    })

    getEventSummary = memoize((alertList) => {
        const freqCount = groupList(
            alertList.filter(i => i.event),
            alert => alert.event.title,
        );

        return freqCount.map(event => ({ label: event.key, value: event.value.length }));
    });

    render() {
        const {
            className,
            alertList,
            hazardTypes,
        } = this.props;

        const hazardSummary = this.getHazardSummary(alertList);
        const eventSummary = this.getEventSummary(alertList);

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
            </div>
        );
    }
}
