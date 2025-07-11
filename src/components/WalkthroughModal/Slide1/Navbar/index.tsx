/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-curly-spacing */
import React, { useState, useContext } from "react";
import { createRequestClient, methods } from "@togglecorp/react-rest-request";
import { connect } from "react-redux";
import { Link } from "@reach/router";
import LanguageToggle from "#components/LanguageToggle";
import login from "#resources/icons/login.png";
import { createConnectedRequestCoordinator } from "#request";
import {
	authStateSelector,
	closeWalkThroughSelector,
	languageSelector,
	runSelector,
} from "#selectors";
import {
	setAuthAction,
	setInitialCloseWalkThroughAction,
	setInitialRunAction,
} from "#actionCreators";
import { getAuthState } from "#utils/session";
import NewLoginModal from "#components/NewLoginModal";
import RiskInfoLayerContext from "#components/RiskInfoLayerContext";
import LoadingAnimation from "#rscv/LoadingAnimation";
import styles from "./styles.module.scss";

const mapStateToProps = (state: AppState): PropsFromState => ({
	closeWalkThrough: closeWalkThroughSelector(state),
	run: runSelector(state),
	language: languageSelector(state),
	authState: authStateSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setCloseWalkThrough: (params) => dispatch(setInitialCloseWalkThroughAction(params)),
	setRun: (params) => dispatch(setInitialRunAction(params)),
	setAuth: (params) => dispatch(setAuthAction(params)),
});
const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	logoutRequest: {
		url: "/auth/logout/",
		method: methods.POST,
		onSuccess: ({ props, params }) => {
			const authState = getAuthState();
			const { setAuth } = props;
			setAuth(authState);
			if (params.disableLoader) {
				params.disableLoader();
			}

			window.location.reload();
		},
		onFailure: ({ error, params }) => {
			// TODO: handle error
			console.warn("failure", error);
			if (params.disableLoader) {
				params.disableLoader();
			}
		},
		onFatal: () => {
			console.warn("fatal");
		},
	},
};

const Navbar = (props) => {
	const {
		requests: { logoutRequest },
		language: { language },
		authState: { authenticated },
		children,
	} = props;
	const [showLoginForm, setShowLoginForm] = useState(false);
	const [loader, setLoader] = useState(false);
	const [selectedButton, setSelectedButton] = useState(1);

	const handleButtonClick = (button) => {
		setSelectedButton(button);
	};
	const handleLogOut = () => {
		setLoader(true);
		logoutRequest.do({
			disableLoader: () => setLoader(false),
		});
	};
	const {
		activeRouteDetails: { name: routeName },
	} = useContext(RiskInfoLayerContext);

	return (
		<div className={styles.mainContainer}>
			<div className={styles.navLinks}>
				{routeName !== "homepage" ? (
					<>
						<Link to="/about/">
							<span
								style={{ marginLeft: "0px" }}
								className={routeName === "about" ? styles.active : ""}
								onClick={() => handleButtonClick(1)}>
								{language === "en" ? "About" : "बारेमा"}
							</span>
						</Link>
						<Link to="/developers/">
							<span
								className={routeName === "developers" ? styles.active : ""}
								onClick={() => handleButtonClick(2)}>
								{language === "en" ? "Developers" : "विकासकर्ताहरू"}
							</span>
						</Link>
						<Link to="/manuals/">
							<span
								className={routeName === "manuals" ? styles.active : ""}
								onClick={() => handleButtonClick(3)}>
								{language === "en" ? "Manuals" : "पुस्तिकाहरू"}
							</span>
						</Link>
						{/* <Link to="/manuals/"><span className={routeName === 'subDomain' ? styles.active : ''} onClick={() => handleButtonClick(4)}>Sub-Domains</span></Link> */}
						<Link to="/faqs/">
							<span
								className={routeName === "faqs" ? styles.active : ""}
								onClick={() => handleButtonClick(5)}>
								{language === "en" ? "FAQs" : "सोधिने प्रश्नहरू"}
							</span>
						</Link>
					</>
				) : (
					""
				)}
			</div>

			<div className={styles.languageButton}>
				{loader ? <LoadingAnimation /> : ""}
				{showLoginForm ? (
					<NewLoginModal homepageLogin setShowLoginForm={setShowLoginForm} routeName={routeName} />
				) : (
					""
				)}
				<LanguageToggle className={styles.languageToggle} />
				{authenticated ? (
					<div role="presentation" className={styles.loginButtonImage} onClick={handleLogOut}>
						<p style={{ marginRight: "5px" }}>{language === "en" ? "Logout" : "लग-आउट"}</p>
						<img src={login} alt="login" height="20px" width="20px" />
					</div>
				) : (
					<div
						role="presentation"
						className={styles.loginButtonImage}
						onClick={() => setShowLoginForm(true)}>
						<p style={{ marginRight: "5px" }}>{language === "en" ? "Login" : "लग-इन"}</p>
						<img src={login} alt="login" height="20px" width="20px" />
					</div>
				)}
			</div>
		</div>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requestOptions)(Navbar)));
