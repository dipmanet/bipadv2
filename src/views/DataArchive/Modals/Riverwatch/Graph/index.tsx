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
    ReferenceLine,
    Label,
} from 'recharts';
import Button from '#rsca/Button';
import {
    saveChart,
} from '#utils/common';
import { ArchiveRiver, ChartData, FaramValues } from '../types';
// import { arraySorter } from '../utils';
import NoData from '../NoData';
import CustomTooltip from './Tooltip';
import Note from './Note';
import styles from './styles.scss';

interface Props {
    stationData: ArchiveRiver[];
    filterWiseChartData?: ChartData[];
    periodCode?: string;
    downloadId?: string;
    chartTitle?: string;
    isInitial?: boolean;
    stationName: string;
    filterValues: FaramValues;
}

const DEFAULT_CHART_TITLE = 'Water Level (m)';
const DEFAULT_DOWNLOAD_ID = 'riverPopUpChart';

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

const getPeriod = (periodCode: string) => {
    const periods: {[key: string]: string} = {
        minute: 'Minute wise',
        hourly: 'Hourly average',
        daily: 'Daily average',
    };
    return periods[periodCode];
};

const getChartTitle = (
    periodCode: string,
    stationName: string,
    date: string,
) => {
    const period = getPeriod(periodCode);
    return `${period} readings, ${stationName}, ${date}`;
};

const Graph = (props: Props) => {
    const {
        stationData,
        filterWiseChartData,
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
    const { warningLevel, dangerLevel } = stationData[0];
    const isMinuteSelected = periodCode === 'minute';

    return (
        <div className={styles.visualizations}>
            <div
                className={styles.periodChart}
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
                                <YAxis domain={
                                    [0,
                                        dataMax => (dataMax
                                            > (dangerLevel || warningLevel || 0)
                                            ? dataMax : dangerLevel || warningLevel),
                                    ]}
                                />
                                <Tooltip
                                    content={<CustomTooltip periodCode={periodCode} />}
                                />
                                <Legend />
                                {isMinuteSelected
                                && <Line type="monotone" dot={false} name="Water Level" dataKey="waterLevelAvg" stroke="green" />}
                                {!isMinuteSelected
                                && <Line type="monotone" dot={false} name="Min Water Level" dataKey="waterLevelMin" stroke="blue" />}
                                {!isMinuteSelected
                                && <Line type="monotone" dot={false} name="Max Water Level" dataKey="waterLevelMax" stroke="red" />}
                                {!isMinuteSelected
                                && <Line type="monotone" dot={false} name="Average Water Level" dataKey="waterLevelAvg" stroke="green" />}
                                <ReferenceLine
                                    y={warningLevel}
                                    stroke="yellow"
                                    strokeWidth={2}
                                    isFront
                                    strokeDasharray="3 2"
                                >
                                    <Label value="Warning Level" position="insideTopLeft" />
                                </ReferenceLine>
                                <ReferenceLine
                                    y={dangerLevel}
                                    stroke="red"
                                    strokeWidth={2}
                                    isFront
                                    strokeDasharray="3 2"
                                >
                                    <Label value="Danger Level" position="insideTopLeft" />
                                </ReferenceLine>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Graph;
