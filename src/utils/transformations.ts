import { Obj } from '@togglecorp/fujs';
import memoize from 'memoize-one';
import { ADToBS } from 'bikram-sambat-js';
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

export const pastDaysToDateRange = (pastDays: number, language) => {
    const today = new Date();
    const lastDate = addDaysToDate(today, -pastDays);
    const todayNepali = ADToBS(today);
    const lastDateNepali = ADToBS(lastDate);
    const todayDateCheck = language === 'np' ? todayNepali : today;
    const lastDateCheck = language === 'np' ? lastDateNepali : lastDate;
    return {
        startDate: lastDateCheck,
        endDate: todayDateCheck,
    };
};

// FIXME: obsolete
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
        const { startDate, endDate } = pastDaysToDateRange(dateRange, '');
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
    const { rangeInDays } = dataRange;

    const getFilter = (startDate?: Date, endDate?: Date) => ({
        // eslint-disable-next-line @typescript-eslint/camelcase
        [`${dateParamName}__gt`]: startDate ? startDate.toISOString() : undefined,
        // eslint-disable-next-line @typescript-eslint/camelcase
        [`${dateParamName}__lt`]: endDate ? endDate.toISOString() : undefined,
    });

    if (rangeInDays !== 'custom') {
        const { startDate, endDate } = pastDaysToDateRange(rangeInDays, '');
        return getFilter(startDate, endDate);
    }

    const { startDate, endDate } = dataRange;
    return getFilter(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
    );
};

export const transformDataRangeLocaleToFilter = (
    dataRange: DataDateRangeValueElement,
    dateParamName: string,
) => {
    const { rangeInDays } = dataRange;

    const getFilter = (startDate?: Date, endDate?: Date) => ({
        // eslint-disable-next-line @typescript-eslint/camelcase
        [`${dateParamName}__gt`]: startDate ? `${startDate.toISOString().split('T')[0]}T00:00:00+05:45` : undefined,
        // eslint-disable-next-line @typescript-eslint/camelcase
        [`${dateParamName}__lt`]: endDate ? `${endDate.toISOString().split('T')[0]}T23:59:59+05:45` : undefined,
    });

    const formatDate = (date: Date) => {
        const currentDate = date.toLocaleDateString('en-GB').split('/');
        const day = currentDate[0];
        const month = currentDate[1];
        const year = currentDate[2];
        return `${year}-${month}-${day}`;
    };

    const getNonCustomFilter = (startDate?: string, endDate?: string) => ({
        // eslint-disable-next-line @typescript-eslint/camelcase
        [`${dateParamName}__gt`]: startDate ? `${startDate}T00:00:00+05:45` : undefined,
        // eslint-disable-next-line @typescript-eslint/camelcase
        [`${dateParamName}__lt`]: endDate ? `${endDate}T23:59:59+05:45` : undefined,
    });

    if (rangeInDays !== 'custom') {
        const { startDate, endDate } = pastDaysToDateRange(rangeInDays, '');
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        return getNonCustomFilter(formattedStartDate, formattedEndDate);
        // return getFilter(startDate, endDate);
    }

    const { startDate, endDate } = dataRange;

    return getFilter(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
    );
};

export const transformRegion = (region: {
    adminLevel?: number;
    geoarea?: number;
}) => {
    const { adminLevel, geoarea } = region;

    if (adminLevel === 1) {
        return { province: geoarea };
    }
    if (adminLevel === 2) {
        return { district: geoarea };
    }
    if (adminLevel === 3) {
        return { municipality: geoarea };
    }
    return {};
};

export const transformMagnitude = (magnitude: number[]): {
    magnitude__gt: number | undefined;
    magnitude__lt: number | undefined;
} => {
    const defaultMagnitude = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        magnitude__gt: undefined,
        // eslint-disable-next-line @typescript-eslint/camelcase
        magnitude__lt: undefined,
    };
    const MAX_MAG = 8;
    if (magnitude.length === 0) {
        return defaultMagnitude;
    }

    const min = Math.min(...magnitude);
    const max = Math.max(...magnitude);

    if (max >= MAX_MAG) {
        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            magnitude__gt: min,
            // eslint-disable-next-line @typescript-eslint/camelcase
            magnitude__lt: undefined,
        };
    }
    return {
        // eslint-disable-next-line @typescript-eslint/camelcase
        magnitude__lt: max + 0.9,
        // eslint-disable-next-line @typescript-eslint/camelcase
        magnitude__gt: min,
    };
};
