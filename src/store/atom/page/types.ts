// FIXME: common
interface Obj<T>{
    [key: string]: T;
}

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
export interface ResourceType {
}
export interface Alert {
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
    filters: object;
    geoJsons: {
        district?: GeoJson;
        municipality?: GeoJson;
        province?: GeoJson;
        ward?: GeoJson;
    };

    dashboardPage: object;
    incidentPage: object;
    responsePage: object;
}

// ACTION TYPES

export enum PageType {
    SET_HAZARD_TYPES = 'page/SET_HAZARD_TYPES',
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
}

// ACTION CREATOR INTERFACE

export interface SetHazardType {
    type: typeof PageType.SET_HAZARD_TYPES;
    hazardTypes: HazardType[];
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

export type PageActionTypes = (
    SetHazardType | SetMapStyles | SetMapStyle | SetProvinces |
    SetDistricts | SetMunicipalities | SetWards | SetDistrictGeoJson
);
