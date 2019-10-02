import * as Type from './types';

import initialState from './initialState';


// ACTION CREATORS
export function setAuthAction(authState: Type.AuthState): Type.SetAuthAction {
    return {
        type: Type.AuthType.SET_AUTH,
        authState,
    };
}

export function setUserDetailAction(user: Type.User): Type.SetUserDetailAction {
    return {
        type: Type.AuthType.SET_USER_DETAIL,
        user,
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
        // NOTE: this will clear out all user detail
        return state;
    }
    return authState;
}

export function setUserDetail(
    state: Type.AuthState,
    action: Type.SetUserDetailAction,
): Type.AuthState {
    const { user } = action;

    return {
        ...state,
        user,
    };
}

export default function routeReducer(
    state: Type.AuthState = initialState,
    action: Type.AuthActionTypes,
): Type.AuthState {
    switch (action.type) {
        case Type.AuthType.SET_AUTH:
            return setAuth(state, action);
        case Type.AuthType.SET_USER_DETAIL:
            return setUserDetail(state, action);
        default:
            return state;
    }
}
