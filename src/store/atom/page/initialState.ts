import { PageState } from './types';

// const maptilerAccessToken = process.env.REACT_APP_MAPTILER_ACCESS_TOKEN;

const getInitialStartDate = (rangeInDays: number) => {
    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - rangeInDays);

    return threeDaysAgo.toISOString();
};

const state: PageState = {
    eventTypes: {},

    hidePopup: false,

    region: {
        adminLevel: undefined,
    },

    filters: {
        region: {},
        hazard: [],
        dataDateRange: {
            rangeInDays: 30,
            startDate: undefined,
            endDate: undefined,
        },
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
        {
            id: 8,
            title: 'communication',
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
            id: 'ira',
            title: 'Initial Rapid Assessment',
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
            { id: 5, title: 'Air pollution' },
            { id: 4, title: 'Forest Fire' },
            { id: 6, title: 'Streamflow' },
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
