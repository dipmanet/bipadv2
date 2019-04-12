import cookies from 'js-cookie';

import { AuthState } from '#store/atom/auth/types';

// eslint-disable-next-line import/prefer-default-export
export const getAuthState = (): AuthState => ({
    sessionId: cookies.get('sessionid'),
    csrftoken: cookies.get('csrftoken'),
    authenticated: !!cookies.get('sessionid'),
});
