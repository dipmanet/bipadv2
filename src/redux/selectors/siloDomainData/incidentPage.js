import { createSelector } from 'reselect';
import { incidentIdFromRouteSelector } from '../route';

const emptyObject = {};
const emptyFilter = {
    faramValues: {},
    faramErrors: {},
    pristine: true,
};

const incidentPageSelector = ({ siloDomainData }) =>
    siloDomainData.incidentPage || emptyObject;

export const filtersSelectorIP = createSelector(
    incidentPageSelector,
    incidentPage => incidentPage.filters || emptyFilter,
);

export const filtersValuesSelectorIP = createSelector(
    filtersSelectorIP,
    ({ faramValues }) => faramValues,
);

export const incidentListSelectorIP = createSelector(
    incidentPageSelector,
    ({ incidentList }) => incidentList,
);

export const incidentSelector = createSelector(
    incidentIdFromRouteSelector,
    incidentPageSelector,
    (id, { incidentList }) => {
        const incident = incidentList.find(
            i => String(i.pk) === String(id),
        );

        return incident || emptyObject;
    },
);
