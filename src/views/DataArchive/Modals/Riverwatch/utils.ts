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

export const parsePeriod = (rainDetails: ArchiveRiver[]) => {
    const temp = [...rainDetails];
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
