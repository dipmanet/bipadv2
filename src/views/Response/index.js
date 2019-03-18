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
} from '#selectors';

import Page from '#components/Page';
import Tooltip from '#components/Tooltip';

import Map from './Map';
import ResourceList from './ResourceList';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

class Response extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            incident = {},
            resourceList,
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
                            incident={JSON.stringify(incident)}
                        />
                    }
                    rightContentClassName={styles.resourceListContainer}
                    rightContent={
                        <ResourceList
                            // className={styles.resourceList}
                            resourceList={resourceList}
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
            // ?distance=1000
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
        // FIXME: write schema
    },
};

const mapStateToProps = (state, props) => ({
    // incidentId: incidentIdFromRouteSelector(state),
    incident: incidentSelector(state, props),
    resourceList: resourceListSelectorRP(state),
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
