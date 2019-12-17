import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import { styleProperties } from '#constants';
import { currentStyle } from '#rsu/styles';

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
import ResponseFilter from './Filter';
import StockPileFilter from './Filter/StockPileFilter';

import styles from './styles.scss';

const convertValueToNumber = (value = '') => +(value.substring(0, value.length - 2));

const emptyObject = {};

const DEFAULT_RESOURCES_DISTANCE = 12 * 1000; // distance in meter

interface Props {
}

interface State {
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

const trueFilter = () => true;

const mapStateToProps = (state, props) => ({
    // incidentId: incidentIdFromRouteSelector(state),
    incident: incidentSelector(state, props),
    resourceList: resourceListSelectorRP(state),
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
            filterFunction: trueFilter,

            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }

    private getFilteredList = memoize((list, filterFunction) => (
        list.filter(filterFunction)
    ))

    private setFilter = (filterFunction) => {
        this.setState({ filterFunction });
    }

    private setStockPileFilter = ({ item, quantity, operatorType }) => {
        this.props.requests.filteredResponseRequest.do({
            quantity,
            operatorType,
            inventoryItem: item,
        });
    }

    public render() {
        const {
            incident = emptyObject,
            resourceList,
            requests: {
                responseRequest: { pending: pendingResponse },
                filteredResponseRequest: { pending: pendingFilteredResponse },
                incidentRequest: { pending: pendingIncident },
            },
            wardsMap,
            provincesMap,
            districtsMap,
            municipalitiesMap,
            authState: {
                authenticated,
            },
        } = this.props;

        const {
            leftPaneExpanded,
            rightPaneExpanded,
            filterFunction,
        } = this.state;

        // TODO: memoize this
        const filteredResourceList = this.getFilteredList(resourceList, filterFunction);

        const pending = pendingResponse || pendingFilteredResponse || pendingIncident;

        return (
            <React.Fragment>
                <Loading pending={pending} />
                { incident.id && (
                    <React.Fragment>
                        <Map
                            incident={incident}
                            resourceList={filteredResourceList}
                            leftPaneExpanded={leftPaneExpanded}
                            rightPaneExpanded={rightPaneExpanded}
                        />
                        <Page
                            leftContentClassName={styles.leftContainer}
                            leftContent={(
                                <LeftPane
                                    incident={incident}
                                    wardsMap={wardsMap}
                                    provincesMap={provincesMap}
                                    districtsMap={districtsMap}
                                    municipalitiesMap={municipalitiesMap}

                                    resourceList={resourceList}
                                    filteredResourceList={filteredResourceList}
                                    setFilter={this.setFilter}
                                    setStockPileFilter={this.setStockPileFilter}
                                />
                            )}
                            rightContentClassName={styles.rightContainer}
                            rightContent={authenticated ? (
                                <StockPileFilter
                                    className={styles.stockPileFilter}
                                    setStockPileFilter={this.setStockPileFilter}
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
