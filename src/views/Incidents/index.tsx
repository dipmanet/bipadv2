import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
    _cs,
    Obj,
    listToMap,
} from '@togglecorp/fujs';
import memoize from 'memoize-one';

import {
    styleProperties,
} from '#constants';

import { currentStyle } from '#rsu/styles';

import Legend from '#rscz/Legend';

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
    filtersValuesSelectorIP,
    hazardTypesSelector,
    regionsSelector,
} from '#selectors';
import { hazardTypesList } from '#utils/domain';
import { transformDateRangeFilterParam } from '#utils/transformations';

import Page from '#components/Page';
import Loading from '#components/Loading';
import TextOutput from '#components/TextOutput';
import DateOutput from '#components/DateOutput';
import GeoOutput from '#components/GeoOutput';
import HazardsLegend from '#components/HazardsLegend';

import IncidentsFilter from './Filter';
import Map from './Map';
import LeftPane from './LeftPane';

import { getSanitizedIncidents } from '../LossAndDamage/common';

import styles from './styles.scss';

const convertValueToNumber = (value = '') => +(value.substring(0, value.length - 2));

interface State {
    leftPaneExpanded?: boolean;
    rightPaneExpanded?: boolean;
    selectedIncidentId?: number;
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
                hazard !== prevHazard || dateRange !== prevDateRange ||
                region !== prevRegion || event !== prevEvent
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
            leftPaneExpanded: true,
            rightPaneExpanded: true,
            selectedIncidentId: undefined,
        };
    }

    public componentDidMount(): void {
        const { rightPaneExpanded } = this.state;

        this.setPlacementForMapControls(rightPaneExpanded);
    }

    public componentWillUnmount(): void {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
        if (mapControls) {
            mapControls.style.right = this.previousMapContorlStyle;
        }
    }

    private getSanitizedIncidents = memoize(getSanitizedIncidents)

    private getIncidentHazardTypesList = memoize((incidentList) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(incidentList, hazardTypes);
    });

    private getIncidentMap = memoize(incidentList =>
        listToMap(
            incidentList,
            (d: PageType.Incident) => d.id,
            d => d,
        ),
    );

    public setPlacementForMapControls = (rightPaneExpanded?: boolean) => {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            const widthRightPanel = rightPaneExpanded
                ? convertValueToNumber(styleProperties.widthRightPanel)
                : 0;
            const spacingMedium = convertValueToNumber(currentStyle.spacingMedium);
            const widthNavbar = convertValueToNumber(styleProperties.widthNavbarRight);

            if (!this.previousMapContorlStyle) {
                this.previousMapContorlStyle = mapControls.style.right;
            }
            mapControls.style.right = `${widthNavbar + widthRightPanel + spacingMedium}px`;
        }
    }

    private handleLeftPaneExpandChange = (leftPaneExpanded: boolean) => {
        this.setState({ leftPaneExpanded });
    }

    private handleRightPaneExpandChange = (rightPaneExpanded: boolean) => {
        this.setState({ rightPaneExpanded });
        this.setPlacementForMapControls(rightPaneExpanded);
    }

    private handleIncidentHover = (selectedIncidentId: number) => {
        this.setState({ selectedIncidentId });
    }

    private renderHoverItemDetail = () => {
        const {
            selectedIncidentId,
            rightPaneExpanded,
        } = this.state;

        const { incidentList, regions, hazardTypes } = this.props;
        const sanitizedIncidentList = this.getSanitizedIncidents(
            incidentList,
            regions,
            hazardTypes,
        );
        const incidentMap = this.getIncidentMap(sanitizedIncidentList);

        if (!selectedIncidentId || !incidentMap[selectedIncidentId]) {
            return null;
        }

        const selectedIncident = incidentMap[selectedIncidentId];

        return (
            <div className={
                _cs(
                    rightPaneExpanded && styles.rightPaneExpanded,
                    styles.hoverDetailBox,
                )
            }
            >
                <h3 title={selectedIncident.title} >
                    {selectedIncident.title}
                </h3>
                <DateOutput
                    value={selectedIncident.incidentOn}
                    alwaysVisible
                />
                <GeoOutput
                    className={styles.geoOutput}
                    geoareaName={selectedIncident.streetAddress}
                    alwaysVisible
                />
                <TextOutput
                    label="Source"
                    value={selectedIncident.source}
                    alwaysVisible
                />
            </div>
        );
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

        const {
            leftPaneExpanded,
            rightPaneExpanded,
            selectedIncidentId,
        } = this.state;

        const sanitizedIncidentList = this.getSanitizedIncidents(
            incidentList,
            regions,
            hazardTypes,
        );

        const filteredHazardTypes = this.getIncidentHazardTypesList(sanitizedIncidentList);

        const pending = pendingEvents || pendingIncidents;
        const HoverItemDetail = this.renderHoverItemDetail;

        return (
            <React.Fragment>
                <Loading pending={pending} />
                <Map
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                    incidentList={sanitizedIncidentList}
                    recentDay={RECENT_DAY}
                    onIncidentHover={this.handleIncidentHover}
                />
                <HoverItemDetail />
                <Page
                    mainContentClassName={_cs(
                        styles.main,
                        leftPaneExpanded && styles.leftPaneExpanded,
                        rightPaneExpanded && styles.rightPaneExpanded,
                    )}
                    mainContent={
                        <React.Fragment>
                            <HazardsLegend
                                filteredHazardTypes={filteredHazardTypes}
                                className={styles.hazardLegend}
                                itemClassName={styles.legendItem}
                            />
                            <div className={styles.pointSizeLegendContainer}>
                                <header className={styles.header}>
                                    <h4 className={styles.heading}>
                                        Incident circle size (people death count)
                                    </h4>
                                </header>
                                <Legend
                                    className={styles.pointSizeLegend}
                                    data={incidentPointSizeData}
                                    keySelector={keySelector}
                                    labelSelector={labelSelector}
                                    colorSelector={colorSelector}
                                    itemClassName={styles.legendSymbol}
                                    symbolClassNameSelector={classNameSelector}
                                    emptyComponent={null}
                                />
                            </div>
                        </React.Fragment>
                    }
                    leftContentClassName={styles.left}
                    leftContent={
                        <LeftPane
                            incidentList={sanitizedIncidentList}
                            onExpandChange={this.handleLeftPaneExpandChange}
                            recentDay={RECENT_DAY}
                        />
                    }
                    rightContentClassName={styles.right}
                    rightContent={
                        <IncidentsFilter
                            onExpandChange={this.handleRightPaneExpandChange}
                        />
                    }
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
