export const rangeData = [
    {
        name: 'very_high',
        status: 'Very High(6.5 - 10)',
        color: '#e75d4f',
        range: [6.5, 10],
    },
    {
        name: 'high',
        status: 'High(5 - 6.5)',
        color: '#e79546',
        range: [5, 6.4],

    },
    {
        name: 'medium',
        status: 'Medium(3.5 - 5)',
        color: 'yellow',
        range: [3.5, 4.9],

    },
    {
        name: 'low',
        status: 'Low(2 - 3.5)',
        color: '#45c4fe',
        range: [2, 3.4],

    },
    {
        name: 'very_low',
        status: 'Very Low(0 - 2)',
        color: '#457ded',
        range: [0, 1.9],

    },
];

export const SlideTitle = [
    'Ratnanagar Municipality',
    'Landcover',
    'Demography',
    'Critical Infrastructures',
    'Inundation Map',
    'Flood Hazard in Ratnanagar',
    'Visualizing Flood Exposure for Ratnanagar',
    'Sensitivity of Households',
    'Adaptive Capacity',
    'Risk Assessment',
];


export const staticSelectFieldValues = {
    Sensitivity: {
        Social: [
            'Number of Dependent Population (Children <15 and Elderly (Age >=60 years)',
            'Household head Gender',
            'Ethnicity',
            'Occupational and livelihood groups of the family members',
            'Gender (percentage of female and others)',
            'Disability',
            'Pregnant and lactating women in the family',
            'Single women (widow plus single woman from datasets)',
            'Chronically ill',
            'Identity Revealing',
            'Education level (literate Vs Illiterate)',
        ],
        Economic: [
            'Annual Income (NPR)',
            'Income Source',
            'Yearly saving of your house (NPR)',
            'Number of unemployed member in the household',
            'Land holding',
            'Land holding female %',
        ],
        'Access to Resources': [
            'Access to natural resource',
            'Access to drinking water (normal days and flood)',
            'Access to medical centers',
            'Access to medical centers for people with disability',
            'Access to security',
            'Access to market',
            'Access to toilet',
            'Access to toilet for people with disability',
            'Access to safe and accessible sanitation',
            'Access to financial institution',
            'Access to financial institution for people with disability',
            'Access to educational institutions',
            'Access to educational institutions for people with disability',
            'Distance from road (m) for people with disability',
            'Access to community building',
            'Access to community building for people with disability',
            'Distance from municipality office',
            'Distance from municipality office for people with disability',
            'Distance from ward office',
            'Distance from ward office for people with disability',
            'Access to safe shelter',
        ],
        Physical: [
            'Number of storey',
            'Building designed following building code',
            'Building permit received from the municipality',
            'Current condition of house',
            'Ground surface',
            'Raised plinth, proper drainage and roof accessible during emergency',
        ],
    },
    'Adaptive Capacity': {
        'Finance and Assistance': [
            'Hold Insurance Policy',
            'Access to loan from financial institutes',
            'Covered by subsidised loan targeted for women/marginalized group',
            'Reservations, allowances and special privilege systems',
            'Access to social assistance in the aftermath of past disaster',
        ],
        Communication: [
            'Use of communication device',
            'Access to the communication devices by women or marginalized people',
        ],
        Information: [
            'Access to early warning information',
            'Understand early warning information disseminated',
        ],
        'Training, membership and participation': [
            'Training on DRR received',
            'Membership of the family members in community groups',
            "Women's participation in community meeting and or decision-making process",
        ],
    },
};


export const floodHazardLayersArr = [{
    year: '5',
    layerName: 'Ratnanagar_FD_1in5',
}, {
    year: '20',
    layerName: 'Ratnanagar_FD_1in20',
}, {
    year: '100',
    layerName: 'Ratnanagar_FD_1in100',
}];
