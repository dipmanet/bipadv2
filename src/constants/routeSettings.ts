/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import { authStateSelector } from '#selectors';

export interface Route {
    path: string;
    name: string;
    title: string;
    titleNep: string;
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
    //     titleNep: 'गृहपृष्‍ठ',
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
        name: 'admin',
        title: 'Admin',
        titleNep: 'प्रशासक',
        path: '/admin',
        load: () => import('../admin/views/Landing'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'admin',
    },

    {
        name: 'admin',
        title: 'Admin',
        titleNep: 'प्रशासक',
        path: '/admin/admin',
        load: () => import('../admin/views/Admin'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'admin-admin',
    },

    {
        name: 'bulletin',
        title: 'Bulletin (Nepali)',
        titleNep: 'बुलेटिन (नेपाली)',
        path: '/admin/bulletin/add-new-bulletin-nepali',
        load: () => import('../admin/views/Bulletin'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'bulletin-ne',
    },

    {
        name: 'bulletin',
        title: 'Bulletin (English)',
        titleNep: 'बुलेटिन (अंग्रेजी)',
        path: '/admin/bulletin/add-new-bulletin-english',
        load: () => import('../admin/views/Bulletin'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'bulletin-en',
    },

    {
        name: 'bulletin',
        title: 'Bulletin',
        titleNep: 'बुलेटिन',
        path: '/admin/bulletin/bulletin-data-table',
        load: () => import('../admin/views/BulletinTable'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'bulletin-table',
    },

    {
        name: 'edit bulletin',
        title: 'Edit Bulletin',
        titleNep: 'बुलेटिन सम्पादन गर्नुहोस्',
        path: '/admin/bulletin/edit-bulletin/:urlLanguage/:id',
        load: () => import('../admin/views/Bulletin'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'edit-bulletin',
    },


    {
        name: 'Covid-19',
        title: 'Covid-19 Form',
        titleNep: 'कोभिड-१९ फारम',
        path: '/admin/covid-19/add-new-covid-19',
        load: () => import('../admin/views/Covid19'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'covid',
    },

    {
        name: 'Covid-19-data-table',
        title: 'Covid-19 Data Table',
        titleNep: 'कोभिड-१९ डाटा तालिका',
        path: '/admin/covid-19/covid-19-data-table',
        load: () => import('../admin/views/Covid19Table'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'covid-table',
    },


    {
        name: 'Covid-19',
        title: 'Covid-19 Bulk Upload',
        titleNep: 'कोभिड-१९ बल्क अपलोड',
        path: '/admin/covid-19/covid-19-bulk-upload',
        load: () => import('../admin/views/Covid19BulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'covid-bulk-upload',
    },


    {
        name: 'epidemics',
        title: 'Epidemics Form',
        titleNep: 'महामारी फारम',
        path: '/admin/epidemics/add-new-epidemics',
        load: () => import('../admin/views/Epidemics'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'epidemics',
    },

    {
        name: 'incident',
        title: 'Incident Form',
        titleNep: 'Incident Form',
        path: '/admin/incident/add-new-incident',
        load: () => import('../admin/views/Incidents'),
        navbar: false,
        disableIfNoAuth: true,
        id: '',
    },

    {
        name: 'incident-upload',
        title: 'Incident Bulk Upload',
        titleNep: 'Incident Bulk Upload',
        path: '/admin/incident/incident-bulk-upload',
        load: () => import('../admin/views/IncidentBulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
        id: '',
    },

    {
        name: 'epidemics-data-table',
        title: 'Epidemics Data Table',
        titleNep: 'महामारी डाटा तालिका',
        path: '/admin/epidemics/epidemics-data-table',
        load: () => import('../admin/views/EpidemicsTable'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'epidemics-table',
    },
    {
        name: 'temporary-shelter-enrollment-form-data-table',
        title: 'Temporary shelter enrollment form Data Table',
        titleNep: 'Temporary shelter enrollment form Data Table',
        path: '/admin/temporary-shelter-enrollment-form/temporary-shelter-enrollment-form-data-table',
        load: () => import('../admin/views/TemporaryShelterTable'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'TemporaryShelter-table',
    },
    {
        name: 'add-new-temporary-shelter-enrollment-data',
        title: 'Add New Temporary shelter enrollment data',
        titleNep: 'Add New Temporary shelter enrollment data',
        path: '/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data',
        load: () => import('../admin/views/TemporaryShelter'),
        navbar: false,
        disableIfNoAuth: true,
        id: '',
    },
    {
        name: 'add-new-temporary-shelter-enrollment-data-preview',
        title: 'Add New Temporary shelter enrollment data preview',
        titleNep: 'Add New Temporary shelter enrollment data preview',
        path: '/admin/temporary-shelter-enrollment-form/add-new-temporary-shelter-enrollment-data-preview/:id',
        load: () => import('../admin/views/TemporaryShelterPreview'),
        navbar: false,
        disableIfNoAuth: true,
        id: '',
    },
    {
        name: 'epidemics-upload',
        title: 'Epidemics Bulk Upload',
        titleNep: 'महामारी बल्क अपलोड',
        path: '/admin/epidemics/epidemics-bulk-upload',
        load: () => import('../admin/views/EpidemicBulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'epidemics-upload',
    },

    {
        name: 'healthinfrastructure',
        title: 'Health Infrastructure Form',
        titleNep: 'स्वास्थ्य पूर्वाधार फारम',
        path: '/admin/health-infrastructure/add-new-health-infrastructure',
        load: () => import('../admin/views/HealthDataStr'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'health-infra',
    },

    {
        name: 'healthinfrastructure-data-table',
        title: 'Health Infrastructure Data Table',
        titleNep: 'स्वास्थ्य पूर्वाधार डाटा तालिका',
        path: '/admin/health-infrastructure/health-infrastructure-data-table',
        load: () => import('../admin/views/HealthDataTable'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'health-infra-table',
    },

    {
        name: 'healthinfrastructure-upload',
        title: 'Health Infrastructure Bulk Upload',
        titleNep: 'स्वास्थ्य पूर्वाधार बल्क अपलोड',
        path: '/admin/health-infrastructure/health-infrastructure-bulk-upload',
        load: () => import('../admin/views/HealthBulkUpload'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'health-bulk-upload',
    },

    {
        name: 'demography',
        title: 'Demography',
        titleNep: 'जनसांख्यिकी',
        path: '/profile/demography/',
        load: () => import('../views/Profile/ProfileModules/Demography'),
        navbar: false,
        // iconName: 'lossAndDamange',
        id: 'demography',
    },
    {
        name: 'contacts',
        title: 'Contact',
        titleNep: 'सम्पर्क',
        path: '/profile/contacts/',
        load: () => import('../views/Profile/ProfileModules/Contacts'),
        navbar: false,
        // iconName: 'lossAndDamange',
        id: 'contacts',
    },
    {
        name: 'documents',
        title: 'Documents',
        titleNep: 'कागजातहरू',
        path: '/profile/documents/',
        load: () => import('../views/Profile/ProfileModules/Documents'),
        navbar: false,
        // iconName: 'lossAndDamange',
        id: 'documents',
    },
    {
        name: 'projects',
        title: 'Projects',
        titleNep: 'परियोजनाहरू',
        path: '/profile/projects/',
        load: () => import('../views/Profile/ProfileModules/Projects'),
        navbar: false,
        // iconName: 'lossAndDamange',
        id: 'projects',
    },
    {
        name: 'nepdat-profile',
        title: 'NepDat Profile',
        titleNep: 'नेपडाट प्रोफाइल',
        path: '/profile/nepDat-profile',
        load: () => import('../views/Profile/ProfileModules/NepDatProfile'),
        navbar: false,
        // iconName: 'lossAndDamange',
        id: 'nep-dat',
    },


    {
        name: 'overview',
        title: 'Overview',
        titleNep: 'सिंहावलोकन',
        path: '/admin/overview',
        load: () => import('../admin/views/Overview'),
        navbar: false,
        disableIfNoAuth: true,
        id: 'overview',
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
        name: 'incident-data-table',
        title: 'Incident Data Table',
        titleNep: 'Incident Data Table',
        path: '/admin/incident/incident-data-table',
        load: () => import('../admin/views/IncidentDatatable'),
        navbar: false,
        disableIfNoAuth: true,
        id: '',
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
        name: 'ibf',
        title: 'IBF',
        titleNep: 'आइ.बि.यफ',
        path: '/ibf/',
        load: () => import('../views/IBF'),
        navbar: false,
        disabled: false,
        iconName: 'cloud',
        id: 'ibf',
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
        name: 'dataArchive',
        title: 'Data Archive',
        titleNep: 'डाटा संग्रह',
        path: '/data-archive/',
        iconName: 'clipboard',
        load: () => import('../views/DataArchive'),
        navbar: true,
        id: '',
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
    //     titleNep: 'Feedback & Support',
    //     path: '/feedback-support/',
    //     load: () => import('../views/FeedbackSupport'),
    //     navbar: true,
    //     disabled: false,
    //     iconName: 'chatBoxes',
    {
        name: 'DRRM Report',
        title: 'DRRM Report',
        titleNep: 'डिआरआरएम रिपोर्ट',
        path: '/drrm-report/',
        load: () => import('../views/PalikaReport'),
        navbar: false,
        disabled: false,
        iconName: 'textDocument',
        id: 'drrm',
    },

    // {
    //     name: 'subMenu',
    //     title: 'palikaReport subMenu',
    //     path: '/palika-report/:menu/:subMenu/',
    //     load: () => import('../views/PalikaReport'),
    //     navbar: false,

    // },
    {
        name: 'visrisk',
        title: 'VisRisk',
        titleNep: 'भिज-रिश्‍क',
        path: '/vis-risk/',
        load: () => import('../views/VizRisk'),
        navbar: true,
        disabled: false,
        iconName: 'eye',
    },
    {
        name: 'ibf',
        title: 'IBF',
        titleNep: 'आई.बि.एफ',
        path: '/ibf/',
        load: () => import('../views/IBF'),
        navbar: true,
        disabled: false,
        iconName: 'cloud',
    },
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
