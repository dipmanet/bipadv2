import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    setIncidentListActionIP,
} from '#actionCreators';
import {
    incidentListSelectorIP,
    filtersValuesSelectorIP,
} from '#selectors';

import Page from '#components/Page';

import { transformDateRangeFilterParam } from '#utils/transformations';

import IncidentsFilter from './Filter';
import Map from './Map';
import LeftPane from './LeftPane';

import styles from './styles.scss';


const propTypes = {
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

class Incidents extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getIncidentRendererParams = (_, d) => ({
        data: d,
        className: styles.incident,
    });

    render() {
        const {
            incidentList,
            requests: {
                incidentsRequest: { pending: incidentsPending },
            },
        } = this.props;

        return (
            <React.Fragment>
                <Map incidentList={incidentList} />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={
                        <LeftPane
                            incidentList={incidentList}
                            pending={incidentsPending}
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
    filters: filtersValuesSelectorIP(state),
});

const mapDispatchToProps = dispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
});

const requests = {
    incidentsRequest: {
        url: '/incident/',
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            expand: ['loss', 'event'],
        }),
        onSuccess: ({ response, props: { setIncidentList } }) => {
            const { results: incidentList = [] } = response;
            setIncidentList({ incidentList });
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters: { hazard, dateRange } },
                prevProps: { filters: { hazard: prevHazard, dateRange: prevDateRange } },
            }) => hazard !== prevHazard || dateRange !== prevDateRange,
        },
        // FIXME: write schema
    },
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(Incidents);
