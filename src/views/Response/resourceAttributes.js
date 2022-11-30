export const operatorOptions = [
    { key: 'government', label: 'Government', labelNe: 'सरकारी' },
    { key: 'private', label: 'Private', labelNe: 'निजी' },
    { key: 'community', label: 'Community', labelNe: 'सामुदायिक' },
];


const financeTypeOptions = [
    { key: 'commercial', label: 'Commercial', labelNe: 'व्यावसायिक' },
    { key: 'development', label: 'Development', labelNe: 'विकास' },
    { key: 'finance', label: 'Finance', labelNe: 'वित्त' },
    { key: 'micro-credit', label: 'Micro-Credit Development', labelNe: 'माइक्रो क्रेडिट विकास' },
];

export const filterOperations = {
    EQ: (objVal, compareVal) => objVal === compareVal,
    GTE: (objVal, compareVal) => objVal >= compareVal,
    LTE: (objVal, compareVal) => objVal <= compareVal,
};

const healthAttributes = [
    {
        key: 'operatorType',
        label: 'Operator',
        labelNe: 'अपरेटर',
        type: 'string',
        filter: {
            type: 'select',
            options: operatorOptions,
        },
    },
    { key: 'openingHours', label: 'Opening Hours', labelNe: 'खुल्ने समय', type: 'string' },
    { key: 'phoneNumber', label: 'Phone Number', labelNe: 'फोन नम्बर', type: 'string' },

    { key: 'cbsCode', label: 'Cbs Code', labelNe: 'Cbs कोड', type: 'string' },
    {
        key: 'bedCount',
        label: 'Number of Beds',
        labelNe: 'बेड संख्या',
        type: 'number',
        aggregate: true,
        filter: {
            operation: filterOperations.GTE,
        },
    },
    {
        key: 'staffCount',
        label: 'Number of Staffs',
        labelNe: 'कर्मचारी संख्या',
        type: 'number',
        filter: {
            operation: filterOperations.GTE,
        },
    },
    {
        key: 'icu',
        label: 'ICU',
        labelNe: 'आईसीयू',
        type: 'boolean',
        filter: {},
    },
    {
        key: 'nicu',
        label: 'NICU',
        labelNe: 'एनआईसीयू',
        type: 'boolean',
        filter: {},
    },
    {
        key: 'emergencyService',
        label: 'Emergency Service',
        labelNe: 'आपतकालीन सेवा',
        type: 'boolean',
        filter: {},
    },
    { key: 'operatingTheatre', label: 'Operating Theatre', labelNe: 'सञ्चालन थिएटर', type: 'boolean' },
    { key: 'ambulanceService', label: 'Ambulance Service', labelNe: 'एम्बुलेन्स सेवा', type: 'boolean' },
    { key: 'contactPerson', label: 'Contact Person', labelNe: 'सम्पर्क व्यक्ति', type: 'string' },
    { key: 'specialization', label: 'Specialization', labelNe: 'विशेषज्ञता', type: 'string' },
    { key: 'type', label: 'Type', labelNe: 'प्रकार', type: 'string' },
    // { key: 'emailAddress', label: 'Email Address', type: 'string' },
    // { key: 'comments', label: 'Comments', type: 'string' },
];

const financeAttributes = [
    { key: 'cbsCode', label: 'Cbs Code', labelNe: 'Cbs कोड', type: 'string' },
    {
        key: 'population',
        label: 'Population',
        labelNe: 'जनसंख्या',
        type: 'number',
        filter: {
            operation: filterOperations.GTE,
        },
    },
    {
        key: 'accessPointCount',
        label: 'Access Points',
        labelNe: 'पहुँच बिन्दुहरू',
        aggregate: true,
        type: 'number',
        filter: {
            operation: filterOperations.GTE,
        },
    },
    {
        key: 'type',
        label: 'Type',
        labelNe: 'प्रकार',
        type: 'string',
        filter: {
            operation: filterOperations.EQ,
            options: financeTypeOptions,
        },
    },
    {
        key: 'channel',
        label: 'Channel',
        labelNe: 'च्यानल',
        type: 'string',
        filter: {
            type: 'select',
            options: [
                { key: 'blb', label: 'Branchless Banking', labelNe: 'शाखारहित बैंकिङ' },
                { key: 'branch', label: 'Branch', labelNe: 'साखा' },
                { key: 'atm', label: 'ATM', labelNe: 'एटीएम' },
            ],
        },
    },
];

const educationAttributes = [
    { key: 'classroomCount', label: 'Classrooms', labelNe: 'कक्षा कोठाहरू', type: 'number', filter: {} },
    { key: 'openSpace', label: 'Open Space', labelNe: 'खुल्‍ला ठाउँ', type: 'boolean', filter: {} },
    { key: 'studentCount', label: 'Students', labelNe: 'विद्यार्थीहरू', type: 'number' },
    { key: 'teacherCount', label: 'Teacher', labelNe: 'शिक्षक', type: 'number' },
    { key: 'firstAid', label: 'FirstAid', labelNe: 'प्राथमिक उपचार', type: 'boolean' },
];

const volunteerAttributes = [];

const hotelAttributes = [
    {
        key: 'roomCount',
        label: 'Rooms',
        labelNe: 'कोठाहरू',
        type: 'number',
        aggregate: true,
        filter: {},
    },
    { key: 'bedCount', label: 'Beds', labelNe: 'ओछ्यान', type: 'number' },
    { key: 'staffCount', label: 'Staffs', labelNe: 'कर्मचारीहरू', type: 'number' },
    { key: 'facilities', label: 'Staffs', labelNe: 'कर्मचारीहरू', type: 'string' },
];

const openSpaceAttributes = [
    { key: 'area', label: 'Area', labelNe: 'क्षेत्र', type: 'number' },
    { key: 'capacity', label: 'Capacity', labelNe: 'क्षमता', type: 'number' },
];

const governanceAttributes = [
    {
        key: 'operatorType',
        label: 'Operator',
        labelNe: 'अपरेटर',
        type: 'string',
        filter: {
            type: 'select',
            options: operatorOptions,
        },
    },
    { key: 'source', label: 'Source', labelNe: 'स्रोत', type: 'string' },
    // { key: 'staffCount', label: 'Staffs', type: 'number' },
];
const warehouseAttribute = [{
    key: 'hasDisableFriendlyInfrastructure',
    label: 'Has Disable Friendly Infrastructure?',
    labelNe: 'असक्षम मैत्री पूर्वाधार छ?',
    type: 'boolean',
    filter: {},

}];

const resourceAttributes = {
    health: healthAttributes,
    finance: financeAttributes,
    volunteer: volunteerAttributes,
    education: educationAttributes,
    openSpace: openSpaceAttributes,
    hotel: hotelAttributes,
    governance: governanceAttributes,
    warehouse: warehouseAttribute,
};

export default resourceAttributes;
