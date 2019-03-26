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
import IncidentInfo from '#components/IncidentInfo';

import ResponseFilter from './Filter';
import Map from './Map';

import styles from './styles.scss';

const emptyObject = {};

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

class Response extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    constructor(props) {
        super(props);

        this.state = {
            filterFunction: trueFilter,
        };
    }

    setFilter = (filterFunction) => {
        this.setState({ filterFunction });
    }

    render() {
        const {
            incident = emptyObject,
            resourceList,
            requests: {
                responseRequest: { pending },
            },
            wardsMap,
        } = this.props;

        const filteredResourceList = resourceList.filter(this.state.filterFunction);

        if (!incident.id) {
            return null;
        }

        return (
            <React.Fragment>
                <Map
                    incident={incident}
                    resourceList={filteredResourceList}
                />
                <Page
                    leftContentClassName={styles.incidentDetails}
                    leftContent={
                        <IncidentInfo
                            className={styles.info}
                            incident={incident}
                            wardsMap={wardsMap}
                            hideLink
                        />
                    }
                    rightContentClassName={styles.resourceListContainer}
                    rightContent={
                        <React.Fragment>
                            {
                                // <ResourceList
                                // className={styles.resourceList}
                                // resourceList={resourceList}
                                // pending={pending}
                                // />
                            }
                            <ResponseFilter setFilter={this.setFilter} />
                        </React.Fragment>
                    }
                />
            </React.Fragment>
        );
    }
}

const requests = {
    responseRequest: {
        url: ({ props: { incidentId } }) => (
            `/incident/${incidentId}/response/?distance=12`
        ),
        onSuccess: ({ response, props: { setResourceList } }) => {
            setResourceList({ resourceList: response });
        },
        onMount: ({ props: { incidentId } }) => !!incidentId,
        // FIXME: write schema
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
        onMount: ({ props: { incidentId } }) => (
            !!incidentId
        ),
        extras: {
            schemaName: 'singleIncidentResponse',
        },
    },
};

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

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(Response),
    ),
);
