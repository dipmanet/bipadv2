import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import * as ReachRouter from "@reach/router";
import Loader from "react-loader";
// import { NepaliDatePicker } from 'datepicker-nepali-reactjs';
import { _cs } from "@togglecorp/fujs";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
} from "#request";
import {
	setCarKeysAction,
	setGeneralDataAction,
	setPalikaRedirectAction,
	setDrrmProgressAction,
} from "#actionCreators";
import {
	drrmProgresSelector,
	drrmRegionSelector,
	generalDataSelector,
	userSelector,
	palikaLanguageSelector,
} from "#selectors";
import Icon from "#rscg/Icon";
import styles from "./styles.module.scss";
import Gt from "../../../../utils";
import Translations from "../../../../Constants/Translations";
import NextPrevBtns from "../../NextPrevBtns";
import "nepali-datepicker-reactjs/dist/index.css";

const mapStateToProps = (state) => ({
	generalData: generalDataSelector(state),
	user: userSelector(state),
	drrmRegion: drrmRegionSelector(state),
	drrmProgress: drrmProgresSelector(state),
	drrmLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
	setGeneralDatapp: (params) => dispatch(setGeneralDataAction(params)),
	setPalikaRedirect: (params) => dispatch(setPalikaRedirectAction(params)),
	setCarKeys: (params) => dispatch(setCarKeysAction(params)),
	setProgress: (params) => dispatch(setDrrmProgressAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	MunContacts: {
		url: "/municipality-contact/",
		query: ({ params, props }) => {
			if (params && params.municipality) {
				return {
					province: params.province,
					district: params.district,
					municipality: params.municipality,
					limit: params.page,
					meta: params.meta,
				};
			}

			return {
				limit: params.page,
				offset: params.offset,

				meta: params.meta,
			};
		},
		method: methods.GET,
		onMount: true,

		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;

			if (params && params.organisation) {
				params.organisation(citizenReportList);
			}
			if (params && params.paginationParameters) {
				params.paginationParameters(response);
			}
		},
	},
	FiscalYearFetch: {
		url: "/nepali-fiscal-year/?ordering=-id",
		method: methods.GET,
		onMount: true,

		onSuccess: ({ response, params }) => {
			let fiscalYearList: CitizenReport[] = [];
			const fiscalYearListResponse = response as MultiResponse<CitizenReport>;
			fiscalYearList = fiscalYearListResponse.results;
			params.fiscalYearList(fiscalYearList);
		},
	},
	FiscalYearFetchCurrent: {
		url: "/nepali-fiscal-year/?current=true",
		method: methods.GET,
		onMount: true,

		onSuccess: ({ response, params }) => {
			let fiscalYearCurrent: CitizenReport[] = [];
			const fiscalYearListResponse = response as MultiResponse<CitizenReport>;
			fiscalYearCurrent = fiscalYearListResponse.results;
			params.curentFiscalYear(fiscalYearCurrent);
		},
	},
};

export interface GeneralData {
	reportTitle?: string;
	fiscalYear: string;
	mayor: string;
	cao: string;
	focalPerson: string;
	formationDate: string;
	committeeMembers: number;
}

interface Props {
	reportTitle: string;
	datefrom: string;
	dateTo: string;
	mayor: string;
	cao: string;
	focalPerson: string;
	formationDate: string;
	memberCount: string;
}

interface Location {
	municipalityId: number;
	districtId: number;
	provinceId: number;
}

let province = 0;
let district = 0;
let municipality = 0;

const General = (props: Props) => {
	const {
		generalData,
		updateTab,
		localMembers,
		showErr,
		requests: { FiscalYearFetchCurrent, FiscalYearFetch, MunContacts },
		setGeneralDatapp,
		user,
		drrmRegion,
		setProgress,
		drrmProgress,
		drrmLanguage,
	} = props;

	// const {
	//     reportTitle: rt,
	//     fiscalYear: fy,
	//     formationDate: fd,
	//     committeeMembers: cm,
	// } = generalData;

	const [reportTitle, setreportTitle] = useState<string>("");
	const [fiscalYear, setfiscalYear] = useState<string>("");
	const [formationDate, setformationDate] = useState<string>("");
	const [committeeMembers, setcommitteeMembers] = useState<number>(0);
	const [fiscalYearList, setFiscalYearList] = useState([]);
	const [fiscalYearListNew, setFiscalYearListNew] = useState([]);
	const [showInfo, setShowInfo] = useState(false);
	const [fyErr, setFyErr] = useState(false);
	const [dateErr, setDate] = useState(false);
	const [fiscalYearTitle, setFiscalYearTitle] = useState("");
	const [fetchedData, setFetechedData] = useState([]);
	const [disabled, setDisabled] = useState(false);
	const [currentFiscalYear, setCurrentYear] = useState(null);

	const [mayor, setmayor] = useState("");
	const [cao, setcao] = useState("");
	const [focalPerson, setfocalPerson] = useState("");
	const [loader, setLoader] = useState(true);

	useEffect(() => {
		if (generalData && generalData.item) {
			setfiscalYear(generalData.item.fiscalYear);
			setDisabled(true);
		}
		if (!generalData.item && generalData.fiscalYear) {
			setfiscalYear(generalData.fiscalYear);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// if (!generalData.data) {
	//     // we are in edit mode
	//     setfiscalYear(generalData.item.id);
	//     setDisabled(true);
	// }

	if (drrmRegion.municipality) {
		municipality = drrmRegion.municipality;
		district = drrmRegion.district;
		province = drrmRegion.province;
	} else {
		municipality = user.profile.municipality;
		district = user.profile.district;
		province = user.profile.province;
	}

	const handleSelectChange = (fiscal: any) => {
		setfiscalYear(fiscal.target.value);
		const title = fiscalYearList.filter((data) => Number(data.id) === Number(fiscal.target.value));
		setFiscalYearTitle(title[0].titleEn);
	};
	const handleFiscalYearList = (response) => {
		setFiscalYearList(response);
	};

	useEffect(() => {
		if (currentFiscalYear && fiscalYearList.length > 0) {
			const currentFyear = currentFiscalYear[0].titleEn;
			const newList = fiscalYearList.filter((f) => f.titleEn <= currentFyear);
			setFiscalYearListNew(newList);
		}
	}, [currentFiscalYear, fiscalYearList]);

	FiscalYearFetch.setDefaultParams({
		fiscalYearList: handleFiscalYearList,
	});
	FiscalYearFetchCurrent.setDefaultParams({
		curentFiscalYear: setCurrentYear,
	});

	const handleEditContacts = (contactItem) => {
		const { setPalikaRedirect } = props;
		setPalikaRedirect({
			showForm: true,
			contactItem,
			showModal: "contact",
			contactID: contactItem.id,
			redirectTo: 0,
		});
		ReachRouter.navigate("/profile/", {
			state: { showForm: true },
			replace: true,
		});
	};
	const handleAddContact = () => {
		const { setPalikaRedirect } = props;
		setPalikaRedirect({
			showForm: true,
			showModal: "contact",
			redirectTo: 0,
		});
		ReachRouter.navigate("/profile/", {
			state: { showForm: true },
			replace: true,
		});
	};
	const handleFetchedData = (response) => {
		setFetechedData(response);
		setLoader(false);
		const mayorData = response.filter((contact) => contact.position === "Mayor");
		const caoData = response.filter((item) => item.position === "Chief Administrative Officer");
		const focalPersonData = response.filter((item) => item.isDrrFocalPerson === true);
		if (mayorData.length > 0) {
			setmayor(mayorData[0]);
		}
		if (caoData.length > 0) {
			setcao(caoData[0]);
		}
		if (focalPersonData.length > 0) {
			setfocalPerson(focalPersonData[0]);
		}
	};

	MunContacts.setDefaultParams({
		organisation: handleFetchedData,
		municipality,
		district,
		province,
	});
	const handleCommitteeMembers = (members) => {
		setcommitteeMembers(members.target.value);
	};
	useEffect(() => {
		if (!focalPerson || !mayor || !cao) {
			setShowInfo(true);
		}
	}, [cao, focalPerson, mayor]);

	const validationErrs = () => {
		if (!generalData.item && generalData.fiscalYear) {
			setfiscalYear(generalData.fiscalYear);
			return false;
		}
		const e = [fiscalYear];
		const f = [setFyErr];
		const result = e.map((item) => {
			if (!item) {
				return true;
			}
			return false;
		});
		if (result.indexOf(true) > -1) {
			result.map((item, i) => {
				if (item === true) {
					f[i](true);
				} else {
					f[i](false);
				}

				return null;
			});
			return true;
		}
		return false;
	};
	useEffect(() => {
		if (generalData.fiscalYear) {
			setFiscalYearTitle(generalData.fiscalYear);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDataSave = () => {
		if (!validationErrs() && fiscalYear !== "") {
			props.setGeneralDatapp({
				reportTitle,
				fiscalYear,
				mayor,
				cao,
				focalPerson,
				formationDate,
				committeeMembers,
				localMembers,
				fiscalYearTitle: !generalData.fiscalYearTitle
					? fiscalYearTitle
					: generalData.fiscalYearTitle,
			});
			updateTab();
			props.handleShowErr(false);
			if (drrmProgress < 0) {
				setProgress(0);
			}
			props.handleNextClick();
		} else {
			validationErrs();
			props.handleShowErr(true);
		}
	};

	const filterByLeader =
		fetchedData &&
		(fetchedData.filter((item) => item.position === "Mayor").length > 0
			? fetchedData.filter((item) => item.position === "Mayor")
			: fetchedData.filter((item) => item.position === "mayor").length > 0
			? fetchedData.filter((item) => item.position === "mayor")
			: fetchedData.filter((item) => item.position === "chairperson").length > 0
			? fetchedData.filter((item) => item.position === "chairperson")
			: fetchedData.filter((item) => item.position === "Chairperson").length > 0
			? fetchedData.filter((item) => item.position === "Chairperson")
			: fetchedData.filter((item) => item.position === "chair person").length > 0
			? fetchedData.filter((item) => item.position === "chair person")
			: fetchedData.filter((item) => item.position === "Chair person").length > 0
			? fetchedData.filter((item) => item.position === "Chair person")
			: fetchedData.filter((item) => item.position === "Chair Person").length > 0
			? fetchedData.filter((item) => item.position === "Chair Person")
			: fetchedData.filter((item) => item.position === "chair Person").length > 0
			? fetchedData.filter((item) => item.position === "chair Person")
			: []);
	const filterCAO =
		fetchedData &&
		(fetchedData.filter((item) => item.position === "Chief Administrative Officer").length > 0
			? fetchedData.filter((item) => item.position === "Chief Administrative Officer")
			: fetchedData.filter((item) => item.position === "chief Administrative Officer").length > 0
			? fetchedData.filter((item) => item.position === "chief Administrative Officer")
			: fetchedData.filter((item) => item.position === "chief administrative Officer").length > 0
			? fetchedData.filter((item) => item.position === "chief administrative Officer")
			: fetchedData.filter((item) => item.position === "chief administrative officer").length > 0
			? fetchedData.filter((item) => item.position === "chief administrative officer")
			: fetchedData.filter((item) => item.position === "Chief Administrative officer").length > 0
			? fetchedData.filter((item) => item.position === "Chief Administrative officer")
			: fetchedData.filter((item) => item.position === "Chief administrative officer").length > 0
			? fetchedData.filter((item) => item.position === "Chief administrative officer")
			: []);

	return (
		<div className={styles.mainPageDetailsContainer}>
			{loader ? (
				<>
					<Loader left="60%" top="50%" />
					<p className={styles.loaderInfo}>Loading...Please Wait</p>
				</>
			) : (
				<>
					{props.annex ? (
						""
					) : (
						<h2>
							<Gt section={Translations.GeneralInformation} />
						</h2>
					)}
					{!props.annex && (
						<div className={styles.formColumn}>
							<div className={styles.inputFiscalYear}>
								<h3>
									<strong>
										<Gt section={Translations.Fiscalyear} />
									</strong>
								</h3>

								<select
									value={Number(fiscalYear)}
									// defaultValue={fiscalYear}
									onChange={handleSelectChange}
									className={styles.inputElement}
									disabled={disabled}>
									<option value="">
										{drrmLanguage.language === "np"
											? "आर्थिक वर्ष चयन गर्नुहोस्"
											: "Select Fiscal Year"}
									</option>
									{fiscalYearListNew &&
										fiscalYearListNew.map((item) => (
											<option value={item.id}>
												{drrmLanguage.language === "np" ? item.titleNp : item.titleEn}
											</option>
										))}
								</select>
							</div>
							{/* <h5>
                                    <Gt
                                        section={Translations.GeneralSubtitleFirst}
                                    />
                                </h5> */}
							{fyErr ? (
								<div className={styles.errorMsg}>
									<Gt section={Translations.GeneralSelectFiscalYear} />
								</div>
							) : (
								""
							)}
						</div>
					)}

					<div className={styles.formColumn}>
						{!props.annex && (
							<h3 style={{ marginBottom: "10px" }}>
								<strong>
									<Gt section={Translations.MunicipalDRR} />
								</strong>
							</h3>
						)}
						<div className={styles.personalDetailsrow}>
							<div className={styles.personalDetails}>
								{!props.annex && (
									<table className={drrmLanguage.language === "np" && styles.nep} id="table-to-xls">
										<tbody>
											<tr>
												<th>
													<Gt section={Translations.GeneralPosition} />
												</th>
												<th>
													<Gt section={Translations.Name} />
												</th>
												<th>
													<Gt section={Translations.Email} />
												</th>
												<th>
													<Gt section={Translations.PhoneNumber} />
												</th>
												{!props.annex && <th>{<Gt section={Translations.AddEdit} />}</th>}
											</tr>
											<tr>
												{fetchedData && filterByLeader.length > 0 ? (
													filterByLeader.map((item) => (
														<>
															<td>{<Gt section={Translations.MayororChairperson} />}</td>
															<td>{item.name || "-"}</td>
															<td>{item.email || "-"}</td>
															<td>{item.mobileNumber || "-"}</td>
															{!props.annex && (
																<td>
																	<button
																		type="button"
																		onClick={() => handleEditContacts(item)}
																		className={styles.addEditBtn}>
																		<Icon name="edit" className={styles.addEditIcon} />
																	</button>
																</td>
															)}
														</>
													))
												) : (
													<>
														<td>{<Gt section={Translations.MayororChairperson} />}</td>
														<td>{"-"}</td>
														<td>{"-"}</td>
														<td>{"-"}</td>
														{!props.annex && (
															<td>
																<button
																	type="button"
																	className={styles.addEditBtn}
																	onClick={handleAddContact}>
																	<Icon name="plus" className={styles.addEditIcon} />
																</button>
															</td>
														)}
													</>
												)}
											</tr>
											<tr>
												{fetchedData && filterCAO.length > 0 ? (
													filterCAO.map((item) => (
														<>
															<td>{<Gt section={Translations.ChiefAdminstrative} />}</td>
															<td>{item.name || "-"}</td>
															<td>{item.email || "-"}</td>
															<td>{item.mobileNumber || "-"}</td>
															{!props.annex && (
																<td>
																	<button
																		type="button"
																		onClick={() => handleEditContacts(item)}
																		className={styles.addEditBtn}>
																		<Icon name="edit" className={styles.addEditIcon} />
																	</button>
																</td>
															)}
														</>
													))
												) : (
													<>
														<td>{<Gt section={Translations.ChiefAdminstrative} />}</td>
														<td>{"-"}</td>
														<td>{"-"}</td>
														<td>{"-"}</td>
														{!props.annex && (
															<td>
																<button
																	type="button"
																	className={styles.addEditBtn}
																	onClick={handleAddContact}>
																	<Icon name="plus" className={styles.addEditIcon} />
																</button>
															</td>
														)}
													</>
												)}
											</tr>

											<tr>
												{fetchedData &&
												fetchedData.filter((item) => item.isDrrFocalPerson === true).length > 0 ? (
													fetchedData
														.filter((item) => item.isDrrFocalPerson === true)
														.map((item) => (
															<>
																<td>{"DRR Focal Person"}</td>
																<td>{item.name || "-"}</td>
																<td>{item.email || "-"}</td>
																<td>{item.mobileNumber || "-"}</td>
																{!props.annex && (
																	<td>
																		<button
																			type="button"
																			onClick={() => handleEditContacts(item)}
																			className={styles.addEditBtn}>
																			<Icon name="edit" className={styles.addEditIcon} />
																		</button>
																	</td>
																)}
															</>
														))
												) : (
													<>
														<td>{<Gt section={Translations.DRRfocal} />}</td>
														<td>{"-"}</td>
														<td>{"-"}</td>
														<td>{"-"}</td>
														{!props.annex && (
															<td>
																<button
																	type="button"
																	className={styles.addEditBtn}
																	onClick={handleAddContact}>
																	<Icon name="plus" className={styles.addEditIcon} />
																</button>
															</td>
														)}
													</>
												)}
											</tr>
										</tbody>
									</table>
								)}
								{showInfo && !props.annex && (
									<h5>
										<i>
											<Gt section={Translations.GeneralPleaseClick} />
										</i>
									</h5>
								)}
							</div>
						</div>
						{!props.annex && (
							<div className={styles.localComitteeData}>
								<h3>
									<strong>
										<Gt section={Translations.LocalDisaster} />
									</strong>
								</h3>
								<div className={styles.localComitteeDetail}>
									<div className={styles.inputContainer}>
										<span className={styles.labelDate}>
											<Gt section={Translations.FormationDateTitle} />
										</span>
										<NepaliDatePicker
											inputClassName={styles.formControl}
											className={styles.datepicker}
											value={formationDate}
											onChange={(value: string) => setformationDate(value)}
											// placeholder="sdfsdfs"
											options={{
												closeOnSelect: true,
												calenderLocale: drrmLanguage.language === "en" ? "en" : "ne",
												valueLocale: drrmLanguage.language === "en" ? "en" : "ne",
											}}
										/>
									</div>
									<div className={styles.inputContainer}>
										<span className={styles.labelDate}>
											<Gt section={Translations.Numberofmembers} />
										</span>
										<input
											className={styles.comitteeMembers}
											onChange={handleCommitteeMembers}
											value={committeeMembers}
											type="number"
											placeholder="Enter the number of members"
										/>
									</div>
								</div>
							</div>
						)}

						<div className={styles.row}>
							{!props.annex && (
								<>
									<h3>
										<strong>
											<Gt section={Translations.Committeemembers} />
										</strong>
									</h3>
								</>
							)}
							{props.annex && (
								<h3>
									<strong>
										<Gt section={Translations.FormationDateTitle} />
									</strong>
								</h3>
							)}
							<table
								className={
									drrmLanguage.language === "np"
										? _cs(styles.reportTable, styles.nep)
										: styles.reportTable
								}
								id="table-to-xls">
								<tbody>
									<tr>
										<th>
											<Gt section={Translations.dashboardTblHeaderSN} />
										</th>
										<th>
											<Gt section={Translations.Name} />
										</th>
										<th>
											<Gt section={Translations.Email} />
										</th>
										<th>
											<Gt section={Translations.PhoneNumber} />
										</th>
										{!props.annex && (
											<th>
												<Gt section={Translations.AddEdit} />
											</th>
										)}
									</tr>

									{fetchedData &&
									fetchedData.filter((member) => member.committee === "LDMC").length > 0 ? (
										fetchedData
											.filter((availableMembers) => availableMembers.committee === "LDMC")
											.map((mem, i) => (
												<tr key={mem.id}>
													<td>{i + 1}</td>
													<td>{mem.name || "-"}</td>
													<td>{mem.email || "-"}</td>
													<td>{mem.mobileNumber || "-"}</td>
													{!props.annex && (
														<td>
															<button
																type="button"
																onClick={() => handleEditContacts(mem)}
																className={styles.addEditBtn}>
																<Icon name="edit" className={styles.addEditIcon} />
															</button>
														</td>
													)}
												</tr>
											))
									) : (
										<tr>
											<td>{"-"}</td>
											<td>{"-"}</td>
											<td>{"-"}</td>
											<td>{"-"}</td>
											{!props.annex && (
												<td>
													<button
														type="button"
														className={styles.addEditBtn}
														onClick={handleAddContact}>
														<Icon name="plus" className={styles.addEditIcon} />
													</button>
												</td>
											)}
										</tr>
									)}
									{!props.annex && (
										<tr>
											<td />
											<td>
												{" "}
												<button
													type="button"
													className={styles.savebtnInfo}
													onClick={handleAddContact}>
													<Icon name="plus" className={styles.plusIcon} />
													<Gt section={Translations.AddMember} />
													{/* Add */}
												</button>
											</td>
											<td />
											<td />
											<td />
										</tr>
									)}
								</tbody>
							</table>
							{!props.annex && (
								<>
									<h5>
										{" "}
										<i>
											<Gt section={Translations.GeneralPleaseClick} />
										</i>
									</h5>
								</>
							)}
						</div>
					</div>

					{!props.annex && (
						<NextPrevBtns
							handlePrevClick={props.handlePrevClick}
							handleNextClick={handleDataSave}
							firstpage
						/>
					)}
				</>
			)}
		</div>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<PropsWithRedux>()(createRequestClient(requests)(General)));
