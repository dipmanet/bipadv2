import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    setRiskListAction,
    setLpGasCookListAction,
    setRegionAction,
} from '#actionCreators';

import {
    riskListSelector,
    lpGasCookListSelector,
    regionsSelector,
    regionSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    regionLevelSelector,
    mapStyleSelector,
} from '#selectors';

import Visualizations from './Visualizations';
import styles from './styles.scss';

const mapStateToProps = (state, props) => ({
    riskList: riskListSelector(state),
    lpGasCookList: lpGasCookListSelector(state),
    regions: regionsSelector(state),
    region: regionSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    regionLevel: regionLevelSelector(state, props),
    mapStyle: mapStyleSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setRiskList: params => dispatch(setRiskListAction(params)),
    setLpGasCookList: params => dispatch(setLpGasCookListAction(params)),
    setRegion: params => dispatch(setRegionAction(params)),
});
const wsEndpoint = process.env.REACT_APP_GEO_SERVER_URL || 'http://139.59.67.104:8004';

const requests = {
    riskRequest: {
        url: `${wsEndpoint}/risk_profile/Risk`,
        onMount: false,
        onSuccess: ({ response, props: { setRiskList } }) => {
            const { results: riskList } = response;
            setRiskList({ riskList });
        },
        // TODO: add schema
    },
    lpgasCookRequest: {
        url: `${wsEndpoint}/risk_profile/Newfile/lpgas_cook`,
        onMount: false,
        onSuccess: ({ response, props: { setLpGasCookList } }) => {
            const { data: lpGasCookList } = response;
            setLpGasCookList({ lpGasCookList });
        },
        // TODO: add schema
    },
    lossAndDamageRequest: {
        url: '/incident/',
        query: {
            expand: ['loss.peoples', 'wards'],
            limit: 12000,
            ordering: '-incident_on',
            lnd: true,
        },
        onMount: true,
        extras: {
            schemaName: 'incidentWithPeopleResponse',
        },
    },
};

const emptyList = [];
const emptyObject = {};

class Disasters extends React.PureComponent {
    render() {
        const {
            riskList,
            lpGasCookList,
            requests: {
                lossAndDamageRequest: {
                    pending: lossAndDamageRequestPending,
                    response: {
                        results: lossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
            regionLevel,
            mapStyle,
            regions,
            region,
        } = this.props;

        return (
            <Visualizations
                lossAndDamageList={lossAndDamageList}
            />
        );
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(Disasters);
