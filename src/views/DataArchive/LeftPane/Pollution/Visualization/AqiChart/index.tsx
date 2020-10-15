import React from 'react';
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList,
    // Tooltip,
} from 'recharts';

import { saveChart } from '#utils/common';
import Button from '#rsca/Button';
import stackedBars from './constants';

import styles from './styles.scss';

interface ChartData {
    key: string | number;
    label: string | number;
    good: number;
    moderate: number;
    unhealthyForSensitive: number;
    unhealthy: number;
    veryUnhealthy: number;
    hazardous: number;
}

interface Props {
    chartTitle?: string;
    downloadId: string;
    stationWiseData: ChartData[];
}

const DEFAULT_CHART_TITLE = 'Occurence Statictics';

const handleSaveClick = (downloadId: string) => {
    saveChart(downloadId || 'chartIdBipad', downloadId || 'chartIdBipad');
};

const removeZero = (staionWiseData: ChartData[]) => {
    const cleanData = staionWiseData.map((data) => {
        const keys = [
            'good',
            'moderate',
            'unhealthyForSensitive',
            'unhealthy',
            'veryUnhealthy',
            'hazardous',
        ];
        keys.forEach((key) => {
            if (data[key] === 0) {
                // eslint-disable-next-line no-param-reassign
                delete data[key];
            }
        });
        return { ...data };
    });
    return cleanData;
};

const AqiChart = (props: Props) => {
    const { chartTitle, downloadId, stationWiseData } = props;
    const cleanData = removeZero(stationWiseData);
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
                        onClick={() => handleSaveClick(downloadId)}
                        iconName="download"
                    />
                </header>
                <div
                    className={styles.chart}
                    id={downloadId}
                    style={{
                        height: `${cleanData.length * 50}px`,
                        minHeight: '320px',
                    }}
                >
                    <ResponsiveContainer className={styles.container}>
                        <BarChart
                            layout="vertical"
                            data={cleanData}
                            margin={{ top: 20, right: 10, left: 40, bottom: 5 }}
                        >
                            <YAxis dataKey="label" type="category" />
                            <XAxis
                                dataKey="value"
                                type="number"
                                allowDecimals={false}
                                label={{
                                    value: 'No. of events', position: 'insideBottom', dy: 10,
                                }}
                            />
                            {/* <Tooltip cursor={false} /> */}
                            { stackedBars.map((bar) => {
                                const { dataKey, stackId, fill } = bar;
                                return (
                                    <Bar
                                        key={dataKey}
                                        isAnimationActive={false}
                                        dataKey={dataKey}
                                        stackId={stackId}
                                        fill={fill}
                                    >
                                        <LabelList
                                            dataKey={dataKey}
                                            position="center"
                                            angle={0}
                                            className={styles.labelList}
                                        />
                                    </Bar>
                                );
                            }) }
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AqiChart;
