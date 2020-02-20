import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    _cs,
    Obj,
} from '@togglecorp/fujs';

import HazardsLegend from '#components/HazardsLegend';
import Loading from '#components/Loading';

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
    transformDataRangeToFilter,
    transformRegionToFilter,
} from '#utils/transformations';

import { hazardTypesList } from '#utils/domain';

import {
    setAlertListActionDP,
    setEventListAction,
} from '#actionCreators';

import {
    alertListSelectorDP,
    eventListSelector,
    hazardTypesSelector,
    dashboardFiltersSelector,
} from '#selectors';

import Page from '#components/Page';

import Map from './Map';
import LeftPane from './LeftPane';

import {
    MapStateElement,
    AlertElement,
    EventElement,
    FiltersElement,
} from '#types';

import styles from './styles.scss';

const emptyAlertHoverAttributeList: MapStateElement[] = [];
const emptyEventHoverAttributeList: MapStateElement[] = [];

interface State {
    hoveredAlertId: AlertElement['id'] | undefined;
    hoveredEventId: EventElement['id'] | undefined;
}

interface Params {
    triggerAlertRequest: (timeout: number) => void;
    triggerEventRequest: (timeout: number) => void;
}
interface ComponentProps {}
interface PropsFromAppState {
    alertList: PageTypes.Alert[];
    eventList: PageTypes.Event[];
    hazardTypes: Obj<PageTypes.HazardType>;
    filters: FiltersElement;
}
interface PropsFromDispatch {
    setEventList: typeof setEventListAction;
    setAlertList: typeof setAlertListActionDP;
}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    alertList: alertListSelectorDP(state),
    eventList: eventListSelector(state),
    hazardTypes: hazardTypesSelector(state),
    filters: dashboardFiltersSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAlertList: params => dispatch(setAlertListActionDP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
});

const transformFilters = ({
    dataDateRange,
    region,
    ...otherFilters
}: FiltersElement) => ({
    ...otherFilters,
    ...transformDataRangeToFilter(dataDateRange, 'expire_on'),
    ...transformRegionToFilter(region),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    alertsRequest: {
        url: '/alert/',
        method: methods.GET,
        query: ({ props: { filters } }) => ({
            ...transformFilters(filters),
            expand: ['event'],
            ordering: '-created_on',
        }),
        onSuccess: ({ response, props: { setAlertList }, params }) => {
            interface Response { results: PageTypes.Alert[] }
            const { results: alertList = [] } = response as Response;
            setAlertList({ alertList });
            if (params && params.triggerAlertRequest) {
                params.triggerAlertRequest(60 * 1000);
            }
        },
        onFailure: ({ params }) => {
            if (params && params.triggerAlertRequest) {
                params.triggerAlertRequest(60 * 1000);
            }
        },
        onFatal: ({ params }) => {
            if (params && params.triggerAlertRequest) {
                params.triggerAlertRequest(60 * 1000);
            }
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters },
                prevProps: { filters: prevFilters },
            }) => {
                const shouldRequest = filters !== prevFilters;

                return shouldRequest;
            },
        },
        extras: {
            schemaName: 'alertResponse',
        },
    },
    eventsRequest: {
        url: '/event/',
        method: methods.GET,
        query: ({ props: { filters } }) => ({
            ...transformFilters(filters),
            ordering: '-created_on',
            // expand: 'hazard',
        }),
        onSuccess: ({ response, props: { setEventList }, params }) => {
            interface Response { results: PageTypes.Event[] }
            const { results: eventList = [] } = response as Response;
            setEventList({ eventList });
            if (params && params.triggerEventRequest) {
                params.triggerEventRequest(60 * 1000);
            }
        },
        onFailure: ({ params }) => {
            if (params && params.triggerEventRequest) {
                params.triggerEventRequest(60 * 1000);
            }
        },
        onFatal: ({ params }) => {
            if (params && params.triggerEventRequest) {
                params.triggerEventRequest(60 * 1000);
            }
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters },
                prevProps: { filters: prevFilters },
            }) => filters !== prevFilters,
        },
        extras: { schemaName: 'eventResponse' },
    },
    deleteAlertRequest: {
        url: ({ params }) => `/alert/${params.alertId}`,
        method: methods.DELETE,
        onSuccess: ({ params }) => {
            if (params && params.onSuccess) {
                params.onSuccess();
            }
        },
    },
    deleteEventRequest: {
        url: ({ params }) => `/event/${params.eventId}`,
        method: methods.DELETE,
        onSuccess: ({ params }) => {
            if (params && params.onSuccess) {
                params.onSuccess();
            }
        },
    },
};

const RECENT_DAY = 1;

class Dashboard extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            hoveredAlertId: undefined,
            hoveredEventId: undefined,
        };

        const {
            requests: {
                alertsRequest,
            },
        } = this.props;

        alertsRequest.setDefaultParams({
            triggerAlertRequest: this.alertPoll,
            triggerEventRequest: this.eventPoll,
        });
    }

    public componentWillUnmount(): void {
        window.clearTimeout(this.alertTimeout);
        window.clearTimeout(this.eventTimeout);
    }

    private getAlertHazardTypesList = memoize((
        alertList: PageTypes.Alert[],
        eventList: PageTypes.Event[],
    ) => {
        const { hazardTypes } = this.props;
        const items = [
            ...alertList,
            ...eventList.filter(event => event.hazard),
        ];
        return hazardTypesList(items, hazardTypes);
    });

    private alertTimeout?: number

    private eventTimeout?: number

    private alertPoll = (delay: number) => {
        this.alertTimeout = window.setTimeout(
            () => { this.props.requests.alertsRequest.do(); },
            delay,
        );
    }

    private eventPoll = (delay: number) => {
        this.eventTimeout = window.setTimeout(
            () => { this.props.requests.eventsRequest.do(); },
            delay,
        );
    }


    private handleAlertHover = (hoveredAlertId: number | undefined) => {
        this.setState({ hoveredAlertId });
    }

    private handleEventHover = (hoveredEventId: number | undefined) => {
        this.setState({ hoveredEventId });
    }

    private handleAlertChange = (/* newAlert */) => {
        // TODO: update redux instead?
        const { requests: { alertsRequest } } = this.props;

        alertsRequest.do();
    }

    private handleEventChange = (/* newEvent */) => {
        // TODO: update redux instead?
        const { requests: { eventsRequest } } = this.props;

        eventsRequest.do();
    }

    private handleDeleteAlertButtonClick = (alert) => {
        const {
            requests: {
                deleteAlertRequest,
                alertsRequest,
            },
        } = this.props;

        deleteAlertRequest.do({
            alertId: alert.id,
            onSuccess: alertsRequest.do,
        });
    }

    private handleDeleteEventButtonClick = (event) => {
        const {
            requests: {
                deleteEventRequest,
                eventsRequest,
            },
        } = this.props;

        deleteEventRequest.do({
            eventId: event.id,
            onSuccess: eventsRequest.do,
        });
    }

    private getAlertMapHoverAttributes = (hoveredAlertId: number | undefined) => {
        if (!hoveredAlertId) {
            return emptyAlertHoverAttributeList;
        }

        return [{
            id: hoveredAlertId,
            value: true,
        }];
    }

    private getEventMapHoverAttributes = (hoveredEventId: number | undefined) => {
        if (!hoveredEventId) {
            return emptyEventHoverAttributeList;
        }

        return [{
            id: hoveredEventId,
            value: true,
        }];
    }

    public render() {
        const {
            alertList,
            eventList,
            hazardTypes,
            requests: {
                alertsRequest: { pending: alertsPending },
                eventsRequest: { pending: eventsPending },
            },
        } = this.props;

        const filteredHazardTypes = this.getAlertHazardTypesList(alertList, eventList);
        const pending = alertsPending || eventsPending;

        const {
            hoveredAlertId,
            hoveredEventId,
        } = this.state;

        const alertMapHoverAttributes = this.getAlertMapHoverAttributes(hoveredAlertId);
        const eventMapHoverAttributes = this.getEventMapHoverAttributes(hoveredEventId);

        return (
            <React.Fragment>
                <Loading pending={pending} />
                <Map
                    alertList={alertList}
                    eventList={eventList}
                    recentDay={RECENT_DAY}
                    onAlertHover={this.handleAlertHover}
                    onEventHover={this.handleEventHover}
                    alertHoverAttributes={alertMapHoverAttributes}
                    eventHoverAttributes={eventMapHoverAttributes}
                    isEventHovered={!!hoveredEventId}
                    isAlertHovered={!!hoveredAlertId}
                />
                <Page
                    leftContentContainerClassName={styles.leftContainer}
                    leftContent={(
                        <LeftPane
                            className={styles.leftPane}
                            alertList={alertList}
                            eventList={eventList}
                            hazardTypes={hazardTypes}
                            pending={pending}
                            recentDay={RECENT_DAY}
                            onAlertChange={this.handleAlertChange}
                            onDeleteAlertButtonClick={this.handleDeleteAlertButtonClick}
                            onEventChange={this.handleEventChange}
                            onDeleteEventButtonClick={this.handleDeleteEventButtonClick}
                            hoveredAlertId={hoveredAlertId}
                            hoveredEventId={hoveredEventId}
                            onEventHover={this.handleEventHover}
                            onAlertHover={this.handleAlertHover}
                        />
                    )}
                    mainContentContainerClassName={_cs(styles.hazardLegendContainer, 'map-legend-container')}
                    mainContent={(
                        <HazardsLegend
                            filteredHazardTypes={filteredHazardTypes}
                            className={styles.hazardLegend}
                            itemClassName={styles.legendItem}
                        />
                    )}
                />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Dashboard,
        ),
    ),
);
