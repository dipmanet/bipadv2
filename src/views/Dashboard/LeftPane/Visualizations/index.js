import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { groupList } from '#utils/common';
import HorizontalBar from '#rscz/HorizontalBar';

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

const chartColorScheme = [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
];

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
        )).sort((a, b) => (a.value - b.value));
    })

    getEventSummary = memoize((alertList) => {
        const freqCount = groupList(
            alertList.filter(i => i.event),
            alert => alert.event.title,
        );

        return freqCount.map(event => (
            {
                label: event.key,
                value: event.value.length,
            }
        )).sort((a, b) => (a.value - b.value));
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
                    <HorizontalBar
                        className={styles.chart}
                        data={hazardSummary}
                        labelSelector={barChartLabelSelector}
                        valueSelector={barChartValueSelector}
                        colorScheme={chartColorScheme}
                    />
                </div>
                {eventSummary.length > 0 && (
                    <div className={styles.eventStatisticsChart}>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Major Event Statistics
                            </h4>
                        </header>
                        <HorizontalBar
                            className={styles.chart}
                            data={eventSummary}
                            labelSelector={barChartLabelSelector}
                            valueSelector={barChartValueSelector}
                        />
                    </div>
                )}
            </div>
        );
    }
}
