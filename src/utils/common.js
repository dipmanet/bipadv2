import { isNotDefined } from '@togglecorp/fujs';

export const convertJsonToCsv = (data, columnDelimiter = ',', lineDelimiter = '\n', emptyValue = '') => {
    if (!data || data.length <= 0) {
        return undefined;
    }

    // TODO: get exhaustive keys
    const keys = Object.keys(data[0]);

    let result = keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach((item) => {
        result += keys
            .map(key => item[key])
            .map((str) => {
                if (isNotDefined(str)) {
                    return emptyValue;
                }
                const val = String(str);
                if (val.includes(columnDelimiter)) {
                    return `"${val}"`;
                }
                return val;
            })
            .join(columnDelimiter);
        result += lineDelimiter;
    });

    return result;
};

export const convertCsvToLink = (csvRaw) => {
    let csv = csvRaw;
    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }
    return encodeURI(csv);
};


export const mapObjectToObject = (obj, fn) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        newObj[key] = fn(obj[key], key);
    });
    return newObj;
};

export const mapObjectToArray = (obj, fn) => {
    const newArray = [];
    Object.keys(obj).forEach((key) => {
        const value = fn(obj[key], key);
        newArray.push(value);
    });
    return newArray;
};


export const pick = (obj, keys) => keys.reduce(
    (acc, key) => ({ ...acc, [key]: obj[key] }),
    {},
);

const reOne = /([a-z])([A-Z])/g;
const reTwo = /([A-Z])([A-Z])([a-z])/g;
export const camelToNormalCase = (text) => {
    const firstPhase = text.replace(reOne, '$1 $2');
    const secondPhase = firstPhase.replace(reTwo, '$1 $2$3');
    return secondPhase;
};

export const addDaysToDate = (date, days) => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const pastDaysToDateRange = (pastDays) => {
    const today = new Date();
    const lastDate = addDaysToDate(today, -pastDays);
    return {
        startDate: lastDate,
        endDate: today,
    };
};

const decodeTimeInMinutes = (value, separator = ':') => {
    if (!value) {
        return 0;
    }
    const values = value.split(separator);
    return ((+values[0] * 60) + values[1]);
};

export const compareTime = (a, b) => (
    decodeTimeInMinutes(a) - decodeTimeInMinutes(b)
);

export const timeFrom = (date) => {
    const cDate = date instanceof Date ? date : new Date(date);

    const seconds = Math.floor((new Date() - cDate) / 1000);

    const intervals = [
        {
            span: 'year',
            duration: 31536000,
        },
        {
            span: 'month',
            duration: 2592000,
        },
        {
            span: 'day',
            duration: 86400,
        },
        {
            span: 'hour',
            duration: 3600,
        },
        {
            span: 'minute',
            duration: 60,
        },
    ];

    for (let i = 0, len = intervals.length; i < len; i += 1) {
        const interval = intervals[i];
        const fromNow = Math.floor(seconds / interval.duration);
        if (fromNow > 0) {
            return `${fromNow} ${interval.span}${fromNow > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
};

export const sanitizeResponse = (data) => {
    if (data === null) {
        return undefined;
    }
    if (Array.isArray(data)) {
        const newData = [];
        data.forEach((k) => {
            const newEntry = sanitizeResponse(k);
            if (newEntry !== undefined) {
                newData.push(newEntry);
            }
        });
        return newData;
    } else if (typeof data === 'object') {
        const newData = {};
        Object.keys(data).forEach((k) => {
            const newEntry = sanitizeResponse(data[k]);
            if (newEntry !== undefined) {
                newData[k] = newEntry;
            }
        });
        return newData;
    }
    return data;
};
