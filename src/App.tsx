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
} from '#actionCreators';
import {
    mapStyleSelector,
} from '#selectors';

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
        onMount: true,
    },
};

// NOTE: BrowserRouter is acting weird so not using React.PureComponent
/* Loads required info from server */
// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<Props, State> {
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
