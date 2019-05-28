import Loadable from 'react-loadable';
import React, { Fragment } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Router } from '@reach/router';

import Map from '#rscz/Map/index';
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
    hidePopupSelector,
} from '#selectors';
import {
    setInitialPopupHiddenAction,
    setRegionAction,
} from '#actionCreators';

import FirstPopup from './FirstPopup';
import errorBound from './errorBound';
import helmetify from './helmetify';

import styles from './styles.scss';

// LOADING
const loadingStyle: React.CSSProperties = {
    zIndex: 1111,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: '300px',
    // height: '60px',
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
// ROUTES

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
    const Component = errorBound<typeof settings>(ErrorInPage)(
        helmetify(
            Loadable({
                loader: load,
                loading: LoadingPage,
            }),
        ),
    );

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
    hidePopup: boolean;
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
    hidePopup: hidePopupSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setInitialPopupHidden: params => dispatch(setInitialPopupHiddenAction(params)),
    setRegion: params => dispatch(setRegionAction(params)),
});

class Multiplexer extends React.PureComponent<Props, State> {
    /*
    public componentDidMount() {
        if (navigator.geolocation && !this.props.hidePopup) {
            navigator.geolocation.getCurrentPosition(this.handleSuccess);
        }
    }
    */

    private handleSuccess = (position: unknown) => {
        console.warn(position);
    }

    private renderRoutes = () => {
        const { pending } = this.props;
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
            districts,
            provinces,
            municipalities,
            hidePopup,
            setInitialPopupHidden,
            setRegion,
            pending,
        } = this.props;

        return (
            <Fragment>
                {/* FIXME: get route key for navbar */}
                <div className="bipad-main-content">
                    { !hidePopup && !pending &&
                        <FirstPopup
                            districts={districts}
                            provinces={provinces}
                            municipalities={municipalities}
                            setInitialPopupHidden={setInitialPopupHidden}
                            setRegion={setRegion}
                        />
                    }
                    <Map
                        className={styles.map}
                        mapStyle={mapStyle}
                        fitBoundsDuration={200}
                        minZoom={5}
                        logoPosition="bottom-left"

                        showScaleControl
                        scaleControlPosition="bottom-right"

                        showNavControl
                        navControlPosition="bottom-right"
                    >
                        {this.renderRoutes()}
                    </Map>
                </div>
                <Navbar />
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Multiplexer);
