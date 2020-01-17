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

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import Filters from '#components/Filters';

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
    filtersValuesSelectorIP,
    hazardTypesSelector,
    regionsSelector,
} from '#selectors';
import { hazardTypesList } from '#utils/domain';
import { transformDateRangeFilterParam } from '#utils/transformations';

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
    selectedIncidentId?: number;
    hoveredIncidentId: number | undefined;
}

interface Params {
}

interface OwnProps {
}

interface PropsFromDispatch {
    setIncidentList: typeof setIncidentListActionIP;
    setEventList: typeof setEventListAction;
}
interface PropsFromState {
    incidentList: PageType.Incident[];
    filters: PageType.FiltersWithRegion['faramValues'];
    hazardTypes: Obj<PageType.HazardType>;
    regions: {
        provinces: object;
        districts: object;
        municipalities: object;
        wards: object;
    };
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    hazardTypes: hazardTypesSelector(state),
    incidentList: incidentListSelectorIP(state),
    filters: filtersValuesSelectorIP(state),
    regions: regionsSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setIncidentList: params => dispatch(setIncidentListActionIP(params)),
    setEventList: params => dispatch(setEventListAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidentsRequest: {
        url: '/incident/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            expand: ['loss', 'event', 'wards'],
            ordering: '-incident_on',
        }),
        onSuccess: ({ response, props: { setIncidentList } }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            setIncidentList({ incidentList });
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters: { hazard, dateRange, region, event } },
                prevProps: { filters: {
                    hazard: prevHazard,
                    dateRange: prevDateRange,
                    region: prevRegion,
                    event: prevEvent,
                } },
            }) => (
                hazard !== prevHazard || dateRange !== prevDateRange
                    || region !== prevRegion || event !== prevEvent
            ),
        },
        extras: {
            schemaName: 'incidentResponse',
        },
    },
    eventsRequest: {
        url: '/event/',
        method: methods.GET,
        // We have to transform dateRange to created_on__lt and created_on__gt
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'created_on'),
        }),
        onSuccess: ({ response, props: { setEventList } }) => {
            interface Response { results: PageType.Event[] }
            const { results: eventList = [] } = response as Response;
            setEventList({ eventList });
        },
        onMount: true,
        extras: {
            schemaName: 'eventResponse',
        },
    },
};

const RECENT_DAY = 1;

interface LegendItem {
    label: string;
    style: string;
    color: string;
}

const incidentPointSizeData: LegendItem[] = [
    { label: 'Minor (0)', style: styles.minor, color: '#a3a3a3' },
    { label: 'Major (<10)', style: styles.major, color: '#a3a3a3' },
    { label: 'Severe (<100)', style: styles.severe, color: '#a3a3a3' },
    { label: 'Catastrophic (>100)', style: styles.catastrophic, color: '#a3a3a3' },
];

const labelSelector = (d: LegendItem) => d.label;
const keySelector = (d: LegendItem) => d.label;
const classNameSelector = (d: LegendItem) => d.style;
const colorSelector = (d: LegendItem) => d.color;

class Incidents extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            selectedIncidentId: undefined,
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
                incidentsRequest: { pending: pendingIncidents },
                eventsRequest: { pending: pendingEvents },
            },
            regions,
            hazardTypes,
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
                />
                <Page
                    leftContentClassName={styles.leftPaneContainer}
                    leftContent={(
                        <LeftPane
                            className={styles.leftPane}
                            incidentList={sanitizedIncidentList}
                            recentDay={RECENT_DAY}
                            onIncidentHover={this.handleIncidentHover}
                            hoveredIncidentId={hoveredIncidentId}
                        />
                    )}
                    mainContentClassName={_cs(styles.legendContainer, 'map-legend-container')}
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
                                    data={incidentPointSizeData}
                                    emptyComponent={null}
                                    itemClassName={styles.legendItem}
                                    keySelector={keySelector}
                                    labelSelector={labelSelector}
                                    symbolClassNameSelector={classNameSelector}
                                />
                            </div>
                            <HazardsLegend
                                filteredHazardTypes={filteredHazardTypes}
                                className={styles.hazardLegend}
                                itemClassName={styles.legendItem}
                            />
                        </React.Fragment>
                    )}
                    rightContentClassName={styles.right}
                    rightContent={(
                        <Filters showEvent />
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
