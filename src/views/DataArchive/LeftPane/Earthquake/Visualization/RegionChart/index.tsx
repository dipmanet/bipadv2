import React from 'react';

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
    saveChart,
} from '#utils/common';
import Message from '#rscv/Message';
import Button from '#rsca/Button';

import styles from './styles.scss';

interface ChartData {
    label: string | number;
    value: number;
}

interface Props {
    federalWiseData?: ChartData[];
    barColor?: string;
    chartTitle?: string;
}

const handleSaveClick = () => {
    saveChart('earthquakeSummary', 'earthquakeSummary');
};

const DEFAULT_BAR_COLOR = '#E35163';
const DEFAULT_CHART_TITLE = 'Occurence Statictics';

const RegionChart = (props: Props) => {
    const { federalWiseData, barColor, chartTitle } = props;
    console.log(federalWiseData);
    if (!federalWiseData || federalWiseData.length === 0) {
        return (
            <div
                className={styles.message}
            >
                <Message>
                        Nothing to display
                </Message>
            </div>
        );
    }

    return (
        <div className={styles.visualizations}>
            <div
                className={styles.hazardStatisticsChart}
            >
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        {chartTitle || DEFAULT_CHART_TITLE}
                    </h4>
                    <Button
                        title="Download Chart"
                        className={styles.chartDownload}
                        transparent
                        onClick={handleSaveClick}
                        iconName="download"
                    />
                </header>
                <div
                    className={styles.chart}
                    id="earthquakeSummary"
                >
                    <ResponsiveContainer className={styles.container}>
                        <BarChart
                            layout="vertical"
                            data={federalWiseData}
                            margin={{ top: 20, right: 10, left: 40, bottom: 5 }}
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
                                {federalWiseData.map(datum => (
                                    <Cell
                                        key={datum.label}
                                        fill={barColor || DEFAULT_BAR_COLOR}
                                    />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    position="center"
                                    angle={0}
                                    className={styles.labelList}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RegionChart;
