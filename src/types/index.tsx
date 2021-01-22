import {
    LayerGroup,
    LayerWithGroup,
    Alert,
    Event,
    Source,
} from '#store/atom/page/types';

export { AppState } from '#store/types';

export interface RouteDetailElement {
    name: string;
    title: string;
    path: string;
    iconName?: string;
}

export interface BasicElement {
    id: number;
    title: string;
}

export interface MapStateElement {
    id: number;
    value: boolean;
}

export type RegionAdminLevelType = 'province' | 'district' | 'municipality';
export type RegionAdminLevel = 1 | 2 | 3;
export type GeoareaId = number;

export type HazardType = 'natural' | 'non natural';
export interface HazardElement extends BasicElement {
    color: string | null;
    description: string;
    icon: string | null;
    type: HazardType;
}

export interface RegionValueElement {
    adminLevel?: RegionAdminLevel;
    geoarea?: GeoareaId;
}
export interface DataDateRangeValueElement {
    rangeInDays: number | 'custom';
    startDate?: string;
    endDate?: string;
}

export interface FiltersElement {
    hazard: HazardElement['id'][];
    region: RegionValueElement;
    dataDateRange: DataDateRangeValueElement;
}

export interface DAEarthquakeFiltersElement {
    region: RegionValueElement;
    dataDateRange: DataDateRangeValueElement;
    magnitude: number[];
}

export interface DAPollutionFiltersElement {
    station: PollutionStation;
    dataDateRange: DataDateRangeValueElement;
}

export interface PollutionObservation {
    data: {
        aqi: number;
        value: number;
        datatime: string;
    };
    unit: string;
    seriesId: number;
    seriesName: string;
    parameterCode: string;
    parameterName: string;
}

export interface PollutionTags {
    id: number;
    name: string;
    description: string;
}
export interface PollutionStation {
    id: number;
    province: number;
    district: number;
    municipality: number;
    ward: number;
    name: string;
    point: {
        type: string;
        coordinates: [number, number];
    };
    createdOn?: string;
    modifiedOn?: string;
    dateTime?: string;
    nepaliName?: string;
    identifier?: string;
    dataSource?: string;
    aqiColor?: string;
    aqi?: number;
    observation?: PollutionObservation[];
    tags?: PollutionTags[];
    images?: string[];
    elevation?: string | number;
    description?: string;
}

export interface AlertElement extends Alert {}
export interface EventElement extends Event {}

export interface SourceElement extends Source {}

export type LayerType = 'raster' | 'choropleth';
export interface Layer {
    id: number;
    minValue?: number;
    title: string;
    type: LayerType;
    layername: string;
    adminLevel: RegionAdminLevelType;
    opacity: number;
    mapState: MapStateElement[];
    paint: {
        'fill-color': [];
        'fill-opacity': [];
    };
    legend: {
        [key: string]: number;
    };
    legendTitle?: string;
    tooltipRenderer: React.ReactNode;
}

export interface RiskElement {
    key: number;
    title: string;
    description?: string;
}

export interface OpacityElement {
    key: number;
    value: number;
}
export type AttributeKey = 'hazard' | 'exposure' | 'vulnerability' | 'risk' | 'capacity-and-resources' | 'climate-change';

export interface RegionElement {
    id: number;
    centroid: number[];
    title: string;
    code?: string;
}

export interface ProvinceElement extends RegionElement {
    bbox: number[];
}

export interface DistrictElement extends RegionElement {
    province: number;
    bbox: number[];
}

export interface MunicipalityElement extends RegionElement {
    province?: number;
    district: number;
    bbox: number[];
}

export interface WardElement extends RegionElement {
    province?: number;
    district?: number;
    municipality: number;
}

export interface Region {
    adminLevel: number;
    geoarea: number;
}

export interface RegionValues {
    wardId?: number;
    provinceId?: number;
    districtId?: number;
    municipalityId?: number;
}


export interface VulnerabilityItem {
    id: number;
    createdOn: string;
    modifiedOn: string;
    data: VulnerabilityIndicator;
    municipality: number;
}

export interface VulnerabilityIndicator {
    [key: string]: number;
}

export interface NapValue {
    year: number;
    value: number;
}

export interface NapData {
    id: number;
    createdOn: string;
    modifiedOn: string;
    district: number;
    rcp45: NapValue[];
    sdRcp45: NapValue[];
    rcp85: NapValue[];
    sdRcp85: NapValue[];
}

export interface NapAverage {
    id: number;
    value: number;
}

export interface VulnerabilityOption {
    key: string;
    title: string;
    nodes?: VulnerabilityOption[];
    selected: boolean;
}

export interface VulnerabilityType {
    id: string;
    indicatorType: 'positive' | 'negative';
    shortDescription?: string;
    children: VulnerabilityType[];
    isParent?: boolean;
    valueType: 'index' | 'count';
    title: string;
    suffix?: string;
    iconName?: string;
}

export interface LayerHierarchy extends LayerGroup {
    parent: number | null;
    children: LayerHierarchy[] | LayerWithGroup[];
}

export interface LayerMap {
    [key: number]: LayerHierarchy;
}

export interface LegendItem {
    color: string;
    label: string;
}

export interface Scenario {
    key: string;
    label: string;
}

export interface RiskData {
    id: number;
    district: number;
    data: {
        riskScore: number;
    };
}

export interface LandslideDataFeature {
    type: string;
    properties: {};
}

export interface LandslideDataGeoJson {
    type: string;
    features: LandslideDataFeature[];
}

export type ResourceTypeKeys = 'education' | 'health' | 'tourism' | 'industry' | 'finance' | 'governance' | 'communication' | 'cultural' | 'energy' | 'openspace' | 'communityspace';

export type IncidentAttributeType = 'estimatedLoss' | 'incidentCount' | 'livestockDestroyedCount' | 'peopleDeathCount' | 'peopleInjuredCount' | 'peopleMissingCount'| 'totalInfrastructureDestroyedCount';

export interface KeyValue {
    key: string;
    label: string;
    value: number;
}
export interface KeyLabel {
    key: string;
    label: string;
}

export interface EnumItem {
    attribute: string;
    choices: string[];
}
export interface ModelEnum {
    model: string;
    enums: EnumItem[];
}

export interface Flow {
    id: number;
    createdOn: string;
    modifiedOn: string;
    type: string;
    amount: number;
    date: string;
    description: string;
    createdBy: string;
    updatedBy: string;
    receiverOrganization: number;
    providerOrganization: number;
    event: number;
    fiscalYear: number;
}

export interface Organization {
    id: number;
    title: string;
    shortName: string;
    longName: string;
    description: string;
    incidentVerificationDuration: number;
    responsibleFor: unknown;
    wards: unknown;
}

export interface Release {
    id: number;
    createdOn: string;
    modifiedOn: string;
    benificiaryOther: number;
    amount: number;
    description: string;
    providerOrganization: number;
    incident: number;
    ward: number;
    person: number;
    benificiary: number;
    status: number;
}

export interface Person {
    id: number;
    createdOn: string;
    modifiedOn: string;
    status: string;
    name: string;
    age: number;
    gender: string;
    belowPoverty: boolean;
    count: number;
    verified: boolean;
    verificationMessage: string;
    nationality: number;
    ward: number;
    disability: number;
    loss: number;
}

export type Status = 'dead' | 'missing' | 'injured' | 'affected';

export interface CitizenReport {
    id: number;
    description: string;
    comment: string;
    image?: string;
    point: {
        type: 'Point';
        coordinates: [number, number];
    };
    verified: boolean;
    incident?: number;
    hazard: number;
    ward: number;

    createdOn: string;
}
