import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { listToMap, isDefined, isNotDefined } from '@togglecorp/fujs';

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
    regionsSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    regionLevelSelector,
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
            limit: 2000,
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
            regions,
            regionLevel,
        } = this.props;
        this.playback(lossAndDamageList, regions, regionLevel);
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
            regions: oldRegions,
            regionLevel: oldRegionLevel,
        } = this.props;

        const {
            requests: {
                lossAndDamageRequest: {
                    response: {
                        results: newLossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
            regions: newRegions,
            regionLevel: newRegionLevel,
        } = nextProps;

        if (
            oldLossAndDamageList !== newLossAndDamageList
            || oldRegions !== newRegions
            || oldRegionLevel !== newRegionLevel
        ) {
            const { minTime, maxTime } = this.getMinMaxTime(newLossAndDamageList, newRegions);
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

    getSanitizedIncidents = (incidents, regions) => {
        const sanitizedIncidents = incidents.filter(({ incidentOn, wards }) => (
            incidentOn && wards && wards.length > 0
        )).map(incident => ({
            ...incident,
            incidentOn: new Date(incident.incidentOn).getTime(),
            ...getRegionInfoFromWard(
                incident.wards[0].id,
                regions,
            ),
        }));
        return sanitizedIncidents;
    }

    getMinMaxTime = (incidents, regions) => {
        const sanitizedIncidents = this.getSanitizedIncidents(incidents, regions);
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

        const sanitizedIncidents = this.getSanitizedIncidents(incidents, regions).filter(
            ({ incidentOn }) => (
                !(isDefined(startTime) && incidentOn < new Date(startTime).getTime())
                && !(isDefined(endTime) && incidentOn > new Date(endTime).getTime())
            ),
        );

        const bucketedIncidents = [];
        const { minTime, maxTime } = this.getMinMaxTime(sanitizedIncidents, regions);
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
            incident => this.getGroupedIncidents(incident, groupFn),
        );

        const listToMapGroupedItem = groupedIncidents => (
            listToMap(
                groupedIncidents,
                incident => incident.key,
                incident => incident,
            )
        );
        const mapping = regionGroupedIncidents.map(listToMapGroupedItem);

        const aggregatedStat = this.getAggregatedStats(regionGroupedIncidents.flat());

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
            regions,
            districts,
            provinces,
            wards,
            municipalities,
            regionLevel,
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
        } = this.generateDataset(lossAndDamageList, start, end, regions, regionLevel);

        // NOTE: this should always be defined
        const selectedMetric = metricMap[metricType];
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
                    pause={pauseMap}
                    // onPlaybackProgress={this.handleMapPlaybackProgress}
                    lossAndDamageList={lossAndDamageList}
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

export default compose(
    connect(mapStateToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(LossAndDamage);
