/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-tabs */
export interface ScrollTopInitialValues {
	page1ScrolltopValue: number;
	page2ScrolltopValue: number;
	page4ScrolltopValue: number;
	page5ScrolltopValue: number;
	page6ScrolltopValue: number;
	page7ScrolltopValue: number;
	page8ScrolltopValue: number;
	page9ScrolltopValue: number;
	page10ScrolltopValue: number;
	page11ScrolltopValue: number;
	demographicScrolltopValue: number;
}

export interface PostionInitialValues {
	page1PositionValue: number;
	page2PositionValue: number;
	page4PositionValue: number;
	page5PositionValue: number;
	page6PositionValue: number;
	page7PositionValue: number;
	page8PositionValue: number;
	page9PositionValue: number;
	page10PositionValue: number;
	page11PositionValue: number;
	demographicPositionValue: number;
}

export interface Params {
	municipalityId: number;
	setcIData: any;
}
export interface CIDataList {
	id: number;
	point: [];
	title: string;
	resourceType: string;

}

export type CIData = CIDataList[]


export interface OwnProps { }
export interface ReduxProps { }
