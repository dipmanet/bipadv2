import { Obj } from '@togglecorp/fujs';

export interface Province {
    id: number;
    bbox: number[];
    centroid: unknown;
    title: string;
}
export interface District {
    id: number;
    bbox: number[];
    centroid: unknown;
    title: string;
    province: number;
}
export interface Municipality {
    id: number;
    bbox: number[];
    centroid: unknown;
    title: string;
    province?: number;
    district: number;
}
export interface Ward {
    id: number;
    // bbox: number[];
    centroid: unknown;
    title: string;
    province?: number;
    district?: number;
    municipality: number;
}
export interface WithHazard {
    id: number;
    hazard: number;
}
export interface HazardType {
    id: number;
    title?: string;
    color?: string;
    icon?: string;
    type?: string;
}
export interface EventType {
    id: number;
}
export interface ResourceType {
}
export interface Event {
    id: number;
    title: string;
    createdOn: string;
    description: string;
    polygon?: unknown;
    point?: unknown;
    hazard?: number;
    severity: string;
}
export interface Alert {
    id: number;
    title: string;
    description?: string;
    hazard: number;
    polygon?: unknown;
    point?: unknown;
    createdOn: string;
}
export interface Incident {
    id: number;
    hazard: number;
    point?: unknown;
    polygon?: unknown;
    loss: Loss;
    incidentOn: string;
}
export interface Resource {
    id: number;
    title: string;
    resourceType: string;
    distance: number;
    point: {
        coordinates: unknown;
    };
}

export interface InventoryCategory {
    id: number;
    title: string;
    description: string;
}

export interface InventoryItem {
    id: number;
    title: string;
    unit: string;
    category: string;
    description: string;
}

export interface Loss {
    estimatedLoss?: number;
    peopleDeathCount?: number;
    livestockDestroyedCount?: number;
    infrastructureDestroyedCount?: number;
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

export interface Region {
    adminLevel?: number;
    geoarea?: number;
}

export interface Filters {
    faramValues: {
        hazard?: number;
        dateRange?: number;
        realtimeSources?: number[];
        event?: number;
    };
    faramErrors: object;
    pristine: boolean;
}

export interface FiltersWithRegion {
    faramValues: {
        hazard?: number;
        dateRange?: number;
        region: Region;
        realtimeSources?: number[];
        event?: number;
    };
    faramErrors: object;
    pristine: boolean;
}

export interface RealTimeRiver {
    id: number;
    point: unknown;
    title: string;
    description?: string;
    basin?: string;
    status?: string;
    steady?: string;
}
export interface RealTimeRain extends RealTimeRiver {
}
export interface RealTimeEarthquake {
    id: number;
    point: unknown;
    address?: string;
    description?: string;
    eventOn?: string;
    magnitude: number;
}

export interface RealTimeFire {
    id: number;
    point: unknown;
    landCover?: string;
    eventOn?: string;
    confidence: number;
    brightness: number;
    scan?: unknown;
}

export interface Measurement {
    unit: string;
    value: number;
    source: string;
    parameter: string;
}
export interface RealTimePollution {
    id: number;
    point: unknown;
    location?: string;
    measuredOn?: string;
    measurements: Measurement[];
    city?: string;
}

export interface DashboardPage {
    alertList: Alert[];
    eventList: Event[];
    filters: Filters;
}

export interface IncidentPage {
    incidentList: Incident[];
    filters: Filters;
}

export interface ResponsePage {
    resourceList: Resource[];
    inventoryCategoryList: InventoryCategory[];
    inventoryItemList: InventoryItem[];
}

export interface LossAndDamage {
    id: number;
}

export interface LossAndDamagePage {
    lossAndDamageList: LossAndDamage[];
    filters: Filters;
}

export interface Risk {
    id: number;
    district: string;
    remoteness: number;
    hdi: number;
    riskScore: number;
}

export interface LpGasCook {
    lpgasCook: number;
    name: string;
}

export interface DisasterProfilePage {
    riskList: Risk[];
    lpGasCookList: LpGasCook[];
}

export interface RealTimeSource {
    id: number;
    title: string;
}

export interface RealTimeMonitoringPage {
    realTimeRainList: RealTimeRain[];
    realTimeRiverList: RealTimeRiver[];
    realTimeEarthquakeList: RealTimeEarthquake[];
    realTimeFireList: RealTimeFire[];
    realTimePollutionList: RealTimePollution[];
    realTimeSourceList: RealTimeSource[];
    filters: Filters;
}

export interface ProjectsProfileFilters {
    faramValues: {
        region?: Region;
        priority?: string;
        subPriority?: string;
        activities?: string;
        drrCycle?: string;
        elements?: string;
        organization?: string;
        status?: string;
    };
    faramErrors: object;
    pristine: boolean;
}
export interface ProjectsProfilePage {
    filters: ProjectsProfileFilters;
}

export interface PageState {
    hidePopup: boolean;
    selectedMapStyle: string;
    mapStyles: MapStyle[];

    region: Region;
    adminLevelList: AdminLevel[];

    provinces: Province[];
    districts: District[];
    municipalities: Municipality[];
    wards: Ward[];

    resourceTypes: Obj<ResourceType>;
    hazardTypes: Obj<HazardType>;
    eventTypes: Obj<EventType>;

    dashboardPage: DashboardPage;
    incidentPage: IncidentPage;
    responsePage: ResponsePage;
    realTimeMonitoringPage: RealTimeMonitoringPage;
    lossAndDamagePage: LossAndDamagePage;
    projectsProfilePage: ProjectsProfilePage;
    disasterProfilePage: DisasterProfilePage;
}

// ACTION TYPES

export enum PageType {
    SET_REGION = 'page/SET_REGION',
    SET_INITIAL_POPUP_HIDDEN = 'page/SET_INITIAL_POPUP_HIDDEN',
    SET_HAZARD_TYPES = 'page/SET_HAZARD_TYPES',
    SET_EVENT_TYPES = 'page/SET_EVENT_TYPES',
    SET_MAP_STYLES = 'page/SET_MAP_STYLES',
    SET_MAP_STYLE = 'page/SET_MAP_STYLE',
    SET_PROVINCES = 'page/SET_PROVINCES',
    SET_DISTRICTS = 'page/SET_DISTRICTS',
    SET_MUNICIPALITIES = 'page/SET_MUNICIPALITIES',
    SET_WARDS = 'page/SET_WARDS',

    // dashboard
    DP__SET_ALERTS = 'page/DASHBOARD/SET_ALERTS',
    DP__SET_EVENTS = 'page/DASHBOARD/SET_EVENTS',
    DP__SET_FILTERS = 'page/DASHBOARD/SET_FILTERS',

    // incident
    IP__SET_INCIDENT_LIST = 'page/INCIDENT_PAGE/SET_INCIDENT_LIST',
    IP__SET_INCIDENT = 'page/INCIDENT_PAGE/SET_INCIDENT',
    IP__SET_FILTERS = 'page/INCIDENT_PAGE/SET_FILTERS',

    // response
    RP__SET_RESOURCE_LIST = 'page/RESOURCE_PAGE/SET_RESOURCE',
    RP__SET_INVENTORY_CATEGOIRES = 'page/RESOURCE_PAGE/SET_INVENTORY_CATEGORIES',
    RP__SET_INVENTORY_ITEMS = 'page/RESOURCE_PAGE/SET_INVENTORY_ITEMS',

    // real time monitoring
    RTM__SET_REAL_TIME_RAIN_LIST = 'page/REAL_TIME_MONITORING/SET_REAL_TIME_RAIN',
    RTM__SET_REAL_TIME_RIVER_LIST = 'page/REAL_TIME_MONITORING/SET_REAL_TIME_RIVER',
    RTM__SET_REAL_TIME_EARTHQUAKE_LIST = 'page/REAL_TIME_MONITORING/SET_REAL_TIME_EARTHQUAKE',
    RTM__SET_REAL_TIME_FIRE_LIST = 'page/REAL_TIME_MONITORING/SET_REAL_TIME_FIRE',
    RTM__SET_REAL_TIME_POLLUTION_LIST = 'page/REAL_TIME_MONITORING/SET_REAL_TIME_POLLUTION',
    RTM__SET_REAL_TIME_FILTERS = 'page/REAL_TIME_MONITORING/SET_REAL_TIME_FILTERS',

    // loss and damage page
    LD__SET_FILTERS = 'page/LOSS_AND_DAMAGE/SET_FILTERS',
    LD__SET_LOSS_AND_DAMAGE_LIST = 'page/LND_PAGE/SET_LOSS_AND_DAMAGE_LIST',

    // projects profile page
    PP__SET_FILTERS = 'page/PROJECTS_PROFILE/SET_FILTERS',

    // // disaster profile page
    DPP__SET_RISK_LIST = 'page/DISASTER_PROFILE/SET_RISK_LIST',
    DPP__SET_LP_GAS_COOK_LIST = 'page/DISASTER_PROFILE/SET_LP_GAS_COOK_LIST',
}

// ACTION CREATOR INTERFACE

export interface SetRegion {
    type: typeof PageType.SET_REGION;
    region: Region;
}

export interface SetInitialPopupHidden {
    type: typeof PageType.SET_INITIAL_POPUP_HIDDEN;
    value: boolean;
}

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

// dashboard

export interface SetDashboardAlertList {
    type: typeof PageType.DP__SET_ALERTS;
    alertList: Alert[];
}

export interface SetEventList {
    type: typeof PageType.DP__SET_EVENTS;
    eventList: Event[];
}

export interface SetDashboardFilters extends FiltersWithRegion {
    type: typeof PageType.DP__SET_FILTERS;
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

export interface SetIncidentFilters extends FiltersWithRegion {
    type: typeof PageType.IP__SET_FILTERS;
}

// response

export interface SetResourceList {
    type: typeof PageType.RP__SET_RESOURCE_LIST;
    resourceList: Resource[];
}

export interface SetInventoryCategoryList {
    type: typeof PageType.RP__SET_INVENTORY_CATEGOIRES;
    inventoryCategoryList: InventoryCategory[];
}

export interface SetInventoryItemList {
    type: typeof PageType.RP__SET_INVENTORY_ITEMS;
    inventoryItemList: InventoryItem[];
}

// real time monitoring

export interface SetRealTimeRainList {
    type: typeof PageType.RTM__SET_REAL_TIME_RAIN_LIST;
    realTimeRainList: RealTimeRain[];
}

export interface SetRealTimeRiverList {
    type: typeof PageType.RTM__SET_REAL_TIME_RIVER_LIST;
    realTimeRiverList: RealTimeRiver[];
}

export interface SetRealTimeEarthquakeList {
    type: typeof PageType.RTM__SET_REAL_TIME_EARTHQUAKE_LIST;
    realTimeEarthquakeList: RealTimeEarthquake[];
}

export interface SetRealTimeFireList {
    type: typeof PageType.RTM__SET_REAL_TIME_FIRE_LIST;
    realTimeFireList: RealTimeFire[];
}

export interface SetRealTimePollutionList {
    type: typeof PageType.RTM__SET_REAL_TIME_POLLUTION_LIST;
    realTimePollutionList: RealTimePollution[];
}

export interface SetRealTimeFilters extends FiltersWithRegion {
    type: typeof PageType.RTM__SET_REAL_TIME_FILTERS;
}

// loss and damage
export interface SetLossAndDamageFilters extends FiltersWithRegion {
    type: typeof PageType.LD__SET_FILTERS;
}

export interface SetLossAndDamageList {
    type: typeof PageType.LD__SET_LOSS_AND_DAMAGE_LIST;
    lossAndDamageList: LossAndDamage[];
}


// projects profile page
export interface SetProjectsProfileFilters extends ProjectsProfileFilters {
    type: typeof PageType.PP__SET_FILTERS;
}

// disaster profile page
export interface SetRiskList {
    type: typeof PageType.DPP__SET_RISK_LIST;
    riskList: Risk[];
}
export interface SetLpGasCookList {
    type: typeof PageType.DPP__SET_LP_GAS_COOK_LIST;
    lpGasCookList: LpGasCook[];
}

export type PageActionTypes = (
    SetRegion | SetInitialPopupHidden |
    SetHazardType | SetMapStyles | SetMapStyle | SetProvinces |
    SetDistricts | SetMunicipalities | SetWards |
    SetDashboardAlertList | SetDashboardFilters | SetIncidentList |
    SetIncident | SetIncidentFilters | SetResourceList | SetEventType |
    SetRealTimeRainList | SetRealTimeRiverList | SetRealTimeEarthquakeList |
    SetRealTimeFireList| SetRealTimePollutionList | SetLossAndDamageFilters |
    SetRealTimeFilters | SetEventList | SetLossAndDamageFilters | SetProjectsProfileFilters |
    SetInventoryCategoryList | SetInventoryItemList | SetLpGasCookList | SetRiskList
);
