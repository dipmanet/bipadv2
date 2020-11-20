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

export interface ArchivePollution extends PageType.DataArchivePollution {
    createdOn: string;
    province: Federal;
    district: District;
    point: {
        type: string;
        coordinates: [number, number];
    };
}

export interface Parameters {
    parameterCode: string;
    parameterName: string;
}

export interface Periods {
    periodCode: string;
    periodName: string;
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
