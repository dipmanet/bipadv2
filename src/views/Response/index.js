import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    incidentSelector,
    resourceListSelectorRP,
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

const mapStateToProps = state => ({
    // incidentId: incidentIdFromRouteSelector(state),
    incident: incidentSelector(state),
    resourceList: resourceListSelectorRP(state),
});

@connect(mapStateToProps)
export default class Response extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            incident,
            resourceList,
        } = this.props;

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
