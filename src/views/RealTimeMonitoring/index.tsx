import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    setRealTimeRainListAction,
    setRealTimeRiverListAction,
    setRealTimeEarthquakeListAction,
} from '#actionCreators';
import {
    realTimeRiverListSelector,
    realTimeRainListSelector,
    realTimeEarthquakeListSelector,
} from '#selectors';

import Map from './Map';

import styles from './styles.scss';

interface State {}
interface Params {}
interface OwnProps {}
interface PropsFromDispatch {
    setRealTimeRainList: typeof setRealTimeRainListAction;
    setRealTimeRiverList: typeof setRealTimeRiverListAction;
    setRealTimeEarthquakeList: typeof setRealTimeEarthquakeListAction;
}

interface PropsFromState {
    realTimeRainList: PageType.RealTimeRain[];
    realTimeRiverList: PageType.RealTimeRiver[];
    realTimeEarthquakeList: PageType.RealTimeEarthquake[];
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    realTimeRainList: realTimeRainListSelector(state),
    realTimeRiverList: realTimeRiverListSelector(state),
    realTimeEarthquakeList: realTimeEarthquakeListSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setRealTimeRainList: params => dispatch(setRealTimeRainListAction(params)),
    setRealTimeRiverList: params => dispatch(setRealTimeRiverListAction(params)),
    setRealTimeEarthquakeList: params => dispatch(setRealTimeEarthquakeListAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimeRainRequest: {
        url: '/rain/',
        method: methods.GET,
        onSuccess: ({ response, props: { setRealTimeRainList } }) => {
            interface Response { results: PageType.RealTimeRain[] }
            const { results: realTimeRainList = [] } = response as Response;
            setRealTimeRainList({ realTimeRainList });
        },
        onMount: true,
        // FIXME: write schema
    },
    realTimeRiverRequest: {
        url: '/river/',
        method: methods.GET,
        onSuccess: ({ response, props: { setRealTimeRiverList } }) => {
            interface Response { results: PageType.RealTimeRiver[] }
            const { results: realTimeRiverList = [] } = response as Response;
            setRealTimeRiverList({ realTimeRiverList });
        },
        onMount: true,
        // FIXME: write schema
    },
    realTimeEarthquakeRequest: {
        url: '/earthquake/',
        method: methods.GET,
        onSuccess: ({ response, props: { setRealTimeEarthquakeList } }) => {
            interface Response { results: PageType.RealTimeEarthquake[] }
            const { results: realTimeEarthquakeList = [] } = response as Response;
            setRealTimeEarthquakeList({ realTimeEarthquakeList });
        },
        onMount: true,
        // FIXME: write schema
    },
};

class RealTimeMonitoring extends React.PureComponent <Props, State> {
    public render() {
        const {
            realTimeRainList,
            realTimeRiverList,
            realTimeEarthquakeList,
            requests: {
                realTimeRainRequest: { pending: rainPending },
                realTimeRiverRequest: { pending: riverPending },
                realTimeEarthquakeRequest: { pending: earthquakePending },
            },
        } = this.props;

        return (
            <Map
                realTimeRainList={realTimeRainList}
                realTimeRiverList={realTimeRiverList}
                realTimeEarthquakeList={realTimeEarthquakeList}
            />
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(RealTimeMonitoring);
