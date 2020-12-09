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
}

const pollutionSelector = (pollution: ChartData) => pollution.createdOn;

const defaultSort = {
    key: 'createdOn',
    order: 'dsc',
};

const getPeriodWiseDate = (label: string | number, createdOn: string, periodCode?: string) => {
    if (periodCode === 'hourly') {
        return (createdOn) ? dateParser(createdOn) : undefined;
    }
    return `${label}`;
};

const TableView = (props: Props) => {
    const {
        filterValues: { dataDateRange: { startDate, endDate }, period: { periodCode } },
        filterWiseChartData: data = [],
    } = props;
    const pollutionHeader = [
        {
            key: 'year',
            label: 'Year',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.createdOn, b.createdOn),
            modifier: (row: ChartData) => {
                const { createdOn } = row;

                return createdOn ? createdOn.split('-')[0] : undefined;
            },
        },
        {
            key: 'createdOn',
            label: 'Date',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.createdOn, b.createdOn),
            modifier: (row: ChartData) => {
                const { label, createdOn } = row;
                // parsing date to appropiate format
                return getPeriodWiseDate(label, createdOn, periodCode);
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
            label: 'PM 1',
            order: 3,
            sortable: true,
            comparator: (a, b) => compareNumber(a.PM1_I, b.PM1_I),
        },
        {
            key: 'PM10_I',
            label: 'PM 10',
            order: 4,
            sortable: true,
            comparator: (a, b) => compareNumber(a.PM10_I, b.PM10_I),
        },
        {
            key: 'PM25_I',
            label: 'PM 2.5',
            order: 5,
            sortable: true,
            comparator: (a, b) => compareNumber(a.PM25_I, b.PM25_I),
        },
        {
            key: 'RH_I',
            label: 'Humidity',
            order: 6,
            sortable: true,
            comparator: (a, b) => compareNumber(a.RH_I, b.RH_I),
        },
        {
            key: 'T',
            label: 'Temparature',
            order: 7,
            sortable: true,
            comparator: (a, b) => compareNumber(a.T, b.T),
        },
        {
            key: 'TSP_I',
            label: 'TSP',
            order: 8,
            sortable: true,
            comparator: (a, b) => compareNumber(a.TSP_I, b.TSP_I),
        },
        {
            key: 'WD_I',
            label: 'Wind Direction',
            order: 9,
            sortable: true,
            comparator: (a, b) => compareNumber(a.WD_I, b.WD_I),
        },
        {
            key: 'WS_I',
            label: 'Wind Speed',
            order: 10,
            sortable: true,
            comparator: (a, b) => compareNumber(a.WS_I, b.WS_I),
        },
    ];
    if (data && data.length === 0) {
        return (
            <NoData title="Table View" />
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
