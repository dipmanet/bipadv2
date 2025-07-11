/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prefer-const */
/* eslint-disable react/no-did-update-set-state */
import React from "react";

import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import { connect } from "react-redux";
import { _cs } from "@togglecorp/fujs";
import { Translation } from "react-i18next";
import Modal from "#rscv/Modal";

import ModalHeader from "#rscv/Modal/Header";

import ModalBody from "#rscv/Modal/Body";

import FullStepwiseRegionSelectInput, {
	RegionValuesAlt,
} from "#components/FullStepwiseRegionSelectInput";
import {
	districtsSelector,
	languageSelector,
	municipalitiesSelector,
	provincesSelector,
	wardsSelector,
} from "#selectors";

import { createRequestClient, NewProps, ClientAttributes, methods } from "#request";

import { MultiResponse } from "#store/atom/response/types";
import { Contact, Organization, Training as ContactTraining } from "#store/atom/page/types";
import DangerButton from "#rsca/Button/DangerButton";

import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";

import LoadingAnimation from "#rscv/LoadingAnimation";
import Button from "#rsca/Button";
import { saveChart } from "#utils/common";
import finance from "#resources/icons/newCapResBanking.svg";
import cultural from "#resources/icons/newCapResCulture.svg";
import education from "#resources/icons/newCapResEducation.svg";
import governance from "#resources/icons/newCapResGovernment.svg";
import health from "#resources/icons/newCapResHealth.svg";
import industry from "#resources/icons/newCapResIndustry.svg";
import hotelandrestaurant from "#resources/icons/newCapResHotel&Restaurant.svg";
import transportation from "#resources/icons/newCapResTransportation.svg";
import communication from "#resources/icons/newCapResCommunication.svg";
import bridge from "#resources/icons/newCapResBridge.svg";
import electricity from "#resources/icons/newCapResElectricity.svg";
import firefightingApp from "#resources/icons/newCapResFireFightingApparatus.svg";
import sanitationService from "#resources/icons/newCapResSanitationService.svg";
import watersupply from "#resources/icons/newCapResWaterSupplyInfrastructure.svg";
import openspace from "#resources/icons/newCapResOpenSpace.svg";
import evacuationCentre from "#resources/icons/newCapResEvacuationcenter.svg";
import airway from "#resources/icons/airway.svg";
import roadway from "#resources/icons/roadway.svg";
import waterway from "#resources/icons/waterway.svg";
import helipad from "#resources/icons/heli.svg";
import TableData from "./DataSet";
import styles from "./styles.module.scss";
import BarChartVisualization from "./BarChart";

const getLocationDetails = (point: unknown) => {
	const geoJson = {
		type: "FeatureCollection",
		features: [
			{
				type: "Feature",
				geometry: point,
			},
		],
	};

	return {
		geoJson,
	};
};

interface OwnProps {
	contactId?: Contact["id"];
	details?: Contact;
	onEditSuccess?: (contactId: Contact["id"], contact: Contact) => void;
	onAddSuccess?: (contact: Contact) => void;
	closeModal?: () => void;
}

// TODO: Write appropriate types
interface FaramValues {
	name?: string | null;
	position?: string | null;
	email?: string | null;
	image?: File | null;
	workNumber?: string | null;
	mobileNumber?: string | null;
	isDrrFocalPerson?: boolean | null;
	organization?: number | null;
	committee?: Contact["committee"] | null;
	stepwiseRegion?: RegionValuesAlt | null;
	communityAddress?: string | null;
	location?: ReturnType<typeof getLocationDetails> | null;
}

interface FaramErrors {}

interface State {
	faramValues: FaramValues;
	faramErrors: FaramErrors;
	pristine: boolean;
	organizationList?: Organization[];
}

interface Params {
	body?: FaramValues;
	setPristine?: (pristine: boolean) => void;
	setOrganizationList?: (organizationList: Organization[]) => void;
	setFaramErrors?: (error: object) => void;
}

type Props = NewProps<OwnProps, Params>;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
	municipalityContactEditRequest: {
		url: ({ props }) => `/municipality-contact/${props.contactId}/`,
		method: methods.PATCH,
		body: ({ params }) => params && params.body,
		query: {
			expand: ["trainings", "organization"],
		},
		onSuccess: ({ response, props, params }) => {
			const editedContact = response as Contact;
			const { contactId, onEditSuccess } = props;
			if (onEditSuccess && contactId) {
				onEditSuccess(contactId, editedContact);
			}
			if (params && params.setPristine) {
				params.setPristine(true);
			}
		},
		onFailure: ({ error, params }) => {
			if (params && params.setFaramErrors) {
				// TODO: handle error
				console.warn("failure", error);
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
		onFatal: ({ params }) => {
			if (params && params.setFaramErrors) {
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
		extras: { hasFile: true },
	},
	municipalityContactAddRequest: {
		url: "/municipality-contact/",
		method: methods.POST,
		body: ({ params }) => params && params.body,
		query: {
			expand: ["trainings", "organization"],
		},
		onSuccess: ({ response, props }) => {
			const editedContact = response as Contact;
			const { onAddSuccess, closeModal } = props;
			if (onAddSuccess) {
				onAddSuccess(editedContact);
			}
			if (closeModal) {
				closeModal();
			}
		},
		onFailure: ({ error, params }) => {
			if (params && params.setFaramErrors) {
				// TODO: handle error
				console.warn("failure", error);
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
		onFatal: ({ params }) => {
			if (params && params.setFaramErrors) {
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
		extras: { hasFile: true },
	},
	organizationGetRequest: {
		url: "/organization/",
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, params }) => {
			const organizationList = response as MultiResponse<Organization>;

			if (params && params.setOrganizationList) {
				params.setOrganizationList(organizationList.results);
			}
		},
	},
};
const sidepanelLogo = [
	{
		name: "Education",
		image: education,
	},
	{
		name: "Banking & Finance",
		image: finance,
	},
	{
		name: "Culture",
		image: cultural,
	},
	{
		name: "Hotel & Restaurant",
		image: hotelandrestaurant,
	},
	{
		name: "Governance",
		image: governance,
	},
	{
		name: "Health",
		image: health,
	},
	{
		name: "Transportation",
		image: transportation,
	},
	{
		name: "Airway",
		image: airway,
	},
	{
		name: "Waterway",
		image: waterway,
	},
	{
		name: "Roadway",
		image: roadway,
	},
	{
		name: "Industry",
		image: industry,
	},
	{
		name: "Communication",
		image: communication,
	},
	{
		name: "Bridge",
		image: bridge,
	},
	{
		name: "Roadway",
		image: bridge,
	},
	{
		name: "Waterway",
		image: bridge,
	},
	{
		name: "Airway",
		image: bridge,
	},
	{
		name: "Helipad",
		image: helipad,
	},
	{
		name: "Electricity",
		image: electricity,
	},
	{
		name: "Fire Fighting Apparatus",
		image: firefightingApp,
	},
	{
		name: "Fire Engine",
		image: firefightingApp,
	},
	{
		name: "Sanitation Service",
		image: sanitationService,
	},
	{
		name: "Water Supply Infrastructure",
		image: watersupply,
	},
	{
		name: "Humanitarian Open Space",
		image: openspace,
	},
	{
		name: "Community Space",
		image: openspace,
	},
	{
		name: "Evacuation Centre",
		image: evacuationCentre,
	},
	{
		name: "Godam",
		image: evacuationCentre,
	},
];
// const data = [
//     {
//         label: 'Pri Primary',
//         value: 4000,
//         color: '#216CD7',

//     },
//     {
//         label: 'Basic Education',
//         value: 3000,
//         color: '#216CD7',

//     },
//     {
//         label: 'High School',
//         value: 2000,
//         color: '#216CD7',

//     },
//     {
//         label: 'College',
//         value: 2780,
//         color: '#216CD7',

//     },
//     {
//         label: 'University',
//         value: 1890,
//         color: '#216CD7',

//     },
//     {
//         label: 'Traditional Education',
//         value: 2390,
//         color: '#216CD7',

//     },

// ];
const visualizationKeyValues = [
	{
		resourceType: "education",
		visualizationHeading: "Education Institution",
		visualizationHeadingNe: "शैक्षिक संस्था",
		chartDataType: [
			{
				label: "Education Institution Types",
				labelNe: "शैक्षिक संस्था",
				key: "type",
				values: [
					"Preprimary",
					"Basic Education",
					"High School",
					"College",
					"University",
					"Traditional Education",
					"Library",
					"Other",
				],
				valuesNe: [
					"पूर्व-प्राथमिक विद्यालय",
					"आधारभूत शैक्षिक संस्था",
					"उच्च माध्यमिक विद्यालय",
					"कलेज",
					"विश्वविद्यालय",
					"परम्परागत शिक्षा",
					"पुस्तकालय",
					"अन्य",
				],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Education Institutions",
				visualizationWordStartNe: "शैक्षिक संस्थाको संख्या छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Operator Type",
				labelNe: "अपरेटरको प्रकार",
				key: "operatorType",
				values: ["Government", "Private", "Community", "Other"],
				valuesNe: ["सरकार", "निजी", "समुदायीक ", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Education Institutions are ",
				visualizationWordStartNe: "शैक्षिक संस्थाहरु ",
				visualizationWordEnd: " Run",
				visualizationWordEndNe: "तहबाट संचालित छन्",
			},
			{
				label: "Education Institution With",
				labelNe: "शैक्षिक संस्था संग",
				key: ["hasOpenSpace", "hasEvacuationRoute", "hasHealthCenterPsychoCounseling"],
				values: ["Open space", "Evacuation route available", "Health center/psycho counseling"],
				valuesNe: ["खुला स्थान ", "Evacuation  मार्ग", "स्वास्थ्य केन्द्र/ काउन्सिलिङ केन्द्र"],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "",
				visualizationWordStartNe: "",
				visualizationWordEnd: " are Available ",
				visualizationWordEndNe: " को सुविधा उपलब्ध छन् ",
			},
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारी छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Number of Students",
				labelNe: "विद्यार्थी संख्या",
				key: ["noOfMaleStudent", "noOfFemaleStudent", "noOfOtherStudent"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Students ",
				visualizationWordStartNe: "विद्यार्थी छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Students",
				labelNe: "फरक क्षमता भएका विद्यार्थीहरू",
				key: [
					"noOfDifferentlyAbledMaleStudents",
					"noOfDifferentlyAbledFemaleStudents",
					"noOfDifferentlyAbledOtherStudents",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Students ",
				visualizationWordStartNe: "फरक क्षमता भएका विद्यार्थीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "finance",
		visualizationHeading: "Banking and Finance Institution",
		visualizationHeadingNe: "बैंकिङ तथा वित्तय  संस्था",
		chartDataType: [
			{
				label: "Banking & Financial Institution Types",
				labelNe: "बैंकिङ तथा वित्तीय संस्थाहरू",
				key: "type",
				values: [
					"Commercial",
					"Micro Credit Development",
					"Finance",
					"Development Bank",
					"Cooperative",
					"Money Exchange",
					"ATM",
				],
				valuesNe: [
					"वाणिज्यि बैंक",
					"माइक्रो क्रेडिट विकास बैंक",
					"वित्तय  संस्था",
					"विकास बैंक",
					"सहकारी संस्था ",
					"मनी एक्सचेन्ज",
					"एटीएम",
				],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Banking and Financial Institutions ",
				visualizationWordStartNe: "बैंकिङ तथा वित्तीय संस्थाहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Operator Type",
				labelNe: "अपरेटर प्रकार",
				key: "operatorType",
				values: ["Government", "Private", "Community", "Other"],
				valuesNe: ["सरकार", "निजी ", "समुदायीक ", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Banking and Financial Institutions are ",
				visualizationWordStartNe: "बैंकिङ तथा वित्तीय संस्थाहरू ",
				visualizationWordEnd: " Run",
				visualizationWordEndNe: " तहबाट संचालित छन् ",
			},

			// {

			//     label: 'Services Available',

			//     labelNe: 'उपलब्ध सेवाहरू',

			//     key: ['bank', 'moneyExchange', 'atm', 'hasOtherServices'],

			//     values: ['Bank', 'Money Exchange', 'ATM', 'Other Services'],

			//     valuesNe: ['बैंक', 'मनी एक्सचेन्ज', 'एटीएम', 'अन्य सेवाहरू'],

			//     isBoolean: true,

			//     visualizationKey: 'highestValue',

			//     visualizationWordStart: 'Banking and Financial institutions are ',

			//     visualizationWordEnd: 'run',

			// },

			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारी छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "communication",
		visualizationHeading: "Communication Institution",
		visualizationHeadingNe: "सञ्चार संस्था",
		chartDataType: [
			{
				label: "Communication Facility Types",
				labelNe: "सञ्चार संस्थाका प्रकारहरू",
				key: "type",
				values: [
					"FM Radio",
					"TV Station",
					"Newspapers",
					"Phone Service",
					"Cable",
					"Online Media",
					"Internet Service Provider",
				],
				valuesNe: [
					"एफएम रेडियो",
					"टिभी स्टेशन",
					"न्युजपेपर",
					"फोन सेवा",
					"केबल",
					"अनलाइन मिडिया",
					"इन्टरनेट सेवा प्रदायक",
				],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Communication Facilities ",
				visualizationWordStartNe: "सञ्चार सुविधा उपलब्ध छ  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Operator Type",
				labelNe: "अपरेटर प्रकार",
				key: "operatorType",
				values: ["Government", "Private", "Community", "Other"],
				valuesNe: ["सरकारी", "निजी", "समुदाय", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Communication Facilities are ",
				visualizationWordStartNe: "सञ्चार सुविधा ",
				visualizationWordEnd: " Run",
				visualizationWordEndNe: " तह बाट संचालनमा छन् ",
			},
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Disaster Management",
				labelNe: "विपद् व्यवस्थापन",
				key: "hasEvacuationRoute",
				values: ["Evacuation route"],
				valuesNe: ["Evacuation  मार्ग"],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Institution have Evacuation Route ",
				visualizationWordStartNe: "सुशासन संस्थामा Evacuation मार्ग छ ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "governance",
		visualizationHeading: "Government Institution",
		visualizationHeadingNe: "सुशासन संस्था",
		chartDataType: [
			{
				label: "Government Institution Types",
				labelNe: "सुशासन संस्थाका प्रकारहरू",
				key: "type",
				values: ["Government", "INGO", "NGO", "CSO", "Other"],
				valuesNe: [
					"सरकार",
					"अन्तर्राष्ट्रिय गैर सरकारी संस्था",
					"गैर सरकारी संस्था",
					"सिएसवो",
					"अन्य",
				],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Governance Institutions ",
				visualizationWordStartNe: "सुशासन संस्था छन्  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Operator Type",
				labelNe: "अपरेटर प्रकार",
				key: "operatorType",
				values: ["Government", "Private", "Community", "Other"],
				valuesNe: ["सरकारी", "निजी", "समुदायीक ", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestVaue",
				visualizationWordStart: "Institutions are ",
				visualizationWordStartNe: "संस्थाहरु  ",
				visualizationWordEnd: " Run",
				visualizationWordEndNe: " तहबाट संचालनमा छन् ",
			},
			// {
			//     label: 'Helipad ',
			//     labelNe: 'हेलिप्याड',
			//     key: 'hasHelipad',
			//     values: ['Helipad '],
			//     valuesNe: ['हेलिप्याड'],
			//     isBoolean: true,
			//     visualizationKey: 'total',
			//     visualizationWordStart: 'Number of governance institutions ',
			//     visualizationWordEnd: '',
			// },
			// {
			//     label: 'Open Space ',
			//     labelNe: 'खुल्‍ला स्थान',
			//     key: 'hasOpenSpace',
			//     values: ['Open Space '],
			//     valuesNe: ['खुल्‍ला स्थान'],
			//     isBoolean: true,
			// },
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Governance Institutions with ",
				labelNe: "सुशासन संस्थाहरु संग",
				key: ["hasHelipad", "hasOpenSpace", "hasEvacuationRoute", "hasDisasterMgmtUnit"],
				values: ["Helipad", "Open space", "Evacuation route", "Have disaster management unit"],
				valuesNe: ["हेलिप्याड", "खुला स्थान ", "Evacuation मार्ग", "विपद् व्यवस्थापन इकाईक "],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Governance Institutions with ",
				visualizationWordStartNe: "सुशासन संस्थाहरु संग ",
				visualizationWordEnd: " available",
				visualizationWordEndNe: " को सुविधा  उपलब्ध छ ",
			},
		],
	},
	{
		resourceType: "hotelandrestaurant",
		visualizationHeading: "Hotel & Restaurant",
		visualizationHeadingNe: "होटल तथा  रेस्टुरेन्ट",
		chartDataType: [
			{
				label: "Hospitality",
				labelNe: "आतिथ्य",
				key: "type",
				values: ["Hotel", "Restaurant", "Lodge", "Resort", "Homestay"],
				valuesNe: ["होटेल", "रेष्टुरेन्ट", "लज", "रिसोर्ट", "होमस्टे"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Hotel and Restaurants ",
				visualizationWordStartNe: "होटल तथा  रेस्टुरेन्ट छन्  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Number of Employees",
				labelNe: "कर्मचारीहरूको संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारीहरू छन्  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Hotel and Restaurants With",
				labelNe: "होटल तथा  रेस्टुरेन्ट संग",
				key: ["noOfRoom", "noOfBed"],
				values: ["Rooms Available", "Beds Available"],
				valuesNe: ["कोठा उपलब्ध छ", "बेडहरू उपलब्ध छन्"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "",
				visualizationWordStartNe: "",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "cultural",
		visualizationHeading: "Cultural Sites",
		visualizationHeadingNe: "सांस्कृतिक साइटहरू",
		chartDataType: [
			{
				label: "Cultural Site Types",
				labelNe: "सांस्कृतिक स्थान  प्रकारहरू",
				key: "religion",
				values: ["Hindu", "Islam", "Christian", "Buddhist", "Kirat", "Sikhism", "Judaism", "Other"],
				valuesNe: ["हिन्दू", "इस्लाम", "क्रिस्चियन", "बौद्ध", "किरात", "सिख", "यहूदी", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Cultural Sites ",
				visualizationWordStartNe: "सांस्कृतिक स्थानहरु छन्  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Cultural Site With ",
				labelNe: "सांस्कृतिक स्थान  संग",
				key: [
					"hasOpenSpace",
					"drinkingWater",
					"toilet",
					"hasWashFacility",
					"hasSleepingFacility",
					"hasElectricity",
				],
				values: [
					"Open Space",
					"Drinking Water",
					"Toilet",
					"WASH facilities",
					"Sleeping facilities",
					"Electricity facilities",
				],
				valuesNe: ["खुला ठाउँ", "पिउने पानी", "शौचालय", "धुने ", "सुत्ने", "बिजुली "],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Cultural Sites with ",
				visualizationWordStartNe: "सांस्कृतिक स्थानमा  ",
				visualizationWordEnd: " Available",
				visualizationWordEndNe: " को सुबिधा उपलब्ध छ ",
			},
			// {
			//     label: 'Open Space ',
			//     key: 'hasOpenSpace',
			//     values: ['Open Space '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Drinking Water Available ',
			//     key: 'drinkingWater',
			//     values: ['Drinking Water '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Toilet Available ',
			//     key: 'toilet',
			//     values: ['Toilet '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Wash Facility Available ',
			//     key: 'hasWashFacility',
			//     values: ['Wash Facility '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Sleeping Facility Available ',
			//     key: 'hasSleepingFacility',
			//     values: ['Sleeping Facility '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Electricity Facility Available ',
			//     key: 'hasElectricity',
			//     values: ['Electricity Facility '],
			//     isBoolean: true,
			// },
		],
	},
	{
		resourceType: "industry",
		visualizationHeading: "Industries",
		visualizationHeadingNe: "उद्योगहरू",
		chartDataType: [
			{
				label: "Industry Types",
				labelNe: "उद्योगका प्रकारहरू",
				key: "subtype",
				values: [
					"Cottage Industry",
					"Micro Industry",
					"Small Industry",
					"Medium Industry",
					"Large Industry",
					"Other",
				],
				valuesNe: [
					"घरेलु उद्योग",
					"माइक्रो उद्योग",
					"साना उद्योग",
					"मध्यम उद्योग",
					"ठूला उद्योग",
					"अन्य",
				],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Industries ",
				visualizationWordStartNe: "उद्योगहरु छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Operator Type",
				labelNe: "अपरेटर प्रकार",
				key: "operatorType",
				values: ["Government", "Private", "Community", "Other"],
				valuesNe: ["सरकारी", "निजी", "समुदायीक", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Industries are ",
				visualizationWordStartNe: "उद्योगहरु",
				visualizationWordEnd: " Run",
				visualizationWordEndNe: "  तहबाट संचालनमा छन् ",
			},
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Industries with  ",
				labelNe: "उद्योगहरु संग ",
				key: "hasEvacuationRoute",
				values: ["Evacuation route"],
				valuesNe: ["Evacuation मार्ग"],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Industries have Evacuation Route ",
				visualizationWordStartNe: "उद्योगहरु संग Evacuation मार्ग उपलब्ध छ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "bridge",
		visualizationHeading: "Bridges",
		visualizationHeadingNe: "पुल",
		chartDataType: [
			{
				label: "Bridge Types",
				labelNe: "पुलका प्रकार",
				key: "type",
				values: [
					"Arch Bridge",
					"Beam Bridge",
					"Cantilever Bridge",
					"Wooden Bridge",
					"Suspension Bridge",
					"Cable-stayed Bridge",
					"Culvert Bridge",
					"Bailey Bridge",
					"Truss Bridge",
					"Other",
				],
				valuesNe: [
					"आर्क पुल",
					"बीम पुल",
					"केन्टिलिभर पुल",
					"काठे पुल",
					"सस्पेन्सन पुल",
					"केबल-स्टेड पुल",
					"कलभर्ट पुल",
					"बेली पुल",
					"ट्रस पुल",
					"अन्य",
				],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Bridges ",
				visualizationWordStartNe: "पुलहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			// {
			//     label: 'Operator Type',
			//     key: 'operatorType',
			//     values: ['Government', 'Private', 'Community', 'Other'],
			//     isBoolean: false,
			//     showFalseValue: false,
			// },
			{
				label: "Motorable Bridge ",
				labelNe: ["मोटरेबल ब्रिज"],
				key: ["isMotorable"],
				values: ["Motorable Bridge"],
				valuesNe: ["मोटरेबल ब्रिज"],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Motorable Bridges ",
				visualizationWordStartNe: "मोटरेबल पुलहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Condition of the Bridge",
				labelNe: "पुलको अवस्था",
				key: "condition",
				values: ["Good", "Bad"],
				valuesNe: ["राम्रो", "नराम्रो"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Bridges in ",
				visualizationWordStartNe: "पुल संग ",
				visualizationWordEnd: " Condition",
				visualizationWordEndNe: " अवस्था",
			},
		],
	},
	{
		resourceType: "electricity",
		visualizationHeading: "Electricity",
		visualizationHeadingNe: "बिजुली",
		chartDataType: [
			{
				label: "Hydropower/Components",
				labelNe: "जलविद्युत/कम्पोनेन्टहरू",
				key: "components",
				values: ["Hydropower", "Substation", "Dam", "Transmission Pole", "Other"],
				valuesNe: ["जलविद्युत", "सबस्टेशन", "बाँध", "ट्रान्समिशन पोल", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "",
				visualizationWordStartNe: "",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Status",
				labelNe: "स्थिति",
				key: "status",
				values: ["Operational ", "Under construction", "Survey"],
				valuesNe: ["संचालनमा रहेको ", "निर्माणाधीन", "सर्वेक्षण कार्य हुदै गरेको  "],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Hydropower/Components are ",
				visualizationWordStartNe: "जलविद्युत/कम्पोनेन्टहरू छन्  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "sanitation",
		visualizationHeading: "Sanitation Service",
		visualizationHeadingNe: "सरसफाई सेवा",
		chartDataType: [
			{
				label: "Sanitation Infrastructure Types",
				labelNe: "सरसफाई पूर्वाधारको प्रकार",
				key: "type",
				values: ["Landfill", "Dumping Site", "Public Toilet"],
				valuesNe: ["ल्याण्डफिल साइट", "डम्पिङ साइट", "सार्वजनिक शौचालय"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Sanitation Infrastructures",
				visualizationWordStartNe: "सरसफाइ पूर्वाधारहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Permanent Infrastructures",
				labelNe: "स्थायी पूर्वाधारहरू",
				key: "type",
				values: ["Landfill", "Dumping Site"],
				valuesNe: ["ल्याण्डफिल साइट", "डम्पिङ साइट"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "",
				visualizationWordStartNe: "",
				visualizationWordEnd: " are Permanent",
				visualizationWordEndNe: " स्थायी छन्",
			},
			{
				label: "Public Toilets",
				labelNe: "सार्वजनिक शौचालय",
				key: ["noOfMaleToilets", "noOfFemaleToilets", "noOfCommonToilets"],
				values: ["Male Toilet", "Female Toilet", "Common Toilet"],
				valuesNe: ["पुरुष शौचालय", "महिला शौचालय", "साझा  शौचालय"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Public Toilets Available",
				visualizationWordStartNe: "शौचालय उपलब्ध छ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			// {
			//     label: 'Permanent Landfill',
			//     key: ['isPermanent'],
			//     values: ['Permanent Landfill '],
			//     isBoolean: true,
			// },
		],
	},
	{
		resourceType: "openspace",
		visualizationHeading: "Open Space",
		visualizationHeadingNe: "खुल्‍ला स्थान",
		chartDataType: [
			{
				label: "Open Space Area Details(Sq Km)",
				labelNe: "खुला क्षेत्र विवरण (वर्ग किलोमिटर)",
				key: ["totalArea", "usableArea", "usableAreaSecond"],
				values: ["Total Area", "Usable Area", "Alternate Usable Area"],
				valuesNe: ["कुल क्षेत्र", "प्रयोगयोग्य क्षेत्र", "वैकल्पिक प्रयोगयोग्य क्षेत्र"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of sanitation infrastructures",
				visualizationWordStartNe: "सरसफाई सुबिधा छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "communityspace",
		visualizationHeading: "Community Space",
		visualizationHeadingNe: "सामुदायिक स्थान",
		chartDataType: [
			// {
			//     label: 'Community Space Area Details(Sq Km)',
			//     key: ['capacity'],
			//     values: ['Capacity of Community Space'],
			//     isBoolean: false,
			//     visualizationKey: 'total',
			//     visualizationWordStart: 'Number of sanitation infrastructures',
			//     visualizationWordEnd: '',
			// },
			{
				label: "Number of Community Spaces",
				labelNe: "सामुदायिक स्थानहरूको संख्या",
				key: "resourceType",
				values: ["communityspace"],
				valuesNe: ["सामुदायिक स्थान"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Community Spaces",
				visualizationWordStartNe: "सामुदायिक स्थानहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Community Space With",
				labelNe: "सामुदायिकसा स्थान  संग",
				key: ["usedAsHelipad", "isDrinkingWaterAvailable", "isToiletAvailable"],
				values: ["Emergency Landing", "Drinking water facility", "Toilet"],
				valuesNe: ["इमर्जेन्सी ल्यान्डिङ स्थान ", "पिउने पानीको सुविधा", "शौचालयको सुविधा "],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Community Space with ",
				visualizationWordStartNe: "सामुदायिकसा स्थान  संग",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "watersupply",
		visualizationHeading: "Water Supply Infrastructure",
		visualizationHeadingNe: "खाने पानी आपूर्ति आयोजना",
		chartDataType: [
			{
				label: "Water Supply Infrastructure Scales",
				labelNe: "खाने पानी आपूर्ति आयोजनाको  स्केल",
				key: "scale",
				values: ["Small", "Medium", "Large"],
				valuesNe: ["साना", "मध्यम", "ठूलो"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Water Supply Infrastructures",
				visualizationWordStartNe: "खाने पानी आपूर्ति आयोजना छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Operator Type",
				labelNe: "अपरेटर प्रकार",
				key: "operatorType",
				values: ["Government", "Private", "Community", "Other"],
				valuesNe: ["सरकारी", "निजी", "समुदाय", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Water supply Infrastructures are ",
				visualizationWordStartNe: "खाने पानी पूर्वाधार",
				visualizationWordEnd: " Run",
				visualizationWordEndNe: "छन्",
			},
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees",
				visualizationWordStartNe: "कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Water Supply Infrastructure",
				labelNe: "पानी आपूर्ति पूर्वाधार",
				key: "isWaterSupplyOperational",
				values: ["Operational", "Not operational"],
				valuesNe: ["परिचालन", "परिचालन छैन"],
				isBoolean: true,
				showFalseValue: true,
				visualizationKey: "highestValue",
				visualizationWordStart: "Water supply Infrastructures are ",
				visualizationWordStartNe: "खाने पानी पूर्वाधार",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			// {
			//     label: 'Technical Staff',
			//     key: ['hasTechnicalStaff'],
			//     values: ['Technical Staff '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Operational Water Supply Infrastructure',
			//     key: ['isWaterSupplyOperational'],
			//     values: ['Operational Water Supply Infrastructure '],
			//     isBoolean: true,
			// },
		],
	},
	{
		resourceType: "roadway",
		visualizationHeading: "Roadways",
		visualizationHeadingNe: "सडक मार्गहरू",
		chartDataType: [
			{
				label: "Vehicle Types",
				labelNe: "गाडीका प्रकार",
				key: "kindOfVehicle",
				values: ["Bus", "Micro", "Van", "Other"],
				valuesNe: ["बस", "माइक्रो", "भ्यान", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Vehicles",
				visualizationWordStartNe: "सवारी साधन छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees",
				visualizationWordStartNe: "कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "helipad",
		visualizationHeading: "Helipad",
		visualizationHeadingNe: "हेलिप्याड",
		chartDataType: [
			{
				label: "Helipad",
				labelNe: "हेलिप्याड",
				key: "ownership",
				values: [
					"Civil Aviation Authority of Nepal",
					"Nepal Army",
					"Nepal Police",
					"Armed Police Force",
					"Other",
				],
				valuesNe: [
					"नेपाल नागरिक उड्डयन प्राधिकरण",
					"नेपाली सेना",
					"नेपाल प्रहरी",
					"सशस्त्र प्रहरी बल",
					"अन्य",
				],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Helipad",
				visualizationWordStartNe: "हेलिप्याड सुबिधा छ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Surface Type of Helipad",
				labelNe: "हेलिप्याडको सतह प्रकार",
				key: "surfaceType",
				values: ["Concrete", "Grass land", "Dirt surface", "Other"],
				valuesNe: ["कंक्रिट", "घाँसे मैदान", "माटोको सतह", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Helipads have ",
				visualizationWordStartNe: "हेलिप्याड संग ",
				visualizationWordEnd: " Surface",
				visualizationWordEndNe: " सतह छ",
			},
			{
				label: "Helipad with ",
				labelNe: "हेलिप्याड संग",
				key: [
					"hasRoadAccess",
					"storageFacilityAvailable",
					"internetFacilityAvailable",
					"windDirectionIndicatorAvailable",
					"heliMarkerAvailable",
					"nightLightingAvailable",
				],
				values: [
					"Road access",
					"Storage facility",
					"Internet service",
					"Wind direction indicator",
					"Heli marker",
					"Night lighting",
				],
				valuesNe: [
					"सडकको  पहुँच",
					"भण्डारण सुविधा",
					"इन्टरनेट सेवा",
					"हावाको दिशा मापक सूचक",
					"हेली मार्कर",
					"रात्रि प्रकाश सुबिधा",
				],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Helipads have ",
				visualizationWordStartNe: "हेलिप्याड संग",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Condition of Helipad",
				labelNe: "हेलिप्याडको अवस्था",
				key: "helipadCondition",
				values: ["Operational", "Need Repair", "Not in working condition"],
				valuesNe: ["संचालनमा रहेको ", "रिपेयर आवश्यक छ", "काम गर्ने अवस्थामा नभएको"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Helipads are ",
				visualizationWordStartNe: "हेलिप्याड छन्  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			// {
			//     label: 'Wind Direction Indicator Available',
			//     key: 'windDirectionIndicatorAvailable',
			//     values: ['Wind Direction Indicator Available'],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Heli Marker Available ',
			//     key: 'heliMarkerAvailable',
			//     values: ['Heli Marker Available '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Night Lighting Available',
			//     key: 'nightLightingAvailable',
			//     values: ['Night Lighting Available'],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Number of Employees',
			//     key: ['noOfMaleEmployee', 'noOfFemaleEmployee', 'noOfOtherEmployee'],
			//     values: ['Male', 'Female', 'Other'],
			//     isBoolean: false,
			// },
			// {
			//     label: 'Employees with Disability',
			//     key: ['noOfDifferentlyAbledMaleEmployees', 'noOfDifferentlyAbledFemaleEmployees', 'noOfDifferentlyAbledOtherEmployees'],
			//     values: ['Male', 'Female', 'Other'],
			//     isBoolean: false,
			// },
		],
	},
	{
		resourceType: "waterway",
		visualizationHeading: "Waterway",
		visualizationHeadingNe: "जलमार्ग",
		chartDataType: [
			{
				label: "Waterway Types",
				labelNe: "जलमार्गका प्रकार",
				key: "type",
				values: ["General Boat", "Electrical Boat", "Other"],
				valuesNe: ["सामान्य डुङ्गा", "विद्युतीय डुङ्गा", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Waterways ",
				visualizationWordStartNe: "जलमार्गको छ  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारीहरू छन्",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Condition of Boat",
				labelNe: "डुङ्गाको अवस्था",
				key: "condition",
				values: ["Good", "Bad"],
				valuesNe: ["राम्रो", "नराम्रो"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Waterways in ",
				visualizationWordStartNe: "जलमार्गको  ",
				visualizationWordEnd: " Condition ",
				visualizationWordEndNe: "अवस्था ",
			},
		],
	},
	{
		resourceType: "airway",
		visualizationHeading: "Airway",
		visualizationHeadingNe: "वायुमार्ग",
		chartDataType: [
			{
				label: "Airway Types",
				labelNe: "हवाई सेवाका प्रकार ",
				key: "type",
				values: ["National", "International"],
				valuesNe: ["राष्ट्रिय", "अन्तर्राष्ट्रिय"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Airways ",
				visualizationWordStartNe: "हवाई सेवा  छ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Airways with  ",
				labelNe: "हवाई सेवा  संग",
				key: ["hasEvacuationRoute", "hasHumanitarianStagingArea"],
				values: ["Evacuation route", "Humanitarian staging area"],
				valuesNe: ["Evacuation मार्ग", "मानवीय सहायता स्थल "],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Airways with ",
				visualizationWordStartNe: "हवाई सेवा  संग ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
		],
	},
	{
		resourceType: "fireengine",
		visualizationHeading: "Fire Engine",
		visualizationHeadingNe: "दमकल",
		chartDataType: [
			{
				label: "Condition of fire engine",
				labelNe: "दमकलको अवस्था",
				key: "condition",
				values: ["Operational", "Need Repair", "Not in working condition"],
				valuesNe: ["सञ्चालन रहेको ", "मरम्मत आवश्यक रहेको ", "काम गर्ने अवस्थामा नभएको "],
				isBoolean: false,
			},
		],
	},
	{
		resourceType: "firefightingapparatus",
		visualizationHeading: "Fire Fighting Apparatus",
		visualizationHeadingNe: "आगो नियनत्रण उपकरण",
		chartDataType: [
			{
				label: "Fire Fighting Apparatus Types",
				labelNe: "आगो निभाउने उपकरणको प्रकार",
				key: "typeOfApparatus",
				values: ["Fire Engine", "Fire Bike", "Other"],
				valuesNe: ["दमकल", "फायर बाइक", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Fire Fighting Apparatus ",
				visualizationWordStartNe: "आगो निभाउने उपकरण छ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Condition of fire fighting apparatus",
				labelNe: "आगो निभाउने उपकरण को  अवस्था",
				key: "condition",
				values: ["Operational", "Need Repair", "Not in working condition"],
				valuesNe: ["संचालनमा रहेको", "मरम्मत गर्न  आवश्यक रहेको", "काम गर्ने अवस्थामा  नभएको"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Fire Fighting Apparatus are ",
				visualizationWordStartNe: "आगो निभाउने उपकरण  छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Operator Type of fire fighting apparatus",
				labelNe: "आगो नियन्त्रक उपकरणको अपरेटर प्रकार",
				key: "operatorType",
				values: ["Private", "Government", "Community"],
				valuesNe: ["निजी", "सरकारी", "समुदायीक "],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Fire Fighting Apparatus are ",
				visualizationWordStartNe: "आगो निभाउने उपकरण ",
				visualizationWordEnd: " Run",
				visualizationWordEndNe: " क्षेत्रबाट संचालनमा छन् ",
			},
		],
	},
	{
		resourceType: "evacuationcentre",
		visualizationHeading: "Evacuation Center",
		visualizationHeadingNe: "Evacuation केन्द्र",
		chartDataType: [
			{
				label: "Evacuation Centers",
				labelNe: "Evacuation केन्द्रहरू",
				key: "operatedBy",
				values: ["Government", "INGO", "NGO", "CSO"],
				valuesNe: ["सरकार", "अन्तर्राष्ट्रिय गैर सरकारी संस्था", "गैर सरकारी संस्था", "सामुदायिक "],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Evacuation Centers ",
				visualizationWordStartNe: "Evacuation केन्द्र ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Structure",
				labelNe: "संरचना",
				key: "structure",
				values: ["Single story", "Multiple story"],
				valuesNe: ["एक तले", "बहु तले"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Evacuation Centers are ",
				visualizationWordStartNe: "Evacuation केन्द्र छन्  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Capacity of Evacuation Center",
				labelNe: " Evacuation केन्द्रको क्षमता",
				key: ["capacity"],
				values: ["Capacity"],
				valuesNe: ["क्षमता"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Maximum Capacity  ",
				visualizationWordStartNe: "Maximum Capacity  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Evacuation Center With  ",
				labelNe: "Evacuation केन्द्रमा ",
				key: [
					"hasEvacuationRoute",
					"hasDrinkingWater",
					"hasToilet",
					"hasHandWashingFacility",
					"hasFoodPreparationFacility",
					"hasSleepingFacility",
				],
				values: [
					"Evacuation Route",
					"Drinking Water",
					"Toilet",
					"Wash Facility",
					"Food Preparation Facility",
					"Sleeping Facility",
				],
				valuesNe: [
					"Evacuation मार्ग",
					"पिउने पानीको ",
					"शौचालयको सुविधा",
					"धुने सुविधा",
					"खाना तयारी गर्ने सुविधा",
					"सुत्ने सुविधा",
				],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "",
				visualizationWordStartNe: "",
				visualizationWordEnd: " are Available ",
				visualizationWordEndNe: " उपलब्ध छ ",
			},
			// {
			//     label: 'Drinking Water Available ',
			//     key: 'hasDrinkingWater',
			//     values: ['Drinking Water '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Toilet Available ',
			//     key: 'hasToilet',
			//     values: ['Toilet '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Wash Facility Available ',
			//     key: 'hasHandWashingFacility',
			//     values: ['Wash Facility '],
			//     isBoolean: true,
			// },
			// {
			//     label: 'Sleeping Facility Available ',
			//     key: 'hasSleepingFacility',
			//     values: ['Sleeping Facility '],
			//     isBoolean: true,
			// },
		],
	},
	{
		resourceType: "health",
		visualizationHeading: "Health Institution Category",
		visualizationHeadingNe: "स्वास्थ्य संस्था श्रेणी",
		chartDataType: [
			{
				label: "Health Infrastructure Types",
				key: "type",
				values: [
					"Specialized Hospital",
					"Center Hospital",
					"Teaching Hospital",
					"Regional Hospital",
					"Sub Regional Hospital",
					"Zonal Hospital",
					"District Hospital",
					"Basic Hospital",
					"General Hospital",
					"Primary Health Care Center",
					"Health Post",
					"District Clinic (Including Institutional)",
					"Urban Health Center",
					"Community Health Unit",
					"Poly Clinic",
					"Clinic",
					"Dental Clinic",
					"Diagnostic Center",
					"Nursing Home",
					"Rehabilitation",
					"Ayurveda Hospital",
					"Zonal Ayurveda Aushadhalaya",
					"District Ayurveda Health Center",
					"Ayurveda Aushadhalaya",
					"Homeopathy Hospital",
					"Unani Hospital",
					"Primary Hospital",
					"Secondary A Hospital",
					"Secondary B Hospital",
					"Tertiary Hospital",
					"Super Specialized Hospital",
					"Basic Health Care Center",
					"Veterinary",
					"Pathology",
					"Pharmacy",
					"Other",
				],
				valuesNe: [
					"विशेष अस्पताल",
					"केन्द्र अस्पताल",
					"शिक्षण अस्पताल",
					"क्षेत्रीय अस्पताल",
					"उपक्षेत्रीय अस्पताल",
					"अञ्चल अस्पताल",
					"जिल्ला अस्पताल",
					"आधारभूत अस्पताल",
					"सामान्य अस्पताल",
					"प्राथमिक स्वास्थ्य सेवा केन्द्र",
					"स्वास्थ्य पोस्ट",
					"जिल्ला क्लिनिक (संस्थागत सहित)",
					"शहरी स्वास्थ्य केन्द्र",
					"सामुदायिक स्वास्थ्य इकाई",
					"पोली क्लिनिक",
					"क्लिनिक",
					"डेन्टल क्लिनिक",
					"डायग्नोस्टिक सेन्टर",
					"नर्सिङ होम",
					"पुनर्वास",
					"आयुर्वेद अस्पताल",
					"क्षेत्रीय आयुर्वेद औषधालय",
					"जिला आयुर्वेद स्वास्थ्य केन्द्र",
					"आयुर्वेद औषधालय",
					"होमियोप्याथी अस्पताल",
					"युनानी अस्पताल",
					"प्राथमिक अस्पताल",
					"सेकेन्डरी ए अस्पताल",
					"सेकेन्डरी बी अस्पताल",
					"टर्टियरी अस्पताल",
					"सुपर स्पेशलाइज्ड अस्पताल",
					"आधारभूत स्वास्थ्य सेवा केन्द्र",
					"भेटेनरी",
					"प्याथोलोजी",
					"फार्मेसी",
					"अन्य",
				],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Health Infrastructures ",
				visualizationWordStartNe: "स्वास्थ्य पूर्वाधारहरू उपलब्ध छन्  ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			// {
			//   label: 'Services Available',
			//     key: ['hasChildImmunization', 'hasTdVaccination', 'hasImnci', 'hasGrowthMonitoring', 'hasSafeMotherhood',
			//         'familyPlanning', 'hasOpd', 'hasTreatementOfTb', 'hasTreatementOfMdrTb', 'hasTreatementOfLeprosy',
			//         'hasTreatementOfMalaria', 'hasTreatementOfKalaazar', 'hasTreatementOfJapaneseEncephalitis',
			//         'hasLaboratoryService', 'hasVolunteerCounselingTest', 'hasPmtct', 'hasAntiRetroViralTreatment', 'hasDental',
			//         'hasInPatient', 'hasRadiology'],
			//     values: ['Child Immunization', 'TD Vaccination', 'IMNCI',
			//         'Growth Monitoring', 'Safe Motherhood', 'Family Planning', 'OPD', 'Treatment of Tuberculosis',
			//         'Treatment of MDR tuberculosis', 'Treatment of Leprosy',
			//         'Treatment of Malaria', 'Treatment of Kala-azar', 'Treatment of Japanese Encephalitis', 'Laboratory Service',
			//         'VCT for HIV/AIDS', 'PMTCT', 'Anti-retro Viral Treatment',
			//         'Dental', 'Inpatient', 'Radiology'],
			//     isBoolean: false,
			//     showFalseValue: false,
			//     visualizationKey: 'highestValue',
			//     visualizationWordStart: '',
			//     visualizationWordEnd: ' Available',
			// },

			{
				label: "Services Available",
				labelNe: "उपलब्ध सेवाहरू",
				key: [
					"hasAmbulanceService",
					"hasPharmacy",
					"hasCovidClinicService",
					"hasEmergencyServices",
					"hasOperatingTheatre",
					"hasBloodDonation",
				],
				values: [
					"Ambulance service",
					"Pharmacy",
					"COVID clinic service",
					"Emergency service",
					"Operating theatre",
					"Blood donation",
				],
				valuesNe: [
					"एम्बुलेन्स सेवा",
					"फार्मेसी सेवा",
					"कोभिड क्लिनिक सेवा",
					"आकस्मिक सेवा",
					"अपरेटिङ थिएटर",
					"रक्तदान सेवा ",
				],
				isBoolean: true,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "",
				visualizationWordStartNe: "",
				visualizationWordEnd: " Available",
				visualizationWordEndNe: "उपलब्ध छ",
			},
			// {
			//     label: 'Surgical Service',
			//     key: ['hasCaesarianSection', 'hasGastrointestinal', 'hasTraumaSurgery', 'hasCardiacSurgery',
			//         'hasNeuroSurgery', 'hasPlasticSurgery'],
			//     values: ['Caesarian Section', 'Gastro Intestinal', 'Trauma Surgery', 'Cardiac Surgery', 'Neuro Surgery', 'Plastic Surgery'],
			//     isBoolean: false,
			// },
			// {
			//     label: 'Specialized Service',
			//     key: ['hasIcu', 'hasCcu', 'hasNicu', 'hasMicu', 'hasSncu', 'hasPicu'],
			//     values: ['ICU', 'CCU', 'NICU', 'MICU', 'SNCU', 'PICU'],
			//     isBoolean: false,
			// },
			{
				label: "Bed Count",
				labelNe: "बेड गणना",
				key: ["hospitalBedCount", "icuBedCount", "ventilatorBedCount"],
				values: ["Hospital Bed", "ICU Bed", "Ventilator Bed"],
				valuesNe: ["हस्पिटल बेड", "आईसीयू बेड", "भेन्टिलेटर बेड"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Beds ",
				visualizationWordStartNe: "बेड उपलब्ध छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			// {
			//     label: 'Helipad Available',
			//     key: ['hasHelipad'],
			//     values: ['Helipad Available'],
			//     isBoolean: false,
			// },
			// {
			//     label: 'Open Space Available',
			//     key: ['hasOpenSpace'],
			//     values: ['Open Space Available'],
			//     isBoolean: false,
			// },
			{
				label: "Number of Employees",
				labelNe: "कर्मचारी संख्या",
				key: ["noOfMaleEmployee", "noOfFemaleEmployee", "noOfOtherEmployee"],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Number of Employees ",
				visualizationWordStartNe: "कर्मचारीहरु छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Differently-abled Employees",
				labelNe: "फरक क्षमता भएका कर्मचारीहरू",
				key: [
					"noOfDifferentlyAbledMaleEmployees",
					"noOfDifferentlyAbledFemaleEmployees",
					"noOfDifferentlyAbledOtherEmployees",
				],
				values: ["Male", "Female", "Other"],
				valuesNe: ["पुरुष", "महिला", "अन्य"],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "total",
				visualizationWordStart: "Differently-abled Employees ",
				visualizationWordStartNe: "फरक क्षमता भएका कर्मचारीहरू छन् ",
				visualizationWordEnd: "",
				visualizationWordEndNe: "",
			},
			{
				label: "Health Infrastructures with ",
				labelNe: "स्वास्थ्य पूर्वाधारहरु संग",
				key: ["hasHelipad", "hasOpenSpace", "hasEvacuationRoute"],
				values: ["Helipad", "Open space", "Evacuation route"],
				valuesNe: ["हेलिप्याड", "खुल्ला स्थान", "Evacuation मार्ग "],
				isBoolean: false,
				showFalseValue: false,
				visualizationKey: "highestValue",
				visualizationWordStart: "Health Infrastructures with ",
				visualizationWordStartNe: "स्वास्थ्य पूर्वाधारहरुमा  ",
				visualizationWordEnd: " available",
				visualizationWordEndNe: " उपलब्ध छ",
			},
		],
	},
];

const CustomizedLabel = (props) => {
	const { x, y, stroke, value } = props;

	return (
		<text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
			{value}
		</text>
	);
};
const mapStateToProps = (state, props) => ({
	provinces: provincesSelector(state),
	districts: districtsSelector(state),
	municipalities: municipalitiesSelector(state),
	wards: wardsSelector(state),
	language: languageSelector(state),
});
class DataVisualisation extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			selectedResourceData: [],
			GraphVisualizationData: [],
			isValueCalculated: false,
			isDataSetClicked: false,
			allDataNullConditionCheck: false,
			downloadButtonClicked: false,
		};
	}

	public async componentDidMount(prevProps, prevState) {
		const { resourceCollection, resourceType, pendingAPICall } = this.props;
		const { isValueCalculated } = this.state;
		if (!pendingAPICall) {
			const resourceDataList = resourceCollection[resourceType];

			this.setState({
				selectedResourceData: resourceDataList,
			});
			const GraphVisualizationData = await visualizationKeyValues
				.filter((item) => item.resourceType === resourceType)[0]
				.chartDataType.map((datakey) => {
					const datam = this.getResourceDataForVisualization(
						resourceType,
						datakey.key,
						datakey.isBoolean,
						datakey.values,
						datakey.valuesNe,
						datakey.showFalseValue
					);
					return datam;
				});
			const calculatedSum = await GraphVisualizationData[0].reduce(
				(acc, curValue) => acc + (curValue.value ? curValue.value : 0),
				0
			);

			if (!pendingAPICall && resourceCollection[resourceType].length === 0) {
				this.setState({ isValueCalculated: true });
			}
			if (calculatedSum > 0) {
				this.setState({ isValueCalculated: true });
			}
			if (prevState) {
				if (prevState.isValueCalculated !== isValueCalculated) {
					this.setState({ GraphVisualizationData });
				}
			}
		}
	}

	public async componentDidUpdate(prevProps, prevState) {
		const { resourceCollection, resourceType, pendingAPICall } = this.props;
		const { isValueCalculated } = this.state;
		if (!pendingAPICall) {
			const resourceDataList = resourceCollection[resourceType];

			this.setState({
				selectedResourceData: resourceDataList,
			});
			const GraphVisualizationData = await visualizationKeyValues
				.filter((item) => item.resourceType === resourceType)[0]
				.chartDataType.map((datakey) => {
					const datam = this.getResourceDataForVisualization(
						resourceType,
						datakey.key,
						datakey.isBoolean,
						datakey.values,
						datakey.valuesNe,
						datakey.showFalseValue
					);
					return datam;
				});
			let nullDataCheck = null;
			const calculatedSum = GraphVisualizationData[0].reduce(
				(acc, curValue) => acc + (curValue.value ? curValue.value : 0),
				0
			);
			nullDataCheck = calculatedSum || null;

			if (
				!pendingAPICall &&
				resourceCollection[resourceType].length !== 0 &&
				nullDataCheck === null
			) {
				this.setState({
					isValueCalculated: true,
					allDataNullConditionCheck: true,
				});
			}
			if (!pendingAPICall && resourceCollection[resourceType].length === 0) {
				this.setState({ isValueCalculated: true });
			}
			if (calculatedSum > 0) {
				this.setState({ isValueCalculated: true });
			}
			if (prevState.isValueCalculated !== isValueCalculated) {
				this.setState({ GraphVisualizationData });
			}
		}
	}

	private getResourceDataForVisualization = (
		resourceType,
		key,
		isBoolean,
		label,
		labelNe,
		showFalseValue
	) => {
		const { selectedResourceData } = this.state;
		const {
			language: { language },
		} = this.props;
		let filteredResourceChartDataType;
		let calculatedValueData;
		let filterDataForCalculation;
		let filterDataForFalseValue;

		const filterLabelAccToLang = (data, keyMain) => {
			if (data.length > 0) {
				const actData = data.filter((item) => item.resourceType === resourceType)[0].chartDataType;
				const chartData = actData.filter((dat) => dat.key === key)[0];
				return chartData[keyMain];
			}
			return [];
		};

		let nepaliKeyVal = {};

		for (let index = 0; index < visualizationKeyValues.length; index++) {
			const chartData = visualizationKeyValues[index].chartDataType;

			for (let jindex = 0; jindex < chartData.length; jindex++) {
				const engVal = chartData[jindex].values;
				const nepaliVal = chartData[jindex].valuesNe;
				if (!nepaliVal) {
					continue;
				}

				for (let k = 0; k < engVal.length; k++) {
					const indiVidualData = engVal[k];
					const indiVidualDataNep = nepaliVal[k];
					nepaliKeyVal[indiVidualDataNep] = indiVidualData;
				}
			}
		}

		if (typeof key === "string") {
			const keyMain = language === "en" ? "values" : "valuesNe";
			filteredResourceChartDataType = filterLabelAccToLang(visualizationKeyValues, keyMain);
			calculatedValueData = filteredResourceChartDataType.map((item, i) => {
				filterDataForCalculation = selectedResourceData.filter(
					(d) => d[key] === (language === "en" ? item : nepaliKeyVal[item])
				);
				if (isBoolean) {
					filterDataForCalculation = selectedResourceData.filter(
						(d) => d[key] === (language === "en" ? item : nepaliKeyVal[item])
					);
				}
				if (isBoolean && showFalseValue) {
					filterDataForFalseValue = selectedResourceData.filter((d) => d[key] === false);
				}
				const obj = {};
				obj.label = item;
				obj.value =
					item === "Not operational"
						? filterDataForFalseValue.length
						: filterDataForCalculation.length;
				obj.color = "#1A70AC";
				// obj[`${item}`] = filterDataForCalculation.length;
				return obj;
			});
		}
		if (typeof key === "object") {
			filteredResourceChartDataType = key;
			calculatedValueData = filteredResourceChartDataType.map((item, i) => {
				// const isOtherItemDefined = filteredResourceChartDataType[filteredResourceChartDataType.length - 1];

				// const filterDataForStringValue = selectedResourceData.filter(itm => itm[isOtherItemDefined] !== null);
				// if(filterDataForStringValue){
				//     filterDataForCalculation=filterDataForStringValue.length
				// }else{

				// }

				// console.log('filterDataForStringValue', filterDataForStringValue);
				filterDataForCalculation = selectedResourceData.reduce(
					(acc, curValue) => acc + (curValue[item] ? curValue[item] : 0),
					0
				);
				const obj = {};
				obj.label = language === "en" ? label[i] : labelNe[i];
				obj.value = filterDataForCalculation;
				obj.color = "#1A70AC";
				// obj[`${label[i]}`] = filterDataForCalculation;
				return obj;
			});
		}
		const dataDisplayFromHighestValue = calculatedValueData.sort((a, b) => b.value - a.value);

		return dataDisplayFromHighestValue;
	};

	private HighValuePercentageCalculation = (value) => {
		const {
			resourceType,
			language: { language },
		} = this.props;
		const labelName = visualizationKeyValues.filter((item) => item.resourceType === resourceType)[0]
			.chartDataType;
		const HighestValue = value.map((item, i) => {
			const highValueObject = item.reduce((a, b) => (a.value > b.value ? a : b));
			const totalSum = item.reduce((a, b) => a + (b.value ? b.value : 0), 0);
			const highValuePercentage =
				totalSum === 0 ? 0 : ((highValueObject.value / totalSum) * 100).toFixed(2);

			const subCategoryName = language === "en" ? labelName[i].label : labelName[i].labelNe;
			const {
				visualizationKey,
				visualizationWordStart,
				visualizationWordEnd,
				visualizationWordStartNe,
				visualizationWordEndNe,
			} = labelName[i];
			const displayingValueinVisualization =
				visualizationKey === "total" ? totalSum : highValueObject.value;
			const displayVisualizationWord =
				visualizationKey === "total"
					? `${visualizationWordStart}${visualizationWordEnd ? `${visualizationWordEnd}` : ""}`
					: `${visualizationWordStart}` + `${highValueObject.label}` + `${visualizationWordEnd}`;
			const displayVisualizationWordNe =
				visualizationKey === "total"
					? `${visualizationWordStartNe}${
							visualizationWordEndNe ? `${visualizationWordEndNe}` : ""
					  }`
					: `${visualizationWordStartNe}` +
					  `${highValueObject.label}` +
					  `${visualizationWordEndNe}`;

			return {
				category: subCategoryName,
				subCategoryName: highValueObject.label,
				highValuePercentage,
				totalSum,
				highestValue: highValueObject.value,
				visualizationKey,
				displayingValueinVisualization,
				displayVisualizationWord,
				displayVisualizationWordNe,
			};
		});
		return HighestValue;
	};

	private handleSaveClick = (id) => {
		// const myElements = document.getElementById('realMap123');
		//     console.log('My final element', myElements);
		//     myElements.style.setProperty('height', 'unset', 'important');
		//     myElements.style.setProperty('width', 'unset', 'important');
		//     myElements.style.setProperty('position', 'unset', 'important');
		//     myElements.style.setProperty('top', 'unset', 'important');
		//     myElements.style.setProperty('background-color', 'transparent', 'important');
		//     myElements.style.setProperty('flex-grow', '1', 'important');

		if (id === "overallDownload") {
			this.setState({ downloadButtonClicked: true });
			const myElements = document.getElementById("1");
			myElements.style.setProperty("display", "none", "important");
			// const data = document.getElementsByClassName('test');
			// data.style.setProperty('display', 'none', 'important');
			// const test = document.getElementsByClassName('test');

			// document.getElementsByClassName('test')[0].style.display = 'none';
			let downloadBtnElements = document.getElementsByClassName("test");

			for (let i = 0; i < downloadBtnElements.length; i++) {
				downloadBtnElements[i].style.display = "none";
			}

			const divToDisplay = document.getElementById("overallDownload");
			const pdf = new JsPDF("p", "mm", "a4");
			pdf.page = 1;

			html2canvas(divToDisplay).then((canvas) => {
				const divImage = canvas.toDataURL("image/png");
				const imgWidth = 200;
				const pageHeight = 297;
				const imgHeight = (canvas.height * imgWidth) / canvas.width;
				let heightLeft = imgHeight;
				function footer() {
					pdf.text(150, 285, `page ${pdf.page}`); // print number bottom right
					pdf.page++;
				}
				let position = 10;
				pdf.addImage(divImage, "PNG", 5, position, imgWidth, imgHeight, "", "FAST");
				heightLeft -= pageHeight;

				while (heightLeft >= 0) {
					position = heightLeft - imgHeight;
					footer();
					pdf.addPage();
					pdf.addImage(divImage, "PNG", 5, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;
				}
				pdf.save("Report.pdf");

				myElements.style.setProperty("display", "flex", "important");

				for (let i = 0; i < downloadBtnElements.length; i++) {
					downloadBtnElements[i].style.display = "flex";
				}
				this.setState({ downloadButtonClicked: false });
				// data.style.setProperty('display', 'unset', 'important');
			});
		} else {
			saveChart(id, id);
		}

		// saveChart("hazardSeverity", "hazardSeverity");
	};

	public render() {
		const {
			closeVisualization,
			checkedCategory,
			resourceType,
			level,
			lvl2catName,
			typeName,
			resourceCollection,
			selectedCategoryName,
			wards,
			provinces,
			districts,
			municipalities,
			pendingAPICall,
			ErrorData,
			language: { language },
		} = this.props;
		const {
			GraphVisualizationData,
			isValueCalculated,
			isDataSetClicked,
			selectedResourceData,
			allDataNullConditionCheck,
			downloadButtonClicked,
		} = this.state;

		const labelName = visualizationKeyValues.filter((item) => item.resourceType === resourceType)[0]
			.chartDataType;

		const HighValuePercentageCalculation =
			this.HighValuePercentageCalculation(GraphVisualizationData);

		const { visualizationHeading, visualizationHeadingNe } = visualizationKeyValues.filter(
			(item) => item.resourceType === resourceType
		)[0];

		const selectedImage = sidepanelLogo.filter((data) => data.name === selectedCategoryName)[0]
			.image;

		const updatedSelectedResource = selectedResourceData.map((item) => {
			const wardExist = wards.find((w) => w.id === item.ward);

			const provinceId = wardExist ? wardExist.province : "";
			const provinceName = provinceId ? provinces.find((p) => p.id === provinceId).title_en : "";
			const districtId = wardExist ? wardExist.district : "";
			const districtName = districtId ? districts.find((d) => d.id === districtId).title_en : "";
			const municipalityId = wardExist ? wardExist.municipality : "";
			const municipalityName = municipalityId
				? municipalities.find((m) => m.id === municipalityId).title_en
				: "";
			const wardNumber = wardExist ? wardExist.title : "";

			return {
				...item,
				province: provinceName,
				district: districtName,
				municipality: municipalityName,
				wardNumber,
			};
		});
		return (
			<Modal className={styles.contactFormModal}>
				{/* <ModalHeader
                    // title={'Add Contact'}
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            // onClick={closeModal}
                            title="Close Modal"
                        />
                    )}
                /> */}
				<Translation>
					{(t) => (
						<ModalBody className={_cs(styles.modalBody, language === "np" && styles.languageFont)}>
							{!pendingAPICall && isValueCalculated ? (
								<div>
									<div className={styles.header}>
										<div className={styles.headingCategories}>
											<div
												role="button"
												tabIndex={0}
												onKeyDown={undefined}
												className={!isDataSetClicked ? styles.visualization : ""}
												onClick={() => this.setState({ isDataSetClicked: false })}>
												<h2>{t("VISUALIZATION")}</h2>
											</div>
											<div
												style={{ marginLeft: "30px" }}
												role="button"
												tabIndex={0}
												className={isDataSetClicked ? styles.visualization : ""}
												onKeyDown={undefined}
												onClick={() => this.setState({ isDataSetClicked: true })}>
												<h2>{t("DATASET")}</h2>
											</div>
										</div>
										<DangerButton
											transparent
											iconName="close"
											onClick={() => {
												this.setState({ allDataNullConditionCheck: false });
												closeVisualization(
													false,
													checkedCategory,
													resourceType,
													level,
													lvl2catName,
													typeName
												);
											}}
											title={t("Close Modal")}
											className={styles.closeButton}
										/>{" "}
									</div>
									<div id="overallDownload">
										<div className={styles.categoryName}>
											{/* <div className={styles.categoryLogo} id="categorySelectedList">
											<ScalableVectorGraphics
												className={styles.categoryLogoIcon}

												src={selectedImage}
											/>
											<h3>{visualizationHeading}</h3>
										</div>
										{downloadButtonClicked ? (
											<div style={{ position: 'relative' }}>
												<LoadingAnimation className={styles.loaderDownload} />
												<p>Downloading...</p>
												{' '}
											</div>
										) : ''}
										<div
											id="1"
											style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
											role="button"
											tabIndex={0}
											// eslint-disable-next-line max-len
											onClick={() => this.handleSaveClick('overallDownload')}
											onKeyDown={undefined}
										>
											<h4>DOWNLOAD</h4>
											{' '}
											<Button
												title="Download Chart"
												className={styles.chartDownload}
												transparent
												// onClick={() => this.handleSaveClick('overallDownload')}
												iconName="download"
											/>

										</div> */}
										</div>
										{ErrorData ? (
											<h2 style={{ textAlign: "center" }}>{ErrorData}</h2>
										) : isDataSetClicked ? (
											<TableData
												selectedResourceData={updatedSelectedResource}
												resourceType={resourceType}
											/>
										) : (
											<div>
												{GraphVisualizationData &&
													GraphVisualizationData.map((item, i) =>
														HighValuePercentageCalculation[i].highValuePercentage === 0 ? (
															""
														) : (
															<div key={item.label}>
																<div className={styles.barChartSection}>
																	<div className={styles.percentageValue}>
																		{/* <h1>Education Institution</h1> */}
																		<h1>
																			{
																				HighValuePercentageCalculation[i]
																					.displayingValueinVisualization
																			}
																		</h1>

																		<span>
																			{language === "en"
																				? HighValuePercentageCalculation[i].displayVisualizationWord
																				: HighValuePercentageCalculation[i]
																						.displayVisualizationWordNe}
																		</span>
																	</div>

																	<div style={{ flex: "4" }} key={item.label}>
																		<div className={styles.graphicalVisualization}>
																			{/* <div style={{ display: 'flex',
                                                                            justifyContent: 'flex-end',
                                                                    fontSize: '25px' }}
                                                                /> */}
																			<div id={labelName[i].label}>
																				<div
																					style={{
																						display: "flex",
																						alignItems: "center",
																						justifyContent: "space-between",
																					}}>
																					<h3>
																						{" "}
																						{language === "en"
																							? labelName[i].label
																							: labelName[i].labelNe}
																					</h3>
																					<div className="test">
																						<Button
																							title={t("Download Chart")}
																							className={styles.chartDownload}
																							transparent
																							onClick={() =>
																								this.handleSaveClick(labelName[i].label)
																							}
																							iconName="download"
																						/>
																					</div>
																				</div>
																				<BarChartVisualization item={item} />
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														)
													)}
												{!pendingAPICall && resourceCollection[resourceType].length === 0 ? (
													<h2 style={{ textAlign: "center" }}>
														{language === "en"
															? "No Data Available for Visualization"
															: "भिजुअलाइजेसनको लागि कुनै डाटा उपलब्ध छैन"}
													</h2>
												) : (
													""
												)}
												{/* {allDataNullConditionCheck
                                                ? <h2 style={{ textAlign: 'center' }}>No Data Available for Visualization</h2>
                                                : ''} */}
											</div>
										)}
									</div>
								</div>
							) : (
								<LoadingAnimation className={styles.loader} />
							)}
						</ModalBody>
					)}
				</Translation>
			</Modal>
		);
	}
}

// export default createRequestClient(requests)(DataVisualisation);
export default connect(mapStateToProps)(DataVisualisation);
