import { createSelector } from 'reselect';
import { isDefined, mapToList } from '@togglecorp/fujs';

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

export const hazardTypeListIncidentsIP = createSelector(
    incidentPageSelector,
    hazardTypesSelector,
    ({ incidentList }, hazardTypes) => {
        if (!incidentList) {
            return emptyArray;
        }

        const counts = {};

        incidentList.forEach((incident) => {
            const { hazard: hazardId } = incident;
            const hazard = hazardTypes[hazardId];
            if (hazard) {
                const count = counts[hazardId];
                counts[hazardId] = isDefined(count) ? count + 1 : 1;
            }
        });

        return mapToList(hazardTypes).sort((a, b) => (
            (isDefined(counts[b.id]) ? counts[b.id] : 0)
            - (isDefined(counts[a.id]) ? counts[a.id] : 0)
        ));
    },
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
