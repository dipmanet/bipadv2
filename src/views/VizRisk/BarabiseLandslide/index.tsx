import React, { useEffect, useState } from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    _cs,
    Obj,
    listToMap,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';
import Map from './Map';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { getSanitizedIncidents } from '#views/LossAndDamage/common';

import { hazardTypesSelector,
    incidentListSelectorIP,
    filtersSelector,
    regionsSelector } from '#selectors';

import {
    transformDataRangeToFilter,
    transformRegionToFilter,
    transformDataRangeLocaleToFilter,
} from '#utils/transformations';

import { FiltersElement } from '#types';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';


import {
    setIncidentListActionIP,
    setEventListAction,
} from '#actionCreators';
import NavButtons from './Components/NavButtons';

interface Params {
}

interface ComponentProps {
}

interface PropsFromDispatch {
    setIncidentList: typeof setIncidentListActionIP;
    setEventList: typeof setEventListAction;
}
interface PropsFromAppState {
    incidentList: PageType.Incident[];
    filters: FiltersElement;
    hazardTypes: Obj<PageType.HazardType>;
    regions: {
        provinces: object;
        districts: object;
        municipalities: object;
        wards: object;
    };
}

type ReduxProps = ComponentProps & PropsFromDispatch & PropsFromAppState;

type Props = NewProps<ReduxProps, Params>;
const mapStateToProps = (state: AppState): PropsFromAppState => ({
    incidentList: incidentListSelectorIP(state),
    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
    filters: filtersSelector(state),
    hazards: hazardTypesSelector(state),

});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
});

const transformFilters = ({
    dataDateRange,
    region,
    ...otherFilters
}: FiltersElement) => ({
    ...otherFilters,
    // ...transformDataRangeToFilter(dataDateRange, 'incident_on'),
    ...transformDataRangeLocaleToFilter(dataDateRange, 'incident_on'),
    ...transformRegionToFilter(region),
});
const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: () => {
            const filters = {
                region: {},
                hazard: [17],
                dataDateRange: {
                    rangeInDays: 'custom',
                    startDate: '2011-01-01',
                    endDate: '2021-01-01',
                },
            };
            return ({
                ...transformFilters(filters),
                expand: ['loss', 'event', 'wards'],
                ordering: '-incident_on',
                limit: -1,
            });
        },
        onSuccess: ({ response, props: { setIncidentList } }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            setIncidentList({ incidentList });
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters },
                prevProps: { filters: prevFilters },
            }) => {
                const shouldRequest = filters !== prevFilters;

                return shouldRequest;
            },
        },
        // extras: { schemaName: 'incidentResponse' },
    },
};

const BarabiseLandslide = (props) => {
    const [landSlidePoints, setlandSlidePoints] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const {
        incidentList,
        hazardTypes,
        regions,
    } = props;
    const getSanitizedIncident = memoize(getSanitizedIncidents);
    const sanitizedIncidentList = getSanitizedIncident(
        incidentList,
        regions,
        hazardTypes,
    );

    const setPage = (val: number) => {
        setCurrentPage(val);
    };

    return (
        <>
            <Map
                incidentList={sanitizedIncidentList}
                hazardTypes={hazardTypes}
                page={currentPage}
            />
            <NavButtons
                getPage={setPage}
                maxPage={2}
            />
        </>
    );
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(BarabiseLandslide);
