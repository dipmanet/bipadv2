import { createSelector } from 'reselect';
import {
    mapToList,
    listToMap,
    doesObjectHaveNoData,
} from '@togglecorp/fujs';
import { KeyLabel, KeyValue } from '#types';

import { getAttributeOptions } from '#utils/domain';

import { AppState } from '../../types';
import { Region, Status } from './types';

const emptyList: unknown[] = [];

const dashboardPageSelector = ({ page }: AppState) => page.dashboardPage;

const incidentPageSelector = ({ page }: AppState) => page.incidentPage;

const responsePageSelector = ({ page }: AppState) => page.responsePage;

const realTimeMonitoringPageSelector = ({ page }: AppState) => page.realTimeMonitoringPage;

const incidentIdSelector = (state: unknown, props: { incidentId?: number }) => props.incidentId;

const regionByPropSelector = (state: unknown, props: { region?: Region }) => props.region;

export const resourceTypeListSelector = ({ page }: AppState) => (
    page.resourceTypeList || emptyList
);

export const filtersSelector = ({ page }: AppState) => page.filters;

// Popup

export const hidePopupSelector = ({ page }: AppState) => page.hidePopup;

// geo

export const regionSelector = createSelector(
    filtersSelector,
    filters => filters.region,
);

export const regionLevelSelector = createSelector(
    regionByPropSelector,
    regionSelector,
    (regionFromProps, region) => (regionFromProps || region).adminLevel,
);

const getId = (val: { id: number }) => val.id;


export const showProvinceSelector = (state: AppState, props: { region?: Region }) => {
    const { page } = state;
    const region = regionByPropSelector(state, props);
    if (region) {
        return undefined;
    }
    return page.showProvince;
};
export const showDistrictSelector = (state: AppState, props: { region?: Region }) => {
    const { page } = state;
    const region = regionByPropSelector(state, props);
    if (region) {
        return undefined;
    }
    return page.showDistrict;
};
export const showMunicipalitySelector = (state: AppState, props: { region?: Region }) => {
    const { page } = state;
    const region = regionByPropSelector(state, props);
    if (region) {
        return undefined;
    }
    return page.showMunicipality;
};
export const showWardSelector = (state: AppState, props: { region?: Region }) => {
    const { page } = state;
    const region = regionByPropSelector(state, props);
    if (region) {
        return undefined;
    }
    return page.showWard;
};

export const provincesSelector = ({ page }: AppState) => page.provinces || emptyList;

export const provincesMapSelector = createSelector(
    provincesSelector,
    provinces => listToMap(provinces, getId),
);

export const districtsSelector = ({ page }: AppState) => page.districts || emptyList;

export const districtsMapSelector = createSelector(
    districtsSelector,
    districts => listToMap(districts, getId),
);

const municipalitiesRawSelector = ({ page }: AppState) => page.municipalities || emptyList;

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

const wardsRawSelector = ({ page }: AppState) => page.wards || emptyList;

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

export const regionNameSelector = createSelector(
    regionSelector,
    provincesMapSelector,
    districtsMapSelector,
    municipalitiesMapSelector,
    (region, provinces, districts, municipalities) => {
        if (doesObjectHaveNoData(region)) {
            return 'Nepal';
        }
        const { adminLevel, geoarea } = region;
        if (adminLevel === 1 && geoarea) {
            return provinces[geoarea].title;
        }
        if (adminLevel === 2 && geoarea) {
            const district = districts[geoarea];
            const province = provinces[district.province];
            return `${district.title}, ${province.title}`;
        }
        if (adminLevel === 3 && geoarea) {
            const municipality = municipalities[geoarea];
            const district = districts[municipality.district];
            const province = provinces[district.province];
            return `${municipality.title}, ${district.title}, ${province.title}`;
        }

        return '';
    },
);

export const adminLevelListSelector = ({ page }: AppState) => page.adminLevelList;

// common

export const hazardTypesSelector = ({ page }: AppState) => page.hazardTypes;

export const hazardTypeListSelector = createSelector(
    hazardTypesSelector,
    hazardTypes => mapToList(hazardTypes, hazardType => hazardType),
);

export const enumOptionsSelector = ({ page }: AppState) => page.enumList;

// map styles

// export const mapStylesSelector = ({ page }: AppState) => page.mapStyles;

export const mapStyleSelector = ({ page }: AppState) => page.selectedMapStyle;

export const lossListSelector = ({ page }: AppState) => page.lossList;

export const sourceListSelector = ({ page }: AppState) => page.sourceList;
export const sourcesSelector = ({ page }: AppState) => (
    listToMap(page.sourceList, d => d.id, d => d.title)
);

export const severityListSelector = createSelector(
    enumOptionsSelector,
    (enumList) => {
        const eventEnum = enumList.find(v => v.model === 'Event');
        let severityList: KeyLabel[] = [];
        if (eventEnum && eventEnum.enums) {
            severityList = getAttributeOptions(eventEnum.enums, 'severity');
        }
        return severityList;
    },
);

export const sourceOptionsSelector = createSelector(
    enumOptionsSelector,
    (enumList) => {
        const alertEnum = enumList.find(v => v.model === 'Alert');
        let sourceOptions: KeyLabel[] = [];
        if (alertEnum && alertEnum.enums) {
            sourceOptions = getAttributeOptions(alertEnum.enums, 'source');
        }
        return sourceOptions;
    },
);

export const documentCategoryListSelector = ({ page }: AppState) => page.documentCategoryList;

export const genderListSelector = createSelector(
    enumOptionsSelector,
    (enumList) => {
        const peopleEnum = enumList.find(v => v.model === 'People');
        let genderOptions: Status[] = [];
        if (peopleEnum && peopleEnum.enums) {
            genderOptions = getAttributeOptions(peopleEnum.enums, 'gender')
                .map(({ label }, index) => ({ id: index, title: label }));
        }
        return genderOptions;
    },
);

export const peopleLossStatusListSelector = createSelector(
    enumOptionsSelector,
    (enumList) => {
        const peopleEnum = enumList.find(v => v.model === 'People');
        let peopleLossStatusList: Status[] = [];
        if (peopleEnum && peopleEnum.enums) {
            peopleLossStatusList = getAttributeOptions(peopleEnum.enums, 'status')
                .map(({ label }, index) => ({ id: index, title: label }));
        }
        return peopleLossStatusList;
    },
);

export const agricultureLossStatusListSelector = createSelector(
    enumOptionsSelector,
    (enumList) => {
        const agricultureEnum = enumList.find(v => v.model === 'Agriculture');
        let agricultureLossStatusList: Status[] = [];
        if (agricultureEnum && agricultureEnum.enums) {
            agricultureLossStatusList = getAttributeOptions(agricultureEnum.enums, 'status')
                .map(({ label }, index) => ({ id: index, title: label }));
        }
        return agricultureLossStatusList;
    },
);

export const agricultureLossTypeListSelector = (
    { page }: AppState,
) => page.agricultureLossTypeList;

export const countryListSelector = ({ page }: AppState) => page.countryList;

export const hazardFilterSelector = createSelector(
    filtersSelector,
    filters => filters.hazard,
);

export const regionFilterSelector = createSelector(
    filtersSelector,
    filters => filters.region,
);

export const dataDateRangeFilterSelector = createSelector(
    filtersSelector,
    filters => filters.dataDateRange,
);

export const dashboardFiltersSelector = filtersSelector;
export const incidentFiltersSelector = filtersSelector;
export const lossAndDamageFiltersSelector = filtersSelector;


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
    ({ resourceList }) => [...resourceList].sort(),
);


export const inventoryCategoryListSelectorRP = createSelector(
    responsePageSelector,
    ({ inventoryCategoryList }) => inventoryCategoryList,
);

export const inventoryItemListSelectorRP = createSelector(
    responsePageSelector,
    ({ inventoryItemList }) => inventoryItemList,
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

export const otherSourceListSelector = createSelector(
    realTimeMonitoringPageSelector,
    ({ otherSourceList }) => otherSourceList,
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
export const lossAndDamagePageSelector = ({ page }: AppState) => page.lossAndDamagePage;

export const lossAndDamageFiltersSelectorOld = createSelector(
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


export const lossAndDamageListSelector = createSelector(
    lossAndDamagePageSelector,
    (lossAndDamagePage) => {
        const { lossAndDamageList } = lossAndDamagePage;

        return lossAndDamageList || emptyList;
    },
);

export const lossAndDamageFilterValuesSelector = createSelector(
    lossAndDamageFiltersSelector,
    ({ faramValues }) => faramValues,
);

// profile contact page

export const profileContactPageSelector = ({ page }: AppState) => page.profileContactPage;

export const profileContactFiltersSelector = createSelector(
    profileContactPageSelector,
    regionSelector,
    (profileContactPage, region) => {
        const { filters } = profileContactPage;
        return {
            ...filters,
            faramValues: {
                ...filters.faramValues,
                region,
            },
        };
    },
);


// projects profile page
export const projectsProfilePageSelector = ({ page }: AppState) => page.projectsProfilePage;

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
export const disasterProfilePageSelector = ({ page }: AppState) => page.disasterProfilePage;

export const riskListSelector = createSelector(
    disasterProfilePageSelector,
    ({ riskList }) => riskList,
);

export const lpGasCookListSelector = createSelector(
    disasterProfilePageSelector,
    ({ lpGasCookList }) => lpGasCookList,
);

export const profileContactListSelector = createSelector(
    profileContactPageSelector,
    ({ contactList }) => contactList,
);

// risk info page
export const carKeysSelector = ({ page }: AppState) => page.carKeys;

// palika report
export const generalDataSelector = ({ page }: AppState) => page.generalData;
export const budgetDataSelector = ({ page }: AppState) => page.budgetData;
export const budgetActivityDataSelector = ({ page }: AppState) => page.budgetActivityData;
export const programAndPolicySelector = ({ page }: AppState) => page.programAndPolicyData;

// bounds
export const selectedProvinceIdSelector = createSelector(
    regionByPropSelector,
    regionSelector,
    (regionFromProps, region) => {
        const { adminLevel, geoarea } = regionFromProps || region;
        if (adminLevel !== 1) {
            return undefined;
        }
        return geoarea;
    },
);
export const selectedDistrictIdSelector = createSelector(
    regionByPropSelector,
    regionSelector,
    (regionFromProps, region) => {
        const { adminLevel, geoarea } = regionFromProps || region;
        if (adminLevel !== 2) {
            return undefined;
        }
        return geoarea;
    },
);
export const selectedMunicipalityIdSelector = createSelector(
    regionByPropSelector,
    regionSelector,
    (regionFromProps, region) => {
        const { adminLevel, geoarea } = regionFromProps || region;
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
    regionByPropSelector,
    regionSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    (regionFromProps, region, provinces, districts, municipalities) => {
        const { adminLevel, geoarea } = regionFromProps || region;
        const geoAreas = (
            (adminLevel === 1 && provinces)
            || (adminLevel === 2 && districts)
            || (adminLevel === 3 && municipalities)
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
