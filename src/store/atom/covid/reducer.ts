import produce from 'immer';

import * as Type from './types';

import initialState from './initialState';

// Covid
export const SetCovidPageAction = covidPage => ({
    type: Type.PageType.SET_COVID_PAGE,
    covidPage,
});

// Covid
const setCovidPage = (state: Type.CovidState, action: Type.SetCovidPage) => {
    const { covidPage: {
        covidIndivisualData,
        covidIndivisualCount,
        covidGroupData,
        covidGroupCount,
    } } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (covidIndivisualData) {
            deferedState.covidPage.covidIndivisualData = covidIndivisualData;
        }
        if (covidIndivisualCount) {
            deferedState.covidPage.covidIndivisualCount = covidIndivisualCount;
        }
        if (covidGroupData) {
            deferedState.covidPage.covidGroupData = covidGroupData;
        }
        if (covidGroupCount) {
            deferedState.covidPage.covidGroupCount = covidGroupCount;
        }
    });
    return newState;
};

export default function routeReducer(
    state = initialState,
    action: Type.PageActionTypes,
): Type.CovidState {
    switch (action.type) {
        case Type.PageType.SET_COVID_PAGE:
            return setCovidPage(state, action);
        default:
            return state;
    }
}
