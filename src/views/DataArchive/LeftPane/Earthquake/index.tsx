import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as PageType from '#store/atom/page/types';


import EarthquakeItem from './EarthquakeItem';
import Message from '#rscv/Message';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';


import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    isAnyRequestPending,
} from '#utils/request';

import { transformDateRangeFilterParam, transformDataRangeToFilter } from '#utils/transformations';

import {
    setDataArchiveEarthquakeListAction,
} from '#actionCreators';

import { FiltersElement } from '#types';

import { AppState } from '#store/types';

import Loading from '#components/Loading';

import {
    dataArchiveEarthquakeListSelector,
    realTimeFiltersValuesSelector,
    filtersSelector,
} from '#selectors';

import styles from './styles.scss';

interface PropsFromDispatch {
    setDataArchiveEarthquakeList: typeof setDataArchiveEarthquakeListAction;
}

interface PropsFromState {
    filters: PageType.FiltersWithRegion['faramValues'];
    globalFilters: FiltersElement;
    earthquakeList: PageType.DataArchiveEarthquake[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    filters: realTimeFiltersValuesSelector(state),
    globalFilters: filtersSelector(state),
    earthquakeList: dataArchiveEarthquakeListSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setDataArchiveEarthquakeList: params => dispatch(setDataArchiveEarthquakeListAction(params)),
});
interface Params {}
interface OwnProps {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;


interface State {}

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimeEarthquakeRequest: {
        url: '/earthquake/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            ...transformDataRangeToFilter(globalFilters.dataDateRange, 'event__on'),
        }),
        onSuccess: ({ response, props: { setDataArchiveEarthquakeList } }) => {
            interface Response { results: PageType.DataArchiveEarthquake[] }
            const { results: dataArchiveEarthquakeList = [] } = response as Response;
            setDataArchiveEarthquakeList({ dataArchiveEarthquakeList });
        },
        onPropsChanged: {
            filters: ({
                props: { filters: { region } },
                prevProps: { filters: {
                    region: prevRegion,
                } },
            }) => region !== prevRegion,
            globalFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'earthquakeResponse',
        },
    },
};

class Earthquake extends React.PureComponent<Props, State> {
    public render() {
        const { earthquakeList, requests } = this.props;
        const pending = isAnyRequestPending(requests);

        const {
            setData,
        }: DataArchiveContextProps = this.context;
        if (setData) {
            setData(earthquakeList);
        }

        if (earthquakeList.length < 1) {
            return (
                <div
                    className={styles.message}
                >
                    <Message>
                        No data available in the database.
                    </Message>
                </div>
            );
        }
        return (
            <div className={styles.earthquake}>
                <Loading pending={pending} />
                { earthquakeList.map((datum: PageType.DataArchiveEarthquake) => (
                    <EarthquakeItem
                        data={datum}
                    />
                )) }
            </div>
        );
    }
}

Earthquake.contextType = DataArchiveContext;
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(Earthquake);
