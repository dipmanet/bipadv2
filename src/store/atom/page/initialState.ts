import { PageState } from './types';

const maptilerAccessToken = process.env.REACT_APP_MAPTILER_ACCESS_TOKEN;

const state: PageState = {
    eventTypes: {},

    hidePopup: false,

    region: {
        adminLevel: undefined,
    },

    adminLevelList: [
        {
            id: 0,
            title: 'national',
        },
        {
            id: 1,
            title: 'province',
        },
        {
            id: 2,
            title: 'district',
        },
        {
            id: 3,
            title: 'municipality',
        },
    ],

    provinces: [],
    districts: [],
    municipalities: [],
    wards: [],

    documentCategoryList: [],

    // selectedMapStyle: 'mapbox://styles/adityakhatri/cjtn5thbw2g8s1fmnx0kqovev',
    // selectedMapStyle: `https://api.maptiler.com/tiles/v3/tiles.json?key=${maptilerAccessToken}`,
    selectedMapStyle: 'mapbox://styles/adityakhatri/cjuck3jrk1gyt1fprrcz8z4f0',
    hazardTypes: {},
    resourceTypeList: [
        {
            id: 1,
            title: 'education',
        },
        {
            id: 2,
            title: 'health',
        },
        {
            id: 3,
            title: 'finance',
        },
        {
            id: 4,
            title: 'governance',
        },
        {
            id: 5,
            title: 'tourism',
        },
        {
            id: 6,
            title: 'cultural',
        },
        {
            id: 7,
            title: 'industry',
        },
    ],
    lossList: [],
    severityList: [
        {
            id: 1,
            title: 'minor',
        },
        {
            id: 2,
            title: 'major',
        },
        {
            id: 3,
            title: 'catastrophic',
        },
    ],
    sourceList: [
        {
            id: 'initial_rapid_assesment',
            title: 'Initial Rapid Assesment',
        },
        {
            id: 'nepal_police',
            title: 'Nepal Police',
        },
        {
            id: 'other',
            title: 'Other',
        },
    ],
    genderList: [
        {
            id: 1,
            title: 'male',
        },
        {
            id: 2,
            title: 'female',
        },
        {
            id: 3,
            title: 'others',
        },
    ],
    peopleLossStatusList: [
        {
            id: 1,
            title: 'dead',
        },
        {
            id: 2,
            title: 'missing',
        },
        {
            id: 3,
            title: 'injured',
        },
        {
            id: 4,
            title: 'affected',
        },
    ],
    agricultureLossStatusList: [
        {
            id: 1,
            title: 'destroyed',
        },
        {
            id: 1,
            title: 'affected',
        },
    ],
    countryList: [],

    // Page related

    dashboardPage: {
        eventList: [],
        alertList: [],
        filters: {
            faramValues: {
                dateRange: 30,
            },
            faramErrors: {},
            pristine: true,
        },
    },

    incidentPage: {
        incidentList: [],
        filters: {
            faramValues: {
                dateRange: 30,
            },
            faramErrors: {},
            pristine: true,
        },
    },

    responsePage: {
        resourceList: [],
        inventoryCategoryList: [],
        inventoryItemList: [],
    },

    realTimeMonitoringPage: {
        realTimeRainList: [],
        realTimeRiverList: [],
        realTimeEarthquakeList: [],
        realTimeFireList: [],
        realTimePollutionList: [],
        realTimeSourceList: [
            { id: 3, title: 'Rain' },
            { id: 2, title: 'River' },
        ],
        otherSourceList: [
            { id: 1, title: 'Earthquake' },
            { id: 5, title: 'Pollution' },
            { id: 4, title: 'Forest Fire' },
        ],
        filters: {
            faramValues: {
                realtimeSources: [3, 2],
            },
            faramErrors: {},
            pristine: true,
        },
    },

    lossAndDamagePage: {
        lossAndDamageList: [],
        filters: {
            faramValues: {
                metric: 'count',
            },
            faramErrors: {},
            pristine: true,
        },
    },

    projectsProfilePage: {
        filters: {
            faramValues: {
            },
            faramErrors: {},
            pristine: true,
        },
    },

    disasterProfilePage: {
        riskList: [],
        lpGasCookList: [],
    },

    profileContactPage: {
        contactList: [],
        filters: {
            faramValues: {
                drrFocalPersonOnly: false,
            },
            faramErrors: {},
            pristine: true,
        },
    },
};
export default state;
