import React from 'react';
import memoize from 'memoize-one';
import { currentStyle } from '#rsu/styles';
import { lossMetrics } from '#utils/domain';

import {
    listToMap,
    isDefined,
} from '@togglecorp/fujs';

import {
    iconNames,
    styleProperties,
} from '#constants';
import Page from '#components/Page';
import {
    getYmd,
} from '#utils/common';

import Button from '#rsca/Button';
import FormattedDate from '#rscv/FormattedDate';
import SelectInput from '#rsci/SelectInput';

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
    metricType,
    getFilledGroupedIncidents,
} from '../common';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const convertValueToNumber = (value = '') => +(value.substring(0, value.length - 2));

const emptyList = [];
const emptyObject = {};
const PLAYBACK_INTERVAL = 2000;

const timeBucketOptions = [
    { key: '1d', label: 'A day' },
    { key: '7d', label: 'A week' },
    { key: '1m', label: 'A month' },
    { key: '6m', label: 'Six months' },
    { key: '1y', label: 'A year' },
];

const A_DAY = 1000 * 60 * 60 * 24;

const timeBucketValues = {
    '1d': A_DAY,
    '7d': 7 * A_DAY,
    '1m': 30 * A_DAY,
    '6m': 6 * 30 * A_DAY,
    '1y': 12 * 30 * A_DAY,
};

export default class Timeline extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,

            timeBucket: '7d',
            isPlaying: true,
            // For seekbar
            playbackStart: 0,
            playbackEnd: 0,

            currentIndex: -1,
            currentRange: {
                start: 0,
                end: 0,
            },
        };
    }

    componentDidMount() {
        const {
            lossAndDamageList,
            regionLevel,
        } = this.props;
        const { rightPaneExpanded } = this.state;

        this.playback(lossAndDamageList, regionLevel);
        this.setPlacementForMapControls(rightPaneExpanded);
    }

    componentWillReceiveProps(nextProps) {
        const {
            lossAndDamageList: oldLossAndDamageList,
            regionLevel: oldRegionLevel,
        } = this.props;

        const {
            lossAndDamageList: newLossAndDamageList,
            regionLevel: newRegionLevel,
        } = nextProps;

        if (
            oldLossAndDamageList !== newLossAndDamageList
            || oldRegionLevel !== newRegionLevel
        ) {
            const {
                minTime,
                maxTime,
            } = getMinMaxTime(newLossAndDamageList);

            this.setState({
                startTimestamp: minTime,
                endTimestamp: maxTime,
                start: getYmd(minTime),
                end: getYmd(maxTime),

                playbackStart: 0,
                playbackEnd: 0,

                currentIndex: -1,
                currentRange: {
                    start: 0,
                    end: 0,
                },
            }, () => {
                clearTimeout(this.timeout);
                this.playback(newLossAndDamageList, newRegionLevel);
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);

        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
        if (mapControls) {
            mapControls.style.right = this.previousMapControlRight;
            mapControls.style.bottom = this.previousMapControlBottom;
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
            const heightTimeline = convertValueToNumber(styleProperties.heightTimelineMainContent);

            if (!this.previousMapControlRight) {
                this.previousMapControlRight = mapControls.style.right;
                this.previousMapControlBottom = mapControls.style.bottom;
            }

            mapControls.style.right = `${widthNavbar + widthRightPanel + spacingMedium}px`;
            mapControls.style.bottom = `${heightTimeline + spacingMedium}px`;
        }
    }

    generateDataset = memoize((
        incidents,
        startTime,
        endTime,
        bucketValue,
        regionLevel,
    ) => {
        if (!incidents || incidents.length <= 0) {
            return {
                mapping: [],
                maxCount: 0,
                minTime: 0,
                maxTime: 0,
                totalIteration: 0,
                otherMapping: [],
            };
        }

        const bucketedIncidents = [];
        const {
            minTime,
            maxTime,
        } = getMinMaxTime(incidents);

        const totalSpan = maxTime - minTime;

        const totalIteration = Math.ceil(totalSpan / bucketValue);
        this.totalIteration = totalIteration;

        for (let i = 0; i < totalIteration; i += 1) {
            const start = minTime + (i * bucketValue);
            const end = minTime + ((i + 1) * bucketValue);

            const filteredIncidents = incidents.filter(({ incidentOn }) => (
                incidentOn >= start && incidentOn < end
            ));
            bucketedIncidents.push(filteredIncidents);
        }

        const groupFn = getGroupMethod(regionLevel + 1);
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
            totalIteration,
        };
        return val;
    });

    playback = (lossAndDamageList, regionLevel, currentIndexFromArg = -1) => {
        clearTimeout(this.timeout);
        const {
            start,
            end,
            timeBucket,
            isPlaying,
        } = this.state;

        const bucketValue = timeBucketValues[timeBucket];

        const {
            totalIteration,
            minTime,
            maxTime,
        } = this.generateDataset(lossAndDamageList, start, end, bucketValue, regionLevel);

        if (isPlaying && lossAndDamageList.length > 0) {
            let currentIndex = currentIndexFromArg;
            let newIndex = currentIndex;

            if (currentIndexFromArg === -1) {
                const { currentIndex: currentIndexFromState } = this.state;
                currentIndex = currentIndexFromState;
                newIndex = currentIndex + 1;
            }

            newIndex = newIndex < totalIteration
                ? newIndex
                : 0;

            const current = {
                start: minTime + (newIndex * bucketValue),
                end: Math.min(minTime + ((newIndex + 1) * bucketValue), maxTime),
            };

            const range = maxTime - minTime;

            this.setState({
                playbackStart: (100 * (current.start - minTime)) / range,
                playbackEnd: (100 * (current.end - minTime)) / range,

                currentIndex: newIndex,
                currentRange: current,
            });
        }

        this.timeout = setTimeout(
            () => this.playback(lossAndDamageList, regionLevel),
            PLAYBACK_INTERVAL,
        );
    }

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

    handlePlaybackButtonClick = () => {
        const { isPlaying } = this.state;
        this.setState({ isPlaying: !isPlaying });
    }

    handleBucketInputChange = (timeBucket) => {
        this.setState({ timeBucket });
    }

    handleSeekbarClick = (progressPercent) => {
        const currentIndex = Math.round(((this.totalIteration - 1) * progressPercent) / 100);
        // this.setState({ currentIndex });

        const {
            lossAndDamageList,
            regionLevel,
        } = this.props;

        this.playback(lossAndDamageList, regionLevel, currentIndex);
    }

    renderEventTimeline = ({
        start,
        end,
        eventList = emptyList,
    }) => {
        if (!start || !end || eventList.length === 0) {
            return null;
        }

        const {
            startTimestamp,
            endTimestamp,
        } = this.state;

        const DAY = 1000 * 60 * 60 * 24;

        // FIXME: memoize this
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
            currentRange,
            timeBucket,
            isPlaying,
        } = this.state;

        const bucketValue = timeBucketValues[timeBucket];

        const {
            mapping,
            aggregatedStat,
        } = this.generateDataset(lossAndDamageList, start, end, bucketValue, regionLevel);

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
            lossAndDamageList,
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
                    isTimeline
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
                            metricOptions={lossMetrics}
                            metricType={metricType}
                            isTimeline
                        />
                    }
                    mainContentClassName={styles.main}
                    mainContent={
                        <React.Fragment>
                            <div className={styles.top}>
                                <div className={styles.info}>
                                    <div className={styles.nowShowingLabel}>
                                        Now showing:
                                    </div>
                                    <FormattedDate
                                        value={currentRange.start}
                                        mode="yyyy-MM-dd"
                                    />
                                    <div className={styles.separator}>
                                        to
                                    </div>
                                    <FormattedDate
                                        value={currentRange.end}
                                        mode="yyyy-MM-dd"
                                    />
                                </div>
                                <div className={styles.bucketInputContainer}>
                                    <div className={styles.label}>
                                        Time bucket:
                                    </div>
                                    <SelectInput
                                        options={timeBucketOptions}
                                        value={timeBucket}
                                        onChange={this.handleBucketInputChange}
                                        showHintAndError={false}
                                        showLabel={false}
                                    />
                                </div>
                            </div>
                            <div className={styles.seekbarContainer}>
                                <div className={styles.left}>
                                    <Button
                                        onClick={this.handlePlaybackButtonClick}
                                        className={styles.playbackButton}
                                        iconName={!isPlaying ? iconNames.play : iconNames.pause}
                                    />
                                </div>
                                <div className={styles.right}>
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
                                        onClick={this.handleSeekbarClick}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    }
                />
            </React.Fragment>
        );
    }
}
