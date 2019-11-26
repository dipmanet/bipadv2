import { PageState } from './types';

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
    selectedMapStyle: 'https://api.maptiler.com/tiles/v3/tiles.json?key=i81l5tcmzCHrIgcdQTIr',
    mapStyles: [
        {
            name: 'none',
            style: 'mapbox://styles/adityakhatri/cjuck3jrk1gyt1fprrcz8z4f0',
            color: '#dddddd',
        },
        {
            name: 'light',
            style: 'mapbox://styles/adityakhatri/cjtn5thbw2g8s1fmnx0kqovev',
            color: '#ff8867',
        },
        {
            name: 'roads',
            style: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
            color: '#671076',
        },
        {
            name: 'satellite',
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            color: '#c89966',
        },
        {
            name: 'osm',
            color: '#000000',
            style: 'https://api.maptiler.com/tiles/v3/tiles.json?key=i81l5tcmzCHrIgcdQTIr',
        },
        /*
        {
            name: 'light',
            style: 'mapbox://styles/mapbox/light-v10',
            color: '#cdcdcd',
        },
        {
            name: 'outdoor',
            style: 'mapbox://styles/mapbox/outdoors-v11',
            color: '#c8dd97',
        },
        {
            name: 'street',
            style: 'mapbox://styles/mapbox/streets-v11',
            color: '#ece0ca',
        },
        */
    ],

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
            id: 1,
            title: 'dhm',
        },
        {
            id: 2,
            title: 'nsc',
        },
        {
            id: 3,
            title: 'other',
        },
    ],

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
