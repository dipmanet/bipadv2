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
    stationName: string;
    isInitial?: boolean;
}

const riverSelector = (river: ChartData) => river.waterLevelOn;

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

const generateFileName = (period: string, stationName: string) => {
    const preText = 'DataArchiveRiver';
    const postText = `${stationName}`;
    const name: {[key: string]: string} = {
        minute: `${preText}_MinutewiseReadings_${postText}`,
        hourly: `${preText}_HourlyReadings_${postText}`,
        daily: `${preText}_DailyReadings_${postText}`,
    };
    return name[period].replace(/ /g, '_');
};

const TableView = (props: Props) => {
    const {
        filterValues: {
            dataDateRange: { startDate, endDate },
            period: { periodCode },
        },
        filterWiseChartData: data = [],
        isInitial,
        stationName,
    } = props;

    const riverHeader = [
        {
            key: 'year',
            label: 'DATE ',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.waterLevelOn, b.waterLevelOn),
            modifier: (row: ChartData) => {
                const { waterLevelOn } = row;

                return getPeriodWiseDate(waterLevelOn, periodCode);
            },
        },
        {
            key: 'min',
            label: 'MINIMUM WATER LEVEL (m)',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.waterLevelMin, b.waterLevelMin),
            modifier: (row: ChartData) => {
                const { waterLevelMin } = row;
                return (waterLevelMin) ? `${waterLevelMin.toFixed(2)}` : undefined;
            },
        },
        {
            key: 'avg',
            label: 'AVERAGE WATER LEVEL (m)',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.waterLevelAvg, b.waterLevelAvg),
            modifier: (row: ChartData) => {
                const { waterLevelAvg } = row;
                return (waterLevelAvg) ? `${waterLevelAvg.toFixed(2)}` : undefined;
            },
        },
        {
            key: 'max',
            label: 'MAXIMUM WATER LEVEL (m)',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.waterLevelMax, b.waterLevelMax),
            modifier: (row: ChartData) => {
                const { waterLevelMax } = row;
                return (waterLevelMax) ? `${waterLevelMax.toFixed(2)}` : undefined;
            },
        },
    ];
    const riverMinuteHeader = [
        {
            key: 'year',
            label: 'DATE',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.waterLevelOn, b.waterLevelOn),
            modifier: (row: ChartData) => {
                const { waterLevelOn } = row;
                return getPeriodWiseDate(waterLevelOn, periodCode);
            },
        },
        {
            key: 'avg',
            label: 'WATER LEVEL (m)',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.waterLevelAvg, b.waterLevelAvg),
            modifier: (row: ChartData) => {
                const { waterLevelAvg } = row;
                return (waterLevelAvg) ? `${waterLevelAvg.toFixed(2)}` : undefined;
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
        header = riverMinuteHeader;
    } else {
        header = riverHeader;
    }

    const formattedTableData = convertNormalTableToCsv(data,
        header);
    const fileName = generateFileName(periodCode || '', stationName);
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
                className={styles.riverTable}
                data={data}
                headers={header}
                keySelector={riverSelector}
                defaultSort={defaultSort}
            />
        </div>
    );
};

export default TableView;
