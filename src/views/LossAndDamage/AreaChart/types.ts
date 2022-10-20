
interface Data {
    incidentMonthTimestamp: string;
    summary: {
        count: number;
        estimatedLoss: number;
        infrastructureDestroyedCount: number;
        livestockDestroyedCount: number;
        peopleDeathCount: number;
        peopleInjuredCount: number;
        peopleMissingCount: number;
    };
}
export interface AreaChartProps {
    data: Data[];
    selectOption: {
        name: string;
        key: string;
    };
    handleSaveClick: (id: string, fileName: string) => void;
    downloadButton?: boolean;
    fullScreenMode?: boolean;
}

export interface TooltipInterface {
    active: boolean;
    payload: {
        value: number;
        name: string;
    }[];
}
