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
    { key: 'health', label: 'Health' },
    { key: 'education', label: 'Education' },
    { key: 'waterSupply', label: 'Water supply' },
    { key: 'communication', label: 'Communication' },
];

export const hazardTypeList = [
    { key: 'earthquake', label: 'Earthquake' },
    { key: 'urbanFlood', label: 'Urban flood' },
    { key: 'costalFlood', label: 'Costal flood' },
    { key: 'landslide', label: 'Landslide' },
    { key: 'wildfire', label: 'Wildfire' },
    { key: 'waterScarcity', label: 'Water scarcity' },
    { key: 'extremeHeat', label: 'Extreme heat' },
    { key: 'cyclone', label: 'Cyclone' },
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
