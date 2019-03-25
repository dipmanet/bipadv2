import produce from 'immer';
import { listToMap } from '@togglecorp/fujs';

import * as Type from './types';
import initialState from './initialState';

// ACTION CREATORS

export const setHazardTypesAction = (
    { hazardTypes }: { hazardTypes: Type.HazardType[] },
) => ({
    type: Type.PageType.SET_HAZARD_TYPES,
    hazardTypes,
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

// dashboard action creator

export const setAlertListActionDP = ({ alertList }: { alertList: Type.Alert[]}) => ({
    type: Type.PageType.DP__SET_ALERTS,
    alertList,
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

export const setIncidentActionIP = ({ incident }: { incident: Type.Incident}) => ({
    type: Type.PageType.IP__SET_INCIDENT,
    incident,
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

//  REDUCERS

const setHazardTypes = (state: Type.PageState, action: Type.SetHazardType) => {
    const { hazardTypes } = action;
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


export default function routeReducer(
    state = initialState,
    action: Type.PageActionTypes,
): Type.PageState {
    switch (action.type) {
        case Type.PageType.SET_HAZARD_TYPES:
            return setHazardTypes(state, action);
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
        case Type.PageType.DP__SET_ALERTS:
            return setAlertList(state, action);
        case Type.PageType.DP__SET_FILTERS:
            return setDashboardFilters(state, action);
        case Type.PageType.IP__SET_INCIDENT_LIST:
            return setIncidentList(state, action);
        case Type.PageType.IP__SET_INCIDENT:
            return setIncident(state, action);
        case Type.PageType.IP__SET_FILTERS:
            return setIncidentFilters(state, action);
        case Type.PageType.RP__SET_RESOURCE_LIST:
            return setResourceList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_RAIN_LIST:
            return setRealTimeRainList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_RIVER_LIST:
            return setRealTimeRiverList(state, action);
        case Type.PageType.RTM__SET_REAL_TIME_EARTHQUAKE_LIST:
            return setRealTimeEarthquakeList(state, action);
        default:
            return state;
    }
}
