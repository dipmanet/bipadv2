import { authStateSelector } from '#selectors';

export interface Route {
    path: string;
    name: string;
    title: string;
    load: any;
    navbar: boolean;

    disableIfAuth?: boolean;
    disableIfNoAuth?: boolean;
}

export interface NavbarRoute extends Route {
    navbar: true;
    iconName: string;
    disabled?: boolean;
}

export interface FallbackRoute {
    default: true;
    navbar: false;
    title: string;
    name: string;
    load: any;
    path: undefined;

    disableIfAuth?: boolean;
    disableIfNoAuth?: boolean;
}

export type SomeRoute = Route | NavbarRoute | FallbackRoute;

export const routeSettings: SomeRoute[] = [
    {
        name: 'dashboard',
        title: 'Dashboard',
        path: '/',
        load: () => import('../views/Dashboard'),
        navbar: true,
        iconName: 'dashboard',
    },
    {
        name: 'incident',
        title: 'Incident',
        path: '/incidents/',
        load: () => import('../views/Incidents'),
        navbar: true,
        iconName: 'incidents',
    },
    {
        name: 'response',
        title: 'Incident Response',
        path: '/incidents/:incidentId/response/',
        load: () => import('../views/Response'),
        navbar: false,
    },
    {
        name: 'lossAndDamage',
        title: 'Damage & Loss',
        path: '/damage-and-loss/',
        load: () => import('../views/LossAndDamage'),
        navbar: true,
        iconName: 'lossAndDamange',
    },
    {
        name: 'realtime',
        title: 'Realtime',
        path: '/realtime/',
        iconName: 'realtime',
        load: () => import('../views/RealTimeMonitoring'),
        navbar: true,
    },
    {
        name: 'profile',
        title: 'Profile',
        path: '/profile/',
        iconName: 'profile',
        load: () => import('../views/Profile'),
        navbar: true,
    },
    {
        name: 'riskInfo',
        title: 'Risk Info',
        path: '/risk-info/',
        load: () => import('../views/RiskInfo'),
        navbar: true,
        disabled: false,
        iconName: 'riskInfoSvg',
    },
    {
        name: 'palikaReport',
        title: 'Palika Report',
        path: '/palika-report/',
        load: () => import('../views/PalikaReport'),
        navbar: true,
        disabled: false,
        iconName: 'textDocument',
    },
    // {
    //     name: 'subMenu',
    //     title: 'palikaReport subMenu',
    //     path: '/palika-report/:menu/:subMenu/',
    //     load: () => import('../views/PalikaReport'),
    //     navbar: false,

    // },
    {
        name: 'fourHundredThree',
        title: '403',
        path: '/403/',
        load: () => import('../views/FourHundredThree'),
        navbar: false,
    },
    {
        name: 'fourHundredFour',
        title: '404',
        load: () => import('../views/FourHundredFour'),
        default: true,
        path: undefined,
        navbar: false,
    },
    {
        name: 'forgotPassword',
        title: 'New Password',
        load: () => import('../views/ForgotPassword'),
        path: '/set-new-password/',
        navbar: false,
    },
];

export default routeSettings;
