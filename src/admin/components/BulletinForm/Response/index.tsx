/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Translation } from "react-i18next";
import { _cs } from "@togglecorp/fujs";
import { setBulletinFeedbackAction, setBulletinCumulativeAction } from "#actionCreators";
import {
	districtsSelector,
	bulletinPageSelector,
	bulletinEditDataSelector,
	incidentListSelectorIP,
	hazardTypesSelector,
	languageSelector,
} from "#selectors";
import styles from "./styles.module.scss";

interface Props {}
const mapStateToProps = (state: AppState): PropsFromAppState => ({
	districts: districtsSelector(state),
	incidentList: incidentListSelectorIP(state),
	hazardTypes: hazardTypesSelector(state),
	language: languageSelector(state),
	bulletinEditData: bulletinEditDataSelector(state),
	bulletinData: bulletinPageSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setBulletinFeedback: (params) => dispatch(setBulletinFeedbackAction(params)),
	setCumulativeRedux: (params) => dispatch(setBulletinCumulativeAction(params)),
});

const Response = (props: Props) => {
	const {
		handleFeedbackChange,
		deleteFeedbackChange,
		// feedback,
		hazardWiseLossData,
		districts,
		handleSubFieldChange,
		annex,
		incidentList,
		hazardTypes,
		language: { language },
		setBulletinFeedback,
		bulletinEditData: { feedbackNe, feedback: feedbackEn },
		bulletinData: { feedback },
		bulletinEditData,
		setCumulativeRedux,
		isFeedbackDataUpdated,
		setIsFeedbackDataUpdated,
	} = props;

	const [remarks, setRemarks] = useState({
		hazard: "",
		district: "",
		description: "",
		deaths: 0,
		missing: 0,
		injured: 0,
		response: "",
	});
	const [cumulative, setCumulative] = useState();
	const getUpdatedFeedbackResponse = (id, key) =>
		Object.keys(bulletinEditData).length > 0
			? language === "en"
				? feedbackEn[id]
					? feedbackEn[id][key]
					: ""
				: feedbackNe[id]
				? feedbackNe[id][key]
				: ""
			: feedback[id]
			? feedback[id][key]
			: "";
	useEffect(() => {
		isFeedbackDataUpdated
			? Object.keys(feedback).map((id, i) => {
					setIsFeedbackDataUpdated(false);
					feedback[id]
						? (feedback[id].description = getUpdatedFeedbackResponse(id, "description"))
						: "";
					feedback[id] ? (feedback[id].response = getUpdatedFeedbackResponse(id, "response")) : "";
			  })
			: "";

		setBulletinFeedback({ feedback });
	}, [isFeedbackDataUpdated, feedback, feedbackNe]);
	const handleRemarksChange = (e, field) => {
		setRemarks({ ...remarks, [field]: e });
	};
	const handleFeedback = () => {
		if (remarks) {
			handleFeedbackChange(remarks);
		}
		setRemarks(null);
	};

	const getHazard = (h) => {
		const filtered = Object.values(hazardTypes).filter(
			(item) => item.titleNe === h || item.titleEn === h
		);
		if (filtered.length > 0 && language === "np") {
			return filtered[0].titleNe;
		}
		if (filtered.length > 0 && language === "en") {
			return filtered[0].title;
		}
		return "-";
	};

	const getDistrict = (d) => {
		const filtered = districts.filter((item) => item.title_ne === d || item.title_en === d);
		if (filtered.length > 0 && language === "np") {
			return filtered[0].title_ne;
		}
		if (filtered.length > 0 && language === "en") {
			return filtered[0].title_en;
		}
		return "-";
	};

	const hasResponse = (fDB) => {
		let result = true;
		if (fDB && Object.keys(fDB).length > 0) {
			Object.values(fDB).map((f) => {
				if (f.response || f.description) {
					result = false;
				}
				return null;
			});
		}
		return result;
	};

	useEffect(() => {
		// this is recalculating the whole thing and resonse
		if (
			hasResponse(feedback) &&
			incidentList &&
			incidentList.length > 0 &&
			hazardTypes &&
			Object.keys(hazardTypes).length > 0
		) {
			const temp = {};
			incidentList.map((item) => {
				const hazardNp = hazardTypes[item.hazard].titleNe;
				const hazardEn = hazardTypes[item.hazard].title;
				temp[item.id] = {
					hazardNp,
					hazardEn,
					hazard: hazardNp,
					district:
						language === "np"
							? item.wards[0] && item.wards[0].municipality.district.titleNe
							: item.wards[0] && item.wards[0].municipality.district.title,
					description: "",
					deaths: item.loss ? item.loss.peopleDeathCount : 0,
					missing: item.loss ? item.loss.peopleMissingCount : 0,
					injured: item.loss ? item.loss.peopleInjuredCount : 0,
					response: "",
				};
				return null;
			});

			if (temp && Object.keys(temp).length > 0) {
				handleFeedbackChange({ ...temp });
				// setBulletinFeedback({ feedback: { ...feedback, ...temp } });
			}
		}
	}, [incidentList, hazardTypes, language]);

	// part is just to add in the end of the table
	useEffect(() => {
		if (!annex && feedback && Object.keys(feedback).length > 0) {
			const getIncidents = () => Object.keys(feedback).length;
			const getDistricts = () => {
				const aD = Object.keys(feedback).map((item) => feedback[item].district);
				return [...new Set(aD)].length;
			};
			const cumulativeData = Object.keys(feedback)
				.map((item) => feedback[item])
				.reduce(
					(acc, cur) => ({
						deaths: Number(acc.deaths) + Number(cur.deaths || 0),
						missing: Number(acc.missing) + Number(cur.missing || 0),
						injured: Number(acc.injured) + Number(cur.injured || 0),
					}),
					{ deaths: 0, missing: 0, injured: 0 }
				);
			const other = {
				district: getDistricts(),
				incidents: getIncidents(),
			};
			setCumulative({ ...cumulativeData, ...other });
			setCumulativeRedux({ cumulative: { ...cumulativeData, ...other } });
		}
	}, [annex, feedback]);

	return (
		<>
			<div
				className={_cs(
					annex ? styles.formContainerAnnex : styles.formContainer,
					language === "np" ? styles.formContainerNepali : styles.formContainerEnglish
				)}>
				{!annex && (
					<h2>
						<Translation>{(t) => <span>{t("Response")}</span>}</Translation>
					</h2>
				)}
				{
					<div className={styles.pratikriyas}>
						{cumulative &&
							Object.keys(cumulative).length > 0 &&
							feedback &&
							Object.keys(feedback).length > 0 && (
								<table className={styles.responseTable}>
									<tr>
										<th>
											<Translation>{(t) => <span>{t("S.N")}</span>}</Translation>
										</th>
										<th>
											<Translation>{(t) => <span>{t("Incidents")}</span>}</Translation>
										</th>
										<th>
											<Translation>{(t) => <span>{t("District")}</span>}</Translation>
										</th>
										<th>
											<Translation>{(t) => <span>{t("death")}</span>}</Translation>
										</th>
										<th>
											<Translation>{(t) => <span>{t("missing")}</span>}</Translation>
										</th>
										<th>
											<Translation>{(t) => <span>{t("injured")}</span>}</Translation>
										</th>
										<th>
											<Translation>{(t) => <span>{t("Incident Details")}</span>}</Translation>
										</th>
										<th>
											<Translation>{(t) => <span>{t("Response")}</span>}</Translation>
										</th>
									</tr>
									{feedback &&
										Object.keys(feedback).map((hwL, i) => (
											<tr>
												<td>{i + 1}</td>
												<td>{getHazard(feedback[hwL].hazard)}</td>
												<td>{getDistrict(feedback[hwL].district)}</td>

												<td>{feedback[hwL].deaths}</td>
												<td>{feedback[hwL].missing}</td>
												<td>{feedback[hwL].injured}</td>
												<td>
													<div className={styles.formItemHalf}>
														{annex ? (
															feedback[hwL].description || ""
														) : (
															<div className={styles.inputContainer}>
																<Translation>
																	{(t) => (
																		<textarea
																			placeholder={t("Incident Details")}
																			onChange={(e) =>
																				handleSubFieldChange(e.target.value, hwL, "description")
																			}
																			value={feedback[hwL].description || ""}
																			rows={5}
																		/>
																	)}
																</Translation>
															</div>
														)}
													</div>
												</td>
												<td>
													<div className={styles.formItemHalf}>
														{annex ? (
															feedback[hwL].response || ""
														) : (
															<div className={styles.inputContainer}>
																<Translation>
																	{(t) => (
																		<textarea
																			placeholder={t("Response")}
																			onChange={(e) =>
																				handleSubFieldChange(e.target.value, hwL, "response")
																			}
																			value={feedback[hwL].response || ""}
																			rows={5}
																		/>
																	)}
																</Translation>
															</div>
														)}
													</div>
												</td>
											</tr>
										))}
									<tr className={styles.lastRow}>
										<td>
											<Translation>{(t) => <span>{t("Total")}</span>}</Translation>
										</td>
										<td>{cumulative.incidents}</td>
										<td>{cumulative.district}</td>
										<td>{cumulative.deaths}</td>
										<td>{cumulative.missing}</td>
										<td>{cumulative.injured}</td>
										<td> </td>
										<td> </td>
									</tr>
								</table>
							)}
					</div>
				}
			</div>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Response);
