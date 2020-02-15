import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    setIncidentActionIP,
    setResourceListActionRP,
} from '#actionCreators';

import {
    incidentSelector,
    resourceListSelectorRP,
    provincesMapSelector,
    districtsMapSelector,
    municipalitiesMapSelector,
    wardsMapSelector,
    authStateSelector,
} from '#selectors';

import Page from '#components/Page';
import Loading from '#components/Loading';

import Map from './Map';
import LeftPane from './LeftPane';
import StockPileFilter from './StockPileFilter';

import { createResourceFilter } from './LeftPane/utils';
import resourceAttributes from './resourceAttributes';

import styles from './styles.scss';

const emptyObject = {};

const DEFAULT_RESOURCES_DISTANCE = 12 * 1000; // distance in meter

interface Props {
}

interface State {
    stockPileFilter?: object;
    filter?: object;
    rightPaneExpanded?: boolean;
    leftPaneExpanded?: boolean;
}

const defaultProps = {
    wardsMap: {},
    provincesMap: {},
    districtsMap: {},
    municipalitiesMap: {},
    incident: emptyObject,
    resourceList: [],
    requests: emptyObject,
};

// const trueFilter = () => true;

const mapStateToProps = (state, props) => ({
    incident: incidentSelector(state, props),
    resourceList: resourceListSelectorRP(state),
    // incidentId: incidentIdFromRouteSelector(state),
    // incidentList: incidentListSelectorIP(state),
    provincesMap: provincesMapSelector(state),
    districtsMap: districtsMapSelector(state),
    municipalitiesMap: municipalitiesMapSelector(state),
    wardsMap: wardsMapSelector(state),
    authState: authStateSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setResourceList: params => dispatch(setResourceListActionRP(params)),
    setIncident: params => dispatch(setIncidentActionIP(params)),
});

const requests = {
    responseRequest: {
        url: ({ props: { incidentId } }) => (
            `/incident/${incidentId}/response/`
        ),
        // eslint-disable-next-line @typescript-eslint/camelcase
        query: { distance__lte: DEFAULT_RESOURCES_DISTANCE, meta: true },
        onSuccess: ({ response, props: { setResourceList } }) => {
            setResourceList({ resourceList: response.results });
        },
        onMount: ({ props: { incidentId } }) => !!incidentId,
        extras: {
            schemaName: 'responseResponse',
        },
    },
    // FIXME: should use the same request as responseRequest
    filteredResponseRequest: {
        url: ({ props: { incidentId } }) => (
            `/incident/${incidentId}/response/`
        ),
        query: ({ params: { max, min, quantity, inventoryItem, operatorType } }) => ({
            [`${inventoryItem}_count`]: quantity,
            inventory_item: inventoryItem, // eslint-disable-line @typescript-eslint/camelcase
            distance__gte: min, // eslint-disable-line @typescript-eslint/camelcase
            distance__lte: max, // eslint-disable-line @typescript-eslint/camelcase
            operator_type: operatorType, // eslint-disable-line @typescript-eslint/camelcase
            expand: 'inventories',
            meta: true,
        }),
        onSuccess: ({ response, props: { setResourceList } }) => {
            setResourceList({ resourceList: response.results });
        },
        extras: {
            schemaName: 'responseResponse',
        },
    },

    incidentRequest: {
        url: ({ props: { incidentId } }) => (
            `/incident/${incidentId}/`
        ),
        query: {
            expand: ['loss', 'event', 'wards'],
        },
        onSuccess: ({ response, props: { setIncident } }) => {
            setIncident({ incident: response });
        },
        onMount: ({ props: { incidentId } }) => !!incidentId,
        extras: {
            schemaName: 'singleIncidentResponse',
        },
    },
};

class Response extends React.PureComponent<Props, State> {
    public static defaultProps = defaultProps

    public constructor(props: Props) {
        super(props);

        this.state = {
            // filterFunction: trueFilter,

            stockPileFilter: {},

            filter: {
                health: { show: true },
                finance: { show: true },
                volunteer: { show: true },
                education: { show: true },
                openSpace: { show: true },
                hotel: { show: true },
                governance: { show: true },
            },

            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }

    private setStockPileFilter = (stockPileFilter) => {
        this.setState({
            stockPileFilter,
        });

        const { item, quantity, operatorType } = stockPileFilter;
        this.props.requests.filteredResponseRequest.do({
            quantity,
            operatorType,
            inventoryItem: item,
        });
    }


    private handleFilterChange = (filter) => {
        this.setState({ filter });
    }

    public render() {
        const {
            incident = emptyObject,
            resourceList: unfilteredResourceList,
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,
            authState: {
                authenticated,
            },
            requests: {
                responseRequest: { pending: pendingResponse },
                filteredResponseRequest: { pending: pendingFilteredResponse },
                incidentRequest: { pending: pendingIncident },
            },
        } = this.props;

        const {
            leftPaneExpanded,
            rightPaneExpanded,
            stockPileFilter,
            filter,
        } = this.state;

        const pending = pendingResponse || pendingFilteredResponse || pendingIncident;

        // TODO: memoize this
        const filterFunction = createResourceFilter(filter, resourceAttributes);
        const resourceList = unfilteredResourceList.filter(filterFunction);

        return (
            <React.Fragment>
                <Loading pending={pending} />
                { incident.id && (
                    <React.Fragment>
                        <Map
                            incident={incident}
                            resourceList={resourceList}
                            // resourceList={filteredResourceList}
                            leftPaneExpanded={leftPaneExpanded}
                            rightPaneExpanded={rightPaneExpanded}
                        />
                        <Page
                            leftContentContainerClassName={styles.leftContainer}
                            leftContent={(
                                <LeftPane
                                    className={styles.left}
                                    incident={incident}
                                    wardsMap={wardsMap}
                                    provincesMap={provincesMap}
                                    districtsMap={districtsMap}
                                    municipalitiesMap={municipalitiesMap}

                                    resourceList={unfilteredResourceList}
                                    filteredResourceList={resourceList}
                                    setFilter={this.handleFilterChange}
                                    filter={filter}
                                />
                            )}
                            rightContentContainerClassName={styles.rightContainer}
                            rightContent={authenticated ? (
                                <StockPileFilter
                                    className={styles.stockPileFilter}
                                    setStockPileFilter={this.setStockPileFilter}
                                    stockPileFilter={stockPileFilter}
                                    // TODO: inject stockPileFilter
                                />
                            ) : null}
                        />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(Response),
    ),
);
