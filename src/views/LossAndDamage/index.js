import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';
import FixedTabs from '#rscv/FixedTabs';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    lossAndDamageFilterValuesSelector,
    regionsSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    regionLevelSelector,
} from '#selectors';

import { transformDateRangeFilterParam } from '#utils/transformations';
import Loading from '#components/Loading';

import Overview from './Overview';
import Timeline from './Timeline';
import Comparative from './Comparative';
import styles from './styles.scss';

const emptyObject = {};
const emptyList = [];

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    provinces: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    districts: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    municipalities: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    wards: PropTypes.array.isRequired,
    regionLevel: PropTypes.number,
};

const defaultProps = {
    regionLevel: undefined,
};

const mapStateToProps = (state, props) => ({
    filters: lossAndDamageFilterValuesSelector(state),
    regions: regionsSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    regionLevel: regionLevelSelector(state, props),
});

// FIXME: save this on redux
const requests = {
    lossAndDamageRequest: {
        url: '/incident/',
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            expand: ['loss.peoples', 'wards'],
            limit: 5000,
            ordering: '-incident_on',
            lnd: true,
        }),
        onPropsChanged: {
            filters: ({
                props: { filters: { hazard, region } },
                prevProps: { filters: {
                    hazard: prevHazard,
                    region: prevRegion,
                } },
            }) => (
                hazard !== prevHazard || region !== prevRegion
            ),
        },
        onMount: true,
        extras: {
            schemaName: 'incidentWithPeopleResponse',
        },
    },
    eventsRequest: {
        url: '/event/',
        onMount: true,
    },
};

class LossAndDamage extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            isOverviewRightPaneExpanded: true,
            isTimelineRightPaneExpanded: true,
        };

        this.tabs = {
            overview: 'Overview',
            timeline: 'Timeline',
            comparative: 'Comparative',
        };

        this.views = {
            overview: {
                component: Overview,
                rendererParams: () => {
                    const {
                        requests: {
                            lossAndDamageRequest: {
                                pending,
                                response: {
                                    results: lossAndDamageList = emptyList,
                                } = emptyObject,
                            },
                        },
                        regions,
                        districts,
                        provinces,
                        wards,
                        municipalities,
                        regionLevel,
                        filters: {
                            metric,
                        },
                    } = this.props;

                    return {
                        districts,
                        lossAndDamageList,
                        metric,
                        municipalities,
                        pending,
                        provinces,
                        regionLevel,
                        regions,
                        wards,
                        onRightPaneExpandChange: this.handleOverviewRightPaneExpandChange,
                    };
                },
            },
            timeline: {
                component: Timeline,
                rendererParams: () => {
                    const {
                        requests: {
                            lossAndDamageRequest: {
                                pending: lossAndDamageRequestPending,
                                response: {
                                    results: lossAndDamageList = emptyList,
                                } = emptyObject,
                            },
                            eventsRequest: {
                                pending: eventsRequestPending,
                                response: {
                                    results: eventList = emptyList,
                                } = emptyObject,
                            },
                        },
                        districts,
                        provinces,
                        wards,
                        municipalities,
                        regions,
                        regionLevel,
                        filters: {
                            metric,
                        },
                    } = this.props;

                    return {
                        districts,
                        lossAndDamageList,
                        metric,
                        municipalities,
                        pending: lossAndDamageRequestPending || eventsRequestPending,
                        provinces,
                        regionLevel,
                        regions,
                        wards,
                        eventList,
                        onRightPaneExpandChange: this.handleTimelineRightPaneExpandChange,
                    };
                },
            },
            comparative: {
                component: Comparative,
                rendererParams: () => {
                    const {
                        requests: {
                            lossAndDamageRequest: {
                                pending,
                                response: {
                                    results: lossAndDamageList = emptyList,
                                } = emptyObject,
                            },
                        },
                        regions,
                        regionLevel,
                    } = this.props;

                    return {
                        pending,
                        lossAndDamageList,
                        regions,
                        regionLevel,
                    };
                },
            },
        };
    }

    handleOverviewRightPaneExpandChange = (isExpanded) => {
        this.setState({
            isOverviewRightPaneExpanded: isExpanded,
        });
    }

    handleTimelineRightPaneExpandChange = (isExpanded) => {
        this.setState({ isTimelineRightPaneExpanded: isExpanded });
    }

    handleHashChange = () => {
        this.setState({
            isOverviewRightPaneExpanded: true,
            isTimelineRightPaneExpanded: true,
        });
    }

    render() {
        const {
            requests: {
                eventsRequest: { pending: eventsPending },
                lossAndDamageRequest: { pending: lossAndDamagePending },
            },
        } = this.props;

        const pending = eventsPending || lossAndDamagePending;
        const currentPage = window.location.hash.substring(2);
        let rightPaneExpanded = false;

        const {
            isOverviewRightPaneExpanded,
            isTimelineRightPaneExpanded,
        } = this.state;

        if (currentPage === 'overview') {
            rightPaneExpanded = isOverviewRightPaneExpanded;
        } else if (currentPage === 'timeline') {
            rightPaneExpanded = isTimelineRightPaneExpanded;
        }

        return (
            <React.Fragment>
                <Loading pending={pending} />
                <FixedTabs
                    className={_cs(
                        styles.tabs,
                        rightPaneExpanded && styles.rightPaneExpanded,
                        currentPage === 'comparative' && styles.comparative,
                    )}
                    tabs={this.tabs}
                    useHash
                    onHashChange={this.handleHashChange}
                />
                <MultiViewContainer
                    views={this.views}
                    useHash
                />
            </React.Fragment>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(LossAndDamage);
