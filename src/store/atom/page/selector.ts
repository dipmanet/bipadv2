import { createSelector } from 'reselect';
import { isDefined, mapToList, listToMap } from '@togglecorp/fujs';

import { AppState } from '../../types';
// import { incidentIdFromRouteSelector } from '../route/selector';

const incidentIdSelector = (state: unknown, props: { incidentId?: number }) => props.incidentId;

export const eventTypesSelector = ({ page }: AppState) =>
    page.eventTypes;
export const hazardTypesSelector = ({ page }: AppState) =>
    page.hazardTypes;

export const hazardTypeListSelector = createSelector(
    hazardTypesSelector,
    hazardTypes => mapToList(hazardTypes, hazardType => hazardType),
);

// NOTE: removed
export const resourceTypesSelector = ({ page }: AppState) =>
    page.resourceTypes;

export const adminLevelListSelector = ({ page }: AppState) =>
    page.adminLevelList;

export const districtsSelector = ({ page }: AppState) =>
    page.districts;

export const provincesSelector = ({ page }: AppState) =>
    page.provinces;

export const municipalitiesSelector = ({ page }: AppState) =>
    page.municipalities;

export const wardsSelector = ({ page }: AppState) =>
    page.wards;

export const wardsMapSelector = createSelector(
    wardsSelector,
    wards => listToMap(wards, elem => elem.id),
);

export const resourceTypeListSelector = createSelector(
    resourceTypesSelector,
    resources => mapToList(resources),
);

export const mapStylesSelector = ({ page }: AppState) =>
    page.mapStyles;

export const mapStyleSelector = ({ page }: AppState) =>
    page.selectedMapStyle;

// dashboardPage

export const dashboardPageSelector = ({ page }: AppState) =>
    page.dashboardPage;

export const filtersSelectorDP = createSelector(
    dashboardPageSelector,
    dashboardPage => dashboardPage.filters,
);

export const filtersValuesSelectorDP = createSelector(
    filtersSelectorDP,
    ({ faramValues }) => faramValues,
);

export const hazardTypeListAlertsDP = createSelector(
    dashboardPageSelector,
    hazardTypesSelector,
    ({ alertList }, hazardTypes) => {
        const counts: {[ key: number]: number } = {};

        alertList.forEach((alert) => {
            const { hazard: hazardId } = alert;
            const hazard = hazardTypes[hazardId];
            if (hazard) {
                const count = counts[hazardId];
                counts[hazardId] = isDefined(count) ? count + 1 : 1;
            }
        });

        const list = mapToList(hazardTypes);

        return list.sort((a, b) => (
            (isDefined(counts[b.id]) ? counts[b.id] : 0)
                - (isDefined(counts[a.id]) ? counts[a.id] : 0)
        ));
    },
);

export const alertListSelectorDP = createSelector(
    dashboardPageSelector,
    hazardTypesSelector,
    ({ alertList }, hazardTypes) => alertList.map((alert) => {
        // FIXME: potential problem
        const { hazard: hazardId } = alert;
        const hazardInfo = hazardTypes[hazardId] || {};
        return { ...alert, hazardInfo };
    }),
);

// incidentPage

const incidentPageSelector = ({ page }: AppState) =>
    page.incidentPage;

export const filtersSelectorIP = createSelector(
    incidentPageSelector,
    incidentPage => incidentPage.filters,
);

export const filtersValuesSelectorIP = createSelector(
    filtersSelectorIP,
    ({ faramValues }) => faramValues,
);

export const hazardTypeListIncidentsIP = createSelector(
    incidentPageSelector,
    hazardTypesSelector,
    ({ incidentList }, hazardTypes) => {
        const counts: {[ key: number]: number } = {};

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
    ({ incidentList }, hazardTypes) => incidentList.map((incident) => {
        // FIXME: potential problem
        const { hazard: hazardId } = incident;
        const hazardInfo = hazardTypes[hazardId] || {};
        return { ...incident, hazardInfo };
    }),
);

export const incidentSelector = createSelector(
    incidentIdSelector,
    incidentPageSelector,
    (id, { incidentList }) => {
        const incident = incidentList.find(
            i => String(i.id) === String(id),
        );

        return incident;
    },
);

// responsePage

const responsePageSelector = ({ page }: AppState) =>
    page.responsePage;

export const resourceListSelectorRP = createSelector(
    responsePageSelector,
    ({ resourceList }) => resourceList,
);

export const dummyRP = '';


// real time monitoring page

const realTimeMonitoringPageSelector = ({ page }: AppState) =>
    page.realTimeMonitoringPage;

export const realTimeRainListSelector = createSelector(
    realTimeMonitoringPageSelector,
    ({ realTimeRainList }) => realTimeRainList,
);
