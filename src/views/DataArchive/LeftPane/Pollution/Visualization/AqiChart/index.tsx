import React from 'react';
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList,
    Tooltip,
} from 'recharts';

import { saveChart } from '#utils/common';
import Button from '#rsca/Button';
import { stackedBars, legendData } from './constants';
import PollutionLegend from './Legend';
import CustomTooltip from './Tooltip';
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
    veryHazardous: number;
}

interface LegendData {
    id: number;
    label: string;
    fill: string;
}
interface Props {
    chartTitle?: string;
    downloadId: string;
    stationWiseData: ChartData[];
    legendData?: LegendData[];
}

const DEFAULT_CHART_TITLE = 'Occurence Statistics (Station Wise)';

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
            'veryHazardous',
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
    const {
        chartTitle,
        downloadId,
        stationWiseData,
        legendData: legendDataFromProps,
    } = props;
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
                        height: `${cleanData.length * 40}px`,
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
                                    value: 'No. of days', position: 'insideBottom', dy: 5,
                                }}
                            />
                            <Tooltip
                                cursor={false}
                                content={<CustomTooltip />}
                            />
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
                    <PollutionLegend legendData={legendDataFromProps || legendData} />
                </div>
            </div>
        </div>
    );
};

export default AqiChart;
