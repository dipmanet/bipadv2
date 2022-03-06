import produce from 'immer';
import { listToMap } from '@togglecorp/fujs';

import * as Type from './types';
import initialState from './initialState';

import { ModelEnum } from '#types';

// ACTION CREATORS
export const setLanguageAction = language => ({
    type: Type.PageType.SET_LANGUAGE,
    language,
});

export const setBulletinYearlyDataAction = bulletinData => ({
    type: Type.PageType.ADMIN__PORTAL_BULLETIN_YEARLYDATA,
    bulletinData,
});
// IBF
export const setIbfPageAction = ibfPage => ({
    type: Type.PageType.SET_IBF_PAGE,
    ibfPage,
});
export const setBulletinLossAction = bulletinData => ({
    type: Type.PageType.ADMIN__PORTAL_BULLETIN,
    bulletinData,
});
export const setBulletinCovidAction = bulletinData => ({
    type: Type.PageType.ADMIN__PORTAL_BULLETIN_COVID,
    bulletinData,
});
export const setBulletinFeedbackAction = bulletinData => ({
    type: Type.PageType.ADMIN__PORTAL_BULLETIN_FEEDBACK,
    bulletinData,
});
export const setBulletinTemperatureAction = bulletinData => ({
    type: Type.PageType.ADMIN__PORTAL_BULLETIN_TEMPERATURE,
    bulletinData,
});
export const setBulletinEditDataAction = bulletinEditData => ({
    type: Type.PageType.ADMIN__PORTAL_BULLETIN_EDIT_DATA,
    bulletinEditData,
});

// bulletin actions end
// Epidemics
export const SetEpidemicsPageAction = epidemicsPage => ({
    type: Type.PageType.SET_EPIDEMICS_PAGE,
    epidemicsPage,
});

export const setRegionAction = (
    { region }: { region: Type.Region },
) => ({
    type: Type.PageType.SET_REGION,
    region,
});

export const setDrrmProgressAction = drrmProgress => ({
    type: Type.PageType.SET_DRRM_PROGRESS,
    drrmProgress,
});

export const setDrrmOrgAction = drrmOrg => ({
    type: Type.PageType.SET_DRRM_ORG,
    drrmOrg,
});

export const setDrrmRegionAction = drrmRegion => ({
    type: Type.PageType.SET_DRRM_REGION,
    drrmRegion,
});

export const setDrrmCriticalAction = drrmCritical => ({
    type: Type.PageType.SET_DRRM_CRITICAL,
    drrmCritical,
});

export const setDrrmContactsAction = drrmContacts => ({
    type: Type.PageType.SET_DRRM_CONTACTS,
    drrmContacts,
});

export const setDrrmInventoryAction = drrmInventory => ({
    type: Type.PageType.SET_DRRM_INVENTORY,
    drrmInventory,
});

export const setPalikaLanguageAction = palikaLanguage => ({
    type: Type.PageType.SET_PALIKA_LANGUAGE,
    palikaLanguage,
});

export const setGeneralDataAction = generalData => ({
    type: Type.PageType.SET_GENERAL_DATA,
    generalData,
});

export const setPalikaRedirectAction = palikaRedirect => ({
    type: Type.PageType.SET_PALIKA_REDIRECT,
    palikaRedirect,
});

export const setBudgetIdAction = budgetId => ({
    type: Type.PageType.SET_BUDGET_ID,
    budgetId,
});

export const setBudgetDataAction = budgetData => ({
    type: Type.PageType.SET_BUDGET_DATA,
    budgetData,
});

export const setBudgetActivityDataAction = budgetActivityData => ({
    type: Type.PageType.SET_BUDGET_ACTIVITY_DATA,
    budgetActivityData,
});


export const setProgramAndPolicyDataAction = programAndPolicyData => ({
    type: Type.PageType.SET_PROGRAM_AND_POLICY_DATA,
    programAndPolicyData,
});

export const setInitialPopupHiddenAction = (
    { value }: { value: boolean },
) => ({
    type: Type.PageType.SET_INITIAL_POPUP_HIDDEN,
    value,
});

export const setHazardTypesAction = (
    { hazardTypes }: { hazardTypes: Type.HazardType[] },
) => ({
    type: Type.PageType.SET_HAZARD_TYPES,
    hazardTypes,
});

export const setDashboardHazardTypesAction = (
    { hazardTypes }: { hazardTypes: Type.HazardType[] },
) => ({
    type: Type.PageType.SET_DASHBOARD_HAZARD_TYPES,
    hazardTypes,
});

export const setEnumOptionsAction = (
    { enumList }: { enumList: ModelEnum[] },
) => ({
    type: Type.PageType.SET_ENUM_OPTIONS,
    enumList,
});

export const setEventTypesAction = (
    { eventTypes }: { eventTypes: Type.EventType[] },
) => ({
    type: Type.PageType.SET_EVENT_TYPES,
    eventTypes,
});

export const setMapStylesAction = (
    mapStyles: Type.MapStyle[],
) => ({
    type: Type.PageType.SET_MAP_STYLES,
    mapStyles,
});
export const setMapStyleAction = (
    mapStyle: string,
) => ({
    type: Type.PageType.SET_MAP_STYLE,
    mapStyle,
});

export const setProvincesAction = (
    { provinces }: { provinces: Type.Province[] },
) => ({
    type: Type.PageType.SET_PROVINCES,
    provinces,
});

export const setDistrictsAction = (
    { districts }: { districts: Type.District[] },
) => ({
    type: Type.PageType.SET_DISTRICTS,
    districts,
});

export const setMunicipalitiesAction = (
    { municipalities }: { municipalities: Type.Municipality[] },
) => ({
    type: Type.PageType.SET_MUNICIPALITIES,
    municipalities,
});

export const setWardsAction = (
    { wards }: { wards: Type.Ward[] },
) => ({
    type: Type.PageType.SET_WARDS,
    wards,
});


export const setShowProvinceAction = (
    { value }: {value: boolean },
) => ({
    type: Type.PageType.SET_SHOW_PROVINCE,
    value,
});

export const setShowDistrictAction = (
    { value }: {value: boolean },
) => ({
    type: Type.PageType.SET_SHOW_DISTRICT,
    value,
});

export const setShowMunicipalityAction = (
    { value }: {value: boolean },
) => ({
    type: Type.PageType.SET_SHOW_MUNICIPALITY,
    value,
});

export const setShowWardAction = (
    { value }: {value: boolean },
) => ({
    type: Type.PageType.SET_SHOW_WARD,
    value,
});

export const setLossListAction = ({ lossList }: { lossList: Type.Loss[]}) => ({
    type: Type.PageType.SET_LOSS_LIST,
    lossList,
});

export const setDocumentCategoryListAction = (
    { documentCategoryList }: { documentCategoryList: Type.DocumentCategory[]},
) => ({
    type: Type.PageType.SET_DOCUMENT_CATEGORY_LIST,
    documentCategoryList,
});

export const setCountryListAction = (
    { countryList }: { countryList: Type.Country[]},
) => ({
    type: Type.PageType.SET_COUNTRY_LIST,
    countryList,
});

export const setAgricultureLossTypeListAction = (
    { agricultureLossTypeList }: { agricultureLossTypeList: Type.AgricultureLossType[]},
) => ({
    type: Type.PageType.SET_AGRICULTURE_LOSS_TYPE_LIST,
    agricultureLossTypeList,
});


// dashboard action creator

export const setAlertListActionDP = ({ alertList }: { alertList: Type.Alert[]}) => ({
    type: Type.PageType.DP__SET_ALERTS,
    alertList,
});

export const setEventListAction = ({ eventList }: { eventList: Type.Event[]}) => ({
    type: Type.PageType.DP__SET_EVENTS,
    eventList,
});

export const setFiltersAction = (
    { filters }: { filters: Type.SetFilters['filters'] },
) => ({
    type: Type.PageType.SET_FILTERS,
    filters,
});

export const setFiltersActionDP = (
    { faramValues, faramErrors, pristine }: Type.FiltersWithRegion,
) => ({
    type: Type.PageType.DP__SET_FILTERS,
    faramValues,
    faramErrors,
    pristine,
});

// incident action creator

export const setIncidentListActionIP = ({ incidentList }: { incidentList: Type.Incident[]}) => ({
    type: Type.PageType.IP__SET_INCIDENT_LIST,
    incidentList,
});

export const setIncidentActionIP = ({ incident }: { incident: Type.Incident }) => ({
    type: Type.PageType.IP__SET_INCIDENT,
    incident,
});

export const removeIncidentActionIP = ({ incidentId }: { incidentId: Type.Incident['id'] }) => ({
    type: Type.PageType.IP__REMOVE_INCIDENT,
    incidentId,
});

export const patchIncidentActionIP = ({ incident, incidentId }: {
    incident: Type.Incident;
    incidentId: number;
}) => ({
    type: Type.PageType.IP__PATCH_INCIDENT,
    incident,
    incidentId,
});

export const setFiltersActionIP = (
    { faramValues, faramErrors, pristine }: Type.FiltersWithRegion,
) => ({
    type: Type.PageType.IP__SET_FILTERS,
    faramValues,
    faramErrors,
    pristine,
});

// response action creator

export const setResourceListActionRP = ({ resourceList }: {resourceList: Type.Resource[]}) => ({
    type: Type.PageType.RP__SET_RESOURCE_LIST,
    resourceList,
});

export const setInventoryCategoryListActionRP = (
    { inventoryCategoryList }: { inventoryCategoryList: Type.InventoryCategory[] },
) => ({
    type: Type.PageType.RP__SET_INVENTORY_CATEGOIRES,
    inventoryCategoryList,
});

export const setInventoryItemListActionRP = (
    { inventoryItemList }: { inventoryItemList: Type.InventoryItem[] },
) => ({
    type: Type.PageType.RP__SET_INVENTORY_ITEMS,
    inventoryItemList,
});

// real time monitoring action creator

export const setRealTimeRainListAction = (
    { realTimeRainList }: { realTimeRainList: Type.RealTimeRain[]},
) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_RAIN_LIST,
    realTimeRainList,
});

export const setRealTimeRiverListAction = (
    { realTimeRiverList }: { realTimeRiverList: Type.RealTimeRiver[]},
) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_RIVER_LIST,
    realTimeRiverList,
});
export const setRealTimeDurationAction = (
    { duration }: { duration: Type.Duration},
) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_DURATION,
    duration,
});

export const setRealTimeEarthquakeListAction = (
    { realTimeEarthquakeList }:
    { realTimeEarthquakeList: Type.RealTimeEarthquake[]},
) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_EARTHQUAKE_LIST,
    realTimeEarthquakeList,
});

export const setRealTimeFireListAction = (
    { realTimeFireList }:
    { realTimeFireList: Type.RealTimeFire[]},
) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_FIRE_LIST,
    realTimeFireList,
});

export const setRealTimePollutionListAction = (
    { realTimePollutionList }:
    { realTimePollutionList: Type.RealTimePollution[]},
) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_POLLUTION_LIST,
    realTimePollutionList,
});

export const setRealTimeFiltersAction = (
    { faramValues, faramErrors, pristine }: Type.FiltersWithRegion,
) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_FILTERS,
    faramValues,
    faramErrors,
    pristine,
});

// data archive action creator

export const setDataArchiveRainListAction = (
    { dataArchiveRainList }:
    { dataArchiveRainList: Type.DataArchiveRain[]},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_RAIN_LIST,
    dataArchiveRainList,
});

export const setDataArchiveRiverListAction = (
    { dataArchiveRiverList }:
    { dataArchiveRiverList: Type.DataArchiveRiver[]},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_RIVER_LIST,
    dataArchiveRiverList,
});

export const setDataArchivePollutionListAction = (
    { dataArchivePollutionList }:
    { dataArchivePollutionList: Type.DataArchivePollution[]},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_LIST,
    dataArchivePollutionList,
});

export const setDataArchiveEarthquakeListAction = (
    { dataArchiveEarthquakeList }:
    { dataArchiveEarthquakeList: Type.DataArchiveEarthquake[]},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_EARTHQUAKE_LIST,
    dataArchiveEarthquakeList,
});

export const setDataArchiveEarthquakeFilterAction = (
    { dataArchiveEarthquakeFilters }:
    { dataArchiveEarthquakeFilters: Type.SetDataArchiveEarthquakeFilters['dataArchiveEarthquakeFilters']},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_EARTHQUAKE_FILTERS,
    dataArchiveEarthquakeFilters,
});

export const setDataArchivePollutionFilterAction = (
    { dataArchivePollutionFilters }:
    { dataArchivePollutionFilters: Type.SetDataArchivePollutionFilters['dataArchivePollutionFilters']},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_FILTERS,
    dataArchivePollutionFilters,
});

export const setDataArchiveRainFilterAction = (
    { dataArchiveRainFilters }:
    { dataArchiveRainFilters: Type.SetDataArchiveRainFilters['dataArchiveRainFilters']},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_RAIN_FILTERS,
    dataArchiveRainFilters,
});

export const setDataArchiveRiverFilterAction = (
    { dataArchiveRiverFilters }:
    { dataArchiveRiverFilters: Type.SetDataArchiveRiverFilters['dataArchiveRiverFilters']},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_RIVER_FILTERS,
    dataArchiveRiverFilters,
});

export const setDataArchivePollutionStationAction = (
    { dataArchivePollutionStations }:
    { dataArchivePollutionStations: Type.SetDataArchivePollutionStations['dataArchivePollutionStations']},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_STATIONS,
    dataArchivePollutionStations,
});

export const setDataArchiveRainStationAction = (
    { dataArchiveRainStations }:
    { dataArchiveRainStations: Type.SetDataArchiveRainStations['dataArchiveRainStations']},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_RAIN_STATIONS,
    dataArchiveRainStations,
});

export const setDataArchiveRiverStationAction = (
    { dataArchiveRiverStations }:
    { dataArchiveRiverStations: Type.SetDataArchiveRiverStations['dataArchiveRiverStations']},
) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_RIVER_STATIONS,
    dataArchiveRiverStations,
});

// loss and damage action creator
export const setLossAndDamageFiltersAction = (
    { faramValues, faramErrors, pristine }: Type.FiltersWithRegion,
) => ({
    type: Type.PageType.LD__SET_FILTERS,
    faramValues,
    faramErrors,
    pristine,
});

export const setLossAndDamageListAction = (
    { lossAndDamageList }: { lossAndDamageList: Type.LossAndDamage[] },
) => ({
    type: Type.PageType.LD__SET_LOSS_AND_DAMAGE_LIST,
    lossAndDamageList,
});


// projects profile action creator
export const setProjectsProfileFiltersAction = (
    { faramValues, faramErrors, pristine }: Type.ProjectsProfileFilters,
) => ({
    type: Type.PageType.PP__SET_FILTERS,
    faramValues,
    faramErrors,
    pristine,
});

// disaster profile action creator
export const setRiskListAction = (
    { riskList }: { riskList: Type.Risk[] },
) => ({
    type: Type.PageType.DPP__SET_RISK_LIST,
    riskList,
});

export const setLpGasCookListAction = (
    { lpGasCookList }: { lpGasCookList: Type.LpGasCook[] },
) => ({
    type: Type.PageType.DPP__SET_LP_GAS_COOK_LIST,
    lpGasCookList,
});

// profile contact action creator
export const setProfileContactListAction = (
    { contactList }: { contactList: Type.Contact[] },
) => ({
    type: Type.PageType.PCP__SET_CONTACT_LIST,
    contactList,
});

export const setProfileContactFiltersAction = (
    { faramValues, faramErrors, pristine }: Type.ProfileContactFilters,
) => ({
    type: Type.PageType.PCP__SET_FILTERS,
    faramValues,
    faramErrors,
    pristine,
});

// risk info action creator
export const setCarKeysAction = carKeys => ({
    type: Type.PageType.RIC__SET_CAR_KEYS,
    carKeys,
});

//  REDUCERS

const setCarKeys = (state: Type.PageState, action: Type.SetCarKeys) => {
    const { carKeys } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.carKeys = carKeys;
    });

    return newState;
};


const setFilters = (state: Type.PageState, action: Type.SetFilters) => {
    const { filters } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.filters = filters;

        /* eslint-enable no-param-reassign */
    });

    return newState;
};

const setRegion = (state: Type.PageState, action: Type.SetRegion) => {
    const { region } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.region = region;
    });
    return newState;
};

const setInitialPopupHidden = (state: Type.PageState, action: Type.SetInitialPopupHidden) => {
    const { value } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.hidePopup = value;
    });
    return newState;
};

const setHazardTypes = (state: Type.PageState, action: Type.SetHazardType) => {
    const { hazardTypes: hazardTypesFromAction } = action;

    // TODO Remove this after we get type from server
    const hazardTypes = hazardTypesFromAction.map((hazardType, i) => ({
        ...hazardType,
        type: hazardType.type === 'natural' ? 'natural' : 'artificial',
    }));

    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.hazardTypes = listToMap(
            hazardTypes,
            hazardType => hazardType.id,
            hazardType => hazardType,
        );
    });
    return newState;
};


const setDashboardHazardTypes = (state: Type.PageState, action: Type.SetDashboardHazardType) => {
    const { hazardTypes: hazardTypesFromAction } = action;

    // TODO Remove this after we get type from server
    // const hazardTypes = hazardTypesFromAction.map((hazardType, i) => ({
    //     ...hazardType,
    //     type: hazardType.type === 'natural' ? 'natural' : 'artificial',
    // }));

    let hazardTypes = hazardTypesFromAction.map((hazardType, i) => {
        if (hazardType.title.toUpperCase() === 'HEAVY RAINFALL') {
            return {
                ...hazardType,
                type: hazardType.type === 'natural' ? 'natural' : 'artificial',
            };
        }
        if (hazardType.title.toUpperCase() === 'ENVIRONMENTAL POLLUTION') {
            return {
                ...hazardType,
                type: hazardType.type === 'natural' ? 'natural' : 'artificial',
            };
        }
        if (hazardType.title.toUpperCase() === 'FIRE') {
            return {
                ...hazardType,
                type: hazardType.type === 'natural' ? 'natural' : 'artificial',
            };
        }
        if (hazardType.title.toUpperCase() === 'EARTHQUAKE') {
            return {
                ...hazardType,
                type: hazardType.type === 'natural' ? 'natural' : 'artificial',
            };
        }
        if (hazardType.title.toUpperCase() === 'FLOOD') {
            return {
                ...hazardType,
                type: hazardType.type === 'natural' ? 'natural' : 'artificial',
            };
        }
        return null;
    });

    hazardTypes = hazardTypes.filter(hazardType => hazardType);

    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.hazardTypes = listToMap(
            hazardTypes,
            hazardType => hazardType.id,
            hazardType => hazardType,
        );
    });
    return newState;
};

const setEnumOptions = (state: Type.PageState, action: Type.SetEnumOptionsType) => {
    const { enumList } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.enumList = enumList;
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

const setEventTypes = (state: Type.PageState, action: Type.SetEventType) => {
    const { eventTypes } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.eventTypes = listToMap(
            eventTypes,
            eventType => eventType.id,
            eventType => eventType,
        );
    });
    return newState;
};

const setMapStyles = (state: Type.PageState, action: Type.SetMapStyles) => {
    const { mapStyles } = action;
    const newState = {
        ...state,
        mapStyles,
    };
    return newState;
};

const setMapStyle = (state: Type.PageState, action: Type.SetMapStyle) => {
    const { mapStyle } = action;
    const newState = {
        ...state,
        selectedMapStyle: mapStyle,
    };
    return newState;
};

const setProvinces = (state: Type.PageState, action: Type.SetProvinces) => {
    const { provinces } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.provinces = provinces;
    });
    return newState;
};

const setDistricts = (state: Type.PageState, action: Type.SetDistricts) => {
    const { districts } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.districts = districts;
    });
    return newState;
};

const setMunicipalities = (state: Type.PageState, action: Type.SetMunicipalities) => {
    const { municipalities } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.municipalities = municipalities;
    });
    return newState;
};

const setWards = (state: Type.PageState, action: Type.SetWards) => {
    const { wards } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.wards = wards;
    });
    return newState;
};

const setShowProvince = (state: Type.PageState, action: Type.SetShowProvince) => {
    const { value } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.showProvince = value;
    });
    return newState;
};

const setShowDistrict = (state: Type.PageState, action: Type.SetShowDistrict) => {
    const { value } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.showDistrict = value;
    });
    return newState;
};

const setShowMunicipality = (state: Type.PageState, action: Type.SetShowMunicipality) => {
    const { value } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.showMunicipality = value;
    });
    return newState;
};

const setShowWard = (state: Type.PageState, action: Type.SetShowWard) => {
    const { value } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.showWard = value;
    });
    return newState;
};

const setLossList = (state: Type.PageState, action: Type.SetLossList) => {
    const { lossList } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.lossList = lossList;
    });
    return newState;
};

const setDocumentCategoryList = (state: Type.PageState, action: Type.SetDocumentCategoryList) => {
    const { documentCategoryList } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.documentCategoryList = documentCategoryList;
    });
    return newState;
};

const setCountryList = (
    state: Type.PageState, action: Type.SetCountryList,
) => {
    const { countryList } = action;

    const newState = produce(state, (deferedState) => {
        deferedState.countryList = countryList;
    });

    return newState;
};

const setAgricultureLossTypeList = (
    state: Type.PageState,
    action: Type.SetAgricultureLossTypeList,
) => {
    const { agricultureLossTypeList } = action;

    const newSate = produce(state, (deferedState) => {
        deferedState.agricultureLossTypeList = agricultureLossTypeList;
    });

    return newSate;
};

// dashboard page

const setAlertList = (state: Type.PageState, action: Type.SetDashboardAlertList) => {
    const { alertList } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.dashboardPage) {
            // FIXME: find a good way to handle this
            deferedState.dashboardPage = initialState.dashboardPage;
        }
        deferedState.dashboardPage.alertList = alertList;
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

const setEventList = (state: Type.PageState, action: Type.SetEventList) => {
    const { eventList } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.dashboardPage) {
            // FIXME: find a good way to handle this
            deferedState.dashboardPage = initialState.dashboardPage;
        }
        deferedState.dashboardPage.eventList = eventList;
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

const setDashboardFilters = (state: Type.PageState, action: Type.SetDashboardFilters) => {
    const {
        faramValues,
        faramErrors,
        pristine,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        /*
        if (!deferedState.dashboardPage) {
            // FIXME: find a good way to handle this
            deferedState.dashboardPage = initialState.dashboardPage;
        }
        if (!deferedState.dashboardPage.filters) {
            // FIXME: find a good way to handle this
            deferedState.dashboardPage.filters = initialState.dashboardPage.filters;
        }
        */

        const {
            region,
            ...faramValuesNoRegion
        } = faramValues;

        deferedState.region = region;

        deferedState.dashboardPage.filters.faramValues = faramValuesNoRegion;
        deferedState.dashboardPage.filters.faramErrors = faramErrors;
        deferedState.dashboardPage.filters.pristine = pristine;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

// incident page
const setIncidentList = (state: Type.PageState, action: Type.SetIncidentList) => {
    const {
        incidentList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.incidentPage) {
            // FIXME: find a good way to handle this
            deferedState.incidentPage = initialState.incidentPage;
        }
        deferedState.incidentPage.incidentList = incidentList;
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

const setIncident = (state: Type.PageState, action: Type.SetIncident) => {
    const {
        incident,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.incidentPage) {
            deferedState.incidentPage = initialState.incidentPage;
        }

        const {
            incidentPage: {
                incidentList,
            },
        } = deferedState;

        const incidentIndex = incidentList.findIndex(d => d.id === incident.id);
        if (incidentIndex !== -1) {
            incidentList.splice(incidentIndex, 1, incident);
        } else {
            incidentList.push(incident);
        }
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

const removeIncident = (state: Type.PageState, action: Type.PatchIncident) => {
    const {
        incidentId,
    } = action;

    const newState = produce(state, (deferedState) => {
        if (!deferedState.incidentPage) {
            // eslint-disable-next-line no-param-reassign
            deferedState.incidentPage = initialState.incidentPage;
        }

        const {
            incidentPage: {
                incidentList,
            },
        } = deferedState;

        const incidentIndex = incidentList.findIndex(d => d.id === incidentId);
        if (incidentIndex !== -1) {
            incidentList.splice(incidentIndex, 1);
        }
    });
    return newState;
};

const patchIncident = (state: Type.PageState, action: Type.PatchIncident) => {
    const {
        incident,
        incidentId,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.incidentPage) {
            deferedState.incidentPage = initialState.incidentPage;
        }

        const {
            incidentPage: {
                incidentList,
            },
        } = deferedState;

        const incidentIndex = incidentList.findIndex(d => d.id === incidentId);
        if (incidentIndex !== -1) {
            incidentList[incidentIndex] = {
                ...incidentList[incidentIndex],
                ...incident,
            };
        }
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

const setIncidentFilters = (state: Type.PageState, action: Type.SetIncidentFilters) => {
    const {
        faramValues,
        faramErrors,
        pristine,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        /*
        if (!deferedState.incidentPage) {
            deferedState.incidentPage = initialState.incidentPage;
        }
        if (!deferedState.incidentPage.filters) {
            deferedState.incidentPage.filters = initialState.incidentPage.filters;
        }
        */

        const {
            region,
            ...faramValuesNoRegion
        } = faramValues;

        deferedState.region = region;

        deferedState.incidentPage.filters.faramValues = faramValuesNoRegion;
        deferedState.incidentPage.filters.faramErrors = faramErrors;
        deferedState.incidentPage.filters.pristine = pristine;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

// response page

// FIXME: should be moved to utils
function unique<T, W>(
    arr: T[],
    getValue: (t: T) => W,
    getComparisionValue: (t: T) => (string | number),
) {
    const memory: { [key: string]: boolean } = {};
    const newArr: W[] = [];
    arr.forEach((o) => {
        const comparator = getComparisionValue;
        const id = comparator(o);
        if (!memory[id]) {
            memory[id] = true;
            newArr.push(getValue(o));
        }
    });
    return newArr;
}


export const setInventoryCategoryListAction = (
    state: Type.PageState,
    action: Type.SetInventoryCategoryList,
) => {
    const { inventoryCategoryList } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.responsePage.inventoryCategoryList = inventoryCategoryList;
    });
    return newState;
};


export const setInventoryItemListAction = (
    state: Type.PageState,
    action: Type.SetInventoryItemList,
) => {
    const { inventoryItemList } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.responsePage.inventoryItemList = inventoryItemList;
    });
    return newState;
};

// real time monitoring page

export const setRealTimeRainList = (state: Type.PageState, action: Type.SetRealTimeRainList) => {
    const {
        realTimeRainList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.realTimeMonitoringPage.realTimeRainList = realTimeRainList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};
export const setRealTimeDuration = (state: Type.PageState, action: Type.SetRealTimeeDuration) => {
    const {
        duration,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.realTimeMonitoringPage.duration = duration;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setRealTimeRiverList = (state: Type.PageState, action: Type.SetRealTimeRiverList) => {
    const {
        realTimeRiverList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.realTimeMonitoringPage.realTimeRiverList = realTimeRiverList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setRealTimeEarthquakeList = (
    state: Type.PageState,
    action: Type.SetRealTimeEarthquakeList,
) => {
    const {
        realTimeEarthquakeList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.realTimeMonitoringPage.realTimeEarthquakeList = realTimeEarthquakeList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setRealTimeFireList = (
    state: Type.PageState,
    action: Type.SetRealTimeFireList,
) => {
    const {
        realTimeFireList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.realTimeMonitoringPage.realTimeFireList = realTimeFireList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setRealTimePollutionList = (
    state: Type.PageState,
    action: Type.SetRealTimePollutionList,
) => {
    const {
        realTimePollutionList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.realTimeMonitoringPage.realTimePollutionList = realTimePollutionList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setRealTimeFilters = (
    state: Type.PageState,
    action: Type.SetRealTimeFilters,
) => {
    const {
        faramValues,
        faramErrors,
        pristine,
    } = action;

    const newState = produce(state, (deferedState) => {
        const {
            region,
            ...faramValuesNoRegion
        } = faramValues;

        /* eslint-disable no-param-reassign */
        deferedState.region = region;

        if (faramValues) {
            deferedState.realTimeMonitoringPage.filters.faramValues = faramValuesNoRegion;
        }
        if (faramErrors) {
            deferedState.realTimeMonitoringPage.filters.faramErrors = faramErrors;
        }
        if (pristine) {
            deferedState.realTimeMonitoringPage.filters.pristine = pristine;
        }
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

// data archive
export const setDataArchiveRainList = (
    state: Type.PageState,
    action: Type.SetDataArchiveRainList,
) => {
    const {
        dataArchiveRainList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.dataArchivePage.dataArchiveRainList = dataArchiveRainList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchiveRiverList = (
    state: Type.PageState,
    action: Type.SetDataArchiveRiverList,
) => {
    const {
        dataArchiveRiverList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.dataArchivePage.dataArchiveRiverList = dataArchiveRiverList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchivePollutionList = (
    state: Type.PageState,
    action: Type.SetDataArchivePollutionList,
) => {
    const {
        dataArchivePollutionList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.dataArchivePage.dataArchivePollutionList = dataArchivePollutionList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchiveEarthquakeList = (
    state: Type.PageState,
    action: Type.SetDataArchiveEarthquakeList,
) => {
    const {
        dataArchiveEarthquakeList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.dataArchivePage.dataArchiveEarthquakeList = dataArchiveEarthquakeList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};
export const setDataArchiveEarthquakeFilters = (
    state: Type.PageState,
    action: Type.SetDataArchiveEarthquakeFilters,
) => {
    const {
        dataArchiveEarthquakeFilters,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.daEarthquakeFilter = dataArchiveEarthquakeFilters;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchivePollutionFilters = (
    state: Type.PageState,
    action: Type.SetDataArchivePollutionFilters,
) => {
    const {
        dataArchivePollutionFilters,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.daPollutionFilter = dataArchivePollutionFilters;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchiveRainFilters = (
    state: Type.PageState,
    action: Type.SetDataArchiveRainFilters,
) => {
    const {
        dataArchiveRainFilters,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.daRainFilter = dataArchiveRainFilters;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchiveRiverFilters = (
    state: Type.PageState,
    action: Type.SetDataArchiveRiverFilters,
) => {
    const {
        dataArchiveRiverFilters,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.daRiverFilter = dataArchiveRiverFilters;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchivePollutionStations = (
    state: Type.PageState,
    action: Type.SetDataArchivePollutionStations,
) => {
    const {
        dataArchivePollutionStations,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.pollutionStations = dataArchivePollutionStations;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchiveRainStations = (
    state: Type.PageState,
    action: Type.SetDataArchiveRainStations,
) => {
    const {
        dataArchiveRainStations,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.rainStations = dataArchiveRainStations;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setDataArchiveRiverStations = (
    state: Type.PageState,
    action: Type.SetDataArchiveRiverStations,
) => {
    const {
        dataArchiveRiverStations,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.riverStations = dataArchiveRiverStations;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};


// loss and damage page
export const setLossAndDamageFilters = (
    state: Type.PageState,
    action: Type.SetLossAndDamageFilters,
) => {
    const {
        faramValues,
        faramErrors,
        pristine,
    } = action;

    const newState = produce(state, (deferedState) => {
        const {
            region,
            ...faramValuesNoRegion
        } = faramValues;

        /* eslint-disable no-param-reassign */
        deferedState.region = region;

        if (faramValues) {
            deferedState.lossAndDamagePage.filters.faramValues = faramValuesNoRegion;
        }
        if (faramErrors) {
            deferedState.lossAndDamagePage.filters.faramErrors = faramErrors;
        }
        if (pristine) {
            deferedState.lossAndDamagePage.filters.pristine = pristine;
        }
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

export const setLossAndDamageList = (
    state: Type.PageState,
    action: Type.SetLossAndDamageList,
) => {
    const {
        lossAndDamageList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.lossAndDamagePage.lossAndDamageList = lossAndDamageList;
    });

    return newState;
};


// projects profile page
export const setProjectsProfileFilters = (
    state: Type.PageState,
    action: Type.SetProjectsProfileFilters,
) => {
    const {
        faramValues,
        faramErrors,
        pristine,
    } = action;

    const newState = produce(state, (deferedState) => {
        const {
            region,
            ...faramValuesNoRegion
        } = faramValues;

        /* eslint-disable no-param-reassign */
        deferedState.region = region || {};

        if (faramValues) {
            deferedState.projectsProfilePage.filters.faramValues = faramValuesNoRegion;
        }
        if (faramErrors) {
            deferedState.projectsProfilePage.filters.faramErrors = faramErrors;
        }
        if (pristine) {
            deferedState.projectsProfilePage.filters.pristine = pristine;
        }
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

// disaster profile page
export const setRiskList = (
    state: Type.PageState,
    action: Type.SetRiskList,
) => {
    const {
        riskList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable-next-line no-param-reassign */
        deferedState.disasterProfilePage.riskList = riskList;
    });

    return newState;
};
export const setLpGasCookList = (
    state: Type.PageState,
    action: Type.SetLpGasCookList,
) => {
    const {
        lpGasCookList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable-next-line no-param-reassign */
        deferedState.disasterProfilePage.lpGasCookList = lpGasCookList;
    });

    return newState;
};

// profile contact page
export const setProfileContactList = (
    state: Type.PageState,
    action: Type.SetProfileContactList,
) => {
    const {
        contactList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable-next-line no-param-reassign */
        deferedState.profileContactPage.contactList = contactList;
    });

    return newState;
};

export const setProfileContactFilters = (
    state: Type.PageState,
    action: Type.SetProfileContactFilters,
) => {
    const {
        faramValues,
        faramErrors,
        pristine,
    } = action;

    const newState = produce(state, (deferedState) => {
        const {
            region,
            ...faramValuesNoRegion
        } = faramValues;

        /* eslint-disable no-param-reassign */
        deferedState.region = region || {};

        if (faramValues) {
            deferedState.profileContactPage.filters.faramValues = faramValuesNoRegion;
        }
        if (faramErrors) {
            deferedState.profileContactPage.filters.faramErrors = faramErrors;
        }
        if (pristine) {
            deferedState.profileContactPage.filters.pristine = pristine;
        }
        /* eslint-enable no-param-reassign */
    });

    return newState;
};


const setGeneralData = (state: Type.PageState, action: Type.SetGeneralData) => {
    const { generalData } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.generalData = generalData;
    });
    return newState;
};


const setBudgetData = (state: Type.PageState, action: Type.SetBudgetData) => {
    const { budgetData } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.budgetData = budgetData;
    });
    return newState;
};

const setBudgetActivityData = (state: Type.PageState, action: Type.SetBudgetActivityData) => {
    const { budgetActivityData } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.budgetActivityData = budgetActivityData;
    });
    return newState;
};
// IBF
const setIbfPage = (state: Type.PageState, action: Type.SetIbfPage) => {
    const { ibfPage:
        {
            demo,
            stations,
            stationDetail,
            selectedStation,
            calendarData,
            returnPeriod,
            leadTime,
            overallFloodHazard,
            filter,
            householdJson,
            showHouseHold,
            selectedIndicator,
            householdDistrictAverage,
            selectedLegend,
        } } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (demo) {
            deferedState.ibfPage.demo = demo;
        }
        if (demo === 0) {
            deferedState.ibfPage.demo = demo;
        }
        if (stations) {
            deferedState.ibfPage.stations = stations;
        }
        if (stationDetail) {
            deferedState.ibfPage.stationDetail = stationDetail;
        }
        if (selectedStation) {
            deferedState.ibfPage.selectedStation = selectedStation;
        }
        if (calendarData) {
            deferedState.ibfPage.calendarData = calendarData;
        }
        if (returnPeriod) {
            deferedState.ibfPage.returnPeriod = returnPeriod;
        }
        if (returnPeriod === 0) {
            deferedState.ibfPage.returnPeriod = returnPeriod;
        }
        if (leadTime) {
            deferedState.ibfPage.leadTime = leadTime;
        }
        if (leadTime === 0) {
            deferedState.ibfPage.leadTime = leadTime;
        }
        if (overallFloodHazard) {
            deferedState.ibfPage.overallFloodHazard = overallFloodHazard;
        }
        if (householdJson) {
            deferedState.ibfPage.householdJson = householdJson;
        }
        if (showHouseHold) {
            deferedState.ibfPage.showHouseHold = showHouseHold;
        }
        if (showHouseHold === 0) {
            deferedState.ibfPage.showHouseHold = showHouseHold;
        }
        if (selectedIndicator) {
            deferedState.ibfPage.selectedIndicator = selectedIndicator;
        }
        if (householdDistrictAverage) {
            deferedState.ibfPage.householdDistrictAverage = householdDistrictAverage;
        }
        if (selectedLegend) {
            deferedState.ibfPage.selectedLegend = selectedLegend;
        }
        if (selectedLegend === '') {
            deferedState.ibfPage.selectedLegend = selectedLegend;
        }
        if (filter) {
            if (filter.district) {
                deferedState.ibfPage.filter.district = filter.district;
            }
            if (filter.district === '') {
                deferedState.ibfPage.filter.district = filter.district;
            }
            if (filter.municipality) {
                deferedState.ibfPage.filter.municipality = filter.municipality;
            }
            if (filter.municipality === '') {
                deferedState.ibfPage.filter.municipality = filter.municipality;
            }
            if (filter.ward) {
                deferedState.ibfPage.filter.ward = filter.ward;
            }
        }
        /* eslint-disable no-param-reassign */
    });
    return newState;
};

const setProgramAndPolicyData = (state: Type.PageState, action: Type.SetProgramAndPolicyData) => {
    const { programAndPolicyData } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.programAndPolicyData = programAndPolicyData;
    });
    return newState;
};

const setBudgetId = (state: Type.PageState, action: Type.SetBudgetId) => {
    const { budgetId } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.budgetId = budgetId;
    });
    return newState;
};

const setPalikaRedirect = (state: Type.PageState, action: Type.SetPalikaRedirect) => {
    const { palikaRedirect } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.palikaRedirect = palikaRedirect;
    });
    return newState;
};

const setPalikaLanguage = (state: Type.PageState, action: Type.SetPalikaLanguage) => {
    const { palikaLanguage } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.palikaLanguage = palikaLanguage;
    });
    return newState;
};

const setDrrmOrg = (state: Type.PageState, action: Type.SetDrrmOrg) => {
    const { drrmOrg } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.drrmOrg = drrmOrg;
    });
    return newState;
};

const setDrrmContacts = (state: Type.PageState, action: Type.SetDrrmContacts) => {
    const { drrmContacts } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.drrmContacts = drrmContacts;
    });
    return newState;
};

const setDrrmInventory = (state: Type.PageState, action: Type.SetDrrmInventory) => {
    const { drrmInventory } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.drrmInventory = drrmInventory;
    });
    return newState;
};

const setDrrmCritical = (state: Type.PageState, action: Type.SetDrrmCritical) => {
    const { drrmCritical } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.drrmCritical = drrmCritical;
    });
    return newState;
};

const setDrrmRegion = (state: Type.PageState, action: Type.SetDrrmRegion) => {
    const { drrmRegion } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.drrmRegion = drrmRegion;
    });
    return newState;
};

const setDrrmProgress = (state: Type.PageState, action: Type.SetDrrmProgress) => {
    const { drrmProgress } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.drrmProgress = drrmProgress;
    });
    return newState;
};
// bulletin data
export const setBulletinLoss = (
    state: Type.PageState,
    action: Type.SetBulletinData,
) => {
    const {
        bulletinData,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.bulletinPage.incidentSummary = bulletinData.incidentSummary;
        deferedState.bulletinPage.peopleLoss = bulletinData.peopleLoss;
        deferedState.bulletinPage.hazardWiseLoss = bulletinData.hazardWiseLoss;
        deferedState.bulletinPage.genderWiseLoss = bulletinData.genderWiseLoss;
        deferedState.bulletinPage.sitRep = bulletinData.sitRep;
    });

    return newState;
};

export const setBulletinCovid = (
    state: Type.PageState,
    action: Type.SetBulletinData,
) => {
    const {
        bulletinData,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.bulletinPage.covid24hrsStat = bulletinData.covid24hrsStat;
        deferedState.bulletinPage.covidProvinceWiseTotal = bulletinData.covidProvinceWiseTotal;
        deferedState.bulletinPage.covidTotalStat = bulletinData.covidTotalStat;
        deferedState.bulletinPage.vaccineStat = bulletinData.vaccineStat;
    });

    return newState;
};


export const setBulletinFeedback = (
    state: Type.PageState,
    action: Type.SetBulletinData,
) => {
    const {
        bulletinData,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.bulletinPage.feedback = bulletinData.feedback;
    });

    return newState;
};

export const setBulletinDataTemperature = (
    state: Type.PageState,
    action: Type.SetBulletinData,
) => {
    const {
        bulletinData,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.bulletinPage.tempMin = bulletinData.tempMin;
        deferedState.bulletinPage.tempMax = bulletinData.tempMax;
        deferedState.bulletinPage.dailySummary = bulletinData.dailySummary;
        deferedState.bulletinPage.rainSummaryPic = bulletinData.rainSummaryPic;
        deferedState.bulletinPage.maxTempFooter = bulletinData.maxTempFooter;
        deferedState.bulletinPage.minTempFooter = bulletinData.minTempFooter;
    });

    return newState;
};

export const setBulletinYearlyData = (
    state: Type.PageState,
    action: Type.SetBulletinData,
) => {
    const {
        bulletinData,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.bulletinPage.yearlyData = bulletinData.yearlyData;
    });

    return newState;
};

export const setBulletinEditData = (
    state: Type.PageState,
    action: Type.SetBulletinEditData,
) => {
    const {
        bulletinEditData,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.bulletinEditData = bulletinEditData;
    });

    return newState;
};


// Epidemics
const setEpidemicsPage = (state: Type.PageState, action: Type.SetEpidemicsPage) => {
    const { epidemicsPage: {
        lossID,
        loader,
        lossError,
        incidentError,
        lossPeopleError,
        successMessage,
        incidentData,
        incidentEditData,
        incidentUpdateError,
        epidemicChartHourlyLoading,
        epidemicChartHourlyData,
        epidemicChartHourlyError,
        epidemicChartDailyLoading,
        epidemicChartDailyData,
        epidemicChartDailyError,
        epidemicChartWeeklyLoading,
        epidemicChartWeeklyData,
        epidemicChartWeeklyError,
        epidemicChartYearlyLoading,
        epidemicChartYearlyData,
        epidemicChartYearlyError,
        epidemicChartMonthlyLoading,
        epidemicChartMonthlyData,
        epidemicChartMonthlyError,
        epidemicTableLoading,
        epidemicTableData,
        epidemicTableError,
        epidemicTotalLoading,
        epidemicTotalData,
        epidemicTotalError,
        incidentCount,
        uploadData,
    } } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (lossID) {
            deferedState.epidemicsPage.lossID = lossID;
        }
        if (loader) {
            deferedState.epidemicsPage.loader = loader;
        }
        if (lossError) {
            deferedState.epidemicsPage.lossError = lossError;
        }
        if (incidentError) {
            deferedState.epidemicsPage.incidentError = incidentError;
        }
        if (lossPeopleError) {
            deferedState.epidemicsPage.lossPeopleError = lossPeopleError;
        }
        if (successMessage) {
            deferedState.epidemicsPage.successMessage = successMessage;
        }
        if (incidentData) {
            deferedState.epidemicsPage.incidentData = incidentData;
        }
        if (incidentEditData) {
            deferedState.epidemicsPage.incidentEditData = incidentEditData;
        }
        if (incidentUpdateError) {
            deferedState.epidemicsPage.incidentUpdateError = incidentUpdateError;
        }
        if (epidemicChartHourlyLoading) {
            deferedState.epidemicsPage.epidemicChartHourlyLoading = epidemicChartHourlyLoading;
        }
        if (epidemicChartHourlyData) {
            deferedState.epidemicsPage.epidemicChartHourlyData = epidemicChartHourlyData;
        }
        if (epidemicChartHourlyError) {
            deferedState.epidemicsPage.epidemicChartHourlyError = epidemicChartHourlyError;
        }
        if (epidemicChartDailyLoading) {
            deferedState.epidemicsPage.epidemicChartDailyLoading = epidemicChartDailyLoading;
        }
        if (epidemicChartDailyData) {
            deferedState.epidemicsPage.epidemicChartDailyData = epidemicChartDailyData;
        }
        if (epidemicChartDailyError) {
            deferedState.epidemicsPage.epidemicChartDailyError = epidemicChartDailyError;
        }
        if (epidemicChartWeeklyLoading) {
            deferedState.epidemicsPage.epidemicChartWeeklyLoading = epidemicChartWeeklyLoading;
        }
        if (epidemicChartWeeklyData) {
            deferedState.epidemicsPage.epidemicChartWeeklyData = epidemicChartWeeklyData;
        }
        if (epidemicChartWeeklyError) {
            deferedState.epidemicsPage.epidemicChartWeeklyError = epidemicChartWeeklyError;
        }
        if (epidemicChartYearlyLoading) {
            deferedState.epidemicsPage.epidemicChartYearlyLoading = epidemicChartYearlyLoading;
        }
        if (epidemicChartYearlyData) {
            deferedState.epidemicsPage.epidemicChartYearlyData = epidemicChartYearlyData;
        }
        if (epidemicChartYearlyError) {
            deferedState.epidemicsPage.epidemicChartYearlyError = epidemicChartYearlyError;
        }
        if (epidemicChartMonthlyLoading) {
            deferedState.epidemicsPage.epidemicChartMonthlyLoading = epidemicChartMonthlyLoading;
        }
        if (epidemicChartMonthlyData) {
            deferedState.epidemicsPage.epidemicChartMonthlyData = epidemicChartMonthlyData;
        }
        if (epidemicChartMonthlyError) {
            deferedState.epidemicsPage.epidemicChartMonthlyError = epidemicChartMonthlyError;
        }
        if (epidemicTableLoading) {
            deferedState.epidemicsPage.epidemicTableLoading = epidemicTableLoading;
        }
        if (epidemicTableData) {
            deferedState.epidemicsPage.epidemicTableData = epidemicTableData;
        }
        if (epidemicTableError) {
            deferedState.epidemicsPage.epidemicTableError = epidemicTableError;
        }
        if (epidemicTotalLoading) {
            deferedState.epidemicsPage.epidemicTotalLoading = epidemicTotalLoading;
        }
        if (epidemicTotalData) {
            deferedState.epidemicsPage.epidemicTotalData = epidemicTotalData;
        }
        if (epidemicTotalError) {
            deferedState.epidemicsPage.epidemicTotalError = epidemicTotalError;
        }
        if (incidentCount) {
            deferedState.epidemicsPage.incidentCount = incidentCount;
        }
        if (uploadData) {
            deferedState.epidemicsPage.uploadData = uploadData;
        }
    });
    return newState;
};

const setLanguageLocal = (state: Type.PageState, action: Type.SetLanguage) => {
    const { language } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.language = language;
    });
    return newState;
};

export const setResourceList = (state: Type.PageState, action: Type.SetResourceList) => {
    const {
        resourceList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        // FIXME: unique value must be sent from server later
        deferedState.responsePage.resourceList = unique(resourceList, w => w, w => w.title);
        /* eslint-enable no-param-reassign */
    });

    return newState;
};


export default function routeReducer(
    state = initialState,
    action: Type.PageActionTypes,
): Type.PageState {
    switch (action.type) {
        case Type.PageType.SET_LANGUAGE:
            return setLanguageLocal(state, action);
        case Type.PageType.SET_DRRM_PROGRESS:
            return setDrrmProgress(state, action);
        case Type.PageType.SET_DRRM_REGION:
            return setDrrmRegion(state, action);
        case Type.PageType.SET_DRRM_CONTACTS:
            return setDrrmContacts(state, action);
        case Type.PageType.SET_DRRM_CRITICAL:
            return setDrrmCritical(state, action);
        case Type.PageType.SET_DRRM_INVENTORY:
            return setDrrmInventory(state, action);
        case Type.PageType.SET_DRRM_ORG:
            return setDrrmOrg(state, action);
        case Type.PageType.SET_PALIKA_LANGUAGE:
            return setPalikaLanguage(state, action);
        case Type.PageType.SET_BUDGET_ID:
            return setBudgetId(state, action);
        case Type.PageType.SET_PALIKA_REDIRECT:
            return setPalikaRedirect(state, action);
        case Type.PageType.SET_PROGRAM_AND_POLICY_DATA:
            return setProgramAndPolicyData(state, action);
        case Type.PageType.SET_BUDGET_ACTIVITY_DATA:
            return setBudgetActivityData(state, action);
        case Type.PageType.SET_BUDGET_DATA:
            return setBudgetData(state, action);
        case Type.PageType.SET_GENERAL_DATA:
            return setGeneralData(state, action);
        case Type.PageType.SET_IBF_PAGE:
            return setIbfPage(state, action);
        case Type.PageType.ADMIN__PORTAL_BULLETIN_EDIT_DATA:
            return setBulletinEditData(state, action);
        case Type.PageType.ADMIN__PORTAL_BULLETIN:
            return setBulletinLoss(state, action);
        case Type.PageType.ADMIN__PORTAL_BULLETIN_YEARLYDATA:
            return setBulletinYearlyData(state, action);
        case Type.PageType.ADMIN__PORTAL_BULLETIN_COVID:
            return setBulletinCovid(state, action);
        case Type.PageType.ADMIN__PORTAL_BULLETIN_FEEDBACK:
            return setBulletinFeedback(state, action);
        case Type.PageType.ADMIN__PORTAL_BULLETIN_TEMPERATURE:
            return setBulletinDataTemperature(state, action);
        case Type.PageType.SET_REGION:
            return setRegion(state, action);
        case Type.PageType.SET_INITIAL_POPUP_HIDDEN:
            return setInitialPopupHidden(state, action);
        case Type.PageType.SET_HAZARD_TYPES:
            return setHazardTypes(state, action);
        case Type.PageType.SET_DASHBOARD_HAZARD_TYPES:
            return setDashboardHazardTypes(state, action);
        case Type.PageType.SET_EVENT_TYPES:
            return setEventTypes(state, action);
        case Type.PageType.SET_MAP_STYLES:
            return setMapStyles(state, action);
        case Type.PageType.SET_MAP_STYLE:
            return setMapStyle(state, action);
        case Type.PageType.SET_PROVINCES:
            return setProvinces(state, action);
        case Type.PageType.SET_DISTRICTS:
            return setDistricts(state, action);
        case Type.PageType.SET_MUNICIPALITIES:
            return setMunicipalities(state, action);
        case Type.PageType.SET_WARDS:
            return setWards(state, action);
        case Type.PageType.SET_SHOW_PROVINCE:
            return setShowProvince(state, action);
        case Type.PageType.SET_SHOW_DISTRICT:
            return setShowDistrict(state, action);
        case Type.PageType.SET_SHOW_MUNICIPALITY:
            return setShowMunicipality(state, action);
        case Type.PageType.SET_SHOW_WARD:
            return setShowWard(state, action);
        case Type.PageType.SET_LOSS_LIST:
            return setLossList(state, action);
        case Type.PageType.SET_FILTERS:
            return setFilters(state, action);
        case Type.PageType.RIC__SET_CAR_KEYS:
            return setCarKeys(state, action);
        case Type.PageType.DP__SET_ALERTS:
            return setAlertList(state, action);
        case Type.PageType.DP__SET_FILTERS:
            return setDashboardFilters(state, action);
        case Type.PageType.IP__SET_INCIDENT_LIST:
            return setIncidentList(state, action);
        case Type.PageType.IP__SET_INCIDENT:
            return setIncident(state, action);
        case Type.PageType.IP__REMOVE_INCIDENT:
            return removeIncident(state, action);
        case Type.PageType.IP__PATCH_INCIDENT:
            return patchIncident(state, action);
        case Type.PageType.IP__SET_FILTERS:
            return setIncidentFilters(state, action);
        case Type.PageType.RP__SET_RESOURCE_LIST:
            return setResourceList(state, action);
        case Type.PageType.RP__SET_INVENTORY_CATEGOIRES:
            return setInventoryCategoryListAction(state, action);
        case Type.PageType.RP__SET_INVENTORY_ITEMS:
            return setInventoryItemListAction(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_RAIN_LIST:
            return setRealTimeRainList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_DURATION:
            return setRealTimeDuration(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_RIVER_LIST:
            return setRealTimeRiverList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_EARTHQUAKE_LIST:
            return setRealTimeEarthquakeList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_FIRE_LIST:
            return setRealTimeFireList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_POLLUTION_LIST:
            return setRealTimePollutionList(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_RAIN_LIST:
            return setDataArchiveRainList(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_RIVER_LIST:
            return setDataArchiveRiverList(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_LIST:
            return setDataArchivePollutionList(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_EARTHQUAKE_LIST:
            return setDataArchiveEarthquakeList(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_EARTHQUAKE_FILTERS:
            return setDataArchiveEarthquakeFilters(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_FILTERS:
            return setDataArchivePollutionFilters(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_RAIN_FILTERS:
            return setDataArchiveRainFilters(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_RIVER_FILTERS:
            return setDataArchiveRiverFilters(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_STATIONS:
            return setDataArchivePollutionStations(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_RAIN_STATIONS:
            return setDataArchiveRainStations(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_RIVER_STATIONS:
            return setDataArchiveRiverStations(state, action);
        case Type.PageType.LD__SET_FILTERS:
            return setLossAndDamageFilters(state, action);
        case Type.PageType.LD__SET_LOSS_AND_DAMAGE_LIST:
            return setLossAndDamageList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_FILTERS:
            return setRealTimeFilters(state, action);
        case Type.PageType.DP__SET_EVENTS:
            return setEventList(state, action);
        case Type.PageType.PP__SET_FILTERS:
            return setProjectsProfileFilters(state, action);
        case Type.PageType.DPP__SET_RISK_LIST:
            return setRiskList(state, action);
        case Type.PageType.DPP__SET_LP_GAS_COOK_LIST:
            return setLpGasCookList(state, action);
        case Type.PageType.PCP__SET_CONTACT_LIST:
            return setProfileContactList(state, action);
        case Type.PageType.PCP__SET_FILTERS:
            return setProfileContactFilters(state, action);
        case Type.PageType.SET_DOCUMENT_CATEGORY_LIST:
            return setDocumentCategoryList(state, action);
        case Type.PageType.SET_COUNTRY_LIST:
            return setCountryList(state, action);
        case Type.PageType.SET_AGRICULTURE_LOSS_TYPE_LIST:
            return setAgricultureLossTypeList(state, action);
        case Type.PageType.SET_ENUM_OPTIONS:
            return setEnumOptions(state, action);
        case Type.PageType.SET_EPIDEMICS_PAGE:
            return setEpidemicsPage(state, action);
        default:
            return state;
    }
}
