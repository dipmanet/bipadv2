/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { useEffect, useState } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { Translation } from 'react-i18next';
import { navigate } from '@reach/router';
import Cookies from 'js-cookie';
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
import FeedbackSupport from '#views/FeedbackSupport';
import MenuItem from './MenuItem';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ButtonGroupLogo from '#resources/icons/sidebarGroupButtons.svg';
import GroupMenuContainer from './GroupMenuContainer';
import PageContext from '#components/PageContext';
import ReportIncidentIcon from '#resources/icons/reportIncident.svg';

const pages = routeSettings.filter(setting => !!setting.navbar) as Menu[];

interface Menu {
    title: string;
    name: string;
    path: string;
    iconName: string;
    disabled: boolean;
    id: string;
    image: boolean;
    handleActiveGroupButton: (data: boolean) => void;
}
const GroupMenuListContainer = ({
    title,
    className,
    onClick,
    iconName,
    disabled,
    id,
    image,
    handleActiveGroupButton,
    children,
}: {
    title: string;
    className?: string;
    handleActiveGroupButton: () => void;
    onClick: () => void;
    iconName?: string;
    disabled?: boolean;
    id: string;
    image?: boolean;
    children: JSX.Element;
}) => {
    const [showInfo1, setShowInfo1] = useState<boolean>(false);
    useEffect(() => {
        handleActiveGroupButton(showInfo1);
    }, [handleActiveGroupButton, showInfo1]);
    return (
        <div className={styles.container}>
            <div className={styles.infoBoxWrapper}>

                <div
                    role="presentation"
                    className={_cs(styles.menuItemLikeButton, className)}
                    onClick={() => {
                        setShowInfo1(true);
                    }}
                    title={title}
                    id={id}
                >
                    {image ? (
                        <ScalableVectorGraphics
                            className={styles.infoIconMax}
                            src={iconName}
                        />
                    ) : (
                        <Icon
                            className={styles.icon}
                            name={iconName}
                        />
                    )}

                    <div className={styles.title}>
                        {title}
                    </div>
                </div>

                <GroupMenuContainer
                    show={showInfo1}
                    onClickOutside={() => {
                        setShowInfo1(false);
                    }}
                >
                    {children}

                </GroupMenuContainer>

            </div>
        </div>
    );
};


const MenuItemLikeButton = ({
    title,
    className,
    onClick,
    iconName,
    disabled,
    id,
    image,
}: {
    title: string;
    className?: string;
    onClick: () => void;
    iconName?: string;
    disabled?: boolean;
    id: string;
    image?: boolean;
}) => (
    <div
        role="presentation"
        className={_cs(styles.menuItemLikeButton, className)}
        onClick={!disabled ? onClick : undefined}
        title={title}
        id={id}
    >
        {image ? (
            <ScalableVectorGraphics
                className={styles.infoIconMax}
                src={iconName}
            />
        ) : (
            <Icon
                className={styles.icon}
                name={iconName}
            />
        )}

        <div className={styles.title}>
            {title}
        </div>
    </div>
);
const ReportIncidentButton = ({
    title,
    className,
    onClick,
    iconName,
    disabled,
    id,
    image,
}: {
    title: string;
    className?: string;
    onClick: () => void;
    iconName?: string;
    disabled?: boolean;
    id: string;
    image?: boolean;
}) => (
    <div
        role="presentation"
        className={_cs(styles.menuItemLikeButton, className)}
        onClick={!disabled ? onClick : undefined}
        title={title}
        id={id}
    >
        <div className={styles.reportIncidentTitle}>
            {title}
        </div>

        {image ? (
            <div className={styles.incidentButtonImagePart}>
                {' '}
                <ScalableVectorGraphics
                    className={styles.infoIconMax}
                    src={iconName}
                />
            </div>
        ) : (
            <div>
                {' '}
                <Icon
                    className={styles.icon}
                    name={iconName}
                />
            </div>
        )}


    </div>
);
const ReportIncidentModalButton = modalize(ReportIncidentButton);
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

class Navbar extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            activeGroupButton: false,
        };
    }

    private menuRendererParams = (_: string, data: Menu) => ({
        title: this.props.language.language === 'en' ? data.title : data.titleNep,
        link: data.path,
        disabled: data.disabled,
        iconName: data.iconName,
        className: styles.menuItem,

    })

    private handleActiveGroupButton = (data: boolean) => {
        this.setState({ activeGroupButton: data });
    }

    public render() {
        const {
            className,
            authState,
            requests: {
                logoutRequest,
            },
            language: { language },
        } = this.props;
        const { activeRouteDetails } = this.context;
        const { activeGroupButton } = this.state;
        const { authenticated, user } = authState;
        const activeRouteName = activeRouteDetails && activeRouteDetails.name;
        const GroupMenuListRoutes = ['dataArchive'];
        const isRoutedListedHere = !!GroupMenuListRoutes.find(i => i === activeRouteName);
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


                    {activeRouteName === 'incident'
                        ? (
                            <Translation>
                                {
                                    t => (

                                        <ReportIncidentModalButton
                                            className={styles.reportIncident}
                                            title={t('Report an incident')}
                                            id="report-an-incident"
                                            iconName={ReportIncidentIcon}
                                            image
                                            modal={<CitizenReportFormModal />}
                                        />
                                    )}
                            </Translation>
                        )

                        : ''}
                    <GroupMenuListContainer
                        className={(activeGroupButton || isRoutedListedHere)
                            ? styles.logoutButtonActive : styles.buttomGroup}
                        title=""
                        iconName={ButtonGroupLogo}
                        image
                        handleActiveGroupButton={this.handleActiveGroupButton}
                    >
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
                                        title="Feedback and support"
                                        iconName="feedbackIcon"
                                        modal={<FeedbackSupport />}
                                    />

                                )}
                        </Translation>


                        {/* <ModalButton
                            className={styles.reportIncidentButton}
                            title="About Us"
                            iconName="aboutUs"
                            modal={<AboutModal />}
                        /> */}
                        <MenuItemLikeButton
                            className={activeRouteName === 'dataArchive' ? styles.selectedButtonActive : styles.reportIncidentButton}
                            title={language === 'en' ? 'Data Archive' : 'डाटा संग्रह'}
                            iconName="clipboard"
                            id="logout"
                            onClick={() => {
                                navigate('/data-archive/');
                            }}

                        />
                    </GroupMenuListContainer>
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

                    {
                        user && (
                            <Icon
                                className={styles.userIcon}
                                title={`${user.username}`}
                                name="user"
                            />
                        )
                    }

                    {
                        authenticated && (
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
                        )
                    }


                </div>
            </nav>
        );
    }
}
Navbar.contextType = PageContext;
// check for map styles
export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requestOptions)(
            Navbar,
        ),
    ),
);
