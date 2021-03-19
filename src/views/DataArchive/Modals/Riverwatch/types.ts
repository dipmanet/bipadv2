import * as PageType from '#store/atom/page/types';

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

export interface ArchiveRiver extends PageType.RealTimeRiver {
    station: number;
    waterLevelOn: string;
    stationSeriesId: number;
    ward: number;
    province: Federal;
    district: District;
    municipality: Municipality;
}

export interface Periods {
    periodCode?: string;
    periodName?: string;
}

export interface Errors {
    type?: string;
    err?: string;
    message?: string;
}
export interface FaramValues {
    dataDateRange: {
        startDate: string;
        endDate: string;
    };
    period: Periods;
}

export interface ChartData {
    key: string | number;
    label: string;
    createdOn: string;
    waterLevelOn: string;
    dangerLevel: number;
    warningLevel: number;
    waterLevel: number;
    waterLevelMin: number;
    waterLevelAvg: number;
    waterLevelMax: number;
}
