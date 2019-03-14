import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import turf from 'turf';
import {
    Switch,
    Route,
    withRouter,
} from 'react-router-dom';
import memoize from 'memoize-one';
import { mapToMap } from '@togglecorp/fujs';

import Map from '#rscz/Map/index';
import ExclusivelyPublicRoute from '#rscg/ExclusivelyPublicRoute';
import PrivateRoute from '#rscg/PrivateRoute';
import Navbar from '#components/Navbar';
import nepalGeoJson from '#resources/districts.json';

import RouteSynchronizer from '#components/general/RouteSynchronizer';

import {
    pathNames,
    routesOrder,
    routes,
} from '#constants';

import styles from './styles.scss';

const ROUTE = {
    exclusivelyPublic: 'exclusively-public',
    public: 'public',
    private: 'private',
};

const nepalBounds = turf.bbox(nepalGeoJson);

const views = mapToMap(
    routes,
    undefined,
    (route, name) => props => (
        <RouteSynchronizer
            {...props}
            load={route.loader}
            path={route.path}
            name={name}
        />
    ),
);

const loadingStyle = {
    zIndex: '1111',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '3px',
};

const propTypes = {
    pending: PropTypes.bool,
    mapStyle: PropTypes.string,
};

const defaultProps = {
    pending: false,
    mapStyle: undefined,
};

class Multiplexer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getMapRoutes = memoize(ro => ro.map(this.renderRoute))

    renderRoute = memoize((routeId) => {
        const view = views[routeId];
        if (!view) {
            console.error(`Cannot find view associated with routeID: ${routeId}`);
            return null;
        }

        const path = pathNames[routeId];
        const { redirectTo, type } = routes[routeId];
        const authenticated = false;

        switch (type) {
            case ROUTE.exclusivelyPublic:
                return (
                    <ExclusivelyPublicRoute
                        component={view}
                        key={routeId}
                        path={path}
                        exact
                        authenticated={authenticated}
                        redirectLink={redirectTo}
                    />
                );
            case ROUTE.private:
                return (
                    <PrivateRoute
                        component={view}
                        key={routeId}
                        path={path}
                        exact
                        authenticated={authenticated}
                        redirectLink={redirectTo}
                    />
                );
            case ROUTE.public:
                return (
                    <Route
                        component={view}
                        key={routeId}
                        path={path}
                        exact
                    />
                );
            default:
                console.error(`Invalid route type ${type}`);
                return null;
        }
    })

    render() {
        const {
            pending,
            mapStyle,
        } = this.props;

        const mapRoutes = this.getMapRoutes(routesOrder);

        return (
            <Fragment>
                <div className="bipad-main-content">
                    <Map
                        className={styles.map}
                        bounds={nepalBounds}
                        mapStyle={mapStyle}
                        boundsPadding={160}
                        fitBoundsDuration={200}
                        hideNavControl
                        minZoom={3}
                    >
                        { pending ? (
                            <div style={loadingStyle}>
                                Loading Resources...
                            </div>
                        ) : (
                            <Switch>
                                {mapRoutes}
                            </Switch>
                        )}
                    </Map>
                </div>
                <Navbar />
            </Fragment>
        );
    }
}

// NOTE: withRouter is required here so that link change are updated
export default withRouter(Multiplexer);
