import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as PageType from '#store/atom/page/types';
import { groupList } from '#utils/common';
import TopBar from './TopBar';

// import SegmentInput from '#rsci/SegmentInput';
import EarthquakeItem from './EarthquakeItem';
import Message from '#rscv/Message';
import DataArchiveContext from '#components/DataArchiveContext';
import ScatterChartViz from './Visualization/ScatterChart';
import EarthquakeGroup from './EarthquakeGroup';

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
    transformDataRangeLocaleToFilter,
    transformRegion,
    transformMagnitude,
    pastDaysToDateRange,
} from '#utils/transformations';

import {
    setDataArchiveEarthquakeListAction,
} from '#actionCreators';

import { DAEarthquakeFiltersElement } from '#types';

import { AppState } from '#store/types';

import Loading from '#components/Loading';
import Header from './Header';
import EarthquakeViz from './Visualization';

import {
    dataArchiveEarthquakeListSelector,
    eqFiltersSelector,
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';
import { TitleContext, DataArchive } from '#components/TitleContext';

import styles from './styles.scss';

interface PropsFromDispatch {
    setDataArchiveEarthquakeList: typeof setDataArchiveEarthquakeListAction;
}

interface PropsFromState {
    earthquakeList: PageType.DataArchiveEarthquake[];
    eqFilters: DAEarthquakeFiltersElement;
    districts: PageType.District[];
    provinces: PageType.Province[];
    municipalities: PageType.Municipality[];
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    earthquakeList: dataArchiveEarthquakeListSelector(state),
    eqFilters: eqFiltersSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setDataArchiveEarthquakeList: params => dispatch(setDataArchiveEarthquakeListAction(params)),
});
interface Params {}
interface OwnProps {}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;
type Props = NewProps<ReduxProps, Params>;
type ActiveView = 'data' | 'visualizations' | 'charts';

/* const sortOptions = [
    { key: 'magnitude', label: 'Magnitude' },
    { key: 'eventOn', label: 'Event On' },
    { key: 'address', label: 'Epicenter' },
]; */

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    dataArchiveEarthquakeRequest: {
        url: '/earthquake/',
        method: methods.GET,
        query: ({ props: { eqFilters } }) => ({
            ...transformDataRangeLocaleToFilter(eqFilters.dataDateRange, 'event__on'),
            ...transformRegion(eqFilters.region),
            ...transformMagnitude(eqFilters.magnitude),
            expand: ['province', 'district', 'municipality'],
            limit: -1,
        }),
        onSuccess: ({ response, props: { setDataArchiveEarthquakeList } }) => {
            interface Response { results: PageType.DataArchiveEarthquake[] }
            const { results: dataArchiveEarthquakeList = [] } = response as Response;
            setDataArchiveEarthquakeList({ dataArchiveEarthquakeList });
        },
        onPropsChanged: {
            eqFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'earthquakeResponse',
        },
    },
};

const filterByMagnitudeRange = (
    magnitudeFromFilter: number[],
    earthquakes: PageType.DataArchiveEarthquake[],
) => {
    const filteredEarthquakes: PageType.DataArchiveEarthquake[] = [];
    const MAX_MAG = 8;
    if (magnitudeFromFilter.length === 0) {
        return earthquakes;
    }
    magnitudeFromFilter.forEach((mag) => {
        earthquakes.forEach((earthquake) => {
            const { magnitude } = earthquake;
            if (mag === MAX_MAG) {
                if (magnitude >= MAX_MAG) {
                    filteredEarthquakes.push(earthquake);
                }
                return;
            }
            const magRange = `${magnitude}`.split('.')[0];
            if (magRange.includes(`${mag}`)) {
                filteredEarthquakes.push(earthquake);
            }
        });
    });
    return filteredEarthquakes;
};

const getLocationName = (
    region: PageType.Region,
    provinces: PageType.Province[],
    districts: PageType.District[],
    municipalities: PageType.Municipality[],
) => {
    let locationName = 'Nepal';
    if (region.adminLevel === 1) {
        const province = provinces.find(d => d.id === region.geoarea);
        if (province) {
            locationName = province.title;
        }
    } else if (region.adminLevel === 2) {
        const district = districts.find(d => d.id === region.geoarea);
        if (district) {
            locationName = district.title;
        }
    } else if (region.adminLevel === 3) {
        const municipality = municipalities.find(d => d.id === region.geoarea);
        if (municipality) {
            locationName = municipality.title;
        }
    }
    return locationName;
};

const getYYYYMMDD = (date: Date) => {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
};

const getDates = (eqFilters: DAEarthquakeFiltersElement) => {
    const { dataDateRange } = eqFilters;
    const { rangeInDays } = dataDateRange;
    let startDate;
    let endDate;
    if (rangeInDays !== 'custom') {
        const { startDate: sDate, endDate: eDate } = pastDaysToDateRange(rangeInDays);
        startDate = getYYYYMMDD(sDate);
        endDate = getYYYYMMDD(eDate);
    } else {
        ({ startDate, endDate } = dataDateRange);
    }
    return [startDate, endDate];
};

const Earthquake = (props: Props) => {
    const [sortKey, setSortKey] = useState('eventOn');
    const [activeView, setActiveView] = useState<ActiveView>('data');
    const { earthquakeList,
        requests,
        eqFilters,
        provinces,
        districts,
        municipalities } = props;
    const pending = isAnyRequestPending(requests);
    const filteredEarthquakes = filterByMagnitudeRange(eqFilters.magnitude, earthquakeList);

    const {
        setData,
    } = useContext(DataArchiveContext);

    const { setDataArchive } = useContext(TitleContext);
    const { region } = eqFilters;
    const handleDataButtonClick = () => {
        setActiveView('data');
    };
    const handleVisualizationsButtonClick = () => {
        setActiveView('visualizations');
    };
    const handleChartsButtonClick = () => {
        setActiveView('charts');
    };

    useEffect(() => {
        if (setData) {
            const filtered = filterByMagnitudeRange(eqFilters.magnitude, earthquakeList);
            setData(filtered);
        }
    }, [earthquakeList, eqFilters.magnitude, setData]);

    const location = getLocationName(region, provinces, districts, municipalities);
    const [startDate, endDate] = getDates(eqFilters);

    if (setDataArchive) {
        setDataArchive((prevState: DataArchive) => {
            if (prevState.mainModule !== 'Earthquake'
            || prevState.location !== location
            || prevState.startDate !== startDate
            || prevState.endDate !== endDate) {
                return { ...prevState, mainModule: 'Earthquake', location, startDate, endDate };
            }
            return prevState;
        });
    }

    if (filteredEarthquakes.length < 1) {
        const message = pending ? '' : 'No data available for the applied filter';
        return (
            <div
                className={styles.message}
            >
                <Loading pending={pending} />
                <Message>
                    {message}
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

    const groupedEarthquakeList = groupList(
        filteredEarthquakes.filter(e => e.address),
        earthquake => earthquake.address,
    ).sort(compare);

    return (
        <div className={styles.earthquake}>
            <Loading pending={pending || filteredEarthquakes.length < 1} />
            <TopBar
                eqFilters={eqFilters}
                earthquakeList={filteredEarthquakes}
            />
            <div className={styles.header}>
                <Header
                    dataCount={filteredEarthquakes.length || 0}
                    activeView={activeView}
                    handleDataButtonClick={handleDataButtonClick}
                    handleVisualizationsButtonClick={handleVisualizationsButtonClick}
                    handleChartsButtonClick={handleChartsButtonClick}
                />
            </div>
            {/* <SegmentInput
                options={sortOptions}
                value={sortKey}
                onChange={setSortKey}
            /> */}
            {/* { activeView === 'data' && filteredEarthquakes.sort(compare)
                .map((datum: PageType.DataArchiveEarthquake) => (
                    <EarthquakeItem
                        key={datum.id}
                        data={datum}
                    />
                )) } */}
            { activeView === 'data' && groupedEarthquakeList.map((group) => {
                const { key, value } = group;
                if (value.length > 1) {
                    return (
                        <EarthquakeGroup
                            address={key}
                            data={value}
                            key={key}
                        />
                    );
                }
                return <EarthquakeItem key={key} data={value[0]} />;
            })}
            {activeView === 'visualizations' && (
                <EarthquakeViz
                    earthquakeList={filteredEarthquakes}
                    eqFilters={eqFilters}
                />
            )}
            {activeView === 'charts' && (
                <ScatterChartViz
                    earthquakeList={filteredEarthquakes}
                    downloadId="earthquakeTemporalChart"
                />
            )}
        </div>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(Earthquake);
