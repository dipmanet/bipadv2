import React from 'react';
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
}

const rainSelector = (rain: ChartData) => rain.measuredOn;

const defaultSort = {
    key: 'year',
    order: 'dsc',
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
    return null;
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
    } = props;
    const rainHeader = [
        {
            key: 'year',
            label: 'Date',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.measuredOn, b.measuredOn),
            modifier: (row: ChartData) => {
                const { measuredOn } = row;

                return getPeriodWiseDate(measuredOn, periodCode);
            },
        },
        {
            key: 'min',
            label: 'Min',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a[`${intervalCode}Min`], b[`${intervalCode}Min`]),
            modifier: (row: ChartData) => {
                const min = row[`${intervalCode}Min`];
                return (min) ? `${min.toFixed(2)}` : undefined;
            },
        },
        {
            key: 'avg',
            label: 'Avg',
            order: 3,
            sortable: true,
            comparator: (a, b) => compareNumber(a[`${intervalCode}Avg`], b[`${intervalCode}Avg`]),
            modifier: (row: ChartData) => {
                const avg = row[`${intervalCode}Avg`];
                return (avg) ? `${avg.toFixed(2)}` : undefined;
            },
        },
        {
            key: 'max',
            label: 'Max',
            order: 4,
            sortable: true,
            comparator: (a, b) => compareNumber(a[`${intervalCode}Max`], b[`${intervalCode}Max`]),
            modifier: (row: ChartData) => {
                const max = row[`${intervalCode}Max`];
                return (max) ? `${max.toFixed(2)}` : undefined;
            },
        },
    ];
    const rainMinuteHeader = [
        {
            key: 'year',
            label: 'Date',
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
    if (periodCode === 'minute') {
        header = rainMinuteHeader;
    } else {
        header = rainHeader;
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
                    name="RainArchive.csv"
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
                data={data}
                headers={header}
                keySelector={rainSelector}
                defaultSort={defaultSort}
            />
        </div>
    );
};

export default TableView;
