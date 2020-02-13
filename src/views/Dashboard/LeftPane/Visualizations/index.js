import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList,
} from 'recharts';

import { groupList } from '#utils/common';

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
        )).sort((a, b) => (b.value - a.value));
    });

    render() {
        const {
            className,
            alertList,
            hazardTypes,
        } = this.props;

        const hazardSummary = this.getHazardSummary(alertList);
        const eventSummary = this.getEventSummary(alertList);

        console.warn(alertList, hazardSummary, eventSummary);

        return (
            <div className={styles.visualizations}>
                <div className={styles.alertSummary}>
                    <header className={styles.header}>
                        <h2 className={styles.heading}>
                            Alerts summary
                        </h2>
                    </header>
                    <div className={styles.content}>
                        { hazardSummary.map(s => (
                            <div>
                                <div>
                                    { s.label }
                                </div>
                                <div>
                                    { s.value }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    style={{
                        height: hazardSummary.length * 32,
                    }}
                    className={styles.container}
                >
                    <ResponsiveContainer className={styles.visualizationContainer}>
                        <BarChart
                            data={hazardSummary}
                            layout="vertical"
                        >
                            <XAxis
                                dataKey="value"
                                type="number"
                                hide
                            />
                            <Bar
                                fill="#e04656"
                                dataKey="value"
                                layout="vertical"
                            >
                                <LabelList
                                    dataKey="label"
                                    position="insideLeft"
                                />
                            </Bar>
                            <YAxis
                                dataKey="label"
                                type="category"
                                hide
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
}
