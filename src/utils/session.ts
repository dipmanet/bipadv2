import cookies from 'js-cookies';

import { AuthState } from '#store/atom/auth/types';

// eslint-disable-next-line import/prefer-default-export
export const getAuthState = (): AuthState => ({
    sessionId: cookies.getItem('sessionid'),
    csrftoken: cookies.getItem('csrftoken'),
    authenticated: !!cookies.getItem('sessionid'),
});
