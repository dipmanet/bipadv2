import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import Message from '#rscv/Message';
import Legend from '#rscz/Legend';
import {
    rain24LegendItems,
    rain12LegendItems,
    rain6LegendItems,
    rain3LegendItems,
    rain1LegendItems,
    newRiverLegendItems,
    earthquakeLegendItems,
    forestFireLegendItems,
    pollutionLegendItems,
    noLegend,
} from './legendItems';
import { getAutoRealTimeRiverLegends, getPollutionLegends } from './utils';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';
import { FiltersElement, MapStateElement } from '#types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { transformDateRangeFilterParam, transformDataRangeToFilter, transformDataRangeLocaleToFilter } from '#utils/transformations';

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
    filtersSelector,
    realTimeDurationSelector,
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
import MiniEarthquake from './MiniEarthquake';
import MiniPollution from './MiniPollution';
import MiniFire from './MiniFire';

import styles from './styles.scss';
import {
    isAnyRequestPending,
} from '#utils/request';

interface State {
    activeView?: ActiveView;
    hoveredHazardId?: number;
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
    globalFilters: FiltersElement;
    duration: number;
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
    globalFilters: filtersSelector(state),
    duration: realTimeDurationSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setRealTimeRainList: params => dispatch(setRealTimeRainListAction(params)),
    setRealTimeRiverList: params => dispatch(setRealTimeRiverListAction(params)),
    setRealTimeEarthquakeList: params => dispatch(setRealTimeEarthquakeListAction(params)),
    setRealTimeFireList: params => dispatch(setRealTimeFireListAction(params)),
    setRealTimePollutionList: params => dispatch(setRealTimePollutionListAction(params)),
});

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimeRainRequest: {
        url: '/rain-stations/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            // FIXME: obsolete
            // ...transformDateRangeFilterParam(filters, 'incident_on'),
            // ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
            // ...transformDataRangeLocaleToFilter(globalFilters.dataDateRange, 'created_on'),
            latest: true,
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
            // ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
            ...transformDataRangeLocaleToFilter(globalFilters.dataDateRange, 'water_level_on'),
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
            // ...transformDataRangeToFilter(globalFilters.dataDateRange, 'event__on'),
            ...transformDataRangeLocaleToFilter(globalFilters.dataDateRange, 'event__on'),
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
            // ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
            // ...transformDataRangeLocaleToFilter(globalFilters.dataDateRange, 'event_on'),
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
        url: '/pollution-stations/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            // ...transformDateRangeFilterParam(filters, 'incident_on'),
            // ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
            // ...transformDataRangeLocaleToFilter(globalFilters.dataDateRange, 'created_on'),
            latest: true,
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
            globalFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'pollutionResponse',
        },
    },
};

const itemSelector = (d: { label: string }) => d.label;
// const iconSelector = (d: { icon: string }) => d.icon;
const radiusSelector = (d: { radius: number }) => d.radius;
const legendColorSelector = (d: { color: string }) => d.color;
const legendLabelSelector = (d: { label: string }) => d.label;
const classNameSelector = (d: { style: string }) => d.style;

const emptyHazardHoverAttributeList: MapStateElement[] = [];

type ActiveView = 'rainwatch' | 'riverwatch' | 'earthquake' | 'pollution' | 'fire' | undefined;

interface Source {
    id: number;
    title: ActiveView;
}

class RealTimeMonitoring extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeView: 'rainwatch',
            hoveredHazardId: undefined,
            source: undefined,
        };
    }

    private getHazardMapHoverAttributes = (hoveredHazardId: number | undefined, source: string) => {
        if (!hoveredHazardId) {
            return emptyHazardHoverAttributeList;
        }

        return [{
            id: hoveredHazardId,
            source,
            value: true,
        }];
    }
    /**
     *
     * @param realtimeSources List of which realtime sources is active
     * @param otherSources List of which realtime other sources is active
     */

    private setStateFromFilter = (realtimeSources?: number[], otherSources?: number[]) => {
        let availableFilter = -99;

        const sources: Source[] = [
            { id: 2, title: 'riverwatch' },
            { id: 3, title: 'rainwatch' },
        ];

        const othSources: Source[] = [
            { id: 1, title: 'earthquake' },
            { id: 4, title: 'fire' },
            { id: 5, title: 'pollution' },
            // { id: 6, title: 'streamflow' },
        ];

        const setFilterFromSources = () => {
            sources.forEach((source) => {
                if (availableFilter === source.id) {
                    this.setState({ activeView: source.title });
                }
            });
        };

        const setFilterFromOtherSources = () => {
            othSources.forEach((oSources) => {
                if (availableFilter === oSources.id) {
                    this.setState({ activeView: oSources.title });
                }
            });
        };

        if (realtimeSources && realtimeSources.length > 0) {
            // eslint-disable-next-line prefer-destructuring
            availableFilter = realtimeSources[0];
            setFilterFromSources();
        } else if (otherSources && otherSources.length > 0) {
            // eslint-disable-next-line prefer-destructuring
            availableFilter = otherSources[0];
            setFilterFromOtherSources();
        }

        // for streamFlow: REMOVE when leftpane is setup of it
        if (availableFilter === 6 && otherSources && otherSources.length > 1) {
            // eslint-disable-next-line prefer-destructuring
            availableFilter = otherSources[1];
            setFilterFromOtherSources();
        }
    }

    private renderLegend = () => {
        const {
            filters: {
                realtimeSources,
                otherSources,
            },
            realTimeRiverList,
            realTimePollutionList,
            duration,
        } = this.props;

        const showRiver = realtimeSources && realtimeSources.findIndex(v => v === 2) !== -1;
        const showRain = realtimeSources && realtimeSources.findIndex(v => v === 3) !== -1;
        const showEarthquake = otherSources && otherSources.findIndex(v => v === 1) !== -1;
        const showFire = otherSources && otherSources.findIndex(v => v === 4) !== -1;
        const showPollution = otherSources && otherSources.findIndex(v => v === 5) !== -1;
        const showStreamflow = otherSources && otherSources.findIndex(v => v === 6) !== -1;

        const autoRiverLegends = getAutoRealTimeRiverLegends(
            realTimeRiverList, newRiverLegendItems,
        );
        const autoPollutionLegends = getPollutionLegends(
            realTimePollutionList,
            pollutionLegendItems,
        );
        return (
            <>
                {showRain && (
                    <div className={styles.legendContainer}>
                        <header className={styles.header}>
                            <ScalableVectorGraphics
                                className={styles.legendIcon}
                                src={RainIcon}
                                alt="Rain"
                            />
                            <h4 className={styles.heading}>
                                Rain
                            </h4>
                        </header>
                        {duration === 24
                        && (
                            <Legend
                                className={styles.legend}
                                data={rain24LegendItems}
                                itemClassName={styles.legendItem}
                                keySelector={itemSelector}
                            // iconSelector={iconSelector}
                                labelSelector={legendLabelSelector}
                                symbolClassNameSelector={classNameSelector}
                                colorSelector={legendColorSelector}
                                emptyComponent={null}
                            />
                        )
                        }
                        {duration === 12
                        && (
                            <Legend
                                className={styles.legend}
                                data={rain12LegendItems}
                                itemClassName={styles.legendItem}
                                keySelector={itemSelector}
                            // iconSelector={iconSelector}
                                labelSelector={legendLabelSelector}
                                symbolClassNameSelector={classNameSelector}
                                colorSelector={legendColorSelector}
                                emptyComponent={null}
                            />
                        )
                        }
                        {duration === 6
                        && (
                            <Legend
                                className={styles.legend}
                                data={rain6LegendItems}
                                itemClassName={styles.legendItem}
                                keySelector={itemSelector}
                            // iconSelector={iconSelector}
                                labelSelector={legendLabelSelector}
                                symbolClassNameSelector={classNameSelector}
                                colorSelector={legendColorSelector}
                                emptyComponent={null}
                            />
                        )
                        }
                        {duration === 3
                        && (
                            <Legend
                                className={styles.legend}
                                data={rain3LegendItems}
                                itemClassName={styles.legendItem}
                                keySelector={itemSelector}
                            // iconSelector={iconSelector}
                                labelSelector={legendLabelSelector}
                                symbolClassNameSelector={classNameSelector}
                                colorSelector={legendColorSelector}
                                emptyComponent={null}
                            />
                        )
                        }
                        {duration === 1
                        && (
                            <Legend
                                className={styles.legend}
                                data={rain1LegendItems}
                                itemClassName={styles.legendItem}
                                keySelector={itemSelector}
                            // iconSelector={iconSelector}
                                labelSelector={legendLabelSelector}
                                symbolClassNameSelector={classNameSelector}
                                colorSelector={legendColorSelector}
                                emptyComponent={null}
                            />
                        )
                        }
                        <div className={styles.sourceDetails}>
                            <div className={styles.label}>
                                Source:
                            </div>
                            <a
                                className={styles.link}
                                href="http://hydrology.gov.np"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Department of Hydrology and Meteorology
                            </a>
                        </div>
                    </div>
                )}
                {showRiver && (
                    <div className={styles.legendContainer}>
                        <header className={styles.header}>
                            <ScalableVectorGraphics
                                className={styles.legendIcon}
                                src={RiverIcon}
                                alt="River"
                            />
                            <h4 className={styles.heading}>
                                River
                            </h4>
                        </header>
                        <Legend
                            className={styles.legend}
                            // data={riverLegendItems}
                            // data={newRiverLegendItems}
                            data={
                                realTimeRiverList.length > 0
                                    ? autoRiverLegends
                                    : noLegend
                            }
                            itemClassName={styles.legendItem}
                            keySelector={itemSelector}
                            // iconSelector={iconSelector}
                            labelSelector={legendLabelSelector}
                            symbolClassNameSelector={classNameSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                        <div className={styles.sourceDetails}>
                            <div className={styles.label}>
                                Source:
                            </div>
                            <a
                                className={styles.link}
                                href="http://hydrology.gov.np"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Department of Hydrology and Meteorology
                            </a>
                        </div>
                    </div>
                )}
                { showEarthquake && (
                    <div className={styles.legendContainer}>
                        <header className={styles.header}>
                            <ScalableVectorGraphics
                                className={styles.legendIcon}
                                src={EarthquakeIcon}
                                alt="Earthquake"
                            />
                            <h4 className={styles.heading}>
                                Earthquake (Richter Scale (ML))
                            </h4>
                        </header>
                        <Legend
                            className={styles.legend}
                            data={earthquakeLegendItems}
                            itemClassName={styles.sizeLegendItem}
                            keySelector={itemSelector}
                            radiusSelector={radiusSelector}
                            // iconSelector={iconSelector}
                            labelSelector={legendLabelSelector}
                            symbolClassNameSelector={classNameSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                        <div className={styles.sourceDetails}>
                            <div className={styles.label}>
                                Source:
                            </div>
                            <a
                                className={styles.link}
                                href="https://www.seismonepal.gov.np"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Department of Mines and Geology
                            </a>
                        </div>
                    </div>
                )}
                { showPollution && (
                    <div className={styles.legendContainer}>
                        <header className={styles.header}>
                            <ScalableVectorGraphics
                                className={styles.legendIcon}
                                src={PollutionIcon}
                                alt="Pollution"
                            />
                            <h4 className={styles.heading}>
                                {/* Pollution (PM&nbsp;
                                <sub>
                                    2.5
                                </sub>
                                ) */}
                                Pollution (AQI Value)
                            </h4>
                        </header>
                        <Legend
                            className={styles.legend}
                            // data={pollutionLegendItems}
                            data={
                                realTimePollutionList.length > 0
                                    ? autoPollutionLegends
                                    : noLegend
                            }
                            itemClassName={styles.legendItem}
                            keySelector={itemSelector}
                            labelSelector={legendLabelSelector}
                            symbolClassNameSelector={classNameSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                        <div className={styles.sourceDetails}>
                            <div className={styles.label}>
                                Source:
                            </div>
                            <a
                                className={styles.link}
                                href="http://mofe.gov.np"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ministry of Forests and Environment
                            </a>
                        </div>
                    </div>
                )}
                { showFire && (
                    <div className={styles.legendContainer}>
                        <header className={styles.header}>
                            <ScalableVectorGraphics
                                className={styles.legendIcon}
                                src={FireIcon}
                            />
                            <h4 className={styles.heading}>
                                Forest Fire
                            </h4>
                        </header>
                        <Legend
                            className={styles.legend}
                            data={forestFireLegendItems}
                            itemClassName={styles.legendItem}
                            keySelector={itemSelector}
                            labelSelector={legendLabelSelector}
                            symbolClassNameSelector={classNameSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                        <div className={styles.sourceDetails}>
                            <div className={styles.label}>
                                Source:
                            </div>
                            <a
                                className={styles.link}
                                href="http://110.44.114.238//NepalForestFire"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                International Centre for Integrated Mountain Development
                            </a>
                        </div>
                    </div>
                )}
                { showStreamflow && (
                    <div className={styles.legendContainer}>
                        <header className={styles.header}>
                            <svg className={styles.legendIcon}>
                                <line x1="0" y1="5" x2="20" y2="5" style={{ stroke: '#7cb5ec', strokeWidth: 5 }} />
                            </svg>
                            <h4 className={styles.heading}>
                                Streamflow
                            </h4>
                        </header>
                        <div className={styles.sourceDetails}>
                            <div className={styles.label}>
                                Source:
                            </div>
                            <a
                                className={styles.link}
                                href="http://tethys.icimod.org/apps/ecmwf/#"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ICIMOD (ecmwf)
                            </a>
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

    private handleEarthquakeButtonClick = () => {
        this.setState({ activeView: 'earthquake' });
    }

    private handlePollutionButtonClick = () => {
        this.setState({ activeView: 'pollution' });
    }

    private handleFireButtonClick = () => {
        this.setState({ activeView: 'fire' });
    }

    private onHazardHover = (hoveredHazardId: number, source: string) => {
        this.setState({ hoveredHazardId, source });
    }

    public render() {
        const {
            realTimeRainList,
            realTimeRiverList,
            realTimeEarthquakeList,
            realTimeFireList,
            realTimePollutionList,
            requests,
            filters: {
                realtimeSources,
                otherSources,
            },
            realTimeSourceList,
            otherSourceList,
            duration,
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

        const pending = isAnyRequestPending(requests);

        let validActiveView = activeView;
        // To not show anything when no filters are selected
        if (!showRain && !showRiver && !showEarthquake && !showPollution && !showFire) {
            validActiveView = undefined;
            this.setState({ activeView: undefined });
        }

        const {
            hoveredHazardId,
            source,
        } = this.state;

        const hazardMapHoverAttributes = this.getHazardMapHoverAttributes(hoveredHazardId, source);

        /*
        TO fix the state issues between RealTimeFilters and LeftPane
        Sets activeView to the selected Filter if only one filter is selected

        Changes the activeView to other View if the current activeView has
        just been deselected */
        const validateActiveView = (
            firstCondition: boolean,
            secondCondition: boolean | undefined,
        ) => {
            if (firstCondition && secondCondition) {
                this.setStateFromFilter(realtimeSources, otherSources);
            }
        };
        validateActiveView(activeView === 'rainwatch', !showRain);
        validateActiveView(activeView === 'riverwatch', !showRiver);
        validateActiveView(activeView === 'earthquake', !showEarthquake);
        validateActiveView(activeView === 'pollution', !showPollution);
        validateActiveView(activeView === 'fire', !showFire);
        validateActiveView(activeView === undefined,
            (showRain || showRiver || showPollution || showEarthquake || showFire));

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
                    showStreamflow={showStreamflow}
                    onHazardHover={this.onHazardHover}
                    hazardHoveredAttribute={hazardMapHoverAttributes}
                    isHovered={!!hoveredHazardId}
                />
                <Page
                    hideHazardFilter
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
                                    {showEarthquake && (
                                        <div
                                            className={_cs(styles.tab, validActiveView === 'earthquake' && styles.active)}
                                            onClick={this.handleEarthquakeButtonClick}
                                            role="presentation"
                                        >
                                            <div className={styles.value}>
                                                {realTimeEarthquakeList.length}
                                            </div>
                                            <div className={styles.title}>
                                                <div
                                                    className={_cs(styles.icon, styles.eventIcon)}
                                                />
                                                <div className={styles.text}>
                                                    Earthquake
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {showPollution && (
                                        <div
                                            className={_cs(styles.tab, validActiveView === 'pollution' && styles.active)}
                                            onClick={this.handlePollutionButtonClick}
                                            role="presentation"
                                        >
                                            <div className={styles.value}>
                                                {realTimePollutionList.length}
                                            </div>
                                            <div className={styles.title}>
                                                <div
                                                    className={_cs(styles.icon, styles.eventIcon)}
                                                />
                                                <div className={styles.text}>
                                                    Pollution
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {showFire && (
                                        <div
                                            className={_cs(styles.tab, validActiveView === 'fire' && styles.active)}
                                            onClick={this.handleFireButtonClick}
                                            role="presentation"
                                        >
                                            <div className={styles.value}>
                                                {realTimeFireList.length}
                                            </div>
                                            <div className={styles.title}>
                                                <div
                                                    className={_cs(styles.icon, styles.eventIcon)}
                                                />
                                                <div className={styles.text}>
                                                    Fire
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </header>
                            <div className={styles.content}>
                                {validActiveView === 'riverwatch' && (
                                    <MiniRiverWatch
                                        className={styles.riverwatchList}
                                        realTimeRiver={realTimeRiverList}
                                        onHazardHover={this.onHazardHover}
                                    />
                                )}
                                {validActiveView === 'rainwatch' && (
                                    <MiniRainWatch
                                        className={styles.rainwatchList}
                                        realTimeRain={realTimeRainList}
                                        onHazardHover={this.onHazardHover}
                                    />
                                )}
                                {validActiveView === 'earthquake' && (
                                    <MiniEarthquake
                                        className={styles.rainwatchList}
                                        realTimeEarthquake={realTimeEarthquakeList}
                                        onHazardHover={this.onHazardHover}
                                    />
                                )}
                                {validActiveView === 'pollution' && (
                                    <MiniPollution
                                        className={styles.rainwatchList}
                                        realTimePollution={realTimePollutionList}
                                        onHazardHover={this.onHazardHover}
                                    />
                                )}
                                {validActiveView === 'fire' && (
                                    <MiniFire
                                        className={styles.rainwatchList}
                                        realTimeFire={realTimeFireList}
                                        onHazardHover={this.onHazardHover}
                                    />
                                )}
                                {!validActiveView && (
                                    <div
                                        className={styles.message}
                                    >
                                        <Message>
                                            Select a category to see details
                                        </Message>
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
                    mainContent={this.renderLegend()}
                />
            </>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(RealTimeMonitoring);
