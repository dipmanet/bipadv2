/* eslint-disable no-nested-ternary */
import React from "react";
import { Translation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "@reach/router";
import { _cs, isDefined, reverseRoute } from "@togglecorp/fujs";
import memoize from "memoize-one";
import PropTypes from "prop-types";

import {
	patchIncidentActionIP,
	removeIncidentActionIP,
	setIncidentActionIP,
} from "#actionCreators";
import Cloak from "#components/Cloak";
import DateOutput from "#components/DateOutput";
import IncidentFeedbackFormModal from "#components/IncidentFeedbackFormModal";
import IncidentFeedbacksModal from "#components/IncidentFeedbacksModal";
import TextOutput from "#components/TextOutput";
import { createRequestClient, methods } from "#request";
import alertIcon from "#resources/icons/Alert.svg";
import AccentButton from "#rsca/Button/AccentButton";
import DangerConfirmButton from "#rsca/ConfirmButton/DangerConfirmButton";
import modalize from "#rscg/Modalize";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import { languageSelector, sourcesSelector } from "#selectors";
import { convertDateAccToLanguage, getYesterday } from "#utils/common";
import styles from "./styles.module.scss";
import AddIncidentForm from "../AddIncidentForm";

const ModalAccentButton = modalize(AccentButton);

const propTypes = {
	className: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.object.isRequired,
	setIncident: PropTypes.func.isRequired,
	// eslint-disable-next-line react/no-unused-prop-types
	removeIncident: PropTypes.func.isRequired,
	patchIncident: PropTypes.func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	hazardTypes: PropTypes.object.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	sources: PropTypes.object.isRequired,
	onHover: PropTypes.func,
	recentDay: PropTypes.number.isRequired,
	isHovered: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
	requests: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	sources: sourcesSelector(state),
	language: languageSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
	patchIncident: (params) => dispatch(patchIncidentActionIP(params)),
	setIncident: (params) => dispatch(setIncidentActionIP(params)),
	removeIncident: (params) => dispatch(removeIncidentActionIP(params)),
});

const defaultProps = {
	className: undefined,
	onHover: undefined,
};

const LocationOutput = ({ provinceTitle, districtTitle, municipalityTitle, streetAddress }) => (
	<div className={styles.locationOutput}>
		{provinceTitle && <div className={styles.provinceName}>{provinceTitle}</div>}
		{districtTitle && <div className={styles.districtName}>{districtTitle}</div>}
		{municipalityTitle && <div className={styles.municipalityName}>{municipalityTitle}</div>}
		{streetAddress && <div className={styles.streetAddress}>{streetAddress}</div>}
	</div>
);

LocationOutput.propTypes = {
	provinceTitle: PropTypes.string,
	districtTitle: PropTypes.string,
	municipalityTitle: PropTypes.string,
	streetAddress: PropTypes.string,
};

LocationOutput.defaultProps = {
	provinceTitle: "",
	districtTitle: "",
	municipalityTitle: "",
	streetAddress: "",
};

const requestOptions = {
	incidentDeleteRequest: {
		url: ({
			props: {
				data: { id: incidentId },
			},
		}) => `/incident/${incidentId}/`,
		method: methods.DELETE,
		onSuccess: ({
			props: {
				data: { id: incidentId },
				removeIncident,
			},
		}) => {
			removeIncident({ incidentId });
		},
	},
};

class IncidentItem extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	handleIncidentEdit = (incident) => {
		const { setIncident } = this.props;

		if (isDefined(incident)) {
			setIncident({ incident });
		}
	};

	handleLossEdit = (loss, incident) => {
		const { patchIncident } = this.props;

		patchIncident({
			incident: {
				loss,
			},
			incidentId: incident.id,
		});
	};

	handleMouseEnter = () => {
		const { onHover, data } = this.props;

		if (onHover) {
			onHover(data.id);
		}
	};

	handleMouseLeave = () => {
		const { onHover } = this.props;

		if (onHover) {
			onHover();
		}
	};

	handleIncidentDelete = () => {
		const {
			requests: { incidentDeleteRequest },
		} = this.props;
		incidentDeleteRequest.do();
	};

	isRecent = memoize((date, recentDay) => {
		const yesterday = getYesterday(recentDay);
		const timestamp = new Date(date).getTime();
		return timestamp > yesterday;
	});

	render() {
		const {
			className,
			data,
			hazardTypes,
			recentDay,
			isHovered,
			sources,
			requests: {
				incidentDeleteRequest: { pending: incidentDeletePending },
			},
			language: { language },
		} = this.props;

		const {
			id: incidentServerId,
			title,
			titleNe,
			incidentOn,
			streetAddress,
			source,
			verified,
			hazard: hazardId,
			id: incidentId,
			loss: { id: lossServerId } = {},
			provinceTitle,
			districtTitle,
			municipalityTitle,
			unacknowledgedFeedbackCount,
		} = data;

		const isNew = this.isRecent(incidentOn, recentDay);
		const hazard = hazardTypes[hazardId];

		return (
			// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
			<div
				className={_cs(
					className,
					styles.incidentItem,
					isNew && styles.new,
					isHovered && styles.hovered
				)}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}>
				<div className={styles.left}>
					<ScalableVectorGraphics
						className={styles.icon}
						src={hazard.icon || alertIcon}
						style={{ color: hazard.color || "#4666b0" }}
					/>
				</div>
				<div className={styles.right}>
					<header className={styles.header}>
						<h3
							title={language === "en" ? title : titleNe === undefined ? title : titleNe}
							className={styles.heading}>
							{language === "en" ? title : titleNe === undefined ? title : titleNe}
						</h3>
						<DateOutput
							className={styles.date}
							value={convertDateAccToLanguage(new Date(incidentOn).toLocaleDateString(), language)}
							language={language}
						/>
					</header>
					<div className={styles.adminActions}>
						<Cloak hiddenIf={(p) => !p.change_incident}>
							<ModalAccentButton
								className={styles.button}
								transparent
								iconName="edit"
								modal={
									<AddIncidentForm
										lossServerId={lossServerId}
										incidentServerId={incidentServerId}
										incidentDetails={data}
										onIncidentChange={this.handleIncidentEdit}
										onLossChange={this.handleLossEdit}
									/>
								}>
								<Translation>{(t) => <span>{t("Edit")}</span>}</Translation>
							</ModalAccentButton>
						</Cloak>
						<Cloak hiddenIf={(p) => !p.delete_incident}>
							<Translation>
								{(t) => (
									<DangerConfirmButton
										iconName="delete"
										className={styles.button}
										confirmationMessage={t("Are you sure you want to delete this incident?")}
										onClick={this.handleIncidentDelete}
										pending={incidentDeletePending}
										transparent>
										<span>{t("Delete")}</span>
									</DangerConfirmButton>
								)}
							</Translation>
						</Cloak>
						<Cloak hiddenIf={(p) => !p.change_feedback}>
							<ModalAccentButton
								className={styles.button}
								transparent
								iconName="chatBoxes"
								modal={<IncidentFeedbacksModal incidentId={incidentId} />}>
								<Translation>{(t) => <span>{t("Feedbacks")}</span>}</Translation>
								{`(${unacknowledgedFeedbackCount || 0})`}
							</ModalAccentButton>
						</Cloak>
					</div>
					<div className={styles.content}>
						<LocationOutput
							provinceTitle={provinceTitle}
							municipalityTitle={municipalityTitle}
							districtTitle={districtTitle}
							streetAddress={streetAddress}
							alwaysVisible
						/>
						<div className={styles.outputGroup}>
							<Translation>
								{(t) => (
									<>
										<TextOutput
											label={t("Source")}
											value={source === "nepal_police" ? t("Nepal Police") : ""}
											alwaysVisible
											className={styles.source}
										/>
										<TextOutput
											value={verified ? t("Verified") : t("Not verified")}
											label={t("Status")}
											alwaysVisible
											className={styles.status}
										/>
									</>
								)}
							</Translation>
						</div>
					</div>
					<div className={styles.publicActions}>
						<Translation>
							{(t) => (
								<Link
									className={styles.link}
									to={reverseRoute("incidents/:incidentId/response", { incidentId })}>
									{t("Go to response")}
								</Link>
							)}
						</Translation>

						<ModalAccentButton
							className={styles.button}
							transparent
							iconName="chatBox"
							modal={<IncidentFeedbackFormModal incidentId={incidentId} />}>
							<Translation>{(t) => <span>{t("LEAVE FEEDBACK")}</span>}</Translation>
						</ModalAccentButton>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createRequestClient(requestOptions)(IncidentItem));
