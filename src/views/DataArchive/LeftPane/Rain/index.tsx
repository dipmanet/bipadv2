import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as PageType from '#store/atom/page/types';

import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';
import { groupList } from '#utils/common';
import { getDatesFromFilters } from '#views/DataArchive/utils';

import TopBar from './TopBar';
import Header from './Header';
import Note from './Note';
import RainGroup from './RainGroup';
import RainItem from './RainItem';

import Message from '#rscv/Message';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import { transformDataRangeLocaleToFilter } from '#utils/transformations';

import {
    isAnyRequestPending,
} from '#utils/request';
import {
    setDataArchiveRainListAction,
    setDataArchiveRainStationAction,
} from '#actionCreators';

import { DARainFiltersElement, RainStation } from '#types';

import {
    dataArchiveRainListSelector,
    rainFiltersSelector,
    rainStationsSelector,
} from '#selectors';
import { TitleContext, DataArchive } from '#components/TitleContext';

import { AppState } from '#store/types';

import Loading from '#components/Loading';

import styles from './styles.scss';

interface PropsFromDispatch {
    setDataArchiveRainList: typeof setDataArchiveRainListAction;
    setDataArchiveRainStations: typeof setDataArchiveRainStationAction;
}

interface PropsFromState {
    rainList: PageType.DataArchiveRain[];
    rainFilters: DARainFiltersElement;
    rainStations: RainStation[];

}

const mapStateToProps = (state: AppState): PropsFromState => ({
    rainList: dataArchiveRainListSelector(state),
    rainFilters: rainFiltersSelector(state),
    rainStations: rainStationsSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setDataArchiveRainList: params => dispatch(setDataArchiveRainListAction(params)),
    setDataArchiveRainStations: params => dispatch(
        setDataArchiveRainStationAction(params),
    ),
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
        query: ({ props: { rainFilters } }) => ({
            ...transformDataRangeLocaleToFilter(rainFilters.dataDateRange, 'created_on'),
            station: rainFilters.station.id,
            // historical: true,
            fields: [
                'id',
                'created_on',
                'title',
                'basin',
                'point',
                'averages',
                'status',
                'station',
            ],
            limit: 99,
        }),
        onSuccess: ({ response, props: { setDataArchiveRainList } }) => {
            interface Response { results: PageType.DataArchiveRain[] }
            const { results: dataArchiveRainList = [] } = response as Response;
            setDataArchiveRainList({ dataArchiveRainList });
        },
        onPropsChanged: {
            rainFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'rainResponse',
        },
    },
    rainStationRequest: {
        url: '/rain-stations/',
        method: methods.GET,
        query: () => ({
            fields: ['id', 'province', 'district', 'municipality', 'ward', 'title', 'point'],
        }),
        onSuccess: ({ response, props: { setDataArchiveRainStations } }) => {
            interface Response { results: RainStation[] }
            const { results: dataArchiveRainStations = [] } = response as Response;
            setDataArchiveRainStations({ dataArchiveRainStations });
        },
        onMount: true,
    },
};

const Rain = (props: Props) => {
    const [sortKey, setSortKey] = useState('key');
    const { rainList, requests, rainFilters } = props;
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

    const [startDate, endDate] = getDatesFromFilters(rainFilters);

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
                startDate={startDate}
                endDate={endDate}
            />
            <div className={styles.header}>
                <Header
                    dataCount={rainList.length || 0}
                />
                <div className={styles.note}>
                    {!pending && <Note />}
                </div>
            </div>
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
                return <RainItem key={key} data={value[0]} />;
            })}
        </div>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(Rain);
