export interface HazardList {
    id: number;
    title: string;
    type: string;
}

export interface RealTimeFilters {
    faramValues: {
        realtimeSources?: number[];
        otherSources?: number[];
    };
    faramErrors: object;
}

export interface ActiveLayer {
    category?: string;
    fullName?: string;
    layername?: string;
    id?: string;
    title?: string;
    scenarioName?: string;
    legendTitle?: string;
}
