import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Obj } from '@togglecorp/fujs';

import { AppState } from '#store/types';
import * as PageTypes from '#store/atom/page/types';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { transformDateRangeFilterParam } from '#utils/transformations';

import {
    setAlertListActionDP,
} from '#actionCreators';
import {
    alertListSelectorDP,
    hazardTypesSelector,
    filtersValuesSelectorDP,
} from '#selectors';

import Page from '#components/Page';

import Map from './Map';
import LeftPane from './LeftPane';
import DashboardFilter from './Filter';

import styles from './styles.scss';

interface State {}
interface Params {}
interface OwnProps {}
interface PropsFromState {
    alertList: PageTypes.Alert[];
    hazardTypes: Obj<PageTypes.HazardType>;
    filters: PageTypes.Filters['faramValues'];
}
interface PropsFromDispatch {
    setAlertList: typeof setAlertListActionDP;
}
type ReduxProps = OwnProps & PropsFromState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    alertList: alertListSelectorDP(state),
    hazardTypes: hazardTypesSelector(state),
    filters: filtersValuesSelectorDP(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setAlertList: params => dispatch(setAlertListActionDP(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    alertsRequest: {
        url: '/alert/',
        method: methods.GET,
        // We have to transform dateRange to created_on__lt and created_on__gt
        query: ({ props: { filters } }) => transformDateRangeFilterParam(filters, 'created_on'),
        onSuccess: ({ response, props: { setAlertList } }) => {
            interface Response { results: PageTypes.Alert[] }
            const { results: alertList = [] } = response as Response;
            setAlertList({ alertList });
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters: { hazard, dateRange } },
                prevProps: { filters: { hazard: prevHazard, dateRange: prevDateRange } },
            }) => (
                hazard !== prevHazard || dateRange !== prevDateRange
            ),
        },
        // FIXME: write schema
    },
};

class Dashboard extends React.PureComponent<Props, State> {
    public render() {
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

export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Dashboard,
        ),
    ),
);
