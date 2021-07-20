import * as PageType from '#store/atom/page/types';
import { DatePeriod } from './types';
import { DARainFiltersElement, DARiverFiltersElement } from '#types';
import { pastDaysToDateRange } from '#utils/transformations';

type GroupKey = 'pTitle' | 'dTitle' | 'mTitle';
type Filters = DARainFiltersElement | DARiverFiltersElement;
const groupBy = (data: [], key: GroupKey) => data.reduce((storage, item) => {
    const group = item[key];
    // eslint-disable-next-line no-param-reassign
    storage[group] = storage[group] || [];
    storage[group].push(item);
    return storage;
}, {});


export const setRegionTitle = (data: []) => {
    const dataWithRegionTitle = JSON.parse(JSON.stringify(data));
    dataWithRegionTitle.map((result) => {
        if (result && result.province) {
            Object.assign(result, { pTitle: result.province.title });
        }
        if (result && result.district) {
            Object.assign(result, { dTitle: result.district.title });
        }
        if (result && result.municipality) {
            Object.assign(result, { mTitle: result.municipality.title });
        }
        return result;
    });
    return dataWithRegionTitle;
};

const removeUndefined = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        if (key === 'undefined') {
            // eslint-disable-next-line no-param-reassign
            delete obj[key];
        }
    });
};

export const groupByRegion = (data: [], key: GroupKey) => {
    const dataWithRegionTitle = setRegionTitle(data);
    const groupedData = groupBy(dataWithRegionTitle, key);
    removeUndefined(groupedData);
    return groupedData;
};

export const getDate = (dateValue: string) => {
    const date = dateValue.split('T')[0];
    return date;
};

export const getTime = (dateValue: string) => {
    const timeWithSeconds = dateValue.split('T')[1].split('.')[0];
    const [hour, minutes, seconds] = timeWithSeconds.split(':');
    const time = `${hour}:${minutes}`;
    return time;
};

export const getTimeWithIndictor = (dateValue: string) => {
    const timeWithSeconds = dateValue.split('T')[1].split('.')[0];
    const [hour, minutes, seconds] = timeWithSeconds.split(':');
    const indicator = Number(hour) < 12 ? 'AM' : 'PM';
    const timeWithIndicator = `${hour}:${minutes} ${indicator}`;
    return timeWithIndicator;
};


export const getIndividualAverages = (averages: PageType.WaterLevelAverage[]) => {
    let oneHour;
    let threeHour;
    let sixHour;
    let twelveHour;
    let twentyFourHour;
    averages.forEach((average) => {
        if (average.interval === 1) {
            oneHour = average;
        }
        if (average.interval === 3) {
            threeHour = average;
        }
        if (average.interval === 6) {
            sixHour = average;
        }
        if (average.interval === 12) {
            twelveHour = average;
        }
        if (average.interval === 24) {
            twentyFourHour = average;
        }
    });
    const individualAverages = {
        oneHour,
        threeHour,
        sixHour,
        twelveHour,
        twentyFourHour,
    };
    return individualAverages;
};

export const getMonthName = (date: string) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const d = new Date(date);
    return monthNames[d.getMonth()];
};

export const getSpecificDate = (date: string, datePeriod: DatePeriod) => {
    const dateOnly = date.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    const dateObject = {
        year,
        month,
        day,
    };
    return dateObject[datePeriod];
};

export const isValidDate = (dateString: string = '') => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
};

export const getDateDiff = (startDate: string = '', endDate: string = '') => {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffTime = Math.abs(Number(date2) - Number(date1));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const getYYYYMMDD = (date: Date) => {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
};

export const getDatesFromFilters = (filters: Filters) => {
    const { dataDateRange } = filters;
    const { rangeInDays } = dataDateRange;
    let startDate;
    let endDate;
    if (rangeInDays !== 'custom') {
        const { startDate: sDate, endDate: eDate } = pastDaysToDateRange(rangeInDays);
        startDate = getYYYYMMDD(sDate);
        endDate = getYYYYMMDD(eDate);
    } else {
        ({ startDate, endDate } = dataDateRange);
    }
    return [startDate, endDate];
};

// for Table View
export const getPostHour = (initialHour: number) => {
    const hour = Number(initialHour);
    if (hour === 23) {
        return '23:59';
    }
    const immaturePostHour = hour + 1;
    const postHour = immaturePostHour < 10 ? `0${immaturePostHour}` : immaturePostHour;
    return `${postHour}:00`;
};

export const getDateWithRange = (measuredOn: string) => {
    const [year, fullTime] = measuredOn.split('T');
    const [time] = fullTime.split(':');

    let initialHour;
    const date = new Date(year);
    let lastYear;
    if (Number(time) === 0) {
        initialHour = 0;
        const temp = new Date(date.setDate(date.getDate()));
        lastYear = temp.toISOString().slice(0, 10);
    } else {
        initialHour = Number(time);
        lastYear = year;
    }
    const indicator = Number(initialHour) < 12 ? 'AM' : 'PM';
    const postHour = getPostHour(initialHour);
    const dateWithRange = `${lastYear} ${initialHour}:00-${postHour} ${indicator}`;
    return dateWithRange;
};

// Check permission for the user
export const checkPermission = (user, codeName, app) => {
    let permission = false;
    if (!user) {
        permission = false;
    } else if (user.isSuperuser) {
        permission = true;
    }
    if (user && user.groups) {
        user.groups.forEach((group) => {
            if (group.permissions) {
                group.permissions.forEach((p) => {
                    if (p.codename === codeName && p.app === app) {
                        permission = true;
                    }
                });
            } else {
                permission = false;
            }
        });
    }
    if (user && user.userPermissions) {
        user.userPermissions.forEach((a) => {
            if (a.codename === codeName && a.app === app) {
                permission = true;
            }
        });
    } else {
        permission = false;
    }
    return permission;
};
