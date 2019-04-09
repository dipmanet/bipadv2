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
