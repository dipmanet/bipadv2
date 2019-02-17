// NOTE: use this from react-store
import {
    mapObjectToObject,
    mapObjectToArray,
} from '#utils/common';

import {
    allLinks,
    // noLinks,
} from './linksAcl';

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
        links: allLinks,
    }, // _ts('pageTitle', 'dashboard');

    riskInfo: {
        order: 2,
        type: ROUTE.public,
        path: '/risk-info/',
        loader: () => import('../views/RiskInfo'),
        links: allLinks,
    }, // _ts('pageTitle', 'riskInfo');

    capacityAndResources: {
        order: 3,
        type: ROUTE.public,
        path: '/capacity-and-resources/',
        loader: () => import('../views/CapacityAndResources'),
        links: allLinks,
    }, // _ts('pageTitle', 'capacityAndResources');

    incidents: {
        order: 4,
        type: ROUTE.public,
        path: '/incidents/',
        loader: () => import('../views/Incidents'),
        links: allLinks,
    }, // _ts('pageTitle', 'incidents');

    lossAndDamage: {
        order: 4,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
        links: allLinks,
    }, // _ts('pageTitle', 'incidents');

    drrProfileMapping: {
        order: 4,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
        links: allLinks,
    }, // _ts('pageTitle', 'incidents');

    policyAndPublication: {
        order: 4,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
        links: allLinks,
    }, // _ts('pageTitle', 'incidents');

    aboutUs: {
        order: 4,
        type: ROUTE.public,
        path: '/incidents',
        loader: () => import('../views/Incidents'),
        links: allLinks,
    }, // _ts('pageTitle', 'incidents');

    projectDenied: {
        order: 970,
        type: ROUTE.public,
        path: '/project-denied/',
        loader: () => import('../views/ProjectDenied'),
        hideNavbar: false,
        links: allLinks,
    }, // _ts('pageTitle', 'projectDenied');

    fourHundredThree: {
        order: 980,
        type: ROUTE.public,
        path: '/403/',
        loader: () => import('../views/FourHundredThree'),
        hideNavbar: false,
        links: allLinks,
    }, // _ts('pageTitle', 'fourHundredThree');

    fourHundredFour: {
        order: 990,
        type: ROUTE.public,
        path: undefined,
        loader: () => import('../views/FourHundredFour'),
        hideNavbar: true,
        links: allLinks,
    }, // _ts('pageTitle', 'fourHundredFour');
};

export const pathNames = mapObjectToObject(routes, route => route.path);
export const validLinks = mapObjectToObject(routes, route => route.links);
export const hideNavbar = mapObjectToObject(routes, route => !!route.hideNavbar);
export const routesOrder = mapObjectToArray(
    routes,
    (route, key) => ({
        key,
        order: route.order,
    }),
)
    .sort((a, b) => a.order - b.order)
    .map(row => row.key);
