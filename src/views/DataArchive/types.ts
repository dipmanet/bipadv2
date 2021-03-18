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

export interface OsmStyle {
    version: number;
    name: string;
    sources: {
        'raster-tiles': {
            type: string;
            tiles: string[];
            tileSize: number;
        };
    };
    sprite: string;
    glyphs: string;
    layers: {
        id: string;
        type: string;
        source: string;
        minzoom: number;
        maxzoom: number;
    }[];
    id: string;
}
