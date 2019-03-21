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
import Tooltip from '#components/Tooltip';

import Map from './Map';
import ResourceList from './ResourceList';

import styles from './styles.scss';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    wardsMap: PropTypes.object,
};

const defaultProps = {
    wardsMap: {},
};

const emptyObject = {};

class Response extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            incident = emptyObject,
            resourceList,
            requests: {
                responseRequest: { pending },
            },
            wardsMap,
        } = this.props;

        if (!incident.id) {
            return null;
        }

        return (
            <React.Fragment>
                <Map
                    incident={incident}
                    resourceList={resourceList}
                />
                <Page
                    leftContentClassName={styles.incidentDetails}
                    leftContent={
                        <Tooltip
                            className={styles.info}
                            incident={incident}
                            wardsMap={wardsMap}
                            hideLink
                        />
                    }
                    rightContentClassName={styles.resourceListContainer}
                    rightContent={
                        <ResourceList
                            // className={styles.resourceList}
                            resourceList={resourceList}
                            pending={pending}
                        />
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
        onMount: ({ props: { incidentId } }) => (
            !!incidentId
        ),
        // FIXME: write schema
    },
    incidentRequest: {
        url: ({ props: { incidentId } }) => (
            `/incident/${incidentId}/`
        ),
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
