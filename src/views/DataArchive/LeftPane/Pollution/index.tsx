import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as PageType from '#store/atom/page/types';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';

import PollutionItem from './PollutionItem';
import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';
import Header from '../Header';
import Message from '#rscv/Message';
import { groupList } from '#utils/common';
import PollutionGroup from './PollutionGroup';
import DateRangeInfo from '#components/DateRangeInfo';
import PollutionModal from './Modal';
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

import { transformDataRangeLocaleToFilter, pastDaysToDateRange } from '#utils/transformations';

import {
    setDataArchivePollutionListAction,
} from '#actionCreators';

import { DAPollutionFiltersElement } from '#types';

import { AppState } from '#store/types';

import Loading from '#components/Loading';
import PollutionViz from './Visualization';

import {
    dataArchivePollutionListSelector,
    pollutionFiltersSelector,
} from '#selectors';

import styles from './styles.scss';

interface PropsFromDispatch {
    setDataArchivePollutionList: typeof setDataArchivePollutionListAction;
}

interface PropsFromState {
    pollutionList: PageType.DataArchivePollution[];
    pollutionFilters: DAPollutionFiltersElement;
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    pollutionList: dataArchivePollutionListSelector(state),
    pollutionFilters: pollutionFiltersSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setDataArchivePollutionList: params => dispatch(setDataArchivePollutionListAction(params)),
});
interface Params {}
interface OwnProps {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

interface State {}

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimePollutionRequest: {
        url: '/pollution/',
        method: methods.GET,
        query: ({ props: { pollutionFilters } }) => ({
            ...transformDataRangeLocaleToFilter(pollutionFilters.dataDateRange, 'created_on'),
            historical: true,
        }),
        onSuccess: ({ response, props: { setDataArchivePollutionList } }) => {
            interface Response { results: PageType.DataArchivePollution[] }
            const { results: dataArchivePollutionList = [] } = response as Response;
            setDataArchivePollutionList({ dataArchivePollutionList });
        },
        onPropsChanged: {
            pollutionFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'pollutionResponse',
        },
    },
};
const getDates = (pollutionFilters: DAPollutionFiltersElement) => {
    const { dataDateRange } = pollutionFilters;
    const { rangeInDays } = dataDateRange;
    let startDate;
    let endDate;
    if (rangeInDays !== 'custom') {
        ({ startDate, endDate } = pastDaysToDateRange(rangeInDays));
    } else {
        ({ startDate, endDate } = dataDateRange);
    }
    return [startDate, endDate];
};

const ModalButton = modalize(Button);

const Pollution = (props: Props) => {
    const [sortKey, setSortKey] = useState('createdOn');
    const [activeView, setActiveView] = useState('data');
    const { pollutionList, requests, pollutionFilters } = props;
    const pending = isAnyRequestPending(requests);
    const {
        setData,
    }: DataArchiveContextProps = useContext(DataArchiveContext);

    const handleDataButtonClick = () => {
        setActiveView('data');
    };
    const handleVisualizationsButtonClick = () => {
        setActiveView('visualizations');
    };

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
                <Loading pending />
                <Message>
                    No data available in the database.
                </Message>
            </div>
        );
    }
    const compare = (a: any, b: any) => {
        if (a[sortKey] < b[sortKey]) {
            return 1;
        }
        if (a[sortKey] > b[sortKey]) {
            return -1;
        }
        return 0;
    };

    const groupedPollutionList = groupList(
        pollutionList.filter(e => e.title),
        pollution => pollution.title || 'N/A',
    ).sort(compare);

    const [startDate, endDate] = getDates(pollutionFilters);

    return (
        <div className={styles.pollution}>
            <Loading pending={pending} />
            <div className={styles.topBar}>
                <DateRangeInfo
                    className={styles.dateRange}
                    startDate={startDate || 'N/A'}
                    endDate={endDate || 'N/A'}
                />
                <ModalButton
                    className={styles.showDetailsButton}
                    transparent
                    iconName="table"
                    title="Show all data"
                    modal={(
                        <PollutionModal
                            dataArchivePollution={pollutionList}
                        />
                    )}
                />
            </div>
            <div className={styles.header}>
                <Header
                    chosenOption="Pollution"
                    dataCount={pollutionList.length || 0}
                    activeView={activeView}
                    handleDataButtonClick={handleDataButtonClick}
                    handleVisualizationsButtonClick={handleVisualizationsButtonClick}
                />
            </div>
            {/* {
                activeView === 'data' && pollutionList.map(
                    (datum: PageType.DataArchivePollution) => (
                    <PollutionItem
                        data={datum}
                        key={datum.id}
                    />
                ))
            } */}
            { activeView === 'data' && groupedPollutionList.map((group) => {
                const { key, value } = group;
                if (value.length > 1) {
                    return (
                        <PollutionGroup
                            title={key}
                            data={value}
                            key={key}
                        />
                    );
                }
                return <PollutionItem key={key} data={value[0]} />;
            })}
            { activeView === 'visualizations' && (
                <PollutionViz pollutionList={pollutionList} />
            ) }
        </div>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(Pollution);
