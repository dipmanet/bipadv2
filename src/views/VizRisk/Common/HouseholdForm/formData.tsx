export const physicalFactors = [
    {
        title: 'Foundation Type',
        options: [
            'Permanent house with RCC structure (RCC pads)',
            'Permanent house (Fired brick/stone in cement)',
            'Permanent house (Fired brick/stone in mud)',
            'Temporary House (Bamboo/timber posts)',
            'Others',
        ],
        select: true,
    },
    {
        title: 'Roof Type',
        options: [
            'RC/RB/RBC slab',
            'Light roofing materials (CGI sheet, thatch, wood) on timber/bamboo/steel structure',
            'Heavy roofing materials (tile, slate, soil) on timber/bamboo/steel structure',
        ],
        select: true,
    },
    {
        title: 'Storey',
        select: false,
    },
    {
        title: 'Ground Surface',
        options: [
            'Flat',
            'Moderate slope',
            'Steep slope',
        ],
        select: true,
    },
    {
        title: 'Building Condition',
        options: [
            'Not damaged',
            'Reconstructed',
            'Minor damaged, repaired and settled',
            'Damaged, repaired and settled',
            'Damaged and currently residing at risk',
            'Damaged but currently non-residing',
            'Site cleared and/or materials tacked/removed',
            'Destroyed by landslide',
        ],
        select: true,
    },
    {
        title: 'Damage Grade',
        options: [
            '1',
            '2',
            '3',
            '4',
            '5',
        ],
        select: true,

    },
    {
        title: 'Distance from Road (meters)',
        select: false,
    },
    {
        title: 'Drinking Water Distance (minutes)',
        select: false,

    },
];

export const socialFactors = [
    {
        title: 'Number of people/house members',
        select: false,
    },
    {
        title: 'Male members',
        select: false,
    },
    {
        title: 'Female Members',
        select: false,
    },
    {
        title: 'Ownership of House',
        options: [
            'Female leadership',
            'Male leadership',
            'Joint',
            'Out of family',
        ],
        select: true,
    },
    {
        title: 'Age Group',
        options: [
            'Female leadership',
            'Male leadership',
            'Joint',
            'Out of family',
        ],
        select: true,
    },
    {
        title: 'People with Disability',
        options: [
            'No',
            'Yes',
        ],
        select: true,
    },
    {
        title: 'Distance from medical centers',
        select: false,
    },
    {
        title: 'Distance from security center',
        select: false,
    },
    {
        title: 'Distance from school ',
        select: false,
    },
    {
        title: 'Distance from Open Space',
        select: false,
    },
];

export const economicFactor = [
    {
        title: 'Main source of income',
        options: [
            'Working aboard',
            'Service related work',
            'Business',
            'Agriculture and livestock',
            'No job',
        ],
        select: true,
    },
    {
        title: 'Average yearly income (Nepalese Rupees)',
        select: false,
    },
    {
        title: 'Sufficiency of Agriculture product (Months)',
        options: [
            '9-12',
            '7-9',
            '4-6',
            '<3',
        ],
        select: true,
    },
];
