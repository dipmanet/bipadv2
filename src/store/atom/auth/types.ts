// eslint-disable-next-line import/prefer-default-export
export interface AuthState {
    authenticated: boolean;
    sessionId?: string;
    csrftoken?: string;
}

export enum AuthType {
    SET_AUTH = 'auth/SET_AUTH',
}

export interface SetAuthAction {
    type: typeof AuthType.SET_AUTH;
    authState: AuthState;
}

export type AuthActionTypes = SetAuthAction
