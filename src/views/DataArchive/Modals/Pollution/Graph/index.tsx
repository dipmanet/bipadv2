import React from 'react';
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    LabelList,
    Legend,
    Tooltip,
    CartesianGrid,
    ReferenceLine,
} from 'recharts';
import Button from '#rsca/Button';
import {
    saveChart,
} from '#utils/common';
import { ArchivePollution, ChartData } from '../types';
import { renderLegendName } from '../utils';
import NoData from '../NoData';
import CustomTooltip from './Tooltip';
import styles from './styles.scss';

interface Props {
    stationData: ArchivePollution[];
    filterWiseChartData?: ChartData[];
    parameterCode?: string;
    downloadId?: string;
    chartTitle?: string;
    isInitial?: boolean;
}

const DEFAULT_CHART_TITLE = 'Period Parameter Graph';
const DEFAULT_DOWNLOAD_ID = 'pollutionPopUpChart';

const handleSaveClick = (downloadId?: string) => {
    saveChart(downloadId || DEFAULT_DOWNLOAD_ID, downloadId || DEFAULT_DOWNLOAD_ID);
};

const Graph = (props: Props) => {
    const {
        stationData,
        filterWiseChartData,
        parameterCode,
        chartTitle,
        downloadId,
        isInitial,
    } = props;
    const code = parameterCode ? parameterCode.replace('.', '') : '';
    if (stationData.length === 0) {
        return (
            <NoData
                title="Graph View"
                message={isInitial ? 'Please select filter to view data' : undefined}
            />
        );
    }
    return (
        <div className={styles.visualizations}>
            <div
                className={styles.periodParameterChart}
            >
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        {chartTitle || DEFAULT_CHART_TITLE}
                    </h4>
                    <div
                        className={styles.downloadGroup}
                        title="Download Chart"
                        role="presentation"
                        onClick={() => handleSaveClick(downloadId)}
                    >
                        <h4>Download</h4>
                        <Button
                            className={styles.chartDownload}
                            transparent
                            iconName="download"
                        />
                    </div>

                </header>
                <div
                    className={styles.chart}
                    id={downloadId || DEFAULT_DOWNLOAD_ID}
                >
                    <ResponsiveContainer className={styles.container}>
                        <BarChart
                            data={filterWiseChartData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip
                                content={<CustomTooltip />}
                            />
                            <Legend />
                            <Bar name={renderLegendName(code)} dataKey={code} fill="#8884d8" />
                            {
                                code === 'aqi'
                                && (
                                    <ReferenceLine
                                        y={150}
                                        // label="Threshold"
                                        stroke="#89023E"
                                        strokeWidth={2}
                                        isFront
                                        strokeDasharray="3 2"
                                    />
                                )
                            }
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Graph;
