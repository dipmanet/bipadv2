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

    estimatedLoss: null,
    agricultureEconomicLoss: null,
    infrastructureEconomicLoss: null,
    infrastructureDestroyedCount: null,
    infrastructureDestroyedHouseCount: null,
    infrastructureAffectedHouseCount: null,
    livestockDestroyedCount: null,
    totalInjuredMale: null,
    totalInjuredFemale: null,
    totalInjuredOther: null,
    totalInjuredDisabled: null,
    peopleMissingMaleCount: null,
    peopleMissingFemaleCount: null,
    peopleMissingOtherCount: null,
    peopleMissingDisabledCount: null,
    totalDeadMale: null,
    totalDeadFemale: null,
    totalDeadOther: null,
    totalDeadDisabled: null,
};
export const tableTitleRef = {
    id: 'आईडी',
    entryDateBs: 'मिति',
    beneficiaryNameNepali: 'नाम',
    beneficiaryDistrict: 'जिल्ला',
    beneficiaryMunicipality: 'नगरपालिका',
    beneficiaryWard: 'वार्ड',
    action: 'कार्य',

};
