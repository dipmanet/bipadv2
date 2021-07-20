/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';

import {
    compareString,
    compareNumber,
} from '@togglecorp/fujs';
import { FaramValues, ChartData } from '../types';
import { getDate, getTimeWithIndictor, getDateWithRange } from '#views/DataArchive/utils';
import {
    convertNormalTableToCsv,
} from '#utils/table';
import Table from '#rscv/Table';
import DownloadButton from '#components/DownloadButton';
import Icon from '#rscg/Icon';

import NoData from '../NoData';
import styles from './styles.scss';

interface Props {
    filterWiseChartData?: ChartData[];
    filterValues: FaramValues;
    isInitial?: boolean;
    stationName: string;
}

const rainSelector = (rain: ChartData) => rain.measuredOn;

const defaultSort = {
    key: 'year',
    order: 'asc',
};

const getPeriodWiseDate = (dateTime: string, periodCode?: string) => {
    if (periodCode === 'minute') {
        return (dateTime) ? `${getDate(dateTime)} ${getTimeWithIndictor(dateTime)}` : undefined;
    }
    if (periodCode === 'hourly') {
        return (dateTime) ? getDateWithRange(dateTime) : undefined;
    }
    if (periodCode === 'daily') {
        return (dateTime) ? getDate(dateTime) : undefined;
    }
    if (periodCode === 'monthly') {
        return (dateTime) ? getDate(dateTime) : undefined;
    }
    return null;
};

const getPeriod = (periodCode: string) => {
    const periods: {[key: string]: string} = {
        hourly: 'Hourly',
        daily: 'Daily',
        monthly: 'Monthly',
    };
    return periods[periodCode];
};

const getinterval = (intervalCode: string) => {
    const intervals: {[key: string]: string} = {
        oneHour: '1HR',
        threeHour: '3HR',
        sixHour: '6HR',
        twelveHour: '12HR',
        twentyFourHour: '24HR',
    };
    return intervals[intervalCode];
};

const generateFileName = (
    intervalCode: string,
    periodCode: string,
    stationName: string,
) => {
    // const interval = getinterval(intervalCode);
    const period = getPeriod(periodCode);
    const name = `DataArchiveRain_${period}_Readings_${stationName}`;
    return name.replace(/ /g, '_');
};


const TableView = (props: Props) => {
    const {
        filterValues: {
            dataDateRange: { startDate, endDate },
            period: { periodCode },
            interval: { intervalCode },
        },
        filterWiseChartData: data = [],
        isInitial,
        stationName,
    } = props;

    const [cumulativeData, setCD] = useState([]);
    const [monthlyChartData, setCmd] = useState([]);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        if (data && data.length > 0) {
            let cumulative = 0;
            let cumulativeDaily = 0;
            const datawithCumulative = data.map((item) => {
                // eslint-disable-next-line no-restricted-globals
                if (!isNaN(item.accHourly)) { cumulative += item.accHourly; } else { cumulative += 0; }
                // eslint-disable-next-line no-restricted-globals
                if (!isNaN(item.accDaily)) { cumulativeDaily += item.accDaily; } else { cumulativeDaily += 0; }
                return ({
                    ...item,
                    cumulativeHourData: cumulative,
                    cumulativeDailyData: cumulativeDaily,
                });
            });
            setCmd([]);
            setCD(datawithCumulative);
            // props.handleTableData(datawithCumulative);
        }
    }, [data]);


    useEffect(() => {
        if (periodCode === 'monthly') {
            if (cumulativeData && cumulativeData.length > 0) {
                const getAccRain = (key: string) => {
                    const ourArray = cumulativeData
                        .filter(item => `${item.key.split('-')[0]}-${item.key.split('-')[1]}` === key)
                        .filter(daily => !isNaN(daily.accDaily));

                    if (ourArray.length > 0) {
                        return ourArray.reduce((a, b) => ({
                            accDaily: a.accDaily + b.accDaily,
                        }));
                    }
                    return [];
                };


                const uniquemonthArr = [...new Set(cumulativeData.map(item => `${item.key.split('-')[0]}-${item.key.split('-')[1]}`))];
                const monthlychartData = uniquemonthArr.map(key => ({
                    key,
                    accMonthly: getAccRain(key).accDaily,
                }));
                let cumulativeMth = 0;

                const monthlyCumulativeCrtData = monthlychartData.map((item) => {
                    // eslint-disable-next-line no-restricted-globals
                    if (!isNaN(item.accMonthly)) { cumulativeMth += item.accMonthly; } else { cumulativeMth += 0; }
                    return {
                        ...item,
                        cumulativeMonthlyData: cumulativeMth,
                    };
                });
                setCmd(monthlyCumulativeCrtData);
                // props.handleTableData(monthlyCumulativeCrtData);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cumulativeData]);
    // let mydata;
    useEffect(() => {
        console.log('monthly chart and period', monthlyChartData, periodCode);
        if (monthlyChartData.length > 0 && periodCode === 'monthly') {
            setTableData(monthlyChartData);
        } else {
            setTableData(cumulativeData);
        }
        // console.log('test:', mydata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthlyChartData]);

    const rainHourlyHeader = [
        {
            key: 'year',
            label: 'DATE',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.measuredOn, b.measuredOn),
            modifier: (row: ChartData) => {
                const { measuredOn } = row;

                return getPeriodWiseDate(measuredOn, periodCode);
            },
        },
        {
            key: 'key',
            label: 'ACCUMULATED RAINFALL(mm)',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.accHourly, b.accHourly),
            modifier: (row: ChartData) => {
                const min = row.accHourly;
                return (min === 0 || min > 0) ? `${min.toFixed(2)}` : undefined;
            },
        },
        {
            key: 'min',
            label: 'CUMULATIVE RAINFALL (mm)',
            order: 3,
            sortable: true,
            comparator: (a, b) => compareNumber(a.cumulativeHourData, b.cumulativeHourData),
            modifier: (row: ChartData) => {
                // setCumu(row.accHour);
                const min = row.cumulativeHourData;
                return (min === 0 || min > 0) ? `${min.toFixed(2)}` : undefined;
            },
        },
    ];
    const rainDailyHeader = [
        {
            key: 'year',
            label: 'DATE',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.measuredOn, b.measuredOn),
            modifier: (row: ChartData) => {
                const { measuredOn } = row;

                return getPeriodWiseDate(measuredOn, periodCode);
            },
        },
        {
            key: 'key',
            label: 'ACCUMULATED RAINFALL(mm)',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.accDaily, b.accDaily),
            modifier: (row: ChartData) => {
                const min = row.accDaily;
                return (min === 0 || min > 0) ? `${min.toFixed(2)}` : undefined;
            },
        },
        {
            key: 'min',
            label: 'CUMULATIVE RAINFALL (mm)',
            order: 3,
            sortable: true,
            comparator: (a, b) => compareNumber(a.cumulativeDailyData, b.cumulativeDailyData),
            modifier: (row: ChartData) => {
                // setCumu(row.accHour);
                const min = row.cumulativeDailyData;
                return (min === 0 || min > 0) ? `${min.toFixed(2)}` : undefined;
            },
        },
    ];
    const rainMonthlyHeader = [
        {
            key: 'year',
            label: 'DATE',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.measuredOn, b.measuredOn),
            modifier: (row: ChartData) => {
                const { key } = row;
                return key;
            },
        },
        {
            key: 'key',
            label: 'ACCUMULATED RAINFALL(mm)',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.accMonthly, b.accMonthly),
            modifier: (row: ChartData) => {
                const min = row.accMonthly;
                return (min === 0 || min > 0) ? `${min.toFixed(2)}` : undefined;
            },
        },
        {
            key: 'min',
            label: 'CUMULATIVE RAINFALL (mm)',
            order: 3,
            sortable: true,
            comparator: (a, b) => compareNumber(a.cumulativeMonthlyData, b.cumulativeMonthlyData),
            modifier: (row: ChartData) => {
                // setCumu(row.accHour);
                const min = row.cumulativeMonthlyData;
                return (min === 0 || min > 0) ? `${min.toFixed(2)}` : undefined;
            },
        },
    ];

    const rainMinuteHeader = [
        {
            key: 'year',
            label: 'DATE',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.measuredOn, b.measuredOn),
            modifier: (row: ChartData) => {
                const { measuredOn } = row;
                return getPeriodWiseDate(measuredOn, periodCode);
            },
        },
        {
            key: 'avg',
            label: 'ACCUMULATED RAINFALL (mm)',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a[`${intervalCode}Avg`], b[`${intervalCode}Avg`]),
            modifier: (row: ChartData) => {
                const avg = row[`${intervalCode}Avg`];
                return (avg) ? `${avg.toFixed(2)}` : undefined;
            },
        },
    ];
    if (data && data.length === 0) {
        return (
            <NoData
                title="Table View"
                message={isInitial ? 'Please select filter to view data' : undefined}
            />
        );
    }
    // removing year column for hourly period
    let header;
    let csvData;
    if (periodCode === 'hourly') {
        header = rainHourlyHeader;
        csvData = cumulativeData;
    } else if (periodCode === 'daily') {
        header = rainDailyHeader;
        csvData = cumulativeData;
    } else if (periodCode === 'monthly') {
        header = rainMonthlyHeader;
        csvData = monthlyChartData;
    }

    const formattedTableData = convertNormalTableToCsv(csvData,
        header);

    const fileName = generateFileName(intervalCode || '', periodCode || '', stationName);
    return (
        <div className={styles.tableView}>
            <div className={styles.header}>
                <div className={styles.dateRange}>
                    <b>Time Period: </b>
                    {`${startDate} to ${endDate}`}
                </div>
                <DownloadButton
                    value={formattedTableData}
                    name={fileName}
                    className={styles.downloadButton}
                >
                    <h4>Download</h4>
                    <Icon
                        className={styles.chartDownload}
                        name="download"
                    />
                </DownloadButton>
            </div>


            <Table
                // rowClassNameSelector={getClassName}
                className={styles.rainTable}
                data={tableData}
                headers={header}
                keySelector={rainSelector}
                defaultSort={defaultSort}
            />


        </div>
    );
};

export default TableView;
