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
    sn: 'क्रम संख्या',
    province: "प्रदेश",
    district: "जिल्ला",
    municipality: "पालिका",
    totalFirstTrancheFormFilled: "कुल पहिलो किस्ता फारम भरिएको",
    totalFirstTrancheFormUploaded: "कुल पहिलो किस्ता फारम अपलोड गरिएको",
    totalSecondTrancheFormFilled: "कुल दोस्रो किस्ता फारम भरिएको",
    totalSecondTrancheFormUploaded: "कुल दोस्रो किस्ता फारम अपलोड गरिएको",

  };
