import { Obj } from '@togglecorp/fujs';

export interface Province {
}
export interface District {
}
export interface Municipality {
}
export interface Ward {
    // TODO: fill this
    id: number;
}
export interface HazardType {
    // TODO: fill this
    id: number;
}
export interface EventType {
    id: number;
}
export interface ResourceType {
}
export interface Alert {
    hazard: number;
}
export interface Incident {
    id: number;
    hazard: number;
}
export interface Resource {
    title: string;
}

export interface GeoJson {
    type: string;
    features: {
        id: number;
        type: string;
        geometry: object;
    }[];
}

export interface MapStyle {
    name: string;
    style: string;
    color: string;
}

export interface AdminLevel {
    id: number;
    title: string;
}

export interface Filters {
    faramValues: {
        hazard?: number;
        dateRange?: number;
        region?: {
            adminLevel: number;
        };
    };
    faramErrors: object;
    pristine: boolean;
}

export interface DashboardPage {
    alertList: Alert[];
    filters: Filters;
}

export interface IncidentPage {
    incidentList: Incident[];
    filters: Filters;
}

export interface ResponsePage {
    resourceList: Resource[];
}
// INTERFACE

export interface PageState {
    selectedMapStyle: string;
    mapStyles: MapStyle[];

    adminLevelList: AdminLevel[];

    provinces: Province[];
    districts: District[];
    municipalities: Municipality[];
    wards: Ward[];

    resourceTypes: Obj<ResourceType>;
    hazardTypes: Obj<HazardType>;
    eventTypes: Obj<EventType>;
    filters: object;
    geoJsons: {
        district?: GeoJson;
        municipality?: GeoJson;
        province?: GeoJson;
        ward?: GeoJson;
    };

    dashboardPage: DashboardPage;
    incidentPage: IncidentPage;
    responsePage: ResponsePage;
}

// ACTION TYPES

export enum PageType {
    SET_HAZARD_TYPES = 'page/SET_HAZARD_TYPES',
    SET_EVENT_TYPES = 'page/SET_EVENT_TYPES',
    SET_MAP_STYLES = 'page/SET_MAP_STYLES',
    SET_MAP_STYLE = 'page/SET_MAP_STYLE',
    SET_PROVINCES = 'page/SET_PROVINCES',
    SET_DISTRICTS = 'page/SET_DISTRICTS',
    SET_DISTRICTS_GEO_JSON = 'page/SET_DISTRICTS_GEO_JSON',
    SET_MUNICIPALITIES = 'page/SET_MUNICIPALITIES',
    SET_WARDS = 'page/SET_WARDS',

    // dashboard
    DP__SET_ALERTS = 'page/DASHBOARD/SET_ALERTS',
    DP__SET_FILTERS = 'page/DASHBOARD/SET_FILTERS',

    // incident
    IP__SET_INCIDENT_LIST = 'page/INCIDENT_PAGE/SET_INCIDENT_LIST',
    IP__SET_INCIDENT = 'page/INCIDENT_PAGE/SET_INCIDENT',
    IP__SET_FILTERS = 'page/INCIDENT_PAGE/SET_FILTERS',

    // response
    RP__SET_RESOURCE_LIST = 'page/RESOURCE_PAGE/SET_RESOURCE',
}

// ACTION CREATOR INTERFACE

export interface SetHazardType {
    type: typeof PageType.SET_HAZARD_TYPES;
    hazardTypes: HazardType[];
}
export interface SetEventType {
    type: typeof PageType.SET_EVENT_TYPES;
    eventTypes: EventType[];
}

export interface SetMapStyles {
    type: typeof PageType.SET_MAP_STYLES;
    mapStyles: MapStyle[];
}

export interface SetMapStyle {
    type: typeof PageType.SET_MAP_STYLE;
    mapStyle: string;
}

export interface SetProvinces {
    type: typeof PageType.SET_PROVINCES;
    provinces: Province[];
}

export interface SetDistricts {
    type: typeof PageType.SET_DISTRICTS;
    districts: District[];
}

export interface SetMunicipalities {
    type: typeof PageType.SET_MUNICIPALITIES;
    municipalities: Municipality[];
}

export interface SetWards {
    type: typeof PageType.SET_WARDS;
    wards: Ward[];
}

export interface SetDistrictGeoJson {
    type: typeof PageType.SET_DISTRICTS_GEO_JSON;
    districtsGeoJson: GeoJson;
}

// dashboard

export interface SetDashboardAlertList {
    type: typeof PageType.DP__SET_ALERTS;
    alertList: Alert[];
}

export interface SetDashboardFilters {
    type: typeof PageType.DP__SET_FILTERS;
    faramValues: object;
    faramErrors: object;
    pristine: boolean;
}

// incident

export interface SetIncidentList {
    type: typeof PageType.IP__SET_INCIDENT_LIST;
    incidentList: Incident[];
}

export interface SetIncident {
    type: typeof PageType.IP__SET_INCIDENT;
    incident: Incident;
}

export interface SetIncidentFilters {
    type: typeof PageType.IP__SET_FILTERS;
    faramValues: object;
    faramErrors: object;
    pristine: boolean;
}

// response

export interface SetResourceList {
    type: typeof PageType.RP__SET_RESOURCE_LIST;
    resourceList: Resource[];
}

export type PageActionTypes = (
    SetHazardType | SetMapStyles | SetMapStyle | SetProvinces |
    SetDistricts | SetMunicipalities | SetWards | SetDistrictGeoJson |
    SetDashboardAlertList | SetDashboardFilters | SetIncidentList |
    SetIncident | SetIncidentFilters | SetResourceList | SetEventType
);
