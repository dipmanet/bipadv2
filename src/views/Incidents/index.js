import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    incidentListSelectorIP,
    setIncidentListActionIP,
} from '#redux';

import Page from '#components/Page';

import IncidentsFilter from './Filter';
import Map from './Map';

import LeftPane from './LeftPane';
import styles from './styles.scss';

const requests = {
    incidentsRequest: {
        url: '/incident/',
        onSuccess: ({ response, props: { setIncidentList } }) => {
            const { results: incidentList = [] } = response;
            setIncidentList({ incidentList });
        },
        onMount: true,
    },
    // TODO: add schema, onFailure, onFatal
};

const propTypes = {
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

class Incidents extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            incidentList,
        } = this.props;

        return (
            <React.Fragment>
                <Map incidentList={incidentList} />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={
                        <LeftPane
                            incidentList={incidentList}
                        />
                    }
                    rightContentClassName={styles.right}
                    rightContent={
                        <IncidentsFilter />
                    }
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    incidentList: incidentListSelectorIP(state),
});

const mapDispatchToProps = dispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(Incidents),
    ),
);
