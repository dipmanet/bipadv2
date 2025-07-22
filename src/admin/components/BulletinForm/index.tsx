/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { produce } from "immer";
import { isDefined, _cs } from "@togglecorp/fujs";
import Loader from "react-loader";
import { sum } from "#utils/common";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
} from "#request";
import {
	incidentListSelectorIP,
	filtersSelector,
	hazardTypesSelector,
	regionsSelector,
	bulletinEditDataSelector,
	languageSelector,
	bulletinPageSelector,
} from "#selectors";
import {
	setBulletinCovidAction,
	setBulletinFeedbackAction,
	setBulletinLossAction,
	setBulletinTemperatureAction,
	setIncidentListActionIP,
	setEventListAction,
	setBulletinEditDataAction,
} from "#actionCreators";
import DailyLoss from "./DailyLoss";
import Covid from "./Covid";
import Response from "./Response";
import Temperatures from "./Temperatures";
import PDFPreview from "./PDFPreview";
import ProgressMenu from "../ProgressMenu";
import {
	incidentSummary,
	peopleLoss,
	hazardWiseLoss,
	genderWiseLoss,
	nepaliRef,
	covid24hrsStat,
	covidTotalStat,
	vaccineStat,
	covidProvinceWiseTotal,
} from "./formFields";
import styles from "./styles.module.scss";
import { Menu } from "../ProgressMenu/utils";

const lossMetrics = [
	{ key: "count", label: "Incidents" },
	{ key: "peopleDeathCount", label: "People death" },
	{ key: "estimatedLoss", label: "Estimated loss (NPR)" },
	{ key: "infrastructureDestroyedRoadCount", label: "Road destroyed" },
	{ key: "livestockDestroyedCount", label: "Livestock destroyed" },
	{ key: "peopleMissingCount", label: "People missing" },
	{ key: "peopleInjuredCount", label: "People injured" },
	{ key: "peopleDeathFemaleCount", label: "Female death" },
	{ key: "peopleDeathMaleCount", label: "Male death" },
	{ key: "peopleDeathOtherCount", label: "Other death" },
];

const lossMetricsProvince = [
	{ key: "peopleDeathCount", label: "People death" },
	{ key: "peopleMissingCount", label: "People missing" },
	{ key: "peopleInjuredCount", label: "People injured" },
];
const lossMetricsHazard = [
	{ key: "peopleDeathCount", label: "People death" },
	{ key: "count", label: "Incidents" },
	{ key: "peopleMissingCount", label: "People missing" },
	{ key: "peopleInjuredCount", label: "People injured" },
];

interface Props {
	setBulletinLossAction: () => void;
}

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setBulletinLoss: (params) => dispatch(setBulletinLossAction(params)),
	setBulletinCovid: (params) => dispatch(setBulletinCovidAction(params)),
	setBulletinFeedback: (params) => dispatch(setBulletinFeedbackAction(params)),
	setBulletinTemperature: (params) => dispatch(setBulletinTemperatureAction(params)),
	setIncidentList: (params) => dispatch(setIncidentListActionIP(params)),
	setEventList: (params) => dispatch(setEventListAction(params)),
	setBulletinEditData: (params) => dispatch(setBulletinEditDataAction(params)),
});

const mapStateToProps = (state: AppState): PropsFromAppState => ({
	incidentList: incidentListSelectorIP(state),
	hazardTypes: hazardTypesSelector(state),
	regions: regionsSelector(state),
	filters: filtersSelector(state),
	bulletinEditData: bulletinEditDataSelector(state),
	language: languageSelector(state),
	bulletinData: bulletinPageSelector(state),
});

const selectDateForQuery = (today) => {
	// const today = new Date();
	const yesterday = new Date(today);

	// yesterday.setDate(yesterday.getDate() - 1);

	const DEFAULT_START_DATE = yesterday;
	const DEFAULT_END_DATE = today;

	const requestQuery = ({
		params: {
			// startDate = DEFAULT_START_DATE.toISOString(),
			// endDate = DEFAULT_END_DATE.toISOString(),
			startDate = `${DEFAULT_START_DATE.toISOString().split("T")[0]}T00:00:00+05:45`,
			endDate = `${DEFAULT_END_DATE.toISOString().split("T")[0]}T23:59:59+05:45`,
		} = {},
	}) => ({
		expand: ["loss.peoples", "wards", "wards.municipality", "wards.municipality.district"],
		limit: -1,
		incident_on__lt: endDate, // eslint-disable-line @typescript-eslint/camelcase
		incident_on__gt: startDate, // eslint-disable-line @typescript-eslint/camelcase
		ordering: "-incident_on",
		// lnd: true,
	});
	return requestQuery;
};

const todayDate = new Date();
const requestQueryCovidNational = ({ params }) => ({
	limit: 1,
	reported_on__lt: params.dateAltTo, // eslint-disable-line @typescript-eslint/camelcase
	ordering: "-reported_on",
});
const requestQueryCovidQuarantine = () => ({
	summary: true,
	// eslint-disable-next-line @typescript-eslint/camelcase
	summary_type: "heoc_admin_overview_covid19_table",
});

const requests: { [key: string]: ClientAttributes<ComponentProps, Params> } = {
	incidentsGetRequest: {
		url: "/incident/",
		method: methods.GET,
		query: ({ params }) => ({
			expand: params.expand,
			limit: params.limit,
			incident_on__lt: params.incident_on__lt,
			incident_on__gt: params.incident_on__gt,
			reported_on__lt: params.reported_on__lt,
			reported_on__gt: params.reported_on__gt,
			ordering: params.ordering,
			data_source: "drr_api",
		}),
		onMount: false,
		onSuccess: ({ response, params, props: { setIncidentList } }) => {
			setIncidentList({ incidentList: response.results });
			if (params && params.setLossData) {
				params.setLossData(response.results);
			}
			if (params && params.incidentFetchFunction) {
				params.incidentFetchFunction();
			}
			if (params && params.setLoading) {
				params.setLoading(false);
			}
		},
	},
	covidNationalInfo: {
		url: "/covid19-nationalinfo/",
		method: methods.GET,
		query: requestQueryCovidNational,
		onMount: false,
		onSuccess: ({ response, params }) => {
			if (params) {
				params.setCovidNational(response.results);
			}
		},
	},
	covidQuarantine: {
		url: "/covid19-quarantineinfo/",
		method: methods.GET,
		query: requestQueryCovidQuarantine,
		onMount: false,
		onSuccess: ({ response, params }) => {
			if (params) {
				params.setCovidQurantine(response.results);
				params.setLoading(false);
			}
		},
	},
	sitRepQuery: {
		url: "/bipad-bulletin/?ordering=-sitrep&limit=1",
		method: methods.GET,
		onMount: false,
		onSuccess: ({ response, params: { setSitRep }, props }) => {
			if (props.bulletinEditData.sitrep) {
				return;
			}
			setSitRep(response.results[0].sitrep + 1);
		},
	},
	getEditData: {
		url: "/bipad-bulletin/",
		method: methods.GET,
		query: ({ params }) => ({
			sitrep: params.sitrep,
		}),
		onMount: false,
		onSuccess: ({ response, props, params }) => {
			if (response.results.length > 0) {
				props.setBulletinEditData({ ...response.results[0], language: params.language });
			}
		},
	},
	getEditByURl: {
		url: ({ params }) => `/bipad-bulletin/${params.id}`,
		method: methods.GET,
		onMount: false,
		onSuccess: ({ response, props, params }) => {
			if (response.results.length > 0) {
				props.setBulletinEditData({ ...response.results[0], language: params.language });
			}
		},
	},
};
let duplicateFeedbackField = {};
const Bulletin = (props: Props) => {
	const [incidentData, setIncidentData] = useState(incidentSummary);
	const [peopleLossData, setPeopleLoss] = useState(peopleLoss);
	const [hazardWiseLossData, setHazardwise] = useState(hazardWiseLoss);
	const [addedHazardFields, setAddedData] = useState({});
	const [genderWiseLossData, setgenderWiseLoss] = useState(genderWiseLoss);
	const [covid24hrsStatData, setcovid24hrsStat] = useState(covid24hrsStat);
	const [covidTotalStatData, setcovidTotalStat] = useState(covidTotalStat);
	const [vaccineStatData, setvaccineStat] = useState(vaccineStat);
	const [covidProvinceWiseData, setcovidProvinceWiseTotal] = useState(covidProvinceWiseTotal);
	// const [feedback, setFeedback] = useState({});
	const [maxTemp, setMaxTemp] = useState(null);
	const [minTemp, setMinTemp] = useState(null);
	const [rainSummaryPic, setRainSummaryPic] = useState(null);
	const [promotionPic, setPromotionPic] = useState(null);

	const [maxTempFooter, setMaxTempFooter] = useState(null);
	const [minTempFooter, setMinTempFooter] = useState(null);
	const [showPdf, setshowPdf] = useState(false);
	const [hilight, setHilight] = useState("");
	const [dailySummary, setDailySumamry] = useState(null);
	const [activeProgressMenu, setActive] = useState(0);
	const [progress, setProgress] = useState(0);
	const [sitRep, setSitRep] = useState(0);
	const [selectedDate, setSelectedate] = useState();
	const [selectedDateTo, setSelectedateTo] = useState();
	const [rainSummaryFooter, setRainSummaryFooter] = useState("");
	// const [bulletinDate, setBulletinDate] = useState();
	const [date, setDate] = useState();
	const [dateAlt, setDateAlt] = useState("");

	const [dateTo, setDateTo] = useState();
	const [dateAltTo, setDateAltTo] = useState("");

	const [startingTime, setStartingTime] = useState("");

	const [endingTime, setEndingTime] = useState("");
	const [filterDateType, setFilterDateType] = useState("");
	const [loading, setLoading] = useState(false);
	const [filterDataTypeError, setFilterDataTypeError] = useState(false);

	const [incidentFetchCondition, setIncidentFetchCondition] = useState(true);

	const [selectedTemperatureImageType, setSelectedTemperatureImageType] = useState(null);
	const [tempIncidentData, setTempIncidentData] = useState(incidentSummary);
	const [tempPeopleLossData, setTempPeopleLoss] = useState(peopleLoss);
	const [tempIncidentDisable, setTempIncidentDisable] = useState(false);

	const countId = useRef(0);
	const {
		setBulletinLoss,
		setBulletinCovid,
		setBulletinFeedback,
		setBulletinTemperature,
		bulletinEditData,
		requests: {
			incidentsGetRequest,
			covidNationalInfo,
			covidQuarantine,
			sitRepQuery,
			getEditData,
			getEditByURl,
		},
		hazardTypes,
		language: { language },
		uri,
		id,
		urlLanguage,
		bulletinEditData: {
			feedback: feedbackEn,
			feedbackNe,
			addedHazardsNe,
			addedHazards,
			language: lang,
			advertisementFileNe,
			advertisementFile,
		},
		bulletinData: { feedback },
		setBulletinEditData,
		incidentList,
	} = props;

	const [lossData, setLossData] = useState();
	const [covidNational, setCovidNational] = useState([]);
	const [covidQuaratine, setCovidQurantine] = useState([]);
	const [isFeedbackDataUpdated, setIsFeedbackDataUpdated] = useState(false);
	const [initialAddedHazardFetch, setInitialAddedHazardFetch] = useState(false);
	const [filterSelected, setFilterSelected] = useState(false);
	covidNationalInfo.setDefaultParams({ setCovidNational, dateAltTo });
	covidQuarantine.setDefaultParams({ setCovidQurantine, setLoading });
	sitRepQuery.setDefaultParams({ setSitRep });

	const handleRefreshCovidData = () => {
		setLoading(true);
		covidNationalInfo.do({ setCovidNational, dateAltTo });
		covidQuarantine.do({ setCovidQurantine, setLoading });
	};

	const resetFeedback = () => {
		setBulletinFeedback({ feedback: {} });
	};

	const updateFeedbackData = () => {
		const final = { ...feedback };
		duplicateFeedbackField = { ...addedHazardFields };
		const finalData = incidentList.map((i) =>
			final[i.id]
				? (duplicateFeedbackField[i.id] = {
						response: final[i.id].response,
						deaths: final[i.id].deaths,
						description: final[i.id].description,
						district: final[i.id].district,
						hazard: final[i.id].hazard,
						hazardEn: final[i.id].hazardEn,
						hazardNp: final[i.id].hazardNp,
						injured: final[i.id].injured,
						missing: final[i.id].missing,
				  })
				: (duplicateFeedbackField[i.id] = {
						response: "",
						deaths: i.loss.peopleDeathCount,
						description: "",
						district: i.wards[0].municipality.district.titleEn,
						hazard: i.hazardInfo.title,
						hazardEn: i.hazardInfo.titleEn,
						hazardNp: i.hazardInfo.titleNe,
						injured: i.loss.peopleInjuredCount,
						missing: i.loss.peopleMissingCount,
				  })
		);

		return finalData;
	};
	useEffect(() => {
		updateFeedbackData();
	}, [incidentList, feedback, addedHazardFields]);
	useEffect(() => {
		if (language === "en") {
			if (addedHazards && Object.keys(addedHazards).length > 0) {
				if (feedback && Object.keys(feedback).length > 0 && incidentFetchCondition) {
					const data = { ...feedback, ...addedHazards };
					setBulletinFeedback({ feedback: data });
					setIncidentFetchCondition(false);
					setIsFeedbackDataUpdated(true);
				}
			}
		} else if (addedHazardsNe && Object.keys(addedHazardsNe).length > 0) {
			if (feedback && Object.keys(feedback).length > 0 && incidentFetchCondition) {
				const data = { ...feedback, ...addedHazardsNe };
				setBulletinFeedback({ feedback: data });
				setIncidentFetchCondition(false);
				setIsFeedbackDataUpdated(true);
			}
		}
	}, [addedHazardsNe, incidentFetchCondition, feedback, addedHazards]);
	const incidentFetchFunction = () => {
		setIncidentFetchCondition(true);
		setInitialAddedHazardFetch(!initialAddedHazardFetch);
		setFilterSelected(true);
	};
	useEffect(() => {
		let today;
		let yesterday;
		if (filterDateType) {
			setLoading(true);
			if (selectedDate) {
				today = selectedDateTo;
				yesterday = new Date(selectedDate);

				// yesterday.setDate(yesterday.getDate() - 1);
			} else {
				today = new Date();
				yesterday = new Date(today);
				// yesterday.setDate(yesterday.getDate() - 1);
			}
			// const dateFrom=selectedDate;
			// const dateTo=selectedDateTo

			const DEFAULT_START_DATE = yesterday;
			const DEFAULT_END_DATE = today;
			const startDate = `${DEFAULT_START_DATE.toISOString().split("T")[0]}T${
				startingTime || "00:00"
			}:00+05:45`;
			const endDate = `${DEFAULT_END_DATE.toISOString().split("T")[0]}T${
				endingTime || "23:59"
			}:59+05:45`;
			const expand = ["loss.peoples", "wards", "wards.municipality", "wards.municipality.district"];
			const limit = -1;
			const incident_on__lt = filterDateType === "incident_on" ? endDate : ""; // eslint-disable-line @typescript-eslint/camelcase
			const incident_on__gt = filterDateType === "incident_on" ? startDate : ""; // eslint-disable-line @typescript-eslint/camelcase
			const reported_on__lt = filterDateType === "reported_on" ? endDate : "";
			const reported_on__gt = filterDateType === "reported_on" ? startDate : "";
			const ordering = "-incident_on";

			const test = selectDateForQuery(selectedDate);

			// resetFeedback();

			incidentsGetRequest.do({
				expand,
				limit,
				incident_on__lt,
				incident_on__gt,
				reported_on__lt,
				reported_on__gt,
				ordering,
				setLossData,
				setLoading,
				incidentFetchFunction,
			});
		}
	}, [filterDateType]);
	useEffect(() => {
		if (!tempIncidentDisable) {
			if (bulletinEditData && Object.keys(bulletinEditData).length > 0) {
				setTempIncidentData(bulletinEditData.incidentSummary);
				setTempIncidentDisable(true);
				setTempPeopleLoss(bulletinEditData.peopleLoss);
			}
		}
	}, [bulletinEditData]);
	useEffect(() => {
		if (bulletinEditData && Object.keys(bulletinEditData).length > 0) {
			const finalFeedbackFromEdit = () => {
				if (bulletinEditData.language === "nepali") {
					setBulletinFeedback({ feedback: bulletinEditData.feedbackNe });
				} else {
					setBulletinFeedback({ feedback: bulletinEditData.feedback });
				}
			};
			const start = bulletinEditData.fromDateTime.split("T")[1].substring(0, 5);
			const end = bulletinEditData.toDateTime.split("T")[1].substring(0, 5);

			setStartingTime(start);
			setEndingTime(end);
			// setFilterDateType(bulletinEditData.filterBy);
			setFilterDateType("");
			setSitRep(bulletinEditData.sitrep);
			// setIncidentData(bulletinEditData.incidentSummary);
			setPeopleLoss(bulletinEditData.peopleLoss);
			setgenderWiseLoss(bulletinEditData.genderWiseLoss);
			setcovid24hrsStat(bulletinEditData.covidTwentyfourHrsStat);
			setcovidTotalStat(bulletinEditData.covidTotalStat);
			setvaccineStat(bulletinEditData.vaccineStat);
			setcovidProvinceWiseTotal(bulletinEditData.covidProvinceWiseTotal);

			finalFeedbackFromEdit();
			if (bulletinEditData.language === "nepali") {
				setAddedData(bulletinEditData.addedHazardsNe);
				setHazardwise(bulletinEditData.hazardWiseLoss);
				setMinTemp(bulletinEditData.tempMinNe);
				setMinTempFooter(bulletinEditData.tempMinFooterNe);
				setMaxTemp(bulletinEditData.tempMaxNe);
				setMaxTempFooter(bulletinEditData.tempMaxFooterNe);
				// the added data will be in the api
				// feedback data will already be there no need to construct new one
				setDailySumamry(bulletinEditData.dailySummaryNe);
				setRainSummaryPic(bulletinEditData.rainSummaryPictureNe);
				setPromotionPic(bulletinEditData.advertisementFileNe);
				setRainSummaryFooter(bulletinEditData.rainSummaryPictureFooterNe);
				setHilight(bulletinEditData.highlightNe);
			} else {
				setAddedData(bulletinEditData.addedHazards);
				setHazardwise(bulletinEditData.hazardWiseLoss);
				setMinTemp(bulletinEditData.tempMin);
				setMinTempFooter(bulletinEditData.tempMinFooter);
				setMaxTemp(bulletinEditData.tempMax);
				setMaxTempFooter(bulletinEditData.tempMaxFooter);
				setBulletinFeedback({ feedback: bulletinEditData.feedback });
				setDailySumamry(bulletinEditData.dailySummary);
				setRainSummaryPic(bulletinEditData.rainSummaryPicture);
				setPromotionPic(bulletinEditData.advertisementFile);
				setRainSummaryFooter(bulletinEditData.rainSummaryPictureFooter);
				setHilight(bulletinEditData.highlight);
			}
		} else {
			// incidentsGetRequest.do();
			covidNationalInfo.do();
			covidQuarantine.do();
			sitRepQuery.do();
		}
	}, [bulletinEditData]);

	useEffect(() => {
		if (dateAltTo) {
			covidNationalInfo.do();
		}
	}, [dateAltTo]);

	const handleSitRep = (num) => {
		setSitRep(num);
	};

	const handlesitRepBlur = (e) => {
		getEditData.do({ sitrep: e.target.value, language: language === "np" ? "nepali" : "english" });
	};

	const handleHilightChange = (e) => {
		setHilight(e.target.value);
	};

	const handleIncidentChange = (e, field) => {
		const newState = produce(incidentData, (deferedState) => {
			deferedState[field] = Number(e);
		});
		setIncidentData(newState);
		setTempIncidentData(newState);
	};

	const handlePeopleLossChange = (e, field, subfield) => {
		const newData = { ...peopleLossData };
		const newFieldData = newData[field];
		const newSubData = { ...newFieldData, [subfield]: Number(e.target.value) };
		setPeopleLoss({ ...newData, [field]: newSubData });
		setTempPeopleLoss({ ...newData, [field]: newSubData });
	};

	const handlehazardwiseLoss = (e, field, subfield) => {
		const newData = { ...hazardWiseLossData };
		const newFieldData = newData[field];
		const newSubData = { ...newFieldData, [subfield]: e };
		setHazardwise({ ...newData, [field]: newSubData });
	};

	// this runs when added fields are changed
	const handleSameHazardChange = (e, field, subfield) => {
		const newData = { ...addedHazardFields };
		const newFieldData = newData[field];
		if (subfield === "location") {
			const newSubData = {
				...newFieldData,
				coordinates: e.coordinates,
				district: e.district,
				provinceId: e.provinceId,
				districtId: e.districtId,
				municipalityId: e.municipalityId,
			};
			setAddedData({ ...newData, [field]: newSubData });
			setBulletinFeedback({ feedback: { ...feedback, ...newData, [field]: newSubData } });
		} else {
			const newSubData = { ...newFieldData, [subfield]: Number(e) };
			setAddedData({ ...newData, [field]: newSubData });
			setBulletinFeedback({ feedback: { ...feedback, ...newData, [field]: newSubData } });
		}
	};

	const handleSameHazardRemove = (hazard, key) => {
		const newData = { ...addedHazardFields };
		delete newData[key];
		setAddedData(newData);
	};

	// this runs when button is clicked
	const handleSameHazardAdd = (hazard) => {
		const countIdTotal = addedHazardsNe && Object.keys(addedHazardsNe).length;
		const countIdTotalEnglish = addedHazards && Object.keys(addedHazards).length;
		countId.current =
			lang === "english"
				? countId.current === 0 && addedHazards && Object.keys(addedHazards).length > 0
					? countIdTotalEnglish
					: countId.current
				: countId.current === 0 && addedHazardsNe && Object.keys(addedHazardsNe).length > 0
				? countIdTotal
				: countId.current;
		const newData = { ...addedHazardFields };
		setAddedData({
			...newData,
			[countId.current]: { hazard, deaths: 0, injured: 0, missing: 0, coordinates: [0, 0] },
		});
		setBulletinFeedback({
			feedback: {
				...feedback,
				[countId.current]: { hazard, deaths: 0, injured: 0, missing: 0, coordinates: [0, 0] },
			},
		});
		countId.current += 1;
	};

	// this runs in response comp, it appends new response obj from incidents list
	// to the feedback state
	const handleFeedbackChange = (e) => {
		setBulletinFeedback({ feedback: Object.assign({}, feedback, e) });
	};

	// this runs when the response subfields are changed manually
	const handleSubFieldChange = (e, field, subfield) => {
		const newObj = { ...feedback[field] };
		newObj[subfield] = e;
		setBulletinFeedback({ feedback: Object.assign({}, feedback, { [field]: newObj }) });
	};

	const handlehazardAdd = (hazard) => {
		const newData = { ...addedHazardFields };
		setAddedData({
			...newData,
			[Math.random()]: { hazard, deaths: 0, injured: 0, missing: 0, coordinates: [0, 0] },
		});
		// add it to hazard too
		const hazardData = { ...hazardWiseLossData };
	};

	const handlegenderWiseLoss = (e, field) => {
		const newState = produce(genderWiseLossData, (deferedState) => {
			deferedState[field] = e.target.value;
		});
		setgenderWiseLoss(newState);
	};

	const handleCovidTotalStat = (e, field) => {
		const newState = produce(covidTotalStatData, (deferedState) => {
			deferedState[field] = e.target.value;
		});
		setcovidTotalStat(newState);
	};

	const handleCovid24hrStat = (e, field) => {
		const newState = produce(covid24hrsStatData, (deferedState) => {
			deferedState[field] = e.target.value;
		});
		setcovid24hrsStat(newState);
	};

	const handleVaccineStat = (e, field) => {
		const newState = produce(vaccineStatData, (deferedState) => {
			deferedState[field] = e.target.value;
		});
		setvaccineStat(newState);
	};

	const handleprovincewiseTotal = (e, field, subfield) => {
		const newData = { ...covidProvinceWiseData };
		const newFieldData = newData[field];
		const newSubData = { ...newFieldData, [subfield]: e.target.value };
		setcovidProvinceWiseTotal({ ...newData, [field]: newSubData });
	};

	const handleMaxTemp = (e) => {
		setMaxTemp(e);
	};

	const handleMinTemp = (e) => {
		setMinTemp(e);
	};

	const handleDailySummary = (e) => {
		setDailySumamry(e.target.value);
	};

	const handleFooterMax = (e) => {
		setMaxTempFooter(e.target.value);
	};

	const handleFooterMin = (e) => {
		setMinTempFooter(e.target.value);
	};

	const handleRainSummaryPic = (e) => {
		setRainSummaryPic(e);
	};
	const handlePromotionPic = (e) => {
		setPromotionPic(e);
	};

	const deleteFeedbackChange = (idx) => {
		const n = [...feedback];
	};
	const handleRainSummaryFooter = (e) => {
		setRainSummaryFooter(e.target.value);
	};
	const handlePrevBtn = () => {
		if (progress > 0) {
			setProgress(progress - 1);
			setActive(progress - 1);
		}
	};

	useEffect(() => {
		const addedHazardFieldCollection = Object.values(addedHazardFields);
		const totalDeath = addedHazardFieldCollection.reduce(
			(previousValue, currentValue) => previousValue + currentValue.deaths,
			0
		);
		const totalMissing = addedHazardFieldCollection.reduce(
			(previousValue, currentValue) => previousValue + currentValue.missing,
			0
		);
		const totalInjured = addedHazardFieldCollection.reduce(
			(previousValue, currentValue) => previousValue + currentValue.injured,
			0
		);
		const totalIncident = addedHazardFieldCollection.length;
		if (addedHazardFieldCollection.length) {
			const p1Data = addedHazardFieldCollection.filter((i) => i.provinceId === 1);
			const p1DataDeath = p1Data.reduce(
				(previousValue, currentValue) => previousValue + currentValue.deaths,
				0
			);
			const p1DataMissing = p1Data.reduce(
				(previousValue, currentValue) => previousValue + currentValue.missing,
				0
			);
			const p1DataInjured = p1Data.reduce(
				(previousValue, currentValue) => previousValue + currentValue.injured,
				0
			);
			const madheshProv = addedHazardFieldCollection.filter((i) => i.provinceId === 2);
			const madheshProvDeath = madheshProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.deaths,
				0
			);
			const madheshProvMissing = madheshProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.missing,
				0
			);
			const madheshProvInjured = madheshProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.injured,
				0
			);

			const bagmatiProv = addedHazardFieldCollection.filter((i) => i.provinceId === 3);
			const bagmatiProvDeath = bagmatiProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.deaths,
				0
			);
			const bagmatiProvMissing = bagmatiProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.missing,
				0
			);
			const bagmatiProvInjured = bagmatiProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.injured,
				0
			);

			const gandakiProv = addedHazardFieldCollection.filter((i) => i.provinceId === 4);
			const gandakiProvDeath = gandakiProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.deaths,
				0
			);
			const gandakiProvMissing = gandakiProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.missing,
				0
			);
			const gandakiProvInjured = gandakiProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.injured,
				0
			);

			const lumbiniProv = addedHazardFieldCollection.filter((i) => i.provinceId === 5);
			const lumbiniProvDeath = lumbiniProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.deaths,
				0
			);
			const lumbiniProvMissing = lumbiniProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.missing,
				0
			);
			const lumbiniProvInjured = lumbiniProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.injured,
				0
			);

			const karnaliProv = addedHazardFieldCollection.filter((i) => i.provinceId === 6);
			const karnaliProvDeath = karnaliProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.deaths,
				0
			);
			const karnaliProvMissing = karnaliProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.missing,
				0
			);
			const karnaliProvInjured = karnaliProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.injured,
				0
			);

			const sudurPaschimProv = addedHazardFieldCollection.filter((i) => i.provinceId === 7);
			const sudurPaschimProvDeath = sudurPaschimProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.deaths,
				0
			);
			const sudurPaschimProvMissing = sudurPaschimProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.missing,
				0
			);
			const sudurPaschimProvInjured = sudurPaschimProv.reduce(
				(previousValue, currentValue) => previousValue + currentValue.injured,
				0
			);

			const { numberOfIncidents, numberOfInjured, numberOfDeath, numberOfMissing } =
				tempIncidentData;
			const provincialLevelData = {
				bagmati: {
					death: bagmatiProvDeath + tempPeopleLossData.bagmati.death,
					missing: bagmatiProvMissing + tempPeopleLossData.bagmati.missing,
					injured: bagmatiProvInjured + tempPeopleLossData.bagmati.injured,
				},
				gandaki: {
					death: gandakiProvDeath + tempPeopleLossData.gandaki.death,
					missing: gandakiProvMissing + tempPeopleLossData.gandaki.missing,
					injured: gandakiProvInjured + tempPeopleLossData.gandaki.injured,
				},
				karnali: {
					death: karnaliProvDeath + tempPeopleLossData.karnali.death,
					missing: karnaliProvMissing + tempPeopleLossData.karnali.missing,
					injured: karnaliProvInjured + tempPeopleLossData.karnali.injured,
				},
				lumbini: {
					death: lumbiniProvDeath + tempPeopleLossData.lumbini.death,
					missing: lumbiniProvMissing + tempPeopleLossData.lumbini.missing,
					injured: lumbiniProvInjured + tempPeopleLossData.lumbini.injured,
				},
				p1: {
					death: p1DataDeath + tempPeopleLossData.p1.death,
					missing: p1DataMissing + tempPeopleLossData.p1.missing,
					injured: p1DataInjured + tempPeopleLossData.p1.injured,
				},
				p2: {
					death: madheshProvDeath + tempPeopleLossData.p2.death,
					missing: madheshProvMissing + tempPeopleLossData.p2.missing,
					injured: madheshProvInjured + tempPeopleLossData.p2.injured,
				},
				sudurpaschim: {
					death: sudurPaschimProvDeath + tempPeopleLossData.sudurpaschim.death,
					missing: sudurPaschimProvMissing + tempPeopleLossData.sudurpaschim.missing,
					injured: sudurPaschimProvInjured + tempPeopleLossData.sudurpaschim.injured,
				},
			};
			setPeopleLoss(provincialLevelData);
			const totalIncidentUpdated = filterSelected
				? totalIncident + numberOfIncidents
				: numberOfIncidents;
			const totalDeathUpdated = filterSelected ? totalDeath + numberOfDeath : numberOfDeath;
			const totalMissingUpdated = filterSelected ? totalMissing + numberOfMissing : numberOfMissing;
			const totalInjuredUpdated = filterSelected ? totalInjured + numberOfInjured : numberOfInjured;

			setIncidentData({
				...incidentData,
				numberOfDeath: totalDeathUpdated,
				numberOfIncidents: totalIncidentUpdated,
				numberOfInjured: totalInjuredUpdated,
				numberOfMissing: totalMissingUpdated,
			});
		} else {
			const { numberOfIncidents, numberOfInjured, numberOfDeath, numberOfMissing } =
				tempIncidentData;
			const provincialLevelData = {
				bagmati: {
					death: tempPeopleLossData && tempPeopleLossData.bagmati.death,
					missing: tempPeopleLossData && tempPeopleLossData.bagmati.missing,
					injured: tempPeopleLossData && tempPeopleLossData.bagmati.injured,
				},
				gandaki: {
					death: tempPeopleLossData && tempPeopleLossData.gandaki.death,
					missing: tempPeopleLossData && tempPeopleLossData.gandaki.missing,
					injured: tempPeopleLossData && tempPeopleLossData.gandaki.injured,
				},
				karnali: {
					death: tempPeopleLossData && tempPeopleLossData.karnali.death,
					missing: tempPeopleLossData && tempPeopleLossData.karnali.missing,
					injured: tempPeopleLossData && tempPeopleLossData.karnali.injured,
				},
				lumbini: {
					death: tempPeopleLossData && tempPeopleLossData.lumbini.death,
					missing: tempPeopleLossData && tempPeopleLossData.lumbini.missing,
					injured: tempPeopleLossData && tempPeopleLossData.lumbini.injured,
				},
				p1: {
					death: tempPeopleLossData && tempPeopleLossData.p1.death,
					missing: tempPeopleLossData && tempPeopleLossData.p1.missing,
					injured: tempPeopleLossData && tempPeopleLossData.p1.injured,
				},
				p2: {
					death: tempPeopleLossData && tempPeopleLossData.p2.death,
					missing: tempPeopleLossData && tempPeopleLossData.p2.missing,
					injured: tempPeopleLossData && tempPeopleLossData.p2.injured,
				},
				sudurpaschim: {
					death: tempPeopleLossData && tempPeopleLossData.sudurpaschim.death,
					missing: tempPeopleLossData && tempPeopleLossData.sudurpaschim.missing,
					injured: tempPeopleLossData && tempPeopleLossData.sudurpaschim.injured,
				},
			};
			setPeopleLoss(provincialLevelData);

			const totalIncidentUpdated =
				!filterSelected && numberOfIncidents > 0 ? numberOfIncidents - 1 : numberOfIncidents;
			const totalDeathUpdated = !filterSelected ? numberOfDeath - totalDeath : numberOfDeath;
			const totalMissingUpdated = !filterSelected
				? numberOfMissing - totalMissing
				: numberOfMissing;
			const totalInjuredUpdated = !filterSelected
				? numberOfInjured - totalInjured
				: numberOfInjured;
			setIncidentData({
				...incidentData,
				numberOfDeath: totalDeathUpdated,
				numberOfIncidents: totalIncidentUpdated,
				numberOfInjured: totalInjuredUpdated,
				numberOfMissing: totalMissingUpdated,
			});
		}
	}, [addedHazardFields, initialAddedHazardFetch, filterSelected]);

	const handleNextBtn = () => {
		if (!filterDateType) {
			setFilterDataTypeError(true);
			return null;
		}

		if (progress < Menu.bulletinProgressMenu.length - 1) {
			if (progress === 0) {
				const feedbackDuplicateData = Object.keys(duplicateFeedbackField).length;
				setBulletinFeedback({
					feedback: feedbackDuplicateData > 0 ? duplicateFeedbackField : feedback,
				});
				setBulletinLoss({
					incidentSummary: incidentData,
					peopleLoss: peopleLossData,
					hazardWiseLoss: hazardWiseLossData,
					genderWiseLoss: genderWiseLossData,
					sitRep,
					hilight,
					bulletinDate: date,
					startDate: date,
					endDate: dateTo,
					startTime: startingTime,
					endTime: endingTime,
					filterDateType,
					addedHazards: addedHazardFields,
				});
			}

			if (progress === 1) {
				setBulletinCovid({
					covid24hrsStat: covid24hrsStatData,
					covidProvinceWiseTotal: covidProvinceWiseData,
					covidTotalStat: covidTotalStatData,
					vaccineStat: vaccineStatData,
				});
			}
			// if (progress === 2) {
			//     setBulletinFeedback({
			//         feedback,
			//     });
			// }
			if (progress === 2) {
				setBulletinTemperature({
					tempMin: minTemp,
					tempMax: maxTemp,
					dailySummary,
					rainSummaryPic,
					maxTempFooter,
					minTempFooter,
					rainSummaryFooter,
					advertisementFile: language === "np" ? null : promotionPic,
					advertisementFileNe: language === "np" ? promotionPic : null,
				});
			}
			setProgress(progress + 1);
			setActive(progress + 1);
		}
		return null;
	};

	const calculateSummary = (data) => {
		const stat = lossMetrics.reduce(
			(acc, { key }) => ({
				...acc,
				[key]: sum(
					data
						.filter((incident) => incident.loss)
						.map((incident) => incident.loss[key])
						.filter(isDefined)
				),
			}),
			{}
		);

		stat.count = data.length;

		return stat;
	};

	const calculateSummaryProvince = (data) => {
		const stat = lossMetricsProvince.reduce(
			(acc, { key }) => ({
				...acc,
				[key]: sum(
					data
						.filter((incident) => incident.loss)
						.map((incident) => incident.loss[key])
						.filter(isDefined)
				),
			}),
			{}
		);

		stat.count = data.length;

		return stat;
	};
	const calculateSummaryHazard = (data) => {
		const stat = lossMetricsHazard.reduce(
			(acc, { key }) => ({
				...acc,
				[key]: sum(
					data
						.filter((incident) => incident.loss)
						.map((incident) => incident.loss[key])
						.filter(isDefined)
				),
			}),
			{}
		);

		stat.count = data.length;

		return stat;
	};
	const recordSelectedDate = (dat) => {
		setSelectedate(dat);
	};
	const recordSelectedDateTo = (dat) => {
		setSelectedateTo(dat);
	};
	const handleBulletinDate = (bulletinDate) => {
		setDate(bulletinDate);
	};
	const handleDateTo = (bulletinDate) => {
		setDateTo(bulletinDate);
	};
	useEffect(
		() => () => {
			setBulletinEditData({});
			setBulletinFeedback({ feedback: {} });
		},
		[]
	);
	useEffect(() => {
		if (lossData && (lossData.length > 0 || lossData.length === 0)) {
			const summary = calculateSummary(lossData);

			setTempIncidentData({
				numberOfIncidents: summary.count,
				numberOfDeath: summary.peopleDeathCount,
				numberOfMissing: summary.peopleMissingCount,
				numberOfInjured: summary.peopleInjuredCount,
				estimatedLoss:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.incidentSummary.estimatedLoss
						: summary.estimatedLoss,
				roadBlock:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.incidentSummary.roadBlock
						: summary.infrastructureDestroyedRoadCount,
				cattleLoss:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.incidentSummary.cattleLoss
						: summary.livestockDestroyedCount,
			});
			const p1Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 1
			);
			const p2Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 2
			);
			const p3Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 3
			);
			const p4Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 4
			);
			const p5Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 5
			);
			const p6Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 6
			);
			const p7Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 7
			);
			setTempPeopleLoss({
				p1: {
					death: calculateSummaryProvince(p1Data).peopleDeathCount,
					missing: calculateSummaryProvince(p1Data).peopleMissingCount,
					injured: calculateSummaryProvince(p1Data).peopleInjuredCount,
				},
				p2: {
					death: calculateSummaryProvince(p2Data).peopleDeathCount,
					missing: calculateSummaryProvince(p2Data).peopleMissingCount,
					injured: calculateSummaryProvince(p2Data).peopleInjuredCount,
				},
				bagmati: {
					death: calculateSummaryProvince(p3Data).peopleDeathCount,
					missing: calculateSummaryProvince(p3Data).peopleMissingCount,
					injured: calculateSummaryProvince(p3Data).peopleInjuredCount,
				},
				gandaki: {
					death: calculateSummaryProvince(p4Data).peopleDeathCount,
					missing: calculateSummaryProvince(p4Data).peopleMissingCount,
					injured: calculateSummaryProvince(p4Data).peopleInjuredCount,
				},
				lumbini: {
					death: calculateSummaryProvince(p5Data).peopleDeathCount,
					missing: calculateSummaryProvince(p5Data).peopleMissingCount,
					injured: calculateSummaryProvince(p5Data).peopleInjuredCount,
				},
				karnali: {
					death: calculateSummaryProvince(p6Data).peopleDeathCount,
					missing: calculateSummaryProvince(p6Data).peopleMissingCount,
					injured: calculateSummaryProvince(p6Data).peopleInjuredCount,
				},
				sudurpaschim: {
					death: calculateSummaryProvince(p7Data).peopleDeathCount,
					missing: calculateSummaryProvince(p7Data).peopleMissingCount,
					injured: calculateSummaryProvince(p7Data).peopleInjuredCount,
				},
			});
		}
	}, [lossData]);

	useEffect(() => {
		if (lossData && (lossData.length > 0 || lossData.length === 0)) {
			const summary = calculateSummary(lossData);
			setIncidentData({
				numberOfIncidents: summary.count,
				numberOfDeath: summary.peopleDeathCount,
				numberOfMissing: summary.peopleMissingCount,
				numberOfInjured: summary.peopleInjuredCount,
				estimatedLoss:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.incidentSummary.estimatedLoss
						: summary.estimatedLoss,
				roadBlock:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.incidentSummary.roadBlock
						: summary.infrastructureDestroyedRoadCount,
				cattleLoss:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.incidentSummary.cattleLoss
						: summary.livestockDestroyedCount,
			});

			setgenderWiseLoss({
				male:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.genderWiseLoss.male
						: summary.peopleDeathMaleCount,
				female:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.genderWiseLoss.female
						: summary.peopleDeathFemaleCount,
				unknown:
					Object.keys(bulletinEditData).length > 0
						? bulletinEditData.genderWiseLoss.unknown
						: summary.peopleDeathOtherCount,
			});

			const p1Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 1
			);
			const p2Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 2
			);
			const p3Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 3
			);
			const p4Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 4
			);
			const p5Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 5
			);
			const p6Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 6
			);
			const p7Data = lossData.filter(
				(lD) => lD.wards[0] && lD.wards[0].municipality.district.province === 7
			);
			setPeopleLoss({
				p1: {
					death: calculateSummaryProvince(p1Data).peopleDeathCount,
					missing: calculateSummaryProvince(p1Data).peopleMissingCount,
					injured: calculateSummaryProvince(p1Data).peopleInjuredCount,
				},
				p2: {
					death: calculateSummaryProvince(p2Data).peopleDeathCount,
					missing: calculateSummaryProvince(p2Data).peopleMissingCount,
					injured: calculateSummaryProvince(p2Data).peopleInjuredCount,
				},
				bagmati: {
					death: calculateSummaryProvince(p3Data).peopleDeathCount,
					missing: calculateSummaryProvince(p3Data).peopleMissingCount,
					injured: calculateSummaryProvince(p3Data).peopleInjuredCount,
				},
				gandaki: {
					death: calculateSummaryProvince(p4Data).peopleDeathCount,
					missing: calculateSummaryProvince(p4Data).peopleMissingCount,
					injured: calculateSummaryProvince(p4Data).peopleInjuredCount,
				},
				lumbini: {
					death: calculateSummaryProvince(p5Data).peopleDeathCount,
					missing: calculateSummaryProvince(p5Data).peopleMissingCount,
					injured: calculateSummaryProvince(p5Data).peopleInjuredCount,
				},
				karnali: {
					death: calculateSummaryProvince(p6Data).peopleDeathCount,
					missing: calculateSummaryProvince(p6Data).peopleMissingCount,
					injured: calculateSummaryProvince(p6Data).peopleInjuredCount,
				},
				sudurpaschim: {
					death: calculateSummaryProvince(p7Data).peopleDeathCount,
					missing: calculateSummaryProvince(p7Data).peopleMissingCount,
					injured: calculateSummaryProvince(p7Data).peopleInjuredCount,
				},
			});
			const newhazardData = {};
			const uniqueHazards = [...new Set(lossData.map((h) => h.hazard))];
			if (language === "np") {
				const hD = uniqueHazards.map((h) => {
					newhazardData[hazardTypes[h].titleNe] = {
						deaths: calculateSummaryHazard(lossData.filter((l) => l.hazard === h)).peopleDeathCount,
						incidents: calculateSummaryHazard(lossData.filter((l) => l.hazard === h)).count,
						missing:
							calculateSummaryHazard(lossData.filter((l) => l.hazard === h)).peopleMissingCount ||
							0,
						injured:
							calculateSummaryHazard(lossData.filter((l) => l.hazard === h)).peopleInjuredCount ||
							0,
						coordinates: [0, 0],
					};
					return null;
				});
			} else {
				const hD = uniqueHazards.map((h) => {
					newhazardData[hazardTypes[h].title] = {
						deaths: calculateSummaryHazard(lossData.filter((l) => l.hazard === h)).peopleDeathCount,
						incidents: calculateSummaryHazard(lossData.filter((l) => l.hazard === h)).count,
						missing:
							calculateSummaryHazard(lossData.filter((l) => l.hazard === h)).peopleMissingCount ||
							0,
						injured:
							calculateSummaryHazard(lossData.filter((l) => l.hazard === h)).peopleInjuredCount ||
							0,
						coordinates: [0, 0],
					};
					return null;
				});
			}

			// const hD = lossData.map((h) => {
			//     newhazardData[h.id] = {
			//         hazard: hazardTypes[h.hazard].titleNe,
			//         deaths: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleDeathCount,
			//         incidents: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).count,
			//         missing: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleMissingCount,
			//         injured: calculateSummaryHazard(lossData.filter(l => l.hazard === h)).peopleInjuredCount,
			//         district: lossData.filter(l => l.hazard === h).peopleInjuredCount,
			//     };
			//     return null;
			// });

			setHazardwise(newhazardData);
		}
	}, [lossData, language]);

	useEffect(() => {
		if (covidNational.length > 0) {
			setcovid24hrsStat({
				affected: covidNational[0].newCases || 0,
				femaleAffected: covidNational[0].newCasesFemale || 0,
				maleAffected: covidNational[0].newCasesMale || 0,
				deaths: covidNational[0].newDeath || 0,
				recovered: covidNational[0].newRecovered || 0,
			});
			setcovidTotalStat({
				totalAffected: covidNational[0].totalCases || 0,
				totalActive: covidNational[0].totalInfected || 0,
				totalRecovered: covidNational[0].totalRecovered || 0,
				totalDeaths: covidNational[0].totalDeath || 0,
			});
		}
	}, [covidNational]);

	useEffect(() => {
		if (covidQuaratine.length > 0) {
			const p1Data = covidQuaratine.filter((p) => p.provinceName === "Province 1")[0];
			const p2Data = covidQuaratine.filter((p) => p.provinceName === "Madhesh")[0];
			const p3Data = covidQuaratine.filter((p) => p.provinceName === "Bagmati")[0];
			const p4Data = covidQuaratine.filter((p) => p.provinceName === "Gandaki")[0];
			const p5Data = covidQuaratine.filter((p) => p.provinceName === "Lumbini")[0];
			const p6Data = covidQuaratine.filter((p) => p.provinceName === "Karnali")[0];
			const p7Data = covidQuaratine.filter((p) => p.provinceName === "Sudurpashchim")[0];
			setcovidProvinceWiseTotal({
				p1: {
					totalAffected: p1Data ? p1Data.totalPositive : 0,
					totalActive: p1Data
						? p1Data.totalPositive - p1Data.totalDeath - p1Data.totalRecovered
						: 0,
					totalDeaths: p1Data ? p1Data.totalDeath : 0,
				},
				p2: {
					totalAffected: p2Data ? p2Data.totalPositive : 0,
					totalActive: p2Data
						? p2Data.totalPositive - p2Data.totalDeath - p2Data.totalRecovered
						: 0,
					totalDeaths: p2Data ? p2Data.totalDeath : 0,
				},
				bagmati: {
					totalAffected: p3Data ? p3Data.totalPositive : 0,
					totalActive: p3Data
						? p3Data.totalPositive - p3Data.totalDeath - p3Data.totalRecovered
						: 0,
					totalDeaths: p3Data ? p3Data.totalDeath : 0,
				},
				gandaki: {
					totalAffected: p4Data ? p4Data.totalPositive : 0,
					totalActive: p4Data
						? p4Data.totalPositive - p4Data.totalDeath - p4Data.totalRecovered
						: 0,
					totalDeaths: p4Data ? p4Data.totalDeath : 0,
				},
				lumbini: {
					totalAffected: p5Data ? p5Data.totalPositive : 0,
					totalActive: p5Data
						? p5Data.totalPositive - p5Data.totalDeath - p5Data.totalRecovered
						: 0,
					totalDeaths: p5Data ? p5Data.totalDeath : 0,
				},
				karnali: {
					totalAffected: p6Data ? p6Data.totalPositive : 0,
					totalActive: p6Data
						? p6Data.totalPositive - p6Data.totalDeath - p6Data.totalRecovered
						: 0,
					totalDeaths: p6Data ? p6Data.totalDeath : 0,
				},
				sudurpaschim: {
					totalAffected: p7Data ? p7Data.totalPositive : 0,
					totalActive: p7Data
						? p7Data.totalPositive - p7Data.totalDeath - p7Data.totalRecovered
						: 0,
					totalDeaths: p7Data ? p7Data.totalDeath : 0,
				},
			});
		}
	}, [covidQuaratine]);
	const formSections = [
		<DailyLoss
			handleIncidentChange={handleIncidentChange}
			handlePeopleLossChange={handlePeopleLossChange}
			handlehazardwiseLoss={handlehazardwiseLoss}
			handlegenderWiseLoss={handlegenderWiseLoss}
			incidentData={incidentData}
			peopleLossData={peopleLossData}
			hazardWiseLossData={hazardWiseLossData}
			genderWiseLossData={genderWiseLossData}
			handleSitRep={handleSitRep}
			sitRep={sitRep}
			handlehazardAdd={handlehazardAdd}
			handleHilightChange={handleHilightChange}
			hilight={hilight}
			handleSameHazardAdd={handleSameHazardAdd}
			addedHazardFields={addedHazardFields}
			handleSameHazardChange={handleSameHazardChange}
			recordSelectedDate={recordSelectedDate}
			handleBulletinDate={handleBulletinDate}
			handleDateTo={handleDateTo}
			uri={uri}
			resetFeedback={resetFeedback}
			handlesitRepBlur={handlesitRepBlur}
			dateAlt={dateAlt}
			setDateAlt={setDateAlt}
			dateAltTo={dateAltTo}
			setDateAltTo={setDateAltTo}
			startingTime={startingTime}
			endingTime={endingTime}
			setStartingTime={setStartingTime}
			setEndingTime={setEndingTime}
			setFilterDateType={setFilterDateType}
			filterDateType={filterDateType}
			recordSelectedDateTo={recordSelectedDateTo}
			loading={loading}
			filterDataTypeError={filterDataTypeError}
			setFilterDataTypeError={setFilterDataTypeError}
			handleSameHazardRemove={handleSameHazardRemove}
		/>,
		// <Covid
		//     covid24hrsStatData={covid24hrsStatData}
		//     covidTotalStatData={covidTotalStatData}
		//     vaccineStatData={vaccineStatData}
		//     covidProvinceWiseData={covidProvinceWiseData}
		//     handleCovidTotalStat={handleCovidTotalStat}
		//     handleCovid24hrStat={handleCovid24hrStat}
		//     handleVaccineStat={handleVaccineStat}
		//     handleprovincewiseTotal={handleprovincewiseTotal}
		//     dateAlt={dateAlt}
		//     handleRefreshCovidData={handleRefreshCovidData}
		// />,
		<Response
			handleFeedbackChange={handleFeedbackChange}
			feedback={feedback}
			deleteFeedbackChange={deleteFeedbackChange}
			hazardWiseLossData={hazardWiseLossData}
			handleSubFieldChange={handleSubFieldChange}
			isFeedbackDataUpdated={isFeedbackDataUpdated}
			setIsFeedbackDataUpdated={setIsFeedbackDataUpdated}
		/>,
		<Temperatures
			minTemp={minTemp}
			maxTemp={maxTemp}
			handleMaxTemp={handleMaxTemp}
			handleMinTemp={handleMinTemp}
			handleDailySummary={handleDailySummary}
			dailySummary={dailySummary}
			rainSummaryPic={rainSummaryPic}
			handleRainSummaryPic={handleRainSummaryPic}
			maxTempFooter={maxTempFooter}
			minTempFooter={minTempFooter}
			handleFooterMax={handleFooterMax}
			handleFooterMin={handleFooterMin}
			handleRainSummaryFooter={handleRainSummaryFooter}
			rainSummaryFooter={rainSummaryFooter}
			handlePromotionPic={handlePromotionPic}
			promotionPic={promotionPic}
			selectedTemperatureImageType={selectedTemperatureImageType}
			setSelectedTemperatureImageType={setSelectedTemperatureImageType}
			advertisementFile={advertisementFile}
			advertisementFileNe={advertisementFileNe}
		/>,
		<PDFPreview
			handlePrevBtn={handlePrevBtn}
			handleFeedbackChange={handleFeedbackChange}
			feedback={feedback}
			deleteFeedbackChange={deleteFeedbackChange}
			hazardWiseLossData={hazardWiseLossData}
			handleSubFieldChange={handleSubFieldChange}
			selectedTemperatureImageType={selectedTemperatureImageType}
			setSelectedTemperatureImageType={setSelectedTemperatureImageType}
			handlePromotionPic={handlePromotionPic}
			promotionPic={promotionPic}
			advertisementFile={advertisementFile}
			advertisementFileNe={advertisementFileNe}
			// bulletinData={
			//     {
			//         incidentSummary: incidentData,
			//         peopleLoss: peopleLossData,
			//         hazardWiseLoss: hazardWiseLossData,
			//         genderWiseLoss: genderWiseLossData,
			//         covidTwentyfourHrsStat: covid24hrsStatData,
			//         covidTotalStat: covidTotalStatData,
			//         vaccineStat: vaccineStatData,
			//         covidProvinceWiseTotal: covidProvinceWiseData,
			//         feedback,
			//         tempMax: maxTemp,
			//         tempMin: minTemp,
			//         dailySummary,
			//         sitrep: sitRep,
			//         rainSummaryFooter,
			//         bulletinDate: date,
			//     }
			// }
		/>,
	];

	return (
		<div
			className={_cs(
				styles.mainSection,
				language === "np" ? styles.formContainerNepali : styles.formContainerEnglish
			)}>
			{loading ? (
				<Loader
					options={{
						position: "fixed",
						top: "48%",
						right: 0,
						bottom: 0,
						left: "48%",
						background: "gray",
						zIndex: 9999,
					}}
				/>
			) : (
				""
			)}
			<div className={styles.leftMenuSection}>
				<ProgressMenu
					menuKey="bulletinProgressMenu"
					activeMenu={activeProgressMenu}
					progress={progress}
				/>
			</div>

			<div className={styles.rightFormSection}>
				{formSections[activeProgressMenu]}
				{progress < 3 && (
					<div className={styles.buttonsContainer}>
						{progress > 0 && (
							<button type="button" onClick={handlePrevBtn} className={styles.prevBtn}>
								Previous
							</button>
						)}

						<button
							type="button"
							onClick={handleNextBtn}
							className={progress !== 3 ? styles.nextBtn : styles.disabledBtn}
							disabled={loading}>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requests)(Bulletin)));
