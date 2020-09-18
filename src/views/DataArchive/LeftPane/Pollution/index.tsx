import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as PageType from '#store/atom/page/types';

import PollutionItem from './PollutionItem';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';

import Message from '#rscv/Message';

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
    setDataArchivePollutionListAction,
} from '#actionCreators';

import { FiltersElement } from '#types';

import { AppState } from '#store/types';

import Loading from '#components/Loading';

import {
    dataArchivePollutionListSelector,
    realTimeFiltersValuesSelector,
    filtersSelector,
} from '#selectors';

import styles from './styles.scss';

interface PropsFromDispatch {
    setDataArchivePollutionList: typeof setDataArchivePollutionListAction;
}

interface PropsFromState {
    filters: PageType.FiltersWithRegion['faramValues'];
    globalFilters: FiltersElement;
    pollutionList: PageType.DataArchivePollution[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    filters: realTimeFiltersValuesSelector(state),
    globalFilters: filtersSelector(state),
    pollutionList: dataArchivePollutionListSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setDataArchivePollutionList: params => dispatch(setDataArchivePollutionListAction(params)),
});
interface Params {}
interface OwnProps {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

interface PollutionData {
    aqi: number;
    createdOn: string;
    observation: {}[];
    title: string;
}

interface State {}

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimePollutionRequest: {
        url: '/pollution/',
        method: methods.GET,
        query: ({ props: { filters, globalFilters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            ...transformDataRangeToFilter(globalFilters.dataDateRange, 'created_on'),
        }),
        onSuccess: ({ response, props: { setDataArchivePollutionList } }) => {
            interface Response { results: PageType.DataArchivePollution[] }
            const { results: dataArchivePollutionList = [] } = response as Response;
            setDataArchivePollutionList({ dataArchivePollutionList });
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
            schemaName: 'pollutionResponse',
        },
    },
};

// class Pollution extends React.PureComponent<Props, State> {
const Pollution = (props: Props) => {
    const { pollutionList, requests } = props;
    const pending = isAnyRequestPending(requests);
    const {
        setData,
    }: DataArchiveContextProps = useContext(DataArchiveContext);

    useEffect(() => {
        if (setData) {
            setData(pollutionList);
        }
    }, [pollutionList, setData]);

    if (pollutionList.length < 1) {
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
        <div className={styles.pollution}>
            <Loading pending={pending} />

            { pollutionList.map((datum: PageType.DataArchivePollution) => (
                <PollutionItem
                    data={datum}
                    key={datum.id}
                />
            )) }
        </div>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(Pollution);
