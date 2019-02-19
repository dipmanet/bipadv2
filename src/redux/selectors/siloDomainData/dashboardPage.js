import { createSelector } from 'reselect';

const emptyObject = {};
const emptyArray = [];
const emptyFilter = {
    faramValues: {},
    faramErrors: {},
    pristine: true,
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
        { faramValues: { hazardType } } = emptyFilter,
        { alertList },
    ) => {
        if (!alertList) {
            return emptyArray;
        }
        if (!hazardType || hazardType.length <= 0) {
            return alertList;
        }

        return alertList.filter(
            alert => hazardType.includes(alert.hazard),
        );
    },
);
