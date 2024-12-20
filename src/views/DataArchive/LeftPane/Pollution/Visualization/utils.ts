import memoize from 'memoize-one';
import * as PageType from '#store/atom/page/types';
import { groupList } from '#utils/common';

interface ChartData {
    key: string | number;
    label: string | number;
    good: number;
    moderate: number;
    unhealthyForSensitive: number;
    unhealthy: number;
    veryUnhealthy: number;
    hazardous: number;
    veryHazardous: number;
}

interface Data {
    key: string | number;
    label: string;
    dailyKey: string | number;
    aqi: number;
    dateTime: string;
}

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

export const parsePeriod = memoize((pollutionDetails: PageType.DataArchivePollution[]) => {
    const temp = [...pollutionDetails];
    const withPeriod = temp.map((detail) => {
        const { dateTime } = detail;
        const [dateWithHour, hourName] = getHourlyValues(dateTime || '');
        const [dateOnly, dateName] = getDailyValues(dateTime || '');
        const [dateWithWeek, weekName] = getWeeklyValues(dateTime || '');
        const [dateWithMonth, monthName] = getMonthlyValues(dateTime || '');
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

// period parsing ends

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
        const { dateTime } = dataArray[0];
        const aqi = getItemAverage(dataArray, 'aqi');

        return {
            key,
            label: String(label || ''),
            dateTime: String(dateTime || ''),
            aqi: Number(aqi) || 0,
        };
    });
    return chartData;
};

export const getAqiCategoryCount = (data: Data[]) => {
    let good = 0;
    let moderate = 0;
    let unhealthyForSensitive = 0;
    let unhealthy = 0;
    let veryUnhealthy = 0;
    let hazardous = 0;
    let veryHazardous = 0;
    data.forEach((datum) => {
        const { aqi } = datum;
        if (aqi <= 50) {
            good += 1;
            return;
        }
        if (aqi <= 100) {
            moderate += 1;
            return;
        }
        if (aqi <= 150) {
            unhealthyForSensitive += 1;
            return;
        }
        if (aqi <= 200) {
            unhealthy += 1;
            return;
        }
        if (aqi <= 300) {
            veryUnhealthy += 1;
            return;
        }
        if (aqi <= 400) {
            hazardous += 1;
        }
        if (aqi > 400) {
            veryHazardous += 1;
        }
    });
    return {
        good,
        moderate,
        unhealthyForSensitive,
        unhealthy,
        veryUnhealthy,
        hazardous,
        veryHazardous,
    };
};

export const withAqiCount = (data: Data[]) => {
    const {
        good,
        moderate,
        unhealthyForSensitive,
        unhealthy,
        veryUnhealthy,
        hazardous,
        veryHazardous,
    } = getAqiCategoryCount(data);

    const { dateTime, key } = data[0];
    return {
        key,
        label: key,
        value: data.length,
        good,
        moderate,
        unhealthyForSensitive,
        unhealthy,
        veryUnhealthy,
        hazardous,
        veryHazardous,
        dateTime,
    };
};

export const getPollutionAverage = memoize(
    (pollutionList: PageType.DataArchivePollution[]): ChartData[] => {
        const pollutionDataWithPeriod = parsePeriod(pollutionList);
        const stationWiseGroup = groupList(
            pollutionDataWithPeriod.filter(p => p.title),
            pollution => pollution.title || '',
        );
        const chartData = stationWiseGroup.map((singleStationData) => {
            const { key, value: dataArray } = singleStationData;
            const dailyWiseGroup = groupList(
                dataArray.filter(p => p.dateOnly),
                pollution => pollution.dateOnly,
            );
            const averageWiseChartData = getChartData(dailyWiseGroup, 'dateName')
                .map((data) => {
                    const { key: dailyKey, label, aqi, dateTime } = data;
                    return {
                        key,
                        dailyKey,
                        label,
                        aqi,
                        dateTime,
                    };
                });
            return withAqiCount(averageWiseChartData);
        }).sort(
            (a, b) => (a.label < b.label ? -1 : 1),
        );
        return chartData;
    },
);
