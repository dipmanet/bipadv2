interface Ward {
    id: number;
    bbox: number[];
    centroid: Centroid;
    title: string;
    municipality: number;
}

interface Centroid {
    type: string;
    coordinates: number[];
}

interface Point {
    type: string;
    coordinates: number[];
}

interface Loss {
    id: number;
    peopleDeathCount: number;
    peopleDeathMaleCount: number;
    peopleDeathFemaleCount: number;
    peopleDeathOtherCount: number;
    peopleDeathUnknownCount: number;
    peopleDeathDisabledCount: number;
    peopleMissingCount: number;
    peopleMissingMaleCount: number;
    peopleMissingFemaleCount: number;
    peopleMissingOtherCount: number;
    peopleMissingUnknownCount: number;
    peopleMissingDisabledCount: number;
    peopleInjuredCount: number;
    peopleInjuredMaleCount: number;
    peopleInjuredFemaleCount: number;
    peopleInjuredOtherCount: number;
    peopleInjuredUnknownCount: number;
    peopleInjuredDisabledCount: number;
    peopleAffectedCount: number;
    familyAffectedCount: number;
    familyRelocatedCount: number;
    familyEvacuatedCount: number;
    livestockDestroyedCount: number;
    infrastructureDestroyedCount: number;
    infrastructureDestroyedHouseCount: number;
    infrastructureAffectedHouseCount: number;
    infrastructureDestroyedRoadCount: number;
    infrastructureAffectedRoadCount: number;
    infrastructureDestroyedBridgeCount: number;
    infrastructureAffectedBridgeCount: number;
    infrastructureDestroyedElectricityCount: number;
    infrastructureAffectedElectricityCount: number;
    infrastructureEconomicLoss: number;
    agricultureEconomicLoss: number;
    createdOn: string;
    modifiedOn: string;
    estimatedLoss: number;
}

interface HazardInfo {
    id: number;
    title: string;
    titleEn: string;
    titleNe: string;
    order: number;
    description: string;
    icon: string;
    color: string;
    type: string;
}
interface Data {
    id: number;
    title: string;
    wards: Ward[];
    point: Point;
    createdOn: string;
    modifiedOn: string;
    titleNe: string;
    verified: boolean;
    approved: boolean;
    incidentOn: number;
    reportedOn: string;
    streetAddress: string;
    needFollowup: boolean;
    dataSourceId: number;
    dataSource: string;
    source: string;
    hazard: number;
    loss: Loss;
    ward: number;
    municipality: number;
    district: number;
    province: number;
    wardTitle: string;
    municipalityTitle: string;
    districtTitle: string;
    provinceTitle: string;
    hazardInfo: HazardInfo;
}

interface IndividualChartData {
    name: string;
    value: string;
}
export type ChartData = IndividualChartData[];

export interface RadioValue {
    name: string;
    id: number;
    adminLevel?: number;
}

export interface BarchartProps {
    data: Data[];
    selectOption: {
        name: string;
        key: string;
    };
    regionRadio: RadioValue;
    valueOnclick: {
        value: string;
        index: number;
    };
    className: React.CSSProperties;
    handleSaveClick: (id: string, fileName: string) => void;
    downloadButton: boolean;
}
export interface TooltipInterface {
    active: boolean;
    payload: {
        payload: {
            value: number;
            name: string;
        };
    }[];
}
