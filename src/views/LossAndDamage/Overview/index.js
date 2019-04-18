import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'memoize-one';
import {
    listToMap,
} from '@togglecorp/fujs';

import Page from '#components/Page';

import Map from '../Map';
import LeftPane from './LeftPane';
import Filter from '../Filter';

import {
    metricMap,
    metricType,
    metricOptions,
    getGroupMethod,
    getSanitizedIncidents,
    getGroupedIncidents,
    getAggregatedStats,
} from '../common';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

export default class Overview extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }

    generateOverallDataset = memoize((incidents, regions, regionLevel) => {
        if (!incidents || incidents.length <= 0) {
            return {
                mapping: [],
                sanitizedIncidents: [],
            };
        }

        const sanitizedIncidents = getSanitizedIncidents(incidents, regions);

        const groupFn = getGroupMethod(regionLevel);
        const regionGroupedIncidents = getGroupedIncidents(sanitizedIncidents, groupFn);
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
            sanitizedIncidents,
            aggregatedStat,
        };
    })

    handleLeftPaneExpandChange = (leftPaneExpanded) => {
        this.setState({ leftPaneExpanded });
    }

    handleRightPaneExpandChange = (rightPaneExpanded) => {
        this.setState({ rightPaneExpanded });
    }

    render() {
        const {
            className,
            districts,
            lossAndDamageList,
            metric,
            municipalities,
            pending,
            provinces,
            regionLevel,
            regions,
            wards,
        } = this.props;

        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        const {
            mapping,
            aggregatedStat,
        } = this.generateOverallDataset(lossAndDamageList, regions, regionLevel);

        const selectedMetric = metricMap[metric];
        const maxValue = Math.max(selectedMetric.metricFn(aggregatedStat), 1);

        const geoareas = (
            (regionLevel === 3 && wards)
            || (regionLevel === 2 && municipalities)
            || (regionLevel === 1 && districts)
            || provinces
        );

        return (
            <React.Fragment>
                <Map
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                    mapping={mapping}
                    maxValue={maxValue}
                    metric={selectedMetric.metricFn}
                    metricName={selectedMetric.label}
                    geoareas={geoareas}
                />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={
                        <LeftPane
                            pending={pending}
                            lossAndDamageList={lossAndDamageList}
                            onExpandChange={this.handleLeftPaneExpandChange}
                        />
                    }
                    rightContent={
                        <Filter
                            onExpandChange={this.handleRightPaneExpandChange}
                            metricOptions={metricOptions}
                            metricType={metricType}
                        />
                    }
                />
            </React.Fragment>
        );
    }
}

