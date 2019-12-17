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
