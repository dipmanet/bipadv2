const addDaysToDate = (date: Date, days: number) => {
    const newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

const pastDaysToDateRange = (pastDays: number) => {
    const today = new Date();
    const lastDate = addDaysToDate(today, -pastDays);
    return {
        startDate: lastDate,
        endDate: today,
    };
};

interface Filters {
    dateRange?: number;
}

// eslint-disable-next-line import/prefer-default-export, arrow-parens
export const transformDateRangeFilterParam = <T extends Filters>(
    filters: T,
    destParamName: string,
) => {
    /* Transforms object with dateRange key to {
     * <destParamName>__lt: <iso>
     * <destParamName>__gt: <iso>
     * }
     */
    const { dateRange, ...other } = filters;
    if (dateRange) {
        const { startDate, endDate } = pastDaysToDateRange(dateRange);
        return {
            ...other,
            [`${destParamName}__lt`]: endDate.toISOString(),
            [`${destParamName}__gt`]: startDate.toISOString(),
        };
    }
    return filters;
};
