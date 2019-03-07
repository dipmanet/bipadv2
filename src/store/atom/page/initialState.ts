import { PageState } from './types';

const state: PageState = {
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

    selectedMapStyle: 'mapbox://styles/mapbox/streets-v11',
    mapStyles: [
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
                region: {
                    adminLevel: 1,
                },
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
                region: {
                    adminLevel: 1,
                },
            },
            faramErrors: {},
            pristine: true,
        },
    },

    responsePage: {
        resourceList: [],
    },

    filters: {
        faramValues: {
            dateRange: 30,
            region: {
                adminLevel: 1,
            },
        },
        faramErrors: {},
        pristine: true,
    },

    // FIXME: Remove Geojson from redux

    geoJsons: {
        district: {
            type: 'FeatureCollection',
            features: [
                {
                    id: 1,
                    type: 'Feature',
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [[[
                            [87, 27],
                            [87, 28],
                            [86, 28],
                            [87, 27],
                        ]]],
                    },
                },
            ],
        },
    },
};
export default state;
