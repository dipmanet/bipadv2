export interface Route {
    path: string;
    name: string;
    title: string;
    load: any;
    navbar: boolean;
    id: string;
    disableIfAuth?: boolean;
    disableIfNoAuth?: boolean;
}

export interface NavbarRoute extends Route {
    navbar: true;
    iconName: string;
    disabled?: boolean;
    id: string;
}

export interface FallbackRoute {
    default: true;
    navbar: false;
    title: string;
    titleNep: string;
    name: string;
    load: any;
    path: undefined;
    id: string;
    disableIfAuth?: boolean;
    disableIfNoAuth?: boolean;
}

export type SomeRoute = Route | NavbarRoute | FallbackRoute;

const routeSettings: SomeRoute[] = [
    // {
    //     name: 'homepage',
    //     title: 'Homepage',
    //     path: '/',
    //     load: () => import('../views/Homepage'),
    //     navbar: false,
    //     iconName: 'dashboard',
    //     id: 'home-page',
    // },
    {
        name: 'dashboard',
        title: 'Dashboard',
        titleNep: 'ड्यासबोर्ड',
        path: '/',
        load: () => import('../views/Dashboard'),
        navbar: true,
        iconName: 'dashboard',
        id: 'navbar-dashboard',
    },

    {
        name: 'incident',
        title: 'Incident',
        titleNep: 'घटना',
        path: '/incidents/',
        load: () => import('../views/Incidents'),
        navbar: true,
        iconName: 'incidents',
        id: 'navbar-incident',
    },
    {
        name: 'response',
        title: 'Incident Response',
        titleNep: 'घटना रिपोर्ट',
        path: '/incidents/:incidentId/response/',
        load: () => import('../views/Response'),
        navbar: false,
        id: 'navbar-response',
    },
    {
        name: 'lossAndDamage',
        title: 'Damage & Loss',
        titleNep: 'क्षति र नोक्सान',
        path: '/damage-and-loss/',
        load: () => import('../views/LossAndDamage'),
        navbar: true,
        iconName: 'lossAndDamange',
        id: 'navbar-lossDamage',
    },
    {
        name: 'realtime',
        title: 'Realtime',
        titleNep: 'वास्तविक समय',
        path: '/realtime/',
        iconName: 'realtime',
        load: () => import('../views/RealTimeMonitoring'),
        navbar: true,
        id: 'navbar-realtime',
    },
    {
        name: 'dataArchive',
        title: 'Data Archive',
        titleNep: 'डाटा संग्रह',
        path: '/data-archive/',
        iconName: 'clipboard',
        load: () => import('../views/DataArchive'),
        navbar: false,
    },
    {
        name: 'profile',
        title: 'Profile',
        titleNep: 'प्रोफाइल',
        path: '/profile/',
        iconName: 'profile',
        load: () => import('../views/Profile'),
        navbar: true,
        id: 'navbar-profile',
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
        id: 'navbar-riskinfo',
    },
    {
        name: 'feedbackAndSupport',
        title: 'Feedback & Support',
        titleNep: 'Feedback & Support',
        path: '/feedback-support/',
        load: () => import('../views/FeedbackSupport'),
        navbar: true,
        disabled: false,
        iconName: 'chatBoxes',
    },
    {
        name: 'fourHundredThree',
        title: '403',
        titleNep: '',
        path: '/403/',
        load: () => import('../views/FourHundredThree'),
        navbar: false,
        id: 'navbar-fourHundredThree',
    },
    {
        name: 'fourHundredFour',
        title: '404',
        titleNep: '',
        load: () => import('../views/FourHundredFour'),
        default: true,
        path: undefined,
        navbar: false,
        id: 'navbar-fourHundredFour',
    },

    {
        name: 'forgotPassword',
        title: 'New Password',
        titleNep: '',
        load: () => import('../views/ForgotPassword'),
        path: '/set-new-password/',
        navbar: false,
        id: 'navbar-forgetpassword',
    },
];

export default routeSettings;
