import { Obj } from '@togglecorp/fujs';
import { FiltersElement, ResourceTypeKeys, ModelEnum, KeyValue } from '#types';

export interface Field {
    id: number;
    title: string;
}

interface Centroid {
    type: 'Point';
    coordinates: [number, number];
}
type BBox = [number, number, number, number];

export interface Bulletin {
    sitRep: number;
    incidentSummary: {
        numberOfIncidents: number;
        numberOfDeath: number;
        numberOfMissing: number;
        numberOfInjured: number;
        estimatedLoss: number;
        roadBlock: number;
        cattleLoss: number;
    };
    peopleLoss: {
        p1: {
            death: number;
            missing: number;
            injured: number;
        };
        p2: {
            death: number;
            missing: number;
            injured: number;
        };
        bagmati: {
            death: number;
            missing: number;
            injured: number;
        };
        gandaki: {
            death: number;
            missing: number;
            injured: number;
        };
        lumbini: {
            death: number;
            missing: number;
            injured: number;
        };
        karnali: {
            death: number;
            missing: number;
            injured: number;
        };
        sudurpaschim: {
            death: number;
            missing: number;
            injured: number;
        };
    };
    hazardWiseLoss: {
        hazard: {
            deaths: number;
            incidents: number;
        };

    };
    genderWiseLoss: {
        male: number;
        female: number;
        unknown: number;
    };
    covid24hrsStat: {
        affected: number;
        femaleAffected: number;
        maleAffected: number;
        deaths: number;
        recovered: number;
    };
    covidTotalStat: {
        totalAffected: number;
        totalActive: number;
        totalRecovered: number;
        totalDeaths: number;
    };
    vaccineStat: {
        firstDosage: number;
        secondDosage: number;
    };
    covidProvinceWiseTotal: {
        p1: {
            totalAffected: number;
            totalActive: number;
            totalDeaths: number;
        };
        p2: {
            totalAffected: number;
            totalActive: number;
            totalDeaths: number;
        };
        bagmati: {
            totalAffected: number;
            totalActive: number;
            totalDeaths: number;
        };
        gandaki: {
            totalAffected: number;
            totalActive: number;
            totalDeaths: number;
        };
        lumbini: {
            totalAffected: number;
            totalActive: number;
            totalDeaths: number;
        };
        karnali: {
            totalAffected: number;
            totalActive: number;
            totalDeaths: number;
        };
        sudurpaschim: {
            totalAffected: number;
            totalActive: number;
            totalDeaths: number;
        };
    };
    tempMin: string;
    tempMax: string;
    feedback: string[];
    province: number;
    district: number;
    municipality: number;
    ward: number;
}

export interface Province {
    id: number;
    bbox: BBox;
    centroid: Centroid;
    title: string;
    code?: string;
}
export interface District {
    id: number;
    bbox: BBox;
    centroid: Centroid;
    title: string;
    province: number;
    code?: string;
}
export interface Municipality {
    id: number;
    bbox: BBox;
    centroid: Centroid;
    title: string;
    province?: number;
    district: number;
    code?: string;
}
export interface Ward {
    id: number;
    // bbox: BBox;
    centroid: Centroid;
    title: string;
    province?: number;
    district?: number;
    municipality: number;
}
export interface WithHazard {
    id: number;
    hazard?: number;
}
export interface HazardType extends Field {
    color?: string;
    icon?: string;
    type?: string;
}
export interface EventType extends Field {
}
export interface SeverityType extends Field {
}
export interface ResourceType extends Field {
    id: number;
    title: ResourceTypeKeys;
}
export interface DocumentCategory extends Field {
}
export interface DocumentItem {
    id: number;
    title: string;
    region: 'national' | 'province' | 'district' | 'municipality';
    file: string;
    publishedDate: string;
    category: number;
    province: number;
    district: number;
    municipality: number;
    event: number;
}

export interface Event extends Field {
    createdOn: string;
    description: string;
    polygon?: unknown;
    point?: unknown;
    hazard: number;
    severity: string;
}
export interface Alert extends Field {
    description?: string;
    hazard: number;
    polygon?: unknown;
    point?: unknown;
    createdOn: string;
    startedOn: string;
}
export interface Source {
    id: string;
    title: string;
}
export interface Status extends Field {
}
export interface Gender extends Field {
}
export interface Country extends Field {
}
export interface AgricultureLossType extends Field{
}

export interface InfrastructureType extends Field {
}

export interface Incident {
    id: number;
    title: string;
    streetAddress: string;
    source: string;
    hazard: number;
    point?: unknown;
    polygon?: unknown;
    loss: Loss;
    incidentOn: string;

    unacknowledgedFeedbackCount?: number;
    totalFeedbackCount?: number;
}

export interface Resource extends Field {
    id: number;
    title: string;
    description: string;
    resourceType: string;
    ward: number;
    point: {
        type: string;
        coordinates: [number, number];
    };
}

export interface Layer extends Field {
    category: string;
    'type': string;
    description: string;
    workspace: string;
    layername: string;
    'public': boolean;
    group: number;
    hazard: number;
}

export interface LayerGroup extends Field {
    category: string;
    shortDescription: string;
    longDescription: string;
    parent: number | null;
}

export interface LayerMap {
    [category: string]: Layer;
}

export interface LayerWithGroup extends Field {
    category: string;
    'type': string;
    workspace: string;
    layername: string;
    'public': boolean;
    group: LayerGroup;
    hazard: number;
}

export interface InventoryCategory {
    id: number;
    title: string;
    description: string;
}

export interface InventoryItem extends Field {
    unit: string;
    category: string;
    description: string;
}

export interface Inventory {
    id: number;
    item: InventoryItem;
    itemId: number;
    createdOn: string;
    modifiedOn: string;
    quantity: number;
    description?: string;
    resource: number;
}

export interface Loss {
    id: number;
    description?: string;
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
        otherSources?: number[];
        event?: number;
    };
    faramErrors: object;
    pristine: boolean;
}

export interface RealTimeRiver {
    id: number;
    createdOn: string;
    modifiedOn: string;
    title: string;
    basin: string;
    stationId?: number; // TODO: remove ? when station id is sent by api
    district?: string; // TODO: remove ? when district is sent by a
    waterLevel: number;
    point: Point;
    image: string;
    status: string;
    steady: string;
    description: string;
    elevation?: number;
    dangerLevel?: number;
    warningLevel?: number;
    waterLevelOn: string | number;
}

export interface Point {
    type: string;
    coordinates: number[];
}
export interface RealTimeRiverDetails {
    id: number;
    createdOn: string;
    modifiedOn: string;
    title: string;
    basin: string;
    point: Point;
    waterLevel: number;
    image: string;
    status: string;
    steady: string;
    description: string;
    elevation?: number;
    dangerLevel?: number;
    warningLevel?: number;
    waterLevelOn: number;
}

export interface WaterLevelAverage {
    value: number;
    status: {
        danger: boolean;
        warning: boolean;
    };
    interval: number;
}

export interface RealTimeRainDetails {
    id: number;
    createdOn: number;
    modifiedOn: string;
    title: string;
    basin: string;
    point: Point;
    image: string;
    status: string;
    description: string;
    elevation: number;
    averages: WaterLevelAverage[];
}

export interface RealTimeRain {
    id: number;
    createdOn: string | number;
    modifiedOn: string;
    title: string;
    basin: string;
    point: Point;
    image: string;
    status: string;
    description: string;
    elevation?: number;
    averages: WaterLevelAverage[];

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
    aqi: number;
    location?: string;
    measuredOn?: string;
    measurements?: Measurement[];
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

export interface ProfileContactFilters {
    faramValues: {
        region?: Region;
    };
    faramErrors: object;
    pristine: boolean;
}

export interface ProfileContactPage {
    contactList: Contact[];
    filters: ProfileContactFilters;
}

export interface RealTimeSource {
    id: number;
    title: string;
}

export interface OtherSource {
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
    otherSourceList: OtherSource[];
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
    carKeys: [];
    region: Region;
    filters: FiltersElement;

    adminLevelList: AdminLevel[];

    documentCategoryList: DocumentCategory[];

    showProvince: boolean;
    showDistrict: boolean;
    showMunicipality: boolean;
    showWard: boolean;

    provinces: Province[];
    districts: District[];
    municipalities: Municipality[];
    wards: Ward[];
    lossList: Loss[];
    sourceList: Source[];
    severityList: SeverityType[];
    peopleLossStatusList: Status[];
    agricultureLossStatusList: Status[];
    agricultureLossTypeList: AgricultureLossType[];
    countryList: Country[];
    genderList: Gender[];

    resourceTypeList: ResourceType[];
    hazardTypes: Obj<HazardType>;
    enumList: ModelEnum[];

    dashboardPage: DashboardPage;
    incidentPage: IncidentPage;
    responsePage: ResponsePage;
    realTimeMonitoringPage: RealTimeMonitoringPage;
    lossAndDamagePage: LossAndDamagePage;
    projectsProfilePage: ProjectsProfilePage;
    disasterProfilePage: DisasterProfilePage;
    profileContactPage: ProfileContactPage;
    bulletinPage: Bulletin;
    bulletinEditData: Bulletin;

}

// ACTION TYPES

// eslint-disable-next-line import/prefer-default-export
export enum PageType {
    SET_REGION = 'page/SET_REGION',
    SET_INITIAL_POPUP_HIDDEN = 'page/SET_INITIAL_POPUP_HIDDEN',
    SET_HAZARD_TYPES = 'page/SET_HAZARD_TYPES',
    SET_DASHBOARD_HAZARD_TYPES = 'page/SET_DASHBOARD_HAZARD_TYPES',
    SET_EVENT_TYPES = 'page/SET_EVENT_TYPES',
    SET_MAP_STYLES = 'page/SET_MAP_STYLES',
    SET_MAP_STYLE = 'page/SET_MAP_STYLE',
    SET_PROVINCES = 'page/SET_PROVINCES',
    SET_DISTRICTS = 'page/SET_DISTRICTS',
    SET_MUNICIPALITIES = 'page/SET_MUNICIPALITIES',
    SET_WARDS = 'page/SET_WARDS',
    SET_LOSS_LIST = 'page/SET_LOSS_LIST',
    SET_DOCUMENT_CATEGORY_LIST = 'page/SET_DOCUMENT_CATEGORY_LIST',
    SET_COUNTRY_LIST = 'page/SET_COUNTRY_LIST',
    SET_AGRICULTURE_LOSS_TYPE_LIST = 'page/SET_AGRICULTURE_LOSS_TYPE_LIST',

    SET_SHOW_PROVINCE = 'page/SET_SHOW_PROVINCE',
    SET_SHOW_DISTRICT = 'page/SET_SHOW_DISTRICT',
    SET_SHOW_MUNICIPALITY = 'page/SET_SHOW_MUNICIPALITY',
    SET_SHOW_WARD = 'page/SET_SHOW_WARD',

    SET_FILTERS = 'page/SET_FILTERS',
    SET_CAR_KEYS = 'page/SET_CAr_KEYS',
    SET_ENUM_OPTIONS = 'page/SET_ENUM_OPTIONS',

    // dashboard
    DP__SET_ALERTS = 'page/DASHBOARD/SET_ALERTS',
    DP__SET_EVENTS = 'page/DASHBOARD/SET_EVENTS',
    DP__SET_FILTERS = 'page/DASHBOARD/SET_FILTERS',

    // incident
    IP__SET_INCIDENT_LIST = 'page/INCIDENT_PAGE/SET_INCIDENT_LIST',
    IP__SET_INCIDENT = 'page/INCIDENT_PAGE/SET_INCIDENT',
    IP__REMOVE_INCIDENT = 'page/INCIDENT_PAGE/REMOVE_INCIDENT',
    IP__PATCH_INCIDENT = 'page/INCIDENT_PAGE/PATCH_INCIDENT',
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
    LD__SET_LOSS_AND_DAMAGE_LIST = 'page/LOSS_AND_DAMAGE/SET_LOSS_AND_DAMAGE_LIST',

    // projects profile page
    PP__SET_FILTERS = 'page/PROJECTS_PROFILE/SET_FILTERS',

    // // disaster profile page
    DPP__SET_RISK_LIST = 'page/DISASTER_PROFILE/SET_RISK_LIST',
    DPP__SET_LP_GAS_COOK_LIST = 'page/DISASTER_PROFILE/SET_LP_GAS_COOK_LIST',

    // Profile contact page
    PCP__SET_CONTACT_LIST = 'page/PROFILE_CONTACT/SET_CONTACT_LIST',
    PCP__SET_FILTERS = 'page/PROFILE_CONTACT/SET_FILTERS',

    // Risk info capacity and resource page
    RIC__SET_CAR_KEYS = 'page/RISKINFO_CAR/SET_CAR_KEYS',

    // Bulletin
    ADMIN__PORTAL_BULLETIN = 'page/ADMIN__PORTAL_BULLETIN',
    ADMIN__PORTAL_BULLETIN_COVID = 'page/ADMIN__PORTAL_BULLETIN_COVID',
    ADMIN__PORTAL_BULLETIN_FEEDBACK = 'page/ADMIN__PORTAL_BULLETIN_FEEDBACK',
    ADMIN__PORTAL_BULLETIN_TEMPERATURE = 'page/ADMIN__PORTAL_BULLETIN_TEMPERATURE',
    ADMIN__PORTAL_BULLETIN_EDIT_DATA = 'page/ADMIN__PORTAL_BULLETIN_EDIT_DATA',
}

// ACTION CREATOR INTERFACE

export interface SetFilters {
    type: typeof PageType.SET_FILTERS;
    filters: FiltersElement;
}

export interface SetBulletinData {
    type: typeof PageType.ADMIN__PORTAL_BULLETIN;
    bulletinData: Bulletin;
}

export interface SetBulletinEditData {
    type: typeof PageType.ADMIN__PORTAL_BULLETIN_EDIT_DATA;
    bulletinEditData: Bulletin;
}

export interface SetBulletinDataCovid {
    type: typeof PageType.ADMIN__PORTAL_BULLETIN_COVID;
    bulletinData: Bulletin;
}
export interface SetBulletinDataFeedback {
    type: typeof PageType.ADMIN__PORTAL_BULLETIN_FEEDBACK;
    bulletinData: Bulletin;
}
export interface SetBulletinDataTemperature {
    type: typeof PageType.ADMIN__PORTAL_BULLETIN_TEMPERATURE;
    bulletinData: Bulletin;
}

export interface SetCarKeys {
    type: typeof PageType.SET_CAR_KEYS;
    filters: [];
}

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

export interface SetDashboardHazardType {
    type: typeof PageType.SET_DASHBOARD_HAZARD_TYPES;
    hazardTypes: HazardType[];
}

export interface SetEnumOptionsType {
    type: typeof PageType.SET_ENUM_OPTIONS;
    enumList: ModelEnum[];
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

export interface SetShowProvince {
    type: typeof PageType.SET_SHOW_PROVINCE;
    value: boolean;
}
export interface SetShowDistrict {
    type: typeof PageType.SET_SHOW_DISTRICT;
    value: boolean;
}
export interface SetShowMunicipality {
    type: typeof PageType.SET_SHOW_MUNICIPALITY;
    value: boolean;
}
export interface SetShowWard {
    type: typeof PageType.SET_SHOW_WARD;
    value: boolean;
}

export interface SetDocumentCategoryList {
    type: typeof PageType.SET_DOCUMENT_CATEGORY_LIST;
    documentCategoryList: DocumentCategory[];
}

export interface SetCountryList {
    type: typeof PageType.SET_COUNTRY_LIST;
    countryList: Country[];
}

export interface SetAgricultureLossTypeList {
    type: typeof PageType.SET_AGRICULTURE_LOSS_TYPE_LIST;
    agricultureLossTypeList: AgricultureLossType[];
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

export interface RemoveIncident {
    type: typeof PageType.IP__REMOVE_INCIDENT;
    incidentId: Incident['id'];
}

export interface PatchIncident {
    type: typeof PageType.IP__PATCH_INCIDENT;
    incident: Incident;
    incidentId: number;
}

export interface SetIncidentFilters extends FiltersWithRegion {
    type: typeof PageType.IP__SET_FILTERS;
}

export interface SetLossList {
    type: typeof PageType.SET_LOSS_LIST;
    lossList: Loss[];
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

export interface Organization {
    id: number;
    title: string;
    shortName?: string;
    longName?: string;
    description?: string;
    incidentVerificationDuration: number;
}

export interface Contact {
    indexValue: number;
    committee: 'PDMC' | 'DDMC' | 'LDMC' | 'WDMC' | 'CDMC' | 'non_committee';
    email: string;
    id: number;
    image?: string;
    mobileNumber: string;
    name: string;
    point?: number[];
    position: string;
    trainings: Training[];
    province?: number;
    district?: number;
    municipality?: number;
    ward?: number;
    workNumber: string;
    isDrrFocalPerson: boolean;
    organization: Organization;
}

export interface Training {
    id: number;
    title: 'LSAR' | 'rapid_assessment' | 'first_aid' | 'fire_fighting';
    durationDays: number;
    contact: number;
}

export interface SetProfileContactList {
    type: typeof PageType.PCP__SET_CONTACT_LIST;
    contactList: Contact[];
}

export interface SetProfileContactFilters extends ProfileContactFilters {
    type: typeof PageType.PCP__SET_FILTERS;
}

export type PageActionTypes = (
    SetRegion | SetInitialPopupHidden | SetBulletinData |
    SetHazardType | SetMapStyles | SetMapStyle | SetProvinces |
    SetDistricts | SetMunicipalities | SetWards |
    SetShowProvince | SetShowDistrict | SetShowMunicipality | SetShowWard |
    SetDashboardAlertList | SetDashboardFilters | SetIncidentList |
    SetIncident | RemoveIncident | PatchIncident |
    SetIncidentFilters | SetResourceList | SetEventType |
    SetRealTimeRainList | SetRealTimeRiverList | SetRealTimeEarthquakeList |
    SetRealTimeFireList| SetRealTimePollutionList | SetLossAndDamageFilters |
    SetRealTimeFilters | SetEventList | SetLossAndDamageFilters | SetProjectsProfileFilters |
    SetInventoryCategoryList | SetInventoryItemList | SetLpGasCookList | SetRiskList |
    SetLossAndDamageList | SetProfileContactList | SetProfileContactFilters | SetLossList |
    SetDocumentCategoryList | SetCountryList | SetAgricultureLossTypeList | SetEnumOptionsType |
    SetDashboardHazardType | SetBulletinDataCovid
    | SetBulletinDataFeedback | SetBulletinDataTemperature | SetBulletinEditData
);
