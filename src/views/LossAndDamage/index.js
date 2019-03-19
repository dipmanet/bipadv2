import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Button from '#rsca/Button';
import FormattedDate from '#rscv/FormattedDate';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import { iconNames } from '#constants';

import Page from '#components/Page';

import Map from './Map';
import LeftPane from './LeftPane';
import Filter from './Filter';

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
        };
    }

    handleMapPlaybackProgress = (current, extent) => {
        const progress = current.end - extent.min;
        const range = extent.max - extent.min;
        this.setState({
            currentRange: current,
            timeExtent: extent,
            playbackProgress: (100 * progress) / range,
        });
        // console.warn(current, extent);
    }

    handlePlayPauseButtonClick = () => {
        const { pauseMap } = this.state;
        this.setState({ pauseMap: !pauseMap });
    }

    renderMainContent = () => {
        const {
            playbackProgress,
            currentRange,
            pauseMap,
        } = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.info}>
                    <div>
                        Showing events from
                    </div>
                    <FormattedDate value={currentRange.start} />
                    <div>
                        to
                    </div>
                    <FormattedDate value={currentRange.end} />
                </div>
                <div className={styles.bottom}>
                    <Button
                        className={styles.playButton}
                        onClick={this.handlePlayPauseButtonClick}
                        iconName={pauseMap ? iconNames.play : iconNames.pause}
                    />
                    <Seekbar
                        progress={playbackProgress}
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

        const { pauseMap } = this.state;

        return (
            <React.Fragment>
                <Map
                    pause={pauseMap}
                    lossAndDamageList={lossAndDamageList}
                    onPlaybackProgress={this.handleMapPlaybackProgress}
                />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={
                        <LeftPane
                            pending={pending}
                            lossAndDamageList={lossAndDamageList}
                        />
                    }
                    rightContentClassName={styles.right}
                    rightContent={null}
                    mainContentClassName={styles.main}
                    mainContent={this.renderMainContent()}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

const requests = {
    lossAndDamageRequest: {
        url: '/incident/?expand=loss.peoples',
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
