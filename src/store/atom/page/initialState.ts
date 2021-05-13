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
            rangeInDays: 7,
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
        {
            id: 9,
            title: 'openspace',
        },
        {
            id: 10,
            title: 'communityspace',
        },
    ],
    carKeys: [],
    lossList: [],
    countryList: [],

    // Page related

    dashboardPage: {
        eventList: [],
        alertList: [],
        filters: {
            faramValues: {
                dateRange: 7,
            },
            faramErrors: {},
            pristine: true,
        },
    },

    incidentPage: {
        incidentList: [],
        filters: {
            faramValues: {
                dateRange: 7,
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
    generalData: {
        reportTitle: '',
        fiscalYear: '',
        mayor: '',
        cao: '',
        focalPerson: '',
        formationDate: '',
        committeeMembers: 0,
        localMembers: [],
    },
    budgetData: {
        totMunBudget: 0,
        totDrrBudget: 0,
        additionalDrrBudget: 0,
    },
    budgetActivityData: {
        name: '',
        fundSource: '',
        budgetCode: '',
        projStatus: '',
        allocatedBudget: '',
        actualExp: '',
        remarks: '',
        priorityArea: '',
        action: '',
        activity: '',
        areaofImplementation: '',
        fundingType: '',
        organisationName: '',
        projcompletionDate: '',
        projstartDate: '',
    },
    programAndPolicyData: {
        pointOne: '',
        pointTwo: '',
        pointThree: '',
    },
    budgetId: {
        id: '',
    },
    palikaRedirect: {
        showForm: false,
        redirectTo: -1,
    },
    palikaLanguage: {
        language: 'en',
    },
    drrmOrg: {
        data: [],
    },

};
export default state;
