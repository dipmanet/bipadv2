import Loadable from 'react-loadable';
import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Router } from '@reach/router';
import { _cs } from '@togglecorp/fujs';

import Map from '#rscz/Map';
import MapContainer from '#rscz/Map/MapContainer';
import { District, Province, Municipality } from '#store/atom/page/types';

import DangerButton from '#rsca/Button/DangerButton';
import Loading from '#components/Loading';
import Navbar from '#components/Navbar';
import { routeSettings } from '#constants';
import { AppState } from '#store/types';

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';
import {
    setInitialPopupHiddenAction,
    setRegionAction,
} from '#actionCreators';

import authRoute from '#components/authRoute';
import errorBound from '../errorBound';
import helmetify from '../helmetify';

import styles from './styles.scss';

const loadingStyle: React.CSSProperties = {
    zIndex: 1111,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    padding: 10,
    textAlign: 'center',
    alignItems: 'baseline',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(255, 0, 0, 0.2)',
    borderRadius: '3px',
};

function reloadPage() {
    window.location.reload(false);
}

const ErrorInPage = () => (
    <div style={loadingStyle}>
        Some problem occured.
        <DangerButton
            transparent
            onClick={reloadPage}
        >
            Reload
        </DangerButton>
    </div>
);

const RetryableErrorInPage = ({ error, retry }: LoadOptions) => (
    <div style={loadingStyle}>
        Some problem occured.
        <DangerButton
            onClick={retry}
            transparent
        >
            Reload
        </DangerButton>
    </div>
);

interface LoadOptions {
    error: string;
    retry: () => void;
}

const LoadingPage = ({ error, retry }: LoadOptions) => {
    if (error) {
        // NOTE: show error while loading page
        console.error(error);
        return (
            <RetryableErrorInPage
                error={error}
                retry={retry}
            />
        );
    }
    return (
        <Loading
            text="Loading Page"
            pending
        />
    );
};

const routes = routeSettings.map(({ load, ...settings }) => {
    const Com = authRoute<typeof settings>()(
        helmetify(
            Loadable({
                loader: load,
                loading: LoadingPage,
            }),
        ),
    );

    const Component = errorBound<typeof settings>(ErrorInPage)(Com);

    return (
        <Component
            key={settings.name}
            {...settings}
        />
    );
});

// MULTIPLEXER

interface State {
}
interface OwnProps {
    pending: boolean;
    hasError: boolean;
    mapStyle: string;
}

interface PropsFromState {
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
}

interface PropsFromState {
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
}

interface PropsFromDispatch {
    setInitialPopupHidden: typeof setInitialPopupHiddenAction;
    setRegion: typeof setRegionAction;
}

interface Coords {
    coords: {
        latitude: number;
        longitude: number;
    };
}

interface OwnProps {}
type Props = OwnProps & PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: AppState): PropsFromState => ({
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setInitialPopupHidden: params => dispatch(setInitialPopupHiddenAction(params)),
    setRegion: params => dispatch(setRegionAction(params)),
});

class Multiplexer extends React.PureComponent<Props, State> {
    private renderRoutes = () => {
        const { pending, hasError } = this.props;
        if (hasError) {
            return (
                <ErrorInPage />
            );
        }
        if (pending) {
            return (
                <Loading
                    text="Loading Resources"
                    pending
                />
            );
        }
        return (
            <Router>
                {routes}
            </Router>
        );
    }

    public render() {
        const {
            mapStyle,
        } = this.props;

        return (
            <div className={styles.multiplexer}>
                <Navbar className={styles.navbar} />
                <div className={_cs(styles.content, 'bipad-main-content')}>
                    <Map
                        mapStyle={mapStyle}
                        fitBoundsDuration={200}
                        minZoom={5}
                        logoPosition="bottom-left"

                        showScaleControl
                        scaleControlPosition="bottom-right"

                        showNavControl
                        navControlPosition="bottom-right"
                    >
                        <MapContainer className={styles.map} />
                        {this.renderRoutes()}
                    </Map>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Multiplexer);
