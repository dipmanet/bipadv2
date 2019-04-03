import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { listToMap, isDefined } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import FormattedDate from '#rscv/FormattedDate';
import DateInput from '#rsci/DateInput';

import { groupFilledList, groupList, sum, getYmd } from '#utils/common';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import { iconNames } from '#constants';

import Page from '#components/Page';

import {
    lossAndDamageFilterValuesSelector,
} from '#selectors';

import { transformDateRangeFilterParam } from '#utils/transformations';

import Map from './Map';
import LeftPane from './LeftPane';
import LossAndDamageFilter from './Filter';

import Seekbar from './Seekbar';
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


const groupFn = val => val.district;

const propTypes = {
};

const defaultProps = {
};

const PLAYBACK_INTERVAL = 2000;

class LossAndDamage extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,

            pauseMap: false,

            metricType: 'count',

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
            className,
            requests: {
                lossAndDamageRequest: {
                    pending,
                    response: {
                        results: lossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
        } = this.props;
        this.playback(lossAndDamageList);
    }

    componentWillReceiveProps(nextProps) {
        const {
            requests: {
                lossAndDamageRequest: {
                    response: {
                        results: oldLossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
        } = this.props;

        const {
            requests: {
                lossAndDamageRequest: {
                    response: {
                        results: newLossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
        } = nextProps;

        if (oldLossAndDamageList !== newLossAndDamageList) {
            const { minTime, maxTime } = this.getMinMaxTime(newLossAndDamageList);
            this.setState({
                start: getYmd(minTime),
                end: getYmd(maxTime),
                currentIndex: -1,
            });
            this.playback(newLossAndDamageList);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    getSanitizedIncidents = (incidents) => {
        const sanitizedIncidents = incidents.filter(({ incidentOn, wards }) => (
            incidentOn && wards && wards.length > 0
        )).map(incident => ({
            ...incident,
            incidentOn: new Date(incident.incidentOn).getTime(),
            district: incident.wards[0].municipality.district,
        }));
        return sanitizedIncidents;
    }

    getMinMaxTime = (incidents) => {
        const sanitizedIncidents = this.getSanitizedIncidents(incidents);
        const timing = sanitizedIncidents.map(incident => incident.incidentOn);
        const minTime = Math.min(...timing);
        const maxTime = Math.max(...timing);
        return { minTime, maxTime };
    }

    getStat = ({ key, value }) => ({
        key,
        count: value.length,
        estimatedLoss: sum(
            value.map(item => item.loss.estimatedLoss),
        ),
        infrastructureDestroyedCount: sum(value.map(
            item => item.loss.infrastructureDestroyedCount,
        )),
        livestockDestroyedCount: sum(
            value.map(item => item.loss.livestockDestroyedCount),
        ),
        peopleDeathCount: sum(
            value.map(item => item.loss.peopleDeathCount),
        ),
    })

    getGroupedIncidents = (incidents, groupingFn) => (
        groupList(incidents, groupingFn).map(this.getStat)
    )

    getFilledGroupedIncidents = (incidents, groupingFn) => (
        groupFilledList(incidents, groupingFn).map(this.getStat)
    )

    getAggregatedStats = incidents => (
        incidents.reduce(
            (acc, val) => ({
                count: Math.max(acc.count, val.count),
                estimatedLoss: Math.max(acc.estimatedLoss, val.estimatedLoss),
                infrastructureDestroyedCount: Math.max(
                    acc.infrastructureDestroyedCount,
                    val.infrastructureDestroyedCount,
                ),
                liveStockDestroyedCount: Math.max(
                    acc.liveStockDestroyedCount,
                    val.liveStockDestroyedCount,
                ),
                peopleDeathCount: Math.max(acc.peopleDeathCount, val.peopleDeathCount),
            }),
            {
                count: 0,
                estimatedLoss: 0,
                infrastructureDestroyedCount: 0,
                livestockDestroyedCount: 0,
                peopleDeathCount: 0,
            },
        )
    )

    generateDataset = memoize((incidents, startTime, endTime) => {
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

        const sanitizedIncidents = this.getSanitizedIncidents(incidents).filter(
            ({ incidentOn }) => (
                !(isDefined(startTime) && incidentOn < new Date(startTime).getTime())
                && !(isDefined(endTime) && incidentOn > new Date(endTime).getTime())
            ),
        );

        const bucketedIncidents = [];
        const { minTime, maxTime } = this.getMinMaxTime(sanitizedIncidents);
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

        const districtGroupedIncidents = bucketedIncidents.map(
            incident => this.getGroupedIncidents(incident, groupFn),
        );

        const listToMapGroupedItem = groupedIncidents => (
            listToMap(
                groupedIncidents,
                incident => incident.key,
                incident => incident,
            )
        );
        const mapping = districtGroupedIncidents.map(listToMapGroupedItem);

        const aggregatedStat = this.getAggregatedStats(districtGroupedIncidents.flat());

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

    playback = (lossAndDamageList) => {
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
        } = this.generateDataset(lossAndDamageList, start, end);

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

        this.timeout = setTimeout(() => this.playback(lossAndDamageList), PLAYBACK_INTERVAL);
    }

    handleLeftPaneExpandChange = (leftPaneExpanded) => {
        this.setState({ leftPaneExpanded });
    }

    handleRightPaneExpandChange = (rightPaneExpanded) => {
        this.setState({ rightPaneExpanded });
    }

    handlePlayPauseButtonClick = () => {
        const { pauseMap } = this.state;
        this.setState({ pauseMap: !pauseMap });
    }

    handleStartInputChange = (start) => {
        this.setState({ start });
    }

    handleEndInputChange = (end) => {
        this.setState({ end });
    }

    handleMetricChange = (metricType) => {
        this.setState({ metricType });
    }

    renderMainContent = ({ lossAndDamageList, metric, metricName }) => {
        const {
            pauseMap,
            playbackStart,
            playbackEnd,
            currentRange,
            start,
            end,
        } = this.state;

        const DAY = 1000 * 60 * 60 * 24;
        const groupedIncidents = this.getFilledGroupedIncidents(
            lossAndDamageList,
            item => Math.floor(item.incidentOn / DAY),
        );

        return (
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.info}>
                        <div>
                            Showing events from
                        </div>
                        <FormattedDate
                            value={currentRange.start}
                            mode="yyyy-MM-dd"
                        />
                        <div>
                            to
                        </div>
                        <FormattedDate
                            value={currentRange.end}
                            mode="yyyy-MM-dd"
                        />
                    </div>
                    <div className={styles.dateInputRange}>
                        <DateInput
                            label="Start"
                            value={start}
                            onChange={this.handleStartInputChange}
                            showHintAndError={false}
                        />
                        <DateInput
                            label="End"
                            value={end}
                            onChange={this.handleEndInputChange}
                            showHintAndError={false}
                        />
                    </div>
                </div>
                <div className={styles.bottom}>
                    <Button
                        className={styles.playButton}
                        onClick={this.handlePlayPauseButtonClick}
                        iconName={pauseMap ? iconNames.play : iconNames.pause}
                    />
                    <Seekbar
                        className={styles.seekbar}
                        start={playbackStart}
                        end={playbackEnd}
                        data={groupedIncidents}
                        metric={metric}
                        metricName={metricName}
                    />
                </div>
            </div>
        );
    }

    render() {
        const {
            className,
            requests: {
                lossAndDamageRequest: {
                    pending,
                    response: {
                        results: lossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
        } = this.props;

        const {
            pauseMap,
            leftPaneExpanded,
            rightPaneExpanded,
            currentIndex,
            start,
            end,
            metricType,
        } = this.state;

        const MainContent = this.renderMainContent;

        const {
            sanitizedIncidents,
            mapping,
            otherMapping,
            aggregatedStat,
        } = this.generateDataset(lossAndDamageList, start, end);

        // NOTE: this should always be defined
        const selectedMetric = metricMap[metricType];
        const maxValue = Math.max(selectedMetric.metricFn(aggregatedStat), 1);

        return (
            <React.Fragment>
                <Map
                    pause={pauseMap}
                    // onPlaybackProgress={this.handleMapPlaybackProgress}
                    // onDistrictSelect={this.handleMapDistrictSelect}
                    lossAndDamageList={lossAndDamageList}
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                    mapping={mapping[currentIndex]}
                    maxValue={maxValue}
                    metric={selectedMetric.metricFn}
                    metricName={selectedMetric.label}
                />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={
                        <LeftPane
                            pending={pending}
                            // selectedDistricts={selectedDistricts}
                            lossAndDamageList={otherMapping[currentIndex]}
                            onExpandChange={this.handleLeftPaneExpandChange}
                        />
                    }
                    rightContentClassName={styles.right}
                    rightContent={
                        <LossAndDamageFilter
                            onExpandChange={this.handleRightPaneExpandChange}
                            metricOptions={metricOptions}
                            onMetricChange={this.handleMetricChange}
                            metricType={metricType}
                        />
                    }
                    mainContentClassName={styles.main}
                    mainContent={
                        <MainContent
                            lossAndDamageList={sanitizedIncidents}
                            metric={selectedMetric.metricFn}
                            metricName={selectedMetric.label}
                        />
                    }
                />
            </React.Fragment>
        );
    }
}

// FIXME: save this on redux
const requests = {
    lossAndDamageRequest: {
        url: '/incident/',
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            expand: ['loss.peoples', 'wards.municipality'],
            limit: 120,
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
};

const mapStateToProps = state => ({
    filters: lossAndDamageFilterValuesSelector(state),
});

const mapDispatchToProps = dispatch => ({
});

export default compose(
    connect(mapStateToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(LossAndDamage);
