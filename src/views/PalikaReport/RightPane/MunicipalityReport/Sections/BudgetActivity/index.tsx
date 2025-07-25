import React, { useState, useEffect } from "react";
import { _cs } from "@togglecorp/fujs";
import { connect } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { PieChart, Pie, Cell } from "recharts";
import Loader from "react-loader";
import ADToBS from "#utils/AdBSConverter/AdToBs";
import BSToAD from "#utils/AdBSConverter/BsToAd";
// import { ADToBS, BSToAD } from 'bikram-sambat-js';
import Gt from "#views/PalikaReport/utils";
import Translations from "#views/PalikaReport/Constants/Translations";
import priorityData from "#views/PalikaReport/Constants/PriorityDropdownSelectData";
import editIcon from "#resources/palikaicons/edit.svg";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
} from "#request";
import "react-datepicker/dist/react-datepicker.css";

import { setBudgetActivityDataAction, setDrrmProgressAction } from "#actionCreators";
import {
	budgetActivityDataSelector,
	generalDataSelector,
	budgetDataSelector,
	budgetIdSelector,
	userSelector,
	drrmRegionSelector,
	drrmProgresSelector,
	palikaLanguageSelector,
} from "#selectors";

import Icon from "#rscg/Icon";
import NextPrevBtns from "../../NextPrevBtns";
import styles from "./styles.module.scss";

const mapStateToProps = (state) => ({
	budgetActivityData: budgetActivityDataSelector(state),
	generalData: generalDataSelector(state),
	budgetData: budgetDataSelector(state),
	budgetId: budgetIdSelector(state),
	user: userSelector(state),
	drrmRegion: drrmRegionSelector(state),
	drrmProgress: drrmProgresSelector(state),
	drrmLanguage: palikaLanguageSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
	setBudgetActivityDatapp: (params) => dispatch(setBudgetActivityDataAction(params)),
	setProgress: (params) => dispatch(setDrrmProgressAction(params)),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	BudgetActivityGetRequest: {
		url: "/annual-budget-activity/",
		query: ({ params, props }) => ({
			// eslint-disable-next-line @typescript-eslint/camelcase
			annual_budget: params.annualBudget,
			district: params.district,
			municipality: params.municipality,
			province: params.province,
			// limit: params.page,
			ordering: params.id,
			// offset: params.offset,
		}),
		method: methods.GET,
		onMount: false,
		onSuccess: ({ response, params }) => {
			let citizenReportList: CitizenReport[] = [];
			const citizenReportsResponse = response as MultiResponse<CitizenReport>;
			citizenReportList = citizenReportsResponse.results;
			params.handlePendingState(false);
			if (params && params.budgetActivities) {
				params.budgetActivities(citizenReportList);
			}
			if (params && params.paginationParameters) {
				params.paginationParameters(response);
			}
		},
	},
	BudgetActivityPostRequest: {
		url: "/annual-budget-activity/",

		method: methods.POST,
		body: ({ params }) => params && params.body,
		onSuccess: ({ response, props, params }) => {
			params.dataSubmitted(response);
			params.handlePendingState(false);
		},
		onFailure: ({ error, params }) => {
			params.body.handlePendingState(false);
			params.body.setErrors(error);
		},
	},
	BudgetActivityPutRequest: {
		url: ({ params }) => `/annual-budget-activity/${params.id}/`,
		method: methods.PUT,
		body: ({ params }) => params && params.body,
		onSuccess: ({ response, props, params }) => {
			params.budgetActivities(response);
		},
		onFailure: ({ error, params }) => {
			params.body.setErrors(error);
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

interface BudgetActivityData {
	name: string;
	fundSource: string;
	additionalDrrBudget: string;
	budgetCode: string;
	drrmCycle: string;
	projStatus: string;
	projCompletionDate: string;
	allocatedBudget: string;
	actualExp: string;
	remarks: string;
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

const currentFiscalYear = new Date().getFullYear() + 56;

const options = Array.from(Array(10).keys()).map((item) => ({
	value: currentFiscalYear - item,
}));
const subpriority = [];

let province = 0;
let district = 0;
let municipality = 0;

const COLORS = ["rgb(0,117,117)", "rgb(198,233,232)"];
let finalArr = [];
const BudgetActivity = (props: Props) => {
	const {
		updateTab,
		budgetData,
		setBudgetActivityDatapp,
		budgetActivityData,
		generalData,
		budgetId,
		requests: {
			BudgetActivityGetRequest,
			BudgetActivityPostRequest,
			BudgetActivityPutRequest,
			PriorityActionGet,
			PriorityAreaGet,
			PriorityActivityGet,
		},
		user,
		drrmRegion,
		setProgress,
		drrmProgress,
		drrmLanguage,
	} = props;

	const { additionalDrrBudget, totDrrBudget, totMunBudget } = budgetData;

	const TableNameTitle = {
		name: "Name of Activity",
		fundSource: "Source of Fund",
		budgetCode: "Budget Code",
		projStatus: "Project Status",
		allocatedBudget: "Allocated Budget",
		actualExp: "Actual Expenses",
		remarks: "Remarks",
		priorityArea: "Priority Area",
		action: "Priority Action",
		activity: "Priority Activity",
		areaofImplementation: "Area of Implementation",
		fundingType: "Funding Type",
		organisationName: "Name of Organisation",
		projcompletionDate: "Project Completion Date",
		projstartDate: "Project Start Date",
	};

	const {
		name: namefromprops,
		fundSource: fundSourcefromprops,
		budgetCode: budgetCodefromprops,
		projStatus: projStatusfromprops,
		projCompletionDate: projCompletionDatefromprops,
		allocatedBudget: allocatedBudgetfromprops,
		actualExp: actualExpfromprops,
		remarks: remarksfromprops,
		priorityArea: priorityAreafromprops,
		action: actionfromprops,
		activity: activityfromprops,
		areaofImplementation: areaofImplementationfromprops,
		fundingType: fundingTypefromprops,
		organisationName: organisationNamefromprops,
		projstartDate: projstartDatefromprops,
	} = budgetActivityData;

	if (drrmRegion.municipality) {
		municipality = drrmRegion.municipality;
		district = drrmRegion.district;
		province = drrmRegion.province;
	} else {
		municipality = user.profile.municipality;
		district = user.profile.district;
		province = user.profile.province;
	}

	const [pending, setPending] = useState(false);
	const [postErrors, setPostErrors] = useState({});
	const [parent, setParent] = useState(1);
	const [otherSubtype, setSubtype] = useState("");
	const [showInfo, setShowInfo] = useState(false);

	const [dataSubmittedResponse, setDataSubmittedResponse] = useState(false);
	const [projstartDate, setStartDate] = useState("");
	const [projcompletionDate, setprojCompletionDate] = useState("");
	const [activityName, setactivityName] = useState("");
	const [fundSource, setfundSource] = useState("");
	const [fundingType, setfundingType] = useState("Municipal Government");
	const [otherFund, setotherFund] = useState("");
	const [budgetCode, setbudgetCode] = useState("");
	const [projStatus, setprojStatus] = useState("");
	const [allocatedBudget, setallocatedBudget] = useState();
	const [actualExp, setactualExp] = useState();
	const [remarks, setremarks] = useState("");
	const [paginationQueryLimit, setPaginationQueryLimit] = useState(6);
	const [offset, setOffset] = useState(0);
	const [paginationParameters, setPaginationParameters] = useState();
	const [action, setAction] = useState(actionfromprops);
	const [activity, setActivity] = useState(activityfromprops);
	const [areaofImplementation, setareaofImplementation] = useState(areaofImplementationfromprops);
	const [organisationName, setorganisationName] = useState("");
	const [priorityArea, setpriorityArea] = useState("");
	const [priorityAction, setPriorityAction] = useState("");
	const [priorityActivity, setPriorityActivity] = useState("");
	const [currentPageNumber, setCurrentPageNumber] = useState(1);
	const [tableData, setTableData] = useState([]);
	const [showtable, setShowTable] = useState(false);
	const [showSourceType, setSourceType] = useState(false);
	const [showSourceTypeOther, setSourceTypeOther] = useState(false);
	const [showmunGovernment, setshowmunGovernment] = useState(false);
	const [selectedOption, setSelectedOption] = useState({});
	const [budgetActivities, setBudgetActivities] = useState([]);
	const [priorityActionData, setPData] = useState([]);
	const [priorityActivityData, setAData] = useState([]);
	const [budgetActivityId, setBudgetActivityId] = useState();
	const [editBudgetActivity, setEditBudgetActivity] = useState(false);
	const [selectedBudgetActivityIndex, setSelectedBudgetActivityIndex] = useState();
	const [loader, setLoader] = useState(true);
	const [editBtnClicked, setEditBtnClicked] = useState(false);

	const [projectStartDateAD, setProjectStartDate] = useState("");
	const [projectEndDateAD, setProjectEndDate] = useState("");
	const [priorityActionFetched, setPriorityActionFetched] = useState([]);
	const [priorityActivityFetched, setPriorityActivityFetched] = useState([]);
	const [priorityAreaFetched, setpriorityAreaFetched] = useState([]);
	const [filteredpriorityActivityFetched, setFilteredPriorityActivityFetched] = useState();
	const [filteredpriorityActionFetched, setFilteredpriorityActionFetched] = useState();
	const [disablePriorityAction, setDisablePriorityAction] = useState(true);
	const [disablePriorityActivity, setDisablePriorityActivity] = useState(true);
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		if (budgetData.totDrrBudget) {
			setChartData([
				{ name: "DRR funding of municipality", value: budgetData.totDrrBudget },
				{ name: "Other DRR related funding", value: budgetData.additionalDrrBudget },
			]);
		}
	}, [additionalDrrBudget, budgetData, budgetData.totDrrBudget, totDrrBudget]);
	const handleInfoBtn = () => {
		setShowInfo(!showInfo);
	};
	const handlePending = (data: boolean) => {
		setPending(data);
		setLoader(data);
	};
	const handleErrors = (errors) => {
		setLoader(false);
		setPostErrors(errors);
	};

	const handleDataSubmittedResponse = (response) => {
		setDataSubmittedResponse(!dataSubmittedResponse);
		setStartDate("");
		setprojCompletionDate("");
		setactivityName("");
		setfundSource("");
		setfundingType("");
		setbudgetCode("");
		setprojStatus("");
		setallocatedBudget(null);
		setactualExp(null);
		setremarks("");
		setpriorityArea("");
		setorganisationName("");
		setPriorityAction("");
		setPriorityActivity("");
	};
	const handleBudgetActivities = (response) => {
		setBudgetActivities(response);
		setLoader(false);
	};
	const handlePaginationParameters = (response) => {
		setPaginationParameters(response);
	};
	const handleBudgetActivitiesUpdated = (response) => {
		setDataSubmittedResponse(!dataSubmittedResponse);
		setStartDate("");
		setprojCompletionDate("");
		setactivityName("");
		setfundSource("");
		setfundingType("");
		setbudgetCode("");
		setprojStatus("");
		setallocatedBudget(null);
		setactualExp(null);
		setremarks("");
		setpriorityArea("");
		setorganisationName("");
		setPriorityAction("");
		setPriorityActivity("");
		setBudgetActivityId(null);
		if (budgetId.id) {
			BudgetActivityGetRequest.do({
				province,
				district,
				municipality,
				annualBudget: budgetId.id,
				budgetActivities: handleBudgetActivities,
				paginationParameters: handlePaginationParameters,
				id: "-id",
				page: paginationQueryLimit,
				handlePendingState: handlePending,
				setErrors: handleErrors,
			});
		}
		setEditBudgetActivity(false);
	};

	const handleOrganisationName = (org: string) => {
		setorganisationName(org.target.value);
	};
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
		if (projstartDate) {
			const bsToAd = BSToAD(projstartDate);

			setProjectStartDate(bsToAd);
		}
	}, [projstartDate]);
	useEffect(() => {
		if (projcompletionDate) {
			const bsToAd = BSToAD(projcompletionDate);

			setProjectEndDate(bsToAd);
		}
	}, [projcompletionDate]);

	BudgetActivityGetRequest.setDefaultParams({
		province,
		district,
		municipality,
		annualBudget: budgetId.id,
		budgetActivities: handleBudgetActivities,
		paginationParameters: handlePaginationParameters,
		id: "-id",
		page: paginationQueryLimit,
		handlePendingState: handlePending,
		setErrors: handleErrors,
	});
	const handlePageClick = (e) => {
		const selectedPage = e.selected + 1;
		setOffset((selectedPage - 1) * paginationQueryLimit);
		setCurrentPageNumber(selectedPage);
	};

	useEffect(() => {
		if (budgetId.id) {
			BudgetActivityGetRequest.do({
				province,
				district,
				municipality,
				annualBudget: budgetId.id,
				budgetActivities: handleBudgetActivities,
				paginationParameters: handlePaginationParameters,
				id: "-id",
				handlePendingState: handlePending,
				setErrors: handleErrors,
			});
		} else {
			handlePending(false);
			handleBudgetActivities([]);
		}
	}, []);

	// useEffect(() => {
	//     BudgetActivityGetRequest.do({
	//         offset,
	//         page: paginationQueryLimit,
	//         fiscalYear: generalData.fiscalYear,
	//         district,
	//         municipality,
	//         province,
	//         id: '-id',
	//         handlePendingState: handlePending,
	//         setErrors: handleErrors,

	//     });
	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [offset]);
	useEffect(() => {
		if (budgetData.additionalFund && parseInt(budgetData.additionalFund, 10) > 0) {
			setSourceType(true);
		}
	}, [budgetData]);
	const handleOtherSubType = (data) => {
		setSubtype(data.target.value);
	};

	const handleAddNew = () => {
		setPending(true);
		setLoader(true);
		setPostErrors({});

		BudgetActivityPostRequest.do({
			body: {
				activityName,
				priorityArea,
				priorityAction,
				priorityActivity,
				fundType: fundSource,
				otherFundType: fundingType,
				budgetCode,
				donerOrganization: organisationName,
				projectStartDate: projectStartDateAD,
				projectEndDate: projectEndDateAD,
				amount: allocatedBudget,
				expenditure: actualExp,
				status: projStatus,
				remarks,
				annualBudget: budgetId.id,
				handlePendingState: handlePending,
				setErrors: handleErrors,
			},
			budgetActivities: handleBudgetActivities,
			dataSubmitted: handleDataSubmittedResponse,
			id: budgetActivityId,
		});
	};
	const handleActivityName = (data) => {
		setactivityName(data.target.value);
	};
	const handlefundSource = (data) => {
		setfundSource(data.target.value);

		if (data.target.value === "DRR Fund of Muicipality") {
			setshowmunGovernment(true);
			setSourceType(false);
			setSourceTypeOther(false);
			setfundingType("Municipal Government");
		}
		if (data.target.value === "select") {
			setfundSource("");
			setfundingType("");
			setSourceType(true);
			setshowmunGovernment(false);
		}
		if (data.target.value === "Other DRR related funding") {
			setfundingType("");
			setSourceType(true);
			setshowmunGovernment(false);
		}
	};

	useEffect(() => {
		if (dataSubmittedResponse && budgetId.id) {
			BudgetActivityGetRequest.do({
				province,
				district,
				municipality,
				annualBudget: budgetId.id,
				budgetActivities: handleBudgetActivities,
				page: paginationQueryLimit,
				id: "-id",
				handlePendingState: handlePending,
				setErrors: handleErrors,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataSubmittedResponse]);

	const PriorityArea = priorityData.Data.filter((data) => data.level === 0);
	const PriorityAction = priorityData.Data.filter((data) => data.parent === parent);
	const PriorityActivity = priorityData.Data.filter((data) => data.level === 2);

	// const handlePriorityArea = (e) => {
	//     setpriorityArea(e.target.value);
	//     const obj = priorityData.Data.filter(item => item.title === e.target.value);
	//     setParent(obj.sn);

	//     setPData(priorityData.Data.filter(item => item.parent === Number(obj[0].ndrrsapid)));
	// };

	// const handlePriorityAction = (e) => {
	//     setPriorityAction(e.target.value);
	//     const obj = priorityData.Data.filter(item => item.title === e.target.value);

	//     setAData(priorityData.Data.filter(item => item.parent === Number(obj[0].ndrrsapid)));
	// };
	// const handlePriorityActivity = (e) => {
	//     setPriorityActivity(e.target.value);
	// };
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
	const handlefundingType = (data) => {
		if (data.target.value === "Others") {
			setSourceTypeOther(true);
			setfundingType("Others");
		} else {
			setSourceTypeOther(false);
			setfundingType(data.target.value);
		}
	};
	const handleOtherFund = (data) => {
		setfundingType(data.target.value);
	};
	const handleBudgetCode = (data) => {
		setbudgetCode(data.target.value);
	};

	const handleprojStatus = (data) => {
		setprojStatus(data.target.value);
	};
	const handleAlocBudget = (data) => {
		setallocatedBudget(data.target.value);
	};
	const handleActualExp = (data) => {
		setactualExp(data.target.value);
	};
	const handleRemarks = (data) => {
		setremarks(data.target.value);
	};
	const getSelectedOption = (data) => {
		setSelectedOption(data);
	};
	const getSubPriorityAction = (data) => {
		if (data.length > 0 && action.length === 0) {
			setPriorityAction(data);
		}
	};

	const handleEditActivity = (id, index) => {
		setBudgetActivityId(id);
		setEditBudgetActivity(true);
		setSelectedBudgetActivityIndex(index);
		setEditBtnClicked(!editBtnClicked);
		setPostErrors({});
		setDisablePriorityAction(false);
		setDisablePriorityActivity(false);
	};
	const handleUpdateActivity = () => {
		setLoader(true);
		setPostErrors({});
		setDisablePriorityAction(true);
		setDisablePriorityActivity(true);
		BudgetActivityPutRequest.do({
			body: {
				activityName,
				priorityArea,
				priorityAction,
				priorityActivity,
				fundType: fundSource,
				otherFundType: fundingType,
				budgetCode,
				donerOrganization: organisationName,
				projectStartDate: projectStartDateAD,
				projectEndDate: projectEndDateAD,
				amount: allocatedBudget,
				expenditure: actualExp,
				status: projStatus,
				remarks,
				annualBudget: budgetId.id,
				handlePendingState: handlePending,
				setErrors: handleErrors,
			},
			budgetActivities: handleBudgetActivitiesUpdated,
			dataSubmitted: handleDataSubmittedResponse,
			id: budgetActivityId,
		});
	};

	useEffect(() => {
		if (budgetActivities.length > 0) {
			setactivityName(budgetActivities[selectedBudgetActivityIndex].activityName);
			setpriorityArea(budgetActivities[selectedBudgetActivityIndex].priorityArea);
			setPriorityAction(budgetActivities[selectedBudgetActivityIndex].priorityAction);
			setPriorityActivity(budgetActivities[selectedBudgetActivityIndex].priorityActivity);
			setfundSource(budgetActivities[selectedBudgetActivityIndex].fundType);
			setfundingType(budgetActivities[selectedBudgetActivityIndex].otherFundType);
			setbudgetCode(budgetActivities[selectedBudgetActivityIndex].budgetCode);
			setorganisationName(budgetActivities[selectedBudgetActivityIndex].donerOrganization);
			setStartDate(ADToBS(budgetActivities[selectedBudgetActivityIndex].projectStartDate));
			setprojCompletionDate(ADToBS(budgetActivities[selectedBudgetActivityIndex].projectEndDate));
			setprojStatus(budgetActivities[selectedBudgetActivityIndex].status);
			setallocatedBudget(budgetActivities[selectedBudgetActivityIndex].amount);
			setactualExp(budgetActivities[selectedBudgetActivityIndex].expenditure);
			setremarks(budgetActivities[selectedBudgetActivityIndex].remarks);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBudgetActivityIndex, editBtnClicked]);

	const handleNext = () => {
		if (drrmProgress < 2) {
			setProgress(2);
		}
		props.handleNextClick();
	};

	useEffect(() => {
		if (budgetActivities.length) {
			const finalArrayData = budgetActivities.map((data) => {
				const PriorityAreaName = priorityAreaFetched.find((item) => item.id === data.priorityArea);
				const PriorityActionName = priorityActionFetched.find(
					(item) => item.id === data.priorityAction
				);
				const PriorityActivityName = priorityActivityFetched.find(
					(item) => item.id === data.priorityActivity
				);

				return {
					PriorityActionNameEn: (PriorityActionName && PriorityActionName.title) || "-",
					PriorityActionNameNe: (PriorityActionName && PriorityActionName.titleNp) || "-",
					PriorityActivityNameEn: (PriorityActivityName && PriorityActivityName.title) || "-",
					PriorityActivityNameNe: (PriorityActivityName && PriorityActivityName.titleNp) || "-",
					PriorityAreaNameEn: (PriorityAreaName && PriorityAreaName.title) || "-",
					PriorityAreaNameNe: (PriorityAreaName && PriorityAreaName.titleNp) || "-",
					data,
				};
			});
			finalArr = [...new Set(finalArrayData)];
		}
	}, [budgetActivities, priorityActionFetched, priorityAreaFetched, priorityActivityFetched]);

	return (
		<>
			<div className={drrmLanguage.language === "np" && styles.nep}>
				{!props.previewDetails && !props.monitoringDetails && (
					<div className={styles.mainPageDetailsContainer}>
						<h2>
							<Gt section={Translations.BaTitlePart1} />
							{`
                        ${generalData.fiscalYearTitle}`}
							<Gt section={Translations.BaTitlePart2} />
						</h2>
						<table id="table-to-xls">
							<tbody>
								<>
									<tr>
										<th>
											<Gt section={Translations.dashboardTblHeaderSN} />
										</th>

										<th>
											<Gt section={Translations.NameofActivity} />
										</th>
										<th>
											<Gt section={Translations.PriorityArea} />

											<Icon
												name="info"
												className={styles.infoIcon}
												title={
													drrmLanguage.language === "en"
														? "The Disaster Risk Reduction National Strategic Plan of Action 2018 – 2030 adopting the Sendai Framework for Disaster Risk Reduction as a main guidance, has identified 4 priority areas and 18 priority actions. The activities will be monitored based on the these priorities set. Get the action plan here: "
														: "विपद् जोखिम न्यूनीकरण राष्ट्रिय रणनीतिक कार्ययोजना २०१८ – २०३०मा विपद् जोखिम न्यूनीकरणका लागि सेन्डाइ कार्य ढाँचालाई मूल मार्गदर्शनको रुपमा लिई चार प्राथमिकता प्राप्त क्षेत्रहरू र अठार प्राथमिकता प्राप्त कार्यहरू निर्धारण गरेको छ । यी प्राथमिकताहरूको आधारमा क्रियाकलापहरुको अनुगमन गरिनेछ"
												}
											/>
										</th>
										<th>
											<Gt section={Translations.PriorityAction} />
										</th>
										<th>
											<Gt section={Translations.PriorityActivity} />
										</th>
										{/* <th>
                                           Area of implementation


                               </th> */}
										<th>
											<Gt section={Translations.Fundingtype} />
										</th>
										<th>
											<Gt section={Translations.Sourceof} />
										</th>
										{showSourceTypeOther && <th>Other Fund Type</th>}
										<th>
											<Gt section={Translations.Budgetcode} />
										</th>
										<th>
											<Gt section={Translations.OrganizationNm} />
										</th>
										<th>
											<Gt section={Translations.Projectstart} />
										</th>
										<th>
											<Gt section={Translations.ProjectCompletion} />
										</th>
										<th>
											<Gt section={Translations.Status} />
										</th>
										<th>
											<Gt section={Translations.AllocatedProject} />
										</th>
										<th>
											<Gt section={Translations.Actualexpenditure} />
										</th>
										<th>
											<Gt section={Translations.Remarks} />
										</th>
										{budgetActivities.length > 0 && (
											<th>
												<Gt section={Translations.ResourcesAction} />
											</th>
										)}
									</tr>
									{loader ? (
										<>
											<Loader top="50%" left="60%" />
											<p className={styles.loaderInfo}>Loading...Please Wait</p>
										</>
									) : (
										budgetId.id && (
											<>
												{finalArr &&
													finalArr.map((data, i) =>
														data.data.id === budgetActivityId ? (
															<tr>
																<td>{selectedBudgetActivityIndex + 1}</td>
																<td>
																	<input
																		type="text"
																		className={styles.inputElement}
																		onChange={handleActivityName}
																		value={activityName}
																		placeholder={
																			drrmLanguage.language === "en"
																				? "Name of Activity"
																				: "कार्यक्रमको नाम"
																		}
																	/>
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
																		{priorityAreaFetched.map((item) => (
																			<option value={item.id}>
																				{drrmLanguage.language === "np" ? item.titleNp : item.title}
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
																		{filteredpriorityActionFetched.map((item) => (
																			<option value={item.id}>
																				{drrmLanguage.language === "np" ? item.titleNp : item.title}
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
																		{filteredpriorityActivityFetched.map((item) => (
																			<option value={item.id}>
																				{drrmLanguage.language === "np" ? item.titleNp : item.title}
																			</option>
																		))}
																	</select>
																</td>
																<td>
																	<select
																		value={fundSource}
																		onChange={handlefundSource}
																		className={styles.inputElement}>
																		<option value="select">
																			{drrmLanguage.language === "en"
																				? "Select Funding Type"
																				: "बजेटको प्रकार चयन गर्नुहोस्"}
																		</option>
																		<option value="DRR Fund of Muicipality">
																			{drrmLanguage.language === "en"
																				? Translations.DRRFundMun.en
																				: Translations.DRRFundMun.np}
																		</option>
																		<option value="Other DRR related funding">
																			{drrmLanguage.language === "en"
																				? Translations.OtherDrrFund.en
																				: Translations.OtherDrrFund.np}
																		</option>
																	</select>
																</td>

																<td>
																	{fundSource === "" && (
																		<input
																			type="text"
																			className={styles.inputElement}
																			value={
																				drrmLanguage.language === "en"
																					? "Source of Funds"
																					: "बजेटको स्रोत"
																			}
																			disabled
																		/>
																	)}

																	{fundSource === "DRR Fund of Muicipality" && (
																		<input
																			type="text"
																			className={styles.inputElement}
																			value={"Municipal Government"}
																			disabled
																		/>
																	)}

																	{fundSource === "Other DRR related funding" && (
																		<select
																			value={fundingType}
																			onChange={handlefundingType}
																			className={styles.inputElement}>
																			<option value="select">
																				<Gt section={Translations.SelectSourceof} />
																			</option>
																			<option value="Federal Government">
																				<Gt section={Translations.FederalGovernment} />
																			</option>
																			<option value="Provincial Government">
																				<Gt section={Translations.ProvincialGovernment} />
																			</option>
																			<option value="INGO">
																				<Gt section={Translations.INGO} />
																			</option>
																			<option value="Private Sector">
																				<Gt section={Translations.PrivateSector} />
																			</option>
																			<option value="Academia">
																				<Gt section={Translations.Academia} />
																			</option>
																			<option value="Others">
																				<Gt section={Translations.Others} />
																			</option>
																		</select>
																	)}
																</td>
																{showSourceTypeOther && (
																	<td>
																		<input
																			type="text"
																			className={styles.inputElement}
																			value={otherSubtype}
																			onChange={handleOtherSubType}
																			placeholder={
																				drrmLanguage.language === "en"
																					? "Please Specify"
																					: "कृपया निर्दिष्ट गर्नुहोस्"
																			}
																		/>
																	</td>
																)}
																<td>
																	<input
																		type="text"
																		className={styles.inputElement}
																		onChange={handleBudgetCode}
																		value={budgetCode}
																		placeholder={
																			drrmLanguage.language === "en"
																				? "Budget Code (if available)"
																				: "बजेट कोड (यदि उपलब्ध छ भने)"
																		}
																	/>
																</td>
																<td>
																	<input
																		type="text"
																		className={styles.inputElement}
																		onChange={handleOrganisationName}
																		value={organisationName}
																		placeholder={
																			drrmLanguage.language === "en"
																				? "Name of Organisation"
																				: "संस्थाको नाम"
																		}
																	/>
																</td>

																<td>
																	<NepaliDatePicker
																		inputClassName="form-control"
																		className={styles.datepicker}
																		value={projstartDate}
																		onChange={(date) => setStartDate(date)}
																		options={{
																			calenderLocale: drrmLanguage.language === "en" ? "en" : "ne",
																			valueLocale: "en",
																		}}
																	/>
																</td>
																<td>
																	<NepaliDatePicker
																		inputClassName="form-control"
																		className={styles.datepicker}
																		value={projcompletionDate}
																		onChange={(date) => setprojCompletionDate(date)}
																		options={{
																			calenderLocale: drrmLanguage.language === "en" ? "en" : "ne",
																			valueLocale: "en",
																		}}
																	/>
																</td>
																<td>
																	<select
																		value={projStatus}
																		onChange={handleprojStatus}
																		className={styles.inputElement}
																		placeholder={
																			drrmLanguage.language === "en"
																				? "Project Status"
																				: "परियोजनाको स्थिति"
																		}>
																		<option value="select">
																			{drrmLanguage.language === "en"
																				? "Select an Option"
																				: "कृपया चयन गर्नुहोस्"}
																		</option>
																		<option value="Started">
																			{drrmLanguage.language === "en" ? "Started" : "सुरु भएको"}
																		</option>
																		<option value="Ongoing">
																			{drrmLanguage.language === "en" ? "Ongoing" : "चलिरहेको"}
																		</option>
																		<option value="Completed">
																			{drrmLanguage.language === "en" ? "Completed" : "पूरा भयोको"}
																		</option>
																	</select>
																</td>
																<td>
																	<input
																		type="text"
																		className={styles.inputElement}
																		onChange={handleAlocBudget}
																		value={allocatedBudget}
																		placeholder={
																			drrmLanguage.language === "en"
																				? "Allocated Project Budget"
																				: "परियोजना बजेट विनियोजित"
																		}
																	/>
																</td>
																<td>
																	<input
																		type="text"
																		className={styles.inputElement}
																		onChange={handleActualExp}
																		value={actualExp}
																		placeholder={
																			drrmLanguage.language === "en"
																				? "Actual Expenditure"
																				: "परियोजना बजेट विनियोजित"
																		}
																	/>
																</td>

																<td>
																	{" "}
																	<input
																		type="text"
																		className={styles.inputElement}
																		onChange={handleRemarks}
																		value={remarks}
																		placeholder={
																			drrmLanguage.language === "en"
																				? "Remarks"
																				: "कुनै टिप्पणीभए जानकारी दिनुहोस्"
																		}
																	/>
																</td>
																<td>
																	<button
																		className={styles.updateButtn}
																		type="button"
																		onClick={handleUpdateActivity}
																		title="Update Budget Activity">
																		<Gt section={Translations.Update} />
																	</button>
																</td>
															</tr>
														) : (
															<tr key={data.data.id}>
																<td>{(currentPageNumber - 1) * paginationQueryLimit + i + 1}</td>

																<td>{data.data.activityName}</td>

																<td>
																	{drrmLanguage.language === "np"
																		? data.PriorityAreaNameNe
																		: data.PriorityAreaNameEn}
																</td>
																<td>
																	{drrmLanguage.language === "np"
																		? data.PriorityActionNameNe
																		: data.PriorityActionNameEn}
																</td>
																<td>
																	{drrmLanguage.language === "np"
																		? data.PriorityActivityNameNe
																		: data.PriorityActivityNameEn}
																</td>

																<td>{data.data.fundType}</td>
																<td>{data.data.otherFundType}</td>
																<td>{data.data.donerOrganization}</td>
																<td>{data.data.budgetCode}</td>
																<td>{ADToBS(data.data.projectStartDate)}</td>
																<td>{ADToBS(data.data.projectEndDate)}</td>
																<td>{data.data.status}</td>
																<td>{data.data.amount}</td>
																<td>{data.data.expenditure}</td>
																<td>{data.data.remarks}</td>
																<td>
																	<button
																		className={styles.editButtn}
																		type="button"
																		onClick={() => handleEditActivity(data.data.id, i)}
																		title="Edit Budget Activity">
																		<ScalableVectorGraphics
																			className={styles.bulletPoint}
																			src={editIcon}
																			alt="editPoint"
																		/>
																	</button>
																</td>
															</tr>
														)
													)}

												{!props.annex &&
													(editBudgetActivity ? (
														""
													) : (
														<tr>
															<td>{budgetActivities.length + 1}</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	onChange={handleActivityName}
																	value={activityName}
																	placeholder={
																		drrmLanguage.language === "en"
																			? "Name of Activity"
																			: "कार्यक्रमको नाम"
																	}
																/>
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
																<select
																	value={fundSource}
																	onChange={handlefundSource}
																	className={styles.inputElement}>
																	<option value="select">
																		{drrmLanguage.language === "en"
																			? "Select Funding Type"
																			: "बजेटको प्रकार चयन गर्नुहोस्"}
																	</option>
																	<option value="DRR Fund of Muicipality">
																		{drrmLanguage.language === "en"
																			? Translations.DRRFundMun.en
																			: Translations.DRRFundMun.np}
																	</option>
																	<option value="Other DRR related funding">
																		{drrmLanguage.language === "en"
																			? Translations.OtherDrrFund.en
																			: Translations.OtherDrrFund.np}
																	</option>
																</select>
															</td>

															<td>
																{fundSource === "" && (
																	<input
																		type="text"
																		className={styles.inputElement}
																		value={
																			drrmLanguage.language === "en"
																				? "Source of Funds"
																				: "बजेटको स्रोत"
																		}
																		disabled
																	/>
																)}
																{fundSource === "DRR Fund of Muicipality" && (
																	<input
																		type="text"
																		className={styles.inputElement}
																		value={
																			drrmLanguage.language === "en"
																				? "Municipal Government"
																				: "मनाहानगरपालिका/नगरपालिका/गाउँपालिका"
																		}
																		disabled
																	/>
																)}

																{fundSource === "Other DRR related funding" && (
																	<select
																		value={fundingType}
																		onChange={handlefundingType}
																		className={styles.inputElement}>
																		<option value="select">
																			<Gt section={Translations.SelectSourceof} />
																		</option>
																		<option value="Federal Government">
																			<Gt section={Translations.FederalGovernment} />
																		</option>
																		<option value="Provincial Government">
																			<Gt section={Translations.ProvincialGovernment} />
																		</option>
																		<option value="INGO">
																			<Gt section={Translations.INGO} />
																		</option>
																		<option value="Private Sector">
																			<Gt section={Translations.PrivateSector} />
																		</option>
																		<option value="Academia">
																			<Gt section={Translations.Academia} />
																		</option>
																		<option value="Others">
																			<Gt section={Translations.Others} />
																		</option>
																	</select>
																)}
															</td>
															{showSourceTypeOther && (
																<td>
																	<input
																		type="text"
																		className={styles.inputElement}
																		value={otherSubtype}
																		onChange={handleOtherSubType}
																		placeholder={
																			drrmLanguage.language === "en"
																				? "Please Specify"
																				: "कृपया निर्दिष्ट गर्नुहोस्"
																		}
																	/>
																</td>
															)}
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	onChange={handleBudgetCode}
																	value={budgetCode}
																	placeholder={
																		drrmLanguage.language === "en"
																			? "Budget Code (if available)"
																			: "बजेट कोड (यदि उपलब्ध छ भने)"
																	}
																/>
															</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	onChange={handleOrganisationName}
																	value={organisationName}
																	placeholder={
																		drrmLanguage.language === "en"
																			? "Name of Organisation"
																			: "संस्थाको नाम"
																	}
																/>
															</td>

															<td>
																<NepaliDatePicker
																	inputClassName="form-control"
																	className={styles.datepicker}
																	value={projstartDate}
																	onChange={(date) => setStartDate(date)}
																	options={{
																		calenderLocale: drrmLanguage.language === "en" ? "en" : "ne",
																		valueLocale: "en",
																	}}
																/>
															</td>
															<td>
																<NepaliDatePicker
																	inputClassName="form-control"
																	className={styles.datepicker}
																	value={projcompletionDate}
																	onChange={(date) => setprojCompletionDate(date)}
																	options={{
																		calenderLocale: drrmLanguage.language === "en" ? "en" : "ne",
																		valueLocale: "en",
																	}}
																/>
															</td>
															<td>
																<select
																	value={projStatus}
																	onChange={handleprojStatus}
																	className={styles.inputElement}
																	placeholder={
																		drrmLanguage.language === "en"
																			? "Project Status"
																			: "परियोजनाको स्थिति"
																	}>
																	<option value="select">
																		{drrmLanguage.language === "en"
																			? "Select an Option"
																			: "कृपया चयन गर्नुहोस्"}
																	</option>
																	<option value="Started">
																		{drrmLanguage.language === "en" ? "Started" : "सुरु भएको"}
																	</option>
																	<option value="Ongoing">
																		{drrmLanguage.language === "en" ? "Ongoing" : "चलिरहेको"}
																	</option>
																	<option value="Completed">
																		{drrmLanguage.language === "en" ? "Completed" : "पूरा भयोको"}
																	</option>
																</select>
															</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	onChange={handleAlocBudget}
																	value={allocatedBudget}
																	placeholder={
																		drrmLanguage.language === "en"
																			? "Allocated Project Budget"
																			: "परियोजना बजेट विनियोजित"
																	}
																/>
															</td>
															<td>
																<input
																	type="text"
																	className={styles.inputElement}
																	onChange={handleActualExp}
																	value={actualExp}
																	placeholder={
																		drrmLanguage.language === "en"
																			? "Actual Expenditure"
																			: "परियोजना बजेट विनियोजित"
																	}
																/>
															</td>
															{!props.annex && (
																<>
																	<td>
																		{" "}
																		<input
																			type="text"
																			className={styles.inputElement}
																			onChange={handleRemarks}
																			value={remarks}
																			placeholder={
																				drrmLanguage.language === "en"
																					? "Remarks"
																					: "कुनै टिप्पणीभए जानकारी दिनुहोस्"
																			}
																		/>
																	</td>
																	<td />
																</>
															)}
														</tr>
													))}
												{!props.annex && (
													<tr>
														{!editBudgetActivity && (
															<>
																<td />
																<td>
																	<button
																		type="button"
																		className={styles.savebtn}
																		onClick={handleAddNew}>
																		<Gt section={Translations.AddnewAct} />
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
																<td />
																<td />
																<td />
																<td />
																<td />
																<td />
															</>
														)}
													</tr>
												)}
											</>
										)
									)}
								</>
							</tbody>
						</table>
						{!loader && !budgetId.id && !props.annex && (
							<h2 className={styles.emptyTable}>
								<Gt section={Translations.EnterBudget} />
							</h2>
						)}

						{Object.keys(postErrors).length > 0 && (
							<ul>
								<li>
									<span className={styles.errorHeading}>Please fix the following errors:</span>
								</li>
								{Object.keys(postErrors.response).map(
									(errorItem) => (
										<li>{`${errorItem}: ${postErrors.response[errorItem]}`}</li>
									) // return <li>Please enter valid info in all fields</li>;
								)}
							</ul>
						)}
						{!loader && (
							<>
								{!props.annex &&
									(!budgetId.id ? (
										<div className={styles.btns}>
											<NextPrevBtns
												handlePrevClick={props.handlePrevClick}
												handleNextClick={handleNext}
											/>
										</div>
									) : (
										<div className={styles.btns}>
											<NextPrevBtns
												handlePrevClick={props.handlePrevClick}
												handleNextClick={handleNext}
											/>
										</div>
									))}
							</>
						)}
					</div>
				)}

				{props.previewDetails && (
					<div className={styles.budgetActPreviewContainer}>
						<h2>
							<Gt section={Translations.BudgetActivity} />
						</h2>
						<div className={styles.budgetActChartContainer}>
							<PieChart width={200} height={200}>
								<Pie
									data={chartData}
									cx={90}
									cy={95}
									innerRadius={40}
									outerRadius={80}
									fill="#8884d8"
									paddingAngle={1}
									dataKey="value"
									startAngle={90}
									endAngle={450}>
									{chartData.map((entry, index) => (
										// eslint-disable-next-line react/no-array-index-key
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
							</PieChart>

							<div className={styles.legend}>
								<div className={styles.activitiesAmt}>
									<span className={styles.light}>
										<Gt section={Translations.TotalActvities} />{" "}
									</span>
									<span className={styles.biggerNum}>
										{budgetActivities.length > 0 ? budgetActivities.length : 0}
									</span>
								</div>
								<div className={styles.legenditem}>
									<div className={styles.legendColorContainer}>
										<div style={{ backgroundColor: COLORS[0] }} className={styles.legendColor} />
									</div>
									<div className={styles.numberRow}>
										<ul>
											<li>
												<span className={styles.bigerNum}>
													{additionalDrrBudget && totDrrBudget
														? (
																(Number(totDrrBudget) /
																	(Number(totDrrBudget) + Number(additionalDrrBudget))) *
																100
														  ).toFixed(0)
														: "- %"}
												</span>
											</li>
											<li className={styles.light}>
												<span>
													<Gt section={Translations.DRRRelatedAct} />
												</span>
											</li>
										</ul>
									</div>
								</div>
								<div className={_cs(styles.legenditem, styles.bottomRow)}>
									<div className={styles.legendColorContainer}>
										<div style={{ backgroundColor: COLORS[1] }} className={styles.legendColor} />
									</div>

									<div className={styles.numberRow}>
										<ul>
											<li>
												<span className={styles.bigerNum}>
													{additionalDrrBudget && totDrrBudget
														? (
																(Number(additionalDrrBudget) /
																	(Number(totDrrBudget) + Number(additionalDrrBudget))) *
																100
														  ).toFixed(0)
														: "- %"}
												</span>
											</li>
											<li className={styles.light}>
												<span>
													<Gt section={Translations.OtherDRRRelatedAct} />
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{props.monitoringDetails && (
					<div className={styles.budgetActPreviewContainer}>
						<ul>
							{/* <li>
                                  <span className={styles.darkerText}>
                                      <Gt section={Translations.MonitoringAct} />
                                  </span>
                              </li> */}
							<li>
								<span className={styles.darkerText}>
									<Gt section={Translations.DisasterRiskStrategic} />
								</span>
							</li>
						</ul>

						<div className={styles.monitoringRow}>
							<div className={styles.monitoringItem}>
								<span className={styles.monTitle}>
									<Gt section={Translations.Area1} />
								</span>
								<span className={styles.monDesc}>
									{" "}
									<Gt section={Translations.PA1} />
								</span>
								<div className={styles.scorePatch}>
									{budgetActivities.length > 0
										? budgetActivities.filter((item) => item.priorityArea === 1).length
										: 0}
								</div>
							</div>
							<div className={styles.monitoringItem}>
								<span className={styles.monTitle}>
									<Gt section={Translations.Area2} />
								</span>
								<span className={styles.monDesc}>
									{" "}
									<Gt section={Translations.PA2} />
								</span>
								<div className={styles.scorePatch}>
									{budgetActivities.length > 0
										? budgetActivities.filter((item) => item.priorityArea === 2).length
										: 0}
								</div>
							</div>
						</div>
						<div className={styles.monitoringRow}>
							<div className={styles.monitoringItem}>
								<span className={styles.monTitle}>
									<Gt section={Translations.Area3} />
								</span>
								<span className={styles.monDesc}>
									<Gt section={Translations.PA3} />
								</span>
								<div className={styles.scorePatch}>
									{budgetActivities.length > 0
										? budgetActivities.filter((item) => item.priorityArea === 3).length
										: 0}
								</div>
							</div>
							<div className={styles.monitoringItem}>
								<span className={styles.monTitle}>
									<Gt section={Translations.Area4} />
								</span>
								<span className={styles.monDesc}>
									<Gt section={Translations.PA4} />
								</span>
								<div className={styles.scorePatch}>
									{budgetActivities.length > 0
										? budgetActivities.filter((item) => item.priorityArea === 4).length
										: 0}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	createConnectedRequestCoordinator<PropsWithRedux>()(createRequestClient(requests)(BudgetActivity))
);
