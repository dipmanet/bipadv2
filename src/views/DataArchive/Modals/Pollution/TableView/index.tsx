import React from 'react';
import {
    compareString,
    compareNumber,
} from '@togglecorp/fujs';
import { ArchivePollution, FaramValues } from '../types';
import { dateParser } from '../utils';
import {
    convertNormalTableToCsv,
} from '#utils/table';
import Table from '#rscv/Table';
import DownloadButton from '#components/DownloadButton';

import NoData from '../NoData';
import styles from './styles.scss';

interface Props {
    pollutionDataWithParameter: ArchivePollution[];
    filterValues: FaramValues;
}

const pollutionSelector = (pollution: ArchivePollution) => pollution.id;

const defaultSort = {
    key: 'createdOn',
    order: 'dsc',
};

const TableView = (props: Props) => {
    const {
        pollutionDataWithParameter: data,
        filterValues: { dataDateRange: { startDate, endDate } },
    } = props;
    const pollutionHeader = [
        {
            key: 'createdOn',
            label: 'Date',
            order: 1,
            sortable: true,
            comparator: (a, b) => compareString(a.createdOn, b.createdOn),
            modifier: (row: ArchivePollution) => {
                const { createdOn } = row;
                // parsing date to appropiate format
                return (createdOn) ? dateParser(createdOn) : undefined;
            },
        },
        {
            key: 'aqi',
            label: 'AQI',
            order: 2,
            sortable: true,
            comparator: (a, b) => compareNumber(a.aqi, b.aqi),
            modifier: (row: ArchivePollution) => {
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
    if (data.length === 0) {
        return (
            <NoData />
        );
    }
    const formattedTableData = convertNormalTableToCsv(data,
        pollutionHeader);
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
                >
                    Download
                </DownloadButton>
            </div>
            <Table
                // rowClassNameSelector={getClassName}
                className={styles.pollutionTable}
                data={data}
                headers={pollutionHeader}
                keySelector={pollutionSelector}
                defaultSort={defaultSort}
            />
        </div>
    );
};

export default TableView;
