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
    Cell,
    Tooltip,
    Legend,
} from 'recharts';

import {
    groupList,
    saveChart,
} from '#utils/common';
import Button from '#rsca/Button';
import Message from '#rscv/Message';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    alertList: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    className: undefined,
    alertList: [],
};

const CustomLabel = (props) => {
    const { value } = props;

    return (
        <div>
            {`Value: ${value}`}
        </div>
    );
};

export default class Visualization extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    handleSaveClick = () => {
        saveChart('hazardSummary', 'hazardSummary');
        // saveChart('hazardSeverity', 'hazardSeverity');
    }

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

        if (!hazardSummary || hazardSummary.length === 0) {
            return (
                <div
                    className={styles.message}
                >
                    <Message>
                            No Alerts in the Selected Time Period
                    </Message>
                </div>
            );
        }

        // To reduce space taken by pollution on Y-axis
        hazardSummary.map((hs) => {
            if (hs.label === 'Environmental pollution') {
                // eslint-disable-next-line no-param-reassign
                hs.label = 'Env. Pollution';
            }
            return hs;
        });

        const ChartView = () => (
            <div
                className={styles.hazardStatisticsChart}
            >
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Hazard Occurence Statistics
                    </h4>
                    <Button
                        title="Download Chart"
                        className={styles.chartDownload}
                        transparent
                        onClick={this.handleSaveClick}
                        iconName="download"
                    />
                </header>
                <div
                    className={styles.chart}
                    id="hazardSummary"
                >
                    <ResponsiveContainer>
                        <BarChart
                            layout="vertical"
                            data={hazardSummary}
                            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                        >
                            <YAxis dataKey="label" type="category" />
                            <XAxis
                                dataKey="value"
                                type="number"
                            />
                            <Tooltip cursor={false} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                align="center"
                                iconSize={0}
                                formatter={() => '  No. of Events  '}
                            />
                            <Bar
                                dataKey="value"
                            >
                                {hazardSummary.map(hazard => (
                                    <Cell
                                        key={hazard.label}
                                        fill={hazard.color}
                                    />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="right"
                                    angle={0}
                                    className={styles.labelList}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );

        return (
            <div className={styles.visualizations}>
                <div className={styles.alertSummary}>
                    <header className={styles.header}>
                        <h3 className={styles.heading}>
                            Number of Alerts
                        </h3>
                    </header>
                    <div className={styles.content}>
                        {hazardSummary.map(s => (
                            <div key={s.label} className={styles.summaryItem}>
                                <div className={styles.label}>
                                    {s.label}
                                </div>
                                <div className={styles.value}>
                                    {s.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <ChartView />

                {/* <div
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
                </div> */}

            </div>
        );
    }
}
