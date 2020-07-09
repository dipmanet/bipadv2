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
import LeftPane from './LeftPane';

import { getSanitizedIncidents } from '../LossAndDamage/common';

import styles from './styles.scss';

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
    ...transformRegionToFilter(region),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidentsGetRequest: {
        url: '/incident/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: ({ props: { filters } }) => ({
            ...transformFilters(filters),
            expand: ['loss', 'event', 'wards'],
            ordering: '-incident_on',
            limit: -1,
        }),
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

const incidentPointSizeData: LegendItem[] = [
    { label: 'Minor (0)', style: styles.symbol, color: '#a3a3a3', radius: 8 },
    { label: 'Major (<10)', style: styles.symbol, color: '#a3a3a3', radius: 11 },
    { label: 'Severe (<100)', style: styles.symbol, color: '#a3a3a3', radius: 15 },
    { label: 'Catastrophic (>100)', style: styles.symbol, color: '#a3a3a3', radius: 20 },
];

const labelSelector = (d: LegendItem) => d.label;
const keySelector = (d: LegendItem) => d.label;
const classNameSelector = (d: LegendItem) => d.style;
const colorSelector = (d: LegendItem) => d.color;
const radiusSelector = (d: LegendItem) => d.radius;

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

        const mapHoverAttributes = this.getMapHoverAttributes(hoveredIncidentId);

        const filteredHazardTypes = this.getIncidentHazardTypesList(sanitizedIncidentList);

        const pending = pendingEvents || pendingIncidents;

        return (
            <React.Fragment>
                <Loading pending={pending} />
                <Map
                    incidentList={sanitizedIncidentList}
                    recentDay={RECENT_DAY}
                    onIncidentHover={this.handleIncidentHover}
                    mapHoverAttributes={mapHoverAttributes}
                    isHovered={!!hoveredIncidentId}
                />
                <Page
                    leftContentContainerClassName={styles.leftPaneContainer}
                    leftContent={(
                        <LeftPane
                            className={styles.leftPane}
                            incidentList={sanitizedIncidentList}
                            recentDay={RECENT_DAY}
                            onIncidentHover={this.handleIncidentHover}
                            hoveredIncidentId={hoveredIncidentId}
                            dateRange={filters.dataDateRange}
                        />
                    )}
                    mainContentContainerClassName={_cs(styles.legendContainer, 'map-legend-container')}
                    mainContent={(
                        <React.Fragment>
                            <div className={styles.pointSizeLegendContainer}>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        People death count
                                    </h4>
                                </header>
                                <Legend
                                    className={styles.pointSizeLegend}
                                    colorSelector={colorSelector}
                                    radiusSelector={radiusSelector}
                                    data={incidentPointSizeData}
                                    emptyComponent={null}
                                    itemClassName={styles.legendItem}
                                    keySelector={keySelector}
                                    labelSelector={labelSelector}
                                    symbolClassNameSelector={classNameSelector}
                                />
                            </div>
                            {filteredHazardTypes.length > 0 && (
                                <div className={styles.hazardLegend}>
                                    <div className={styles.legendTitle}>Hazards Legend</div>
                                    <HazardsLegend
                                        filteredHazardTypes={filteredHazardTypes}
                                        className={styles.legend}
                                        itemClassName={styles.legendItem}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    )}
                />
            </React.Fragment>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(Incidents);
