import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import Loader from "react-loader";
import ADToBS from "#utils/AdBSConverter/AdToBs";
import BSToAD from "#utils/AdBSConverter/BsToAd";
// import { ADToBS, BSToAD } from 'bikram-sambat-js';
import "nepali-datepicker-reactjs/dist/index.css";
import editIcon from "#resources/palikaicons/edit.svg";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import Gt from "#views/PalikaReport/utils";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
} from "#request";
import {
	setGeneralDataAction,
	setBudgetDataAction,
	setBudgetIdAction,
	setDrrmProgressAction,
} from "#actionCreators";
import {
	generalDataSelector,
	budgetDataSelector,
	userSelector,
	budgetIdSelector,
	hazardTypeListSelector,
	drrmRegionSelector,
	drrmProgresSelector,
	palikaLanguageSelector,
} from "#selectors";
import priorityData from "#views/PalikaReport/Constants/PriorityDropdownSelectData";
import Icon from "#rscg/Icon";
import NextPrevBtns from "../../NextPrevBtns";
import Translations from "../../../../Constants/Translations";
import styles from "./styles.module.scss";

interface Props {
	reportTitle: string;
	datefrom: string;
	dateTo: string;
	mayor: string;
	cao: string;
	focalPerson: string;
	formationDate: string;
	memberCount: string;
	setreportTitle: React.ChangeEventHandler<HTMLInputElement>;
	setdatefrom: React.ChangeEventHandler<HTMLInputElement>;
	setdateTo: React.ChangeEventHandler<HTMLInputElement>;
	setmayor: React.ChangeEventHandler<HTMLInputElement>;
	setcao: React.ChangeEventHandler<HTMLInputElement>;
	setfocalPerson: React.ChangeEventHandler<HTMLInputElement>;
	setformationDate: React.ChangeEventHandler<HTMLInputElement>;
	setmemberCount: React.ChangeEventHandler<HTMLInputElement>;
}

interface Location {
	municipalityId: number;
	districtId: number;
	provinceId: number;
}

const mapStateToProps = (state) => ({
	generalData: generalDataSelector(state),
	budgetData: budgetDataSelector(state),
	user: userSelector(state),
	budgetId: budgetIdSelector(state),
	hazardType: hazardTypeListSelector(state),
	drrmRegion: drrmRegionSelector(state),
	drrmProgress: drrmProgresSelector(state),
	drrmLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
	setGeneralDatapp: (params) => dispatch(setGeneralDataAction(params)),
	setBudgetDatapp: (params) => dispatch(setBudgetDataAction(params)),
	setBudgetId: (params) => dispatch(setBudgetIdAction(params)),
	setProgress: (params) => dispatch(setDrrmProgressAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	SimulationGetRequest: {
		url: "/simulation/",
		query: ({ params, props }) => ({
			// eslint-disable-next-line @typescript-eslint/camelcase
			fiscal_year: params.fiscalYear,
			district: params.district,
			municipality: params.municipality,
			province: params.province,
			ordering: params.id,
		}),
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;

			if (params && params.finalsetSimulationData) {
				params.finalsetSimulationData(citizenReportList);
			}
		},
	},
	SimulationPostRequest: {
		url: "/simulation/",
		method: methods.POST,
		body: ({ params }) => params && params.body,
		onSuccess: ({ response, props, params }) => {
			params.submittedData(response);
		},
		onFailure: ({ error, params }) => {
			params.error(error);
		},
	},
	SimulationPutRequest: {
		url: ({ params }) => `/simulation/${params.id}/`,
		method: methods.PUT,
		body: ({ params }) => params && params.body,
		onSuccess: ({ response, props, params }) => {
			params.submittedData(response);
		},
		onFailure: ({ error, params }) => {
			params.error(error);
		},
	},
	PriorityActionGet: {
		url: "/priority-action/",

		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;

			if (params && params.priorityAction) {
				params.priorityAction(citizenReportList);
			}
		},
	},
	PriorityActivityGet: {
		url: "/priority-activity/",

		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;

			if (params && params.priorityActivity) {
				params.priorityActivity(citizenReportList);
			}
		},
	},
	PriorityAreaGet: {
		url: "/priority-area/",
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;

			if (params && params.priorityArea) {
				params.priorityArea(citizenReportList);
			}
		},
	},
};

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map((item) => ({
	value: currentFiscalYear - item,
}));
const PriorityArea = priorityData.Data.filter((data) => data.level === 0);
const PriorityAction = priorityData.Data.filter((data) => data.level === 1);
const PriorityActivity = priorityData.Data.filter((data) => data.level === 2);
let finalArr = [];
let province = 0;
let district = 0;
let municipality = 0;

const Simulation = (props: Props) => {
	const {
		generalData,
		budgetData,
		updateTab,
		setBudgetDatapp,
		user,
		budgetId,
		setBudgetId,
		hazardType,
		drrmRegion,
		setProgress,
		drrmProgress,
		drrmLanguage,
	} = props;

	// setBudgetId({ id: 2 });
	const { municipalBudget: mb, drrFund: df, additionalFund: af } = budgetData;

	const [submittedData, setSubmittedData] = useState();
	const [description, setDescription] = useState("");
	const [simulationName, setSimulationName] = useState("");
	const [organizer, setOrganizer] = useState("");
	const [participants, setParticipants] = useState("");

	// const [province, setProvince] = useState(0);
	// const [district, setDistrict] = useState(0);
	// const [municipality, setMunicipality] = useState(0);
	const [postErrors, setPostErrors] = useState({});
	const [simulationData, setSimulationData] = useState([]);
	const [priorityAction, setPriorityAction] = useState();
	const [priorityActivity, setPriorityActivity] = useState();
	const [priorityArea, setpriorityArea] = useState();
	const [focusHazard, setFocusHazard] = useState(null);
	const [startDate, setStartDate] = useState("");
	const [loader, setLoader] = useState(true);
	const [simulationId, setSimulationId] = useState();
	const [simulationIndex, setSimulationIndex] = useState();
	const [editBtnClicked, setEditBtnClicked] = useState(false);
	const [simulationDateAD, setSimulationDateAD] = useState("");
	const [priorityActionFetched, setPriorityActionFetched] = useState([]);
	const [priorityActivityFetched, setPriorityActivityFetched] = useState([]);
	const [priorityAreaFetched, setpriorityAreaFetched] = useState([]);
	const [filteredpriorityActivityFetched, setFilteredPriorityActivityFetched] = useState();
	const [filteredpriorityActionFetched, setFilteredpriorityActionFetched] = useState();
	const [disablePriorityAction, setDisablePriorityAction] = useState(true);
	const [disablePriorityActivity, setDisablePriorityActivity] = useState(true);

	// const [fiscalYear, setFiscalYear] = useState(2);
	const {
		requests: {
			SimulationPostRequest,
			SimulationGetRequest,
			SimulationPutRequest,

			HazardGetRequest,
			PriorityActionGet,
			PriorityActivityGet,
			PriorityAreaGet,
		},
	} = props;

	if (drrmRegion.municipality) {
		municipality = drrmRegion.municipality;
		district = drrmRegion.district;
		province = drrmRegion.province;
	} else {
		municipality = user.profile.municipality;
		district = user.profile.district;
		province = user.profile.province;
	}
	const handleSubmittedData = (response) => {
		setSubmittedData(response);
		setDescription("");
		setSimulationName("");
		setOrganizer("");
		setParticipants("");
		setPriorityAction("");
		setPriorityActivity("");
		setpriorityArea("");
		setFocusHazard(null);
		setStartDate("");
		setSimulationId(null);
	};
	const handleSavesetSimulationData = (response) => {
		setSimulationData(response);
		setLoader(false);
	};

	SimulationGetRequest.setDefaultParams({
		fiscalYear: generalData.fiscalYear,
		district,
		municipality,
		province,
		finalsetSimulationData: handleSavesetSimulationData,
		id: "-id",
	});

	const handlePriorityActivityFetch = (data) => {
		setPriorityActivityFetched(data);
	};
	const handlePriorityActionFetch = (data) => {
		setPriorityActionFetched(data);
	};
	const handlePriorityAreaFetch = (data) => {
		setpriorityAreaFetched(data);
	};
	PriorityActionGet.setDefaultParams({
		priorityAction: handlePriorityActionFetch,
	});
	PriorityActivityGet.setDefaultParams({
		priorityActivity: handlePriorityActivityFetch,
	});
	PriorityAreaGet.setDefaultParams({
		priorityArea: handlePriorityAreaFetch,
	});
	useEffect(() => {
		if (startDate) {
			const bsToAd = BSToAD(startDate);
			setSimulationDateAD(bsToAd);
		}
	}, [startDate]);
	// HazardGetRequest.setDefaultParams({
	//     hazardData: handleHazardData,
	// });

	// useEffect(() => {
	//     setProvince(profile.province);
	//     setDistrict(profile.district);
	//     setMunicipality(profile.municipality);
	// }, []);

	const handleSimulationName = (e) => {
		setSimulationName(e.target.value);
	};
	const handleOrganizer = (e) => {
		setOrganizer(e.target.value);
	};
	const handleNumberOfParticipants = (e) => {
		setParticipants(e.target.value);
	};
	const handlePriorityArea = (e) => {
		setpriorityArea(Number(e.target.value));
		setDisablePriorityAction(false);
		setDisablePriorityActivity(true);
		setPriorityAction("");
		setPriorityActivity("");
		if (e.target.value === "" || e.target.value === 0) {
			setDisablePriorityAction(true);
			setDisablePriorityActivity(true);
		}
	};

	useEffect(() => {
		if (priorityArea) {
			const filteredData = priorityActionFetched.filter(
				(item) => item.priorityArea === Number(priorityArea)
			);
			setFilteredpriorityActionFetched(filteredData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [priorityArea]);

	useEffect(() => {
		setFilteredPriorityActivityFetched(priorityActivityFetched);
		setFilteredpriorityActionFetched(priorityActionFetched);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handlePriorityAction = (e) => {
		setPriorityAction(Number(e.target.value));
		setDisablePriorityActivity(false);
		setPriorityActivity("");
		if (e.target.value === "") {
			setDisablePriorityActivity(true);
		}
	};
	useEffect(() => {
		if (priorityAction) {
			const filteredData = priorityActivityFetched.filter(
				(item) => item.priorityAction === Number(priorityAction)
			);
			setFilteredPriorityActivityFetched(filteredData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [priorityAction]);

	const handlePriorityActivity = (e) => {
		setPriorityActivity(Number(e.target.value));
	};
	const handleFocusHazard = (e) => {
		setFocusHazard(e.target.value);
	};
	const handleSimulationDescription = (e) => {
		setDescription(e.target.value);
	};

	const handleNextClick = () => {
		props.handleNextClick();
		if (drrmProgress < 9) {
			setProgress(9);
		}
	};

	useEffect(() => {
		if (simulationData) {
			const finalSimulationData = simulationData.map((data) => {
				const FinalHazard = hazardType.find((item) => item.id === data.focusHazard);
				const PriorityAreaName = priorityAreaFetched.find((item) => item.id === data.priorityArea);
				const PriorityActionName = priorityActionFetched.find(
					(item) => item.id === data.priorityAction
				);
				const PriorityActivityName = priorityActivityFetched.find(
					(item) => item.id === data.priorityActivity
				);

				return {
					PriorityActionNameEn: PriorityActionName ? PriorityActionName.title : "-",
					PriorityActionNameNe: PriorityActionName ? PriorityActionName.titleNp : "-",
					PriorityActivityNameEn: PriorityActivityName ? PriorityActivityName.title : "-",
					PriorityActivityNameNe: PriorityActivityName ? PriorityActivityName.titleNp : "-",
					PriorityAreaNameEn: PriorityAreaName ? PriorityAreaName.title : "-",
					PriorityAreaNameNe: PriorityAreaName ? PriorityAreaName.titleNp : "-",
					HazardName: FinalHazard ? FinalHazard.titleEn : "-",
					HazardNameNp: FinalHazard ? FinalHazard.titleNe : "-",
					data,
				};
			});
			finalArr = [...new Set(finalSimulationData)];
		}
	}, [
		simulationData,
		priorityActionFetched,
		priorityAreaFetched,
		priorityActivityFetched,
		hazardType,
	]);

	const handleErrorData = (data) => {
		setLoader(false);
		setPostErrors(data.response);
	};
	const handleDataSubmittedResponse = (response) => {
		setDescription("");
		setSimulationName("");
		setOrganizer("");
		setParticipants(null);
		setPriorityAction("");
		setPriorityActivity("");
		setpriorityArea("");
		setFocusHazard(null);
	};
	const handleAddNew = () => {
		setLoader(true);
		setPostErrors({});
		SimulationPostRequest.do({
			body: {
				title: simulationName,
				description,
				priorityArea,
				priorityAction,
				priorityActivity,
				organizer,
				totalParticipants: participants,
				date: simulationDateAD,
				fiscalYear: generalData.fiscalYear,
				province,
				district,
				municipality,
				focusHazard,
			},
			submittedData: handleSubmittedData,
			error: handleErrorData,
		});
	};
	useEffect(() => {
		SimulationGetRequest.do({
			fiscalYear: generalData.fiscalYear,
			district,
			municipality,
			province,
			id: "-id",
			finalsetSimulationData: handleSavesetSimulationData,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submittedData]);
	// useEffect(() => {
	//     if (annualBudgetData.length > 0) {
	//         setBudgetTitle(annualBudgetData[0].title);
	//         setdrrFund(annualBudgetData[0].disasterBudgetNrs);
	//         setmunicipalBudget(annualBudgetData[0].totalBudgetNrs);
	//         setadditionalFund(annualBudgetData[0].otherBudgetNrs);
	//     }

	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [annualBudgetData]);

	// useEffect(() => {
	//     if (budgetId.id) {
	//         props.handleNextClick();
	//     }
	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [budgetId.id]);
	const handleEditSimulation = (id, index) => {
		setSimulationId(id);
		setSimulationIndex(index);
		setEditBtnClicked(!editBtnClicked);
		setPostErrors({});
		setDisablePriorityAction(false);
		setDisablePriorityActivity(false);
	};
	const handleUpdateSimulation = () => {
		setLoader(true);
		setPostErrors({});
		setDisablePriorityAction(true);
		setDisablePriorityActivity(true);
		SimulationPutRequest.do({
			body: {
				title: simulationName,
				description,
				priorityArea,
				priorityAction,
				priorityActivity,
				organizer,
				totalParticipants: participants,
				date: simulationDateAD,
				fiscalYear: generalData.fiscalYear,
				province,
				district,
				municipality,
				focusHazard,
			},
			submittedData: handleSubmittedData,
			id: simulationId,
			error: handleErrorData,
		});
	};
	useEffect(() => {
		if (simulationData.length > 0) {
			setDescription(finalArr[simulationIndex].data.description);
			setSimulationName(finalArr[simulationIndex].data.title);
			setOrganizer(finalArr[simulationIndex].data.organizer);
			setParticipants(finalArr[simulationIndex].data.totalParticipants);
			setPriorityAction(finalArr[simulationIndex].data.priorityAction);
			setPriorityActivity(finalArr[simulationIndex].data.priorityActivity);
			setpriorityArea(finalArr[simulationIndex].data.priorityArea);
			setFocusHazard(finalArr[simulationIndex].data.focusHazard);
			setStartDate(ADToBS(finalArr[simulationIndex].data.date));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [simulationIndex, editBtnClicked]);

	let tableStyle = {};
	if (props.annex) {
		tableStyle = { tableLayout: "fixed", width: "100%" };
	} else {
		tableStyle = { tableLayout: "initial" };
	}

	return (
		<div className={drrmLanguage.language === "np" && styles.nep}>
			{!props.previewDetails && (
				<div className={styles.mainDiv}>
					<h2>
						<Gt section={Translations.SimulationHeading} />
					</h2>
					<div className={styles.palikaTable}>
						<table style={tableStyle} id="table-to-xls">
							<tbody>
								<>
									<tr>
										<th>
											<Gt section={Translations.SimulationSerialNumber} />
										</th>
										<th>
											<Gt section={Translations.SimulationExercise} />
										</th>
										<th>
											<Gt section={Translations.SimulationDate} />
										</th>
										<th>
											<Gt section={Translations.SimulationDescription} />
										</th>
										<th>
											<Gt section={Translations.SimulationPriorityArea} />
										</th>
										<th>
											<Gt section={Translations.SimulationPriorityAction} />
										</th>
										<th>
											<Gt section={Translations.SimulationPriorityActivity} />
										</th>
										<th>
											<Gt section={Translations.SimulationOrganizer} />
										</th>
										<th>
											<Gt section={Translations.SimulationParticipants} />
										</th>
										<th>
											<Gt section={Translations.SimulationHazards} />
										</th>
										{!props.annex && finalArr.length ? (
											<th>
												<Gt section={Translations.SimulationAction} />
											</th>
										) : null}
									</tr>
									{loader ? (
										<>
											{" "}
											<Loader top="50%" left="60%" />
											<p className={styles.loaderInfo}>Loading...Please Wait</p>
										</>
									) : (
										<>
											{finalArr &&
												finalArr.map((item, i) =>
													simulationId === item.data.id ? (
														<tr>
															<td>{simulationIndex + 1}</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	value={simulationName}
																	placeholder={
																		drrmLanguage.language === "np"
																			? "अनुकरणको नाम"
																			: "Simulation Name"
																	}
																	onChange={handleSimulationName}
																/>{" "}
															</td>
															<td>
																<NepaliDatePicker
																	inputClassName="form-control"
																	className={styles.datepicker}
																	value={startDate}
																	onChange={(date) => setStartDate(date)}
																	options={{
																		calenderLocale: drrmLanguage.language === "np" ? "ne" : "en",
																		valueLocale: "en",
																	}}
																/>
															</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	value={description}
																	placeholder={
																		drrmLanguage.language === "np"
																			? "अनुकरणको वर्णन"
																			: "Simulation Description"
																	}
																	onChange={handleSimulationDescription}
																/>{" "}
															</td>
															<td>
																<select
																	value={priorityArea}
																	onChange={handlePriorityArea}
																	className={styles.inputElement}>
																	<option value="">
																		{drrmLanguage.language === "np"
																			? "प्राथमिकता क्षेत्र चयन गर्नुहोस्"
																			: "Select Priority Area"}
																	</option>
																	{priorityAreaFetched.map((data) => (
																		<option value={data.id}>
																			{drrmLanguage.language === "np" ? data.titleNp : data.title}
																		</option>
																	))}
																</select>
															</td>
															<td>
																<select
																	value={priorityAction}
																	onChange={handlePriorityAction}
																	className={styles.inputElement}
																	disabled={disablePriorityAction}>
																	<option value="">
																		{drrmLanguage.language === "np"
																			? "प्राथमिकता कार्य चयन गर्नुहोस्"
																			: "Select Priority Action"}
																	</option>
																	{filteredpriorityActionFetched.map((data) => (
																		<option value={data.id}>
																			{drrmLanguage.language === "np" ? data.titleNp : data.title}
																		</option>
																	))}
																</select>
															</td>
															<td>
																<select
																	value={priorityActivity}
																	onChange={handlePriorityActivity}
																	className={styles.inputElement}
																	disabled={disablePriorityActivity}>
																	<option value="">
																		{drrmLanguage.language === "np"
																			? "प्राथमिकता गतिविधि चयन गर्नुहोस्"
																			: "Select Priority Activity"}
																	</option>
																	{filteredpriorityActivityFetched.map((data) => (
																		<option value={data.id}>
																			{drrmLanguage.language === "np" ? data.titleNp : data.title}
																		</option>
																	))}
																</select>
															</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	value={organizer}
																	placeholder={
																		drrmLanguage.language === "np" ? "आयोजक" : "Organizer"
																	}
																	onChange={handleOrganizer}
																/>{" "}
															</td>
															<td>
																<input
																	type="number"
																	className={styles.inputElement}
																	value={participants}
																	placeholder={
																		drrmLanguage.language === "np"
																			? "सहभागीहरूको संख्या"
																			: "Number of Participants"
																	}
																	onChange={handleNumberOfParticipants}
																/>{" "}
															</td>
															<td>
																<select
																	value={focusHazard}
																	onChange={handleFocusHazard}
																	className={styles.inputElement}>
																	<option value="">
																		{drrmLanguage.language === "np"
																			? "केन्द्रित प्रकोप चयन गर्नुहोस्"
																			: "Select Focused Hazard"}
																	</option>

																	{hazardType &&
																		hazardType.map((data) => (
																			<option value={data.id}>{data.titleEn}</option>
																		))}
																</select>
															</td>
															<td>
																<button
																	className={styles.updateButtn}
																	type="button"
																	onClick={handleUpdateSimulation}
																	title={
																		drrmLanguage.language === "np"
																			? Translations.SimulationUpdateButtonTooltip.np
																			: Translations.SimulationUpdateButtonTooltip.en
																	}>
																	<Gt section={Translations.SimulationUpdateButton} />
																</button>
															</td>
														</tr>
													) : (
														<tr key={item.data.id}>
															<td>{i + 1}</td>
															<td>{item.data.title}</td>
															<td>{ADToBS(item.data.date)}</td>
															<td>{item.data.description}</td>
															<td>
																{drrmLanguage.language === "np"
																	? item.PriorityAreaNameNe
																	: item.PriorityAreaNameEn}
															</td>
															<td>
																{drrmLanguage.language === "np"
																	? item.PriorityActionNameNe
																	: item.PriorityActionNameEn}
															</td>
															<td>
																{drrmLanguage.language === "np"
																	? item.PriorityActivityNameNe
																	: item.PriorityActivityNameEn}
															</td>
															<td>{item.data.organizer}</td>
															<td>{item.data.totalParticipants}</td>
															<td>
																{drrmLanguage.language === "np"
																	? item.HazardNameNp
																	: item.HazardName}
															</td>
															{!props.annex && (
																<td>
																	{" "}
																	<button
																		className={styles.editButtn}
																		type="button"
																		onClick={() => handleEditSimulation(item.data.id, i)}
																		title={
																			drrmLanguage.language === "np"
																				? Translations.SimulationEditTooltip.np
																				: Translations.SimulationEditTooltip.en
																		}>
																		<ScalableVectorGraphics
																			className={styles.bulletPoint}
																			src={editIcon}
																			alt="editPoint"
																		/>
																	</button>
																</td>
															)}
														</tr>
													)
												)}
											{!simulationId && (
												<>
													{!props.annex && (
														<tr>
															<td>{simulationData.length + 1}</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	value={simulationName}
																	placeholder={
																		drrmLanguage.language === "np"
																			? "अनुकरणको नाम"
																			: "Simulation Name"
																	}
																	onChange={handleSimulationName}
																/>{" "}
															</td>
															<td>
																<NepaliDatePicker
																	inputClassName="form-control"
																	className={styles.datepicker}
																	value={startDate}
																	onChange={(date) => setStartDate(date)}
																	options={{
																		calenderLocale: drrmLanguage.language === "np" ? "ne" : "en",
																		valueLocale: "en",
																	}}
																/>
															</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	value={description}
																	placeholder={
																		drrmLanguage.language === "np"
																			? "अनुकरणको वर्णन"
																			: "Simulation Description"
																	}
																	onChange={handleSimulationDescription}
																/>{" "}
															</td>
															<td>
																<select
																	value={priorityArea}
																	onChange={handlePriorityArea}
																	className={styles.inputElement}>
																	<option value={""}>
																		{drrmLanguage.language === "np"
																			? "प्राथमिकता क्षेत्र चयन गर्नुहोस्"
																			: "Select Priority Area"}
																	</option>
																	{priorityAreaFetched.map((data) => (
																		<option value={data.id}>
																			{drrmLanguage.language === "np" ? data.titleNp : data.title}
																		</option>
																	))}
																</select>
															</td>
															<td>
																<select
																	value={priorityAction}
																	onChange={handlePriorityAction}
																	className={styles.inputElement}
																	disabled={disablePriorityAction}>
																	<option value={""}>
																		{drrmLanguage.language === "np"
																			? "प्राथमिकता कार्य चयन गर्नुहोस्"
																			: "Select Priority Action"}
																	</option>
																	{filteredpriorityActionFetched.map((data) => (
																		<option value={data.id}>
																			{drrmLanguage.language === "np" ? data.titleNp : data.title}
																		</option>
																	))}
																</select>
															</td>
															<td>
																<select
																	value={priorityActivity}
																	onChange={handlePriorityActivity}
																	className={styles.inputElement}
																	disabled={disablePriorityActivity}>
																	<option value={""}>
																		{drrmLanguage.language === "np"
																			? "प्राथमिकता गतिविधि चयन गर्नुहोस्"
																			: "Select Priority Activity"}
																	</option>
																	{filteredpriorityActivityFetched.map((data) => (
																		<option value={data.id}>
																			{drrmLanguage.language === "np" ? data.titleNp : data.title}
																		</option>
																	))}
																</select>
															</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	value={organizer}
																	placeholder={
																		drrmLanguage.language === "np" ? "आयोजक" : "Organizer"
																	}
																	onChange={handleOrganizer}
																/>{" "}
															</td>
															<td>
																<input
																	type="number"
																	className={styles.inputElement}
																	value={participants}
																	placeholder={
																		drrmLanguage.language === "np"
																			? "सहभागीहरूको संख्या"
																			: "Number of Participants"
																	}
																	onChange={handleNumberOfParticipants}
																/>{" "}
															</td>
															<td>
																<select
																	value={focusHazard}
																	onChange={handleFocusHazard}
																	className={styles.inputElement}>
																	<option value="">
																		{drrmLanguage.language === "np"
																			? "केन्द्रित प्रकोप चयन गर्नुहोस्"
																			: "Select Focused Hazard"}
																	</option>
																	{hazardType &&
																		hazardType.map((data) => (
																			<option value={data.id}>
																				{drrmLanguage.language === "np"
																					? data.titleNe
																					: data.titleEn}
																			</option>
																		))}
																</select>
															</td>
															{!props.annex && simulationData.length ? <td /> : null}
														</tr>
													)}
												</>
											)}
										</>
									)}
								</>
								{!props.annex && !loader && (
									<tr>
										<td />
										<td>
											<button type="button" onClick={handleAddNew} className={styles.savebtn}>
												<Icon name="plus" className={styles.plusIcon} />
												<Gt section={Translations.SimulationAddButton} />
											</button>
										</td>
										<td />
										<td />
										<td />
										<td />
										<td />
										<td />
										<td />
										<td />
										{!props.annex && simulationData.length ? <td /> : null}
									</tr>
								)}
							</tbody>
						</table>
						{Object.keys(postErrors).length > 0 && (
							<ul>
								<li>
									<span className={styles.errorHeading}>Please fix the following errors:</span>
								</li>
								{Object.keys(postErrors).map(
									(errorItem) => (
										<li>{`${errorItem}: ${postErrors[errorItem]}`}</li>
									) // return <li>Please enter valid info in all fields</li>;
								)}
							</ul>
						)}
						{!simulationId && (
							<>
								{!loader && (
									<>
										{!props.annex && (
											<>
												<div className={styles.btns}>
													<NextPrevBtns
														handlePrevClick={props.handlePrevClick}
														handleNextClick={handleNextClick}
													/>
												</div>
											</>
										)}
									</>
								)}
							</>
						)}
					</div>
				</div>
			)}

			{props.previewDetails && (
				<div className={styles.budgetPreviewContainer}>
					<h2>
						<Gt section={Translations.SimulationHeading} />
					</h2>
					<div className={styles.simElementsContainer}>
						<div className={styles.simElements}>
							<div className={styles.circlePatch}>
								{finalArr.length > 0 ? finalArr.length : "0"}
							</div>
							<p className={styles.simDesc}>
								<Gt section={Translations.NumberOfSimulationConducted} />
							</p>
						</div>
						<div className={styles.simElements}>
							<div className={styles.circlePatch}>
								{finalArr.length > 0
									? finalArr
											.map((item) => item.data)
											.reduce((a, b) => ({
												totalParticipants: a.totalParticipants + b.totalParticipants,
											})).totalParticipants
									: 0}
							</div>
							<p className={styles.simDesc}>
								<Gt section={Translations.NumberOfPeopleTrained} />
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<PropsWithRedux>()(createRequestClient(requests)(Simulation)));
