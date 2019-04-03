import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Obj } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import HazardsLegend from '#components/HazardsLegend';

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
import { hazardTypesList } from '#utils/domain';

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

interface State {
    leftPaneExpanded?: boolean;
    rightPaneExpanded?: boolean;
}
interface Params {}
interface OwnProps {}
interface PropsFromState {
    alertList: PageTypes.Alert[];
    hazardTypes: Obj<PageTypes.HazardType>;
    filters: PageTypes.FiltersWithRegion['faramValues'];
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
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'created_on'),
            expand: ['event'],
        }),
        onSuccess: ({ response, props: { setAlertList } }) => {
            interface Response { results: PageTypes.Alert[] }
            const { results: alertList = [] } = response as Response;
            setAlertList({ alertList });
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters: { hazard, dateRange, region } },
                prevProps: { filters: {
                    hazard: prevHazard,
                    dateRange: prevDateRange,
                    region: prevRegion,
                } },
            }) => (
                hazard !== prevHazard || dateRange !== prevDateRange || region !== prevRegion
            ),
        },
        extras: {
            schemaName: 'alertResponse',
        },
    },
};

class Dashboard extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }

    private getAlertHazardTypesList = memoize((alertList) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(alertList, hazardTypes);
    });

    private handleLeftPaneExpandChange = (leftPaneExpanded: boolean) => {
        this.setState({ leftPaneExpanded });
    }

    private handleRightPaneExpandChange = (rightPaneExpanded: boolean) => {
        this.setState({ rightPaneExpanded });
    }

    public render() {
        const {
            alertList,
            hazardTypes,
            requests: {
                alertsRequest: { pending: alertsPending },
            },
        } = this.props;

        const filteredHazardTypes = this.getAlertHazardTypesList(alertList);

        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        return (
            <React.Fragment>
                <Map
                    alertList={alertList}
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                />
                <Page
                    leftContent={
                        <LeftPane
                            alertList={alertList}
                            hazardTypes={hazardTypes}
                            pending={alertsPending}
                            onExpandChange={this.handleLeftPaneExpandChange}
                        />
                    }
                    mainContent={
                        <HazardsLegend
                            filteredHazardTypes={filteredHazardTypes}
                            className={styles.hazardLegend}
                            itemClassName={styles.legendItem}
                        />
                    }
                    rightContent={
                        <DashboardFilter
                            onExpandChange={this.handleRightPaneExpandChange}
                        />
                    }
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
