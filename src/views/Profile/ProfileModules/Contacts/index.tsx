import React from "react";
import { _cs } from "@togglecorp/fujs";

import { navigate } from "@reach/router";
import { Translation } from "react-i18next";
import AccentButton from "#rsca/Button/AccentButton";
import Icon from "#rscg/Icon";
import modalize from "#rscg/Modalize";

import Page from "#components/Page";
import Button from "#rsca/Button";
import DisasterProfile from "../../DisasterProfile";
import ProjectsProfile from "../../ProjectsProfile";
import Indicator from "../../Indicator";
import Contact from "../../Contact";
import Document from "../../Document";
import styles from "../../styles.module.scss";

type TabKeys = "summary" | "projectsProfile" | "contact" | "document";

interface Props {}

interface State {
	activeView: TabKeys;
}

const IndicatorButton = modalize(AccentButton);

export default class Profile extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			activeView: "summary",
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

	public render() {
		const { activeView } = this.state;

		return (
			<Page
				leftContentContainerClassName={styles.leftContentContainer}
				hideHazardFilter
				hideDataRangeFilter
				halfPageLeftPane
				leftContent={
					<>
						<header className={styles.header}>
							<Translation>
								{(t) => (
									<div className={styles.backButtonProfile}>
										<Button
											className={styles.backButton}
											onClick={() => navigate("/profile/")}
											iconName="back"
											transparent
										/>

										<h1>{t("Contact Personals")}</h1>
									</div>
								)}
							</Translation>
						</header>
						<Contact className={styles.viewLeft} />
					</>
				}
			/>
		);
	}
}
