import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import styles from './styles.scss';

import {
    realTimeRainListSelector,
    realTimeRiverListSelector,
    realTimeFiltersValuesSelector,
    realTimeEarthquakeListSelector,
    realTimeFireListSelector,
    realTimePollutionListSelector,
    realTimeSourceListSelector,
    otherSourceListSelector,
    filtersSelector,
} from '#selectors';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    isAnyRequestPending,
} from '#utils/request';

import Loading from '#components/Loading';

import * as PageType from '#store/atom/page/types';

import { transformDateRangeFilterParam, transformDataRangeToFilter } from '#utils/transformations';

import { FiltersElement } from '#types';

import { AppState } from '#store/types';
import {
    setRealTimeRainListAction,
    setRealTimeRiverListAction,
    setRealTimeEarthquakeListAction,
    setRealTimeFireListAction,
    setRealTimePollutionListAction,
} from '#actionCreators';

import Page from '#components/Page';
import LandingPage from './LandingPage';
import RegularPage from './RegularPage';

interface Params {}
interface OwnProps {}

interface PropsFromDispatch {
    setRealTimeRainList: typeof setRealTimeRainListAction;
    setRealTimeRiverList: typeof setRealTimeRiverListAction;
    setRealTimeEarthquakeList: typeof setRealTimeEarthquakeListAction;
    setRealTimeFireList: typeof setRealTimeFireListAction;
    setRealTimePollutionList: typeof setRealTimePollutionListAction;
}

interface PropsFromState {
    realTimeRainList: PageType.RealTimeRain[];
    realTimeRiverList: PageType.RealTimeRiver[];
    realTimeEarthquakeList: PageType.RealTimeEarthquake[];
    filters: PageType.FiltersWithRegion['faramValues'];
    globalFilters: FiltersElement;
    realTimeFireList: PageType.RealTimeFire[];
    realTimePollutionList: PageType.RealTimePollution[];
    realTimeSourceList: PageType.RealTimeSource[];
    otherSourceList: PageType.OtherSource[];
}

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    realTimeRainList: realTimeRainListSelector(state),
    realTimeRiverList: realTimeRiverListSelector(state),
    realTimeEarthquakeList: realTimeEarthquakeListSelector(state),
    filters: realTimeFiltersValuesSelector(state),
    globalFilters: filtersSelector(state),
    realTimeFireList: realTimeFireListSelector(state),
    realTimePollutionList: realTimePollutionListSelector(state),
    realTimeSourceList: realTimeSourceListSelector(state),
    otherSourceList: otherSourceListSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setRealTimeRainList: params => dispatch(setRealTimeRainListAction(params)),
    setRealTimeRiverList: params => dispatch(setRealTimeRiverListAction(params)),
    setRealTimeEarthquakeList: params => dispatch(setRealTimeEarthquakeListAction(params)),
    setRealTimeFireList: params => dispatch(setRealTimeFireListAction(params)),
    setRealTimePollutionList: params => dispatch(setRealTimePollutionListAction(params)),
});

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface State {
    showInitial: boolean;
    chosenOption?: Options;
}

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimeRainRequest: {
        url: '/rain/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            // FIXME: obsolete
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
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
            globalFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'rainResponse',
        },
    },
    realTimeRiverRequest: {
        url: '/river/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
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
            globalFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'riverResponse',
        },
    },
    realTimeEarthquakeRequest: {
        url: '/earthquake/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            ...transformDataRangeToFilter(globalFilters.dataDateRange, 'event__on'),
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
            globalFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'earthquakeResponse',
        },
    },
    realTimeFireRequest: {
        url: '/fire/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            ...transformDataRangeToFilter(globalFilters.dataDateRange, 'event_on'),
        }),
        onSuccess: ({ response, props: { setRealTimeFireList } }) => {
            interface Response { results: PageType.RealTimeFire[] }
            const { results: realTimeFireList = [] } = response as Response;

            setRealTimeFireList({ realTimeFireList });
        },
        onPropsChanged: {
            filters: ({
                props: { filters: { region } },
                prevProps: { filters: {
                    region: prevRegion,
                } },
            }) => region !== prevRegion,
            globalFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'fireResponse',
        },
    },
    realTimePollutionRequest: {
        url: '/pollution/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
        }),
        onSuccess: ({ response, props: { setRealTimePollutionList } }) => {
            interface Response { results: PageType.DataArchivePollution[] }
            const { results: realTimePollutionList = [] } = response as Response;
            setRealTimePollutionList({ realTimePollutionList });
        },
        onPropsChanged: {
            filters: ({
                props: { filters: { region } },
                prevProps: { filters: {
                    region: prevRegion,
                } },
            }) => region !== prevRegion,
            globalFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'pollutionResponse',
        },
    },
};

class DataArchive extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            showInitial: true,
            chosenOption: undefined,
        };
    }

    private handleOptionClick = (option: Options) => {
        this.setState({ showInitial: false, chosenOption: option });
    }

    public render() {
        const { showInitial, chosenOption } = this.state;
        const { requests } = this.props;
        const pending = isAnyRequestPending(requests);

        return (
            <>
                <Loading pending={pending} />
                {showInitial && (
                    <Page
                        hideFilter
                        hideMap
                        mainContentContainerClassName={styles.initialContainer}
                        mainContent={
                            (<LandingPage handleOptionClick={this.handleOptionClick} />)
                        }
                    />
                )}
                {!showInitial && (
                    <RegularPage
                        handleOptionClick={this.handleOptionClick}
                        chosenOption={chosenOption}
                    />
                )}
            </>
        );
    }
}
const request = {};
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(request),
)(DataArchive);
