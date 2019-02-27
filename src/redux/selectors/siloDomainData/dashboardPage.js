import { createSelector } from 'reselect';

import { hazardTypesSelector } from './common';

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

export const filtersValuesSelectorDP = createSelector(
    filtersSelectorDP,
    ({ faramValues }) => faramValues,
);

export const alertListSelectorDP = createSelector(
    dashboardPageSelector,
    hazardTypesSelector,
    (
        { alertList },
        hazardTypes,
    ) => {
        if (!alertList) {
            return emptyArray;
        }

        return alertList.map((alert) => {
            const { hazard: hazardId } = alert;
            const hazardInfo = hazardTypes[hazardId] || {};
            return { ...alert, hazardInfo };
        });
    },
);
