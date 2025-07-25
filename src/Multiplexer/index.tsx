/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-indent */

import Loadable from "react-loadable";
import React from "react";
import Redux from "redux";
import { connect } from "react-redux";
import { Router, navigate } from "@reach/router";
import { _cs, bound } from "@togglecorp/fujs";
import memoize from "memoize-one";
import { bbox, point, buffer } from "@turf/turf";
import mapboxgl from "mapbox-gl";
import { CallBackProps, STATUS } from "react-joyride";
import Cookies from "js-cookie";

import i18n from "i18next";
import { initReactI18next, Translation } from "react-i18next";
import Map from "#re-map";
import MapContainer from "#re-map/MapContainer";
import MapOrder from "#re-map/MapOrder";
import { getLayerName } from "#re-map/utils";
import Icon from "#rscg/Icon";
import { setStyleProperty } from "#rscu/styles";
import Responsive from "#rscg/Responsive";
import DangerButton from "#rsca/Button/DangerButton";
import { AppState } from "#store/types";
import {
	RouteDetailElement,
	RegionAdminLevel,
	RegionValueElement,
	Layer,
	FiltersElement,
} from "#types";

import {
	District,
	Province,
	Municipality,
	// HazardType,
} from "#store/atom/page/types";
import { User } from "#store/atom/auth/types";

// import SVGMapIcon from '#components/SVGMapIcon';
import Loading from "#components/Loading";
import Navbar from "#components/Navbar";
import PageContext from "#components/PageContext";
import TitleContextProvider from "#components/TitleContext";
import LayerSwitch from "#components/LayerSwitch";
import LayerToggle from "#components/LayerToggle";
import MapDownloadButton from "#components/MapDownloadButton";
import { routeSettings } from "#constants";
import RiskInfoLayerContext from "#components/RiskInfoLayerContext";
import AppBrand from "#components/AppBrand";
import Filters from "#components/Filters";
import {
	userSelector,
	districtsSelector,
	municipalitiesSelector,
	provincesSelector,
	filtersSelector,
	closeWalkThroughSelector,
	runSelector,
	languageSelector,
	authStateSelector,
	// hazardTypeListSelector,
} from "#selectors";
import {
	setInitialPopupHiddenAction,
	setRegionAction,
	setFiltersAction,
	setInitialCloseWalkThroughAction,
	setInitialRunAction,
} from "#actionCreators";

import authRoute from "#components/authRoute";
import { getFeatureInfo } from "#utils/domain";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	ClientAttributes,
	methods,
} from "#request";
import ZoomToolBar from "#components/ZoomToolBar";
import LanguageToggle from "#components/LanguageToggle";
import { enTranslation, npTranslation } from "#constants/translations";
import errorBound from "../errorBound";
import helmetify from "../helmetify";
import styles from "./styles.module.scss";
import DownloadButtonOption from "./DownloadButtonOption";

function reloadPage() {
	window.location.reload(false);
}

const ErrorInPage = () => (
	<div className={styles.errorInPage}>
		Some problem occurred.
		<DangerButton transparent onClick={reloadPage}>
			Reload
		</DangerButton>
	</div>
);

const RetryableErrorInPage = ({ error, retry }: LoadOptions) => (
	<div className={styles.retryableErrorInPage}>
		Some problem occurred.
		<DangerButton onClick={retry} transparent>
			Reload
		</DangerButton>
	</div>
);

interface LoadOptions {
	error: string;
	retry: () => void;
}

const LoadingPage = ({ error, retry }: LoadOptions) => {
	if (error) {
		// NOTE: show error while loading page
		console.error(error);
		return <RetryableErrorInPage error={error} retry={retry} />;
	}
	return <Loading text="Loading Page" pending />;
};

const routes = routeSettings.map(({ load, ...settings }) => {
	const Com = authRoute<typeof settings>()(
		helmetify(
			Loadable({
				loader: load,
				loading: LoadingPage,
			})
		)
	);

	const Component = errorBound<typeof settings>(ErrorInPage)(Com);

	return <Component key={settings.name} {...settings} />;
});

// MULTIPLEXER

const domain = import.meta.env.VITE_APP_DOMAIN;

interface State {
	leftContent?: React.ReactNode;
	rightContent?: React.ReactNode;
	mainContent?: React.ReactNode;
	filterContent?: React.ReactNode;
	leftContentContainerClassName?: string;
	rightContentContainerClassName?: string;
	mainContentContainerClassName?: string;
	filterContentContainerClassName?: string;
	leftContainerHidden?: boolean;
	hideMap?: boolean;
	hideFilter?: boolean;
	hideLocationFilter?: boolean;
	hideHazardFilter?: boolean;
	hideDataRangeFilter?: boolean;
	activeRouteDetails: RouteDetailElement | undefined;
	activeLayers: Layer[];
	mapDownloadPending: boolean;
	checkLatLngState: boolean;
	longitude: string | number;
	lattitude: string | number;
	rectangleBoundingBox: [any, any];
	drawRefState: boolean;
	geoLocationStatus: boolean;
	currentMarkers: [];
	markerStatus: boolean;
	checkFullScreenStatus: boolean;
	currentBounds: mapboxgl.LngLatBounds;
}

interface BoundingClientRect {
	width: number;
}

interface OwnProps {
	pending: boolean;
	hasError: boolean;
	mapStyle: string;
	boundingClientRect?: BoundingClientRect;
}

interface PropsFromState {
	user?: User;
	districts: District[];
	provinces: Province[];
	municipalities: Municipality[];
	filters: FiltersElement;
	// language: { language: string };
	// hazardList: HazardType[];
}

interface PropsFromDispatch {
	setInitialPopupHidden: typeof setInitialPopupHiddenAction;
	setRegion: typeof setRegionAction;
	setFilters: typeof setFiltersAction;
}

interface Coords {
	coords: {
		latitude: number;
		longitude: number;
	};
}

type Props = OwnProps & PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: AppState): PropsFromState => ({
	user: userSelector(state),
	filters: filtersSelector(state),
	districts: districtsSelector(state),
	municipalities: municipalitiesSelector(state),
	provinces: provincesSelector(state),
	closeWalkThroughHomepage: closeWalkThroughSelector(state),
	run: runSelector(state),
	language: languageSelector(state),
	authState: authStateSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setInitialPopupHidden: (params) => dispatch(setInitialPopupHiddenAction(params)),
	setRegion: (params) => dispatch(setRegionAction(params)),
	setFilters: (params) => dispatch(setFiltersAction(params)),
	setCloseWalkThrough: (params) => dispatch(setInitialCloseWalkThroughAction(params)),
	setRun: (params) => dispatch(setInitialRunAction(params)),
});

const getMatchingRegion = (
	subdomain: string | undefined,
	provinces: Province[],
	districts: District[],
	municipalities: Municipality[]
): RegionValueElement | undefined => {
	if (!subdomain) {
		return undefined;
	}

	const province = provinces.find((p) => p.code === subdomain);
	if (province) {
		return {
			adminLevel: 1,
			geoarea: province.id,
		};
	}

	const district = districts.find((p) => p.code === subdomain);
	if (district) {
		return {
			adminLevel: 2,
			geoarea: district.id,
		};
	}

	const municipality = municipalities.find((p) => p.code === subdomain);
	if (municipality) {
		return {
			adminLevel: 3,
			geoarea: municipality.id,
		};
	}

	return undefined;
};

const layerNameMap = {
	raster: "raster-layer",
	choropleth: "choropleth-layer",
};

const getUserRegion = (user?: User): RegionValueElement => {
	if (user && user.profile) {
		const {
			profile: { region, province, municipality, district },
		} = user;
		if (region === "province" && province) {
			return {
				adminLevel: 1,
				geoarea: province,
			};
		}
		if (region === "district" && district) {
			return {
				adminLevel: 2,
				geoarea: district,
			};
		}
		if (region === "municipality" && municipality) {
			return {
				adminLevel: 3,
				geoarea: municipality,
			};
		}
	}
	return {};
};
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	FeatureGetRequest: {
		url: ({ params }) => `${params.api}`,
		method: methods.GET,
		onMount: false,

		onSuccess: ({ response, params }) => {
			params.responseData(response);
		},
	},
};
class Multiplexer extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			leftContent: undefined,
			rightContent: undefined,
			leftContentContainerClassName: undefined,
			rightContentContainerClassName: undefined,
			activeRouteDetails: undefined,
			activeLayers: [],
			leftContainerHidden: false,
			mapDownloadPending: false,
			mapDataOnClick: {},
			tooltipClicked: false,
			mapClickedResponse: {},
			tooltipLatlng: undefined,
			LoadingTooltip: false,
			landslidePolygonImagemap: [],
			landslidePolygonChoroplethMapData: [],
			climateChangeSelectedDistrict: { id: undefined, title: undefined },
			addResource: false,
			toggleLeftPaneButtonStretched: true,
			extraFilterName: "",
			isFilterClicked: false,
			longitude: "",
			lattitude: "",
			checkLatLngState: false,
			rectangleBoundingBox: [],
			drawRefState: false,
			geoLocationStatus: false,
			currentMarkers: [],
			markerStatus: false,
			checkFullScreenStatus: false,
			isTilesLoaded: false,
			toggleAnimationMapDownloadButton: false,
			elementStatus: false,
			isBSToADClicked: false,
			steps: [
				{
					content:
						"Welcome to BIPAD Portal Walkthrough. This walkthorough navigates you to each module and feature of BIPAD portal and provided easiness to your userexpereince.",
					title: "Let's take BIPAD Portal Tour!",
					locale: { skip: <strong aria-label="skip">SKIP</strong> },
					placement: "center",
					target: "body",
				},
				{
					content:
						"Dashboard module provides geospatial data of the alerts of flood warning, heavy rainfall, earthquake and air pollution.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: "#navbar-dashboard",
					title: "Dashboard",
				},
				{
					content:
						"Incident module displays the geospatial data of the hazard incidents along with damage and loss information reported by Nepal Police.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: "#navbar-incident",
					title: "Incident module",
				},
				{
					content:
						"Damage and Loss module visualizes historic loss and damage data caused by various hazard incidents.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: "#navbar-lossDamage",
					title: "Damage & Loss module",
				},
				{
					content:
						"Real time module provides the near real-time data on rainfall and river watch, earthquake, air pollution, and forest fires along with streamflow forecast.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: "#navbar-realtime",
					title: "Real Time Module",
				},
				{
					content:
						"Profile module displays the records of DRRM documents, status of DRRM projects, contact information of DRR focal persons and disaster reports at national, provincial district, and municipal levels for the selected time frame.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: "#navbar-profile",
					title: "Profile module",
				},
				{
					content:
						"Risk Info module provides information on Hazard, Exposure, Vulnerability, Risk, Climate Change, and Capacity and Resources.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: "#navbar-riskinfo",
					title: "Risk Info module",
				},
				{
					content:
						"Clicking on this feature, you can login into the portal entering the provided login credentials or request for a new user name and password.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: "#login",
					title: "Login",
				},
				{
					content:
						"Filters allow you to choose and visualize the data based on the location (for e.g., province, district, municipality), hazard and time frame of interest.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: "#component-filter",
					title: "Filters",
				},
				{
					content: "Click here to download the map in various resolution.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".downloadButton-tour",
					title: "Map Download",
				},
				{
					content: "Click here to change the type of base layer map.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".layerSwitch-tour",
					title: "Map Layout",
				},
				{
					content:
						"Click here to display the administrative boundaries of the province, district, municipality and ward in a map.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".adminSwitch-tour",
					title: "Administrative Boundary",
				},
				{
					content:
						"Zoom toolbar provides option to zoom-in into a desired area, locate your current location, and search a location by its coordinates.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".zoomToolbar-tour",
					title: "Zoom Toolbar",
				},
				{
					content:
						"Legend defines features in a map. It simply displays the symbol followed by a text description of what that symbol represents.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".legend-tour",
					title: "Legend Section",
				},
				{
					content: "Date range provides the starting and end data of the data being displayed.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".date-range-tour",
					title: "Date Range ",
				},
				{
					content: "These are our super awesome projects!",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".source-tour",
					title: "Data Source ",
				},
				{
					content: "Click here to view the list of alerts generated for different hazards.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".alert-tour",
					title: "Alert ",
				},
				{
					content:
						"Click here to view the summary of the number of alerts generated for each hazard in the form of infographics.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".visualization-tour",
					title: "Visualization",
				},
				{
					content: "Click here to view and download details data in a tabular format.",
					placement: "bottom",
					styles: {
						options: {
							width: 300,
						},
					},
					target: ".tabular-data-tour",
					title: "Table Data",
				},
				{
					content: "Thank you for visiting to BIPAD Portal walkthrough.",
					locale: { skip: <strong aria-label="skip">SKIP</strong> },
					placement: "center",
					target: "body",
				},
			],
		};
	}

	public componentDidMount() {
		// NOTE: this means everything has loaded before mounting this page,
		// which is highly unlikely
		const { setCloseWalkThrough } = this.props;
		const { pending, provinces, districts, municipalities, filters, setFilters, user } = this.props;

		if (!pending) {
			this.setFilterFromUrl(provinces, districts, municipalities, filters, setFilters, user);
		}
		// setCloseWalkThrough({ value: true });
		// debug true for development
		i18n.use(initReactI18next).init({
			lng: "en",
			debug: false,
			fallbackLng: "en",
			resources: {
				en: enTranslation,
				np: npTranslation,
			},
		});
	}

	public UNSAFE_componentWillReceiveProps(nextProps: Props) {
		const { pending: oldPending } = this.props;

		const {
			pending: newPending,
			provinces,
			municipalities,
			districts,
			filters,
			setFilters,
			user,
		} = nextProps;

		// NOTE: this means data has been loaded
		if (oldPending !== newPending && !newPending) {
			this.setFilterFromUrl(provinces, districts, municipalities, filters, setFilters, user);
		}
	}

	public componentDidUpdate(prevProps) {
		const { boundingClientRect } = this.props;
		this.setLeftPanelWidth(boundingClientRect);
		const { activeRouteDetails } = this.state;
		const {
			closeWalkThroughHomepage,
			language: { language },
		} = this.props;
		const activeRouteName = activeRouteDetails && activeRouteDetails.name;
		const isFirstTimeUser = Cookies.get("isFirstTimeUser");
		if (prevProps.language !== language) {
			i18n.changeLanguage(language);
		}

		if (
			activeRouteName === "homepage" &&
			isFirstTimeUser !== undefined &&
			closeWalkThroughHomepage
		) {
			navigate("/dashboard/");
		}
		// Disabled for admin portal bulletin english and nepali switch form
		// if (language === 'np' && !showLanguageToolbar) {
		//     setLanguage({ language: 'en' });
		// }

		// Km to nepali translation//
		// const x = document.getElementsByClassName('mapboxgl-ctrl mapboxgl-ctrl-scale')[0];

		// if (language === 'np' && x && x.innerHTML.includes('km')) {
		//     x.innerHTML = x.innerHTML.replaceAll('km', 'किमि');
		// } else if (language === 'en' && x && x.innerHTML.includes('किमि')) {
		//     x.innerHTML = x.innerHTML.replaceAll('किमि', 'km');
		// }
		if (prevProps.language.language !== language) {
			if (language === "en") {
				this.setState({
					steps: [
						{
							content:
								"BIPAD Portal is an Integrated Disaster Information Management System of Nepal and is led by the National Disaster Risk Reduction and Management Authority of Nepal.",
							title: "Let's take BIPAD Portal Tour!",
							locale: { skip: <strong aria-label="skip">SKIP</strong> },
							placement: "center",
							target: "body",
						},
						{
							content:
								"This Module provides geospatial data of the alerts of flood war flood warnings, heavy rainfall, earthquake, and air pollution.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-dashboard",
							title: "Dashboard",
						},
						{
							content:
								"This module displays the geospatial data of the hazard incidents from the year 2011 reported by Nepal Police.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-incident",
							title: "Incident module",
						},
						{
							content:
								"Visualizes historic loss and damage data caused by various hazard incidents.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-lossDamage",
							title: "Damage & Loss module",
						},
						{
							content:
								"This module provides the real data on rainfall and river watch, earthquake, air pollution, and forest fires along with streamflow forecast.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-realtime",
							title: "Real Time Module",
						},
						{
							content:
								"This module displays the records of DRRM documents, status of DRRM projects, contact information of DRR focal persons and disaster reports at national, provincial district, and municipal levels for the selected time frame.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-profile",
							title: "Profile module",
						},
						{
							content:
								"This module provides information on Hazard, Exposure, Vulnerability, Risk, Climate Change, and Capacity and Resources.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-riskinfo",
							title: "Risk Info module",
						},
						{
							content:
								"You can log in to the portal using the login credentials provided or request a username and password.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#login",
							title: "Login",
						},
						{
							content:
								"Filters allow you to choose the location (for e.g., province, district, municipality) hazard of interest and time frame of the data.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#component-filter",
							title: "Filters",
						},
						{
							content: "You can click here to download the map in various resolutions.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".downloadButton-tour",
							title: "Map Download",
						},
						{
							content: "The base map layer can be selected to change the type of base layers.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".layerSwitch-tour",
							title: "Map Layout",
						},
						{
							content:
								"Here you can choose to display the administrative boundaries of the province, district, municipality, or wards.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".adminSwitch-tour",
							title: "Administrative Boundary",
						},
						{
							content:
								"This toolbar provides option to zoom in into a desired area, to locate your current location, and search a location by its coordinates.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".zoomToolbar-tour",
							title: "Zoom Toolbar",
						},
						{
							content:
								"This section defines features in a map. It simply displays the symbol followed by a text description of what that symbol represents.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".legend-tour",
							title: "Legend Section",
						},
						{
							content: "It provides the starting and end date of the data being displayed.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".date-range-tour",
							title: "Date Range ",
						},
						{
							content: "These are our super awesome projects!",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".source-tour",
							title: "Data Source ",
						},
						{
							content: "In this section, the alerts generated for various hazards are enlisted.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".alert-tour",
							title: "Alert ",
						},
						{
							content:
								"This section provides a summary of the number of alerts generated for each hazard.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".visualization-tour",
							title: "Visualization",
						},
						{
							content:
								"This section provides detailed information on the alerts in tabular format.",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".tabular-data-tour",
							title: "Table Data",
						},
						{
							content: "Thankyou for visiting BIPAD Portal Tour!",
							locale: { skip: <strong aria-label="skip">SKIP</strong> },
							placement: "center",
							target: "body",
						},
					],
				});
			} else {
				this.setState({
					steps: [
						{
							content:
								"BIPAD पोर्टल नेपालको एक एकीकृत विपद् सूचना व्यवस्थापन प्रणाली हो र यसको नेतृत्व नेपाल राष्ट्रिय विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन प्राधिकरणले गर्छ।",
							title: "BIPAD पोर्टल भ्रमण गरौं!",
							locale: { skip: <strong aria-label="skip">SKIP</strong> },
							placement: "center",
							target: "body",
						},
						{
							content:
								"यस मोड्युलले बाढी युद्ध बाढी चेतावनी, भारी वर्षा, भूकम्प, र वायु प्रदूषणको अलर्टहरूको भूस्थानिक डाटा प्रदान गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-dashboard",
							title: "ड्यासबोर्ड",
						},
						{
							content:
								"यो मोड्युलले नेपाल प्रहरीद्वारा रिपोर्ट गरिएको वर्ष २०११ देखि भएका जोखिम घटनाहरूको भौगोलिक तथ्याङ्क देखाउँछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-incident",
							title: "घटना मोड्युल",
						},
						{
							content: "विभिन्न जोखिम घटनाहरु को कारण ऐतिहासिक क्षति र क्षति डाटा को कल्पना गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-lossDamage",
							title: "क्षति र हानि मोड्युल",
						},
						{
							content:
								"यस मोड्युलले वर्षा र नदी हेरचाह, भूकम्प, वायु प्रदूषण, र स्ट्रिमफ्लो पूर्वानुमानको साथमा जंगलको आगोको वास्तविक डाटा प्रदान गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-realtime",
							title: "वास्तविक समय मोड्युल",
						},
						{
							content:
								"यो मोड्युलले चयन गरिएको समय सीमाको लागि DRRM कागजातहरू, DRRM परियोजनाहरूको स्थिति, DRR फोकल व्यक्तिहरूको सम्पर्क जानकारी र राष्ट्रिय, प्रदेश, जिल्ला र नगरपालिका स्तरहरूमा विपद् रिपोर्टहरू प्रदर्शन गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-profile",
							title: "प्रोफाइल मोड्युल:",
						},
						{
							content:
								"यो मोड्युलले प्रकोप, सम्मुखता, संकटासन्नता,  जोखिम, जलवायु परिवतर्न, र क्षमता र स्रोतहरू बारे जानकारी प्रदान गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#navbar-riskinfo",
							title: "जोखिम जानकारी मोड्युल",
						},
						{
							content:
								"तपाईंले प्रदान गरिएको लगइन प्रमाणहरू प्रयोग गरेर पोर्टलमा लग इन गर्न सक्नुहुन्छ वा प्रयोगकर्ता नाम र पासवर्ड अनुरोध गर्न सक्नुहुन्छ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#login",
							title: "लगइन गर्नुहोस्",
						},
						{
							content:
								"फिल्टरहरूले तपाईंलाई स्थान छनौट गर्न अनुमति दिन्छ (जस्तै, प्रदेश, जिल्ला, नगरपालिका) डाटाको रुचि र समय सीमाको जोखिम।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: "#component-filter",
							title: "फिल्टरहरू",
						},
						{
							content:
								"तपाईं विभिन्न रिजोल्युसनहरूमा नक्सा डाउनलोड गर्न यहाँ क्लिक गर्न सक्नुहुन्छ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".downloadButton-tour",
							title: "नक्सा डाउनलोड",
						},
						{
							content: "आधार तहको प्रकार परिवर्तन गर्न आधार नक्सा तह चयन गर्न सकिन्छ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".layerSwitch-tour",
							title: "नक्सा लेआउट",
						},
						{
							content:
								"यहाँ तपाईंले प्रदेश, जिल्ला, नगरपालिका वा वडाहरूको प्रशासनिक सीमाहरू प्रदर्शन गर्न छनौट गर्न सक्नुहुन्छ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".adminSwitch-tour",
							title: "प्रशासनिक सीमा",
						},
						{
							content:
								"यो टुलबारले इच्छित क्षेत्रमा जुम इन गर्न, तपाईंको हालको स्थान पत्ता लगाउन, र यसको निर्देशांकहरूद्वारा स्थान खोज्ने विकल्प प्रदान गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".zoomToolbar-tour",
							title: "जुम टुलबार",
						},
						{
							content:
								"यो खण्डले नक्सामा सुविधाहरू परिभाषित गर्दछ। यसले संकेतलाई के प्रतिनिधित्व गर्दछ भन्ने विवरणलाई देखाउँछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".legend-tour",
							title: "संकेत खण्ड",
						},
						{
							content: "यसले प्रदर्शन भइरहेको डाटाको सुरु र अन्त्य मिति प्रदान गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".date-range-tour",
							title: "मिति ",
						},
						{
							content: "These are our super awesome projects!",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".source-tour",
							title: "Data Source ",
						},
						{
							content: "यस खण्डमा,विभिन्न खतराहरूको लागि उत्पन्न अलर्टहरू सूचीबद्ध छन्।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".alert-tour",
							title: "अलर्ट",
						},
						{
							content:
								"यस खण्डले प्रत्येक खतराको लागि उत्पन्न अलर्टहरूको संख्याको सारांश प्रदान गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".visualization-tour",
							title: "दृश्यावलोकन",
						},
						{
							content: "यो खण्डले तालिका ढाँचामा अलर्टहरूमा विस्तृत जानकारी प्रदान गर्दछ।",
							placement: "bottom",
							styles: {
								options: {
									width: 300,
								},
							},
							target: ".tabular-data-tour",
							title: "तालिका डाटा",
						},
						{
							content: "BIPAD पोर्टल भ्रमणको लागि धन्यवाद!",
							locale: { skip: <strong aria-label="skip">SKIP</strong> },
							placement: "center",
							target: "body",
						},
					],
				});
			}
		}
	}

	private handlemapClickedResponse = (data) => {
		this.setState({ mapClickedResponse: data });
		this.setState({ LoadingTooltip: false });
	};

	private handleTilesLoad = (boolean) => {
		this.setState({ isTilesLoaded: boolean });
	};

	private handleMapClicked = (latlngData) => {
		const { activeLayers } = this.state;

		if (activeLayers.length && !activeLayers[activeLayers.length - 1].jsonData) {
			this.setState({
				tooltipLatlng: undefined,
			});
		}
		if (latlngData && activeLayers.length) {
			const {
				requests: { FeatureGetRequest },
			} = this.props;
			const latlng = point([latlngData.lngLat.lng, latlngData.lngLat.lat]);
			let bufferScale = 5000000;
			if (this.mapContainerRef.current) {
				const zoomLevel = this.mapContainerRef.current.getZoom();
				bufferScale /= 2 ** zoomLevel;
			}
			const buffered = buffer(latlng, bufferScale, { units: "meters" });
			const bBox = bbox(buffered);
			const api = getFeatureInfo(activeLayers[activeLayers.length - 1], bBox);
			this.setState({ LoadingTooltip: true });
			FeatureGetRequest.do({
				api,
				responseData: this.handlemapClickedResponse,
			});
		}
		return null;
	};

	private lattitudeRef = React.createRef<HTMLInputElement>();

	private mapContainerRef = React.createRef<mapboxgl.Map>();

	private geoLocationRef = React.createRef<mapboxgl.GeolocateControl>();

	private markerRef = React.createRef<mapboxgl.Marker>();

	private setFilterFromUrl = (
		provinces: Province[],
		districts: District[],
		municipalities: Municipality[],
		filters: PropsFromState["filters"],
		setFilters: PropsFromDispatch["setFilters"],
		user?: User
	) => {
		const { hostname } = window.location;

		const index = hostname.search(`.${domain}`);
		const subDomain = index !== -1 ? hostname.substring(0, index) : undefined;

		const region = getMatchingRegion(subDomain, provinces, districts, municipalities);
		const userRegion = getUserRegion(user);

		const { geoarea: currentGeoarea, adminLevel: currentAdminLevel } = region || userRegion;

		const { geoarea: oldGeoarea, adminLevel: oldAdminLevel } = filters.region || userRegion;

		if (
			currentGeoarea &&
			currentAdminLevel &&
			(currentGeoarea !== oldGeoarea || oldAdminLevel !== currentAdminLevel)
		) {
			setFilters({
				filters: {
					...filters,
					region: region || userRegion,
				},
			});
		}
	};

	private renderRoutes = () => {
		const { pending, hasError } = this.props;

		if (hasError) {
			return <ErrorInPage />;
		}
		if (pending) {
			return <Loading text="Loading Resources" pending />;
		}
		return <Router>{routes}</Router>;
	};

	private setLeftPanelWidth = memoize((boundingClientRect) => {
		const { width = 0 } = boundingClientRect;
		setStyleProperty("widthLeftPanel", `${bound(64 + width * 0.3, 360, 600)}px`);
	});

	private setLeftContent = (content: React.ReactNode, leftContentContainerClassName?: string) => {
		this.setState({
			leftContent: content,
			leftContentContainerClassName,
		});
	};

	private setRightContent = (content: React.ReactNode, rightContentContainerClassName?: string) => {
		this.setState({
			rightContent: content,
			rightContentContainerClassName,
		});
	};

	private setMainContent = (content: React.ReactNode, mainContentContainerClassName?: string) => {
		this.setState({
			mainContent: content,
			mainContentContainerClassName,
		});
	};

	private setFilterContent = (
		content: React.ReactNode,
		filterContentContainerClassName?: string
	) => {
		this.setState({
			filterContent: content,
			filterContentContainerClassName,
		});
	};

	private setActiveRouteDetails = (activeRouteDetails: RouteDetailElement) => {
		this.setState({ activeRouteDetails });
	};

	private handleMapDownloadStateChange = (mapDownloadPending: boolean) => {
		this.setState({ mapDownloadPending });
	};

	private hideMap = () => {
		this.setState({ hideMap: true });
	};

	private showMap = () => {
		this.setState({ hideMap: false });
	};

	private hideFilter = () => {
		this.setState({ hideFilter: true });
	};

	private showFilter = () => {
		this.setState({ hideFilter: false });
	};

	private hideLocationFilter = () => {
		this.setState({ hideLocationFilter: true });
	};

	private showLocationFilter = () => {
		this.setState({ hideLocationFilter: false });
	};

	private hideHazardFilter = () => {
		this.setState({ hideHazardFilter: true });
	};

	private showHazardFilter = () => {
		this.setState({ hideHazardFilter: false });
	};

	private hideDataRangeFilter = () => {
		this.setState({ hideDataRangeFilter: true });
	};

	private showDataRangeFilter = () => {
		this.setState({ hideDataRangeFilter: false });
	};

	private extraFilterName = (data) => {
		this.setState({ extraFilterName: data });
	};

	private FilterClickedStatus = (boolean) => {
		this.setState({ isFilterClicked: boolean });
	};

	private isBSToADClickedStatus = (boolean) => {
		this.setState({ isBSToADClicked: boolean });
	};

	private addLayer = (layer: Layer) => {
		this.setState(({ activeLayers }) => {
			const layerIndex = activeLayers.findIndex((d) => d.id === layer.id);

			if (layerIndex === -1) {
				return {
					activeLayers: [...activeLayers, layer],
				};
			}

			// update layer
			const newActiveLayers = [...activeLayers];
			newActiveLayers.splice(layerIndex, 1, layer);

			return { activeLayers: newActiveLayers };
		});
	};

	private removeLayer = (layerId: Layer["id"]) => {
		this.setState(({ activeLayers }) => {
			const layerIndex = activeLayers.findIndex((d) => d.id === layerId);

			if (layerIndex !== -1) {
				const newActiveLayers = [...activeLayers];
				newActiveLayers.splice(layerIndex, 1);

				return { activeLayers: newActiveLayers };
			}

			return { activeLayers };
		});
	};

	private setLayers = (activeLayers: Layer[]) => {
		this.setState({ activeLayers });
	};

	private addLayers = (layerList: Layer[]) => {
		this.setState(({ activeLayers }) => {
			const newActiveLayerList = [...activeLayers];

			layerList.forEach((layer) => {
				if (newActiveLayerList.findIndex((d) => d.id === layer.id) === -1) {
					newActiveLayerList.push(layer);
				}
			});

			return { activeLayers: newActiveLayerList };
		});
	};

	private removeLayers = (layerIdList: Layer["id"][]) => {
		this.setState(({ activeLayers }) => {
			const newActiveLayerList = [...activeLayers];

			layerIdList.forEach((layerId) => {
				const layerIndex = newActiveLayerList.findIndex((d) => d.id === layerId);

				if (layerIndex !== -1) {
					newActiveLayerList.splice(layerIndex, 1);
				}
			});

			return { activeLayers: newActiveLayerList };
		});
	};

	private getLayerOrder = memoize((activeLayers: Layer[]) => {
		const otherLayers = [
			getLayerName("risk-infoz-outlines", "ward-outline"),
			getLayerName("risk-infoz-outlines", "municipality-outline"),
			getLayerName("risk-infoz-outlines", "district-outline"),
			getLayerName("risk-infoz-outlines", "province-outline"),
			getLayerName("risk-infoz-outlines", "ward-label"),
			getLayerName("risk-infoz-outlines", "municipality-label"),
			getLayerName("risk-infoz-outlines", "district-label"),
			getLayerName("risk-infoz-outlines", "province-label"),
		];

		const layers = activeLayers.map((d) => getLayerName(d.layername, layerNameMap[d.type]));
		return [...layers, ...otherLayers];
	});

	private getRegionName = (
		selectedRegion: RegionValueElement,
		provinces: Province[],
		districts: District[],
		municipalities: Municipality[]
	) => {
		if (!selectedRegion || !selectedRegion.adminLevel) {
			return <Translation>{(t) => <span>{t("National")}</span>}</Translation>;
		}

		const adminLevels: {
			[key in RegionAdminLevel]: Province[] | District[] | Municipality[];
		} = {
			1: provinces,
			2: districts,
			3: municipalities,
		};

		const regionList = adminLevels[selectedRegion.adminLevel];
		const currentRegion = regionList.find((d) => d.id === selectedRegion.geoarea);
		const {
			language: { language },
		} = this.props;
		if (currentRegion && language === "en") {
			return <Translation>{(t) => `${currentRegion.title} ${t(currentRegion.type)}`}</Translation>;
		}

		if (currentRegion && language === "np") {
			return (
				<Translation>{(t) => `${currentRegion.title_ne} ${t(currentRegion.type)}`}</Translation>
			);
		}

		return "Unknown";
	};

	private handleToggleLeftContainerVisibilityButtonClick = () => {
		const { toggleLeftPaneButtonStretched } = this.state;
		this.setState(({ leftContainerHidden: prevLeftContainerHidden }) => ({
			leftContainerHidden: !prevLeftContainerHidden,
		}));
		this.setState({ toggleLeftPaneButtonStretched: !toggleLeftPaneButtonStretched });
	};

	private clickHandler = (data) => {
		const { activeRouteDetails } = this.context;
		this.setState({ mapDataOnClick: data });
		this.setState({ tooltipClicked: true });
		this.setState({
			tooltipLatlng: data.lngLat,
		});
	};

	private closeTooltip = (data) => {
		this.setState({ tooltipLatlng: data });
	};

	private handleLandslidePolygonImageMap = (data) => {
		this.setState({
			landslidePolygonImagemap: data,
		});
	};

	private handlelandslidePolygonChoroplethMapData = (data) => {
		this.setState({
			landslidePolygonChoroplethMapData: data,
		});
	};

	private setClimateChangeSelectedDistrict = (data) => {
		const {
			id,
			properties: { title },
		} = data;

		this.setState({
			climateChangeSelectedDistrict: { id, title },
		});
	};

	private setAddResource = (boolean) => {
		this.setState({
			addResource: boolean,
		});
	};

	private getRegionDetails = (
		selectedRegion: RegionValueElement,
		provinces: Province[],
		districts: District[],
		municipalities: Municipality[]
	) => {
		if (!selectedRegion || !selectedRegion.adminLevel) {
			return "National";
		}

		const adminLevels: {
			[key in RegionAdminLevel]: Province[] | District[] | Municipality[];
		} = {
			1: provinces,
			2: districts,
			3: municipalities,
		};

		const regionList = adminLevels[selectedRegion.adminLevel];
		const currentRegion = regionList.find((d) => d.id === selectedRegion.geoarea);

		if (currentRegion) {
			return currentRegion;
		}

		return "Unknown";
	};

	private fullScreenMap = () => {
		this.setState({ checkFullScreenStatus: true });

		if (this.mapContainerRef.current) {
			const mainapp = this.mapContainerRef.current.getContainer();

			this.setState({ currentBounds: this.mapContainerRef.current.getBounds() });

			mainapp.requestFullscreen();
		}

		const resetFunc = setTimeout(() => {
			// if (this.mapContainerRef.current) {
			//     const nepalBbox = [[80.05858661752784, 26.347836996368667],
			//         [88.20166918432409, 30.44702867091792]];

			//     const currentBbox = this.mapContainerRef.current.getBounds();
			//     console.log('current bbox is', currentBbox);

			//     let status = false;
			//     // eslint-disable-next-line no-plusplus
			//     for (let i = 0; i < nepalBbox.length; i++) {
			//         // eslint-disable-next-line no-plusplus
			//         for (let j = 0; j < nepalBbox.length; j++) {
			//             if (nepalBbox[i][j] === currentBbox[i][j]) {
			//                 status = true;
			//             }
			//         }
			//     }
			//     if (status) {
			//         return;
			//     }
			// }
			if (this.mapContainerRef.current) {
				this.mapContainerRef.current.fitBounds(this.state.currentBounds, { duration: 1000 });
			}
		}, 700); // triggered after 700ms

		return () => clearTimeout(resetFunc);
	};

	private markersArray = (marker: any) => {
		this.setState((prevState) => prevState.currentMarkers.push(marker));
	};

	private goToLocation = () => {
		if (this.state.markerStatus) {
			this.setState({ markerStatus: false });
		} else {
			this.setState({ markerStatus: true });
		}

		if (this.mapContainerRef.current) {
			if (this.state.longitude && this.state.lattitude) {
				this.mapContainerRef.current.flyTo({
					speed: 1,
					center: {
						lat: this.state.lattitude,
						lng: this.state.longitude,
					},
					zoom: 12,
				});
			}
			const marker = new mapboxgl.Marker()
				.setLngLat([this.state.longitude, this.state.lattitude])
				.setPopup(
					new mapboxgl.Popup({ offset: 25 }) // add popups
						.setHTML(
							`<h3 style=padding:25px 50px;>Lattitude : ${this.state.lattitude}, Longitude : ${this.state.longitude}</h3>`
						)
				)
				.addTo(this.mapContainerRef.current);

			this.markerRef.current = marker;

			this.markersArray(marker);

			if (this.state.currentMarkers !== null) {
				for (let i = this.state.currentMarkers.length - 1; i >= 0; i--) {
					this.state.currentMarkers[i].remove();
				}
			}
		}
	};

	private mapOnClick = (event: mapboxgl.EventData) => {
		if (!this.state.checkLatLngState) return;

		const coordinates = event.lngLat;

		if (this.state.currentMarkers.length > 0) {
			for (let i = this.state.currentMarkers.length - 1; i >= 0; i--) {
				this.state.currentMarkers[i].remove();
			}
		}

		const marker = new mapboxgl.Marker();
		this.setState({ longitude: coordinates.lng });
		this.setState({ lattitude: coordinates.lat });
		if (this.mapContainerRef.current) {
			marker.setLngLat(coordinates).addTo(this.mapContainerRef.current);
		}

		this.markersArray(marker);
	};

	private handleToggle = () => {
		if (this.lattitudeRef.current) {
			this.lattitudeRef.current.focus();
		}

		if (!this.state.checkLatLngState && this.mapContainerRef.current) {
			this.mapContainerRef.current.on("click", (event) => this.mapOnClick(event));
		}

		if (this.state.checkLatLngState && this.mapContainerRef.current) {
			this.mapContainerRef.current.off("click", (event) => this.mapOnClick(event));

			if (this.state.currentMarkers.length > 0) {
				for (let i = this.state.currentMarkers.length - 1; i >= 0; i--) {
					this.state.currentMarkers[i].remove();
				}
			}
		}

		if (this.state.checkLatLngState) {
			this.setState({ checkLatLngState: false });
		} else {
			this.setState({ checkLatLngState: true });
		}
	};

	private drawToZoom = () => {
		if (this.state.drawRefState) {
			this.setState({ drawRefState: false });
		} else {
			this.setState({ drawRefState: true });
		}
	};

	private resetDrawState = () => {
		this.setState({ drawRefState: false });
	};

	private currentLocation = () => {
		const dotElement = document.querySelector(".mapboxgl-user-location-dot");
		if (dotElement) {
			dotElement.style.display = "unset";
		}
		if (this.geoLocationRef.current) {
			this.geoLocationRef.current.trigger();

			if (this.state.geoLocationStatus) {
				this.setState({ geoLocationStatus: false });
			} else {
				this.setState({ geoLocationStatus: true });
			}
		}
	};

	private fullScreenOffFunc = () => {
		if (this.state.checkFullScreenStatus) {
			this.setState({ checkFullScreenStatus: false });
		}
	};

	private handleToggleAnimationMapDownloadButton = (boolean) => {
		this.setState({ toggleAnimationMapDownloadButton: boolean });
	};

	private clickHandler = (data) => {
		const { activeRouteDetails } = this.context;
		this.setState({ mapDataOnClick: data });
		this.setState({ tooltipClicked: true });
		this.setState({
			tooltipLatlng: data.lngLat,
		});
	};

	private closeTooltip = (data) => {
		this.setState({ tooltipLatlng: data });
	};

	private handleLandslidePolygonImageMap = (data) => {
		this.setState({
			landslidePolygonImagemap: data,
		});
	};

	private handlelandslidePolygonChoroplethMapData = (data) => {
		this.setState({
			landslidePolygonChoroplethMapData: data,
		});
	};

	private setClimateChangeSelectedDistrict = (data) => {
		const {
			id,
			properties: { title },
		} = data;

		this.setState({
			climateChangeSelectedDistrict: { id, title },
		});
	};

	// private handleCloseWalkThrough = () => {
	//     this.setState({ closeWalkThrough: true });
	// }

	private handleStartTour = () => {
		this.setState({
			run: true,
		});
	};

	private handleJoyrideCallback = (data: CallBackProps) => {
		const { status, type } = data;
		const { setRun } = this.props;
		const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (finishedStatuses.includes(status)) {
			setRun({ value: false });
			// Cookies.set('isFirstTimeUser', false, { expires: new Date(Date.now() + 2592000) });
			Cookies.set("isFirstTimeUser", false, { path: "/", domain: ".yilab.org.np", expires: 365 });
		}
	};

	private hideLanguageToggleButton = (routeName) => {
		if (routeName === "temporary-shelter-enrollment-form-data-table") {
			return true;
		}
		if (routeName === "add-view-tranche1") {
			return true;
		}
		if (routeName === "add-view-tranche2") {
			return true;
		}
		if (routeName === "add-tranche2-file-upload") {
			return true;
		}
		if (routeName === "add-new-temporary-shelter-enrollment-data") {
			return true;
		}
		if (routeName === "add-new-temporary-shelter-enrollment-data-preview") {
			return true;
		}
		if (routeName === "admin") {
			return true;
		}
		if (routeName === "healthinfrastructure-data-table") {
			return true;
		}
		if (routeName === "healthinfrastructure") {
			return true;
		}
		if (routeName === "healthinfrastructure-upload") {
			return true;
		}
		if (routeName === "bulletin") {
			return true;
		}
		if (routeName === "incident-data-table") {
			return true;
		}
		if (routeName === "incident-upload") {
			return true;
		}
		if (routeName === "DRRM Report") {
			return true;
		}
		if (routeName === "earthquake-form") {
			return true;
		}
		if (routeName === "incident") {
			return false;
		}
		if (routeName === "dataArchive") {
			return true;
		}
		if (routeName === "visrisk") {
			return true;
		}
		if (routeName === "ibf") {
			return true;
		}
		return false;
	};

	private hiddenNavRouteName = (routeName) => {
		if (routeName === "homepage") {
			return true;
		}
		if (routeName === "gpdrr") {
			return true;
		}
		if (routeName === "about") {
			return true;
		}
		if (routeName === "developers") {
			return true;
		}
		if (routeName === "manuals") {
			return true;
		}
		if (routeName === "faqs") {
			return true;
		}
		return false;
	};

	public render() {
		const {
			mapStyle,
			filters,
			provinces,
			districts,
			municipalities,
			language: { language },
		} = this.props;

		const {
			leftContent,
			leftContentContainerClassName,
			rightContent,
			rightContentContainerClassName,
			mainContent,
			mainContentContainerClassName,
			filterContent,
			filterContentContainerClassName,
			hideMap,
			hideFilter,
			hideLocationFilter,
			hideDataRangeFilter,
			hideHazardFilter,
			activeRouteDetails,
			activeLayers,
			leftContainerHidden,
			mapDownloadPending,
			mapDataOnClick,
			tooltipClicked,
			mapClickedResponse,
			tooltipLatlng,
			LoadingTooltip,
			landslidePolygonImagemap,
			handlelandslidePolygonChoroplethMapData,
			landslidePolygonChoroplethMapData,
			climateChangeSelectedDistrict,
			addResource,
			toggleLeftPaneButtonStretched,
			extraFilterName,
			isFilterClicked,
			longitude,
			checkLatLngState,
			rectangleBoundingBox,
			drawRefState,
			currentMarkers,
			currentBounds,
			checkFullScreenStatus,
			isTilesLoaded,
			toggleAnimationMapDownloadButton,
			isBSToADClicked,
			steps,
		} = this.state;

		const pageProps = {
			setLeftContent: this.setLeftContent,
			setRightContent: this.setRightContent,
			setFilterContent: this.setFilterContent,
			setActiveRouteDetails: this.setActiveRouteDetails,
			setMainContent: this.setMainContent,
			activeRouteDetails,
			hideMap: this.hideMap,
			showMap: this.showMap,
			showFilter: this.showFilter,
			hideFilter: this.hideFilter,
			showLocationFilter: this.showLocationFilter,
			hideLocationFilter: this.hideLocationFilter,
			showHazardFilter: this.showHazardFilter,
			hideHazardFilter: this.hideHazardFilter,
			showDataRangeFilter: this.showDataRangeFilter,
			hideDataRangeFilter: this.hideDataRangeFilter,
			extraFilterName: this.extraFilterName,
		};

		const riskInfoLayerProps = {
			addLayer: this.addLayer,
			removeLayer: this.removeLayer,
			addLayers: this.addLayers,
			removeLayers: this.removeLayers,
			setLayers: this.setLayers,
			activeLayers,
			mapDataOnClick,
			tooltipClicked,
			closeTooltip: this.closeTooltip,
			mapClickedResponse,
			tooltipLatlng,
			LoadingTooltip,
			landslidePolygonImagemap,
			handleLandslidePolygonImageMap: this.handleLandslidePolygonImageMap,
			handlelandslidePolygonChoroplethMapData: this.handlelandslidePolygonChoroplethMapData,
			landslidePolygonChoroplethMapData,
			climateChangeSelectedDistrict,
			setClimateChangeSelectedDistrict: this.setClimateChangeSelectedDistrict,

			FilterClickedStatus: this.FilterClickedStatus,
			isFilterClicked,
			addResource,
			setAddResource: this.setAddResource,
			activeRouteDetails,
			isBSToADClicked,
			isBSToADClickedStatus: this.isBSToADClickedStatus,
		};

		const regionName = this.getRegionName(filters.region, provinces, districts, municipalities);
		const orderedLayers = this.getLayerOrder(activeLayers);
		const hideFilters = false;
		const activeRouteName = activeRouteDetails && activeRouteDetails.name;
		const detailsOfLoggedAdmin = this.getRegionDetails(
			filters.region,
			provinces,
			districts,
			municipalities
		);

		const resetLocation = () => {
			// if (this.state.geoLocationStatus && this.geoLocationRef.current) {
			const dotElement = document.querySelector(".mapboxgl-user-location-dot");
			if (dotElement) {
				dotElement.style.display = "none";
			}
			// }
			if (currentMarkers !== null) {
				for (let i = currentMarkers.length - 1; i >= 0; i--) {
					currentMarkers[i].remove();
				}
			}

			this.setState({ geoLocationStatus: false });
			if (this.mapContainerRef.current) {
				// centriod of nepal
				if (
					detailsOfLoggedAdmin &&
					!detailsOfLoggedAdmin.province &&
					!detailsOfLoggedAdmin.district
				) {
					this.mapContainerRef.current.fitBounds(
						[
							[80.05858661752784, 26.347836996368667],
							[88.20166918432409, 30.44702867091792],
						],
						{
							padding: 24,
						}
					);
				}
				// checking province
				if (detailsOfLoggedAdmin && detailsOfLoggedAdmin.centroid) {
					this.mapContainerRef.current.fitBounds(detailsOfLoggedAdmin.bbox, {
						padding: 24,
					});
				}
				// checking district
				if (detailsOfLoggedAdmin && detailsOfLoggedAdmin.province) {
					this.mapContainerRef.current.fitBounds(detailsOfLoggedAdmin.bbox, {
						padding: 24,
					});
				}
				// checking municipality
				if (
					detailsOfLoggedAdmin &&
					detailsOfLoggedAdmin.province &&
					detailsOfLoggedAdmin.district
				) {
					this.mapContainerRef.current.fitBounds(detailsOfLoggedAdmin.bbox, {
						padding: 24,
					});
				}
			}

			this.setState({ checkLatLngState: false, longitude: "", lattitude: "" });
		};

		const longitudeData = (val: number) => {
			this.setState({ longitude: val });
		};

		const lattiudeData = (val: number) => {
			this.setState({ lattitude: val });
		};
		const queryStringParams = window.location.href.split("#/")[1];
		const polygonDrawAccessableRoutes = ["vulnerability"];

		return (
			<PageContext.Provider value={pageProps}>
				<TitleContextProvider>
					<div
						className={_cs(
							styles.multiplexer,
							leftContainerHidden && styles.leftContainerHidden,
							mapDownloadPending && styles.downloadingMap,
							language === "np" && styles.languageFont
						)}>
						<div className={_cs(styles.content, "bipad-main-content")}>
							{/* <Joyride
                                callback={this.handleJoyrideCallback}
                                continuous
                                // getHelpers={this.getHelpers}
                                run={run}
                                scrollToFirstStep
                                showProgress
                                showSkipButton
                                steps={steps}
                                styles={{
                                    options: {
                                        zIndex: 10000,
                                    },
                                }}
                            /> */}
							{/* {closeWalkThrough ? ''
                                : isFirstTimeUser === undefined ? (
                                    <WalkThrough
                                        startTour={this.handleStartTour}
                                    />
                                ) : ''
                            } */}
							<RiskInfoLayerContext.Provider value={riskInfoLayerProps}>
								<Map
									handleTilesLoad={this.handleTilesLoad}
									isTilesLoaded={isTilesLoaded}
									mapStyle={mapStyle}
									clickHandler={this.clickHandler}
									handleMapClicked={this.handleMapClicked}
									toggleAnimationMapDownloadButton={toggleAnimationMapDownloadButton}
									mapOptions={{
										logoPosition: "top-left",
										minZoom: 5,
										// makes initial map center to Nepal
										center: {
											lng: 85.30014,
											lat: 27.700769,
										},
									}}
									scaleControlShown
									scaleControlPosition="bottom-right"
									navControlShown
									navControlPosition="bottom-right"
									geoLocationRef={this.geoLocationRef}
									rectangleBoundingBox={rectangleBoundingBox}
									mapContainerRefMultiplexer={this.mapContainerRef}
									drawRefState={drawRefState}
									resetDrawState={this.resetDrawState}
									queryStringParams={queryStringParams}
									polygonDrawAccessableRoutes={polygonDrawAccessableRoutes}
									checkFullScreenStatus={checkFullScreenStatus}
									currentBounds={currentBounds}
									fullScreenOffFunc={this.fullScreenOffFunc}>
									{leftContent && (
										<aside
											className={_cs(
												activeRouteName === "contacts" ||
													activeRouteName === "documents" ||
													activeRouteName === "projects"
													? styles.halfPageLeftPane
													: styles.left,
												leftContainerHidden && styles.hidden
											)}>
											<AppBrand className={styles.brand} regionName={regionName} />
											<div
												className={_cs(styles.leftContentContainer, leftContentContainerClassName)}>
												{leftContent}
											</div>
										</aside>
									)}
									{leftContent && (
										<div
											role="presentation"
											className={
												activeRouteName === "contacts" ||
												activeRouteName === "documents" ||
												activeRouteName === "projects"
													? toggleLeftPaneButtonStretched
														? styles.toggleLeftContainerVisibilityButtonHalfPageLeftPane
														: styles.toggleLeftPaneButtonCompresed
													: styles.toggleLeftContainerVisibilityButton
											}
											onClick={this.handleToggleLeftContainerVisibilityButtonClick}>
											<Icon name={leftContainerHidden ? "chevronRight" : "chevronLeft"} />
										</div>
									)}
									<main className={styles.main}>
										{mainContent && (
											<div
												className={_cs(
													styles.mainContentContainer,
													mainContentContainerClassName,
													"legend-tour"
												)}>
												{mainContent}
											</div>
										)}
										<MapContainer
											className={_cs(styles.map, hideMap && styles.hidden)}
											activeLayers={activeLayers}
											onPendingStateChange={this.handleMapDownloadStateChange}
										/>
										{/* hazardList.map((item) => {
                                        if (!item.icon) {
                                            return null;
                                        }
                                        return (
                                            <SVGMapIcon
                                                key={item.icon}
                                                src={item.icon}
                                                name={item.icon}
                                                fillColor="#222222"
                                            />
                                        );
                                    }) */}
										{!hideMap && (
											<div
												className={
													activeRouteName === "contacts" ||
													activeRouteName === "documents" ||
													activeRouteName === "projects"
														? !toggleLeftPaneButtonStretched
															? styles.mapActionsCompressed
															: styles.mapActions
														: styles.mapActions
												}>
												{/* <MapDownloadButton
                                                    className={styles.mapDownloadButton}
                                                    transparent
                                                    title="Download current map"
                                                    iconName="download"
                                                    onPendingStateChange={
                                                        this.handleMapDownloadStateChange
                                                    }
                                                // activeLayers={activeLayers[activeLayers.length - 1]}
                                                /> */}
												<DownloadButtonOption
													isTilesLoaded={isTilesLoaded}
													className={_cs(styles.mapSwitch, "downloadButton-tour")}
													onPendingStateChange={this.handleMapDownloadStateChange}
													activeLayers={activeLayers[activeLayers.length - 1]}
													handleToggleAnimationMapDownloadButton={
														this.handleToggleAnimationMapDownloadButton
													}
												/>
												<LayerSwitch className={_cs(styles.layerSwitch, "layerSwitch-tour")} />
												<LayerToggle className={_cs(styles.adminSwitch, "adminSwitch-tour")} />
												<ZoomToolBar
													fullScreenMap={this.fullScreenMap}
													resetLocation={resetLocation}
													lattitudeRef={this.lattitudeRef}
													longitude={this.state.longitude}
													lattitude={this.state.lattitude}
													setLongitude={longitudeData}
													setLattitude={lattiudeData}
													goToLocation={this.goToLocation}
													drawToZoom={this.drawToZoom}
													checkLatLngState={checkLatLngState}
													handleToggle={this.handleToggle}
													currentLocation={this.currentLocation}
												/>
											</div>
										)}
									</main>
									{(rightContent || !hideFilters) && (
										<aside className={styles.right}>
											{rightContent && (
												<div
													className={_cs(
														styles.rightContentContainer,
														rightContentContainerClassName
													)}>
													{rightContent}
												</div>
											)}
											{!this.hideLanguageToggleButton(activeRouteName) &&
												!this.hiddenNavRouteName(activeRouteName) && <LanguageToggle />}
											{!hideFilter && (
												<Filters
													className={styles.filters}
													hideLocationFilter={hideLocationFilter}
													hideHazardFilter={hideHazardFilter}
													hideDataRangeFilter={hideDataRangeFilter}
													extraContent={filterContent}
													FilterClickedStatus={this.FilterClickedStatus}
													extraContentContainerClassName={filterContentContainerClassName}
													activeRouteDetails={activeRouteDetails}
												/>
											)}
										</aside>
									)}
									{this.renderRoutes()}
									<MapOrder ordering={orderedLayers} />
								</Map>
							</RiskInfoLayerContext.Provider>
						</div>
						{!this.hiddenNavRouteName(activeRouteName) && <Navbar className={styles.navbar} />}
					</div>
				</TitleContextProvider>
			</PageContext.Provider>
		);
	}
}

// export default connect(mapStateToProps, mapDispatchToProps)(Responsive(Multiplexer));
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	createConnectedRequestCoordinator<PropsWithRedux>()(
		createRequestClient(requests)(Responsive(Multiplexer))
	)
);
