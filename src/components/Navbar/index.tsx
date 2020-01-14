import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import Icon from '#rscg/Icon';

import { routeSettings } from '#constants';
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
        // <Logo />

        return (
            <nav className={_cs(styles.navbar, className)}>
                <ListView
                    data={pages}
                    keySelector={menuKeySelector}
                    renderer={MenuItem}
                    rendererParams={this.menuRendererParams}
                    className={styles.menuItemList}
                />
                <div className={styles.bottom}>
                    { !authenticated && (
                        <MenuItem
                            title="Login"
                            iconName="login"
                            link="/login/"
                        />
                    )}
                    { user && (
                        <Icon
                            className={styles.userIcon}
                            title={`${user.username}`}
                            name="user"
                        />
                    )}
                    { authenticated && (
                        <Button
                            className={styles.logoutButton}
                            title="Logout"
                            onClick={logoutRequest.do}
                            pending={logoutRequest.pending}
                            transparent
                            iconName="logout"
                        />
                    )}
                </div>
            </nav>
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
