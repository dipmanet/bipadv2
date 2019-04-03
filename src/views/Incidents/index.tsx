import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
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
} from '#actionCreators';
import {
    incidentListSelectorIP,
    filtersValuesSelectorIP,
    hazardTypesSelector,
} from '#selectors';
import { hazardTypesList } from '#utils/domain';
import Page from '#components/Page';

import HazardsLegend from '#components/HazardsLegend';

import { transformDateRangeFilterParam } from '#utils/transformations';

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
}
interface PropsFromState {
    incidentList: PageType.Incident[];
    filters: PageType.FiltersWithRegion['faramValues'];
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
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    incidentsRequest: {
        url: '/incident/',
        method: methods.GET,
        // We have to transform dateRange to incident_on__lt and incident_on__gt
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            expand: ['loss', 'event'],
        }),
        onSuccess: ({ response, props: { setIncidentList } }) => {
            interface Response { results: PageType.Incident[] }
            const { results: incidentList = [] } = response as Response;
            setIncidentList({ incidentList });
        },
        onMount: true,
        onPropsChanged: {
            filters: ({
                props: { filters: { hazard, dateRange, region } },
                prevProps: { filters: {
                    hazard: prevHazard,
                    dateRange: prevDateRange,
                    region: prevRegion,
                } },
            }) => (
                hazard !== prevHazard || dateRange !== prevDateRange || region !== prevRegion
            ),
        },
        extras: {
            schemaName: 'incidentResponse',
        },
    },
};

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
                incidentsRequest: { pending: incidentsPending },
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
                            pending={incidentsPending}
                            onExpandChange={this.handleLeftPaneExpandChange}
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
