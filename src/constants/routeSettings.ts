/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
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
    {
        name: 'homepage',
        title: 'Homepage',
        path: '/',
        load: () => import('../views/Homepage'),
        navbar: false,
        iconName: 'dashboard',
        id: 'home-page',
    },
    {
        name: 'dashboard',
        title: 'Dashboard',
        path: '/dashboard/',
        load: () => import('../views/Dashboard'),
        navbar: true,
        iconName: 'dashboard',
        id: 'navbar-dashboard',
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
        name: 'admin',
        title: 'Admin',
        path: '/admin/admin',
        load: () => import('../admin/views/Admin'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'bulletin',
        title: 'Bulletin (Nepali)',
        path: '/admin/bulletin/add-new-bulletin-nepali',
        load: () => import('../admin/views/Bulletin'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'bulletin',
        title: 'Bulletin (English)',
        path: '/admin/bulletin/add-new-bulletin-english',
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
        name: 'edit bulletin',
        title: 'Edit Bulletin',
        path: '/admin/bulletin/edit-bulletin/:urlLanguage/:id',
        load: () => import('../admin/views/Bulletin'),
        navbar: false,
        disableIfNoAuth: true,
    },

    {
        name: 'Covid-19',
        title: 'Covid-19 Form',
        path: '/admin/covid-19/add-new-covid-19',
        load: () => import('../admin/views/Covid19'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'Covid-19-data-table',
        title: 'Covid-19 Data Table',
        path: '/admin/covid-19/covid-19-data-table',
        load: () => import('../admin/views/Covid19Table'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'Covid-19',
        title: 'Covid-19 Bulk Upload',
        path: '/admin/covid-19/covid-19-bulk-upload',
        load: () => import('../admin/views/Covid19BulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'epidemics',
        title: 'Epidemics Form',
        path: '/admin/epidemics/add-new-epidemics',
        load: () => import('../admin/views/Epidemics'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'incident',
        title: 'Incident Form',
        path: '/admin/incident/add-new-incident',
        load: () => import('../admin/views/Incidents'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'incident-upload',
        title: 'Incident Bulk Upload',
        path: '/admin/incident/incident-bulk-upload',
        load: () => import('../admin/views/IncidentBulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'epidemics-data-table',
        title: 'Epidemics Data Table',
        path: '/admin/epidemics/epidemics-data-table',
        load: () => import('../admin/views/EpidemicsTable'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'epidemics-upload',
        title: 'Epidemics Bulk Upload',
        path: '/admin/epidemics/epidemics-bulk-upload',
        load: () => import('../admin/views/EpidemicBulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'healthinfrastructure',
        title: 'Health Infrastructure Form',
        path: '/admin/health-infrastructure/add-new-health-infrastructure',
        load: () => import('../admin/views/HealthDataStr'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'healthinfrastructure-data-table',
        title: 'Health Infrastructure Data Table',
        path: '/admin/health-infrastructure/health-infrastructure-data-table',
        load: () => import('../admin/views/HealthDataTable'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'healthinfrastructure-upload',
        title: 'Health Infrastructure Bulk Upload',
        path: '/admin/health-infrastructure/health-infrastructure-bulk-upload',
        load: () => import('../admin/views/HealthBulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
    },
    {
        name: 'overview',
        title: 'Overview',
        path: '/admin/overview',
        load: () => import('../admin/views/Overview'),
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
        id: 'navbar-incident',
    },
    {
        name: 'incident-data-table',
        title: 'Incident Data Table',
        path: '/admin/incident/incident-data-table',
        load: () => import('../admin/views/IncidentDatatable'),
        navbar: false,
        disableIfNoAuth: true,
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
        navbar: true,
        id: 'navbar-realtime',
    },
    {
        name: 'dataArchive',
        title: 'Data Archive',
        path: '/data-archive/',
        iconName: 'clipboard',
        load: () => import('../views/DataArchive'),
        navbar: true,
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
    {
        name: 'about',
        title: 'About',
        path: '/about/',
        load: () => import('../components/WalkthroughModal/Slide1/About'),
        navbar: false,
        disabled: false,
        iconName: 'eye',
    },
    {
        name: 'developers',
        title: 'Developers',
        path: '/developers/',
        load: () => import('../components/WalkthroughModal/Slide1/Developer'),
        navbar: false,
        disabled: false,
        iconName: 'eye',
    },
    // {
    //     name: 'technicalsupport',
    //     title: 'Technical Support',
    //     path: '/technical-support/',
    //     load: () => import('../components/WalkthroughModal/Slide1/TechnicalSupport'),
    //     navbar: false,
    //     disabled: false,
    //     iconName: 'eye',
    // },
    {
        name: 'manuals',
        title: 'Manuals',
        path: '/manuals/',
        load: () => import('../components/WalkthroughModal/Slide1/Manuals'),
        navbar: false,
        disabled: false,
        iconName: 'eye',
    },
    {
        name: 'faqs',
        title: 'Faqs',
        path: '/faqs/',
        load: () => import('../components/WalkthroughModal/Slide1/Faqs'),
        navbar: false,
        disabled: false,
        iconName: 'eye',
    },
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
