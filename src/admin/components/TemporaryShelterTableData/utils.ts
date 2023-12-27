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
    paNumber: 'pa नम्बर',
    entryDateBs: 'मिति',
    beneficiaryNameNepali: 'नाम',
    beneficiaryDistrict: 'जिल्ला',
    beneficiaryMunicipality: 'नगरपालिका',
    beneficiaryWard: 'वार्ड',
    toleName: 'tole नाम',
    grandParentName: 'हजुरबुबाको नाम',
    parentName: 'अभिभावकको नाम',
    beneficiaryRepresentativeNameNepali: 'लाभार्थी प्रतिनिधि नाम ',
    beneficiaryRepresentativeGrandfatherName: 'लाभार्थीप्रतिनिधि हजुरबुबाको नाम',
    beneficiaryRepresentativeParentName: 'लाभार्थीप्रतिनिधि अभिभावकको नाम',
    beneficiaryRepresentativeCitizenshipNumber: 'लाभार्थी प्रतिनिधि नागरिकता नम्बर',
    beneficiaryRepresentativeDistrict: 'लाभार्थी प्रतिनिधि जिल्ला',
    beneficiaryRepresentativeMunicipality: 'लाभार्थी प्रतिनिधि नगरपालिका',
    migrationCertificateNumber: 'माइग्रेसन सर्टिफिकेट नम्बर',
    migrationDateBs: 'माइग्रेसन मिति',
    withnessNameNepali: 'साक्षीको नाम',
    withnessRelation: 'साक्षीसंग सम्बन्ध',
    withnessContactNumber: 'साक्षी सम्पर्क नम्बर',
    temporaryShelterLandDistrict: 'अस्थायी आश्रय भूमि जिल्ला',
    temporaryShelterLandMunicipality: 'अस्थायी आश्रय भूमि नगरपालिका',
    temporaryShelterLandWard: 'अस्थायी आश्रय भूमि वार्ड',
    temporaryShelterLandTole: 'अस्थायी आश्रय भूमि टोल',
    bankAccountHolderName: 'बैंक खाता धारकको नाम',
    bankAccountNumber: 'बैँक खाता नम्बर',
    bankBranchName: 'बैंक शाखा नाम',
    bankName: 'बैंकको नाम',
    amount: 'पहिलो किस्ता रकम',
    secondTrancheEnrollmentForm: 'दोस्रो किस्ताको रकम लिइएको हो',
    action: 'कार्य',


};
