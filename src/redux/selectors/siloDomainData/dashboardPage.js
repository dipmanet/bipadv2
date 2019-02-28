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

export const hazardTypeListAlertsDP = createSelector(
    dashboardPageSelector,
    hazardTypesSelector,
    ({ alertList }, hazardTypes) => {
        if (!alertList) {
            return emptyArray;
        }

        const types = new Set();

        alertList.forEach((alert) => {
            const { hazard: hazardId } = alert;
            const hazard = hazardTypes[hazardId];
            if (hazard) {
                types.add(hazard);
            }
        });
        return [...types];
    },
);

export const alertListSelectorDP = createSelector(
    dashboardPageSelector,
    hazardTypesSelector,
    ({ alertList }, hazardTypes) => {
        if (!alertList) {
            return emptyArray;
        }

        return alertList.map((alert) => {
            // FIXME: potential problem
            const { hazard: hazardId } = alert;
            const hazardInfo = hazardTypes[hazardId] || {};
            return { ...alert, hazardInfo };
        });
    },
);
