import { PageState } from './types';

const state: PageState = {
    eventTypes: {},

    initialPopupShown: false,

    region: {
        adminLevel: undefined,
    },

    adminLevelList: [
        {
            id: 1,
            title: 'Province',
        },
        {
            id: 2,
            title: 'District',
        },
        {
            id: 3,
            title: 'Municipality',
        },
    ],

    provinces: [],
    districts: [],
    municipalities: [],
    wards: [],

    selectedMapStyle: 'mapbox://styles/adityakhatri/cjuck3jrk1gyt1fprrcz8z4f0',
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
    resourceTypes: {},

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
    },

    realTimeMonitoringPage: {
        realTimeRainList: [],
        realTimeRiverList: [],
        realTimeEarthquakeList: [],
        realTimeFireList: [],
        realTimePollutionList: [],
        realTimeSourceList: [
            { id: 1, title: 'Earthquake' },
            { id: 2, title: 'River' },
            { id: 3, title: 'Rain' },
            { id: 4, title: 'Forest Fire' },
            { id: 5, title: 'Pollution' },
        ],
        filters: {
            faramValues: {
                realtimeSources: [1, 2, 3, 5],
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
};
export default state;
