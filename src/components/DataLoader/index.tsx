import React from "react";
import { connect } from "react-redux";
import { compose, type Dispatch } from "redux";

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
interface OwnProps {
	children?: React.ReactNode; // Allow children to be passed
}
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
interface RequestProps {
	requests: {
		meRequest: { pending: boolean; responseError?: any; do: () => void };
		provinceListRequest: { pending: boolean; responseError?: any; do: () => void };
		districtListRequest: { pending: boolean; responseError?: any; do: () => void };
		municipalityListRequest: { pending: boolean; responseError?: any; do: () => void };
		wardListRequest: { pending: boolean; responseError?: any; do: () => void };
		hazardTypesRequest: { pending: boolean; responseError?: any; do: () => void };
		enumOptionsGetRequest: { pending: boolean; responseError?: any; do: () => void };
		getMenu: { pending: boolean; responseError?: any; do: () => void };
	};
}
type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch & RequestProps;
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
			console.log("meRequest Success:", response); // Debug
			setUserDetail(response as User);
		},
		onMount: () => {
			const authState = getAuthState();
			console.log("meRequest onMount - Auth State:", authState); // Debug
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
			console.log("provinceListRequest Success:", provinces); // Debug
			setProvinces({ provinces });
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
			console.log("districtListRequest Success:", districts); // Debug
			setDistricts({ districts });
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
			console.log("municipalityListRequest Success:", municipalities); // Debug
			setMunicipalities({ municipalities });
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
			console.log("wardListRequest Success:", wards); // Debug
			setWards({ wards });
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
			console.log("hazardTypesRequest Success:", hazardTypes); // Debug
			setHazardTypes({ hazardTypes });
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
			console.log("enumOptionsGetRequest Success:", enumList); // Debug
			setEnumOptions({ enumList });
		},
		// elder: true,
	},
	getMenu: {
		url: "/adminportal-menu/",
		method: methods.GET,
		onMount: true,
		onSuccess: ({ response, props: { setAdminMenu } }) => {
			console.log("getMenu Success:", response.results); // Debug
			setAdminMenu(response.results);
		},
	},
};

class App extends React.Component<Props, State> {
	public constructor(props: Props) {
		super(props);

		const authState = getAuthState();
		const { setAuth } = this.props;
		console.log("Constructor - Auth State:", authState); // Debug
		setAuth(authState);
	}

	public componentDidMount() {
		// Fallback to manually trigger requests if onMount is not working
		const { requests } = this.props;
		console.log("componentDidMount - Request Objects:", requests); // Debug
		if (requests.meRequest && requests.meRequest.do && getAuthState().authenticated) {
			requests.meRequest.do();
		}
		if (requests.provinceListRequest && requests.provinceListRequest.do) {
			requests.provinceListRequest.do();
		}
		if (requests.districtListRequest && requests.districtListRequest.do) {
			requests.districtListRequest.do();
		}
		if (requests.municipalityListRequest && requests.municipalityListRequest.do) {
			requests.municipalityListRequest.do();
		}
		if (requests.wardListRequest && requests.wardListRequest.do) {
			requests.wardListRequest.do();
		}
		if (requests.hazardTypesRequest && requests.hazardTypesRequest.do) {
			requests.hazardTypesRequest.do();
		}
		if (requests.enumOptionsGetRequest && requests.enumOptionsGetRequest.do) {
			requests.enumOptionsGetRequest.do();
		}
		if (requests.getMenu && requests.getMenu.do) {
			requests.getMenu.do();
		}
	}

	public render() {
		const {
			requests: {
				meRequest: { pending: mePending, responseError: meResponseError },
				provinceListRequest: { pending: provincePending, responseError: provinceResponseError },
				districtListRequest: { pending: districtPending, responseError: districtResponseError },
				municipalityListRequest: {
					pending: municipalityPending,
					responseError: municipalityResponseError,
				},
				wardListRequest: { pending: wardListPending, responseError: wardListResponseError },
				hazardTypesRequest: { pending: hazardTypePending, responseError: hazardTypeResponseError },
				enumOptionsGetRequest: {
					pending: enumOptionsPending,
					responseError: enumOptionsResponseError,
				},
				getMenu: { pending: menuPending, responseError: menuResponseError },
			},
			mapStyle,
		} = this.props;

		const pending =
			mePending ||
			provincePending ||
			districtPending ||
			municipalityPending ||
			wardListPending ||
			hazardTypePending ||
			enumOptionsPending ||
			menuPending;

		const hasError =
			!!meResponseError ||
			!!provinceResponseError ||
			!!districtResponseError ||
			!!municipalityResponseError ||
			!!wardListResponseError ||
			!!hazardTypeResponseError ||
			!!enumOptionsResponseError ||
			!!menuResponseError;

		// Debug request states
		console.log("Render - Request States:", {
			me: { pending: mePending, error: meResponseError },
			province: { pending: provincePending, error: provinceResponseError },
			district: { pending: districtPending, error: districtResponseError },
			municipality: { pending: municipalityPending, error: municipalityResponseError },
			ward: { pending: wardListPending, error: wardListResponseError },
			hazard: { pending: hazardTypePending, error: hazardTypeResponseError },
			enumOptions: { pending: enumOptionsPending, error: enumOptionsResponseError },
			menu: { pending: menuPending, error: menuResponseError },
		});

		return (
			<div>
				<div>Pending: {pending.toString()}</div>
				<div>Has Error: {hasError.toString()}</div>
				{!pending && !hasError && this.props.children}
			</div>
		);
	}
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	createConnectedRequestCoordinator<ReduxProps>(),
	createRequestClient(requests)
)(App);
