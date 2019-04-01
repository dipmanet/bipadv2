import { PageState } from './types';

const state: PageState = {
    eventTypes: {},

    initialPopupShown: false,

    region: {
        adminLevel: 1,
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

    selectedMapStyle: 'mapbox://styles/adityakhatri/cjtn5thbw2g8s1fmnx0kqovev',
    mapStyles: [
        {
            name: 'custom',
            style: 'mapbox://styles/adityakhatri/cjtn5thbw2g8s1fmnx0kqovev',
            color: '#ff8867',
        },
        {
            name: 'light',
            style: 'mapbox://styles/mapbox/light-v10',
            color: '#cdcdcd',
        },
        {
            name: 'street',
            style: 'mapbox://styles/mapbox/streets-v11',
            color: '#ece0ca',
        },
        {
            name: 'outdoor',
            style: 'mapbox://styles/mapbox/outdoors-v11',
            color: '#c8dd97',
        },
        {
            name: 'satellite',
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            color: '#c89966',
        },
        {
            name: 'roads',
            style: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
            color: '#671076',
        },
    ],

    hazardTypes: {},
    resourceTypes: {},

    // Page related

    dashboardPage: {
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
        filters: {
            faramValues: {
                realtimeSources: [1, 2, 3, 4],
            },
            faramErrors: {},
            pristine: true,
        },
    },

    lossAndDamagePage: {
        lossAndDamageList: [],
        filters: {
            faramValues: {
            },
            faramErrors: {},
            pristine: true,
        },
    },
};
export default state;
