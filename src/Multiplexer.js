import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import {
    Switch,
    Route,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';

import ExclusivelyPublicRoute from '#rscg/ExclusivelyPublicRoute';
import PrivateRoute from '#rscg/PrivateRoute';
import Toast from '#rscv/Toast';
import Navbar from '#components/Navbar';

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

const ROUTE = {
    exclusivelyPublic: 'exclusively-public',
    public: 'public',
    private: 'private',
};

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

    handleToastClose = () => {
        const { notifyHide } = this.props;
        notifyHide();
    }

    renderRoute = (routeId) => {
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
    }

    render() {
        const {
            lastNotify,
        } = this.props;

        return (
            <Fragment>
                <Toast
                    notification={lastNotify}
                    onClose={this.handleToastClose}
                />
                <Navbar />
                <div className="deep-main-content">
                    <Switch>
                        { routesOrder.map(this.renderRoute) }
                    </Switch>
                </div>
            </Fragment>
        );
    }
}
