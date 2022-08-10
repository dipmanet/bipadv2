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

export interface ArchiveRain extends PageType.RealTimeRain {
    station: number;
    measuredOn: string;
    stationSeriesId: number;
    ward: number;
    province: Federal;
    district: District;
    municipality: Municipality;
}

export interface Intervals {
    intervalCode?: string;
    intervalName?: string;
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
    interval: Intervals;
}

export interface ChartData {
    key: string | number;
    label: string;
    createdOn: string;
    measuredOn: string;
    oneHourMin: number;
    oneHourAvg: number;
    oneHourMax: number;
    threeHourMin: number;
    threeHourAvg: number;
    threeHourMax: number;
    sixHourMin: number;
    sixHourAvg: number;
    sixHourMax: number;
    twelveHourMin: number;
    twelveHourAvg: number;
    twelveHourMax: number;
    twentyFourHourMin: number;
    twentyFourHourAvg: number;
    twentyFourHourMax: number;
}
