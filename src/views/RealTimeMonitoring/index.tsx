import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';

import Legend from '#rscz/Legend';
import Message from '#rscv/Message';
import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';

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
} from '#selectors';

import Page from '#components/Page';
import Loading from '#components/Loading';
import CollapsibleView from '#components/CollapsibleView';
import { iconNames } from '#constants';

import Map from './Map';
import RealTimeMonitoringFilter from './Filter';

import styles from './styles.scss';

interface State {
    rightPaneExpanded?: boolean;
    leftPaneExpanded?: boolean;
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
    { icon: '■', color: '#6FD1FD', label: 'Below Warning Level' },
    { icon: '■', color: '#7482CF', label: 'Above Warning Level' },
    { icon: '■', color: '#9C27B0', label: 'Above Danger Level' },
];

const riverLegendItems = [
    { icon: '●', color: '#53FF9A', label: 'Steady & Below Warning Level' },
    { icon: '●', color: '#5770FE', label: 'Steady & Above Warning Level' },
    { icon: '●', color: '#C51162', label: 'Steady & Above Danger Level' },
    { icon: '▲', color: '#53FF9A', label: 'Rising & Below Warning Level' },
    { icon: '▲', color: '#5770FE', label: 'Rising & Above Warning Level' },
    { icon: '▲', color: '#C51162', label: 'Rising & Above Danger Level' },
    { icon: '▼', color: '#53FF9A', label: 'Falling & Below Warning Level' },
    { icon: '▼', color: '#5770FE', label: 'Falling & Above Warning Level' },
    { icon: '▼', color: '#C51162', label: 'Falling & Below Danger Level' },

];

const earthquakeLegendItems = [
    { icon: '●', color: '#a50f15', label: 'Great (8 or more)' },
    { icon: '●', color: '#de2d26', label: 'Major (7 or more)' },
    { icon: '●', color: '#fb6a4a', label: 'Strong (6 or more)' },
    { icon: '●', color: '#fc9272', label: 'Moderate (5 or more)' },
    { icon: '●', color: '#fcbba1', label: 'Light (4 or more)' },
    { icon: '●', color: '#fee5d9', label: 'Minor (3 or more)' },
];

const pollutionLegendItems = [
    { icon: '●', color: '#009966', label: 'Good (12 or less)' },
    { icon: '●', color: '#ffde33', label: 'Moderate (35.4 or less)' },
    { icon: '●', color: '#ff9933', label: 'Unhealthy for Sensitive Groups (55.4 or less)' },
    { icon: '●', color: '#cc0033', label: 'Unhealthy (150.4 or less)' },
    { icon: '●', color: '#660099', label: 'Very Unhealthy (350.4 or less)' },
    { icon: '●', color: '#7e0023', label: 'Hazardous (500.4 or less)' },
];

const fireLegendItems = [
    { icon: '◆', color: '#e64a19', label: 'Forest Fire' },
];

const itemSelector = (d: { label: string }) => d.label;
const iconSelector = (d: { icon: string }) => d.icon;
const legendColorSelector = (d: { color: string }) => d.color;
const legendLabelSelector = (d: { label: string }) => d.label;

class RealTimeMonitoring extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            rightPaneExpanded: true,
            leftPaneExpanded: true,
        };
    }

    private handleRightPaneExpandChange = (rightPaneExpanded: boolean) => {
        this.setState({ rightPaneExpanded });
    }

    private handleShowLegendsButtonClick = () => {
        this.setState({ leftPaneExpanded: true });
    }

    private handleCloseLegendsClick = () => {
        this.setState({ leftPaneExpanded: false });
    }

    private renderLegend = () => {
        const {
            filters: {
                realtimeSources,
            },
            realTimeSourceList,
        } = this.props;

        const showEarthquake = realtimeSources && realtimeSources.findIndex(v => v === 1) !== -1;
        const showRiver = realtimeSources && realtimeSources.findIndex(v => v === 2) !== -1;
        const showRain = realtimeSources && realtimeSources.findIndex(v => v === 3) !== -1;
        const showFire = realtimeSources && realtimeSources.findIndex(v => v === 4) !== -1;
        const showPollution = realtimeSources && realtimeSources.findIndex(v => v === 5) !== -1;

        return (
            <React.Fragment>
                <div className={styles.header} >
                    <h4>Legend</h4>
                    <Button
                        onClick={this.handleCloseLegendsClick}
                        iconName={iconNames.chevronUp}
                        title="Hide Filters"
                        transparent
                    />
                </div>
                { !(showRain || showRiver || showEarthquake || showPollution || showFire) &&
                    <div className={styles.noLegend}>
                        <Message>
                            Please select at least one source
                        </Message>
                    </div>
                }
                { showRain &&
                    <div className={styles.container}>
                        <h5 className={styles.heading}>
                            Rain
                        </h5>
                        <Legend
                            className={styles.legend}
                            data={rainLegendItems}
                            itemClassName={styles.legendItem}
                            keySelector={itemSelector}
                            iconSelector={iconSelector}
                            labelSelector={legendLabelSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                    </div>
                }
                { showRiver &&
                    <div className={styles.container}>
                        <h5 className={styles.heading}>
                            River
                        </h5>
                        <Legend
                            className={styles.legend}
                            data={riverLegendItems}
                            itemClassName={styles.legendItem}
                            keySelector={itemSelector}
                            iconSelector={iconSelector}
                            labelSelector={legendLabelSelector}
                            colorSelector={legendColorSelector}
                            emptyComponent={null}
                        />
                    </div>
                }
                { showEarthquake &&
                    <div className={styles.container}>
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
                }
                { showPollution &&
                    <div className={styles.container}>
                        <h5 className={styles.heading}>
                            Pollution (PM <sub>2.5</sub>)
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
                }
                { showFire &&
                    <div className={styles.container}>
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
                }
            </React.Fragment>
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
        } = this.props;

        const {
            rightPaneExpanded,
            leftPaneExpanded,
        } = this.state;

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
            <React.Fragment>
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
                    rightPaneExpanded={rightPaneExpanded}
                    leftPaneExpanded={leftPaneExpanded}
                />
                <Loading pending={pending} />
                <Page
                    rightContentClassName={styles.right}
                    leftContentClassName={styles.left}
                    leftContent={
                        <CollapsibleView
                            className={styles.legend}
                            expanded={leftPaneExpanded}
                            collapsedViewContainerClassName={styles.showLegendButtonContainer}
                            collapsedView={
                                <PrimaryButton
                                    onClick={this.handleShowLegendsButtonClick}
                                    title="Show filters"
                                >
                                    Show Legend
                                </PrimaryButton>
                            }
                            expandedViewContainerClassName={styles.legendsContainer}
                            expandedView={
                                <LegendView />
                            }
                        />
                    }
                    rightContent={
                        <RealTimeMonitoringFilter
                            // rainPending={rainPending}
                            // riverPending={riverPending}
                            // earthquakePending={earthquakePending}
                            // firePending={firePending}
                            // pollutionPending={pollutionPending}
                            realTimeList={realTimeSourceList}
                            onExpandChange={this.handleRightPaneExpandChange}
                        />
                    }
                    mainContentClassName={styles.main}
                    mainContent={null/*
                        <div className={styles.links}>
                            <a
                                className={styles.link}
                                href="http://www.globalfloods.eu/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GLOFAS
                            </a>
                            <a
                                className={styles.link}
                                href="https://www.usgs.gov/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                USGS
                            </a>
                        </div>
                    */}
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
