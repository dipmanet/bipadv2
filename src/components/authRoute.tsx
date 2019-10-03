import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from '@reach/router';

import { authStateSelector } from '#selectors';
import { AppState } from '#store/types';
import { AuthState } from '#store/atom/auth/types';

interface AuthRouteProps{
    disableIfAuth?: boolean;
    disableIfNoAuth?: boolean;
}

const mapStateToProps = (state: AppState) => ({
    authState: authStateSelector(state),
});

// eslint-disable-next-line max-len
const authRoute = <T extends AuthRouteProps>(redirectLinkIfNoAuth: string = '/login/', redirectLinkIfAuth: string = '/') => (WrappedComponent: React.ComponentType<T>) => {
    interface PropsFromState {
        authState: AuthState;
    }
    type Props = T & PropsFromState;

    const Component = (props: Props) => {
        const {
            disableIfAuth = false,
            disableIfNoAuth = false,
            authState,
        } = props;
        const { authenticated } = authState;

        if (disableIfAuth && authenticated) {
            return (
                <Redirect
                    to={redirectLinkIfAuth}
                    noThrow
                />
            );
        }
        if (disableIfNoAuth && !authenticated) {
            return (
                <Redirect
                    to={redirectLinkIfNoAuth}
                    noThrow
                />
            );
        }

        return (
            <WrappedComponent
                {...props}
            />
        );
    };

    // Can't fix this idk
    return connect(mapStateToProps)(Component);
};

export default authRoute;
