/*
import fireIcon from '#resources/icons/fire.svg';
import floodIcon from '#resources/icons/flood.svg';
import heatwaveIcon from '#resources/icons/heatwave.svg';
import landslideIcon from '#resources/icons/landslide.svg';
import waterIcon from '#resources/icons/water.svg';
import earthquakeIcon from '#resources/icons/earthquake.svg';
*/
import cycloneIcon from '#resources/icons/cyclone.svg';


const initialSiloDomainData = {
    provinces: [],
    districts: [],
    municipalities: [],
    wards: [],

    hazardTypes: {},

    incidentPage: {
        incidentList: [
            {
                pk: 1,
                title: 'Landslide blocks Kali Gandaki',
                description: 'Residents living on the banks of the Kali Gandaki River in Gharapjhong Rural Municipality of Mustang were terrified a lot today following a landslide that blocked water flow in the river for hours.',
                cause: 'day-long snowfall and strong wind at night',
                inducer: 'natural', // or artificial
                severity: 'major', // or minor, catastrophic
                source: {
                    name: 'himalayan-times',
                    displayName: 'The Himalayan Times',
                },
                incident_on: 1550427300733,
                event: undefined,
                hazard: 4, // NOTE: landslide
                loss: {
                    estimatedLoss: 200,
                    peoples: [
                        {
                            // count: ?,
                            status: 'missing', // dead, injured or affected
                            name: 'Hari',
                            age: 18,
                            gender: 'male', // or female
                            belowPoverty: true,
                            disabled: false,
                        },
                    ],
                    families: [
                        {
                            // title: ?
                            // count: ?,
                            status: 'evacuated', // relocated, evacuated
                            belowPoverty: true,
                            phoneNumber: '9816754539',
                        },
                    ],
                    infrastructures: [
                        {
                            title: 'Gandaki Bridge',
                            type: {
                                title: 'bridge',
                                description: '',
                            },
                            status: 'affected', // destroyed
                            equipment_value: 1900000,
                            infrastructure_value: 21312433343,
                            beneficiaryOwner: undefined,
                            serviceDisrupted: true,
                            // count: ?
                        },
                    ],
                    livestocks: [
                        {
                            // title: ''
                            type: {
                                title: 'Cow',
                            },
                            status: 'destroyed', // affected
                            count: 13,
                        },
                    ],
                },
                point: [85.300140, 27.700769],
                geoareaName: {
                    palika: 'Mahalaxmi',
                    district: 'Lalitpur',
                    province: 'Province 3',
                },
                /*
                   polygon: ?
                   wards: ?
                   street address: ?
                   detail: ?
                 */
            },
            {
                pk: 2,
                title: 'Earthquake destroys half of the highway',
                description: 'Residents living on the banks of',
                cause: 'Fracking around the hilly region',
                inducer: 'artificial', // or artificial
                severity: 'catastropic', // or minor, catastrophic
                source: {
                    name: 'himalayan-space',
                    displayName: 'The Himalayan Space',
                },
                incident_on: 1550081700430,
                event: undefined,
                hazard: 1,
                point: [85.100140, 27.900769],
                geoareaName: {
                    palika: 'Mahalaxmi',
                    district: 'Lalitpur',
                    province: 'Province 3',
                },
            },
            {
                pk: 3,
                title: 'Wildfire in forests around Chitwan',
                description: 'Unreachable roads due to wildfire',
                cause: 'Careless management of fire',
                inducer: 'artificial', // or artificial
                severity: 'minor', // or minor, catastrophic
                source: {
                    name: 'himalayan-times',
                    displayName: 'The Himalayan Times',
                },
                incident_on: 1549563300865,
                event: undefined,
                hazard: 5,
                point: [85.320140, 27.200769],
                geoareaName: {
                    palika: 'Mahalaxmi',
                    district: 'Lalitpur',
                    province: 'Province 3',
                },
            },
            {
                pk: 4,
                title: 'Flooding around Saptakoshi',
                description: 'this is a description',
                cause: 'Large amount of rain during monsoon',
                inducer: 'natural', // or artificial
                severity: 'major', // or minor, catastrophic
                source: {
                    name: 'himalayan-times',
                    displayName: 'The Himalayan Times',
                },
                incident_on: 1549044900073,
                event: undefined,
                hazard: 2,
                point: [85.800140, 27.100769],
                geoareaName: {
                    palika: 'Mahalaxmi',
                    district: 'Lalitpur',
                    province: 'Province 3',
                },
            },
        ],
        filters: {
            faramValues: {},
            faramErrors: {},
            pristine: true,
        },
    },

    dashboardPage: {
        alertList: [
            {
                pk: 1,
                title: '5.6 magnitude earthquake hits Taplejung',
                hazard: 1,
                point: [87.7763, 27.6257],
                source: 'Seisomology',
                alertOn: 1550427300733,
                icon: cycloneIcon,
            },
            {
                pk: 2,
                title: 'Heavy rainfall in Manang, risk of landslide',
                hazard: 4,
                point: [85.3240, 27.7172],
                source: 'Hydrology',
                alertOn: 1550081700430,
                icon: cycloneIcon,
            },
            {
                pk: 3,
                title: 'Avalanche due to heavy rainfall in the Langtang region',
                hazard: 4,
                point: [85.6229, 28.2063],
                source: 'Hydrology',
                alertOn: 1549563300865,
                icon: cycloneIcon,
            },
            {
                pk: 4,
                title: 'Heavy rainfall in the Rara region',
                hazard: 2,
                point: [82.079508, 29.531221],
                source: 'Hydrology',
                alertOn: 1549563300865,
                icon: cycloneIcon,
            },
            {
                pk: 5,
                title: 'Possible flood in the Lamjung',
                hazard: 2,
                point: [84.499204, 28.234112],
                source: 'Hydrology',
                alertOn: 1549563300865,
                icon: cycloneIcon,
            },
            {
                pk: 6,
                title: 'Wild fire started in Ilam, still spreading out of control',
                hazard: 5,
                point: [87.922457, 26.887003],
                source: 'ICIMOD',
                alertOn: 1549563300865,
                icon: cycloneIcon,
            },
        ],
        filters: {
            faramValues: {},
            faramErrors: {},
            pristine: true,
        },
    },

    responsePage: {
        resourceList: [
            {
                pk: 1,
                point: [85.304140, 27.810769],
                type: 'hospital',
                title: 'Alka Hospital Pvt. Ltd.',
                distance: 2,
            },
            {
                pk: 2,
                point: [85.419140, 27.700769],
                type: 'hospital',
                title: 'Nidaan Hospital Pvt. Ltd.',
                distance: 1.8,
            },
            {
                pk: 3,
                point: [85.311140, 27.710769],
                type: 'hospital',
                title: 'Mediciti Hospital',
                distance: 0.2,
            },
            {
                pk: 4,
                point: [85.121140, 27.710769],
                type: 'volunteer',
                title: 'Togglecorp Solutions Pvt. Ltd.',
                distance: 2.5,
            },
            {
                pk: 5,
                point: [85.521140, 27.510769],
                type: 'volunteer',
                title: 'Naxa Pvt. Ltd.',
                distance: 4.6,
            },
        ],
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
    ],

    selectedMapStyle: 'mapbox://styles/mapbox/streets-v11',

    adminLevelList: [
        {
            pk: 1,
            title: 'Province',
        },
        {
            pk: 2,
            title: 'District',
        },
        {
            pk: 3,
            title: 'Municipality',
        },
    ],

};

export default initialSiloDomainData;
