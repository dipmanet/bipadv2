import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    incidentListSelectorIP,
    setIncidentListActionIP,
    filtersValuesSelectorIP,
} from '#redux';

import Page from '#components/Page';

import IncidentsFilter from './Filter';
import Map from './Map';

import LeftPane from './LeftPane';
import styles from './styles.scss';

import { pastDaysToDateRange } from '../../utils/common';


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
    filters: filtersValuesSelectorIP(state),
});

const mapDispatchToProps = dispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
});

const transformDateRangeFilter = (filters) => {
    const { dateRange, ...other } = filters;
    if (dateRange) {
        const { startDate, endDate } = pastDaysToDateRange(dateRange);
        return {
            incident_on__lt: endDate ? endDate.toISOString() : undefined,
            incident_on__gt: startDate ? startDate.toISOString() : undefined,
            ...other,
        };
    }
    return filters;
};

const requests = {
    incidentsRequest: {
        url: '/incident/',
        query: ({ props: { filters } }) => transformDateRangeFilter(filters),
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
    },
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(Incidents);
