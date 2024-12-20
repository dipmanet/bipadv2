/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
import produce from 'immer';

import * as Type from './types';

import initialState from './initialState';

// Covid
export const SetIncidentPageAction = incidentPage => ({
	type: Type.PageType.SET_INCIDENT_PAGE,
	incidentPage,
});

// Covid
const setIncidentPage = (state: Type.IncidentState, action: Type.SetIncidentPage) => {
	const { incidentPage: {
		incidentTableData,
		incidentDataCount,
		incidentFormEditData,
	} } = action;
	const newState = produce(state, (deferedState) => {
		/* eslint-disable no-param-reassign */

		if (incidentTableData) {
			deferedState.incidentPage.incidentTableData = incidentTableData;
		}
		if (incidentDataCount) {
			deferedState.incidentPage.incidentDataCount = incidentDataCount;
		}
		if (incidentFormEditData) {
			deferedState.incidentPage.incidentFormEditData = incidentFormEditData;
		}
	});
	return newState;
};

export default function routeReducer(
	state = initialState,
	action: Type.PageActionTypes,
): Type.IncidentState {
	switch (action.type) {
		case Type.PageType.SET_INCIDENT_PAGE:
			return setIncidentPage(state, action);
		default:
			return state;
	}
}
