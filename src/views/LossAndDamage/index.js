import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';


import {
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import Page from '#components/Page';

import Map from './Map';
import LeftPane from './LeftPane';
import Filter from './Filter';

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


    render() {
        const {
            className,
            requests: {
                lossAndDamageRequest: {
                    response: {
                        results: lossAndDamageList = emptyList,
                    } = emptyObject,
                },
            },
        } = this.props;

        return (
            <React.Fragment>
                <Map
                    lossAndDamageList={lossAndDamageList}
                />
                <Page
                    leftContentClassName={styles.left}
                    leftContent={<LeftPane lossAndDamageList={lossAndDamageList} />}
                    rightContentClassName={styles.right}
                    rightContent={null}
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
        url: '/incident/?fields=loss.peoples.age,loss.peoples.status,point,polygon,incident_on&expand=loss.peoples',
        onMount: true,
    },
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator(),
    createRequestClient(requests),
)(LossAndDamage);
