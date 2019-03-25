const operatorOptions = [
    { key: 'government', label: 'Government' },
    { key: 'private', label: 'Private' },
    { key: 'community', label: 'Community' },
];

const resourceAttributes = {
    health: [
        {
            key: 'operatorType',
            label: 'Operator',
            type: 'string',
            filter: {
                type: 'select',
                options: operatorOptions,
            },
        },
        { key: 'openingHours', label: 'Opening Hours', type: 'string' },
        { key: 'phoneNumber', label: 'Phone Number', type: 'string' },

        { key: 'bedCount', label: 'Number of Beds', type: 'number' },
        { key: 'staffCount', label: 'Number of Staffs', type: 'number' },
        { key: 'icu', label: 'ICU', type: 'boolean' },
        { key: 'emergencyService', label: 'Emergency Service', type: 'boolean' },
        { key: 'operatingTheatre', label: 'Operating Theatre', type: 'boolean' },
        { key: 'ambulanceService', label: 'Ambulance Service', type: 'boolean' },
        { key: 'contactPerson', label: 'Contact Person', type: 'string' },
        { key: 'specialization', label: 'Specialization', type: 'string' },
        { key: 'type', label: 'Type', type: 'string' },
        // { key: 'emailAddress', label: 'Email Address', type: 'string' },
        // { key: 'comments', label: 'Comments', type: 'string' },
    ],
    finance: [],
    volunteer: [],
    education: [],
};


export default resourceAttributes;
