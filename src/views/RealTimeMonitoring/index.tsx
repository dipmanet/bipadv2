import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import Message from '#rscv/Message';
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

import RainIcon from '#resources/icons/Rain.svg';
import RiverIcon from '#resources/icons/Wave.svg';
import EarthquakeIcon from '#resources/icons/Earthquake.svg';
import PollutionIcon from '#resources/icons/AirQuality.svg';
import FireIcon from '#resources/icons/Forest-fire.svg';

import Map from './Map';
import RealTimeMonitoringFilter from './Filter';
import MiniRiverWatch from './MiniRiverWatch';
import MiniRainWatch from './MiniRainWatch';

import styles from './styles.scss';

interface State {
    showRainWatch: boolean;
    showRiverWatch: boolean;
    activeView?: ActiveView;
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
    otherSourceList: PageType.OtherSource[];
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
            // FIXME: obsolete
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

type ActiveView = 'rainwatch' | 'riverwatch';

class RealTimeMonitoring extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeView: 'rainwatch',
            showRainWatch: true,
            showRiverWatch: true,
        };
    }

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
        const showStreamflow = otherSources && otherSources.findIndex(v => v === 6) !== -1;

        return (
            <>
                {(showRain || showRiver) && (
                    <div className={styles.legendContainer}>
                        <h4 className={styles.heading}>
                            Rain & River
                        </h4>
                        <div className={styles.content}>
                            <div className={styles.legend}>
                                <div>
                                    <img
                                        className={styles.legendIcon}
                                        src={RainIcon}
                                        height={16}
                                        width={16}
                                        alt="Rain"
                                    />
                                    Rain
                                </div>
                                <div>
                                    <img
                                        className={styles.legendIcon}
                                        src={RiverIcon}
                                        height={16}
                                        width={16}
                                        alt="River"
                                    />
                                    River
                                </div>
                            </div>
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
                        <div className={styles.legend}>
                            <img
                                className={styles.legendIcon}
                                src={EarthquakeIcon}
                                height={16}
                                width={16}
                                alt="Earthquake"
                            />
                            Earthquake
                        </div>
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
                        <div className={styles.legend}>
                            <img
                                className={styles.legendIcon}
                                src={PollutionIcon}
                                height={16}
                                width={16}
                                alt="Pollution"
                            />
                            Pollution
                        </div>
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
                        <div>
                            <img
                                className={styles.legendIcon}
                                src={FireIcon}
                                height={16}
                                width={16}
                                alt="Forest Fire"
                            />
                            Forest Fire
                        </div>
                    </div>
                )}
            </>
        );
    }


    private handleRiverWatchButtonClick = () => {
        this.setState({ activeView: 'riverwatch' });
    }

    private handleRainWatchButtonClick = () => {
        this.setState({ activeView: 'rainwatch' });
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
                otherSources,
            },
            realTimeSourceList,
            otherSourceList,
        } = this.props;
        const {
            activeView,
        } = this.state;

        const showEarthquake = otherSources && otherSources.findIndex(v => v === 1) !== -1;
        const showRiver = realtimeSources && realtimeSources.findIndex(v => v === 2) !== -1;
        const showRain = realtimeSources && realtimeSources.findIndex(v => v === 3) !== -1;
        const showFire = otherSources && otherSources.findIndex(v => v === 4) !== -1;
        const showPollution = otherSources && otherSources.findIndex(v => v === 5) !== -1;
        const showStreamflow = otherSources && otherSources.findIndex(v => v === 6) !== -1;

        const LegendView = this.renderLegend;

        const pending = (
            rainPending || riverPending || earthquakePending || firePending || pollutionPending
        );

        let validActiveView = activeView;
        if (!showRain && !showRiver) {
            validActiveView = undefined;
        } else if (!showRain) {
            validActiveView = 'riverwatch';
        } else if (!showRiver) {
            validActiveView = 'rainwatch';
        }

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
                    showStreamFlow={showStreamflow}
                />
                <Page
                    leftContentContainerClassName={styles.left}
                    leftContent={(
                        <>
                            <header className={styles.header}>
                                <div className={styles.tabs}>
                                    {showRain && (
                                        <div
                                            className={_cs(styles.tab, validActiveView === 'rainwatch' && styles.active)}
                                            onClick={this.handleRainWatchButtonClick}
                                            role="presentation"
                                        >
                                            <div className={styles.value}>
                                                {realTimeRainList.length}
                                            </div>
                                            <div className={styles.title}>
                                                <div
                                                    className={_cs(styles.icon, styles.alertIcon)}
                                                />
                                                <div className={styles.text}>
                                                    Rain watch
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {showRiver && (
                                        <div
                                            className={_cs(styles.tab, validActiveView === 'riverwatch' && styles.active)}
                                            onClick={this.handleRiverWatchButtonClick}
                                            role="presentation"
                                        >
                                            <div className={styles.value}>
                                                {realTimeRiverList.length}
                                            </div>
                                            <div className={styles.title}>
                                                <div
                                                    className={_cs(styles.icon, styles.eventIcon)}
                                                />
                                                <div className={styles.text}>
                                                    River watch
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.actions}>
                                    {/*
                                    <ModalButton
                                        title="Show data in tabular format"
                                        className={styles.showTableButton}
                                        iconName="table"
                                        transparent
                                        modal={<AlertTableModal alertList={alertList} />}
                                    />
                                  */}
                                </div>
                            </header>
                            <div className={styles.content}>
                                {validActiveView === 'riverwatch' && (
                                    <MiniRiverWatch
                                        className={styles.riverwatchList}
                                        realTimeRiver={realTimeRiverList}
                                    />
                                )}
                                {validActiveView === 'rainwatch' && (
                                    <MiniRainWatch
                                        className={styles.rainwatchList}
                                        realTimeRain={realTimeRainList}
                                    />
                                )}
                                {!validActiveView && (
                                    <div
                                        className={styles.message}
                                    >
                                        Select rain or river to see details
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    rightContentContainerClassName={styles.right}
                    rightContent={(
                        <RealTimeMonitoringFilter
                            realTimeSourceList={realTimeSourceList}
                            otherSourceList={otherSourceList}
                        />
                    )}
                    mainContentContainerClassName={_cs(styles.main, 'map-legend-container')}
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
