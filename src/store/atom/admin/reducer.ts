import produce from 'immer';

import * as Type from './types';

import initialState from './initialState';

export const SetAdminPageAction = adminPage => ({
    type: Type.PageType.SET_ADMIN_PAGE,
    adminPage,
});

const setAdminPage = (state: Type.AdminState, action: Type.SetAdminPage) => {
    const { adminPage: {
        adminDataMain,
        postError,
        adminDataMainId,
        errorAdminId,
    } } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (adminDataMain) {
            deferedState.adminPage.adminDataMain = adminDataMain;
        }
        if (postError) {
            deferedState.adminPage.postError = postError;
        }
        if (adminDataMainId) {
            deferedState.adminPage.adminDataMainId = adminDataMainId;
        }
        if (errorAdminId) {
            deferedState.adminPage.errorAdminId = errorAdminId;
        }
    });
    return newState;
};

export default function routeReducer(
    state = initialState,
    action: Type.PageActionTypes,
): Type.AdminState {
    switch (action.type) {
        case Type.PageType.SET_ADMIN_PAGE:
            return setAdminPage(state, action);
        default:
            return state;
    }
}
