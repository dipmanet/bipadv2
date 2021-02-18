import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import Button from '#rsca/Button';
import {
    saveChart,
} from '#utils/common';
import { ArchiveRain, ChartData, FaramValues } from '../types';
// import { renderLegendName } from '../utils';
import NoData from '../NoData';
import CustomTooltip from './Tooltip';
import Note from './Note';
import styles from './styles.scss';

interface Props {
    stationData: ArchiveRain[];
    filterWiseChartData?: ChartData[];
    intervalCode?: string;
    periodCode?: string;
    downloadId?: string;
    chartTitle?: string;
    isInitial?: boolean;
    stationName: string;
    filterValues: FaramValues;
}

const DEFAULT_CHART_TITLE = 'Accumulated Rainfall (mm)';
const DEFAULT_DOWNLOAD_ID = 'rainPopUpChart';

const handleSaveClick = (downloadId?: string) => {
    saveChart(downloadId || DEFAULT_DOWNLOAD_ID, downloadId || DEFAULT_DOWNLOAD_ID);
};

// const shouldDisplayNote = (periodCode: string) => {
//     const status: {[key: string]: boolean} = {
//         hourly: false,
//         daily: true,
//         weekly: true,
//         monthly: true,
//     };
//     return status[periodCode];
// };

const getinterval = (intervalCode: string) => {
    const intervals: {[key: string]: string} = {
        oneHour: '1 HR',
        threeHour: '3 HR',
        sixHour: '6 HR',
        twelveHour: '12 HR',
        twentyFourHour: '24 HR',
    };
    return intervals[intervalCode];
};

const getPeriod = (periodCode: string) => {
    const periods: {[key: string]: string} = {
        minute: 'Minute wise',
        hourly: 'Hourly average',
        daily: 'Daily average',
    };
    return periods[periodCode];
};

const getChartTitle = (
    intervalCode: string,
    periodCode: string,
    stationName: string,
    date: string,
) => {
    const interval = getinterval(intervalCode);
    const period = getPeriod(periodCode);
    return `${period} ${interval} readings, ${stationName}, ${date}`;
};

const Graph = (props: Props) => {
    const {
        stationData,
        filterWiseChartData,
        intervalCode,
        periodCode,
        chartTitle,
        downloadId,
        isInitial,
        stationName,
        filterValues: { dataDateRange: { startDate, endDate } },
    } = props;
    // const displayNote = shouldDisplayNote(periodCode || '');
    const date = `${startDate} to ${endDate}`;
    const calculatedTitle = getChartTitle(
        intervalCode || '',
        periodCode || '',
        stationName,
        date,
    );
    if (stationData.length === 0) {
        return (
            <NoData
                title="Graph View"
                message={isInitial ? 'Please select filter to view data' : undefined}
            />
        );
    }
    const isMinuteSelected = periodCode === 'minute';
    return (
        <div className={styles.visualizations}>
            <div
                className={styles.periodIntervalChart}
            >
                <header className={styles.header}>
                    {/* {displayNote && <Note />} */}
                    <Note />
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
                <div className={styles.chartWrapper} id={downloadId || DEFAULT_DOWNLOAD_ID}>
                    <h4 className={styles.heading}>
                        {chartTitle || calculatedTitle || DEFAULT_CHART_TITLE}
                    </h4>
                    <div
                        className={styles.chart}
                    >
                        <ResponsiveContainer className={styles.container}>
                            <LineChart
                                data={filterWiseChartData}
                                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis domain={['dataMin', 'auto']} />
                                <Tooltip
                                    content={(
                                        <CustomTooltip
                                            periodCode={periodCode}
                                            intervalCode={intervalCode}
                                        />
                                    )}
                                />
                                <Legend />
                                {isMinuteSelected
                                && <Line type="monotone" dot={false} name="Rainfall amount" dataKey={`${intervalCode}Avg`} stroke="green" />}
                                {!isMinuteSelected
                                && <Line type="monotone" dot={false} name="Min Water Level" dataKey={`${intervalCode}Min`} stroke="blue" />}
                                {!isMinuteSelected
                                && <Line type="monotone" dot={false} name="Max Water Level" dataKey={`${intervalCode}Max`} stroke="red" />}
                                {!isMinuteSelected
                                && <Line type="monotone" dot={false} name="Average Water Level" dataKey={`${intervalCode}Avg`} stroke="green" />}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Graph;
