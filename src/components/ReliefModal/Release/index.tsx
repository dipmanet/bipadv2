import React from "react";
import { _cs } from "@togglecorp/fujs";
import { Translation } from "react-i18next";
import { createRequestClient, NewProps, ClientAttributes, methods } from "#request";

import LoadingAnimation from "#rscv/LoadingAnimation";
import ListView from "#rscv/List/ListView";
import AccentButton from "#rsca/Button/AccentButton";
import modalize from "#rscg/Modalize";
import Cloak from "#components/Cloak";

import { Release } from "#types";
import { MultiResponse } from "#store/atom/response/types";

import ReleaseItem from "./ReleaseItem";
import AddReleaseForm from "./AddReleaseForm";

import styles from "./styles.module.scss";

interface OwnProps {
	onUpdate?: () => void;
	className?: string;
}

interface State {}

interface Params {
	body?: object;
}
const ModalAccentButton = modalize(AccentButton);

const requestOptions: { [key: string]: ClientAttributes<OwnProps, Params> } = {
	reliefReleaseGetRequest: {
		url: "/relief-release/",
		method: methods.GET,
		onMount: true,
	},
};

type Props = NewProps<OwnProps, Params>;
const releaseKeySelector = (release: Release) => release.id;

class ReliefRelease extends React.PureComponent<Props, State> {
	private getReleaseRendererParams = (_: number, release: Release) => ({
		data: release,
		onUpdate: this.handleReliefReleaseChange,
	});

	private handleReliefReleaseChange = () => {
		const {
			requests: { reliefReleaseGetRequest },
		} = this.props;
		reliefReleaseGetRequest.do();
	};

	public render() {
		const {
			requests: {
				reliefReleaseGetRequest: { response, pending },
			},
			className,
		} = this.props;

		let releaseList: Release[] = [];
		if (!pending && response) {
			const releaseResponse = response as MultiResponse<Release>;
			releaseList = releaseResponse.results;
		}

		return (
			<Translation>
				{(t) => (
					<div className={_cs(className, styles.release)}>
						{pending && <LoadingAnimation />}
						<header className={styles.header}>
							<h3 className={styles.heading}>{t("Releases")}</h3>
							<Cloak hiddenIf={(p) => !p.add_release}>
								<ModalAccentButton
									className={styles.addReleaseButton}
									title={t("Add Release")}
									iconName="add"
									transparent
									modal={<AddReleaseForm onUpdate={this.handleReliefReleaseChange} />}>
									{t("New Release")}
								</ModalAccentButton>
							</Cloak>
						</header>
						<ListView
							className={styles.content}
							data={releaseList}
							keySelector={releaseKeySelector}
							renderer={ReleaseItem}
							rendererParams={this.getReleaseRendererParams}
						/>
					</div>
				)}
			</Translation>
		);
	}
}

export default createRequestClient(requestOptions)(ReliefRelease);
