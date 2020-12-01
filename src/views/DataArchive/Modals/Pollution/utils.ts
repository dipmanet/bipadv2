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
                    date: Date.parse(pollution.createdOn) || 1,
                },
            })),
    };
    return geojson;
};

export const getSortedPollutionData = memoize((pollutionDetails: ArchivePollution[]) => {
    const sortedData = [...pollutionDetails].sort((a, b) => compareDate(b.createdOn, a.createdOn));
    return sortedData;
});

export const getTodaysPollutionDetails = memoize((pollutionDetails: ArchivePollution[]) => {
    const today = getDate(new Date().getTime());
    const todaysData = pollutionDetails.filter(
        pollutionDetail => getDate(pollutionDetail.createdOn) === today,
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

// for period parsing

const getHourlyValues = (createdOn: string) => {
    const dateWithHour = createdOn.substr(0, createdOn.indexOf(':'));
    const hour = new Date(createdOn).getHours();
    const hourName = hour < 12 ? `${hour} AM` : `${hour} PM`;
    return [dateWithHour, hourName];
};

const getDailyValues = (createdOn: string) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const dateOnly = createdOn.substr(0, createdOn.indexOf('T'));
    const month = new Date(createdOn).getMonth();
    const date = new Date(createdOn).getDate();
    const dateName = `${monthNames[month]} ${date}`;

    return [dateOnly, dateName];
};

const getWeekNumber = (createdOn: string) => {
    const date = new Date(createdOn);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getWeeklyValues = (createdOn: string) => {
    const year = new Date(createdOn).getFullYear();
    const weekNumber = getWeekNumber(createdOn);
    const weekName = `Week ${weekNumber}`;
    const dateWithWeek = `${year} ${weekName}`;
    return [dateWithWeek, weekName];
};

const getMonthlyValues = (createdOn: string) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const date = new Date(createdOn);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = monthNames[month];
    const dateWithMonth = `${year} ${monthName}`;
    return [dateWithMonth, monthName];
};

export const parsePeriod = memoize((pollutionDetails: ArchivePollution[]) => {
    const temp = [...pollutionDetails];
    const withPeriod = temp.map((detail) => {
        const { createdOn } = detail;
        const [dateWithHour, hourName] = getHourlyValues(createdOn);
        const [dateOnly, dateName] = getDailyValues(createdOn);
        const [dateWithWeek, weekName] = getWeeklyValues(createdOn);
        const [dateWithMonth, monthName] = getMonthlyValues(createdOn);
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
