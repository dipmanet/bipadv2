import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import { transformDateRangeFilterParam } from '#utils/transformations';

import {
    alertListSelectorDP,
    setAlertListActionDP,
    hazardTypesSelector,
    filtersValuesSelectorDP,
} from '#redux';

import Page from '#components/Page';

import Map from './Map';
import LeftPane from './LeftPane';
import DashboardFilter from './Filter';

import styles from './styles.scss';

const propTypes = {
    alertList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    hazardTypes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    requests: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

class Dashboard extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            alertList,
            hazardTypes,
            requests: {
                alertsRequest: { pending: alertsPending },
            },
        } = this.props;

        return (
            <React.Fragment>
                <Map
                    alertList={alertList}
                    hazardTypes={hazardTypes}
                />
                <Page
                    leftContent={
                        <LeftPane
                            alertList={alertList}
                            hazardTypes={hazardTypes}
                            pending={alertsPending}
                        />
                    }
                    rightContent={<DashboardFilter />}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    alertList: alertListSelectorDP(state),
    hazardTypes: hazardTypesSelector(state),
    filters: filtersValuesSelectorDP(state),
});

const mapDispatchToProps = dispatch => ({
    setAlertList: params => dispatch(setAlertListActionDP(params)),
});

const requests = {
    alertsRequest: {
        url: '/alert/',
        // We have to transform dateRange to created_on__lt and created_on__gt
        query: ({ props: { filters } }) => transformDateRangeFilterParam(filters, 'created_on'),
        onSuccess: ({ response, props: { setAlertList } }) => {
            const { results: alertList = [] } = response;
            setAlertList({ alertList });
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

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(Dashboard),
    ),
);
