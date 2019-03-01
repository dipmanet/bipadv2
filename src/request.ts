import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    createRequestCoordinator,
    methods,
} from '@togglecorp/react-rest-request';

import schema from '#schema';
import { sanitizeResponse } from '#utils/common';

const wsEndpoint = 'https://bipad.nepware.com/api/v1';

const mapStateToProps = () => ({
    // myToken: {},
});

// FIXME: get this from react-rest-request
interface CoordinatorAttributes {
    key: string;
    group?: string;

    method: string;
    url: string;
    body?: object;
    query?: { [key: string]: string };
    options?: object;
    extras?: object;

    onSuccess?: (value: { response: object; status: number }) => void;
    onFailure?: (value: { error: object; status: number }) => void;
    onFatal?: (value: { error: object }) => void;
}

// FIXME: don't know why eslint disable is required right now
// eslint-disable-next-line arrow-parens
export const createConnectedRequestCoordinator = <OwnProps>() => {
    type Props = OwnProps & PropsFromDispatch & PropsFromState;
    // type NextProps = Pick<Props, Exclude<keyof OwnProps, 'myToken'>>;
    type NextProps = Props;

    interface PropsFromState {
        // myToken: Token;
    }

    interface PropsFromDispatch {
    }

    return compose(
        connect(mapStateToProps),
        createRequestCoordinator({
            transformParams: (data: CoordinatorAttributes) => {
                const {
                    body,
                    method,
                } = data;
                return {
                    method: method || methods.GET,
                    body: JSON.stringify(body),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                };
            },
            transformProps: (props: Props) => {
                const {
                    // token, // eslint-disable-line no-unused-vars
                    ...otherProps
                } = props;
                return otherProps;
            },

            transformUrl: (url: string) => {
                if (/^https?:\/\//i.test(url)) {
                    return url;
                }

                return `${wsEndpoint}${url}`;
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
        }),
    );
};
export * from '@togglecorp/react-rest-request';
