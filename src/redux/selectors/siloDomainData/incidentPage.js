import { createSelector } from 'reselect';

import { hazardTypesSelector } from './common';
import { incidentIdFromRouteSelector } from '../route';

const emptyObject = {};
const emptyArray = [];
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
    hazardTypesSelector,
    ({ incidentList }, hazardTypes) => {
        if (!incidentList) {
            return emptyArray;
        }

        return incidentList.map((incident) => {
            // FIXME: potential problem
            const { hazard: hazardId } = incident;
            const hazardInfo = hazardTypes[hazardId] || {};
            return { ...incident, hazardInfo };
        });
    },
);

export const incidentSelector = createSelector(
    incidentIdFromRouteSelector,
    incidentPageSelector,
    (id, { incidentList }) => {
        const incident = incidentList.find(
            i => String(i.id) === String(id),
        );

        return incident || emptyObject;
    },
);
