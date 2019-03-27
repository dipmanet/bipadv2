import Cookies from 'js-cookies';

export const getSessionId = (): string => Cookies.get('sessionId');

export const getCsrfToken = (): string => Cookies.get('csrftoken');

export const isLoggedIn = (): boolean => !!Cookies.get('sessionId');
