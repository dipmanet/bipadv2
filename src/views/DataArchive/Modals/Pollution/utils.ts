import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    compareNumber,
    getDifferenceInDays,
    getDate,
    listToGroupList,
    isDefined,
    mapToList,
} from '@togglecorp/fujs';

import { Geometry, ArchivePollution } from './types';

export const pollutionToGeojson = (pollutionList: ArchivePollution[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: pollutionList
            .filter(pollution => pollution.point)
            .map(pollution => ({
                id: pollution.id,
                type: 'Feature',
                geometry: {
                    ...pollution.point,
                },
                properties: {
                    ...pollution,
                    aqi: Math.round(pollution.aqi),
                    date: Date.parse(pollution.dateTime || '') || 1,
                },
            })),
    };
    return geojson;
};

export const getSortedPollutionData = memoize((pollutionDetails: ArchivePollution[]) => {
    const sortedData = [...pollutionDetails].sort((a, b) => compareDate(b.dateTime, a.dateTime));
    return sortedData;
});

export const getTodaysPollutionDetails = memoize((pollutionDetails: ArchivePollution[]) => {
    const today = getDate(new Date().getTime());
    const todaysData = pollutionDetails.filter(
        pollutionDetail => getDate(pollutionDetail.dateTime) === today,
    );
    return todaysData;
});

export const parseParameter = memoize((pollutionDetails: ArchivePollution[]) => {
    const temp = [...pollutionDetails];
    const withParameter = temp.map((detail) => {
        const { observation } = detail;
        observation.forEach((obs) => {
            const { data, parameterCode } = obs;
            const { value } = data || {};
            const paramCode = parameterCode.replace('.', '');
            Object.assign(detail, { [paramCode]: value });
        });
        return detail;
    });
    return withParameter;
});

export const dateParser = (date: string) => {
    const [datePart, timePart] = date.split('T');
    const [hour, minutes] = timePart.split(':');
    const indicator = Number(hour) >= 12 ? 'PM' : 'AM';

    return `${datePart} ${hour}:${minutes} ${indicator}`;
};

export const arraySorter = (a: {dateTime: string}, b: {dateTime: string}) => {
    const keyA = new Date(a.dateTime);
    const keyB = new Date(b.dateTime);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
};

export const renderLegendName = (code: string) => {
    const names: {[key: string]: string} = {
        PM1_I: 'PM1 (µg/m³)',
        PM10_I: 'PM10 (µg/m³)',
        PM25_I: 'PM2.5 (µg/m³)',
        RH_I: 'Relative Humidity (%)',
        T: 'Air Temparature (°C)',
        TSP_I: 'Total Suspended Particulates (µg/m³)',
        WD_I: 'Wind Direction (°)',
        WS_I: 'Wind Speed (m/s)',
        aqi: 'AQI',
    };
    return names[code];
};

export const isEqualObject = (obj1: any, obj2: any) => {
    const isEqual = JSON.stringify(obj1) === JSON.stringify(obj2);
    return isEqual;
};

// for period parsing

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

const getWeekNumber = (dateTime: string) => {
    const date = new Date(dateTime);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getWeeklyValues = (dateTime: string) => {
    const year = new Date(dateTime).getFullYear();
    const weekNumber = getWeekNumber(dateTime);
    const weekName = `Week ${weekNumber}`;
    const dateWithWeek = `${year} ${weekName}`;
    return [dateWithWeek, weekName];
};

const getMonthlyValues = (dateTime: string) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = monthNames[month];
    const dateWithMonth = `${year} ${monthName}`;
    return [dateWithMonth, monthName];
};

export const parsePeriod = memoize((pollutionDetails: ArchivePollution[]) => {
    const temp = [...pollutionDetails];
    const withPeriod = temp.map((detail) => {
        const { dateTime } = detail;
        const [dateWithHour, hourName] = getHourlyValues(dateTime);
        const [dateOnly, dateName] = getDailyValues(dateTime);
        const [dateWithWeek, weekName] = getWeeklyValues(dateTime);
        const [dateWithMonth, monthName] = getMonthlyValues(dateTime);
        return { ...detail,
            dateWithHour,
            hourName,
            dateOnly,
            dateName,
            dateWithWeek,
            weekName,
            dateWithMonth,
            monthName };
    });
    return withPeriod;
});

export const getAverage = (arr: number[]) => {
    const average = arr.reduce((p, c) => p + c, 0) / arr.length;
    return average.toFixed(2);
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
        const { createdOn, dateTime } = dataArray[0];
        const PM1_I = getItemAverage(dataArray, 'PM1_I');
        const PM10_I = getItemAverage(dataArray, 'PM10_I');
        const PM25_I = getItemAverage(dataArray, 'PM25_I');
        const RH_I = getItemAverage(dataArray, 'RH_I');
        const T = getItemAverage(dataArray, 'T');
        const TSP_I = getItemAverage(dataArray, 'TSP_I');
        const WD_I = getItemAverage(dataArray, 'WD_I');
        const WS_I = getItemAverage(dataArray, 'WS_I');
        const aqi = getItemAverage(dataArray, 'aqi');

        return {
            key,
            label: String(label || ''),
            createdOn: String(createdOn || ''),
            dateTime: String(dateTime || ''),
            PM1_I: Number(PM1_I) || 0,
            PM10_I: Number(PM10_I) || 0,
            PM25_I: Number(PM25_I) || 0,
            RH_I: Number(RH_I) || 0,
            T: Number(T) || 0,
            TSP_I: Number(TSP_I) || 0,
            WD_I: Number(WD_I) || 0,
            WS_I: Number(WS_I) || 0,
            aqi: Number(aqi) || 0,
        };
    });
    return chartData;
};
