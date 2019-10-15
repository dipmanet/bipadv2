import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { AppState } from '#store/types';
import * as PageTypes from '#store/atom/page/types';
import { AuthState, User } from '#store/atom/auth/types';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    setProvincesAction,
    setDistrictsAction,
    setMunicipalitiesAction,
    setWardsAction,
    setHazardTypesAction,
    setAuthAction,
    setUserDetailAction,
} from '#actionCreators';
import {
    mapStyleSelector,
    authStateSelector,
} from '#selectors';

import { getAuthState } from '#utils/session';

import Multiplexer from './Multiplexer';

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
    // setEventTypes: typeof setEventTypesAction;
    setAuth: typeof setAuthAction;
    setUserDetail: typeof setUserDetailAction;
}
type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    mapStyle: mapStyleSelector(state),
    authState: authStateSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setProvinces: params => dispatch(setProvincesAction(params)),
    setDistricts: params => dispatch(setDistrictsAction(params)),
    setMunicipalities: params => dispatch(setMunicipalitiesAction(params)),
    setWards: params => dispatch(setWardsAction(params)),
    setHazardTypes: params => dispatch(setHazardTypesAction(params)),
    setAuth: params => dispatch(setAuthAction(params)),
    // setEventTypes: params => dispatch(setEventTypesAction(params)),
    setUserDetail: params => dispatch(setUserDetailAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    meRequest: {
        url: '/me/',
        method: methods.GET,
        onSuccess: ({ response, props }) => {
            const {
                setUserDetail,
            } = props;
            setUserDetail(response as User);
        },
        onMount: () => {
            const authState = getAuthState();
            return authState.authenticated;
        },
    },
    provinceListRequest: {
        url: '/province/',
        method: methods.GET,
        onSuccess: ({ response, props: { setProvinces } }) => {
            interface Response { results: PageTypes.Province[] }
            const { results: provinces = [] } = response as Response;
            setProvinces({ provinces });
        },
        extras: {
            schemaName: 'provinceResponse',
        },
        onMount: true,
    },
    districtListRequest: {
        url: '/district/',
        method: methods.GET,
        onSuccess: ({ response, props: { setDistricts } }) => {
            interface Response { results: PageTypes.District[] }
            const { results: districts = [] } = response as Response;
            setDistricts({ districts });
        },
        extras: {
            schemaName: 'districtResponse',
        },
        onMount: true,
    },
    municipalityListRequest: {
        url: '/municipality/',
        method: methods.GET,
        onSuccess: ({ response, props: { setMunicipalities } }) => {
            interface Response { results: PageTypes.Municipality[] }
            const { results: municipalities = [] } = response as Response;
            setMunicipalities({ municipalities });
        },
        extras: {
            schemaName: 'municipalityResponse',
        },
        onMount: true,
    },
    wardListRequest: {
        url: '/ward/',
        method: methods.GET,
        query: {
            limit: 9999,
        },
        onSuccess: ({ response, props: { setWards } }) => {
            interface Response { results: PageTypes.Ward[] }
            const { results: wards = [] } = response as Response;
            setWards({ wards });
        },
        extras: {
            schemaName: 'wardResponse',
        },
        onMount: true,
    },
    hazardTypesRequest: {
        url: '/hazard/',
        method: methods.GET,
        onSuccess: ({ response, props: { setHazardTypes } }) => {
            interface Response { results: PageTypes.HazardType[] }
            const { results: hazardTypes = [] } = response as Response;
            setHazardTypes({ hazardTypes });
        },
        extras: {
            schemaName: 'hazardResponse',
        },
        onMount: true,
    },
    /*
    eventTypesRequest: {
        url: '/event/',
        method: methods.GET,
        onSuccess: ({ response, props: { setEventTypes } }) => {
            interface Response { results: PageTypes.EventType[] }
            const { results: eventTypes = [] } = response as Response;
            setEventTypes({ eventTypes });
        },
        onMount: true,
    },
    */
};

// NOTE: BrowserRouter is acting weird so not using React.PureComponent
/* Loads required info from server */
// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<Props, State> {
    public constructor(props: any) {
        super(props);

        const authState = getAuthState();
        const { setAuth } = this.props;

        setAuth(authState);
    }

    public render() {
        const {
            requests: {
                provinceListRequest: {
                    pending: provincePending,
                    responseError: provinceResponseError,
                },
                districtListRequest: {
                    pending: districtPending,
                    responseError: districtResponseError,
                },
                municipalityListRequest: {
                    pending: municipalityPending,
                    responseError: municipalityResponseError,
                },
                wardListRequest: {
                    pending: wardListPending,
                    responseError: wardListResponseError,
                },
                hazardTypesRequest: {
                    pending: hazardTypePending,
                    responseError: hazardTypeResponseError,
                },
                meRequest: {
                    pending: mePending,
                    responseError: meResponseError,
                },
            },
            mapStyle,
        } = this.props;

        const pending = (
            provincePending
            || districtPending
            || municipalityPending
            || wardListPending
            || hazardTypePending
            || mePending
        );

        const hasError = (
            !!provinceResponseError
            || !!districtResponseError
            || !!municipalityResponseError
            || !!wardListResponseError
            || !!hazardTypeResponseError
            || !!meResponseError
        );

        return (
            <Multiplexer
                pending={pending}
                hasError={hasError}
                mapStyle={mapStyle}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            App,
        ),
    ),
);
