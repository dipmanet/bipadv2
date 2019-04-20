import { createSelector } from 'reselect';
import { mapToList, listToMap } from '@togglecorp/fujs';

import { AppState } from '../../types';

const emptyList: unknown[] = [];

const dashboardPageSelector = ({ page }: AppState) =>
    page.dashboardPage;

const incidentPageSelector = ({ page }: AppState) =>
    page.incidentPage;

const responsePageSelector = ({ page }: AppState) => (
    page.responsePage
);

const realTimeMonitoringPageSelector = ({ page }: AppState) =>
    page.realTimeMonitoringPage;

const incidentIdSelector = (state: unknown, props: { incidentId?: number }) => props.incidentId;

const resourceTypesSelector = ({ page }: AppState) => (
    page.resourceTypes || emptyList
);

// Popup

export const initialPopupShownSelector = ({ page }: AppState) => page.initialPopupShown;

// geo

export const regionSelector = ({ page }: AppState) => page.region;

export const regionLevelSelector = createSelector(
    regionSelector,
    region => region.adminLevel,
);

const getId = (val: { id: number }) => val.id;

export const provincesSelector = ({ page }: AppState) =>
    page.provinces || emptyList;

export const provincesMapSelector = createSelector(
    provincesSelector,
    provinces => listToMap(provinces, getId),
);

export const districtsSelector = ({ page }: AppState) =>
    page.districts || emptyList;

export const districtsMapSelector = createSelector(
    districtsSelector,
    districts => listToMap(districts, getId),
);

const municipalitiesRawSelector = ({ page }: AppState) =>
    page.municipalities || emptyList;

export const municipalitiesSelector = createSelector(
    municipalitiesRawSelector,
    districtsMapSelector,
    (municipalities, districts) => (
        municipalities.map((m) => {
            const district = districts[m.district];
            if (!district) {
                return m;
            }
            return { ...m, province: district.province };
        })
    ),
);

export const municipalitiesMapSelector = createSelector(
    municipalitiesSelector,
    municipalities => listToMap(municipalities, getId),
);

const wardsRawSelector = ({ page }: AppState) =>
    page.wards || emptyList;

export const wardsSelector = createSelector(
    wardsRawSelector,
    municipalitiesMapSelector,
    (wards, municipalities) => (
        wards.map((w) => {
            const municipality = municipalities[w.municipality];
            if (!municipality) {
                return w;
            }
            return { ...w, province: municipality.province, district: municipality.district };
        })
    ),
);

export const wardsMapSelector = createSelector(
    wardsSelector,
    wards => listToMap(wards, getId),
);

export const regionsSelector = createSelector(
    provincesMapSelector,
    districtsMapSelector,
    municipalitiesMapSelector,
    wardsMapSelector,
    (provinces, districts, municipalities, wards) => ({
        provinces,
        districts,
        municipalities,
        wards,
    }),
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

export const eventListSelector = createSelector(
    dashboardPageSelector,
    ({ eventList }) => eventList,
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


export const inventoryCategoryListSelectorRP = createSelector(
    responsePageSelector,
    ({ inventoryCategoryList }) => inventoryCategoryList,
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

export const realTimeFireListSelector = createSelector(
    realTimeMonitoringPageSelector,
    ({ realTimeFireList }) => realTimeFireList,
);

export const realTimePollutionListSelector = createSelector(
    realTimeMonitoringPageSelector,
    ({ realTimePollutionList }) => realTimePollutionList,
);

export const realTimeSourceListSelector = createSelector(
    realTimeMonitoringPageSelector,
    ({ realTimeSourceList }) => realTimeSourceList,
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

// projects profile page
export const projectsProfilePageSelector = ({ page }: AppState) =>
    page.projectsProfilePage;

export const projectsProfileFiltersSelector = createSelector(
    projectsProfilePageSelector,
    regionSelector,
    (projectsProfilePage, region) => {
        const { filters } = projectsProfilePage;
        return {
            ...filters,
            faramValues: {
                ...filters.faramValues,
                region,
            },
        };
    },
);

// diaster profile page
export const disasterProfilePageSelector = ({ page }: AppState) =>
    page.disasterProfilePage;

export const riskListSelector = createSelector(
    disasterProfilePageSelector,
    ({ riskList }) => riskList,
);

export const lpGasCookListSelector = createSelector(
    disasterProfilePageSelector,
    ({ lpGasCookList }) => lpGasCookList,
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
