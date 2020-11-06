import produce from 'immer';
import { listToMap } from '@togglecorp/fujs';

import * as Type from './types';
import initialState from './initialState';

import { ModelEnum } from '#types';
// ACTION CREATORS

export const setRegionAction = (
    { region }: { region: Type.Region },
) => ({
    type: Type.PageType.SET_REGION,
    region,
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
    { realTimeRainList }: { realTimeRainList: Type.RealTimeRain[]}) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_RAIN_LIST,
    realTimeRainList,
});

export const setRealTimeRiverListAction = (
    { realTimeRiverList }: { realTimeRiverList: Type.RealTimeRiver[]}) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_RIVER_LIST,
    realTimeRiverList,
});

export const setRealTimeEarthquakeListAction = (
    { realTimeEarthquakeList }:
    { realTimeEarthquakeList: Type.RealTimeEarthquake[]}) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_EARTHQUAKE_LIST,
    realTimeEarthquakeList,
});

export const setRealTimeFireListAction = (
    { realTimeFireList }:
    { realTimeFireList: Type.RealTimeFire[]}) => ({
    type: Type.PageType.RTM__SET_REAL_TIME_FIRE_LIST,
    realTimeFireList,
});

export const setRealTimePollutionListAction = (
    { realTimePollutionList }:
    { realTimePollutionList: Type.RealTimePollution[]}) => ({
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

export const setDataArchivePollutionListAction = (
    { dataArchivePollutionList }:
    { dataArchivePollutionList: Type.DataArchivePollution[]}) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_LIST,
    dataArchivePollutionList,
});

export const setDataArchiveEarthquakeListAction = (
    { dataArchiveEarthquakeList }:
    { dataArchiveEarthquakeList: Type.DataArchiveEarthquake[]}) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_EARTHQUAKE_LIST,
    dataArchiveEarthquakeList,
});

export const setDataArchiveEarthquakeFilterAction = (
    { dataArchiveEarthquakeFilters }:
    { dataArchiveEarthquakeFilters: Type.SetDataArchiveEarthquakeFilters['dataArchiveEarthquakeFilters']}) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_EARTHQUAKE_FILTERS,
    dataArchiveEarthquakeFilters,
});

export const setDataArchivePollutionFilterAction = (
    { dataArchivePollutionFilters }:
    { dataArchivePollutionFilters: Type.SetDataArchivePollutionFilters['dataArchivePollutionFilters']}) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_FILTERS,
    dataArchivePollutionFilters,
});

export const setDataArchivePollutionStationAction = (
    { dataArchivePollutionStations }:
    { dataArchivePollutionStations: Type.SetDataArchivePollutionStations['dataArchivePollutionStations']}) => ({
    type: Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_STATIONS,
    dataArchivePollutionStations,
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
    { riskList }: { riskList: Type.Risk[] }) => ({
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

//  REDUCERS

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

export default function routeReducer(
    state = initialState,
    action: Type.PageActionTypes,
): Type.PageState {
    switch (action.type) {
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
        case Type.PageType.RTM__SET_REAL_TIME_RIVER_LIST:
            return setRealTimeRiverList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_EARTHQUAKE_LIST:
            return setRealTimeEarthquakeList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_FIRE_LIST:
            return setRealTimeFireList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_POLLUTION_LIST:
            return setRealTimePollutionList(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_LIST:
            return setDataArchivePollutionList(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_EARTHQUAKE_LIST:
            return setDataArchiveEarthquakeList(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_EARTHQUAKE_FILTERS:
            return setDataArchiveEarthquakeFilters(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_FILTERS:
            return setDataArchivePollutionFilters(state, action);
        case Type.PageType.DA__SET_DATA_ARCHIVE_POLLUTION_STATIONS:
            return setDataArchivePollutionStations(state, action);
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
        default:
            return state;
    }
}
