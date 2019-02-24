import { compose } from 'redux';
import { connect } from 'react-redux';

import update from '#rsu/immutable-update';

import {
    createRequestCoordinator,
    methods,
} from '@togglecorp/react-rest-request';
import schema from '#schema';
// import { tokenSelector } from '#redux';

export * from '@togglecorp/react-rest-request';

const wsEndpoint = 'http://bipad.nepware.com/api/v1';

const mapStateToProps = state => ({
    // token: tokenSelector(state),
    token: {},
});

export const createConnectedRequestCoordinator = () => compose(
    connect(mapStateToProps),
    createRequestCoordinator({
        transformParams: (params, props) => {
            const { access } = props.token;
            if (!access) {
                return params;
            }

            const settings = {
                headers: { $auto: {
                    Authorization: { $set: `Bearer ${access}` },
                } },
            };

            return update(params, settings);
        },
        transformProps: (props) => {
            const {
                token, // eslint-disable-line no-unused-vars
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
            if (!extras || extras.schemaName === undefined) {
                // NOTE: usually there is no response body for DELETE
                if (method !== methods.DELETE) {
                    console.error(`Schema is not defined for ${url} ${method}`);
                }
            } else {
                try {
                    schema.validate(body, extras.schemaName);
                } catch (e) {
                    console.error(url, method, body, e.message);
                    throw (e);
                }
            }
            return body;
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
