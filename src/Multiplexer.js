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
    createConnectedRequestCoordinator,
    createRequestClient,
} from '#request';

import {
    authenticatedSelector,
    lastNotifySelector,
    mapStyleSelector,
    notifyHideAction,
    setProvincesAction,
    setDistrictsAction,
    setMunicipalitiesAction,
    setWardsAction,
    setHazardTypesAction,
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
    mapStyle: PropTypes.string,
    notifyHide: PropTypes.func.isRequired,
    requests: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    mapStyle: undefined,
};

class Multiplexer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

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
            mapStyle,
            requests: {
                provinceListRequest: { pending: provincePending },
                districtListRequest: { pending: districtPending },
                municipalityListRequest: { pending: municipalityPending },
                wardListRequest: { pending: wardListPending },
                hazardTypesRequest: { pending: hazardTypePending },
            },
        } = this.props;

        const mapRoutes = this.getMapRoutes(routesOrder);

        const pending = (
            provincePending ||
            districtPending ||
            municipalityPending ||
            wardListPending ||
            hazardTypePending
        );

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
                        mapStyle={mapStyle}
                    >
                        { pending ? (
                            <div
                                style={{
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
                                }}
                            >
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

const mapStateToProps = state => ({
    mapStyle: mapStyleSelector(state),
    authenticated: authenticatedSelector(state),
    lastNotify: lastNotifySelector(state),
});

const mapDispatchToProps = dispatch => ({
    notifyHide: params => dispatch(notifyHideAction(params)),
    setProvinces: params => dispatch(setProvincesAction(params)),
    setDistricts: params => dispatch(setDistrictsAction(params)),
    setMunicipalities: params => dispatch(setMunicipalitiesAction(params)),
    setWards: params => dispatch(setWardsAction(params)),
    setHazardTypes: params => dispatch(setHazardTypesAction(params)),
});

const requests = {
    provinceListRequest: {
        url: '/province/',
        onSuccess: ({ response, props: { setProvinces } }) => {
            const { results: provinces = [] } = response;
            setProvinces({ provinces });
        },
        extras: {
            schemaName: 'provinceResponse',
        },
        onMount: true,
    },
    districtListRequest: {
        url: '/district/',
        onSuccess: ({ response, props: { setDistricts } }) => {
            const { results: districts = [] } = response;
            setDistricts({ districts });
        },
        extras: {
            schemaName: 'districtResponse',
        },
        onMount: true,
    },
    municipalityListRequest: {
        url: '/municipality/',
        onSuccess: ({ response, props: { setMunicipalities } }) => {
            const { results: municipalities = [] } = response;
            setMunicipalities({ municipalities });
        },
        extras: {
            schemaName: 'municipalityResponse',
        },
        onMount: true,
    },
    wardListRequest: {
        url: '/ward/',
        onSuccess: ({ response, props: { setWards } }) => {
            const { results: wards = [] } = response;
            setWards({ wards });
        },
        extras: {
            schemaName: 'wardResponse',
        },
        onMount: true,
    },
    hazardTypesRequest: {
        url: '/hazard/',
        onSuccess: ({ response, props: { setHazardTypes } }) => {
            const { results: hazardTypes = [] } = response;
            setHazardTypes({ hazardTypes });
        },
        onMount: true,
    },
};

// NOTE: withRouter is required here so that link change are updated
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        createConnectedRequestCoordinator()(
            createRequestClient(requests)(Multiplexer),
        ),
    ),
);
