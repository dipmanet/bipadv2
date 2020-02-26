import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import Icon from '#rscg/Icon';
import modalize from '#rscg/Modalize';

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
import CitizenReportFormModal from '#components/CitizenReportFormModal';
import CitizenReportsModal from '#components/CitizenReportsModal';
import LoginModal from '#components/LoginModal';
import AboutModal from '#components/AboutModal';
import SituationReport from '#components/SituationReportModal';

import MenuItem from './MenuItem';
import styles from './styles.scss';

const pages = routeSettings.filter(setting => !!setting.navbar) as Menu[];

interface Menu {
    title: string;
    name: string;
    path: string;
    iconName: string;
    disabled: boolean;
}

const MenuItemLikeButton = ({
    title,
    className,
    onClick,
    iconName,
    disabled,
}: {
    title: strning;
    className?: string;
    onClick: () => void;
    iconName?: string;
    disabled?: boolean;
}) => (
    <div
        role="presentation"
        className={_cs(styles.menuItemLikeButton, className)}
        onClick={!disabled ? onClick : undefined}
    >
        <Icon
            className={styles.icon}
            name={iconName}
        />
        <div className={styles.title}>
            { title }
        </div>
    </div>
);

const ModalButton = modalize(MenuItemLikeButton);

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

            window.location.reload();
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
        iconName: data.iconName,
        className: styles.menuItem,
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
                    <ModalButton
                        className={styles.reportIncidentButton}
                        title="Situation Report"
                        iconName="aboutUs"
                        modal={<SituationReport />}
                    />
                    {authenticated && (
                        <ModalButton
                            className={styles.reportIncidentButton}
                            title="Reported incidents"
                            iconName="list"
                            modal={<CitizenReportsModal />}
                        />
                    )}
                    <ModalButton
                        className={styles.reportIncidentButton}
                        title="Report an incident"
                        iconName="telephone"
                        modal={<CitizenReportFormModal />}
                    />
                    {!authenticated && (
                        <ModalButton
                            className={styles.menuItem}
                            title="Login"
                            iconName="login"
                            modal={<LoginModal />}
                        />
                    )}
                    <ModalButton
                        className={styles.reportIncidentButton}
                        title="About Us"
                        iconName="aboutUs"
                        modal={<AboutModal />}
                    />
                    {user && (
                        <Icon
                            className={styles.userIcon}
                            title={`${user.username}`}
                            name="user"
                        />
                    )}
                    {authenticated && (
                        <MenuItemLikeButton
                            className={styles.logoutButton}
                            title="Logout"
                            iconName="logout"
                            onClick={logoutRequest.do}
                            disabled={logoutRequest.pending}
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
