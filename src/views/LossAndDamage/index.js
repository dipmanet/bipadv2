import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Button from '#rsca/Button';
import FormattedDate from '#rscv/FormattedDate';
import DateInput from '#rsci/DateInput';

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

const propTypes = {
};

const defaultProps = {
};

const emptyObject = {};
const emptyList = [];

const getFlatLossData = ({
    peoples = emptyList,
    infrastructures = emptyList,
    livestocks = emptyList,
} = emptyObject) => ({
    peoples: peoples.length,
    infrastructures: infrastructures.length,
    livestocks: livestocks.length,
});

const transformLossAndDamageDataToStreamFormat = (lossAndDamageList) => {
    // const streamData = {};

    /*
    lossAndDamageList.forEach((d) => {
        if (d.incidentOn) {
            if (!streamData[d.incidentOn]) {
                streamData[d.incidentOn] = [];
            }
            console.warn(d);
        }
    });
    */

    const streamData = lossAndDamageList.filter(d => d.incidentOn)
        .map(d => ({
            time: (new Date(d.incidentOn)).getTime(),
            ...getFlatLossData(d.loss),
        }));

    return streamData;
};

const mapStateToProps = state => ({
    filters: lossAndDamageFilterValuesSelector(state),
});

class LossAndDamage extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            playbackProgress: 0,
            currentRange: {},
            timeExtent: {},
            pauseMap: false,
            selectedDistricts: [],
            leftPaneExpanded: true,
            rightPaneExpanded: true,
            start: undefined,
            end: undefined,
        };
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
            let minDate = new Date().getTime();
            let maxDate = new Date(0).getTime();

            if (newLossAndDamageList.length > 0) {
                newLossAndDamageList.forEach((l) => {
                    const incidentDate = (new Date(l.incidentOn)).getTime();
                    if (incidentDate > maxDate) {
                        maxDate = incidentDate;
                    }

                    if (incidentDate < minDate) {
                        minDate = incidentDate;
                    }
                });

                const getYmd = (dateString) => {
                    const date = new Date(dateString);
                    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                };

                this.setState({
                    start: getYmd(minDate),
                    end: getYmd(maxDate),
                });
            }
        }
    }

    handleLeftPaneExpandChange = (leftPaneExpanded) => {
        this.setState({ leftPaneExpanded });
    }

    handleRightPaneExpandChange = (rightPaneExpanded) => {
        this.setState({ rightPaneExpanded });
    }

    handleMapPlaybackProgress = (current, extent) => {
        const start = current.start - extent.min;
        const end = current.end - extent.min;
        const range = extent.max - extent.min;
        this.setState({
            currentRange: current,
            timeExtent: extent,
            playbackStart: (100 * start) / range,
            playbackEnd: (100 * end) / range,
        });
        // console.warn(current, extent);
    }

    handleMapDistrictSelect = (selectedDistricts) => {
        this.setState({ selectedDistricts });
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

    renderMainContent = () => {
        const {
            playbackStart,
            playbackEnd,
            currentRange,
            pauseMap,
            start,
            end,
        } = this.state;

        const {
            requests: {
                lossAndDamageRequest: {
                    pending,
                    response: {
                        results: lossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
        } = this.props;

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
                        data={lossAndDamageList}
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
            selectedDistricts,
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        return (
            <React.Fragment>
                <Map
                    pause={pauseMap}
                    lossAndDamageList={lossAndDamageList}
                    onPlaybackProgress={this.handleMapPlaybackProgress}
                    onDistrictSelect={this.handleMapDistrictSelect}
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={
                        <LeftPane
                            pending={pending}
                            lossAndDamageList={lossAndDamageList}
                            selectedDistricts={selectedDistricts}
                            onExpandChange={this.handleLeftPaneExpandChange}
                        />
                    }
                    rightContentClassName={styles.right}
                    rightContent={
                        <LossAndDamageFilter
                            onExpandChange={this.handleRightPaneExpandChange}
                        />
                    }
                    mainContentClassName={styles.main}
                    mainContent={this.renderMainContent()}
                />
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
});

const requests = {
    lossAndDamageRequest: {
        url: '/incident/',
        query: ({ props: { filters } }) => ({
            ...transformDateRangeFilterParam(filters, 'incident_on'),
            expand: ['loss.peoples', 'wards.municipality'],
            limit: 10000,
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

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(LossAndDamage);
