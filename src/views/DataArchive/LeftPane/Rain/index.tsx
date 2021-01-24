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
import RainGroup from './RainGroup';

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
    setDataArchiveRainListAction,
} from '#actionCreators';

import {
    dataArchiveRainListSelector,
} from '#selectors';
import { AppState } from '#store/types';

import Loading from '#components/Loading';

import styles from './styles.scss';

interface PropsFromDispatch {
    setDataArchiveRainList: typeof setDataArchiveRainListAction;
}

interface PropsFromState {
    rainList: PageType.DataArchiveRain[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    rainList: dataArchiveRainListSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setDataArchiveRainList: params => dispatch(setDataArchiveRainListAction(params)),
});

interface Params {}
interface OwnProps {}

interface State {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    dataArchiveRainRequest: {
        url: '/rain/',
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
        onSuccess: ({ response, props: { setDataArchiveRainList } }) => {
            interface Response { results: PageType.DataArchiveRain[] }
            const { results: dataArchiveRainList = [] } = response as Response;
            setDataArchiveRainList({ dataArchiveRainList });
        },
        // onPropsChanged: {
        //     pollutionFilters: true,
        // },
        onMount: true,
        extras: {
            schemaName: 'rainResponse',
        },
    },
    // rainStationRequest: {
    //     url: '/rain-stations/',
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

const Rain = (props: Props) => {
    const [sortKey, setSortKey] = useState('key');
    const { rainList, requests } = props;
    const pending = isAnyRequestPending(requests);
    const { setDataArchive } = useContext(TitleContext);

    const {
        setData,
    }: DataArchiveContextProps = useContext(DataArchiveContext);

    useEffect(() => {
        if (setData) {
            // const filtered = filterByStationName(pollutionFilters, pollutionList);
            setData(rainList);
        }
    }, [rainList, setData]);

    if (!pending && rainList.length < 1) {
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

    const groupedRainList = groupList(
        rainList.filter(e => e.title),
        rain => rain.title || 'N/A',
    ).sort(compare);
    return (
        <div className={styles.rain}>
            <Loading pending={pending} />
            <TopBar
                rainList={rainList}
                startDate="2020-01-12"
                endDate="2020-01-21"
            />
            <div className={styles.header}>
                <Header
                    dataCount={rainList.length || 0}
                />
            </div>
            <Note />
            { groupedRainList.map((group) => {
                const { key, value } = group;
                if (value.length > 1) {
                    return (
                        <RainGroup
                            title={key}
                            data={value}
                            key={key}
                        />
                    );
                }
                // return <RainItem key={key} data={value[0]} />;
                return <div key={key}>{key}</div>;
            })}
          Rain
        </div>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(Rain);
