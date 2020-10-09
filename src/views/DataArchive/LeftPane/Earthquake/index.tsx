import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import * as PageType from '#store/atom/page/types';

// import SegmentInput from '#rsci/SegmentInput';
import EarthquakeItem from './EarthquakeItem';
import Message from '#rscv/Message';
import DataArchiveContext from '#components/DataArchiveContext';

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

import { transformDataRangeLocaleToFilter, transformRegion, transformMagnitude } from '#utils/transformations';

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
} from '#selectors';

import styles from './styles.scss';

interface PropsFromDispatch {
    setDataArchiveEarthquakeList: typeof setDataArchiveEarthquakeListAction;
}

interface PropsFromState {
    earthquakeList: PageType.DataArchiveEarthquake[];
    eqFilters: DAEarthquakeFiltersElement;
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    earthquakeList: dataArchiveEarthquakeListSelector(state),
    eqFilters: eqFiltersSelector(state),
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

const Earthquake = (props: Props) => {
    const [sortKey, setSortKey] = useState('magnitude');
    const [activeView, setActiveView] = useState<ActiveView>('data');
    const { earthquakeList, requests, eqFilters } = props;
    const pending = isAnyRequestPending(requests);
    const filteredEarthquakes = filterByMagnitudeRange(eqFilters.magnitude, earthquakeList);

    const {
        setData,
    } = useContext(DataArchiveContext);

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
    return (
        <div className={styles.earthquake}>
            <Loading pending={pending || filteredEarthquakes.length < 1} />
            <div className={styles.header}>
                <Header
                    chosenOption="Earthquake"
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
            { activeView === 'data' && filteredEarthquakes.sort(compare)
                .map((datum: PageType.DataArchiveEarthquake) => (
                    <EarthquakeItem
                        key={datum.id}
                        data={datum}
                    />
                )) }

            {activeView === 'visualizations' && (
                <EarthquakeViz
                    earthquakeList={filteredEarthquakes}
                    eqFilters={eqFilters}
                />
            )}
            {activeView === 'charts' && (
                <div> CHarts Views </div>
            )}
        </div>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(Earthquake);
