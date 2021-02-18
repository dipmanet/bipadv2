import { ArchiveRiver, Errors } from './types';
import { isValidDate, getDateDiff } from '#views/DataArchive/utils';

export const riverToGeojson = (riverList: ArchiveRiver[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: riverList
            .filter(river => river.point)
            .map(river => ({
                id: river.id,
                type: 'Feature',
                geometry: {
                    ...river.point,
                },
                properties: {
                    ...river,
                    riverId: river.id,
                    title: river.title,
                    description: river.description,
                    basin: river.basin,
                    status: river.status,
                    steady: river.steady,
                },
            })),
    };
    return geojson;
};

const MINIMUM_DATA_ARCHIVE_RIVER_DATE = '2020-07-14';

export const getErrors = (fv: any) => {
    const { dataDateRange, period = {} } = fv;
    const { startDate, endDate } = dataDateRange;
    const errors: Errors[] = [];
    let error;
    if (!startDate || !endDate) {
        error = {
            type: 'Date',
            err: 'StartDate or EndDate not provided',
            message: 'Please fill both Start Date and End Date',
        };
        errors.push(error);
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        error = {
            type: 'Date',
            err: 'StartDate or EndDate not valid',
            message: 'Please provide valid Start Date and End Date',
        };
        errors.push(error);
    }

    if (startDate > endDate) {
        error = {
            type: 'Date',
            err: 'StartDate is greater than EndDate',
            message: 'StartDate cannot be greater than EndDate',
        };
        errors.push(error);
    }

    if (getDateDiff(startDate, endDate) > 365) {
        error = {
            type: 'Date',
            err: 'More than 1 year time period selected',
            message: 'Time period cannot be greater than one year',
        };
        errors.push(error);
    }

    if (startDate < MINIMUM_DATA_ARCHIVE_RIVER_DATE) {
        error = {
            type: 'Date',
            err: `No data archive river data before ${MINIMUM_DATA_ARCHIVE_RIVER_DATE}`,
            message: `Data is available from ${MINIMUM_DATA_ARCHIVE_RIVER_DATE} onwards only`,
        };
        errors.push(error);
    }

    if (Object.keys(period).length === 0) {
        error = {
            type: 'Period',
            err: 'Period not supplied',
            message: 'Please select a period value',
        };
        errors.push(error);
    }
    return errors;
};

export const isEqualObject = (obj1: any, obj2: any) => {
    const isEqual = JSON.stringify(obj1) === JSON.stringify(obj2);
    return isEqual;
};

// for period parsing
const getDateWithMinute = (dateTime: string) => {
    const [dateWithHour, minutes] = dateTime.split(':');
    const dateWithMinutes = `${dateWithHour}:${minutes}`;
    return dateWithMinutes;
};

const getMinuteValues = (dateTime: string) => {
    const dateWithMinute = getDateWithMinute(dateTime);
    const hour = new Date(dateTime).getHours();
    const rawMinutes = new Date(dateTime).getMinutes();
    const minutes = (rawMinutes < 10 ? '0' : '') + rawMinutes;
    const minuteName = hour < 12 ? `${hour}:${minutes} AM` : `${hour}:${minutes} PM`;
    return [dateWithMinute, minuteName];
};

const getHourlyValues = (dateTime: string) => {
    const dateWithHour = dateTime.substr(0, dateTime.indexOf(':'));
    const hour = new Date(dateTime).getHours();
    const hourName = hour < 12 ? `${hour} AM` : `${hour} PM`;
    return [dateWithHour, hourName];
};

const getDailyValues = (dateTime: string) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const dateOnly = dateTime.substr(0, dateTime.indexOf('T'));
    const month = new Date(dateTime).getMonth();
    const date = new Date(dateTime).getDate();
    const dateName = `${monthNames[month]} ${date}`;

    return [dateOnly, dateName];
};

export const parsePeriod = (riverDetails: ArchiveRiver[]) => {
    const temp = [...riverDetails];
    const withPeriod = temp.map((detail) => {
        const { waterLevelOn } = detail;
        const [dateWithMinute, minuteName] = getMinuteValues(waterLevelOn);
        const [dateWithHour, hourName] = getHourlyValues(waterLevelOn);
        const [dateOnly, dateName] = getDailyValues(waterLevelOn);
        return { ...detail,
            dateWithMinute,
            minuteName,
            dateWithHour,
            hourName,
            dateOnly,
            dateName };
    });
    return withPeriod;
};

// for chart data
export const arraySorter = (a: {waterLevelOn: string}, b: {waterLevelOn: string}) => {
    const keyA = new Date(a.waterLevelOn);
    const keyB = new Date(b.waterLevelOn);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
};

export const getMinimum = (arr: number[]) => {
    const minimum = Math.min(...arr);
    return minimum.toFixed(2);
};

export const getMaximum = (arr: number[]) => {
    const maximum = Math.max(...arr);
    return maximum.toFixed(2);
};

export const getAverage = (arr: number[]) => {
    const average = arr.reduce((p, c) => p + c, 0) / arr.length;
    return average.toFixed(2);
};

export const getItemParts = (dataArray: any[], field: string) => {
    const array = dataArray.map(data => data[field] || 0);
    const minimum = getMinimum(array);
    const average = getAverage(array);
    const maximum = getMaximum(array);
    return [minimum, average, maximum];
};

export const getItemAverage = (dataArray: any[], field: string) => {
    const array = dataArray.map(data => data[field] || 0);
    return getAverage(array);
};

export const getChartData = (
    data: {key: string | number; value: any[]}[],
    labelKey: string,
) => {
    const chartData = data.map((singleItem) => {
        const { key, value: dataArray } = singleItem;
        const label = dataArray[0][labelKey];
        const { createdOn, waterLevelOn, dangerLevel, warningLevel } = dataArray[0];
        const [waterLevelMin, waterLevelAvg, waterLevelMax] = getItemParts(dataArray, 'waterLevel');
        const waterLevel = getItemAverage(dataArray, 'waterLevel');

        return {
            key,
            label: String(label || ''),
            createdOn: String(createdOn || ''),
            waterLevelOn: String(waterLevelOn || ''),
            dangerLevel: Number(dangerLevel) || 0,
            warningLevel: Number(warningLevel) || 0,
            waterLevel: Number(waterLevel) || 0,
            waterLevelMin: Number(waterLevelMin) || 0,
            waterLevelAvg: Number(waterLevelAvg) || 0,
            waterLevelMax: Number(waterLevelMax) || 0,
        };
    });
    return chartData;
};
