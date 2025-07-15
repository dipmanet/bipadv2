import cookies from "js-cookie";

import { AuthState } from "#store/atom/auth/types";

const sessionCookieName = import.meta.env.VITE_APP_SESSION_COOKIE_NAME;

// eslint-disable-next-line import/prefer-default-export
export const getAuthState = (): AuthState => ({
	sessionId: cookies.get(sessionCookieName),
	csrftoken: cookies.get("csrftoken"),
	authenticated: !!cookies.get(sessionCookieName),
});
