import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    createRequestCoordinator,
    methods,
} from '@togglecorp/react-rest-request';

import schema from '#schema';
import { sanitizeResponse } from '#utils/common';

export * from '@togglecorp/react-rest-request';

const wsEndpoint = 'https://bipad.nepware.com/api/v1';

const mapStateToProps = () => ({
    // token: {},
});

export const createConnectedRequestCoordinator = () => compose(
    connect(mapStateToProps),
    createRequestCoordinator({
        transformParams: params => params,
        transformProps: (props) => {
            const {
                // token, // eslint-disable-line no-unused-vars
                ...otherProps
            } = props;
            return otherProps;
        },

        transformUrl: (url) => {
            if (/^https?:\/\//i.test(url)) {
                return url;
            }

            return `${wsEndpoint}${url}`;
        },

        transformResponse: (body, request) => {
            const {
                url,
                method,
                extras,
            } = request;

            const sanitizedResponse = sanitizeResponse(body);

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

        transformErrors: (response) => {
            const faramErrors = response.errors;
            return {
                response,
                faramErrors,
            };
        },
    }),
);
