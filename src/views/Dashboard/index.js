import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    alertListSelectorDP,
    setAlertListActionDP,
    hazardTypesSelector,
} from '#redux';

import Page from '#components/Page';

import Map from './Map';
import LeftPane from './LeftPane';
import DashboardFilter from './Filter';

import styles from './styles.scss';

const requests = {
    alertsRequest: {
        url: '/alert/',
        onSuccess: ({ response, props: { setAlertList } }) => {
            const { results: alertList = [] } = response;
            setAlertList({ alertList });
        },
        onMount: true,
    },
};

const propTypes = {
    alertList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    hazardTypes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {};

class Dashboard extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            alertList,
            hazardTypes,
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
});

const mapDispatchToProps = dispatch => ({
    setAlertList: params => dispatch(setAlertListActionDP(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator()(
        createRequestClient(requests)(Dashboard),
    ),
);
