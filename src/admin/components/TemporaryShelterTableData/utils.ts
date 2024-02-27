/* eslint-disable @typescript-eslint/indent */
/* eslint-disable quotes */
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
  action: "कार्य",
  id: "लाभग्राही क्रम संंख्या",
  paNumber: "सम्झौता क्रमााङ्क संंख्या",
  registrationNumber: "दर्ता नम्बर",
  entryDateBs: "पहिलो किस्ता दर्ता मिति",
  beneficiaryNameNepali: "नाम",
  beneficiaryDistrict: "जिल्ला",
  beneficiaryMunicipality: "नगरपालिका",
  beneficiaryWard: "वार्ड",
  toleName: "टोल",
  grandParentName: "हजुरबुबाको नाम",
  parentName: "अभिभावकको नाम",
  withnessNameNepali: "साक्षीको नाम",
  withnessRelation: "साक्षीसंग सम्बन्ध",
  withnessContactNumber: "साक्षी सम्पर्क नम्बर",
  temporaryShelterLandDistrict: "अस्थायी आश्रय भूमि जिल्ला",
  temporaryShelterLandMunicipality: "अस्थायी आश्रय भूमि नगरपालिका",
  temporaryShelterLandWard: "अस्थायी आश्रय भूमि वार्ड",
  temporaryShelterLandTole: "अस्थायी आश्रय भूमि टोल",
  amount: "पहिलो किस्ताको रकम लिइएको हो",
  firstTrancheObtainedDate: "पहिलो किस्ता प्राप्त मिति",
  secondTrancheRegisteredDate: "दोस्रो किस्ताको दर्ता मिति",
  secondTrancheEnrollmentForm: "दोस्रो किस्ताको रकम लिइएको हो",
  secondTrancheObtainedDate: "दोस्रो किस्ता प्राप्त मिति",
};
