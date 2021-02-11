import { ArchiveRain, Errors } from './types';
import { isValidDate, getDateDiff } from '#views/DataArchive/utils';

export const rainToGeojson = (rainList: ArchiveRain[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: rainList
            .filter(rain => rain.point)
            .map(rain => ({
                id: rain.id,
                type: 'Feature',
                geometry: {
                    ...rain.point,
                },
                properties: {
                    ...rain,
                    rainId: rain.id,
                    title: rain.title,
                    description: rain.description,
                    basin: rain.basin,
                    status: rain.status,
                },
            })),
    };
    return geojson;
};

const MINIMUM_DATA_ARCHIVE_RAIN_DATE = '2020-07-14';

export const getErrors = (fv: any) => {
    const { dataDateRange, interval = {}, period = {} } = fv;
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

    if (startDate < MINIMUM_DATA_ARCHIVE_RAIN_DATE) {
        error = {
            type: 'Date',
            err: `No data archive rain data before ${MINIMUM_DATA_ARCHIVE_RAIN_DATE}`,
            message: `Data is available from ${MINIMUM_DATA_ARCHIVE_RAIN_DATE} onwards only`,
        };
        errors.push(error);
    }

    if (Object.keys(interval).length === 0) {
        error = {
            type: 'Interval',
            err: 'Interval not supplied',
            message: 'Please select an interval value',
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

// for interval parsing
export const getIntervalCode = (interval: number) => {
    const intervals: {[key in number]: string} = {
        1: 'oneHour',
        3: 'threeHour',
        6: 'sixHour',
        12: 'twelveHour',
        24: 'twentyFourHour',
    };
    return intervals[interval];
};

export const parseInterval = (rainDetails: ArchiveRain[]) => {
    const temp = [...rainDetails];
    const withInterval = temp.map((detail) => {
        const { averages } = detail;
        averages.forEach((avg) => {
            const { value = 0, interval } = avg;
            const intervalCode = getIntervalCode(interval);
            Object.assign(detail, { [intervalCode]: value });
        });
        return detail;
    });
    return withInterval;
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

export const parsePeriod = (rainDetails: ArchiveRain[]) => {
    const temp = [...rainDetails];
    const withPeriod = temp.map((detail) => {
        const { measuredOn } = detail;
        const [dateWithMinute, minuteName] = getMinuteValues(measuredOn);
        const [dateWithHour, hourName] = getHourlyValues(measuredOn);
        const [dateOnly, dateName] = getDailyValues(measuredOn);
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
