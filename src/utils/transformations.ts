import { Obj } from '@togglecorp/fujs';
import memoize from 'memoize-one';
import { FiltersWithRegion } from '#store/atom/page/types';
import {
    RegionAdminLevel,
    RegionAdminLevelType,
    RegionValueElement,
    DataDateRangeValueElement,
} from '#types';


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

const regionLevelToNameMap: {
    [key in RegionAdminLevel]: RegionAdminLevelType;
} = {
    1: 'province',
    2: 'district',
    3: 'municipality',
};

export const transformRegionToFilter = (region: RegionValueElement) => {
    if (!region || !region.adminLevel || !region.geoarea) {
        return {};
    }

    const label = regionLevelToNameMap[region.adminLevel];
    if (label) {
        return {
            [label]: region.geoarea,
        };
    }

    return {};
};

export const transformDataRangeToFilter = (
    dataRange: DataDateRangeValueElement,
    dateParamName: string,
) => {
    const {
        startDate,
        endDate,
    } = dataRange;

    return {
        // eslint-disable-next-line @typescript-eslint/camelcase
        [`${dateParamName}__gt`]: startDate ? (new Date(startDate)).toISOString() : undefined,

        // eslint-disable-next-line @typescript-eslint/camelcase
        [`${dateParamName}__lt`]: endDate ? (new Date(endDate)).toISOString() : undefined,
    };
};
