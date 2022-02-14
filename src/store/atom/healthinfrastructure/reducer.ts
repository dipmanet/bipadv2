/* eslint-disable max-len */
import produce from 'immer';

import * as Type from './types';

import initialState from './initialState';

// Covid
export const SetHealthInfrastructurePageAction = healthInfrastructurePage => ({
    type: Type.PageType.SET_HEALTH_INFRASTRUCTURE_PAGE,
    healthInfrastructurePage,
});

// Covid
const setHealthInfrastructurePage = (state: Type.HealthInfrastructureState, action: Type.SetHealthInfrastructurePage) => {
    const { healthInfrastructurePage: {
        validationError,
        resourceID,
        healthFormLoader,
        healthFormEditData,
        inventoryData,
        healthTableData,
        healthDataCount,
        healthOverviewTableData,
        healthOverviewChartData,
    } } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (validationError) {
            deferedState.healthInfrastructurePage.validationError = validationError;
        }
        if (typeof validationError !== 'string') {
            deferedState.healthInfrastructurePage.validationError = null;
        }
        if (resourceID) {
            deferedState.healthInfrastructurePage.resourceID = resourceID;
        }
        if (healthFormLoader) {
            deferedState.healthInfrastructurePage.healthFormLoader = healthFormLoader;
        }
        if (healthFormEditData) {
            deferedState.healthInfrastructurePage.healthFormEditData = healthFormEditData;
        }
        if (inventoryData) {
            deferedState.healthInfrastructurePage.inventoryData = inventoryData;
        }
        if (healthTableData) {
            deferedState.healthInfrastructurePage.healthTableData = healthTableData;
        }
        if (healthDataCount) {
            deferedState.healthInfrastructurePage.healthDataCount = healthDataCount;
        }
        if (healthOverviewTableData) {
            deferedState.healthInfrastructurePage.healthOverviewTableData = healthOverviewTableData;
        }
        if (healthOverviewChartData) {
            deferedState.healthInfrastructurePage.healthOverviewChartData = healthOverviewChartData;
        }
    });
    return newState;
};

export default function routeReducer(
    state = initialState,
    action: Type.PageActionTypes,
): Type.HealthInfrastructureState {
    switch (action.type) {
        case Type.PageType.SET_HEALTH_INFRASTRUCTURE_PAGE:
            return setHealthInfrastructurePage(state, action);
        default:
            return state;
    }
}
