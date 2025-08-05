import { lazyWithSuspense } from "#constants/lazyWithSuspense";
import type { RouteObject } from "react-router-dom";

export interface AppRouteMeta {
	name: string;
	title: string;
	titleNep?: string;
	id: string;
	iconName?: string;
	navbar?: boolean;
	disabled?: boolean;
	disableIfAuth?: boolean;
	disableIfNoAuth?: boolean;
	default?: boolean;
}

export type AppRoute = RouteObject & {
	meta: AppRouteMeta;
};

export const ROUTES: AppRoute[] = [
	{
		path: "/",
		element: lazyWithSuspense(() => import("../views/Dashboard")),
		meta: {
			name: "dashboard",
			title: "Dashboard",
			titleNep: "ड्यासबोर्ड",
			navbar: true,
			iconName: "dashboard",
			id: "navbar-dashboard",
		},
	},
	{
		path: "/admin",
		element: lazyWithSuspense(() => import("../admin/views/Landing")),
		meta: {
			name: "admin",
			title: "Admin",
			titleNep: "प्रशासक",
			navbar: false,
			disableIfNoAuth: true,
			id: "admin",
		},
	},
	{
		path: "/admin/admin",
		element: lazyWithSuspense(() => import("../admin/views/Admin")),
		meta: {
			name: "admin",
			title: "Admin",
			titleNep: "प्रशासक",
			navbar: false,
			disableIfNoAuth: true,
			id: "admin-admin",
		},
	},
	{
		path: "/admin/bulletin/add-new-bulletin-nepali",
		element: lazyWithSuspense(() => import("../admin/views/Bulletin")),
		meta: {
			name: "bulletin",
			title: "Bulletin (Nepali)",
			titleNep: "बुलेटिन (नेपाली)",
			navbar: false,
			disableIfNoAuth: true,
			id: "bulletin-ne",
		},
	},
	{
		path: "/admin/bulletin/add-new-bulletin-english",
		element: lazyWithSuspense(() => import("../admin/views/Bulletin")),
		meta: {
			name: "bulletin",
			title: "Bulletin (English)",
			titleNep: "बुलेटिन (अंग्रेजी)",
			navbar: false,
			disableIfNoAuth: true,
			id: "bulletin-en",
		},
	},
	{
		path: "/admin/bulletin/bulletin-data-table",
		element: lazyWithSuspense(() => import("../admin/views/BulletinTable")),
		meta: {
			name: "bulletin",
			title: "Bulletin",
			titleNep: "बुलेटिन",
			navbar: false,
			disableIfNoAuth: true,
			id: "bulletin-table",
		},
	},
	{
		path: "/admin/bulletin/edit-bulletin/:urlLanguage/:id",
		element: lazyWithSuspense(() => import("../admin/views/Bulletin")),
		meta: {
			name: "edit bulletin",
			title: "Edit Bulletin",
			titleNep: "बुलेटिन सम्पादन गर्नुहोस्",
			navbar: false,
			disableIfNoAuth: true,
			id: "edit-bulletin",
		},
	},
	{
		path: "/admin/covid-19/add-new-covid-19",
		element: lazyWithSuspense(() => import("../admin/views/Covid19")),
		meta: {
			name: "Covid-19",
			title: "Covid-19 Form",
			titleNep: "कोभिड-१९ फारम",
			navbar: false,
			disableIfNoAuth: true,
			id: "covid",
		},
	},
	{
		path: "/admin/covid-19/covid-19-data-table",
		element: lazyWithSuspense(() => import("../admin/views/Covid19Table")),
		meta: {
			name: "Covid-19-data-table",
			title: "Covid-19 Data Table",
			titleNep: "कोभिड-१९ डाटा तालिका",
			navbar: false,
			disableIfNoAuth: true,
			id: "covid-table",
		},
	},
	{
		path: "/admin/covid-19/covid-19-bulk-upload",
		element: lazyWithSuspense(() => import("../admin/views/Covid19BulkUpload")),
		meta: {
			name: "Covid-19",
			title: "Covid-19 Bulk Upload",
			titleNep: "कोभिड-१९ बल्क अपलोड",
			navbar: false,
			disableIfNoAuth: true,
			id: "covid-bulk-upload",
		},
	},
	{
		path: "/admin/epidemics/add-new-epidemics",
		element: lazyWithSuspense(() => import("../admin/views/Epidemics")),
		meta: {
			name: "epidemics",
			title: "Epidemics Form",
			titleNep: "महामारी फारम",
			navbar: false,
			disableIfNoAuth: true,
			id: "epidemics",
		},
	},
	{
		path: "/admin/incident/add-new-incident",
		element: lazyWithSuspense(() => import("../admin/views/Incidents")),
		meta: {
			name: "incident",
			title: "Incident Form",
			titleNep: "Incident Form",
			navbar: false,
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/admin/incident/incident-bulk-upload",
		element: lazyWithSuspense(() => import("../admin/views/IncidentBulkUpload")),
		meta: {
			name: "incident-upload",
			title: "Incident Bulk Upload",
			titleNep: "Incident Bulk Upload",
			navbar: false,
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/admin/epidemics/epidemics-data-table",
		element: lazyWithSuspense(() => import("../admin/views/EpidemicsTable")),
		meta: {
			name: "epidemics-data-table",
			title: "Epidemics Data Table",
			titleNep: "महामारी डाटा तालिका",
			navbar: false,
			disableIfNoAuth: true,
			id: "epidemics-table",
		},
	},
	{
		path: "/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table",
		element: lazyWithSuspense(() => import("../admin/views/TemporaryShelterTable")),
		meta: {
			name: "temporary-shelter-enrollment-form-data-table",
			title: "Temporary shelter enrollment form Data Table",
			titleNep: "Temporary shelter enrollment form Data Table",
			navbar: false,
			disableIfNoAuth: true,
			id: "TemporaryShelter-table",
		},
	},
	{
		path: "/admin/temporary-shelter-enrollment-form/dashboard",
		element: lazyWithSuspense(() => import("../admin/views/TemporaryShelterDashboard")),
		meta: {
			name: "temporary-shelter-enrollment-form-data-table",
			title: "Temporary shelter enrollment form Data Table",
			titleNep: "Temporary shelter enrollment form Data Table",
			navbar: false,
			disableIfNoAuth: true,
			id: "TemporaryShelter-table",
		},
	},
	{
		path: "/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data",
		element: lazyWithSuspense(() => import("../admin/views/TemporaryShelter")),
		meta: {
			name: "add-new-temporary-shelter-enrollment-data",
			title: "Add New Temporary shelter enrollment data",
			titleNep: "Add New Temporary shelter enrollment data",
			navbar: false,
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/:id",
		element: lazyWithSuspense(() => import("../admin/views/TemporaryShelterPreview")),
		meta: {
			name: "add-new-temporary-shelter-enrollment-data-preview",
			title: "Add New Temporary shelter enrollment data preview",
			titleNep: "Add New Temporary shelter enrollment data preview",
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/admin/temporary-shelter-enrollment-form/add-tranche-condition/:id",
		element: lazyWithSuspense(() => import("../admin/views/TrancheCondition")),
		meta: {
			name: "add-new-temporary-shelter-enrollment-data-preview",
			title: "Add New Temporary shelter enrollment data preview",
			titleNep: "Add New Temporary shelter enrollment data preview",
			navbar: false,
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/admin/temporary-shelter-enrollment-form/add-view-tranche1/:id",
		element: lazyWithSuspense(() => import("../admin/views/Tranche1")),
		meta: {
			name: "add-view-tranche1",
			title: "Add View Tranche1",
			titleNep: "Add View Tranche1",
			navbar: false,
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/admin/temporary-shelter-enrollment-form/add-view-tranche2/:id",
		element: lazyWithSuspense(() => import("../admin/views/Tranche2")),
		meta: {
			name: "add-view-tranche2",
			title: "Add View Tranche2",
			titleNep: "Add View Tranche2",
			navbar: false,
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/admin/temporary-shelter-enrollment-form/add-tranche2-file-upload/:id",
		element: lazyWithSuspense(() => import("../admin/views/Tranche2FileUpload")),
		meta: {
			name: "add-tranche2-file-upload",
			title: "Add Tranche2 file upload",
			titleNep: "Add Tranche2 File Upload",
			navbar: false,
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/admin/epidemics/epidemics-bulk-upload",
		element: lazyWithSuspense(() => import("../admin/views/EpidemicBulkUpload")),
		meta: {
			name: "epidemics-upload",
			title: "Epidemics Bulk Upload",
			titleNep: "महामारी बल्क अपलोड",
			navbar: false,
			disableIfNoAuth: true,
			id: "epidemics-upload",
		},
	},
	{
		path: "/admin/health-infrastructure/add-new-health-infrastructure",
		element: lazyWithSuspense(() => import("../admin/views/HealthDataStr")),
		meta: {
			name: "healthinfrastructure",
			title: "Health Infrastructure Form",
			titleNep: "स्वास्थ्य पूर्वाधार फारम",
			navbar: false,
			disableIfNoAuth: true,
			id: "health-infra",
		},
	},
	{
		path: "/admin/health-infrastructure/health-infrastructure-data-table",
		element: lazyWithSuspense(() => import("../admin/views/HealthDataTable")),
		meta: {
			name: "healthinfrastructure-data-table",
			title: "Health Infrastructure Data Table",
			titleNep: "स्वास्थ्य पूर्वाधार डाटा तालिका",
			navbar: false,
			disableIfNoAuth: true,
			id: "health-infra-table",
		},
	},
	{
		path: "/admin/health-infrastructure/health-infrastructure-bulk-upload",
		element: lazyWithSuspense(() => import("../admin/views/HealthBulkUpload")),
		meta: {
			name: "healthinfrastructure-upload",
			title: "Health Infrastructure Bulk Upload",
			titleNep: "स्वास्थ्य पूर्वाधार बल्क अपलोड",
			navbar: false,
			disableIfNoAuth: true,
			id: "health-bulk-upload",
		},
	},
	{
		path: "/profile/demography/",
		element: lazyWithSuspense(() => import("../views/Profile/ProfileModules/Demography")),
		meta: {
			name: "demography",
			title: "Demography",
			titleNep: "जनसांख्यिकी",
			navbar: false,
			id: "demography",
		},
	},
	{
		path: "/profile/contacts/",
		element: lazyWithSuspense(() => import("../views/Profile/ProfileModules/Contacts")),
		meta: {
			name: "contacts",
			title: "Contact",
			titleNep: "सम्पर्क",
			navbar: false,
			id: "contacts",
		},
	},
	{
		path: "/profile/documents/",
		element: lazyWithSuspense(() => import("../views/Profile/ProfileModules/Documents")),
		meta: {
			name: "documents",
			title: "Documents",
			titleNep: "कागजातहरू",
			navbar: false,
			id: "documents",
		},
	},
	{
		path: "/profile/projects/",
		element: lazyWithSuspense(() => import("../views/Profile/ProfileModules/Projects")),
		meta: {
			name: "projects",
			title: "Projects",
			titleNep: "परियोजनाहरू",
			navbar: false,
			id: "projects",
		},
	},
	{
		path: "/profile/nepDat-profile",
		element: lazyWithSuspense(() => import("../views/Profile/ProfileModules/NepDatProfile")),
		meta: {
			name: "nepdat-profile",
			title: "NepDat Profile",
			titleNep: "नेपडाट प्रोफाइल",
			navbar: false,
			id: "nep-dat",
		},
	},
	{
		path: "/admin/overview",
		element: lazyWithSuspense(() => import("../admin/views/Overview")),
		meta: {
			name: "overview",
			title: "Overview",
			titleNep: "सिंहावलोकन",
			navbar: false,
			disableIfNoAuth: true,
			id: "overview",
		},
	},
	{
		path: "/incidents/",
		element: lazyWithSuspense(() => import("../views/Incidents")),
		meta: {
			name: "incident",
			title: "Incident",
			titleNep: "घटना",
			navbar: true,
			iconName: "incidents",
			id: "navbar-incident",
		},
	},
	{
		path: "/admin/incident/incident-data-table",
		element: lazyWithSuspense(() => import("../admin/views/IncidentDatatable")),
		meta: {
			name: "incident-data-table",
			title: "Incident Data Table",
			titleNep: "Incident Data Table",
			navbar: false,
			disableIfNoAuth: true,
			id: "",
		},
	},
	{
		path: "/incidents/:incidentId/response/",
		element: lazyWithSuspense(() => import("../views/Response")),
		meta: {
			name: "response",
			title: "Incident Response",
			titleNep: "घटना रिपोर्ट",
			navbar: false,
			id: "navbar-response",
		},
	},
	{
		path: "/damage-and-loss/",
		element: lazyWithSuspense(() => import("../views/LossAndDamage")),
		meta: {
			name: "lossAndDamage",
			title: "Damage & Loss",
			titleNep: "क्षति र नोक्सान",
			navbar: true,
			iconName: "lossAndDamange",
			id: "navbar-lossDamage",
		},
	},
	{
		path: "/realtime/",
		element: lazyWithSuspense(() => import("../views/RealTimeMonitoring")),
		meta: {
			name: "realtime",
			title: "Realtime",
			titleNep: "वास्तविक समय",
			iconName: "realtime",
			navbar: true,
			id: "navbar-realtime",
		},
	},
	{
		path: "/ibf/",
		element: lazyWithSuspense(() => import("../views/IBF")),
		meta: {
			name: "ibf",
			title: "IBF",
			titleNep: "आइ.बि.यफ",
			navbar: false,
			disabled: false,
			iconName: "cloud",
			id: "ibf",
		},
	},
	{
		path: "/profile/",
		element: lazyWithSuspense(() => import("../views/Profile")),
		meta: {
			name: "profile",
			title: "Profile",
			titleNep: "प्रोफाइल",
			iconName: "profile",
			navbar: true,
			id: "navbar-profile",
		},
	},
	{
		path: "/risk-info/",
		element: lazyWithSuspense(() => import("../views/RiskInfo")),
		meta: {
			name: "riskInfo",
			title: "Risk Info",
			titleNep: "जोखिम जानकारी",
			navbar: true,
			disabled: false,
			iconName: "riskInfo",
			id: "navbar-riskinfo",
		},
	},
	{
		path: "/data-archive/",
		element: lazyWithSuspense(() => import("../views/DataArchive")),
		meta: {
			name: "dataArchive",
			title: "Data Archive",
			titleNep: "डाटा संग्रह",
			iconName: "clipboard",
			navbar: true,
			id: "",
		},
	},
	{
		path: "/about/",
		element: lazyWithSuspense(() => import("../components/WalkthroughModal/Slide1/About")),
		meta: {
			name: "about",
			title: "About",
			navbar: false,
			disabled: false,
			iconName: "eye",
			id: "",
		},
	},
	{
		path: "/developers/",
		element: lazyWithSuspense(() => import("../components/WalkthroughModal/Slide1/Developer")),
		meta: {
			name: "developers",
			title: "Developers",
			navbar: false,
			disabled: false,
			iconName: "eye",
			id: "",
		},
	},
	{
		path: "/manuals/",
		element: lazyWithSuspense(() => import("../components/WalkthroughModal/Slide1/Manuals")),
		meta: {
			name: "manuals",
			title: "Manuals",
			navbar: false,
			disabled: false,
			iconName: "eye",
			id: "",
		},
	},
	{
		path: "/faqs/",
		element: lazyWithSuspense(() => import("../components/WalkthroughModal/Slide1/Faqs")),
		meta: {
			name: "faqs",
			title: "Faqs",
			navbar: false,
			disabled: false,
			iconName: "eye",
			id: "",
		},
	},
	{
		path: "/drrm-report/",
		element: lazyWithSuspense(() => import("../views/PalikaReport")),
		meta: {
			name: "DRRM Report",
			title: "DRRM Report",
			titleNep: "डिआरआरएम रिपोर्ट",
			navbar: false,
			disabled: false,
			iconName: "textDocument",
			id: "drrm",
		},
	},
	{
		path: "/vis-risk/",
		element: lazyWithSuspense(() => import("../views/VizRisk")),
		meta: {
			name: "visrisk",
			title: "VisRisk",
			titleNep: "भिज-रिश्‍क",
			navbar: true,
			disabled: false,
			iconName: "eye",
			id: "",
		},
	},
	{
		path: "/vis-risk/",
		element: lazyWithSuspense(() => import("../views/VizRisk")),
		meta: {
			name: "visrisk",
			title: "VisRisk",
			titleNep: "भिज-रिश्‍क",
			navbar: true,
			disabled: false,
			iconName: "eye",
			id: "",
		},
	},
	{
		path: "/403/",
		element: lazyWithSuspense(() => import("../views/FourHundredThree")),
		meta: {
			name: "fourHundredThree",
			title: "403",
			navbar: false,
			id: "navbar-fourHundredThree",
		},
	},
	{
		path: undefined,
		element: lazyWithSuspense(() => import("../views/FourHundredFour")),
		meta: {
			name: "fourHundredFour",
			title: "404",
			default: true,
			navbar: false,
			id: "navbar-fourHundredFour",
		},
	},
	{
		path: "/set-new-password/",
		element: lazyWithSuspense(() => import("../views/ForgotPassword")),
		meta: {
			name: "forgotPassword",
			title: "New Password",
			navbar: false,
			id: "navbar-forgetpassword",
		},
	},

	{
		path: "*",
		element: <div>404 Page Not Found</div>,
		meta: {
			name: "not-found",
			title: "Not Found",
			titleNep: "पाइएन",
			id: "404",
		},
	},
];
