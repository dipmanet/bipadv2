import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import Legend from '#rscz/Legend';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { transformDateRangeFilterParam } from '#utils/transformations';

import {
    setRealTimeRainListAction,
    setRealTimeRiverListAction,
    setRealTimeEarthquakeListAction,
    setRealTimeFireListAction,
    setRealTimePollutionListAction,
} from '#actionCreators';

import {
    realTimeRiverListSelector,
    realTimeRainListSelector,
    realTimeEarthquakeListSelector,
    realTimeFireListSelector,
    realTimePollutionListSelector,
    realTimeFiltersValuesSelector,
    realTimeSourceListSelector,
    otherSourceListSelector,
} from '#selectors';

import Page from '#components/Page';
import Loading from '#components/Loading';

import Map from './Map';
import RealTimeMonitoringFilter from './Filter';
import MiniRiverWatch from './MiniRiverWatch';
import MiniRainWatch from './MiniRainWatch';

import styles from './styles.scss';

interface State {
    showRainWatch: boolean;
    showRiverWatch: boolean;
}
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
    realTimeFireList: PageType.RealTimeFire[];
    realTimePollutionList: PageType.RealTimePollution[];
    realTimeSourceList: PageType.RealTimeSource[];
    filters: PageType.FiltersWithRegion['faramValues'];
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    realTimeRainList: realTimeRainListSelector(state),
    realTimeRiverList: realTimeRiverListSelector(state),
    realTimeEarthquakeList: realTimeEarthquakeListSelector(state),
    realTimeFireList: realTimeFireListSelector(state),
    realTimePollutionList: realTimePollutionListSelector(state),
    realTimeSourceList: realTimeSourceListSelector(state),
    otherSourceList: otherSourceListSelector(state),
    filters: realTimeFiltersValuesSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setRealTimeRainList: params => dispatch(setRealTimeRainListAction(params)),
    setRealTimeRiverList: params => dispatch(setRealTimeRiverListAction(params)),
    setRealTimeEarthquakeList: params => dispatch(setRealTimeEarthquakeListAction(params)),
    setRealTimeFireList: params => dispatch(setRealTimeFireListAction(params)),
    setRealTimePollutionList: params => dispatch(setRealTimePollutionListAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimeRainRequest: {
        url: '/rain/',
        method: methods.GET,
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
        extras: {
            schemaName: 'rainResponse',
        },
    },
    realTimeRiverRequest: {
        url: '/river/',
        method: methods.GET,
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
        extras: {
            schemaName: 'riverResponse',
        },
    },
    realTimeEarthquakeRequest: {
        url: '/earthquake/',
        method: methods.GET,
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
        extras: {
            schemaName: 'earthquakeResponse',
        },
    },
    realTimeFireRequest: {
        url: '/fire/',
        method: methods.GET,
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
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
        },
        onMount: true,
        extras: {
            schemaName: 'fireResponse',
        },
    },
    realTimePollutionRequest: {
        url: '/pollution/',
        method: methods.GET,
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
        }),
        onSuccess: ({ response, props: { setRealTimePollutionList } }) => {
            interface Response { results: PageType.RealTimePollution[] }
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
        },
        onMount: true,
        extras: {
            schemaName: 'pollutionResponse',
        },
    },
};

const rainLegendItems = [
    { icon: '■', color: '#7CB342', label: 'Below Warning Level' },
    { icon: '■', color: '#FDD835', label: 'Above Warning Level' },
    { icon: '■', color: '#e53935', label: 'Above Danger Level' },
];

const riverLegendItems = [
    { icon: '●', color: '#7CB342', label: 'Steady & Below Warning Level' },
    { icon: '●', color: '#FDD835', label: 'Steady & Above Warning Level' },
    { icon: '●', color: '#e53935', label: 'Steady & Above Danger Level' },

    { icon: '▲', color: '#7CB342', label: 'Rising & Below Warning Level' },
    { icon: '▲', color: '#FDD835', label: 'Rising & Above Warning Level' },
    { icon: '▲', color: '#e53935', label: 'Rising & Above Danger Level' },

    { icon: '▼', color: '#7CB342', label: 'Falling & Below Warning Level' },
    { icon: '▼', color: '#FDD835', label: 'Falling & Above Warning Level' },
    { icon: '▼', color: '#e53935', label: 'Falling & Below Danger Level' },

];

const earthquakeLegendItems = [
    { icon: '●', color: '#a50f15', label: 'Great (>= 8)' },
    { icon: '●', color: '#de2d26', label: 'Major (>= 7)' },
    { icon: '●', color: '#fb6a4a', label: 'Strong (>= 6)' },
    { icon: '●', color: '#fc9272', label: 'Moderate (>= 5)' },
    { icon: '●', color: '#fcbba1', label: 'Light (>= 4)' },
    { icon: '●', color: '#fee5d9', label: 'Minor (>= 3)' },
];

const pollutionLegendItems = [
    { icon: '●', color: '#009966', label: 'Good (<= 12)' },
    { icon: '●', color: '#ffde33', label: 'Moderate (<= 35.4)' },
    { icon: '●', color: '#ff9933', label: 'Unhealthy for Sensitive Groups (<= 55.4)' },
    { icon: '●', color: '#cc0033', label: 'Unhealthy (<= 150.4)' },
    { icon: '●', color: '#660099', label: 'Very Unhealthy (<= 350.4)' },
    { icon: '●', color: '#7e0023', label: 'Hazardous (<= 500.4)' },
];

const fireLegendItems = [
    { icon: '◆', color: '#e64a19', label: 'Forest Fire' },
];

const rainAndRiverSymbolItems = [
    { icon: '■ ', color: '#414141', label: 'Rain' },
    { icon: '●', color: '#414141', label: 'River steady' },
    { icon: '▲', color: '#414141', label: 'River rising' },
    { icon: '▼', color: '#414141', label: 'River falling' },
];

const itemSelector = (d: { label: string }) => d.label;
const iconSelector = (d: { icon: string }) => d.icon;
const legendColorSelector = (d: { color: string }) => d.color;
const legendLabelSelector = (d: { label: string }) => d.label;

class RealTimeMonitoring extends React.PureComponent <Props, State> {
    private renderLegend = () => {
        const {
            filters: {
                realtimeSources,
                otherSources,
            },
        } = this.props;

        const showRiver = realtimeSources && realtimeSources.findIndex(v => v === 2) !== -1;
        const showRain = realtimeSources && realtimeSources.findIndex(v => v === 3) !== -1;
        const showEarthquake = otherSources && otherSources.findIndex(v => v === 1) !== -1;
        const showFire = otherSources && otherSources.findIndex(v => v === 4) !== -1;
        const showPollution = otherSources && otherSources.findIndex(v => v === 5) !== -1;

        return (
            <>
                {(showRain || showRiver) && (
                    <div className={_cs('map-legend-container', styles.legendContainer)}>
                        <h4 className={styles.heading}>
                            Rain & River
                        </h4>
                        <div className={styles.content}>
                            <Legend
                                className={styles.legend}
                                data={rainAndRiverSymbolItems}
                                itemClassName={styles.legendItem}
                                keySelector={itemSelector}
                                iconSelector={iconSelector}
                                labelSelector={legendLabelSelector}
                                colorSelector={legendColorSelector}
                                emptyComponent={null}
                            />
                            <div className={styles.colorLegend}>
                                <div className={_cs(styles.item, styles.belowWarning)}>
                                    Below warning
                                </div>
                                <div className={_cs(styles.item, styles.aboveWarning)}>
                                    Above warning
                                </div>
                                <div className={_cs(styles.item, styles.aboveDanger)}>
                                    Above danger
                                </div>
                            </div>
                        </div>
                    </div>

                )}
                { showEarthquake && (
                    <div className={styles.legendContainer}>
                        <h5 className={styles.heading}>
                            Earthquake (Richter Scale)
                        </h5>
                        <Legend
                            className={styles.legend}
                            data={earthquakeLegendItems}
                            itemClassName={styles.legendItem}
                            keySelector={itemSelector}
                            iconSelector={iconSelector}
                            labelSelector={legendLabelSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                    </div>
                )}
                { showPollution && (
                    <div className={styles.legendContainer}>
                        <h5 className={styles.heading}>
                            Pollution (PM&nbsp;
                            <sub>
                                2.5
                            </sub>
                            )
                        </h5>
                        <Legend
                            className={styles.legend}
                            data={pollutionLegendItems}
                            itemClassName={styles.legendItem}
                            keySelector={itemSelector}
                            iconSelector={iconSelector}
                            labelSelector={legendLabelSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                    </div>
                )}
                { showFire && (
                    <div className={styles.legendContainer}>
                        <h5 className={styles.heading}>
                            Forest Fire
                        </h5>
                        <Legend
                            className={styles.legend}
                            data={fireLegendItems}
                            itemClassName={styles.legendItem}
                            keySelector={itemSelector}
                            iconSelector={iconSelector}
                            labelSelector={legendLabelSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                    </div>
                )}
            </>
        );
    }

    public render() {
        const {
            realTimeRainList,
            realTimeRiverList,
            realTimeEarthquakeList,
            realTimeFireList,
            realTimePollutionList,
            requests: {
                realTimeRainRequest: { pending: rainPending },
                realTimeRiverRequest: { pending: riverPending },
                realTimeEarthquakeRequest: { pending: earthquakePending },
                realTimeFireRequest: { pending: firePending },
                realTimePollutionRequest: { pending: pollutionPending },
            },
            filters: {
                realtimeSources,
            },
            realTimeSourceList,
            otherSourceList,
        } = this.props;

        const showEarthquake = realtimeSources && realtimeSources.findIndex(v => v === 1) !== -1;
        const showRiver = realtimeSources && realtimeSources.findIndex(v => v === 2) !== -1;
        const showRain = realtimeSources && realtimeSources.findIndex(v => v === 3) !== -1;
        const showFire = realtimeSources && realtimeSources.findIndex(v => v === 4) !== -1;
        const showPollution = realtimeSources && realtimeSources.findIndex(v => v === 5) !== -1;
        const LegendView = this.renderLegend;

        const pending = (
            rainPending || riverPending || earthquakePending || firePending || pollutionPending
        );

        return (
            <>
                <Loading pending={pending} />
                <Map
                    realTimeRainList={realTimeRainList}
                    realTimeRiverList={realTimeRiverList}
                    realTimeEarthquakeList={realTimeEarthquakeList}
                    realTimeFireList={realTimeFireList}
                    realTimePollutionList={realTimePollutionList}
                    showRain={showRain}
                    showRiver={showRiver}
                    showEarthquake={showEarthquake}
                    showFire={showFire}
                    showPollution={showPollution}
                />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={(
                        <>
                            <MiniRiverWatch
                                className={styles.miniRiverWatch}
                                realTimeRiver={realTimeRiverList}
                            />
                            <MiniRainWatch
                                className={styles.miniRainWatch}
                                realTimeRain={realTimeRainList}
                            />
                        </>
                    )}
                    rightContentClassName={styles.right}
                    rightContent={(
                        <RealTimeMonitoringFilter
                            realTimeSourceList={realTimeSourceList}
                            otherSourceList={otherSourceList}
                        />
                    )}
                    mainContentClassName={styles.main}
                    mainContent={(
                        <LegendView />
                    )}
                />
            </>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(RealTimeMonitoring);
