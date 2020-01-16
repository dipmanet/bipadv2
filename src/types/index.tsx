import { Layer, LayerGroup, LayerWithGroup } from "#store/atom/page/types";

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

export interface MapState {
    id: number;
    value: {
        value: number;
    };
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
export interface VulnerabilityOption {
    key: string;
    title: string;
    nodes?: VulnerabilityOption[];
    selected: boolean;
}

export interface VulnerabilityType {
    key: string;
    label: string;
    children: VulnerabilityType[];
    isParent?: boolean;
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
