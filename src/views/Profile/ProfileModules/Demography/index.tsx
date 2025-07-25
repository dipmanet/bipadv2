/* eslint-disable react/jsx-indent */

/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable @typescript-eslint/indent */

import React from "react";
import { _cs } from "@togglecorp/fujs";

import { navigate } from "@reach/router";

import { Translation } from "react-i18next";
import AccentButton from "#rsca/Button/AccentButton";

import modalize from "#rscg/Modalize";

import Page from "#components/Page";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import Button from "#rsca/Button";
import Demographics from "#views/Profile/DisasterProfile/Demographics";
import Icon from "#rscg/Icon";
import DisasterProfile from "../../DisasterProfile";
import ProjectsProfile from "../../ProjectsProfile";
import Indicator from "../../Indicator";
import Contact from "../../Contact";
import Document from "../../Document";
import styles from "../../styles.module.scss";

type TabKeys = "summary" | "projectsProfile" | "contact" | "document" | "nepDatProfile";

interface Props {}

interface State {
	activeView: TabKeys;
}

const IndicatorButton = modalize(AccentButton);

export default class Profile extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			selectedDataType: 1,
			closedVisualization: true,
			pending: true,
		};
	}

	private handleSummaryButtonClick = () => {
		this.setState({ activeView: "summary" });
	};

	private handleProjectButtonClick = () => {
		this.setState({ activeView: "projectsProfile" });
	};

	private handleContactButtonClick = () => {
		this.setState({ activeView: "contact" });
	};

	private handleDocumentButtonClick = () => {
		this.setState({ activeView: "document" });
	};

	private handleCloseVisualizationOnModalCloseClick = (boolean) => {
		this.setState({ closedVisualization: boolean });
	};

	private checkPendingCondition = (condition) => {
		this.setState({ pending: condition });
	};

	public render() {
		const { activeView, selectedDataType, isDataSetClicked, closedVisualization, pending } =
			this.state;

		return (
			<Page
				leftContentContainerClassName={styles.leftContentContainer}
				hideHazardFilter
				hideDataRangeFilter
				leftContent={
					<Translation>
						{(t) => (
							<>
								<header className={styles.header}>
									<div className={styles.backButtonProfile}>
										<Button
											className={styles.backButton}
											onClick={() => navigate("/profile/")}
											iconName="back"
											transparent
										/>

										<h1>{t("Demography")}</h1>
									</div>
									<button
										type="button"
										style={{ border: "none", background: "none", cursor: "pointer" }}
										onClick={() => this.setState({ closedVisualization: false })}
										disabled={pending}
										title={t("Visualization")}>
										<Icon name="bars" className={styles.inputIcon} />
									</button>
								</header>

								{/* <div className={styles.dataDisplayDiv}>
                                    <div className={styles.radioInputHeading}>
                                        <>
                                            <h1>Select Data Format</h1>
                                            <h1>300</h1>
                                        </>

                                    </div>
                                    <div>
                                        <div className={styles.dataDetails}>
                                            <h2>Province 1</h2>
                                            <h2>10</h2>

                                        </div>
                                        <div className={styles.dataDetails}>
                                            <h2>Province 2</h2>
                                            <h2>12</h2>

                                        </div>
                                        <div className={styles.dataDetails}>
                                            <h2>Bagmati Province</h2>
                                            <h2>23</h2>

                                        </div>
                                        <div className={styles.dataDetails}>
                                            <h2>Gandaki Province</h2>
                                            <h2>105</h2>

                                        </div>
                                        <div className={styles.dataDetails}>
                                            <h2>Lumbini Province</h2>
                                            <h2>100</h2>

                                        </div>
                                        <div className={styles.dataDetails}>
                                            <h2>Karnali Province</h2>
                                            <h2>8</h2>

                                        </div>
                                        <div className={styles.dataDetails}>
                                            <h2>Sudur Paschim Province</h2>
                                            <h2>9</h2>

                                        </div>
                                    </div>

                                </div> */}

								<DisasterProfile
									className={styles.view}
									closedVisualization={closedVisualization}
									handleCloseVisualizationOnModalCloseClick={
										this.handleCloseVisualizationOnModalCloseClick
									}
									checkPendingCondition={this.checkPendingCondition}
								/>
							</>
						)}
					</Translation>
				}
			/>
		);
	}
}
