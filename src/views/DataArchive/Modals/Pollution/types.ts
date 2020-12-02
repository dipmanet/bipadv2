import { number } from 'prop-types';
import * as PageType from '#store/atom/page/types';

export interface Geometry {
    type: string;
    coordinates: [number, number];
}

export interface Federal {
    bbox: [number, number, number, number];
    centroid: {
        type: string;
        coordinates: [number, number];
    };
    code: string;
    id: number;
    order: number;
    title: string;
    titleEn: string;
    titleNe: string;
}

export interface District extends Federal {
    province: number;
}
export interface Municipality extends Federal {
    district: number;
}

export interface Observation {
    data: {
        aqi?: number;
        value: number;
        datatime: string;
    };
    unit: string;
    seriesId: number;
    seriesName: string;
    parameterCode: string;
    parameterName: string;
}
export interface ArchivePollution extends PageType.DataArchivePollution {
    createdOn: string;
    province: Federal;
    district: District;
    municipality: Municipality;
    point: {
        type: string;
        coordinates: [number, number];
    };
    observation: Observation[];
}

export interface Parameters {
    parameterCode?: string;
    parameterName?: string;
}

export interface Periods {
    periodCode?: string;
    periodName?: string;
}

export interface FaramValues {
    dataDateRange: {
        startDate: string;
        endDate: string;
    };
    parameter: Parameters;
    period: Periods;
}

export interface Errors {
    type?: string;
    err?: string;
    message?: string;
}

export interface ChartData {
    key: string | number;
    label: string;
    createdOn: string;
    PM1_I: number;
    PM10_I: number;
    PM25_I: number;
    RH_I: number;
    T: number;
    TSP_I: number;
    WD_I: number;
    WS_I: number;
}
