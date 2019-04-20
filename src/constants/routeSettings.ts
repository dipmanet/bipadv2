import iconNames from './iconNames';

export interface Route {
    path: string;
    name: string;
    title: string;
    load: any;
}
export interface NavbarRoute extends Route {
    navbar: true;
    iconName: string;
    disabled?: boolean;
}
export interface FallbackRoute {
    default: true;
    title: string;
    name: string;
    load: any;
    path: undefined;
}

export type SomeRoute = Route | NavbarRoute | FallbackRoute;

const routeSettings: SomeRoute[] = [
    {
        path: '/',
        name: 'dashboard',
        title: 'Dashboard',
        load: () => import('../views/Dashboard'),
        navbar: true,
        iconName: iconNames.dashboard,
    },
    {
        name: 'incident',
        title: 'Incident',
        path: '/incidents/',
        load: () => import('../views/Incidents'),
        navbar: true,
        iconName: iconNames.incidents,
    },
    {
        name: 'response',
        title: 'Incident Response',
        path: '/incidents/:incidentId/response/',
        load: () => import('../views/Response'),
    },
    {
        name: 'lossAndDamage',
        title: 'Loss & Damage',
        path: '/loss-and-damage/',
        load: () => import('../views/LossAndDamage'),
        navbar: true,
        iconName: iconNames.lossAndDamange,
    },
    {
        name: 'realtime',
        title: 'Realtime',
        path: '/realtime/',
        iconName: iconNames.realtime,
        load: () => import('../views/RealTimeMonitoring'),
        navbar: true,
    },
    {
        name: 'indicators',
        title: 'Indicators',
        path: '/indicators/',
        iconName: iconNames.indicator,
        load: () => import('../views/Indicator'),
        navbar: true,
    },
    {
        name: 'projectProfile',
        title: 'Projects Profile',
        path: 'drr-project-profile/',
        iconName: iconNames.drrProjectsProfile,
        load: () => import('../views/ProjectsProfile'),
        navbar: true,
    },
    {
        name: 'disasterProfile',
        title: 'Disaster Profile',
        path: 'disaster-profile/',
        iconName: iconNames.disasterProfile,
        load: () => import('../views/DisasterProfile'),
        navbar: true,
    },
    {
        name: 'riskInfo',
        title: 'Risk Information',
        path: '/risk-info/',
        load: () => import('../views/RiskInfo'),
        navbar: true,
        disabled: false,
        iconName: iconNames.riskMap,
    },
    {
        name: 'aboutUs',
        title: 'About Us',
        path: '/about-us/',
        iconName: iconNames.aboutUs,
        load: () => import('../views/AboutUs'),
        navbar: true,
    },
    {
        name: 'fourHundredThree',
        title: '403',
        path: '/403/',
        load: () => import('../views/FourHundredThree'),
    },

    {
        name: 'fourHundredFour',
        title: '404',
        load: () => import('../views/FourHundredFour'),
        default: true,
        path: undefined,
    },
];

export default routeSettings;
