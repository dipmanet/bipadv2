export type DatePeriod = 'year' | 'month' | 'day';

export interface Geometry {
    type: string;
    coordinates: [number, number];
}

export interface LegendItem {
    key?: string;
    color: string;
    label: string;
    style: string;
    radius?: number;
    order: number;
}
