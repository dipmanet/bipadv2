import React from "react";
import { Translation } from "react-i18next";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";

import { createConnectedRequestCoordinator, createRequestClient, methods } from "#request";
import DangerButton from "#rsca/Button/DangerButton";
import LoadingAnimation from "#rscv/LoadingAnimation";
import Modal from "#rscv/Modal";
import ModalBody from "#rscv/Modal/Body";
import ModalHeader from "#rscv/Modal/Header";
import { languageSelector } from "#selectors";
import styles from "./styles.module.scss";
import SituationReport from "./SituationReport";
import SidePane from "./SidePane";

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});

const requestOptions = {
	situationReportsRequest: {
		url: "/situation-report/",
		method: methods.GET,
		onMount: true,
		onFailure: ({ error }) => {
			// TODO: handle error
			console.warn("failure", error);
		},
		onFatal: () => {
			console.warn("fatal");
		},
	},
};

class SituationReportModal extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = { selectedReport: undefined };
	}

	getSelectedReportDetails = (response, selectedReport) => {
		if (!response) {
			return undefined;
		}
		const { results } = response;

		return results && results.find((s) => s.id === selectedReport);
	};

	handleSetSelectedReport = (selectedReport) => {
		this.setState({ selectedReport });
	};

	render() {
		const {
			className,
			closeModal,
			requests: {
				situationReportsRequest: { response, pending },
			},
			language: { language },
			handledisableOutsideDivClick,
		} = this.props;
		const { selectedReport } = this.state;
		const selectedReportDetails = this.getSelectedReportDetails(response, selectedReport);

		return (
			<Modal
				className={_cs(
					styles.situationReportModal,
					className,
					language === "np" && styles.languageFont
				)}>
				<Translation>
					{(t) => (
						<ModalHeader
							className={styles.header}
							title={t("Situation Report")}
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

				<ModalBody className={styles.modalBody}>
					{pending ? (
						<LoadingAnimation />
					) : (
						<>
							<SidePane
								className={styles.sidePane}
								reports={response.results}
								selectedReport={selectedReport}
								onSelectedReportChange={this.handleSetSelectedReport}
							/>
							<SituationReport
								className={styles.report}
								selectedReport={selectedReport}
								selectedReportDetails={selectedReportDetails}
							/>
						</>
					)}
				</ModalBody>
			</Modal>
		);
	}
}

export default connect(mapStateToProps)(
	createConnectedRequestCoordinator()(createRequestClient(requestOptions)(SituationReportModal))
);
