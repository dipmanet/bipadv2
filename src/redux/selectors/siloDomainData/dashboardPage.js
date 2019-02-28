import { createSelector } from 'reselect';
import { isDefined, mapToList } from '@togglecorp/fujs';

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

        const counts = {};

        alertList.forEach((alert) => {
            const { hazard: hazardId } = alert;
            const hazard = hazardTypes[hazardId];
            if (hazard) {
                const count = counts[hazardId];
                counts[hazardId] = isDefined(count) ? count + 1 : 1;
            }
        });
        console.warn(counts);

        const list = mapToList(hazardTypes);
        console.warn(list);

        return list.sort((a, b) => (
            (isDefined(counts[b.id]) ? counts[b.id] : 0)
            - (isDefined(counts[a.id]) ? counts[a.id] : 0)
        ));
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
