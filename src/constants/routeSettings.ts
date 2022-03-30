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
    titleNep: string;
    name: string;
    load: any;
    path: undefined;

    disableIfAuth?: boolean;
    disableIfNoAuth?: boolean;
}

export type SomeRoute = Route | NavbarRoute | FallbackRoute;

const routeSettings: SomeRoute[] = [
    {
        name: 'dashboard',
        title: 'Dashboard',
        titleNep: 'ड्यासबोर्ड',
        path: '/',
        load: () => import('../views/Dashboard'),
        navbar: true,
        iconName: 'dashboard',
    },

    {
        name: 'incident',
        title: 'Incident',
        titleNep: 'घटना',
        path: '/incidents/',
        load: () => import('../views/Incidents'),
        navbar: true,
        iconName: 'incidents',
    },
    {
        name: 'response',
        title: 'Incident Response',
        titleNep: 'घटना रिपोर्ट',
        path: '/incidents/:incidentId/response/',
        load: () => import('../views/Response'),
        navbar: false,
    },
    {
        name: 'lossAndDamage',
        title: 'Damage & Loss',
        titleNep: 'क्षति र हानि',
        path: '/damage-and-loss/',
        load: () => import('../views/LossAndDamage'),
        navbar: true,
        iconName: 'lossAndDamange',
    },
    {
        name: 'realtime',
        title: 'Realtime',
        titleNep: 'वास्तविक समय',
        path: '/realtime/',
        iconName: 'realtime',
        load: () => import('../views/RealTimeMonitoring'),
        navbar: true,
    },
    {
        name: 'profile',
        title: 'Profile',
        titleNep: 'प्रोफाइल',
        path: '/profile/',
        iconName: 'profile',
        load: () => import('../views/Profile'),
        navbar: true,
    },
    {
        name: 'riskInfo',
        title: 'Risk Info',
        titleNep: 'जोखिम जानकारी',
        path: '/risk-info/',
        load: () => import('../views/RiskInfo'),
        navbar: true,
        disabled: false,
        iconName: 'riskInfoSvg',
    },
    {
        name: 'fourHundredThree',
        title: '403',
        titleNep: '',
        path: '/403/',
        load: () => import('../views/FourHundredThree'),
        navbar: false,
    },
    {
        name: 'fourHundredFour',
        title: '404',
        titleNep: '',
        load: () => import('../views/FourHundredFour'),
        default: true,
        path: undefined,
        navbar: false,
    },
    {
        name: 'forgotPassword',
        title: 'New Password',
        titleNep: '',
        load: () => import('../views/ForgotPassword'),
        path: '/set-new-password/',
        navbar: false,
    },
];

export default routeSettings;
