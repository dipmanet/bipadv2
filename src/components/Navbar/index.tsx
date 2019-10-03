import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';

import { routeSettings, iconNames } from '#constants';
import { authStateSelector } from '#selectors';
import { setAuthAction } from '#actionCreators';
import { AppState } from '#store/types';
import { AuthState } from '#store/atom/auth/types';

import { getAuthState } from '#utils/session';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import Logo from './Logo';
import MenuItem from './MenuItem';

import styles from './styles.scss';

const adminEndpoint = process.env.REACT_APP_ADMIN_LOGIN_URL;

const pages = routeSettings.filter(setting => !!setting.navbar) as Menu[];

interface Menu {
    title: string;
    name: string;
    path: string;
    iconName: string;
    disabled: boolean;
}

interface State {
}

interface Params {
}

interface OwnProps {
    className?: string;
}

interface PropsFromState {
    authState: AuthState;
}
interface PropsFromDispatch {
    setAuth: typeof setAuthAction;
}

type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch;

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState) => ({
    authState: authStateSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAuth: params => dispatch(setAuthAction(params)),
});

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    logoutRequest: {
        url: '/auth/logout/',
        method: methods.POST,
        onSuccess: ({ props }) => {
            const authState = getAuthState();
            const { setAuth } = props;
            setAuth(authState);
        },
        onFailure: ({ error }) => {
            // TODO: handle error
            console.warn('failure', error);
        },
        onFatal: () => {
            console.warn('fatal');
        },
    },
};

const menuKeySelector = (d: {name: string}) => d.name;

class Navbar extends React.PureComponent<Props, State> {
    private menuRendererParams = (_: string, data: Menu) => ({
        title: data.title,
        link: data.path,
        iconName: data.iconName,
        disabled: data.disabled,
    });

    public render() {
        const {
            className,
            authState,
            requests: {
                logoutRequest,
            },
        } = this.props;

        const { authenticated, user } = authState;

        return (
            <React.Fragment>
                <nav className={_cs(styles.navbar, className)}>
                    <Logo />
                    <ListView
                        data={pages}
                        keySelector={menuKeySelector}
                        renderer={MenuItem}
                        rendererParams={this.menuRendererParams}
                        className={styles.middle}
                    />
                    <div className={styles.right}>
                        { !authenticated && (
                            <MenuItem
                                title="Login"
                                link="/login/"
                            />
                        )}
                        { user && (
                            <div className={styles.username}>
                                {`Hello ${user.username}`}
                            </div>
                        )}
                        { authenticated && (
                            <Button
                                onClick={logoutRequest.do}
                                pending={logoutRequest.pending}
                                transparent
                            >
                                Logout
                            </Button>
                        )}
                        {/*
                        <a
                            className={styles.adminLink}
                            href={adminEndpoint}
                            type="button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Admin Panel
                        </a>
                        */}
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}

// check for map styles

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(
            Navbar,
        ),
    ),
);
