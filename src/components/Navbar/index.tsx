import React, { useEffect, useState } from "react";
import Redux from "redux";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";
import { Translation } from "react-i18next";

import { navigate } from "@reach/router";

import ListView from "#rscv/List/ListView";
import Icon from "#rscg/Icon";
import modalize from "#rscg/Modalize";

import { routeSettings } from "#constants";
import { authStateSelector, languageSelector } from "#selectors";
import { setAuthAction, setInitialCloseWalkThroughAction } from "#actionCreators";
import { AppState } from "#store/types";
import { AuthState } from "#store/atom/auth/types";
import { getAuthState } from "#utils/session";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	NewProps,
	ClientAttributes,
	methods,
} from "#request";
import CitizenReportFormModal from "#components/CitizenReportFormModal";
import CitizenReportsModal from "#components/CitizenReportsModal";
// import LoginModal from '#components/LoginModal';
import NewLoginModal from "#components/NewLoginModal";
import AboutModal from "#components/AboutModal";
import SituationReport from "#components/SituationReportModal";
import Relief from "#components/ReliefModal";
import FeedbackSupport from "#views/FeedbackSupport";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import ButtonGroupLogo from "#resources/icons/sidebarGroupButtons.svg?react";
import PageContext from "#components/PageContext";
import ReportIncidentIcon from "#resources/icons/reportIncident.svg";
import PalikaReport from "#views/PalikaReport";
import MenuItem from "./MenuItem";
import styles from "./styles.module.scss";
import GroupMenuContainer from "./GroupMenuContainer";

interface Menu {
	title: string;
	name: string;
	path: string;
	iconName: string;
	disabled: boolean;
	id: string;
}

const pages = routeSettings.filter((setting) => !!setting.navbar) as Menu[];

interface GroupMenuListContainerProps {
	title: string;
	className?: string;
	handleActiveGroupButton: (active: boolean) => void;
	disabled?: boolean;
	id: string;
	image?: boolean;
	children: React.ReactNode;
	disableOutsideDivClick?: boolean;
}

const GroupMenuListContainer: React.FC<GroupMenuListContainerProps> = ({
	title,
	className,
	id,
	handleActiveGroupButton,
	children,
	disableOutsideDivClick,
}) => {
	const [showInfo1, setShowInfo1] = useState<boolean>(false);
	useEffect(() => {
		handleActiveGroupButton(showInfo1);
	}, [handleActiveGroupButton, showInfo1]);
	useEffect(() => {
		if (!disableOutsideDivClick) {
			setShowInfo1(false);
		}
	}, [disableOutsideDivClick]);

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
					id={id}>
					<ButtonGroupLogo />
					<div className={styles.title}>{title}</div>
				</div>

				<GroupMenuContainer
					show={showInfo1}
					onClickOutside={() => {
						if (!disableOutsideDivClick) {
							setShowInfo1(false);
						}
					}}>
					{children}
				</GroupMenuContainer>
			</div>
		</div>
	);
};

interface MenuItemLikeButtonProps {
	title: string;
	className?: string;
	onClick: () => void;
	iconName?: string;
	disabled?: boolean;
	id: string;
	image?: boolean;
	onDisableClick?: () => void;
}

const MenuItemLikeButton: React.FC<MenuItemLikeButtonProps> = ({
	title,
	className,
	onClick,
	iconName,
	disabled,
	id,
	image,
	onDisableClick,
}) => (
	<div
		role="presentation"
		className={_cs(styles.menuItemLikeButton, className)}
		onClick={
			!disabled
				? () => {
						onClick();
						onDisableClick?.();
				  }
				: undefined
		}
		title={title}
		id={id}>
		{image ? (
			<ScalableVectorGraphics className={styles.infoIconMax} src={iconName} />
		) : (
			<Icon className={styles.icon} name={iconName} />
		)}

		<div className={styles.title}>{title}</div>
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
}: MenuItemLikeButtonProps) => (
	<div
		role="presentation"
		className={_cs(styles.menuItemLikeButton, className)}
		onClick={!disabled ? onClick : undefined}
		title={title}
		id={id}>
		<div className={styles.reportIncidentTitle}>{title}</div>

		{image ? (
			<div className={styles.incidentButtonImagePart}>
				<ScalableVectorGraphics className={styles.infoIconMax} src={iconName} />
			</div>
		) : (
			<Icon className={styles.icon} name={iconName} />
		)}
	</div>
);
const ReportIncidentModalButton = modalize(ReportIncidentButton);
const ModalButton = modalize(MenuItemLikeButton);

interface State {}

interface Params {}

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
	setAuth: (params) => dispatch(setAuthAction(params)),
	setCloseWalkThroughHomepage: (params) => dispatch(setInitialCloseWalkThroughAction(params)),
});

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	logoutRequest: {
		url: "/auth/logout/",
		method: methods.POST,
		onSuccess: ({ props }) => {
			const authState = getAuthState();
			const { setAuth } = props;
			setAuth(authState);

			window.location.reload();
		},
		onFailure: ({ error }) => {
			// TODO: handle error
			console.warn("failure", error);
		},
		onFatal: () => {
			console.warn("fatal");
		},
	},
};

const menuKeySelector = (d: { name: string }) => d.name;

const gotoadmin = () => navigate("/admin");

class Navbar extends React.PureComponent<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			activeGroupButton: false,
			disableOutsideDivClick: false,
		};
	}

	private menuRendererParams = (_: string, data: Menu) => ({
		title: this.props.language.language === "en" ? data.title : data.titleNep,
		link: data.path,
		disabled: data.disabled,
		iconName: data.iconName,
		className: styles.menuItem,
		id: data.id ? data.id : null,
	});

	private handleActiveGroupButton = (data: boolean) => {
		this.setState({ activeGroupButton: data });
	};

	private handledisableOutsideDivClick = (boolean) => {
		this.setState({
			disableOutsideDivClick: boolean,
		});
	};

	public render() {
		const {
			className,
			authState,
			requests: { logoutRequest },
			setCloseWalkThroughHomepage,
			language: { language },
		} = this.props;
		const { activeRouteDetails } = this.context;
		const { activeGroupButton, disableOutsideDivClick } = this.state;
		const { authenticated, user } = authState;
		const activeRouteName = activeRouteDetails && activeRouteDetails.name;
		const GroupMenuListRoutes = ["droughtWatch", "DRRM Report", "ibf"];
		const isRoutedListedHere = !!GroupMenuListRoutes.find((i) => i === activeRouteName);
		const data = authenticated ? pages : pages.filter((i) => !i.disableIfNoAuth);

		return (
			<nav className={_cs(styles.navbar, className)}>
				<ListView
					data={data}
					keySelector={menuKeySelector}
					renderer={MenuItem}
					rendererParams={this.menuRendererParams}
					className={styles.menuItemList}
				/>
				<div className={styles.bottom}>
					{/* <ModalButton
                        className={styles.reportIncidentButton}
                        title="Report an incident"
                        id="report-an-incident"
                        iconName="telephone"
                        modal={<CitizenReportFormModal />}
                    /> */}

					{activeRouteName === "incident" ? (
						<Translation>
							{(t) => (
								<ReportIncidentModalButton
									className={styles.reportIncident}
									title={t("Report an incident")}
									id="report-an-incident"
									iconName={ReportIncidentIcon}
									image
									modal={<CitizenReportFormModal />}
								/>
							)}
						</Translation>
					) : (
						""
					)}
					<GroupMenuListContainer
						className={
							activeGroupButton || isRoutedListedHere
								? styles.logoutButtonActive
								: styles.buttomGroup
						}
						title=""
						id="group-menu-list"
						handleActiveGroupButton={this.handleActiveGroupButton}
						disableOutsideDivClick={disableOutsideDivClick}>
						{/* <Translation>
                            {
                                t => (
                                    <MenuItemLikeButton
                                        className={activeRouteName === 'ibf' ? styles.selectedButtonActive : styles.reportIncidentButton}
                                        title={t('IBF')}
                                        iconName="cloud"
                                        id="logout"
                                        onClick={() => {
                                            navigate('/ibf/');
                                        }}

                                    />
                                )}
                        </Translation> */}
						{/* <Translation>
                            {
                                t => (
                                    <ModalButton
                                        className={styles.reportIncidentButton}
                                        title={t('Situation Report')}
                                        iconName="textDocument"
                                        modal={(
                                            <SituationReport
                                                handledisableOutsideDivClick={this.handledisableOutsideDivClick}
                                            />
                                        )}
                                        onDisableClick={() => {
                                            this.setState({ disableOutsideDivClick: true });
                                        }}
                                    />
                                )}
                        </Translation> */}

						{/* {authenticated && (
                            <Translation>
                                {
                                    t => (
                                        <ModalButton
                                            className={styles.reliefButton}
                                            title={t('Relief')}
                                            iconName="cart"
                                            modal={(
                                                <Relief
                                                    handledisableOutsideDivClick={this.handledisableOutsideDivClick}
                                                />
                                            )}
                                            onDisableClick={() => {
                                                this.setState({ disableOutsideDivClick: true });
                                            }}
                                        />
                                    )}
                            </Translation>
                        )} */}

						{/* {authenticated && (
                            <Translation>
                                {
                                    t => (
                                        <ModalButton
                                            className={styles.reportIncidentButton}
                                            title={t('Reported incidents')}
                                            iconName="list"
                                            modal={(
                                                <CitizenReportsModal
                                                    handledisableOutsideDivClick={this.handledisableOutsideDivClick}
                                                />
                                            )}
                                            onDisableClick={() => {
                                                this.setState({ disableOutsideDivClick: true });
                                            }}
                                        />
                                    )}
                            </Translation>
                        )} */}

						{/* <Translation>
                            {
                                t => (

                                    <MenuItemLikeButton
                                        className={_cs(styles.logoutButton, styles.insideContainerComponent)}
                                        title={t('Home Page')}
                                        iconName="aboutUs"
                                        id="logout"
                                        onClick={() => {
                                            Cookies.set('isFirstTimeUser', undefined, { path: '/', domain: '.yilab.org.np', expires: 365 });
                                            setCloseWalkThroughHomepage({ value: false });
                                            navigate('/');
                                        }}
                                    />
                                )}
                        </Translation> */}
						{authenticated && (
							<Translation>
								{(t) => (
									<ModalButton
										className={_cs(styles.reliefButton, styles.insideContainerComponent)}
										title={t("Relief")}
										iconName="cart"
										id="relief"
										modal={<Relief />}
									/>
								)}
							</Translation>
						)}
						{authenticated && (
							<Translation>
								{(t) => (
									<ModalButton
										className={_cs(styles.reportIncidentButton, styles.insideContainerComponent)}
										title={t("Reported incidents")}
										id="reported-incidents"
										iconName="list"
										modal={<CitizenReportsModal />}
									/>
								)}
							</Translation>
						)}
						<Translation>
							{(t) => (
								<ModalButton
									className={_cs(styles.reportIncidentButton, styles.insideContainerComponent)}
									title="Feedback and support"
									iconName="feedbackIcon"
									modal={
										<FeedbackSupport
											handledisableOutsideDivClick={this.handledisableOutsideDivClick}
										/>
									}
									onDisableClick={() => {
										this.setState({ disableOutsideDivClick: true });
									}}
								/>
							)}
						</Translation>

						<Translation>
							{(t) => (
								<ModalButton
									className={_cs(styles.reportIncidentButton, styles.insideContainerComponent)}
									title={t("About Us")}
									id="about-us"
									iconName="aboutUs"
									modal={
										<AboutModal handledisableOutsideDivClick={this.handledisableOutsideDivClick} />
									}
									onDisableClick={() => {
										this.setState({ disableOutsideDivClick: true });
									}}
								/>
							)}
						</Translation>
						<Translation>
							{(t) => (
								<ModalButton
									className={_cs(styles.reportIncidentButton, styles.insideContainerComponent)}
									title={t("Situation Report")}
									id="situation-report"
									iconName="textDocument"
									modal={
										<SituationReport
											handledisableOutsideDivClick={this.handledisableOutsideDivClick}
										/>
									}
									onDisableClick={() => {
										this.setState({ disableOutsideDivClick: true });
									}}
								/>
							)}
						</Translation>
						<Translation>
							{(t) => (
								<ModalButton
									className={
										isRoutedListedHere && activeRouteName === "DRRM Report"
											? _cs(styles.reportIncidentutton, styles.insideContainerComponent)
											: styles.insideContainerComponent
									}
									title={t("DRRM Report")}
									id="drrm"
									iconName="textDocument"
									modal={<PalikaReport />}
									onClick={() => navigate("/drrm-report/")}
								/>
							)}
						</Translation>

						{/* <ModalButton
                            className={styles.reportIncidentButton}
                            title="About Us"
                            iconName="aboutUs"
                            modal={<AboutModal />}
                        /> */}
						{/* <MenuItemLikeButton
                            className={activeRouteName === 'dataArchive' ? styles.selectedButtonActive : styles.reportIncidentButton}
                            title={language === 'en' ? 'Data Archive' : 'डाटा संग्रह'}
                            iconName="clipboard"
                            id="logout"
                            onClick={() => {
                                navigate('/data-archive/');
                            }}

                        /> */}
					</GroupMenuListContainer>
					{!authenticated && (
						<Translation>
							{(t) => (
								<ModalButton
									className={styles.menuItem}
									title={t("Login")}
									iconName="login"
									id="login"
									modal={<NewLoginModal />}
								/>
							)}
						</Translation>
					)}

					{user && (
						<Translation>
							{(t) => (
								<MenuItemLikeButton
									className={styles.logoutButton}
									title={t("Admin")}
									id="admin"
									iconName="user"
									onClick={gotoadmin}
									disabled={logoutRequest.pending}
								/>
							)}
						</Translation>
					)}

					{authenticated && (
						<Translation>
							{(t) => (
								<MenuItemLikeButton
									className={styles.logoutButton}
									title={t("Logout")}
									id="logout"
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
Navbar.contextType = PageContext;
// check for map styles
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requestOptions)(Navbar)));
