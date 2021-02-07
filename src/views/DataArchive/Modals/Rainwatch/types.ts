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
    stationSeriesId: number;
    ward: number;
    province: Federal;
    district: District;
    municipality: Municipality;
}
