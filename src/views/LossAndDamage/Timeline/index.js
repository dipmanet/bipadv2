import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'memoize-one';

import {
    listToMap,
    isDefined,
} from '@togglecorp/fujs';

import Page from '#components/Page';

import {
    getYmd,
} from '#utils/common';

import Map from '../Map';
import LeftPane from './LeftPane';
import Seekbar from './Seekbar';
import Filter from '../Filter';

import {
    getAggregatedStats,
    getGroupMethod,
    getGroupedIncidents,
    getMinMaxTime,
    getSanitizedIncidents,
    metricMap,
    metricOptions,
    metricType,
    getFilledGroupedIncidents,
} from '../common';

import styles from './styles.scss';

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
                startTimestamp: minTime,
                endTimestamp: maxTime,
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

    renderEventTimeline = ({
        start,
        end,
        eventList,
    }) => {
        if (!start || !end || eventList.length === 0) {
            return null;
        }

        const {
            startTimestamp,
            endTimestamp,
        } = this.state;

        const DAY = 1000 * 60 * 60 * 24;

        const sanitizedEventList = eventList
            .filter(d => d.startedOn)
            .map((d) => {
                const startedOn = (new Date(d.startedOn)).getTime();
                const endedOn = d.endedOn
                    ? (new Date(d.endedOn)).getTime()
                    : startedOn + (DAY * 30);

                return {
                    ...d,
                    startedOn,
                    endedOn,
                };
            })
            .filter(d => d.startedOn >= startTimestamp && d.startedOn <= endTimestamp);

        return (
            <div className={styles.eventList}>
                { sanitizedEventList.map((e) => {
                    const timelineBandwidth = endTimestamp - startTimestamp;
                    const left = 100 * ((e.startedOn - startTimestamp) / timelineBandwidth);
                    const right = 100 * ((e.endedOn - startTimestamp) / timelineBandwidth);

                    return (
                        <div
                            key={e.id}
                            className={styles.eventTitle}
                            style={{
                                left: `${left}%`,
                                width: `${right - left}%`,
                            }}
                            title={`${e.startedOn} ${e.endedOn}`}
                        >
                            { e.title }
                        </div>
                    );
                })}
            </div>
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
            eventList,
        } = this.props;

        const {
            start,
            end,
            leftPaneExpanded,
            rightPaneExpanded,
            currentIndex,
            playbackStart,
            playbackEnd,
        } = this.state;

        const {
            mapping,
            aggregatedStat,
            sanitizedIncidents,
        } = this.generateDataset(lossAndDamageList, start, end, regions, regionLevel);

        const selectedMetric = metricMap[metric];
        const maxValue = Math.max(selectedMetric.metricFn(aggregatedStat), 1);

        const geoareas = (
            (regionLevel === 3 && wards)
            || (regionLevel === 2 && municipalities)
            || (regionLevel === 1 && districts)
            || provinces
        );

        const DAY = 1000 * 60 * 60 * 24;
        const groupedIncidents = getFilledGroupedIncidents(
            sanitizedIncidents,
            item => Math.floor(item.incidentOn / DAY),
        );

        const EventTimeline = this.renderEventTimeline;

        return (
            <React.Fragment>
                <Map
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                    mapping={mapping[currentIndex]}
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
                    mainContentClassName={styles.main}
                    mainContent={
                        <div className={styles.seekbarContainer}>
                            <EventTimeline
                                eventList={eventList}
                                start={start}
                                end={end}
                            />
                            <Seekbar
                                className={styles.seekbar}
                                data={groupedIncidents}
                                metric={selectedMetric.metricFn}
                                metricName={selectedMetric.label}
                                start={playbackStart}
                                end={playbackEnd}
                            />
                        </div>
                    }
                />
            </React.Fragment>
        );
    }
}
