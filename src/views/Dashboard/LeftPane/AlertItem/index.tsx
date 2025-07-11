/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */

import React from "react";
import { Translation } from "react-i18next";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";
import PropTypes from "prop-types";

// import DateOutput from '#components/DateOutput';
import Cloak from "#components/Cloak";
import alertIcon from "#resources/icons/Alert.svg";
import Button from "#rsca/Button";
import DangerConfirmButton from "#rsca/ConfirmButton/DangerConfirmButton";
import Icon from "#rscg/Icon";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import { languageSelector } from "#selectors";
import { convertDateAccToLanguage, convertTimeAccToLanguage, getYesterday } from "#utils/common";
import styles from "./styles.module.scss";

const propTypes = {
	className: PropTypes.string,
	language: { language: "en" },
};

const defaultProps = {
	className: undefined,
	language: { language: "en" },
};

const isRecent = (date, recentDay) => {
	const yesterday = getYesterday(recentDay);
	const timestamp = new Date(date).getTime();
	return timestamp > yesterday;
};

const emptyReferenceData = {
	fields: {
		title: "",
		address: "",
	},
};

const mapStateToProps = (state) => ({
	language: languageSelector(state),
});

class AlertItem extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	handleEditButtonClick = () => {
		const { onEditButtonClick, alert } = this.props;

		if (!onEditButtonClick) {
			return;
		}

		onEditButtonClick(alert);
	};

	handleDeleteButtonClick = () => {
		const { onDeleteButtonClick, alert } = this.props;

		if (!onDeleteButtonClick) {
			return;
		}

		onDeleteButtonClick(alert);
	};

	handleMouseEnter = () => {
		const { onHover, alert } = this.props;

		if (onHover) {
			onHover(alert.id);
		}
	};

	handleMouseLeave = () => {
		const { onHover } = this.props;

		if (onHover) {
			onHover();
		}
	};

	parseTitle = (title, referenceData, titleNe) => {
		const {
			fields: { title: referenceDataTitle },
		} = referenceData;

		const {
			language: { language },
		} = this.props;
		// if(language === 'en'){
		if (title.toUpperCase().trim() === "FLOOD") {
			return `
            ${(
							<div>
								<Translation>{(t) => <p>{t("Flood at")}</p>}</Translation>
								<Translation>{(t) => <p>{t(`${referenceDataTitle}`)}</p>}</Translation>
								<Translation>{(t) => <p>{t("Ma")}</p>}</Translation>
							</div>
						)}
                `;
		}
		if (title.toUpperCase().trim() === "HEAVY RAINFALL") {
			return `Heavy Rainfall at ${referenceDataTitle}`;
		}
		if (title.toUpperCase().trim() === "FIRE") {
			return `${referenceDataTitle}`;
		}
		if (title.toUpperCase().trim() === "EARTHQUAKE") {
			const {
				fields: { address: epicenter },
			} = referenceData;
			return `
            ${(
							<div>
								<Translation>{(t) => <p>{t("Earthquake at")}</p>}</Translation>
								<Translation>{(t) => <p>{t("Ma")}</p>}</Translation>
							</div>
						)}
            ${epicenter}
            
            `;
		}
		if (title.toUpperCase().trim() === "ENVIRONMENTAL POLLUTION") {
			return `Environmental pollution at ${referenceDataTitle}`;
		}

		return language === "en" ? title : titleNe === undefined || null ? title : titleNe;
	};

	render() {
		const {
			alert,
			className,
			hazardTypes,
			recentDay,
			isHovered,
			language: { language },
		} = this.props;

		const {
			title,
			titleNe,
			hazard,
			startedOn,
			// createdOn,
			referenceData,
		} = alert;
		const alertReferenceData = referenceData ? JSON.parse(referenceData) : emptyReferenceData;

		const parsedTitle = this.parseTitle(title, alertReferenceData, titleNe);
		const time = startedOn ? startedOn.split("T")[1] : "NA";
		const hour = time.split(":")[0];
		const minutes = time.split(":")[1];
		let timeIndicator;

		if (hour + minutes <= 1200) {
			if (language === "en") {
				timeIndicator = "AM";
			} else {
				timeIndicator = "बजे";
			}
		} else if (hour + minutes > 1200 && hour + minutes <= 2359) {
			if (language === "en") {
				timeIndicator = "PM";
			} else {
				timeIndicator = "बजे";
			}
		} else {
			timeIndicator = "";
		}
		const parsedTime = `${hour}:${minutes} ${timeIndicator}`;
		// const isNew = isRecent(startedOn, recentDay);
		const isNew = isRecent(startedOn, recentDay);
		return (
			<div
				className={_cs(
					className,
					styles.alertItem,
					isNew && styles.new,
					isHovered && styles.hovered
				)}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}>
				<ScalableVectorGraphics
					className={styles.icon}
					src={(hazardTypes[hazard] ? hazardTypes[hazard].icon : undefined) || alertIcon}
					style={{
						color: (hazardTypes[hazard] ? hazardTypes[hazard].color : undefined) || "#4666b0",
					}}
				/>
				<div className={styles.right}>
					<div className={styles.top}>
						<h3 className={styles.title}>
							{/* {title} */}
							{parsedTitle}
						</h3>
						<Cloak hiddenIf={(p) => !p.change_alert}>
							<Button
								transparent
								className={styles.editButton}
								onClick={this.handleEditButtonClick}
								iconName="edit">
								<Translation>{(t) => <span>{t("Edit")}</span>}</Translation>
							</Button>
						</Cloak>
						<Cloak hiddenIf={(p) => !p.delete_alert}>
							<Translation>
								{(t) => (
									<DangerConfirmButton
										iconName="delete"
										transparent
										className={styles.deleteButton}
										onClick={this.handleDeleteButtonClick}
										confirmationMessage={t("Are you sure to delete the Alert?")}>
										<span>{t("Delete")}</span>
									</DangerConfirmButton>
								)}
							</Translation>
						</Cloak>
					</div>
					<div className={styles.bottom}>
						{/* <DateOutput
                            className={styles.startedOn}
                            value={startedOn}
                        /> */}

						<div className={styles.time}>
							<div className={styles.date}>
								<div className={styles.dateIcon}>
									<Icon className={styles.icon} name="calendar" />
								</div>

								<div className={styles.dateValue}>
									{convertDateAccToLanguage(startedOn.split("T")[0], language)}
								</div>
							</div>

							<div className={styles.dateTime}>
								<div className={styles.dateTimeIcon}>
									<Icon className={styles.icon} name="dataRange" />
								</div>

								<div className={styles.dateTimeValue}>{parsedTime}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, undefined)(AlertItem);
