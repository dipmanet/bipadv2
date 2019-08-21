import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    styleProperties,
} from '#constants';

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
    // incidentIdFromRouteSelector,
    incidentSelector,
    resourceListSelectorRP,
    provincesMapSelector,
    districtsMapSelector,
    municipalitiesMapSelector,
    wardsMapSelector,
} from '#selectors';

import Page from '#components/Page';
import Loading from '#components/Loading';

import ResourceList from './ResourceList';
import StockPileFilter from './Filter/StockPileFilter';

import ResponseFilter from './Filter';
import Map from './Map';

import styles from './styles.scss';

const convertValueToNumber = (value = '') => +(value.substring(0, value.length - 2));

const emptyObject = {};

const DEFAULT_RESOURCES_DISTANCE = 12 * 1000; // distance in meter

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    wardsMap: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    provincesMap: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    districtsMap: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    municipalitiesMap: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    incident: PropTypes.object,
    resourceList: PropTypes.arrayOf(PropTypes.object),
    // eslint-disable-next-line react/forbid-prop-types
    requests: PropTypes.object,
};

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

class Response extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            filterFunction: trueFilter,

            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }

    componentDidMount() {
        const { rightPaneExpanded } = this.state;

        this.setPlacementForMapControls(rightPaneExpanded);
    }

    componentWillUnmount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
        if (mapControls) {
            mapControls.style.right = this.previousMapContorlStyle;
        }
    }

    setFilter = (filterFunction) => {
        this.setState({ filterFunction });
    }

    /*
    setDistanceFilter = ({ min, max }) => {
        this.setState({
            distance: max,
        }, () => this.props.requests.filteredResponseRequest.do({ min, max }));
    }
    */

    setStockPileFilter = ({ item, quantity, operatorType }) => {
        this.props.requests.filteredResponseRequest.do({
            quantity,
            operatorType,
            inventoryItem: item,
        });
    }

    setPlacementForMapControls = (rightPaneExpanded) => {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            const widthRightPanel = rightPaneExpanded
                ? convertValueToNumber(styleProperties.widthRightPanelLarge)
                : 0;
            const spacingMedium = convertValueToNumber(currentStyle.spacingMedium);
            const widthNavbar = convertValueToNumber(styleProperties.widthNavbarRight);

            if (!this.previousMapContorlStyle) {
                this.previousMapContorlStyle = mapControls.style.right;
            }
            mapControls.style.right = `${widthNavbar + widthRightPanel + spacingMedium}px`;
        }
    }

    handleLeftPaneExpandChange = (leftPaneExpanded) => {
        this.setState({ leftPaneExpanded });
    }

    handleRightPaneExpandChange = (rightPaneExpanded) => {
        this.setState({ rightPaneExpanded });
        this.setPlacementForMapControls(rightPaneExpanded);
    }

    render() {
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
        } = this.props;

        const {
            leftPaneExpanded,
            rightPaneExpanded,
            filterFunction,
        } = this.state;

        // TODO: memoize this
        const filteredResourceList = resourceList.filter(filterFunction);

        const pending = pendingResponse || pendingFilteredResponse || pendingIncident;

        return (
            <React.Fragment>
                <Loading pending={pending} />
                { incident.id &&
                    <React.Fragment>
                        <Map
                            incident={incident}
                            resourceList={filteredResourceList}
                            leftPaneExpanded={leftPaneExpanded}
                            rightPaneExpanded={rightPaneExpanded}
                        />
                        <Page
                            leftContentClassName={styles.incidentDetails}
                            leftContent={
                                <React.Fragment>
                                    <ResourceList
                                        className={styles.resourceList}
                                        resourceList={resourceList}
                                        pending={pending}
                                        incident={incident}
                                        wardsMap={wardsMap}
                                        provincesMap={provincesMap}
                                        districtsMap={districtsMap}
                                        municipalitiesMap={municipalitiesMap}
                                        onExpandChange={this.handleLeftPaneExpandChange}
                                    />
                                    <StockPileFilter
                                        setStockPileFilter={this.setStockPileFilter}
                                    />
                                </React.Fragment>
                            }
                            rightContentClassName={styles.resourceListContainer}
                            rightContent={
                                <ResponseFilter
                                    resourceList={resourceList}
                                    filteredList={filteredResourceList}
                                    setFilter={this.setFilter}
                                    setStockPileFilter={this.setStockPileFilter}
                                    onExpandChange={this.handleRightPaneExpandChange}
                                />
                            }
                        />
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(Response),
    ),
);
