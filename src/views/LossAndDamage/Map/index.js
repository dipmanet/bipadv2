import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { listToMap, isDefined } from '@togglecorp/fujs';

import ChoroplethMap from '#components/ChoroplethMap';
import { districtsSelector } from '#selectors';
import { getMapPaddings } from '#constants';
import { groupList } from '#utils/common';

import styles from './styles.scss';

const metric = (val) => {
    if (!val) {
        return 0;
    }
    return val.count || 0;
};

const sum = list => list.reduce(
    (acc, val) => acc + (isDefined(val) ? val : 0),
    0,
);

const colorGrade = [
    '#fee5d9',
    '#fcbba1',
    '#fc9272',
    '#fb6a4a',
    '#ef3b2c',
    '#cb181d',
    '#99000d',
];


const pickList = (list, start, offset) => {
    const newList = [];
    for (let i = start; i < list.length; i += offset) {
        newList.push(list[i]);
    }
    return newList;
};

const propTypes = {
    pause: PropTypes.bool,
    districts: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    pause: false,
};

const PLAYBACK_INTERVAL = 2000;

const mapStateToProps = state => ({
    districts: districtsSelector(state),
});

class LossAndDamageMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: -1,
        };
    }

    componentDidMount() {
        this.playback();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.lossAndDamageList !== nextProps.lossAndDamageList) {
            this.setState({ currentIndex: -1 });
            this.playback();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        } else if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        } else if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }
        return mapPaddings.noPaneExpanded;
    });

    generateDataset = memoize((incidents) => {
        if (!incidents || incidents.length <= 0) {
            return {
                mapping: [],
                maxCount: 0,
                minTime: 0,
                maxTime: 0,
                onSpan: 0,
                totalIteration: 0,
            };
        }

        const sanitizedIncidents = incidents.filter(({ incidentOn, wards }) => (
            incidentOn && wards && wards.length > 0
        )).map(incident => ({
            ...incident,
            incidentOn: new Date(incident.incidentOn).getTime(),
            district: incident.wards[0].municipality.district,
        }));

        const timing = sanitizedIncidents.map(incident => incident.incidentOn);

        const minTime = Math.min(...timing);
        const maxTime = Math.max(...timing);

        const daySpan = 1000 * 60 * 60 * 24;
        const oneSpan = 7 * daySpan;

        const totalSpan = maxTime - minTime;

        const totalIteration = Math.ceil(totalSpan / oneSpan);

        const mapping = [];

        let maxStat = {
            count: 0,
            estimatedLoss: 0,
            infrastructureDestroyedCount: 0,
            livestockDestroyedCount: 0,
            peopleDeathCount: 0,
        };

        for (let i = 0; i < totalIteration; i += 1) {
            const start = minTime + (i * oneSpan);
            const end = minTime + ((i + 1) * oneSpan);

            const filteredIncidents = sanitizedIncidents.filter(({ incidentOn }) => (
                incidentOn >= start && incidentOn < end
            ));
            const groupedIncidents = groupList(
                filteredIncidents,
                ({ district }) => district,
            ).map(({ key, value }) => ({
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
            }));


            maxStat = groupedIncidents.reduce(
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
                maxStat,
            );

            const mappedIncidents = listToMap(
                groupedIncidents,
                incident => incident.key,
                incident => incident,
            );
            mapping.push(mappedIncidents);
        }

        const val = { mapping, maxStat, minTime, maxTime, oneSpan, totalIteration };
        return val;
    });

    generateColor = memoize((maxValue, minValue, colorMapping) => {
        const newColor = [];
        const { length } = colorMapping;
        const range = maxValue - minValue;
        colorMapping.forEach((color, i) => {
            const val = minValue + ((i * range) / (length - 1));
            newColor.push(val);
            newColor.push(color);
        });
        return newColor;
    });

    generatePaint = memoize(color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'count'],
            ...color,
        ],
    }))

    generateMapState = memoize((districts, groupedIncidentMapping, metricFn) => {
        const value = districts.map(district => ({
            id: district.id,
            value: {
                count: groupedIncidentMapping
                    ? metricFn(groupedIncidentMapping[district.id])
                    : 0,
            },
        }));
        return value;
    });

    playback = () => {
        const {
            lossAndDamageList,
            onPlaybackProgress,
            pause: isPaused,
        } = this.props;

        clearTimeout(this.timeout);

        if (!isPaused && lossAndDamageList.length > 0) {
            const { currentIndex } = this.state;
            const {
                totalIteration,
                minTime,
                maxTime,
                oneSpan,
            } = this.generateDataset(lossAndDamageList);

            const newIndex = currentIndex + 1 < totalIteration
                ? currentIndex + 1
                : 0;

            this.setState({ currentIndex: newIndex });
            if (onPlaybackProgress) {
                onPlaybackProgress(
                    {
                        start: minTime + (newIndex * oneSpan),
                        end: Math.min(minTime + ((newIndex + 1) * oneSpan), maxTime),
                    },
                    { min: minTime, max: maxTime },
                );
            }
        }

        this.timeout = setTimeout(this.playback, PLAYBACK_INTERVAL);
    }

    render() {
        const {
            lossAndDamageList,
            leftPaneExpanded,
            rightPaneExpanded,
            districts,
        } = this.props;
        const { currentIndex } = this.state;

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);
        const { mapping, maxStat } = this.generateDataset(lossAndDamageList);
        const color = this.generateColor(Math.max(metric(maxStat), 1), 0, colorGrade);
        const colorPaint = this.generatePaint(color);
        const mapState = this.generateMapState(districts, mapping[currentIndex], metric);

        const colorString = `linear-gradient(to right, ${pickList(color, 1, 2).join(', ')})`;
        const maxValue = Math.max(metric(maxStat), 1);

        return (
            <React.Fragment>
                <div className={styles.legend}>
                    <h5 className={styles.heading}>
                        Number of incidents
                    </h5>
                    <div className={styles.range}>
                        <div className={styles.min}>
                            0
                        </div>
                        <div className={styles.max}>
                            { maxValue }
                        </div>
                    </div>
                    <div
                        className={styles.scale}
                        style={{
                            background: colorString,
                        }}
                    />
                </div>
                <ChoroplethMap
                    boundsPadding={boundsPadding}
                    paint={colorPaint}
                    mapState={mapState}
                />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(LossAndDamageMap);
