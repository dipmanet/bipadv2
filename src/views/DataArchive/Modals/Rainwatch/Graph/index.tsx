/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    ComposedChart,
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
import { getMonthName } from '#views/DataArchive/utils';

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
        monthly: 'Monthly average',
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
    const [cumulativeData, setCD] = useState([]);
    const [monthlyChartData, setCmd] = useState([]);

    useEffect(() => {
        if (filterWiseChartData && filterWiseChartData.length > 0) {
            let cumulative = 0;
            let cumulativeDaily = 0;
            const datawithCumulative = filterWiseChartData.map((item) => {
                cumulative += item.accHourly;
                cumulativeDaily += item.accDaily;
                return ({
                    ...item,
                    cumulativeHourData: cumulative,
                    cumulativeDailyData: cumulativeDaily,
                });
            });
            setCD(datawithCumulative);
            // props.handleTableData(datawithCumulative);
        }
    }, [filterWiseChartData]);


    useEffect(() => {
        if (cumulativeData && cumulativeData.length > 0) {
            const getAccRain = (yearMth: string) => cumulativeData
                .filter(item => `${item.key.split('-')[0]}-${item.key.split('-')[1]}` === yearMth)
                .reduce((a, b) => ({
                    accDaily: a.accDaily + b.accDaily,
                }));

            const uniquemonthArr = [...new Set(cumulativeData.map(item => `${item.key.split('-')[0]}-${item.key.split('-')[1]}`))];
            const monthlychartData = uniquemonthArr.map(yearMth => ({
                yearMth,
                accMonthly: getAccRain(yearMth).accDaily,
            }));
            let cumulativeMth = 0;
            const monthlyCumulativeCrtData = monthlychartData.map((item) => {
                cumulativeMth += item.accMonthly;
                return {
                    ...item,
                    cumulativeMonthlyData: cumulativeMth,
                };
            });
            setCmd(monthlyCumulativeCrtData);
            // props.handleTableData(monthlyCumulativeCrtData);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cumulativeData]);


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
    // const isMinuteSelected = periodCode === 'minute';
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
                            {
                                periodCode === 'monthly' && monthlyChartData.length > 0
                                    ? (
                                        <ComposedChart
                                            data={monthlyChartData}
                                            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                                        >
                                            <CartesianGrid stroke="#f5f5f5" />
                                            <XAxis dataKey="yearMth" interval={0} angle={-45} dy={15} height={70} />
                                            <YAxis />
                                            <Tooltip
                                                content={(
                                                    <CustomTooltip
                                                        periodCode={periodCode}
                                                        intervalCode={intervalCode}
                                                    />
                                                )}
                                            />

                                            <Legend />
                                            <Bar name="Accumulated Rain(mm)" dataKey="accMonthly" fill="#82ca9d" />
                                            <Line
                                                type="monotone"
                                                name="Cumulative Rain(mm)"
                                                dataKey="cumulativeMonthlyData"
                                                stroke="#ff7300"
                                                dot={false}
                                            />
                                        </ComposedChart>
                                    )

                                    : periodCode === 'hourly'
                                        ? (
                                            <ComposedChart
                                                data={cumulativeData}
                                                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                                            >
                                                <CartesianGrid stroke="#f5f5f5" />
                                                <XAxis dataKey="label" interval={0} angle={-45} dy={15} height={70} />
                                                <YAxis domain={['accHourly', 'auto']} />
                                                <Tooltip
                                                    content={(
                                                        <CustomTooltip
                                                            periodCode={periodCode}
                                                            intervalCode={intervalCode}
                                                        />
                                                    )}
                                                />

                                                <Legend />
                                                <Bar name="Accumulated Rain(mm)" dataKey="accHourly" fill="#82ca9d" />
                                                <Line
                                                    type="monotone"
                                                    name="Cumulative Rain(mm)"
                                                    dataKey="cumulativeHourData"
                                                    stroke="#ff7300"
                                                    dot={false}
                                                />
                                            </ComposedChart>
                                        )
                                        : (
                                            <ComposedChart
                                                data={cumulativeData}
                                                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                                            >
                                                <CartesianGrid stroke="#f5f5f5" />
                                                <XAxis dataKey="label" interval={0} angle={-45} dy={15} height={70} />
                                                <YAxis domain={['accDaily', 'auto']} />
                                                <Tooltip
                                                    content={(
                                                        <CustomTooltip
                                                            periodCode={periodCode}
                                                            intervalCode={intervalCode}
                                                        />
                                                    )}
                                                />

                                                <Legend />
                                                <Bar name="Accumulated Rain(mm)" dataKey="accDaily" fill="#82ca9d" />
                                                <Line
                                                    type="monotone"
                                                    name="Cumulative Rain(mm)"
                                                    dataKey="cumulativeDailyData"
                                                    stroke="#ff7300"
                                                    dot={false}
                                                />
                                            </ComposedChart>
                                        )
                            }


                        </ResponsiveContainer>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Graph;
