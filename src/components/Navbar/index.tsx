import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';

import { navigate } from '@reach/router';
import ListView from '#rscv/List/ListView';
import Icon from '#rscg/Icon';
import modalize from '#rscg/Modalize';

import { routeSettings } from '#constants';
import { authStateSelector, languageSelector } from '#selectors';
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
// import LoginModal from '#components/LoginModal';
import NewLoginModal from '#components/NewLoginModal';
import AboutModal from '#components/AboutModal';
import SituationReport from '#components/SituationReportModal';
import Relief from '#components/ReliefModal';

import MenuItem from './MenuItem';
import styles from './styles.scss';
import Dashboard from '#views/Dashboard';

const pages = routeSettings.filter(setting => !!setting.navbar) as Menu[];
interface Menu {
    title: string;
    titleNep: string;
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
    title: string;
    className?: string;
    onClick: () => void;
    iconName?: string;
    disabled?: boolean;
}) => (
    <div
        role="presentation"
        className={_cs(styles.menuItemLikeButton, className)}
        onClick={!disabled ? onClick : undefined}
        title={title}
    >
        <Icon
            className={styles.icon}
            name={iconName}
        />
        <div className={styles.title}>
            {title}
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
    language: languageSelector(state),
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

const menuKeySelector = (d: { name: string }) => d.name;

const gotoadmin = () => navigate('/admin');

class Navbar extends React.PureComponent<Props, State> {
    private menuRendererParams = (_: string, data: Menu) => ({
        title: this.props.language.language === 'en' ? data.title : data.titleNep,
        link: data.path,
        disabled: data.disabled,
        iconName: data.iconName,
        className: styles.menuItem,

    })

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
                    <Translation>
                        {
                            t => (
                                <ModalButton
                                    className={styles.reportIncidentButton}
                                    title={t('Situation Report')}
                                    iconName="textDocument"
                                    modal={<SituationReport />}
                                />
                            )}
                    </Translation>

                    {authenticated && (
                        <Translation>
                            {
                                t => (
                                    <ModalButton
                                        className={styles.reliefButton}
                                        title={t('Relief')}
                                        iconName="cart"
                                        modal={<Relief />}
                                    />
                                )}
                        </Translation>
                    )}
                    {authenticated && (
                        <Translation>
                            {
                                t => (
                                    <ModalButton
                                        className={styles.reportIncidentButton}
                                        title={t('Reported incidents')}
                                        iconName="list"
                                        modal={<CitizenReportsModal />}
                                    />
                                )}
                        </Translation>
                    )}
                    <Translation>
                        {
                            t => (
                                <ModalButton
                                    className={styles.reportIncidentButton}
                                    title={t('Report an incident')}
                                    iconName="telephone"
                                    modal={<CitizenReportFormModal />}
                                />
                            )}
                    </Translation>
                    {!authenticated && (
                        <Translation>
                            {
                                t => (
                                    <ModalButton
                                        className={styles.menuItem}
                                        title={t('Login')}
                                        iconName="login"
                                        modal={<NewLoginModal />}
                                    />
                                )}
                        </Translation>
                    )}
                    <Translation>
                        {
                            t => (
                                <ModalButton
                                    className={styles.reportIncidentButton}
                                    title={t('About Us')}
                                    iconName="aboutUs"
                                    modal={<AboutModal />}
                                />
                            )}
                    </Translation>
                    {user && (
                        <MenuItemLikeButton
                            className={styles.logoutButton}
                            title="Admin"
                            iconName="user"
                            onClick={gotoadmin}
                            disabled={logoutRequest.pending}
                        />
                    )}
                    {authenticated && (
                        <Translation>
                            {
                                t => (
                                    <MenuItemLikeButton
                                        className={styles.logoutButton}
                                        title={t('Logout')}
                                        iconName="logout"
                                        onClick={logoutRequest.do}
                                        disabled={logoutRequest.pending}
                                    />
                                )}
                        </Translation>
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
