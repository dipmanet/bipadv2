import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'memoize-one';

import {
    listToMap,
    isDefined,
} from '@togglecorp/fujs';

import {
    getYmd,
} from '#utils/common';

import Map from '../Map';
import Seekbar from './Seekbar';
import {
    getMinMaxTime,
    getGroupMethod,
    getAggregatedStats,
    getSanitizedIncidents,
    metricName,
    metricMap,
    metricType,
    metricOptions,
    getGroupedIncidents,
} from '../common';

const propTypes = {
};

const defaultProps = {
};

const emptyList = [];
const emptyObject = {};
const PLAYBACK_INTERVAL = 2000;

export default class Timeline extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
            pauseMap: false,
            start: undefined,
            end: undefined,
            currentIndex: -1,
            playbackStart: 0,
            playbackEnd: 0,
            currentRange: {
                start: 0,
                end: 0,
            },
        };
    }

    componentDidMount() {
        const {
            lossAndDamageList,
            regions,
            regionLevel,
        } = this.props;

        this.playback(lossAndDamageList, regions, regionLevel);
    }

    componentWillReceiveProps(nextProps) {
        const {
            lossAndDamageList: oldLossAndDamageList,
            regions: oldRegions,
            regionLevel: oldRegionLevel,
        } = this.props;

        const {
            lossAndDamageList: newLossAndDamageList,
            regions: newRegions,
            regionLevel: newRegionLevel,
        } = nextProps;

        if (
            oldLossAndDamageList !== newLossAndDamageList
            || oldRegions !== newRegions
            || oldRegionLevel !== newRegionLevel
        ) {
            const {
                minTime,
                maxTime,
            } = getMinMaxTime(newLossAndDamageList, newRegions);

            this.setState({
                start: getYmd(minTime),
                end: getYmd(maxTime),
                currentIndex: -1,
            });

            this.playback(newLossAndDamageList, newRegions, newRegionLevel);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    generateDataset = memoize((incidents, startTime, endTime, regions, regionLevel) => {
        if (!incidents || incidents.length <= 0) {
            return {
                mapping: [],
                maxCount: 0,
                minTime: 0,
                maxTime: 0,
                onSpan: 0,
                totalIteration: 0,
                sanitizedIncidents: [],
                otherMapping: [],
            };
        }

        const sanitizedIncidents = getSanitizedIncidents(incidents, regions).filter(
            ({ incidentOn }) => (
                !(isDefined(startTime) && incidentOn < new Date(startTime).getTime())
                && !(isDefined(endTime) && incidentOn > new Date(endTime).getTime())
            ),
        );

        const bucketedIncidents = [];
        const { minTime, maxTime } = getMinMaxTime(sanitizedIncidents, regions);
        const daySpan = 1000 * 60 * 60 * 24;
        const oneSpan = 7 * daySpan;
        const totalSpan = maxTime - minTime;
        const totalIteration = Math.ceil(totalSpan / oneSpan);
        for (let i = 0; i < totalIteration; i += 1) {
            const start = minTime + (i * oneSpan);
            const end = minTime + ((i + 1) * oneSpan);

            const filteredIncidents = sanitizedIncidents.filter(({ incidentOn }) => (
                incidentOn >= start && incidentOn < end
            ));
            bucketedIncidents.push(filteredIncidents);
        }

        const groupFn = getGroupMethod(regionLevel);
        const regionGroupedIncidents = bucketedIncidents.map(
            incident => getGroupedIncidents(incident, groupFn),
        );

        const listToMapGroupedItem = groupedIncidents => (
            listToMap(
                groupedIncidents,
                incident => incident.key,
                incident => incident,
            )
        );
        const mapping = regionGroupedIncidents.map(listToMapGroupedItem);

        const aggregatedStat = getAggregatedStats(regionGroupedIncidents.flat());

        const val = {
            mapping,
            otherMapping: bucketedIncidents,
            aggregatedStat,
            minTime,
            maxTime,
            oneSpan,
            totalIteration,
            sanitizedIncidents,
        };
        return val;
    });

    playback = (lossAndDamageList, regions, regionLevel) => {
        const { pauseMap: isPaused } = this.state;
        clearTimeout(this.timeout);

        const {
            start,
            end,
        } = this.state;
        const {
            totalIteration,
            sanitizedIncidents,
            minTime,
            maxTime,
            oneSpan,
        } = this.generateDataset(lossAndDamageList, start, end, regions, regionLevel);

        if (!isPaused && sanitizedIncidents.length > 0) {
            const { currentIndex } = this.state;

            const newIndex = currentIndex + 1 < totalIteration
                ? currentIndex + 1
                : 0;

            const current = {
                start: minTime + (newIndex * oneSpan),
                end: Math.min(minTime + ((newIndex + 1) * oneSpan), maxTime),
            };

            const range = maxTime - minTime;

            this.setState({
                currentIndex: newIndex,
                currentRange: current,
                playbackStart: (100 * (current.start - minTime)) / range,
                playbackEnd: (100 * (current.end - minTime)) / range,
            });
        }

        this.timeout = setTimeout(
            () => this.playback(lossAndDamageList, regions, regionLevel),
            PLAYBACK_INTERVAL,
        );
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
            start,
            end,
            leftPaneExpanded,
            rightPaneExpanded,
            currentIndex,
        } = this.state;

        const {
            mapping,
            aggregatedStat,
        } = this.generateDataset(lossAndDamageList, start, end, regions, regionLevel);

        const selectedMetric = metricMap[metric];
        const maxValue = Math.max(selectedMetric.metricFn(aggregatedStat), 1);

        const geoareas = (
            (regionLevel === 3 && wards)
            || (regionLevel === 2 && municipalities)
            || (regionLevel === 1 && districts)
            || provinces
        );

        return (
            <Map
                leftPaneExpanded={leftPaneExpanded}
                rightPaneExpanded={rightPaneExpanded}
                mapping={mapping[currentIndex]}
                maxValue={maxValue}
                metric={selectedMetric.metricFn}
                metricName={selectedMetric.label}
                geoareas={geoareas}
            />
        );
    }
}
