import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as PageType from '#store/atom/page/types';

import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';
import { TitleContext, DataArchive } from '#components/TitleContext';
import { groupList } from '#utils/common';

import TopBar from './TopBar';
import Header from './Header';
import Note from './Note';
import RiverGroup from './RiverGroup';
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
import {
    setDataArchiveRiverListAction,
} from '#actionCreators';

import {
    dataArchiveRiverListSelector,
} from '#selectors';
import { AppState } from '#store/types';

import Loading from '#components/Loading';

import styles from './styles.scss';

interface PropsFromDispatch {
    setDataArchiveRiverList: typeof setDataArchiveRiverListAction;
}

interface PropsFromState {
    riverList: PageType.DataArchiveRiver[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    riverList: dataArchiveRiverListSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setDataArchiveRiverList: params => dispatch(setDataArchiveRiverListAction(params)),
});

interface Params {}
interface OwnProps {}

interface State {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    dataArchiveRiverRequest: {
        url: '/river/',
        method: methods.GET,
        query: () => ({
            // ...transformDataRangeLocaleToFilter(pollutionFilters.dataDateRange, 'created_on'),
            // station: pollutionFilters.station.id,
            // // historical: true,
            // fields: [
            //     'id',
            //     'created_on',
            //     'title',
            //     'aqi_color',
            //     'aqi',
            //     'observation',
            //     'point',
            //     'station',
            //     'description',
            // ],
            limit: 99,
        }),
        onSuccess: ({ response, props: { setDataArchiveRiverList } }) => {
            interface Response { results: PageType.DataArchiveRiver[] }
            const { results: dataArchiveRiverList = [] } = response as Response;
            setDataArchiveRiverList({ dataArchiveRiverList });
        },
        // onPropsChanged: {
        //     pollutionFilters: true,
        // },
        onMount: true,
        extras: {
            schemaName: 'riverResponse',
        },
    },
    // riverStationRequest: {
    //     url: '/river-stations/',
    //     method: methods.GET,
    //     query: () => ({
    //         fields: ['id', 'province', 'district', 'municipality', 'ward', 'name', 'point'],
    //     }),
    //     onSuccess: ({ response, props: { setDataArchivePollutionStations } }) => {
    //         interface Response { results: PollutionStation[] }
    //         const { results: dataArchivePollutionStations = [] } = response as Response;
    //         setDataArchivePollutionStations({ dataArchivePollutionStations });
    //     },
    //     onMount: true,
    // },
};

const River = (props: Props) => {
    const [sortKey, setSortKey] = useState('key');
    const { riverList, requests } = props;
    const pending = isAnyRequestPending(requests);

    const { setDataArchive } = useContext(TitleContext);

    const {
        setData,
    }: DataArchiveContextProps = useContext(DataArchiveContext);

    useEffect(() => {
        if (setData) {
            // const filtered = filterByStationName(pollutionFilters, pollutionList);
            setData(riverList);
        }
    }, [riverList, setData]);

    if (!pending && riverList.length < 1) {
        return (
            <div
                className={styles.message}
            >
                <Loading pending={isAnyRequestPending(requests)} />
                <Message>
                    No data available for the applied filter.
                </Message>
            </div>
        );
    }

    const compare = (a: any, b: any) => {
        if (a[sortKey] < b[sortKey]) {
            return -1;
        }
        if (a[sortKey] > b[sortKey]) {
            return 1;
        }
        return 0;
    };

    const groupedRiverList = groupList(
        riverList.filter(e => e.title),
        river => river.title || 'N/A',
    ).sort(compare);

    return (
        <div className={styles.river}>
            <Loading pending={pending} />
            <TopBar
                riverList={riverList}
                startDate="2020-01-12"
                endDate="2020-01-21"
            />
            <div className={styles.header}>
                <Header
                    dataCount={riverList.length || 0}
                />
            </div>
            <Note />
            { groupedRiverList.map((group) => {
                const { key, value } = group;
                if (value.length > 1) {
                    return (
                        <RiverGroup
                            title={key}
                            data={value}
                            key={key}
                        />
                    );
                }
                // return <RiverItem key={key} data={value[0]} />;
                return <div key={key}>{key}</div>;
            })}
          River
        </div>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(River);
