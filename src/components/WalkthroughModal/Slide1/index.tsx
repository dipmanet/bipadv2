/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useContext, useEffect } from "react";
import { Link, navigate } from "@reach/router";

import { compose } from "redux";
import { connect } from "react-redux";
import { createRequestClient, methods } from "@togglecorp/react-rest-request";
import LoadingAnimation from "#rscv/LoadingAnimation";
import gonImage from "#resources/icons/gon.png";
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

import LanguageToggle from "#components/LanguageToggle";
import about from "#resources/icons/aboutslide.svg";
import technicalSupport from "#resources/icons/technicalsupport.svg";
import manuals from "#resources/icons/manuals.svg";
import faq from "#resources/icons/faqs.svg";
import NewLoginModal from "#components/NewLoginModal";

import { createConnectedRequestCoordinator } from "#request";

import FeedbackSupport from "#views/FeedbackSupport";
import styles from "./styles.module.scss";
import Navbar from "./Navbar";

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

const Slide1 = (props) => {
	const [feedbackSupportBoolean, setFeebbackSupportBoolean] = useState(false);
	const [content, setContent] = useState([]);
	const {
		setCloseWalkThrough,
		setRun,
		language: { language },
	} = props;
	const handleClickStart = () => {
		setCloseWalkThrough({ value: true });
		setRun({ value: true });
	};
	useEffect(() => {
		fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/homepage-content`)
			.then((response) => response.json())
			.then((data) => setContent(data.results));
	}, []);

	return (
		<div className={styles.mainContainer}>
			{!content.length && (
				<LoadingAnimation className={styles.loader} message="Loading Data,Please Wait..." />
			)}
			<Navbar />
			<div className={styles.container}>
				{feedbackSupportBoolean && (
					<FeedbackSupport
						className={undefined}
						closeModal={() => setFeebbackSupportBoolean(false)}
					/>
				)}
				<div className={styles.content}>
					<div className={styles.imageLogo}>
						<img src={gonImage} alt="logo" />
					</div>
					<div>
						{language === "en" ? (
							<>
								<p className={styles.welcome}>
									Welcome to <br />
								</p>
								<p className={styles.bipadPortal}>BIPAD PORTAL</p>
							</>
						) : (
							<>
								<p className={styles.welcome}>
									बिपद पोर्टलमा <br />
								</p>
								<p className={styles.bipadPortal}>स्वागत छ</p>
							</>
						)}

						<div
							className={styles.paragraph}
							dangerouslySetInnerHTML={{
								__html:
									language === "en"
										? content.length && content[0].descriptionEn
										: content.length && content[0].descriptionNe,
							}}
						/>

						<div className={styles.buttonGroup}>
							<Link to="/dashboard/">
								<div onClick={handleClickStart} className={styles.submitButton} role="presentation">
									{language === "en" ? "TAKE A TOUR" : "भ्रमण गर्नुहोस्"}
								</div>
							</Link>
							<Link
								to="/dashboard/"
								className={styles.viewDashboard}
								// onClick={() => setCloseWalkThrough({ value: true })}
							>
								<h5>{language === "en" ? "VIEW DASHBOARD" : "ड्यासबोर्ड हेर्नुहोस्"}</h5>
							</Link>
						</div>
						<div className={styles.footer}>
							<span style={{ marginRight: "20px" }} onClick={() => navigate("/about/")}>
								<img style={{ marginRight: "5px" }} src={about} alt="about" />
								{language === "en" ? "About" : "बारेमा"}
							</span>
							<span className={styles.contains} onClick={() => setFeebbackSupportBoolean(true)}>
								<img
									style={{ marginRight: "5px" }}
									src={technicalSupport}
									alt="technical support"
								/>
								{language === "en" ? "Technical Support" : "प्राविधिक समर्थन"}
							</span>
							<span className={styles.contains} onClick={() => navigate("/manuals/")}>
								<img style={{ marginRight: "5px" }} src={manuals} alt="technical support" />
								{language === "en" ? "Manuals" : "पुस्तिकाहरू"}
							</span>
							<span className={styles.contains} onClick={() => navigate("/faqs/")}>
								<img style={{ marginRight: "5px" }} src={faq} alt="technical support" />
								{language === "en" ? "FAQs" : "सोधिने प्रश्नहरू"}
							</span>
						</div>
					</div>
				</div>
				{/* <ScrollDownIndicatorButton scrollButton={scrollButton} id="2" /> */}
			</div>
		</div>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient()(Slide1)));
