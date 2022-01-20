export const epidemicDetails = {
    incidentOn: null,
    reportedOn: null,
    cause: null, // hazard inducer
    loss: null, // get loss id from loss api call
    verified: null,
    approved: null,
    // 'hazard' : 9,   // Default 9 is for Epidemmic
    streetAddress: null, // use local address field
    verificationMessage: null,
    point: {
        type: null,
        coordinates: [
            null, // add long from map
            null, // add lat from map
        ],
    },
    wards: [],
    totalDeadMale: null,
    totalDeadFemale: null,
    totalDeadOther: null,
    totalDeadDisabled: null,
    totalInjuredMale: null,
    totalInjuredFemale: null,
    totalInjuredOther: null,
    totalInjuredDisabled: null,
};
export const tableTitleRef = {
    id: 'ID',
    province: 'Province',
    district: 'District',
    municipality: 'Municipality',
    wards: 'Wards',
    streetAddress: 'Street Address',
    longitude: 'Longitude',
    latitude: 'Latitude',
    reportedOn: 'Reported on',
    cause: 'Hazard Inducer',
    totalInjuredMale: 'Total Male Affected',
    totalInjuredFemale: 'Total Female Affected',
    totalInjuredOther: 'Total Others Affected',
    totalInjuredDisabled: 'Total Disabled Affected',
    totalDeadMale: 'Total Male Dead',
    totalDeadFemale: 'Total Female Dead',
    totalDeadOther: 'Total Others Dead',
    totalDeadDisabled: 'Total Disabled Dead',
    verified: 'Verified',
    verificationMessage: 'Verification message',
    approved: 'Approved',

};
