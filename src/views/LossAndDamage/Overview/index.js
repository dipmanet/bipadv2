import React from 'react';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { listToMap } from '@togglecorp/fujs';
import { TitleContext } from '#components/TitleContext';

import {
    provincesSelector,
    municipalitiesSelector,
    districtsSelector,
    wardsSelector,
    regionLevelSelector,
    hazardTypesSelector,
    regionsSelector,
} from '#selectors';

import Map from '../Map';
// import LeftPane from './LeftPane';

import {
    metricMap,
    getGroupMethod,
    getGroupedIncidents,
    getAggregatedStats,
    getSanitizedIncidents,
} from '../common';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const mapStateToProps = (state, props) => ({
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    regionLevel: regionLevelSelector(state, props),

    hazardTypes: hazardTypesSelector(state),
    regions: regionsSelector(state),
});

class Overview extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    constructor(props) {
        super(props);
        this.state = {};
    }

    static contextType = TitleContext;

    generateOverallDataset = memoize((incidents, regionLevel) => {
        if (!incidents || incidents.length <= 0) {
            return {
                mapping: [],
                aggregatedStat: {},
            };
        }

        const groupFn = getGroupMethod(regionLevel + 1);
        const regionGroupedIncidents = getGroupedIncidents(incidents, groupFn);
        const aggregatedStat = getAggregatedStats(regionGroupedIncidents.flat());

        const listToMapGroupedItem = groupedIncidents => (
            listToMap(
                groupedIncidents,
                incident => incident.key,
                incident => incident,
            )
        );
        const mapping = listToMapGroupedItem(regionGroupedIncidents);

        return {
            mapping,
            aggregatedStat,
        };
    })

    render() {
        const {
            lossAndDamageList,
            regionLevel,
            provinces,
            districts,
            municipalities,
            wards,

            regions,
            hazardTypes,
        } = this.props;
        const {
            selectedMetricKey = 'count',
        } = this.state;

        const { setDamageAndLoss } = this.context;

        const sanitizedList = getSanitizedIncidents(
            lossAndDamageList,
            regions,
            hazardTypes,
        );

        const {
            mapping,
            aggregatedStat,
        } = this.generateOverallDataset(sanitizedList, regionLevel);

        const selectedMetric = metricMap[selectedMetricKey];
        const maxValue = Math.max(selectedMetric.metricFn(aggregatedStat), 1);

        const geoareas = (
            (regionLevel === 3 && wards)
            || (regionLevel === 2 && municipalities)
            || (regionLevel === 1 && districts)
            || provinces
        );

        if (setDamageAndLoss) {
            setDamageAndLoss(selectedMetric.label);
        }

        return (
            <Map
                geoareas={geoareas}
                mapping={mapping}
                maxValue={maxValue}
                sourceKey="loss-and-damage-overview"

                metric={selectedMetric.metricFn}
                metricName={selectedMetric.label}
                metricKey={selectedMetric.key}
                onMetricChange={(m) => {
                    this.setState({ selectedMetricKey: m });
                }}
            />
        );
    }
}

export default connect(mapStateToProps)(Overview);
