/*
import fireIcon from '#resources/icons/fire.svg';
import floodIcon from '#resources/icons/flood.svg';
import heatwaveIcon from '#resources/icons/heatwave.svg';
import landslideIcon from '#resources/icons/landslide.svg';
import waterIcon from '#resources/icons/water.svg';
import earthquakeIcon from '#resources/icons/earthquake.svg';
*/
// import cycloneIcon from '#resources/icons/cyclone.svg';

import nepalGeoJson from '#resources/districts.json';


const initialSiloDomainData = {
    provinces: [],
    districts: [],
    municipalities: [],
    wards: [],

    hazardTypes: {},

    geoJsons: {
        district: nepalGeoJson,
        municipality: {},
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

    dashboardPage: {
        alertList: [
            /*
            {
                id: 1,
                title: '5.6 magnitude earthquake hits Taplejung',
                hazard: 1,
                point: [87.7763, 27.6257],
                source: 'Seisomology',
                alertOn: 1550427300733,
                icon: cycloneIcon,
            },
            {
                id: 2,
                title: 'Heavy rainfall in Manang, risk of landslide',
                hazard: 4,
                point: [85.3240, 27.7172],
                source: 'Hydrology',
                alertOn: 1550081700430,
                icon: cycloneIcon,
            },
            {
                id: 3,
                title: 'Avalanche due to heavy rainfall in the Langtang region',
                hazard: 4,
                point: [85.6229, 28.2063],
                source: 'Hydrology',
                alertOn: 1549563300865,
                icon: cycloneIcon,
            },
            {
                id: 4,
                title: 'Heavy rainfall in the Rara region',
                hazard: 2,
                point: [82.079508, 29.531221],
                source: 'Hydrology',
                alertOn: 1549563300865,
                icon: cycloneIcon,
            },
            {
                id: 5,
                title: 'Possible flood in the Lamjung',
                hazard: 2,
                point: [84.499204, 28.234112],
                source: 'Hydrology',
                alertOn: 1549563300865,
                icon: cycloneIcon,
            },
            {
                id: 6,
                title: 'Wild fire started in Ilam, still spreading out of control',
                hazard: 5,
                point: [87.922457, 26.887003],
                source: 'ICIMOD',
                alertOn: 1549563300865,
                icon: cycloneIcon,
            },
            */
        ],
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

    selectedMapStyle: 'mapbox://styles/mapbox/streets-v11',

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

};

export default initialSiloDomainData;
