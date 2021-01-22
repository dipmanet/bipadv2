import React from 'react';
import {
    compareString,
    compareNumber,
} from '@togglecorp/fujs';
import { FaramValues, ChartData } from '../types';
import { dateParser } from '../utils';
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
}

const pollutionSelector = (pollution: ChartData) => pollution.dateTime;

const defaultSort = {
    key: 'dateTime',
    order: 'dsc',
};

const getPeriodWiseDate = (label: string | number, dateTime: string, periodCode?: string) => {
    if (periodCode === 'hourly') {
        return (dateTime) ? dateParser(dateTime) : undefined;
    }
    return `${label}`;
};

const TableView = (props: Props) => {
    const {
        filterValues: { dataDateRange: { startDate, endDate }, period: { periodCode } },
        filterWiseChartData: data = [],
        isInitial,
    } = props;
    const pollutionHeader = [
        {
            key: 'year',
            label: 'Year',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.dateTime, b.dateTime),
            modifier: (row: ChartData) => {
                const { dateTime } = row;

                return dateTime ? dateTime.split('-')[0] : undefined;
            },
        },
        {
            key: 'dateTime',
            label: 'Date',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.dateTime, b.dateTime),
            modifier: (row: ChartData) => {
                const { label, dateTime } = row;
                // parsing date to appropiate format
                return getPeriodWiseDate(label, dateTime, periodCode);
            },
        },
        {
            key: 'aqi',
            label: 'AQI',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.aqi, b.aqi),
            modifier: (row: ChartData) => {
                const { aqi } = row;
                return (aqi) ? `${aqi.toFixed(2)}` : undefined;
            },
        },
        {
            key: 'PM1_I',
            label: 'PM 1 (µg/m³)',
            order: 3,
            sortable: true,
            comparator: (a, b) => compareNumber(a.PM1_I, b.PM1_I),
        },
        {
            key: 'PM10_I',
            label: 'PM 10 (µg/m³)',
            order: 4,
            sortable: true,
            comparator: (a, b) => compareNumber(a.PM10_I, b.PM10_I),
        },
        {
            key: 'PM25_I',
            label: 'PM 2.5 (µg/m³)',
            order: 5,
            sortable: true,
            comparator: (a, b) => compareNumber(a.PM25_I, b.PM25_I),
        },
        {
            key: 'RH_I',
            label: 'Humidity (%)',
            order: 6,
            sortable: true,
            comparator: (a, b) => compareNumber(a.RH_I, b.RH_I),
        },
        {
            key: 'T',
            label: 'Temparature (°C)',
            order: 7,
            sortable: true,
            comparator: (a, b) => compareNumber(a.T, b.T),
        },
        {
            key: 'TSP_I',
            label: 'TSP (µg/m³)',
            order: 8,
            sortable: true,
            comparator: (a, b) => compareNumber(a.TSP_I, b.TSP_I),
        },
        {
            key: 'WD_I',
            label: 'Wind Direction (°)',
            order: 9,
            sortable: true,
            comparator: (a, b) => compareNumber(a.WD_I, b.WD_I),
        },
        {
            key: 'WS_I',
            label: 'Wind Speed (m/s)',
            order: 10,
            sortable: true,
            comparator: (a, b) => compareNumber(a.WS_I, b.WS_I),
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
    if (periodCode === 'hourly') {
        header = pollutionHeader.filter(item => item.key !== 'year');
    } else {
        header = pollutionHeader;
    }

    const formattedTableData = convertNormalTableToCsv(data,
        header);
    return (
        <div className={styles.tableView}>
            <div className={styles.header}>
                <div className={styles.dateRange}>
                    <b>Time Period: </b>
                    {`${startDate} to ${endDate}`}
                </div>
                <DownloadButton
                    value={formattedTableData}
                    name="PollutionArchive.csv"
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
                className={styles.pollutionTable}
                data={data}
                headers={header}
                keySelector={pollutionSelector}
                defaultSort={defaultSort}
            />
        </div>
    );
};

export default TableView;
