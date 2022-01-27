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

const routeSettings: SomeRoute[] = [
    {
        name: 'dashboard',
        title: 'Dashboard',
        path: '/',
        load: () => import('../views/Dashboard'),
        navbar: true,
        iconName: 'dashboard',
    },
    {
        name: 'login',
        title: 'Login',
        path: '/login',
        load: () => import('../admin/views/Login'),
        navbar: false,
        // iconName: 'dashboard',
    },

    {
        name: 'admin',
        title: 'Admin',
        path: '/admin',
        load: () => import('../admin/views/Landing'),
        navbar: false,
        disableIfNoAuth: true,
    },

    {
        name: 'bulletin',
        title: 'Bulletin',
        path: '/admin/bulletin/add-new-bulletin',
        load: () => import('../admin/views/Bulletin'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'bulletin',
        title: 'Bulletin',
        path: '/admin/bulletin/bulletin-data-table',
        load: () => import('../admin/views/BulletinTable'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'Covid-19',
        title: 'Covid-19',
        path: '/admin/covid19-form',
        load: () => import('../admin/views/Covid-19'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'epidemics',
        title: 'Epidemics',
        path: '/admin/epidemics/add-new-epidemics',
        load: () => import('../admin/views/Epidemics'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'epidemics-table',
        title: 'Epidemics Table',
        path: '/admin/epidemics/epidemics-data-table',
        load: () => import('../admin/views/EpidemicsTable'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'epidemics-upload',
        title: 'Epidemics Table',
        path: '/admin/epidemics/epidemics-bulk-upload',
        load: () => import('../admin/views/EpidemicBulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'healthinfrastructure',
        title: 'Health Infrastructure',
        path: '/admin/health-form',
        load: () => import('../admin/views/HealthDataStr'),
        navbar: false,
        disableIfNoAuth: true,
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
