import { Obj } from '@togglecorp/fujs';
import { FiltersWithRegion } from '#store/atom/page/types';


const addDaysToDate = (date: Date, days: number) => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const pastDaysToDateRange = (pastDays: number) => {
    const today = new Date();
    const lastDate = addDaysToDate(today, -pastDays);
    return {
        startDate: lastDate,
        endDate: today,
    };
};

// eslint-disable-next-line import/prefer-default-export, arrow-parens
export const transformDateRangeFilterParam = (
    filters: FiltersWithRegion['faramValues'],
    destParamName: string,
): Obj<string | number | undefined> => {
    const {
        dateRange,
        region,
        realtimeSources,
        ...other
    } = filters;
    let outputFilters = { ...other };
    if (region && region.adminLevel && region.geoarea) {
        const label = (
            (region.adminLevel === 1 && 'province')
            || (region.adminLevel === 2 && 'district')
            || (region.adminLevel === 3 && 'municipality')
            || undefined
        );
        if (label) {
            outputFilters = {
                ...outputFilters,
                [label]: region.geoarea,
            };
        }
    }
    if (dateRange) {
        /* Transforms object with dateRange key to {
         * <destParamName>__lt: <iso>
         * <destParamName>__gt: <iso>
         * }
         */
        const { startDate, endDate } = pastDaysToDateRange(dateRange);
        outputFilters = {
            ...outputFilters,
            [`${destParamName}__lt`]: endDate.toISOString(),
            [`${destParamName}__gt`]: startDate.toISOString(),
        };
    }
    return outputFilters;
};
