import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


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
    wardsMapSelector,
} from '#selectors';

import Page from '#components/Page';
import Loading from '#components/Loading';

import ResourceList from './ResourceList';

import ResponseFilter from './Filter';
import Map from './Map';

import styles from './styles.scss';

const emptyObject = {};

const DEFAULT_RESOURCES_DISTANCE = 12;

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    wardsMap: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    incident: PropTypes.object,
    resourceList: PropTypes.arrayOf(PropTypes.object),
    // eslint-disable-next-line react/forbid-prop-types
    requests: PropTypes.object,
};

const defaultProps = {
    wardsMap: emptyObject,
    incident: emptyObject,
    resourceList: [],
    requests: emptyObject,
};

const trueFilter = () => true;

const mapStateToProps = (state, props) => ({
    // incidentId: incidentIdFromRouteSelector(state),
    incident: incidentSelector(state, props),
    resourceList: resourceListSelectorRP(state),
    wardsMap: wardsMapSelector(state),
    // incidentList: incidentListSelectorIP(state),
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
        query: { distance: DEFAULT_RESOURCES_DISTANCE, meta: true },
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
        query: ({ params: { max, min } }) => ({
            distance__gte: min, // eslint-disable-line @typescript-eslint/camelcase
            distance__lte: max, // eslint-disable-line @typescript-eslint/camelcase
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
            expand: 'loss',
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

    setFilter = (filterFunction) => {
        this.setState({ filterFunction });
    }

    setDistanceFilter = ({ min, max }) => {
        this.props.requests.filteredResponseRequest.do({ min, max });
    }

    handleLeftPaneExpandChange = (leftPaneExpanded) => {
        this.setState({ leftPaneExpanded });
    }

    handleRightPaneExpandChange = (rightPaneExpanded) => {
        this.setState({ rightPaneExpanded });
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
        } = this.props;

        const {
            leftPaneExpanded,
            rightPaneExpanded,
            filterFunction,
        } = this.state;

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
                                <ResourceList
                                    className={styles.resourceList}
                                    resourceList={resourceList}
                                    pending={pending}
                                    incident={incident}
                                    wardsMap={wardsMap}
                                    onExpandChange={this.handleLeftPaneExpandChange}
                                />
                            }
                            rightContentClassName={styles.resourceListContainer}
                            rightContent={
                                <ResponseFilter
                                    resourceList={resourceList}
                                    distance={DEFAULT_RESOURCES_DISTANCE}
                                    setFilter={this.setFilter}
                                    setDistanceFilter={this.setDistanceFilter}
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
