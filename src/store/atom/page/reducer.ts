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

export const setDistrictsGeoJsonAction = (
    { districtGeoJson }: { districtGeoJson: Type.GeoJson },
) => ({
    type: Type.PageType.SET_DISTRICTS_GEO_JSON,
    districtGeoJson,
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

export const setFiltesrActionDP = ({ faramValues, faramErrors, pristine }: {
    faramValues: object;
    faramErrors: object;
    pristine: boolean;
}) => ({
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

export const setFiltersActionIP = ({ faramValues, faramErrors, pristine }: {
    faramValues: object;
    faramErrors: object;
    pristine: boolean;
}) => ({
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

const setDistrictsGeoJson = (state: Type.PageState, action: Type.SetDistrictGeoJson) => {
    const { districtsGeoJson } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.geoJsons.district = districtsGeoJson;
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
        if (!deferedState.dashboardPage) {
            // FIXME: find a good way to handle this
            deferedState.dashboardPage = initialState.dashboardPage;
        }
        if (!deferedState.dashboardPage.filters) {
            // FIXME: find a good way to handle this
            deferedState.dashboardPage.filters = initialState.dashboardPage.filters;
        }

        if (faramValues) {
            deferedState.dashboardPage.filters.faramValues = faramValues;
        }
        if (faramErrors) {
            deferedState.dashboardPage.filters.faramErrors = faramErrors;
        }
        if (pristine) {
            deferedState.dashboardPage.filters.pristine = pristine;
        }
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
        if (!deferedState.incidentPage) {
            deferedState.incidentPage = initialState.incidentPage;
        }
        if (!deferedState.incidentPage.filters) {
            deferedState.incidentPage.filters = initialState.incidentPage.filters;
        }

        if (faramValues) {
            deferedState.incidentPage.filters.faramValues = faramValues;
        }
        if (faramErrors) {
            deferedState.incidentPage.filters.faramErrors = faramErrors;
        }
        if (pristine) {
            deferedState.incidentPage.filters.pristine = pristine;
        }
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

// response page

export const setResourceList = (state: Type.PageState, action: Type.SetResourceList) => {
    const {
        resourceList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.responsePage.resourceList = resourceList;
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
        case Type.PageType.SET_MAP_STYLES:
            return setMapStyles(state, action);
        case Type.PageType.SET_MAP_STYLE:
            return setMapStyle(state, action);
        case Type.PageType.SET_PROVINCES:
            return setProvinces(state, action);
        case Type.PageType.SET_DISTRICTS:
            return setDistricts(state, action);
        case Type.PageType.SET_DISTRICTS_GEO_JSON:
            return setDistrictsGeoJson(state, action);
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
        default:
            return state;
    }
}
