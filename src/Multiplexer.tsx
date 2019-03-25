import Loadable from 'react-loadable';
import React, { Fragment } from 'react';
import { Router } from '@reach/router';

import Map from '#rscz/Map/index';

import Navbar from '#components/Navbar';
import { routeSettings } from '#constants';

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

interface State {}
interface Props {
    pending: boolean;
    mapStyle: string;
}

export default class Multiplexer extends React.PureComponent<Props, State> {
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
        } = this.props;

        return (
            <Fragment>
                {/* FIXME: get route key for navbar */}
                <div className="bipad-main-content">
                    <Map
                        className={styles.map}
                        mapStyle={mapStyle}
                        boundsPadding={160}
                        fitBoundsDuration={200}
                        hideNavControl
                        hideGeoLocationControl
                        minZoom={3}
                    >
                        {this.renderRoutes()}
                    </Map>
                </div>
                <Navbar />
            </Fragment>
        );
    }
}
