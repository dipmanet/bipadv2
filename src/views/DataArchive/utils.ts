import * as PageType from '#store/atom/page/types';

type GroupKey = 'pTitle' | 'dTitle' | 'mTitle';

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
