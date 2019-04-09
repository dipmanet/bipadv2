import { AuthState } from './types';

const state: AuthState = {
    authenticated: false,
    sessionId: undefined,
    csrftoken: undefined,
};

export default state;
