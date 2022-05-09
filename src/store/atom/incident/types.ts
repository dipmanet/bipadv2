/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/indent */
export interface Field {
	id: number;
	title: string;
}

interface Centroid {
	type: 'Point';
	coordinates: [number, number];
}
type BBox = [number, number, number, number];

export interface IncidentPage {
	incidentTableData: [];
	incidentDataCount: null;
	incidentFormEditData: {};
}

export interface IncidentState {
	incidentPage: IncidentPage;
}
// ACTION TYPES

// eslint-disable-next-line import/prefer-default-export
export enum PageType {
	SET_INCIDENT_PAGE = 'page/INCIDENT/INCIDENT_PAGE',
}

// ACTION CREATOR INTERFACE

export interface SetIncidentPage {
	type: typeof PageType.SET_INCIDENT_PAGE;
	incidentPage: IncidentPage;
}

export type PageActionTypes = (
	SetIncidentPage
);
