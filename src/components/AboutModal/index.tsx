import React from "react";
import { Translation } from "react-i18next";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";

// import PrivacyPolicy from './PrivacyPolicy';
// import Metadata from './Metadata';
// import Disclaimer from './Disclaimer';

import DangerButton from "#rsca/Button/DangerButton";
import Modal from "#rscv/Modal";
import ModalBody from "#rscv/Modal/Body";
import ModalHeader from "#rscv/Modal/Header";
import MultiViewContainer from "#rscv/MultiViewContainer";
import ScrollTabs from "#rscv/ScrollTabs";
import { languageSelector } from "#selectors";
import styles from "./styles.module.scss";
import Manual from "./Manual";
import About from "./About";

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});

class AboutUs extends React.PureComponent {
	constructor(props) {
		super(props);
		const {
			language: { language },
		} = this.props;

		this.state = {
			currentView: "about",
		};

		this.tabs = {
			about: language === "en" ? "Description" : "विवरण",
			// privacyPolicy: 'Privacy policy',
			// metadata: 'Metadata',
			// disclaimer: 'Disclaimer',
			manual: language === "en" ? "Publications" : "प्रकाशनहरू",
		};

		const rendererParams = () => ({ className: styles.view });

		this.views = {
			about: {
				component: About,
				rendererParams,
			},
			/*
            privacyPolicy: {
                component: PrivacyPolicy,
                rendererParams,
            },
            metadata: {
                component: Metadata,
                rendererParams,
            },
            disclaimer: {
                component: Disclaimer,
                rendererParams,
            },
            */
			manual: {
				component: Manual,
				rendererParams,
			},
		};
	}

	handleTabClick = (newTab) => {
		this.setState({ currentView: newTab });
	};

	render() {
		const { className, closeModal, handledisableOutsideDivClick } = this.props;
		const { currentView } = this.state;

		return (
			<Modal
				className={_cs(styles.loginModal, className)}
				// onClose={closeModal}
			>
				<Translation>
					{(t) => (
						<ModalHeader
							className={styles.header}
							title={t("BIPAD Portal")}
							rightComponent={
								<DangerButton
									transparent
									iconName="close"
									onClick={() => {
										handledisableOutsideDivClick(false);
										closeModal();
									}}
									title="Close Modal"
								/>
							}
						/>
					)}
				</Translation>

				<ModalBody className={styles.content}>
					<ScrollTabs
						className={styles.tabs}
						tabs={this.tabs}
						// useHash
						// onHashChange={this.handleHashChange}
						active={currentView}
						onClick={this.handleTabClick}
					/>
					<MultiViewContainer
						views={this.views}
						active={currentView}
						// useHash
					/>
				</ModalBody>
			</Modal>
		);
	}
}

export default connect(mapStateToProps)(AboutUs);
