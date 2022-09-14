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
        path: '/',
        load: () => import('../views/Dashboard'),
        navbar: true,
        iconName: 'dashboard',
        id: 'navbar-dashboard',
    },

    {
        name: 'incident',
        title: 'Incident',
        path: '/incidents/',
        load: () => import('../views/Incidents'),
        navbar: true,
        iconName: 'incidents',
        id: 'navbar-incident',
    },
    {
        name: 'response',
        title: 'Incident Response',
        path: '/incidents/:incidentId/response/',
        load: () => import('../views/Response'),
        navbar: false,
        id: 'navbar-response',
    },
    {
        name: 'lossAndDamage',
        title: 'Damage & Loss',
        path: '/damage-and-loss/',
        load: () => import('../views/LossAndDamage'),
        navbar: true,
        iconName: 'lossAndDamange',
        id: 'navbar-lossDamage',
    },
    {
        name: 'realtime',
        title: 'Realtime',
        path: '/realtime/',
        iconName: 'realtime',
        load: () => import('../views/RealTimeMonitoring'),
        navbar: false,
        id: 'navbar-realtime',
    },
    {
        name: 'dataArchive',
        title: 'Data Archive',
        path: '/data-archive/',
        iconName: 'clipboard',
        load: () => import('../views/DataArchive'),
        navbar: false,
    },
    {
        name: 'profile',
        title: 'Profile',
        path: '/profile/',
        iconName: 'profile',
        load: () => import('../views/Profile'),
        navbar: true,
        id: 'navbar-profile',
    },
    {
        name: 'riskInfo',
        title: 'Risk Info',
        path: '/risk-info/',
        load: () => import('../views/RiskInfo'),
        navbar: true,
        disabled: false,
        iconName: 'riskInfoSvg',
        id: 'navbar-riskinfo',
    },
    // {
    //     name: 'vizrisk',
    //     title: 'Viz Risk',
    //     path: '/viz-risk/',
    //     load: () => import('../views/VizRisk'),
    //     navbar: true,
    //     disabled: false,
    //     iconName: 'eye',
    // },
    // {
    //     name: 'about',
    //     title: 'About',
    //     path: '/about/',
    //     load: () => import('../components/WalkthroughModal/Slide1/About'),
    //     navbar: false,
    //     disabled: false,
    //     iconName: 'eye',
    // },
    // {
    //     name: 'developers',
    //     title: 'Developers',
    //     path: '/developers/',
    //     load: () => import('../components/WalkthroughModal/Slide1/Developer'),
    //     navbar: false,
    //     disabled: false,
    //     iconName: 'eye',
    // },
    // {
    //     name: 'technicalsupport',
    //     title: 'Technical Support',
    //     path: '/technical-support/',
    //     load: () => import('../components/WalkthroughModal/Slide1/TechnicalSupport'),
    //     navbar: false,
    //     disabled: false,
    //     iconName: 'eye',
    // },
    // {
    //     name: 'manuals',
    //     title: 'Manuals',
    //     path: '/manuals/',
    //     load: () => import('../components/WalkthroughModal/Slide1/Manuals'),
    //     navbar: false,
    //     disabled: false,
    //     iconName: 'eye',
    // },
    // {
    //     name: 'faqs',
    //     title: 'Faqs',
    //     path: '/faqs/',
    //     load: () => import('../components/WalkthroughModal/Slide1/Faqs'),
    //     navbar: false,
    //     disabled: false,
    //     iconName: 'eye',
    // },
    // {
    //     name: 'feedbackAndSupport',
    //     title: 'Feedback & Support',
    //     path: '/feedback-support/',
    //     load: () => import('../views/FeedbackSupport'),
    //     navbar: true,
    //     disabled: false,
    //     iconName: 'chatBoxes',
    // },
    {
        name: 'fourHundredThree',
        title: '403',
        path: '/403/',
        load: () => import('../views/FourHundredThree'),
        navbar: false,
        id: 'navbar-fourHundredThree',
    },
    {
        name: 'fourHundredFour',
        title: '404',
        load: () => import('../views/FourHundredFour'),
        default: true,
        path: undefined,
        navbar: false,
        id: 'navbar-fourHundredFour',
    },

    {
        name: 'forgotPassword',
        title: 'New Password',
        load: () => import('../views/ForgotPassword'),
        path: '/set-new-password/',
        navbar: false,
        id: 'navbar-forgetpassword',
    },
];

export default routeSettings;
