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
} from '#request';

import { transformDateRangeFilterParam } from '#utils/transformations';

import {
    setRealTimeRainListAction,
    setRealTimeRiverListAction,
    setRealTimeEarthquakeListAction,
} from '#actionCreators';
import {
    realTimeRiverListSelector,
    realTimeRainListSelector,
    realTimeEarthquakeListSelector,
    realTimeFiltersSelector,
} from '#selectors';

import Page from '#components/Page';

import Map from './Map';
import RealTimeMonitoringFilter from './Filter';

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
    filters: realTimeFiltersSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setRealTimeRainList: params => dispatch(setRealTimeRainListAction(params)),
    setRealTimeRiverList: params => dispatch(setRealTimeRiverListAction(params)),
    setRealTimeEarthquakeList: params => dispatch(setRealTimeEarthquakeListAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimeRainRequest: {
        url: '/rain/',
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
        }),
        onSuccess: ({ response, props: { setRealTimeRainList } }) => {
            interface Response { results: PageType.RealTimeRain[] }
            const { results: realTimeRainList = [] } = response as Response;
            setRealTimeRainList({ realTimeRainList });
        },
        onPropsChanged: {
            filters: ({
                props: { filters: { region } },
                prevProps: { filters: {
                    region: prevRegion,
                } },
            }) => region !== prevRegion,
        },
        onMount: true,
        // FIXME: write schema
    },
    realTimeRiverRequest: {
        url: '/river/',
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
        }),
        onSuccess: ({ response, props: { setRealTimeRiverList } }) => {
            interface Response { results: PageType.RealTimeRiver[] }
            const { results: realTimeRiverList = [] } = response as Response;
            setRealTimeRiverList({ realTimeRiverList });
        },
        onPropsChanged: {
            filters: ({
                props: { filters: { region } },
                prevProps: { filters: {
                    region: prevRegion,
                } },
            }) => region !== prevRegion,
        },
        onMount: true,
        // FIXME: write schema
    },
    realTimeEarthquakeRequest: {
        url: '/earthquake/',
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
        }),
        onSuccess: ({ response, props: { setRealTimeEarthquakeList } }) => {
            interface Response { results: PageType.RealTimeEarthquake[] }
            const { results: realTimeEarthquakeList = [] } = response as Response;
            setRealTimeEarthquakeList({ realTimeEarthquakeList });
        },
        onPropsChanged: {
            filters: ({
                props: { filters: { region } },
                prevProps: { filters: {
                    region: prevRegion,
                } },
            }) => region !== prevRegion,
        },
        onMount: true,
        // FIXME: write schema
    },
};

const realTimeList = [
    { id: 1, title: 'earthquake' },
    { id: 2, title: 'river' },
    { id: 3, title: 'rain' },
];

class RealTimeMonitoring extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            selectedRealTimeList: [],
        };
    }

    private handleRealTimeListSelection = (id) => {
        console.warn('id', id);
        this.setState({
            selectedRealTimeList: id,
        });
    }

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

        const { selectedRealTimeList } = this.state;
        return (
            <React.Fragment>
                <Map
                    realTimeRainList={realTimeRainList}
                    realTimeRiverList={realTimeRiverList}
                    realTimeEarthquakeList={realTimeEarthquakeList}
                    selectedRealTimeList={selectedRealTimeList}
                />
                <Page
                    rightContentClassName={styles.right}
                    rightContent={
                        <RealTimeMonitoringFilter
                            rainPending={rainPending}
                            riverPending={riverPending}
                            earthquakePending={earthquakePending}
                            selectedRealTimeList={selectedRealTimeList}
                            realTimeList={realTimeList}
                            handleRealTimeListSelection={this.handleRealTimeListSelection}
                        />
                    }
                />
            </React.Fragment>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(RealTimeMonitoring);
