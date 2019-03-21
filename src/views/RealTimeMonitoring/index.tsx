import React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { AppState } from '#store/types';
import * as PageType from '#store/atom/page/types';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    setRealTimeRainListAction,
} from '#actionCreators';
import {
    realTimeRainListSelector,
} from '#selectors';

import Map from './Map';

import styles from './styles.scss';

interface State {}
interface Params {}
interface OwnProps {}
interface PropsFromDispatch {
    setRealTimeRainList: typeof setRealTimeRainListAction;
}

interface PropsFromState {
    realTimeRain: PageType.Rain[];
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromState;

type Props = NewProps<ReduxProps, Params>;

const mapStateToProps = (state: AppState): PropsFromState => ({
    realTimeRainList: realTimeRainListSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setRealTimeRainList: params => dispatch(setRealTimeRainListAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
    realTimeRainRequest: {
        url: '/rain/',
        method: methods.GET,
        onSuccess: ({ response, props: { setRealTimeRainList } }) => {
            interface Response { results: PageType.RealTimeRain[] }
            const { results: realTimeRainList = [] } = response as Response;
            setRealTimeRainList({ realTimeRainList });
        },
        onMount: true,
    },
};

class RealTimeMonitoring extends React.PureComponent <Props, State> {
    public render() {
        const {
            realTimeRainList,
            requests: {
                realTimeRainRequest: { pending },
            },
        } = this.props;

        return (
            <Map realTimeRainList={realTimeRainList} />
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    createConnectedRequestCoordinator<ReduxProps>(),
    createRequestClient(requests),
)(RealTimeMonitoring);
