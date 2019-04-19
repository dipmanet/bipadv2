import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Page from '#components/Page';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    setRiskListAction,
    setLpGasCookListAction,
} from '#actionCreators';
import {
    riskListSelector,
    lpGasCookListSelector,
} from '#selectors';

import styles from './styles.scss';

const mapStateToProps = state => ({
    riskList: riskListSelector(state),
    lpGasCookList: lpGasCookListSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setRiskList: params => dispatch(setRiskListAction(params)),
    setLpGasCookList: params => dispatch(setLpGasCookListAction(params)),
});

const requests = {
    riskRequest: {
        url: 'http://139.59.67.104:8004/risk_profile/Risk',
        onMount: true,
        onSuccess: ({ response, props: { setRiskList } }) => {
            const { results: riskList } = response;
            setRiskList({ riskList });
        },
        // TODO: add schema
    },
    lpgasCookRequest: {
        url: 'http://139.59.67.104:8004/risk_profile/Newfile/lpgas_cook',
        onMount: true,
        onSuccess: ({ response, props: { setLpGasCookList } }) => {
            const { data: lpGasCookList } = response;
            setLpGasCookList({ lpGasCookList });
        },
        // TODO: add schema
    },
};

class DisasterProfile extends React.PureComponent {
    render() {
        const {
            riskList,
            lpGasCookList,
        } = this.props;

        return (
            <Page
                mainContent={null}
                leftContentClassName={styles.left}
                leftContent={null}
                rightContentClassName={styles.right}
                rightContent={null}
            />
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(DisasterProfile);
