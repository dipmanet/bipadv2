import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    incidentIdFromRouteSelector,
    incidentSelector,
    setIncidentActionIP,
    resourceListSelectorRP,
    setResourceListActionRP,
} from '#redux';

import Page from '#components/Page';

import Map from './Map';
import ResourceList from './ResourceList';
import IncidentInformation from './IncidentInformation';

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
                    rightContentClassName={styles.incidentDetails}
                    rightContent={
                        <IncidentInformation
                            incident={incident}
                        />
                    }
                    leftContent={
                        <ResourceList
                            className={styles.resourceList}
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
            `/incident/${incidentId}/response/?distance=1000`
        ),
        onSuccess: ({ response, props: { setResourceList } }) => {
            setResourceList({ resourceList: response });
        },
        onMount: ({ props: { incidentId } }) => (
            !!incidentId
        ),
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
    },
    // TODO: add schema, onFailure, onFatal
};

const mapStateToProps = state => ({
    incidentId: incidentIdFromRouteSelector(state),
    incident: incidentSelector(state),
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
