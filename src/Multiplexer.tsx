import Loadable from 'react-loadable';
import React, { Fragment } from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { Router } from '@reach/router';

import Map from '#rscz/Map/index';
import { District, Province, Municipality } from '#store/atom/page/types';

import Navbar from '#components/Navbar';
import { routeSettings } from '#constants';
import { AppState } from '#store/types';

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    initialPopupShownSelector,
} from '#selectors';
import {
    setInitialPopupShownAction,
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
    width: '200px',
    height: '60px',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '3px',
};

const LoadingResources = () => (
    <div style={loadingStyle}>
        Loading Resources...
    </div>
);
const LoadingPage = () => (
    <div style={loadingStyle}>
        Loading Page...
    </div>
);
const ErrorInPage = () => (
    <div style={loadingStyle}>
        Some problem occured.
    </div>
);

// ROUTES

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
    showHintAndError: boolean;
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
    initialPopupShown: boolean;
}

interface PropsFromDispatch {
    setInitialPopupShown: typeof setInitialPopupShownAction;
}

const geolocationControlOptions = {
    showUserLocation: false,
    trackUserLocation: false,
};

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
    initialPopupShown: initialPopupShownSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setInitialPopupShown: params => dispatch(setInitialPopupShownAction(params)),
});

class Multiplexer extends React.PureComponent<Props, State> {
    private handleGeolocationChange = (e: Coords) => {
        console.warn('Getting user location info from:', [e.coords.longitude, e.coords.latitude]);
    }

    private renderRoutes = () => {
        const { pending } = this.props;
        if (pending) {
            return (<LoadingResources />);
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
            initialPopupShown,
            setInitialPopupShown,
        } = this.props;

        return (
            <Fragment>
                {/* FIXME: get route key for navbar */}
                <div className="bipad-main-content">
                    { initialPopupShown &&
                        <FirstPopup
                            districts={districts}
                            provinces={provinces}
                            municipalities={municipalities}
                            setInitialPopupShown={setInitialPopupShown}
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

                        showGeolocationControl={initialPopupShown}
                        locateOnStartup={initialPopupShown}
                        geoControlPosition="bottom-right"
                        geoOptions={geolocationControlOptions}
                        onGeolocationChange={this.handleGeolocationChange}

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
