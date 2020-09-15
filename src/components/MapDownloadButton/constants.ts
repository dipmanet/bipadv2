import { HazardList } from './types';

export const HAZARD_LIST: HazardList[] = [
    {
        id: 1,
        title: 'Aircraft Accident',
        type: 'non natural',
    },
    {
        id: 2,
        title: 'Animal Incidents',
        type: 'natural',
    },
    {
        id: 3,
        title: 'Avalanche',
        type: 'natural',
    },
    {
        id: 4,
        title: 'Boat Capsize',
        type: 'non natural',
    },
    {
        id: 5,
        title: 'Bridge Collapse',
        type: 'non natural',
    },
    {
        id: 6,
        title: 'Cold Wave',
        type: 'natural',
    },
    {
        id: 7,
        title: 'Drowning',
        type: 'non natural',
    },
    {
        id: 8,
        title: 'Earthquake',
        type: 'natural',
    },
    {
        id: 9,
        title: 'Epidemic',
        type: 'natural',
    },
    {
        id: 10,
        title: 'Fire',
        type: 'natural',
    },
    {
        id: 11,
        title: 'Flood',
        type: 'natural',
    },
    {
        id: 12,
        title: 'Forest Fire',
        type: 'natural',
    },
    {
        id: 13,
        title: 'Hailstorm',
        type: 'natural',
    },
    {
        id: 14,
        title: 'Heavy Rainfall',
        type: 'natural',
    },
    {
        id: 15,
        title: 'Helicopter Crash',
        type: 'non natural',
    },
    {
        id: 16,
        title: 'High Altitude',
        type: 'non natural',
    },
    {
        id: 17,
        title: 'Landslide',
        type: 'natural',
    },
    {
        id: 18,
        title: 'Other (Natural)',
        type: 'natural',
    },
    {
        id: 19,
        title: 'Rainfall',
        type: 'natural',
    },
    {
        id: 20,
        title: 'Snake Bite',
        type: 'non natural',
    },
    {
        id: 21,
        title: 'Snow Storm',
        type: 'natural',
    },
    {
        id: 22,
        title: 'Storm',
        type: 'natural',
    },
    {
        id: 23,
        title: 'Thunderbolt',
        type: 'natural',
    },
    {
        id: 24,
        title: 'Wind Storm',
        type: 'natural',
    },
    {
        id: 25,
        title: 'Drought',
        type: 'natural',
    },
    {
        id: 26,
        title: 'Glacial lake outburst',
        type: 'natural',
    },
    {
        id: 27,
        title: 'Heat wave',
        type: 'natural',
    },
    {
        id: 28,
        title: 'Inundation',
        type: 'natural',
    },
    {
        id: 29,
        title: 'Soil Erosion',
        type: 'natural',
    },
    {
        id: 30,
        title: 'Volcanic eruption',
        type: 'natural',
    },
    {
        id: 31,
        title: 'Industrial disaster',
        type: 'non natural',
    },
    {
        id: 32,
        title: 'Mine disaster',
        type: 'non natural',
    },
    {
        id: 33,
        title: 'Pandemics',
        type: 'non natural',
    },
    {
        id: 34,
        title: 'Road accident',
        type: 'non natural',
    },
    {
        id: 35,
        title: 'Animal flu',
        type: 'non natural',
    },
    {
        id: 36,
        title: 'Deforestation',
        type: 'non natural',
    },
    {
        id: 37,
        title: 'Environmental pollution',
        type: 'non natural',
    },
    {
        id: 38,
        title: 'Famine',
        type: 'natural',
    },
    {
        id: 39,
        title: 'Food poisoning',
        type: 'non natural',
    },
    {
        id: 40,
        title: 'Gas explosion',
        type: 'non natural',
    },
    {
        id: 41,
        title: 'Leakage (chemical)',
        type: 'non natural',
    },
    {
        id: 42,
        title: 'Leakage (radiation)',
        type: 'non natural',
    },
    {
        id: 43,
        title: 'Leakage (toxic gas)',
        type: 'non natural',
    },
    {
        id: 44,
        title: 'Microorganism attack',
        type: 'non natural',
    },
    {
        id: 45,
        title: 'Others (Non-Natural)',
        type: 'non natural',
    },
    {
        id: 46,
        title: 'Water Accident',
        type: 'non natural',
    },
    {
        id: 47,
        title: 'Response Accident',
        type: 'non natural',
    },
];

export const damageAndLossList = [
    { key: 'INCIDENTS', titlePart: 'incidents' },
    { key: 'PEOPLE DEATH', titlePart: 'deaths' },
    { key: 'ESTIMATED LOSS (NPR)', titlePart: 'estimated Loss (NPR)' },
    { key: 'INFRASTRUCTURE DESTROYED', titlePart: 'infrastructure(s) destroyed' },
    { key: 'LIVESTOCK DESTROYED', titlePart: 'livestock destroyed' },
];

export const realtimeList = [
    { key: 1, titlePart: 'Earthquake' },
    { key: 2, titlePart: 'River Watch' },
    { key: 4, titlePart: 'Forest Fire' },
    { key: 5, titlePart: 'Air Quality Index' },
    { key: 6, titlePart: 'Strem Flow Prediction' },
];

export const realtimeHourList = [
    { key: 1, titlePart: '1 hour Rain Watch' },
    { key: 3, titlePart: '3 hours Rain Watch' },
    { key: 6, titlePart: '6 hours Rain Watch' },
    { key: 12, titlePart: '12 hours Rain Watch' },
    { key: 24, titlePart: '24 hours Rain Watch' },
];

export const profileSubmoduleList = [
    { key: 'totalPopulation', titlePart: 'Population Distribution' },
    { key: 'householdCount', titlePart: 'Household Distribution' },
    { key: 'literacyRate', titlePart: 'Literacy Rate' },
];

export const floodHazardList = {
    floodDowri: 'FLOOD_DEPTH',
    floodMeteor: 'FLUVIAL_DEFENDED',
    floodWfp: 'FLOOD INUNDATION',
    earthquakeSeismic: 'SEISMIC HAZARD',
    earthquakeTriggeredLandlsideDurham: 'EARTHQUAKE-TRIGGERED LANDSLIDE',
    nationwiseLandslideDurham: 'NATIONWIDE LANDSLIDE HAZARD',
};

export const vulnerabilityLayers = [
    'HDI',
    'lifeExpectancy',
    'hpi',
    'percapita',
    'remoteness',
];

export const vulnerabilityCommunication = [
    'radio',
    'computer',
    'internet',
    'telephone',
    'television',
    'mobilePhone',
    'cableTelevision',
];

export const vulnerabilityWater = [
    'tapWater',
    'wellWater',
    'riverWater',
    'spoutWater',
    'othersWater',
    'coveredWellKuwaWater',
    'uncoveredWellKuwaWater',
    'notStatedWater',
];

export const vulnerabilityToilet = [
    'ordinaryToilet',
    'flushToilet',
    'noToiletFacility',
    'toiletFacilityNotStated',
];


export const vulnerabilityEducation = [
    'boysStudent',
    'totalSchool',
    'girlsStudent',
    'totalStudent',
    'communitySchool',
    'institutionalSchool',
];

export const later = 'later';
