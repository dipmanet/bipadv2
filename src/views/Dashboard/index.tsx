import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Obj } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import HazardsLegend from '#components/HazardsLegend';

import { AppState } from '#store/types';
import * as PageTypes from '#store/atom/page/types';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { transformDateRangeFilterParam } from '#utils/transformations';
import { hazardTypesList } from '#utils/domain';

import {
    setAlertListActionDP,
    setEventListAction,
} from '#actionCreators';
import {
    alertListSelectorDP,
    eventListSelector,
    hazardTypesSelector,
    filtersValuesSelectorDP,
} from '#selectors';

import Page from '#components/Page';

import Map from './Map';
import LeftPane from './LeftPane';
import DashboardFilter from './Filter';

import styles from './styles.scss';

interface State {
    leftPaneExpanded?: boolean;
    rightPaneExpanded?: boolean;
}
interface Params {
    triggerAlertRequest: (timeout: number) => void;
    triggerEventRequest: (timeout: number) => void;
}
interface OwnProps {}
interface PropsFromState {
    alertList: PageTypes.Alert[];
    eventList: PageTypes.Event[];
    hazardTypes: Obj<PageTypes.HazardType>;
    filters: PageTypes.FiltersWithRegion['faramValues'];
}
interface PropsFromDispatch {
    setEventList: typeof setEventListAction;
    setAlertList: typeof setAlertListActionDP;
}
type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    alertList: alertListSelectorDP(state),
    eventList: eventListSelector(state),
    hazardTypes: hazardTypesSelector(state),
    filters: filtersValuesSelectorDP(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAlertList: params => dispatch(setAlertListActionDP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    alertsRequest: {
        url: '/alert/',
        method: methods.GET,
        // We have to transform dateRange to created_on__lt and created_on__gt
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'created_on'),
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
                props: { filters: { hazard, dateRange, region } },
                prevProps: { filters: {
                    hazard: prevHazard,
                    dateRange: prevDateRange,
                    region: prevRegion,
                } },
            }) => (
                hazard !== prevHazard || dateRange !== prevDateRange || region !== prevRegion
            ),
        },
        extras: {
            schemaName: 'alertResponse',
        },
    },
    eventsRequest: {
        url: '/event/',
        method: methods.GET,
        // We have to transform dateRange to created_on__lt and created_on__gt
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'created_on'),
        }),
        onSuccess: ({ response, props: { setEventList }, params }) => {
            interface Response { results: PageTypes.Event[] }
            const { results: eventList = [] } = response as Response;
            setEventList({ eventList });
            if (params && params.triggerAlertRequest) {
                params.triggerEventRequest(60 * 1000);
            }
        },
        onFailure: ({ params }) => {
            if (params && params.triggerAlertRequest) {
                params.triggerEventRequest(60 * 1000);
            }
        },
        onFatal: ({ params }) => {
            if (params && params.triggerAlertRequest) {
                params.triggerEventRequest(60 * 1000);
            }
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters: { dateRange } },
                prevProps: { filters: {
                    dateRange: prevDateRange,
                } },
            }) => dateRange !== prevDateRange,
        },
        extras: {
            schemaName: 'eventResponse',
        },
    },
};

class Dashboard extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };

        this.props.requests.alertsRequest.setDefaultParams({
            triggerAlertRequest: this.alertPoll,
            triggerEventRequest: this.eventPoll,
        });
    }

    public componentWillUnmount(): void {
        window.clearTimeout(this.alertTimeout);
        window.clearTimeout(this.eventTimeout);
    }

    private getAlertHazardTypesList = memoize((alertList: PageTypes.Alert[]) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(alertList, hazardTypes);
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

    private handleLeftPaneExpandChange = (leftPaneExpanded: boolean) => {
        this.setState({ leftPaneExpanded });
    }

    private handleRightPaneExpandChange = (rightPaneExpanded: boolean) => {
        this.setState({ rightPaneExpanded });
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

        const filteredHazardTypes = this.getAlertHazardTypesList(alertList);
        const pending = alertsPending || eventsPending;

        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        return (
            <React.Fragment>
                <Map
                    alertList={alertList}
                    eventList={eventList}
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                />
                <Page
                    leftContent={
                        <LeftPane
                            alertList={alertList}
                            eventList={eventList}
                            hazardTypes={hazardTypes}
                            pending={pending}
                            onExpandChange={this.handleLeftPaneExpandChange}
                        />
                    }
                    mainContent={
                        <HazardsLegend
                            filteredHazardTypes={filteredHazardTypes}
                            className={styles.hazardLegend}
                            itemClassName={styles.legendItem}
                        />
                    }
                    rightContent={
                        <DashboardFilter
                            onExpandChange={this.handleRightPaneExpandChange}
                        />
                    }
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
