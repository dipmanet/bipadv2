import { createSelector } from 'reselect';

const emptyObject = {};
const emptyArray = [];
const emptyFilter = {
    faramValues: {},
    faramErrors: {},
    pristine: true,
};

// FIXME: this is repeated
const getDateFromRange = (range) => {
    let value;
    switch (range) {
        case 'past3Days':
            value = 3;
            break;
        case 'past7Days':
            value = 7;
            break;
        case 'past2Weeks':
            value = 14;
            break;
        case 'past1Month':
            value = 30;
            break;
        default:
            value = 0;
    }

    // const now = new Date();
    // NOTE: setting now to specific time
    const now = new Date(1550600100990);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setDate(now.getDate() - value);

    return now.getTime();
};

const dashboardPageSelector = ({ siloDomainData }) =>
    siloDomainData.dashboardPage || emptyObject;

export const filtersSelectorDP = createSelector(
    dashboardPageSelector,
    dashboardPage => dashboardPage.filters || emptyFilter,
);

export const alertListSelectorDP = createSelector(
    filtersSelectorDP,
    dashboardPageSelector,
    // TODO: Remove this filter later
    (
        { faramValues } = emptyFilter,
        { alertList },
    ) => {
        const { hazardType, dateRange } = faramValues;
        if (!alertList) {
            return emptyArray;
        }

        let returnList = alertList;
        if (hazardType && hazardType.length > 0) {
            returnList = returnList.filter(
                alert => hazardType.includes(alert.hazard),
            );
        }

        if (dateRange) {
            const date = getDateFromRange(dateRange);
            returnList = returnList.filter(
                alert => alert.alertOn > date,
            );
        }

        return returnList;
    },
);
