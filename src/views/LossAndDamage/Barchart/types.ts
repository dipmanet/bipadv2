import { Data } from '../types';

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
    downloadButton?: boolean;
    fullScreenMode?: boolean;
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
export interface ContainerSize {
    width: string;
    height: number | string;
}
