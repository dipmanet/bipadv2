export interface HazardDetail {
    id: number;
    title: string;
    titleEn: string;
    titleNe: string;
    description: string;
    icon: string;
    color: string;
    type: string;
}

export interface Summary {
    count: number;
    peopleDeathCount: number;
    estimatedLoss: number;
    infrastructureDestroyedCount: number;
    livestockDestroyedCount: number;
    peopleInjuredCount: number;
    peopleMissingCount: number;
}

export interface Data {
    hazardDetail: HazardDetail;
    summary: Summary;
}
