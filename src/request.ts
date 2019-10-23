import {
    createRequestCoordinator,
    methods,
    CoordinatorAttributes,
} from '@togglecorp/react-rest-request';
import { AppState } from '#store/types';

import store from '#store';
import {
    mapStyleSelector,
} from '#selectors';

import schema from '#schema';
import { sanitizeResponse } from '#utils/common';
import { getAuthState } from '#utils/session';

const wsEndpoint = process.env.REACT_APP_API_SERVER_URL;
const domain = process.env.REACT_APP_DOMAIN;

// FIXME: don't know why eslint disable is required right now
// eslint-disable-next-line arrow-parens
export function createConnectedRequestCoordinator<OwnProps>() {
    type Props = OwnProps;

    const requestor = createRequestCoordinator({
        transformParams: (data: CoordinatorAttributes) => {
            const {
                body,
                method,
            } = data;
            const cookies = getAuthState();

            return {
                method: method || methods.GET,
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-CSRFToken': cookies.csrftoken,
                },
            };
        },
        transformProps: (props: Props) => {
            const mapStyle = mapStyleSelector(store.getState() as AppState);
            // console.warn('Map style is', mapStyle);
            return props;
        },

        transformUrl: (url: string) => {
            if (/^https?:\/\//i.test(url)) {
                return url;
            }

            if (!wsEndpoint || !domain) {
                return '';
            }

            // Get current client sub-domain and prefix api endpoint with
            // that sub-domain

            const { hostname } = window.location;
            const index = hostname.search(`.${domain}`);
            const subDomain = index !== -1
                ? hostname.substring(0, index)
                : undefined;

            if (!subDomain) {
                return `${wsEndpoint}${url}`;
            }

            const escapedDomain = domain.replace(/\./g, '\\.');
            const newWsEndpoint = wsEndpoint.replace(
                new RegExp(escapedDomain), `${subDomain}.${domain}`,
            );
            return `${newWsEndpoint}${url}`;
        },

        transformResponse: (body: object, request: CoordinatorAttributes) => {
            const {
                url,
                method,
                extras: requestOptions,
            } = request;
            const sanitizedResponse = sanitizeResponse(body);

            const extras = requestOptions as { schemaName?: string };
            if (!extras || extras.schemaName === undefined) {
                // NOTE: usually there is no response body for DELETE
                if (method !== methods.DELETE) {
                    console.error(`Schema is not defined for ${url} ${method}`);
                }
            } else {
                try {
                    schema.validate(sanitizedResponse, extras.schemaName);
                } catch (e) {
                    console.error(url, method, sanitizedResponse, e.message);
                    throw (e);
                }
            }

            return sanitizedResponse;
        },

        transformErrors: (response: { errors: string[] }) => {
            const faramErrors = response.errors;
            return {
                response,
                faramErrors,
            };
        },
    });

    return requestor;
}

export * from '@togglecorp/react-rest-request';
