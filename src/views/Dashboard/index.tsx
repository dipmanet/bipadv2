import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    listToMap,
    _cs,
    Obj,
} from '@togglecorp/fujs';

import MapDownload from '#rscz/Map/MapDownload';

import { styleProperties } from '#constants';
import { currentStyle } from '#rsu/styles';

import HazardsLegend from '#components/HazardsLegend';
import Loading from '#components/Loading';

import TextOutput from '#components/TextOutput';
import DateOutput from '#components/DateOutput';

import Filters from '#components/Filters';

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

import styles from './styles.scss';

const convertValueToNumber = (value = '') => +(value.substring(0, value.length - 2));

interface State {
    leftPaneExpanded?: boolean;
    rightPaneExpanded?: boolean;
    hoverItemId?: number;
    hoverType?: string;
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
            ordering: '-created_on',
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

const RECENT_DAY = 1;

class Dashboard extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
            hoverItemId: undefined,
            hoverType: undefined,
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

    public componentDidMount(): void {
        const { rightPaneExpanded } = this.state;

        // this.setPlacementForMapControls(rightPaneExpanded);
    }

    public componentWillUnmount(): void {
        window.clearTimeout(this.alertTimeout);
        window.clearTimeout(this.eventTimeout);

        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0] as HTMLElement | undefined;
        if (mapControls) {
            mapControls.style.right = this.previousMapContorlStyle;
        }
    }

    private previousMapContorlStyle: string | null = null;

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

    private getAlertMap = memoize(
        alertList => listToMap(
            alertList,
            (d: {
                id: number;
                title: string;
                startedOn: string;
                source: string;
            }) => d.id,
            d => d,
        ),
    );

    private getEventMap = memoize(
        eventList => listToMap(
            eventList,
            (d: {
                id: number;
                title: string;
                startedOn: string;
                source: string;
            }) => d.id,
            d => d,
        ),
    );

    public setPlacementForMapControls = (rightPaneExpanded: boolean | undefined) => {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0] as HTMLElement | undefined;

        if (mapControls) {
            const widthRightPanel = rightPaneExpanded
                ? convertValueToNumber(styleProperties.widthRightPanel)
                : 0;
            const spacingMedium = convertValueToNumber(currentStyle.spacingMedium);
            const widthNavbar = convertValueToNumber(styleProperties.widthNavbarRight);

            if (!this.previousMapContorlStyle) {
                this.previousMapContorlStyle = mapControls.style.right;
            }
            mapControls.style.right = `${widthNavbar + widthRightPanel + spacingMedium}px`;
        }
    }

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

    private handleHoverChange = (hoverType: string, hoverItemId: number) => {
        this.setState({
            hoverItemId,
            hoverType,
        });
    }

    private renderHoverItemDetail = () => {
        const {
            hoverItemId,
            hoverType,
            rightPaneExpanded,
        } = this.state;

        const {
            alertList,
            eventList,
        } = this.props;

        let title = '';
        let date = '';
        let source = '';

        if (!hoverItemId || !hoverType) {
            return null;
        }

        if (hoverType === 'alert') {
            const alertMap = this.getAlertMap(alertList);
            const hoverDetail = alertMap[hoverItemId];

            if (!hoverDetail) {
                return null;
            }

            ({ title, source } = hoverDetail);
            date = hoverDetail.startedOn;
        }

        if (hoverType === 'event') {
            const eventMap = this.getEventMap(eventList);
            const hoverDetail = eventMap[hoverItemId];

            if (!hoverDetail) {
                return null;
            }

            ({ title, source } = hoverDetail);
            date = hoverDetail.startedOn;
        }

        return (
            <div className={
                _cs(
                    rightPaneExpanded && styles.rightPaneExpanded,
                    styles.hoverDetailBox,
                )
            }
            >
                <h3>
                    {title}
                </h3>
                <DateOutput
                    value={date}
                />
                <TextOutput
                    label="Source"
                    value={source}
                />
            </div>
        );
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
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        const HoverItemDetail = this.renderHoverItemDetail;

        return (
            <React.Fragment>
                <Map
                    alertList={alertList}
                    eventList={eventList}
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                    recentDay={RECENT_DAY}
                    onHoverChange={this.handleHoverChange}
                />
                <MapDownload
                    className={styles.mapDownloadButton}
                    iconName="download"
                >
                    Download this map
                </MapDownload>
                <Loading pending={pending} />
                <HoverItemDetail />
                <Page
                    leftContentClassName={styles.leftContainer}
                    leftContent={(
                        <LeftPane
                            className={styles.leftPane}
                            alertList={alertList}
                            eventList={eventList}
                            hazardTypes={hazardTypes}
                            pending={pending}
                            onExpandChange={this.handleLeftPaneExpandChange}
                            recentDay={RECENT_DAY}
                        />
                    )}
                    mainContent={(
                        <HazardsLegend
                            filteredHazardTypes={filteredHazardTypes}
                            className={styles.hazardLegend}
                            itemClassName={styles.legendItem}
                        />
                    )}
                    rightContent={(
                        <Filters className={styles.filters} />
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
