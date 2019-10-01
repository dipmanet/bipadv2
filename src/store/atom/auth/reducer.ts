import * as Type from './types';

import initialState from './initialState';


// ACTION CREATORS
export function setAuthAction(authState: Type.AuthState): Type.SetAuthAction {
    return {
        type: Type.AuthType.SET_AUTH,
        authState,
    };
}


// REDUCERS
export function setAuth(
    state: Type.AuthState,
    action: Type.SetAuthAction,
): Type.AuthState {
    const { authState } = action;
    // FIXME: this code is fragile, will break with change
    // in auth state structure
    if (
        state.authenticated === authState.authenticated
        && state.csrftoken === authState.csrftoken
        && state.sessionId === authState.sessionId
    ) {
        // NOTE: don't change state if all of the values are same
        return state;
    }
    return authState;
}

export default function routeReducer(
    state: Type.AuthState = initialState,
    action: Type.AuthActionTypes,
): Type.AuthState {
    switch (action.type) {
        case Type.AuthType.SET_AUTH:
            return setAuth(state, action);
        default:
            return state;
    }
}
