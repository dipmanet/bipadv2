import React from 'react';
import memoize from 'memoize-one';
import { listToMap } from '@togglecorp/fujs';
import { styleProperties } from '#constants';
import { currentStyle } from '#rsu/styles';

import Page from '#components/Page';
import { lossMetrics } from '#utils/domain';

import Map from '../Map';
import LeftPane from './LeftPane';
import Filter from '../Filter';

import {
    metricMap,
    metricType,
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

    componentDidMount() {
        const { rightPaneExpanded } = this.state;

        this.setPlacementForMapControls(rightPaneExpanded);
    }

    componentWillUnmount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
        if (mapControls) {
            mapControls.style.right = this.previousMapContorlStyle;
        }
    }

    setPlacementForMapControls = (rightPaneExpanded) => {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            const widthRightPanel = rightPaneExpanded
                ? convertValueToNumber(styleProperties.widthRightPanel)
                : 0;
            const spacingMedium = convertValueToNumber(currentStyle.dimens.spacingMedium);
            const widthNavbar = convertValueToNumber(styleProperties.widthNavbarRight);

            if (!this.previousMapContorlStyle) {
                this.previousMapContorlStyle = mapControls.style.right;
            }
            mapControls.style.right = `${widthNavbar + widthRightPanel + spacingMedium}px`;
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
        this.setPlacementForMapControls(rightPaneExpanded);

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
                            rightPaneExpanded={rightPaneExpanded}
                        />
                    }
                    rightContent={
                        <Filter
                            onExpandChange={this.handleRightPaneExpandChange}
                            metricOptions={lossMetrics}
                            metricType={metricType}
                        />
                    }
                />
            </React.Fragment>
        );
    }
}

