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
    },

    riskInfo: {
        order: 2,
        type: ROUTE.public,
        path: '/risk-info/',
        loader: () => import('../views/RiskInfo'),
    },

    capacityAndResources: {
        order: 3,
        type: ROUTE.public,
        path: '/capacity-and-resources/',
        loader: () => import('../views/CapacityAndResources'),
    },

    incidents: {
        order: 4,
        type: ROUTE.public,
        path: '/incidents/',
        loader: () => import('../views/Incidents'),
    },

    response: {
        order: 5,
        type: ROUTE.public,
        path: '/incidents/:incidentId/response',
        loader: () => import('../views/Response'),
    },

    lossAndDamage: {
        order: 6,
        type: ROUTE.public,
        path: '/loss-and-damage',
        loader: () => import('../views/LossAndDamage'),
    },

    drrProfileMapping: {
        order: 7,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
    },

    policyAndPublication: {
        order: 8,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
    },

    aboutUs: {
        order: 9,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
    },

    fourHundredThree: {
        order: 980,
        type: ROUTE.public,
        path: '/403/',
        loader: () => import('../views/FourHundredThree'),
    },

    fourHundredFour: {
        order: 990,
        type: ROUTE.public,
        path: undefined,
        loader: () => import('../views/FourHundredFour'),
    },
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
