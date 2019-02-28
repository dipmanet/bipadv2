import { pastDaysToDateRange } from './common';

// eslint-disable-next-line import/prefer-default-export
export const transformDateRangeFilterParam = (filters, destParamName) => {
    /* Transforms object with dateRange key to {
     * <destParamName>__lt: <iso>
     * <destParamName>__gt: <iso>
     * }
     */
    const { dateRange, ...other } = filters;
    if (dateRange) {
        const { startDate, endDate } = pastDaysToDateRange(dateRange);
        return {
            [`${destParamName}__lt`]: endDate ? endDate.toISOString() : undefined,
            [`${destParamName}__gt`]: startDate ? startDate.toISOString() : undefined,
            ...other,
        };
    }
    return filters;
};
