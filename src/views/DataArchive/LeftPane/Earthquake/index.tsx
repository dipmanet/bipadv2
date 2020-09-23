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

import { transformDataRangeLocaleToFilter, transformRegion } from '#utils/transformations';

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

/* const sortOptions = [
    { key: 'magnitude', label: 'Magnitude' },
    { key: 'eventOn', label: 'Event On' },
    { key: 'address', label: 'Epicenter' },
]; */

const requestOptions: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimeEarthquakeRequest: {
        url: '/earthquake/',
        method: methods.GET,
        query: ({ props: { globalFilters } }) => ({
            ...transformDataRangeLocaleToFilter(globalFilters.dataDateRange, 'event__on'),
            ...transformRegion(globalFilters.region),
            expand: ['province', 'district', 'municipality'],
        }),
        onSuccess: ({ response, props: { setDataArchiveEarthquakeList } }) => {
            interface Response { results: PageType.DataArchiveEarthquake[] }
            const { results: dataArchiveEarthquakeList = [] } = response as Response;
            setDataArchiveEarthquakeList({ dataArchiveEarthquakeList });
        },
        onPropsChanged: {
            globalFilters: true,
        },
        onMount: true,
        extras: {
            schemaName: 'earthquakeResponse',
        },
    },
};

const Earthquake = (props: Props) => {
    const [sortKey, setSortKey] = useState('magnitude');
    const { earthquakeList, requests } = props;
    const pending = isAnyRequestPending(requests);

    const {
        setData,
    } = useContext(DataArchiveContext);

    useEffect(() => {
        if (setData) {
            setData(earthquakeList);
        }
    }, [earthquakeList, setData]);

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
            <Loading pending={pending} />
            {/* <SegmentInput
                options={sortOptions}
                value={sortKey}
                onChange={setSortKey}
            /> */}
            { earthquakeList.sort(compare)
                .map((datum: PageType.DataArchiveEarthquake) => (
                    <EarthquakeItem
                        key={datum.id}
                        data={datum}
                    />
                )) }
        </div>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requestOptions),
)(Earthquake);
