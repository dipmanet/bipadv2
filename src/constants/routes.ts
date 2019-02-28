// NOTE: use this from react-store
import {
    mapToMap,
    mapToList,
} from '@togglecorp/fujs';

export const ROUTE = {
    exclusivelyPublic: 'exclusively-public',
    public: 'public',
    private: 'private',
};

// Routes

export const routes = {
    dashboard: {
        order: 1,
        type: ROUTE.public,
        path: '/',
        loader: () => import('../views/Dashboard'),
    }, // _ts('pageTitle', 'dashboard');

    riskInfo: {
        order: 2,
        type: ROUTE.public,
        path: '/risk-info/',
        loader: () => import('../views/RiskInfo'),
    }, // _ts('pageTitle', 'riskInfo');

    capacityAndResources: {
        order: 3,
        type: ROUTE.public,
        path: '/capacity-and-resources/',
        loader: () => import('../views/CapacityAndResources'),
    }, // _ts('pageTitle', 'capacityAndResources');

    incidents: {
        order: 4,
        type: ROUTE.public,
        path: '/incidents/',
        loader: () => import('../views/Incidents'),
    }, // _ts('pageTitle', 'incidents');

    response: {
        order: 5,
        type: ROUTE.public,
        path: '/incidents/:incidentId/response',
        loader: () => import('../views/Response'),
    }, // _ts('pageTitle', 'response');

    lossAndDamage: {
        order: 6,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
    }, // _ts('pageTitle', 'incidents');

    drrProfileMapping: {
        order: 7,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
    }, // _ts('pageTitle', 'incidents');

    policyAndPublication: {
        order: 8,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
    }, // _ts('pageTitle', 'incidents');

    aboutUs: {
        order: 9,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
    }, // _ts('pageTitle', 'incidents');

    projectDenied: {
        order: 970,
        type: ROUTE.public,
        path: '/project-denied/',
        loader: () => import('../views/ProjectDenied'),
    }, // _ts('pageTitle', 'projectDenied');

    fourHundredThree: {
        order: 980,
        type: ROUTE.public,
        path: '/403/',
        loader: () => import('../views/FourHundredThree'),
    }, // _ts('pageTitle', 'fourHundredThree');

    fourHundredFour: {
        order: 990,
        type: ROUTE.public,
        path: undefined,
        loader: () => import('../views/FourHundredFour'),
    }, // _ts('pageTitle', 'fourHundredFour');
};

export const pathNames = mapToMap(routes, undefined, route => route.path);
export const routesOrder = mapToList(
    routes,
    (route, key) => ({
        key,
        order: route.order,
    }),
)
    .sort((a, b) => a.order - b.order)
    .map(row => row.key);
