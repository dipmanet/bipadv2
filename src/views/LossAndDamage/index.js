import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { listToMap, isDefined } from '@togglecorp/fujs';

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

import Overview from './Overview';
import Timeline from './Timeline';
import Comparative from './Comparative';
import styles from './styles.scss';

const emptyObject = {};
const emptyList = [];

const createMetric = type => (val) => {
    if (!val) {
        return 0;
    }
    return val[type] || 0;
};

const metricOptions = [
    { key: 'count', label: 'No. of incidents' },
    { key: 'estimatedLoss', label: 'Total estimated loss' },
    { key: 'infrastructureDestroyedCount', label: 'Total infrastructure destroyed' },
    { key: 'livestockDestroyedCount', label: 'Total livestock destroyed' },
    { key: 'peopleDeathCount', label: 'Total people death' },
];

const metricMap = listToMap(
    metricOptions,
    item => item.key,
    (item, key) => ({
        ...item,
        metricFn: createMetric(key),
    }),
);


const getProvince = val => val.province;
const getDistrict = val => val.district;
const getMunicipality = val => val.municipality;
const getWard = val => val.ward;

const getGroupMethod = (regionLevel) => {
    if (regionLevel === 1) {
        return getDistrict;
    }
    if (regionLevel === 2) {
        return getMunicipality;
    }
    if (regionLevel === 3) {
        return getWard;
    }
    // if (isNotDefined(regionLevel) || regionLevel === 0) {
    return getProvince;
    // }
};

const PLAYBACK_INTERVAL = 2000;

// FIXME: obsolete use ward directly
// Get all information using ward
const getRegionInfoFromWard = (wardId, regions) => {
    const {
        wards: wardMap,
        municipalities: municipalityMap,
        districts: districtMap,
    } = regions;

    const ward = wardMap[wardId];

    const municipalityId = ward.municipality;
    const municipality = municipalityMap[municipalityId];

    const districtId = municipality.district;
    const district = districtMap[districtId];

    const provinceId = district.province;

    return {
        ward: wardId,
        municipality: municipalityId,
        district: districtId,
        province: provinceId,
    };
};

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

const mapStateToProps = state => ({
    filters: lossAndDamageFilterValuesSelector(state),
    regions: regionsSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    regionLevel: regionLevelSelector(state),
});

// FIXME: save this on redux
const requests = {
    lossAndDamageRequest: {
        url: '/incident/',
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            expand: ['loss.peoples', 'wards'],
            limit: 3000,
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
                        pending: lossAndDamageRequestPending || eventsRequestPending,
                        provinces,
                        regionLevel,
                        regions,
                        wards,
                        eventList,
                    };
                },
            },
            comparative: {
                component: Comparative,
                rendererParams: () => {
                },
            },
        };
    }

    render() {
        return (
            <React.Fragment>
                <FixedTabs
                    className={styles.tabs}
                    tabs={this.tabs}
                    useHash
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
