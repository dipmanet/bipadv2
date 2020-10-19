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
import {
    saveChart,
} from '#utils/common';
import Message from '#rscv/Message';
import Button from '#rsca/Button';

import ArchiveLegend from '../ArchiveLegend';
import CustomTooltip from './Tooltip';
// constants
import { stackedBars, legendData } from '../constants';

import styles from './styles.scss';

interface ChartData {
    label: string | number;
    value: number;
    mag4: number;
    mag5: number;
    mag6: number;
    mag7: number;
    mag8: number;
}

interface LegendData {
    id: number;
    label: string;
    fill: string;
}

interface Props {
    federalWiseData: ChartData[];
    downloadId: string;
    chartTitle?: string;
    legendData?: LegendData[];
}

const handleSaveClick = (downloadId: string) => {
    saveChart(downloadId || 'chartIdBipad', downloadId || 'chartIdBipad');
};

const DEFAULT_CHART_TITLE = 'Occurence Statictics';

const removeZero = (federalWiseData: ChartData[]) => {
    const cleanData = federalWiseData.map((data) => {
        const keys = ['mag4', 'mag5', 'mag6', 'mag7', 'mag8'];
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

const RegionChart = (props: Props) => {
    const {
        federalWiseData,
        chartTitle,
        legendData: legendDataFromProps,
        downloadId,
    } = props;
    const cleanData = removeZero(federalWiseData);
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
                    <ArchiveLegend legendData={legendDataFromProps || legendData} />
                </div>
            </div>
        </div>
    );
};

export default RegionChart;
