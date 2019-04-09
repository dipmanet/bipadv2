import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import { AppState } from '#store/types';
import * as PageTypes from '#store/atom/page/types';
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
    // setEventTypesAction,
} from '#actionCreators';
import {
    mapStyleSelector,
} from '#selectors';

import { getAuthState } from '#utils/session';

import Multiplexer from './Multiplexer';

interface State {}
interface Params {}
interface OwnProps {}
interface PropsFromState {
    mapStyle: string;
}
interface PropsFromDispatch {
    setProvinces: typeof setProvincesAction;
    setDistricts: typeof setDistrictsAction;
    setMunicipalities: typeof setMunicipalitiesAction;
    setWards: typeof setWardsAction;
    setHazardTypes: typeof setHazardTypesAction;
    // setEventTypes: typeof setEventTypesAction;
    setAuth: typeof setAuthAction;
}
type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    mapStyle: mapStyleSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setProvinces: params => dispatch(setProvincesAction(params)),
    setDistricts: params => dispatch(setDistrictsAction(params)),
    setMunicipalities: params => dispatch(setMunicipalitiesAction(params)),
    setWards: params => dispatch(setWardsAction(params)),
    setHazardTypes: params => dispatch(setHazardTypesAction(params)),
    setAuth: params => dispatch(setAuthAction(params)),
    // setEventTypes: params => dispatch(setEventTypesAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
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
        this.authPollId = undefined;
    }

    public componentWillMount() {
        // Start polling
        this.authPollId = window.setTimeout(this.pollAuthInfo, 5000);
    }

    public componentWillUnmount() {
        if (this.authPollId) {
            window.clearTimeout(this.authPollId);
        }
    }

    private authPollId?: number;

    public pollAuthInfo() {
        const authState = getAuthState();
        console.warn('AUTHSTATE', authState);
        this.props.setAuth(authState);
        this.authPollId = window.setTimeout(this.pollAuthInfo, 5000);
    }

    public render() {
        const {
            requests: {
                provinceListRequest: { pending: provincePending },
                districtListRequest: { pending: districtPending },
                municipalityListRequest: { pending: municipalityPending },
                wardListRequest: { pending: wardListPending },
                hazardTypesRequest: { pending: hazardTypePending },
            },
            mapStyle,
        } = this.props;

        const pending = (
            provincePending
            || districtPending
            || municipalityPending
            || wardListPending
            || hazardTypePending
        );

        return (
            <Multiplexer
                pending={pending}
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
