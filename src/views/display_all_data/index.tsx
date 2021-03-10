import React, { useState } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';

import styles from './styles.scss';
import Page from '#components/Page';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    setAlertListActionDP,
    setEventListAction,
    setDashboardHazardTypesAction,
    setFiltersAction,
    setHazardTypesAction,
} from '#actionCreators';

import {
    alertListSelectorDP,
    eventListSelector,
    hazardTypesSelector,
    dashboardFiltersSelector,
} from '#selectors';
import Response from '#views/Response';
import AddResourceForm from '#views/RiskInfo/LeftPane/Details/CapacityAndResources/AddResourceForm';

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAlertList: params => dispatch(setAlertListActionDP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
    setDashboardHazardTypes: params => dispatch(setDashboardHazardTypesAction(params)),
    setFilters: params => dispatch(setFiltersAction(params)),
    setHazardTypes: params => dispatch(setHazardTypesAction(params)),
});
const mapStateToProps = (state: AppState): PropsFromAppState => ({
    alertList: alertListSelectorDP(state),
    eventList: eventListSelector(state),
    hazardTypes: hazardTypesSelector(state),
    filters: dashboardFiltersSelector(state),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    dashBoardHazardTypesRequest: {
        url: '/hazard/',
        method: methods.GET,
        onSuccess: ({ response, props: { setDashboardHazardTypes }, params }) => {
            interface Response { results: PageTypes.HazardType[] }
            const { results: hazardTypes = [] } = response as Response;
            params.myfunction();

            params.data(hazardTypes);
            console.log('This is hazard>>>', hazardTypes);
        },
        extras: {
            schemaName: 'hazardResponse',
        },
        onMount: false,
    },

};


const Fetching = (props) => {
    const [Data, setData] = useState([]);
    const { requests: { dashBoardHazardTypesRequest } } = props;


    const handleDownload = () => {
        console.log('mt function');
    };
    dashBoardHazardTypesRequest.setDefaultParams({
        myfunction: handleDownload,
        data: setData,


    });

    return (
        <React.Fragment>
            <Page hideFilter hideMap />
            <button type="submit" className={styles.download} onClick={() => dashBoardHazardTypesRequest.do()}>Download Data</button>
            <button type="submit" className={styles.form}>Enter Form Data</button>
            <AddResourceForm />
            {Data.map(item => <h1 key={item.id}>{item.title}</h1>)}

        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Fetching,
        ),
    ),
);
