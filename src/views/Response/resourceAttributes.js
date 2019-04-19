export const operatorOptions = [
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

        { key: 'cbsCode', label: 'Cbs Code', type: 'string' },
        { key: 'bedCount', label: 'Number of Beds', type: 'number', filter: {} },
        { key: 'staffCount', label: 'Number of Staffs', type: 'number', filter: {} },
        { key: 'icu', label: 'ICU', type: 'boolean' },
        { key: 'nicu', label: 'NICU', type: 'boolean' },
        { key: 'emergencyService', label: 'Emergency Service', type: 'boolean', filter: {} },
        { key: 'operatingTheatre', label: 'Operating Theatre', type: 'boolean' },
        { key: 'ambulanceService', label: 'Ambulance Service', type: 'boolean' },
        { key: 'contactPerson', label: 'Contact Person', type: 'string' },
        { key: 'specialization', label: 'Specialization', type: 'string' },
        { key: 'type', label: 'Type', type: 'string' },
        // { key: 'emailAddress', label: 'Email Address', type: 'string' },
        // { key: 'comments', label: 'Comments', type: 'string' },
    ],
    finance: [
        { key: 'cbsCode', label: 'Cbs Code', type: 'string' },
        { key: 'population', label: 'Population', type: 'number', filter: {} },
        { key: 'accessPointCount', label: 'Access Point Count', type: 'number', filter: {} },
        { key: 'type', label: 'Type', type: 'string' },
        {
            key: 'channel',
            label: 'Channel',
            type: 'string',
            filter: {
                type: 'select',
                options: [
                    { key: 'blb', label: 'Branchless Banking' },
                    { key: 'branch', label: 'Branch' },
                    { key: 'atm', label: 'ATM' },
                ],
            },
        },
    ],
    volunteer: [],
    education: [
        { key: 'classroomCount', label: 'Classrooms', type: 'number', filter: {} },
        { key: 'openSpace', label: 'Open Space', type: 'boolean', filter: {} },
        { key: 'studentCount', label: 'Students', type: 'number' },
        { key: 'teacherCount', label: 'Teacher', type: 'number' },
        { key: 'firstAid', label: 'FirstAid', type: 'boolean' },
    ],
    openSpace: [
        { key: 'area', label: 'Area', type: 'number' },
        { key: 'capacity', label: 'Capacity', type: 'number' },
    ],
    hotel: [
        { key: 'roomCount', label: 'Rooms', type: 'number', filter: {} },
        { key: 'bedCount', label: 'Beds', type: 'number' },
        { key: 'staffCount', label: 'Staffs', type: 'number' },
        { key: 'facilities', label: 'Staffs', type: 'string' },
    ],
    governance: [
        {
            key: 'operatorType',
            label: 'Operator',
            type: 'string',
            filter: {
                type: 'select',
                options: operatorOptions,
            },
        },
        { key: 'source', label: 'Source', type: 'string' },
        // { key: 'staffCount', label: 'Staffs', type: 'number' },
    ],
};


export default resourceAttributes;
