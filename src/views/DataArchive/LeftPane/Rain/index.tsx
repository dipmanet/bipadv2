import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as PageType from '#store/atom/page/types';

import DataArchiveContext, { DataArchiveContextProps } from '#components/DataArchiveContext';
import { groupList } from '#utils/common';
import { getDatesFromFilters } from '#views/DataArchive/utils';


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

import style from '#mapStyles/rasterStyle';
import { getCategoryForContinuousColorScheme } from '#rsu/ColorScheme';
import styles from './styles.scss';
import RainItem from './RainItem';
import RainGroup from './RainGroup';
import Note from './Note';
import Header from './Header';
import TopBar from './TopBar';

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
        url: '/rain-trimed/',
        method: methods.GET,
        query: ({ props: { rainFilters } }) => ({
            ...transformDataRangeLocaleToFilter(rainFilters.dataDateRange, 'measured_on'),
            station: rainFilters.station.id,
            // historical: true,
            fields: [
                'id',
                'created_on',
                'measured_on',
                'title',
                'basin',
                'point',
                'averages',
                'status',
                'station',
                'description',
            ],
            trimBy: 'avg',
            trimType: 'daily',
            limit: -1,
        }),
        onSuccess: ({ params, response, props: { setDataArchiveRainList } }) => {
            interface Response { results: PageType.DataArchiveRain[] }
            const { results: dataArchiveRainList = [] } = response as Response;

            if (params.basinFilter !== undefined) {
                setDataArchiveRainList({ dataArchiveRainList:
                    dataArchiveRainList.filter(item => item.basin === params.basinFilter) });
            } else {
                setDataArchiveRainList({ dataArchiveRainList });
            }
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
        // query: () => ({
        // eslint-disable-next-line max-len
        //     fields: ['id', 'province', 'basin', 'district', 'municipality', 'ward', 'title', 'point', 'status', 'description', 'measuredOn', 'averages', 'modifiedOn'],
        // }),
        onSuccess: ({ params, response, props: { setDataArchiveRainStations } }) => {
            interface Response { results: RainStation[] }

            const { results: dataArchiveRainStations = [] } = response as Response;

            if (params.stationFilter !== undefined) {
                setDataArchiveRainStations({ dataArchiveRainStations:
                    dataArchiveRainStations.filter(item => item.id === params.stationFilter) });
            } else if (params.basinFilter !== undefined) {
                setDataArchiveRainStations({ dataArchiveRainStations:
                    dataArchiveRainStations.filter(item => item.basin === params.basinFilter) });
            } else {
                setDataArchiveRainStations({ dataArchiveRainStations });
            }
        },
        onPropsChanged: {
            rainFilters: true,
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


    requests.dataArchiveRainRequest.setDefaultParams({
        basinFilter: (rainFilters.basin) ? rainFilters.basin.title : '',
    });

    requests.rainStationRequest.setDefaultParams({
        basinFilter: (rainFilters.basin) ? rainFilters.basin.title : '',
        stationFilter: (rainFilters.station) ? rainFilters.station.id : '',
    });

    useEffect(() => {
        if (setData) {
            setData(rainList);
        }
    }, [setData, rainList]);

    useEffect(() => {
        if (rainFilters.basin) {
            if (props.rainStations && props.rainStations.length > 0) {
                props.setDataArchiveRainStations({ dataArchiveRainStations:
                    props.rainStations.filter(item => item.basin === rainFilters.basin.title) });
            }
        }

        if (rainFilters.basin) {
            if (props.rainList && props.rainList.length > 0) {
                props.setDataArchiveRainList({ dataArchiveRainList:
                    props.rainList.filter(item => item.basin === rainFilters.basin.title) });
            }
        }
        if (rainFilters.station) {
            if (props.rainStations && props.rainStations.length > 0) {
                props.setDataArchiveRainStations({ dataArchiveRainStations:
                    props.rainStations.filter(item => item.id === rainFilters.station.id) });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rainFilters.basin, rainFilters.station]);


    const { station: { title: location } } = rainFilters;
    const [startDate, endDate] = getDatesFromFilters(rainFilters);

    if (setDataArchive) {
        setDataArchive((prevState: DataArchive) => {
            if (prevState.mainModule !== 'Rain'
            || prevState.location !== location
            || prevState.startDate !== startDate
            || prevState.endDate !== endDate) {
                return { ...prevState, mainModule: 'Rain', location, startDate, endDate };
            }
            return prevState;
        });
    }

    if (!pending && rainList && rainList.length < 1) {
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
                    dataCount={rainList && rainList.length}
                />
                <div className={styles.note}>
                    {!pending && <Note />}
                </div>
                <div className={styles.basin}>
                    { (rainFilters.basin.title) ? `Selected basin: ${rainFilters.basin.title}` : ''}
                </div>
            </div>
            {/* {rainList && rainList.length > 0 && rainList.map(item => item.id)} */}
            {/* the rain stuff need to be here */}
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
