import fireIcon from '#resources/icons/fire.svg';
import floodIcon from '#resources/icons/flood.svg';
import heatwaveIcon from '#resources/icons/heatwave.svg';
import landslideIcon from '#resources/icons/landslide.svg';
import waterIcon from '#resources/icons/water.svg';
import earthquakeIcon from '#resources/icons/earthquake.svg';
import cycloneIcon from '#resources/icons/cyclone.svg';
import healthIcon from '#resources/icons/health.svg';
import educationIcon from '#resources/icons/education.svg';
import radioIcon from '#resources/icons/radio.svg';

export const alertList = [
    {
        id: 1,
        title: '5.6 magnitude earthquake hits Taplejung',
        lat: 27.6257,
        lng: 87.7763,
    },
    {
        id: 2,
        title: 'Pollution level exceeds 150ppm in Kathmandu',
        lat: 27.7172,
        lng: 85.3240,
    },
    {
        id: 3,
        title: 'Avalanche due to heavy rainfall in the Langtang region',
        lat: 28.2063,
        lng: 85.6229,
    },
];

export const incidentList = [
    {
        id: 1,
        title: 'A tragic earthquake of 3.2 ritcher scale was reported which cause the loss of serveral ants',
        lat: 27.6257,
        lng: 87.7763,
        timestamp: 1549812836124,
        locationName: 'Taplejung',
        hazard: 'earthquake',
    },
    {
        id: 2,
        title: 'Incident 2',
        lat: 27.7172,
        lng: 85.3240,
    },
    {
        id: 3,
        title: 'Incident 3',
        lat: 28.2063,
        lng: 85.6229,
    },
];

export const resourceTypeList = [
    { key: 'health', label: 'Health', icon: healthIcon },
    { key: 'education', label: 'Education', icon: educationIcon },
    { key: 'waterSupply', label: 'Water supply', icon: waterIcon },
    { key: 'communication', label: 'Communication', icon: radioIcon },
];

export const hazardTypeList = [
    { key: 'earthquake', label: 'Earthquake', icon: earthquakeIcon },
    { key: 'urbanFlood', label: 'Urban flood', icon: floodIcon },
    { key: 'costalFlood', label: 'Costal flood', icon: floodIcon },
    { key: 'landslide', label: 'Landslide', icon: landslideIcon },
    { key: 'wildfire', label: 'Wildfire', icon: fireIcon },
    { key: 'waterScarcity', label: 'Water scarcity', icon: waterIcon },
    { key: 'extremeHeat', label: 'Extreme heat', icon: heatwaveIcon },
    { key: 'cyclone', label: 'Cyclone', icon: cycloneIcon },
];

export const adminLevelFilterOptionList = [
    { key: 'province', label: 'Province' },
    { key: 'district', label: 'District' },
    { key: 'municipality', label: 'Municipality' },
];

export const geoareaFilterOptions = {
    province: [
        { key: '1', label: 'Province 1' },
        { key: '2', label: 'Province 2' },
        { key: '3', label: 'Province 3' },
    ],
    district: [
        { key: '1', label: 'Kathmandu' },
        { key: '2', label: 'Bhaktapur' },
        { key: '3', label: 'Lalitpur' },
    ],
    municipality: [
        { key: '1', label: 'Dhankuta' },
        { key: '2', label: 'Imadol' },
        { key: '3', label: 'Ilam' },
    ],
};

export const donutChartData1 = [
    { label: 'Wildfire', value: 19 },
    { label: 'Cyclone', value: 5 },
    { label: 'Landslides', value: 13 },
];

export const donutChartData2 = [
    { label: 'Earthquake', value: 10 },
    { label: 'Flood', value: 15 },
    { label: 'Landslides', value: 23 },
];

export const pieChartData = [
    { label: 'Earthquake', value: 19 },
    { label: 'Flood', value: 5 },
    { label: 'Landslides', value: 13 },
];

export const barChartData = [
    { label: 'Health', value: 19 },
    { label: 'Pollution', value: 5 },
    { label: 'Disasters', value: 13 },
    { label: 'Refugees', value: 17 },
    { label: 'Crisis', value: 19 },
    { label: 'Environment', value: 27 },
];
