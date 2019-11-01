import React from 'react';
import memoize from 'memoize-one';
import { listToMap } from '@togglecorp/fujs';

import Page from '#components/Page';

import Map from '../Map';
import LeftPane from './LeftPane';
import Filters from '#components/Filters';

import {
    metricMap,
    getGroupMethod,
    getGroupedIncidents,
    getAggregatedStats,
} from '../common';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const convertValueToNumber = (value = '') => +(value.substring(0, value.length - 2));

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

    componentWillUnmount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
        if (mapControls) {
            mapControls.style.right = this.previousMapContorlStyle;
        }
    }

    generateOverallDataset = memoize((incidents, regions, regionLevel) => {
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

    handleLeftPaneExpandChange = (leftPaneExpanded) => {
        this.setState({ leftPaneExpanded });
    }

    handleRightPaneExpandChange = (rightPaneExpanded) => {
        this.setState({ rightPaneExpanded });

        const { onRightPaneExpandChange } = this.props;
        if (onRightPaneExpandChange) {
            onRightPaneExpandChange(rightPaneExpanded);
        }
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
            minDate,
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
                    geoareas={geoareas}
                    leftPaneExpanded={leftPaneExpanded}
                    mapping={mapping}
                    maxValue={maxValue}
                    metric={selectedMetric.metricFn}
                    metricName={selectedMetric.label}
                    rightPaneExpanded={rightPaneExpanded}
                />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={(
                        <LeftPane
                            lossAndDamageList={lossAndDamageList}
                            onExpandChange={this.handleLeftPaneExpandChange}
                            pending={pending}
                            rightPaneExpanded={rightPaneExpanded}
                            minDate={minDate}
                        />
                    )}
                    rightContentClassName={styles.right}
                    rightContent={(
                        <Filters
                            className={styles.filters}
                            showDateRange
                            showMetricSelect
                        />
                    )}
                />
            </React.Fragment>
        );
    }
}
