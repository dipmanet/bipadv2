import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { _cs, Obj } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import Numeral from '#rscv/Numeral';

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
} from '#selectors';
import { hazardTypesList } from '#utils/domain';
import { transformDateRangeFilterParam } from '#utils/transformations';

import Page from '#components/Page';
import Loading from '#components/Loading';
import HazardsLegend from '#components/HazardsLegend';

import IncidentsFilter from './Filter';
import Map from './Map';
import LeftPane from './LeftPane';

import styles from './styles.scss';


interface State {
    leftPaneExpanded?: boolean;
    rightPaneExpanded?: boolean;
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
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    hazardTypes: hazardTypesSelector(state),
    incidentList: incidentListSelectorIP(state),
    filters: filtersValuesSelectorIP(state),
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
            expand: ['loss', 'event'],
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

// FIXME: should be one day
const RECENT_DAY = 14;

class Incidents extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }
    private getIncidentHazardTypesList = memoize((incidentList) => {
        const { hazardTypes } = this.props;
        return hazardTypesList(incidentList, hazardTypes);
    });

    private handleLeftPaneExpandChange = (leftPaneExpanded: boolean) => {
        this.setState({ leftPaneExpanded });
    }

    private handleRightPaneExpandChange = (rightPaneExpanded: boolean) => {
        this.setState({ rightPaneExpanded });
    }

    public render() {
        const {
            incidentList,
            requests: {
                incidentsRequest: { pending },
            },
        } = this.props;

        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        const filteredHazardTypes = this.getIncidentHazardTypesList(incidentList);
        return (
            <React.Fragment>
                <Map
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                    incidentList={incidentList}
                    recentDay={RECENT_DAY}
                />
                <div className={
                    _cs(
                        rightPaneExpanded && styles.rightPaneExpanded,
                        styles.incidentCount,
                    )
                }
                >
                    <Numeral
                        className={styles.count}
                        value={incidentList.length}
                        precision={0}
                    />
                    <div className={styles.text}>
                        Incidents
                    </div>
                </div>
                <Loading pending={pending} />
                <Page
                    mainContent={
                        <HazardsLegend
                            filteredHazardTypes={filteredHazardTypes}
                            className={styles.hazardLegend}
                            itemClassName={styles.legendItem}
                        />
                    }
                    leftContentClassName={styles.left}
                    leftContent={
                        <LeftPane
                            incidentList={incidentList}
                            pending={pending}
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
