import React, { useEffect, useState } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import { navigate } from '@reach/router';
import Cookies from 'js-cookie';
import ListView from '#rscv/List/ListView';
import Icon from '#rscg/Icon';
import modalize from '#rscg/Modalize';

import { routeSettings } from '#constants';
import { authStateSelector } from '#selectors';
import { setAuthAction, setInitialCloseWalkThroughAction } from '#actionCreators';
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
    children
}: {
    title: string;
    className?: string;
    handleActiveGroupButton: () => void;
    onClick: () => void;
    iconName?: string;
    disabled?: boolean;
    id: string;
    image?: boolean;
    children: JSX.Element
}) => {
    const [showInfo1, setShowInfo1] = useState<boolean>(false);
    useEffect(() => {
        handleActiveGroupButton(showInfo1)
    }, [showInfo1])
    return (
        <div className={styles.container}>
            <div className={styles.infoBoxWrapper}>

                <div
                    role="presentation"
                    className={_cs(styles.menuItemLikeButton, className)}
                    onClick={() => {
                        setShowInfo1(true)
                    }}
                    title={title}
                    id={id}
                >{image ? <ScalableVectorGraphics
                    className={styles.infoIconMax}
                    src={iconName}
                /> : <Icon
                    className={styles.icon}
                    name={iconName}
                />}

                    <div className={styles.title}>
                        {title}
                    </div>
                </div>

                <GroupMenuContainer show={showInfo1} onClickOutside={() => {
                    setShowInfo1(false)
                }}  >{children}</GroupMenuContainer>

            </div>
        </div>
    )
}



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
    image?: boolean
}) => (
    <div
        role="presentation"
        className={_cs(styles.menuItemLikeButton, className)}
        onClick={!disabled ? onClick : undefined}
        title={title}
        id={id}
    >{image ? <ScalableVectorGraphics
        className={styles.infoIconMax}
        src={iconName}
    /> : <Icon
        className={styles.icon}
        name={iconName}
    />}

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
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAuth: params => dispatch(setAuthAction(params)),
    setCloseWalkThroughHomepage: params => dispatch(setInitialCloseWalkThroughAction(params)),
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
        title: data.title,
        link: data.path,
        disabled: data.disabled,
        iconName: data.iconName,
        className: styles.menuItem,
        id: data.id ? data.id : null,
    });
    private handleActiveGroupButton = (data: boolean) => {
        this.setState({ activeGroupButton: data })
    }
    public render() {
        const {
            className,
            authState,
            requests: {
                logoutRequest,
            },
            setCloseWalkThroughHomepage,
        } = this.props;
        const { activeRouteDetails } = this.context;
        const { activeGroupButton } = this.state;
        const { authenticated, user } = authState;
        const activeRouteName = activeRouteDetails && activeRouteDetails.name;
        // <Logo />
        console.log("This is button group", activeRouteDetails)
        const GroupMenuListRoutes = ['realtime', 'dataArchive']
        const isRoutedListedHere = GroupMenuListRoutes.find(i => i === activeRouteName) ? true : false;
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


                    {/* <ModalButton
                        className={styles.reportIncidentButton}
                        title="Feedback & Support"
                        iconName="feedbackIcon"
                        modal={<FeedbackSupport />}
                    // onClick={() => navigate('/feedback-support/')}
                    /> */}
                    {/* <ModalButton
                        className={styles.reportIncidentButton}
                        title="About Us"
                        id="about-us"
                        iconName="aboutUs"
                        modal={<AboutModal />}
                    /> */}
                    {/* <MenuItemLikeButton
                        className={styles.logoutButton}
                        title=""
                        iconName={ButtonGroupLogo}
                        image={true}

                    /> */}
                    <GroupMenuListContainer
                        className={(activeGroupButton || isRoutedListedHere) ? styles.logoutButtonActive : styles.buttomGroup}
                        title=""
                        iconName={ButtonGroupLogo}
                        image={true}
                        handleActiveGroupButton={this.handleActiveGroupButton}
                    >
                        <ModalButton
                            className={styles.reportIncidentButton}
                            title="Situation Report"
                            id="situation-report"
                            iconName="textDocument"
                            modal={<SituationReport />}
                        />
                        {authenticated && (
                            <ModalButton
                                className={styles.reliefButton}
                                title="Relief"
                                iconName="cart"
                                id="relief"
                                modal={<Relief />}
                            />
                        )}
                        {authenticated && (
                            <ModalButton
                                className={styles.reportIncidentButton}
                                title="Reported incidents"
                                id="reported-incidents"
                                iconName="list"
                                modal={<CitizenReportsModal />}
                            />
                        )}
                        <ModalButton
                            className={styles.reportIncidentButton}
                            title="Report an incident"
                            id="report-an-incident"
                            iconName="telephone"
                            modal={<CitizenReportFormModal />}
                        />
                        {/* <MenuItemLikeButton
                            className={styles.logoutButton}
                            title="Home Page"
                            iconName="aboutUs"
                            id="logout"
                            onClick={() => {
                                Cookies.set('isFirstTimeUser', undefined, { path: '/', domain: '.yilab.org.np', expires: 365 });
                                setCloseWalkThroughHomepage({ value: false });
                                navigate('/');
                            }}

                        /> */}
                        <MenuItemLikeButton
                            className={activeRouteName === 'realtime' ? styles.selectedButtonActive : styles.reportIncidentButton}
                            title="Real Time"
                            iconName="aboutUs"
                            id="logout"
                            onClick={() => {

                                navigate('/realtime/');
                            }}

                        />
                        <MenuItemLikeButton
                            className={activeRouteName === 'dataArchive' ? styles.selectedButtonActive : styles.reportIncidentButton}
                            title="Data Archive"
                            iconName="clipboard"
                            id="logout"
                            onClick={() => {

                                navigate('/data-archive/');
                            }}

                        />

                    </GroupMenuListContainer>
                    {!authenticated && (
                        <ModalButton
                            className={styles.menuItem}
                            title="Login"
                            id="login"
                            iconName="login"
                            modal={<NewLoginModal />}
                        />
                    )}
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
                            id="logout"
                            onClick={logoutRequest.do}
                            disabled={logoutRequest.pending}
                        />
                    )}

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
