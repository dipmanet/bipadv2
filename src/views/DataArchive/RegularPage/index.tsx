import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import Page from '#components/Page';
import LeftPane from '../LeftPane';
import EarthquakeMap from '../Map/Earthquake';
import PollutionMap from '../Map/Pollution';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import * as PageType from '#store/atom/page/types';

import { FiltersElement } from '#types';

import { AppState } from '#store/types';

import {
    setRealTimeRainListAction,
    setRealTimeRiverListAction,
    setRealTimeEarthquakeListAction,
    setRealTimeFireListAction,
    setRealTimePollutionListAction,
} from '#actionCreators';

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

import { transformDateRangeFilterParam, transformDataRangeToFilter } from '#utils/transformations';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Params {}
interface OwnProps {
    chosenOption: Options;
    handleOptionClick: Function;
}

interface PropsFromDispatch {
    setRealTimeRainList: typeof setRealTimeRainListAction;
    setRealTimeRiverList: typeof setRealTimeRiverListAction;
    setRealTimeEarthquakeList: typeof setRealTimeEarthquakeListAction;
    setRealTimeFireList: typeof setRealTimeFireListAction;
    setRealTimePollutionList: typeof setRealTimePollutionListAction;
}

interface PropsFromState {
    rainList: PageType.RealTimeRain[];
    riverList: PageType.RealTimeRiver[];
    earthquakeList: PageType.RealTimeEarthquake[];
    filters: PageType.FiltersWithRegion['faramValues'];
    globalFilters: FiltersElement;
    fireList: PageType.RealTimeFire[];
    pollutionList: PageType.RealTimePollution[];
    sourceList: PageType.RealTimeSource[];
    otherSourceList: PageType.OtherSource[];
}

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    rainList: realTimeRainListSelector(state),
    riverList: realTimeRiverListSelector(state),
    earthquakeList: realTimeEarthquakeListSelector(state),
    filters: realTimeFiltersValuesSelector(state),
    globalFilters: filtersSelector(state),
    fireList: realTimeFireListSelector(state),
    pollutionList: realTimePollutionListSelector(state),
    sourceList: realTimeSourceListSelector(state),
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

interface State {
    data: [];
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
    // realTimeEarthquakeRequest: {
    //     url: '/earthquake/',
    //     method: methods.GET,
    //     query: ({ props: { filters, globalFilters } }) => ({
    //         ...transformDateRangeFilterParam(filters, 'incident_on'),
    //         ...transformDataRangeToFilter(globalFilters.dataDateRange, 'event__on'),
    //     }),
    //     onSuccess: ({ response, props: { setRealTimeEarthquakeList } }) => {
    //         interface Response { results: PageType.RealTimeEarthquake[] }
    //         const { results: realTimeEarthquakeList = [] } = response as Response;
    //         setRealTimeEarthquakeList({ realTimeEarthquakeList });
    //     },
    //     onPropsChanged: {
    //         filters: ({
    //             props: { filters: { region } },
    //             prevProps: { filters: {
    //                 region: prevRegion,
    //             } },
    //         }) => region !== prevRegion,
    //         globalFilters: true,
    //     },
    //     onMount: true,
    //     extras: {
    //         schemaName: 'earthquakeResponse',
    //     },
    // },
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
    // realTimePollutionRequest: {
    //     url: '/pollution/',
    //     method: methods.GET,
    //     query: ({ props: { filters, globalFilters } }) => ({
    //         ...transformDateRangeFilterParam(filters, 'incident_on'),
    //         ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
    //     }),
    //     onSuccess: ({ response, props: { setRealTimePollutionList } }) => {
    //         interface Response { results: PageType.DataArchivePollution[] }
    //         const { results: realTimePollutionList = [] } = response as Response;
    //         setRealTimePollutionList({ realTimePollutionList });
    //     },
    //     onPropsChanged: {
    //         filters: ({
    //             props: { filters: { region } },
    //             prevProps: { filters: {
    //                 region: prevRegion,
    //             } },
    //         }) => region !== prevRegion,
    //         globalFilters: true,
    //     },
    //     onMount: true,
    //     extras: {
    //         schemaName: 'pollutionResponse',
    //     },
    // },
};

class RegularPage extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    private setData = (data: []) => {
        this.setState({ data });
    }

    public render() {
        const {
            rainList,
            riverList,
            earthquakeList,
            fireList,
            pollutionList,
            requests,
            chosenOption,
            handleOptionClick,
        } = this.props;
        const { data } = this.state;
        const contextProps: DataArchiveContextProps = {
            chosenOption,
            handleOptionClick,
            setData: this.setData,
            data,
        };
        return (
            <DataArchiveContext.Provider value={contextProps}>
                <div className="regularPage">
                    {chosenOption === 'Earthquake' && (
                        <EarthquakeMap
                            data={data}
                            chosenOption={chosenOption}
                        />
                    )}
                    {chosenOption === 'Pollution' && (
                        <PollutionMap
                            data={data}
                            chosenOption={chosenOption}
                        />
                    )}
                    <Page
                        leftContent={(
                            <DataArchiveContext.Provider value={contextProps}>
                                <LeftPane
                                    rainList={rainList}
                                    riverList={riverList}
                                    earthquakeList={earthquakeList}
                                    fireList={fireList}
                                    pollutionList={pollutionList}
                                    chosenOption={chosenOption}
                                    handleOptionClick={handleOptionClick}
                                />
                            </DataArchiveContext.Provider>
                        )}
                    />
                </div>
            </DataArchiveContext.Provider>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(RegularPage);
