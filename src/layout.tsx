import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { compose } from "redux";

import { AppState } from "#store/types";
import * as PageTypes from "#store/atom/page/types";
import { AuthState, User } from "#store/atom/auth/types";
import {
	createConnectedRequestCoordinator,
	createRequestClient,
	NewProps,
	ClientAttributes,
	methods,
} from "#request";
import {
	setProvincesAction,
	setDistrictsAction,
	setMunicipalitiesAction,
	setWardsAction,
	setHazardTypesAction,
	setEnumOptionsAction,
	setAuthAction,
	setUserDetailAction,
	SetAdminMenuAction,
} from "#actionCreators";
import { mapStyleSelector, authStateSelector } from "#selectors";

import { getAuthState } from "#utils/session";

import { ModelEnum } from "#types";

interface State {}
interface Params {}
interface OwnProps {}

interface PropsFromState {
	mapStyle: string;
	authState: AuthState;
}

interface PropsFromDispatch {
	setProvinces: typeof setProvincesAction;
	setDistricts: typeof setDistrictsAction;
	setMunicipalities: typeof setMunicipalitiesAction;
	setWards: typeof setWardsAction;
	setHazardTypes: typeof setHazardTypesAction;
	setEnumOptions: typeof setEnumOptionsAction;
	setAuth: typeof setAuthAction;
	setUserDetail: typeof setUserDetailAction;
	setAdminMenu: typeof SetAdminMenuAction;
}

type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
	mapStyle: mapStyleSelector(state),
	authState: authStateSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
	setProvinces: (params) => dispatch(setProvincesAction(params)),
	setDistricts: (params) => dispatch(setDistrictsAction(params)),
	setMunicipalities: (params) => dispatch(setMunicipalitiesAction(params)),
	setWards: (params) => dispatch(setWardsAction(params)),
	setHazardTypes: (params) => dispatch(setHazardTypesAction(params)),
	setEnumOptions: (params) => dispatch(setEnumOptionsAction(params)),
	setAuth: (params) => dispatch(setAuthAction(params)),
	setUserDetail: (params) => dispatch(setUserDetailAction(params)),
	setAdminMenu: (params) => dispatch(SetAdminMenuAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	meRequest: {
		url: "/me/",
		method: methods.GET,
		onSuccess: ({ response, props }) => {
			const { setUserDetail } = props;
			console.log("✅ ME Request Success:", response);
			setUserDetail(response as User);
		},
		onFailure: ({ error }) => {
			console.error("❌ ME Request Failed:", error);
		},
		onMount: () => {
			const authState = getAuthState();
			console.log("🔐 Auth State:", authState);
			return authState.authenticated;
		},
	},
	provinceListRequest: {
		url: "/province/",
		method: methods.GET,
		onSuccess: ({ response, props: { setProvinces } }) => {
			interface Response {
				results: PageTypes.Province[];
			}
			const { results: provinces = [] } = response as Response;
			console.log("✅ Provinces Request Success:", provinces);
			setProvinces({ provinces });
		},
		onFailure: ({ error }) => {
			console.error("❌ Provinces Request Failed:", error);
		},
		extras: {
			schemaName: "provinceResponse",
		},
		onMount: true,
	},
	districtListRequest: {
		url: "/district/",
		method: methods.GET,
		onSuccess: ({ response, props: { setDistricts } }) => {
			interface Response {
				results: PageTypes.District[];
			}
			const { results: districts = [] } = response as Response;
			console.log("✅ Districts Request Success:", districts);
			setDistricts({ districts });
		},
		onFailure: ({ error }) => {
			console.error("❌ Districts Request Failed:", error);
		},
		extras: {
			schemaName: "districtResponse",
		},
		onMount: true,
	},
	municipalityListRequest: {
		url: "/municipality/",
		method: methods.GET,
		onSuccess: ({ response, props: { setMunicipalities } }) => {
			interface Response {
				results: PageTypes.Municipality[];
			}
			const { results: municipalities = [] } = response as Response;
			console.log("✅ Municipalities Request Success:", municipalities);
			setMunicipalities({ municipalities });
		},
		onFailure: ({ error }) => {
			console.error("❌ Municipalities Request Failed:", error);
		},
		extras: {
			schemaName: "municipalityResponse",
		},
		onMount: true,
	},
	wardListRequest: {
		url: "/ward/",
		method: methods.GET,
		query: {
			limit: -1,
		},
		onSuccess: ({ response, props: { setWards } }) => {
			interface Response {
				results: PageTypes.Ward[];
			}
			const { results: wards = [] } = response as Response;
			console.log("✅ Wards Request Success:", wards);
			setWards({ wards });
		},
		onFailure: ({ error }) => {
			console.error("❌ Wards Request Failed:", error);
		},
		extras: {
			schemaName: "wardResponse",
		},
		onMount: true,
	},
	hazardTypesRequest: {
		url: "/hazard/",
		method: methods.GET,
		onSuccess: ({ response, props: { setHazardTypes } }) => {
			interface Response {
				results: PageTypes.HazardType[];
			}
			const { results: hazardTypes = [] } = response as Response;
			console.log("✅ Hazard Types Request Success:", hazardTypes);
			setHazardTypes({ hazardTypes });
		},
		onFailure: ({ error }) => {
			console.error("❌ Hazard Types Request Failed:", error);
		},
		extras: {
			schemaName: "hazardResponse",
		},
		onMount: true,
	},
	enumOptionsGetRequest: {
		url: "/enum-choice/",
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, props: { setEnumOptions } }) => {
			const enumList: ModelEnum[] = response as ModelEnum[];
			console.log("✅ Enum Options Request Success:", enumList);
			setEnumOptions({ enumList });
		},
		onFailure: ({ error }) => {
			console.error("❌ Enum Options Request Failed:", error);
		},
	},
	getMenu: {
		url: "/adminportal-menu/",
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, props: { setAdminMenu } }) => {
			interface MenuResponse {
				results: any[];
			}
			const { results } = response as MenuResponse;
			console.log("✅ Admin Menu Request Success:", results);
			setAdminMenu(results);
		},
		onFailure: ({ error }) => {
			console.error("❌ Admin Menu Request Failed:", error);
		},
	},
};

class Layout extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		console.log("🚀 Layout Component Initializing...");

		const authState = getAuthState();
		const { setAuth } = this.props;

		console.log("🔐 Setting Auth State:", authState);
		setAuth(authState);
	}

	public componentDidMount() {
		console.log("📡 Layout Component Mounted - Network requests should start now");
		console.log("🔍 Available requests:", Object.keys(this.props.requests));
	}

	public render() {
		const {
			requests: {
				provinceListRequest: { pending: provincePending, responseError: provinceResponseError },
				districtListRequest: { pending: districtPending, responseError: districtResponseError },
				municipalityListRequest: {
					pending: municipalityPending,
					responseError: municipalityResponseError,
				},
				wardListRequest: { pending: wardListPending, responseError: wardListResponseError },
				hazardTypesRequest: { pending: hazardTypePending, responseError: hazardTypeResponseError },
				meRequest: { pending: mePending, responseError: meResponseError },
				enumOptionsGetRequest: { pending: enumPending, responseError: enumResponseError },
				getMenu: { pending: menuPending, responseError: menuResponseError },
			},
			mapStyle,
		} = this.props;

		const pending =
			provincePending ||
			districtPending ||
			municipalityPending ||
			wardListPending ||
			hazardTypePending ||
			mePending ||
			enumPending ||
			menuPending;

		const hasError =
			!!provinceResponseError ||
			!!districtResponseError ||
			!!municipalityResponseError ||
			!!wardListResponseError ||
			!!hazardTypeResponseError ||
			!!meResponseError ||
			!!enumResponseError ||
			!!menuResponseError;

		// Log current state for debugging
		console.log("🔄 Current Request States:", {
			provincePending,
			districtPending,
			municipalityPending,
			wardListPending,
			hazardTypePending,
			mePending,
			enumPending,
			menuPending,
			hasError,
			errors: {
				provinceResponseError,
				districtResponseError,
				municipalityResponseError,
				wardListResponseError,
				hazardTypeResponseError,
				meResponseError,
				enumResponseError,
				menuResponseError,
			},
		});

		return (
			<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
				<h1>Layout Component - Network Debugging</h1>

				<div style={{ marginBottom: "20px" }}>
					<h3>Overall Status:</h3>
					<p>Loading: {pending ? "🔄 Yes" : "✅ No"}</p>
					<p>Has Errors: {hasError ? "❌ Yes" : "✅ No"}</p>
					<p>Map Style: {mapStyle}</p>
				</div>

				<div style={{ marginBottom: "20px" }}>
					<h3>Individual Request Status:</h3>
					<ul>
						<li>
							Provinces:{" "}
							{provincePending ? "🔄 Loading" : provinceResponseError ? "❌ Error" : "✅ Done"}
						</li>
						<li>
							Districts:{" "}
							{districtPending ? "🔄 Loading" : districtResponseError ? "❌ Error" : "✅ Done"}
						</li>
						<li>
							Municipalities:{" "}
							{municipalityPending
								? "🔄 Loading"
								: municipalityResponseError
								? "❌ Error"
								: "✅ Done"}
						</li>
						<li>
							Wards:{" "}
							{wardListPending ? "🔄 Loading" : wardListResponseError ? "❌ Error" : "✅ Done"}
						</li>
						<li>
							Hazard Types:{" "}
							{hazardTypePending ? "🔄 Loading" : hazardTypeResponseError ? "❌ Error" : "✅ Done"}
						</li>
						<li>
							User Info: {mePending ? "🔄 Loading" : meResponseError ? "❌ Error" : "✅ Done"}
						</li>
						<li>
							Enum Options:{" "}
							{enumPending ? "🔄 Loading" : enumResponseError ? "❌ Error" : "✅ Done"}
						</li>
						<li>
							Admin Menu: {menuPending ? "🔄 Loading" : menuResponseError ? "❌ Error" : "✅ Done"}
						</li>
					</ul>
				</div>

				{hasError && (
					<div
						style={{
							backgroundColor: "#ffebee",
							padding: "10px",
							borderRadius: "4px",
							marginTop: "20px",
						}}>
						<h3>⚠️ Errors:</h3>
						<ul>
							{provinceResponseError && (
								<li>Province Error: {JSON.stringify(provinceResponseError)}</li>
							)}
							{districtResponseError && (
								<li>District Error: {JSON.stringify(districtResponseError)}</li>
							)}
							{municipalityResponseError && (
								<li>Municipality Error: {JSON.stringify(municipalityResponseError)}</li>
							)}
							{wardListResponseError && (
								<li>Ward Error: {JSON.stringify(wardListResponseError)}</li>
							)}
							{hazardTypeResponseError && (
								<li>Hazard Type Error: {JSON.stringify(hazardTypeResponseError)}</li>
							)}
							{meResponseError && <li>User Info Error: {JSON.stringify(meResponseError)}</li>}
							{enumResponseError && (
								<li>Enum Options Error: {JSON.stringify(enumResponseError)}</li>
							)}
							{menuResponseError && <li>Admin Menu Error: {JSON.stringify(menuResponseError)}</li>}
						</ul>
					</div>
				)}

				<div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
					<p>💡 Check the browser console for detailed network logs</p>
					<p>🔍 Open Developer Tools → Network tab to see actual HTTP requests</p>
				</div>
			</div>
		);
	}
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	createConnectedRequestCoordinator<ReduxProps>(),
	createRequestClient(requests)
)(Layout);
