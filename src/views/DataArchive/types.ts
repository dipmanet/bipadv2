export type DatePeriod = 'year' | 'month' | 'day';

export interface Geometry {
    type: string;
    coordinates: [number, number];
}
