import { Obj } from '@togglecorp/fujs';


export interface Field {
    id: number;
    title: string;
}

interface Centroid {
    type: 'Point';
    coordinates: [number, number];
}
type BBox = [number, number, number, number];

// Covid
export interface CovidPage {

    covidIndivisualData: [];
    covidIndivisualCount: number;
}

export interface CovidState {
    covidPage: CovidPage;
}


// ACTION TYPES

// eslint-disable-next-line import/prefer-default-export
export enum PageType {
    // Epidemics
    SET_COVID_PAGE = 'page/COVID/COVID_PAGE',
}

// ACTION CREATOR INTERFACE

// Covid
export interface SetCovidPage {
    type: typeof PageType.SET_COVID_PAGE;
    covidPage: CovidPage;
}

export type PageActionTypes = (
    SetCovidPage
);
