import { createSelector } from 'reselect';
import { isDefined, mapToList, listToMap } from '@togglecorp/fujs';

import { AppState } from '../../types';

const incidentIdSelector = (state: unknown, props: { incidentId?: number }) => props.incidentId;

const resourceTypesSelector = ({ page }: AppState) =>
    page.resourceTypes;

const dashboardPageSelector = ({ page }: AppState) =>
    page.dashboardPage;

const incidentPageSelector = ({ page }: AppState) =>
    page.incidentPage;

const responsePageSelector = ({ page }: AppState) => (
    page.responsePage
);

const realTimeMonitoringPageSelector = ({ page }: AppState) =>
    page.realTimeMonitoringPage;

// Popup

export const initialPopupShownSelector = ({ page }: AppState) => page.initialPopupShown;

// geo

export const regionSelector = ({ page }: AppState) => page.region;

export const regionLevelSelector = createSelector(
    regionSelector,
    region => region.adminLevel,
);

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

export const adminLevelListSelector = ({ page }: AppState) =>
    page.adminLevelList;

// common

export const hazardTypesSelector = ({ page }: AppState) =>
    page.hazardTypes;

export const hazardTypeListSelector = createSelector(
    hazardTypesSelector,
    hazardTypes => mapToList(hazardTypes, hazardType => hazardType),
);

export const resourceTypeListSelector = createSelector(
    resourceTypesSelector,
    resources => mapToList(resources),
);

// map styles

export const mapStylesSelector = ({ page }: AppState) =>
    page.mapStyles;

export const mapStyleSelector = ({ page }: AppState) =>
    page.selectedMapStyle;

// dashboardPage

export const filtersSelectorDP = createSelector(
    dashboardPageSelector,
    regionSelector,
    (dashboardPage, region) => {
        const { filters } = dashboardPage;
        return {
            ...filters,
            faramValues: {
                ...filters.faramValues,
                region,
            },
        };
    },
);

export const filtersValuesSelectorDP = createSelector(
    filtersSelectorDP,
    ({ faramValues }) => faramValues,
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

export const filtersSelectorIP = createSelector(
    incidentPageSelector,
    regionSelector,
    (incidentPage, region) => {
        const { filters } = incidentPage;
        return {
            ...filters,
            faramValues: {
                ...filters.faramValues,
                region,
            },
        };
    },
);

export const filtersValuesSelectorIP = createSelector(
    filtersSelectorIP,
    ({ faramValues }) => faramValues,
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

// response

export const resourceListSelectorRP = createSelector(
    responsePageSelector,
    ({ resourceList }) => resourceList,
);

// realtime monitoring

export const realTimeRainListSelector = createSelector(
    realTimeMonitoringPageSelector,
    ({ realTimeRainList }) => realTimeRainList,
);

export const realTimeRiverListSelector = createSelector(
    realTimeMonitoringPageSelector,
    ({ realTimeRiverList }) => realTimeRiverList,
);

export const realTimeEarthquakeListSelector = createSelector(
    realTimeMonitoringPageSelector,
    ({ realTimeEarthquakeList }) => realTimeEarthquakeList,
);

export const realTimeFiltersSelector = createSelector(
    realTimeMonitoringPageSelector,
    regionSelector,
    (realTimeMonitoringPage, region) => {
        const { filters } = realTimeMonitoringPage;
        return {
            ...filters,
            faramValues: {
                ...filters.faramValues,
                region,
            },
        };
    },
);

export const realTimeFiltersValuesSelector = createSelector(
    realTimeFiltersSelector,
    ({ faramValues }) => faramValues,
);

// loss and damage page
export const lossAndDamagePageSelector = ({ page }: AppState) =>
    page.lossAndDamagePage;

export const lossAndDamageFiltersSelector = createSelector(
    lossAndDamagePageSelector,
    regionSelector,
    (lossAndDamagePage, region) => {
        const { filters } = lossAndDamagePage;
        return {
            ...filters,
            faramValues: {
                ...filters.faramValues,
                region,
            },
        };
    },
);

export const lossAndDamageFilterValuesSelector = createSelector(
    lossAndDamageFiltersSelector,
    ({ faramValues }) => faramValues,
);

// bounds
export const selectedProvinceIdSelector = createSelector(
    regionSelector,
    (region) => {
        const { adminLevel, geoarea } = region;
        if (adminLevel !== 1) {
            return undefined;
        }
        return geoarea;
    },
);
export const selectedDistrictIdSelector = createSelector(
    regionSelector,
    (region) => {
        const { adminLevel, geoarea } = region;
        if (adminLevel !== 2) {
            return undefined;
        }
        return geoarea;
    },
);
export const selectedMunicipalityIdSelector = createSelector(
    regionSelector,
    (region) => {
        const { adminLevel, geoarea } = region;
        if (adminLevel !== 3) {
            return undefined;
        }
        return geoarea;
    },
);

const nepalBounds = [
    80.05858661752784, 26.347836996368667,
    88.20166918432409, 30.44702867091792,
];

export const boundsSelector = createSelector(
    regionSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    (region, provinces, districts, municipalities) => {
        const { adminLevel, geoarea } = region;
        const geoAreas = (
            (adminLevel === 1 && provinces) ||
            (adminLevel === 2 && districts) ||
            (adminLevel === 3 && municipalities)
        );
        if (!geoAreas) {
            return nepalBounds;
        }
        const geoArea = geoAreas.find(g => g.id === geoarea);
        if (!geoArea) {
            return nepalBounds;
        }
        return geoArea.bbox;
    },
);
