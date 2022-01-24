import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    _cs,
    Obj,
    listToMap,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Legend from '#rscz/Legend';

import { FiltersElement } from '#types';
import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    setIncidentListActionIP,
    setEventListAction,
} from '#actionCreators';
import {
    incidentListSelectorIP,
    filtersSelector,
    hazardTypesSelector,
    regionsSelector,
} from '#selectors';
import { hazardTypesList } from '#utils/domain';
import {
    transformDataRangeToFilter,
    transformRegionToFilter,
    transformDataRangeLocaleToFilter,
} from '#utils/transformations';

import Page from '#components/Page';
import Loading from '#components/Loading';
import HazardsLegend from '#components/HazardsLegend';

import Map from './Map';

import { getSanitizedIncidents } from '#views/LossAndDamage/common';

const emptyHoverAttributeList: {
    id: number;
    value: boolean;
}[] = [];

interface State {
    hoveredIncidentId: number | undefined;
}

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
    // ...transformRegionToFilter(region),
});
const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(yesterday.getDate() - 1);

const DEFAULT_START_DATE = yesterday;
const DEFAULT_END_DATE = today;


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: ({ props: { filters } }) => ({
            ...transformFilters(filters),
            expand: ['loss', 'event', 'wards'],
            ordering: '-incident_on',
            // eslint-disable-next-line @typescript-eslint/camelcase
            incident_on__gt: `${DEFAULT_START_DATE.toISOString().split('T')[0]}T00:00:00+05:45`,
            // eslint-disable-next-line @typescript-eslint/camelcase
            incident_on__lt: `${DEFAULT_END_DATE.toISOString().split('T')[0]}T23:59:59+05:45`,
            limit: -1,
        }),
        onSuccess: ({ response, props: { setIncidentList } }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            setIncidentList({ incidentList });
        },
        onMount: true,
        // extras: { schemaName: 'incidentResponse' },
    },
    eventsRequest: {
        url: '/event/',
        method: methods.GET,
        query: ({ props: { filters } }) => ({
            ...transformFilters(filters),
        }),
        onSuccess: ({ response, props: { setEventList } }) => {
            interface Response { results: PageType.Event[] }
            const { results: eventList = [] } = response as Response;
            setEventList({ eventList });
        },
        onMount: true,
        extras: { schemaName: 'eventResponse' },
    },
};

const RECENT_DAY = 1;

interface LegendItem {
    label: string;
    style: string;
    color: string;
    radius?: number;
}


class Incidents extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            hoveredIncidentId: undefined,
        };
    }

    private getSanitizedIncidents = memoize(getSanitizedIncidents)

    private getIncidentHazardTypesList = memoize((incidentList) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(incidentList, hazardTypes);
    });

    private getIncidentMap = memoize(
        incidentList => listToMap(
            incidentList,
            (d: PageType.Incident) => d.id,
            d => d,
        ),
    );

    private handleIncidentHover = (hoveredIncidentId: number) => {
        this.setState({ hoveredIncidentId });
    }

    private getMapHoverAttributes = (hoveredIncidentId: number | undefined) => {
        if (!hoveredIncidentId) {
            return emptyHoverAttributeList;
        }

        return [{
            id: hoveredIncidentId,
            value: true,
        }];
    }

    public render() {
        const {
            incidentList,
            requests: {
                incidentsGetRequest: { pending: pendingIncidents },
                eventsRequest: { pending: pendingEvents },
            },
            regions,
            hazardTypes,
            filters,
        } = this.props;

        const { hoveredIncidentId } = this.state;

        const sanitizedIncidentList = this.getSanitizedIncidents(
            incidentList,
            regions,
            hazardTypes,
        );
        console.log('sanitizedIncidentList', sanitizedIncidentList);
        const mapHoverAttributes = this.getMapHoverAttributes(hoveredIncidentId);

        const filteredHazardTypes = this.getIncidentHazardTypesList(sanitizedIncidentList);

        const pending = pendingEvents || pendingIncidents;

        return (
            <div>
                <Loading pending={pending} />
                <Map
                    incidentList={sanitizedIncidentList}
                    recentDay={RECENT_DAY}
                    onIncidentHover={this.handleIncidentHover}
                    mapHoverAttributes={mapHoverAttributes}
                    isHovered={!!hoveredIncidentId}
                />
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(
    createConnectedRequestCoordinator<ReduxProps>()(
        createRequestClient(requests)(
            Incidents,
        ),
    ),
);
