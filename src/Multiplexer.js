import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import turf from 'turf';
import {
    Switch,
    Route,
    withRouter,
} from 'react-router-dom';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import Map from '#rscz/Map/index';
import ExclusivelyPublicRoute from '#rscg/ExclusivelyPublicRoute';
import PrivateRoute from '#rscg/PrivateRoute';
import Toast from '#rscv/Toast';
import Navbar from '#components/Navbar';
import nepalGeoJson from '#resources/districts.json';

import RouteSynchronizer from '#components/general/RouteSynchronizer';

import { mapObjectToObject } from '#utils/common';

import {
    pathNames,
    routesOrder,
    routes,
} from '#constants';

import {
    authenticatedSelector,
    lastNotifySelector,
    notifyHideAction,
} from '#redux';
import styles from './styles.scss';

const ROUTE = {
    exclusivelyPublic: 'exclusively-public',
    public: 'public',
    private: 'private',
};

const nepalBounds = turf.bbox(nepalGeoJson);
const views = mapObjectToObject(
    routes,
    (route, name) => props => (
        <RouteSynchronizer
            {...props}
            load={route.loader}
            path={route.path}
            name={name}
        />
    ),
);

const propTypes = {
    authenticated: PropTypes.bool.isRequired,
    lastNotify: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    notifyHide: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    authenticated: authenticatedSelector(state),
    lastNotify: lastNotifySelector(state),
});

const mapDispatchToProps = dispatch => ({
    notifyHide: params => dispatch(notifyHideAction(params)),
});

// NOTE: withRouter is required here so that link change are updated
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Multiplexer extends React.PureComponent {
    static propTypes = propTypes;

    getMapRoutes = memoize(ro => ro.map(this.renderRoute))

    handleToastClose = () => {
        const { notifyHide } = this.props;
        notifyHide();
    }

    renderRoute = memoize((routeId) => {
        const view = views[routeId];
        if (!view) {
            console.error(`Cannot find view associated with routeID: ${routeId}`);
            return null;
        }

        const path = pathNames[routeId];
        const { redirectTo, type } = routes[routeId];
        const { authenticated } = this.props;

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
            lastNotify,
        } = this.props;

        const mapRoutes = this.getMapRoutes(routesOrder);

        return (
            <Fragment>
                <Toast
                    notification={lastNotify}
                    onClose={this.handleToastClose}
                />
                <div className="deep-main-content">
                    <Map
                        className={styles.map}
                        bounds={nepalBounds}
                        boundsPadding={160}
                        fitBoundsDuration={200}
                        hideNavControl
                    >
                        <Switch>
                            {mapRoutes}
                        </Switch>
                    </Map>
                </div>
                <Navbar />
            </Fragment>
        );
    }
}
