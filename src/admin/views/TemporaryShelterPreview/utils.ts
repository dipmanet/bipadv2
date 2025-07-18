// for loss api
export const lossFormDataInitial = {
    estimatedLoss: null,
};

// for incident api
export const incidentFormDataInitial = {
    title: '', // get title from selected geographic location
    cause: '', // use hazard inducer
    loss: '', // get loss id from loss api call
    verified: false,
    approved: false,
    incidentOn: Date,
    reportedOn: Date,
    verificationMessage: '',
    hazard: null, // Default 9 is for Epidemmic
    streetAddress: '', // use local address field
    point: {
        type: 'Point',
        coordinates: [
            0, // add long from map
            0, // add lat from map
        ],
    },
    wards: [],
    source: 'other',
};

// for loss-people api
export const deadMaleInitial = {
    status: 'dead',
    gender: 'male',
    count: '', // get total numner of male dead from form
    loss: '', // get loss id from loss api call
};
export const deadFemaleInitial = {
    status: 'dead',
    gender: 'female',
    count: '', // get total numner of female dead from form
    loss: '', // get loss id from loss api call
};
export const deadOtherInitial = {
    status: 'dead',
    gender: 'others',
    count: '', // get total numner of other dead from form
    loss: '', // get loss id from loss api call
};
export const deadDisabledInitial = {
    status: 'dead',
    disability: 1,
    count: '', // get total numner of disabled dead from form
    loss: '', // get loss id from loss api call
};
export const injuredMaleInitial = {
    status: 'injured',
    gender: 'male',
    count: '', // get total numner of male dead from form
    loss: '', // get loss id from loss api call
};
export const injuredFemaleInitial = {
    status: 'injured',
    gender: 'female',
    count: '', // get total numner of female dead from form
    loss: '', // get loss id from loss api call
};
export const injuredOtherInitial = {
    status: 'injured',
    gender: 'others',
    count: '', // get total numner of other dead from form
    loss: '', // get loss id from loss api call
};
export const injuredDisabledInitial = {
    status: 'injured',
    disability: 1,
    count: '', // get total numner of disabled dead from form
    loss: '', // get loss id from loss api call
};

export const agricultureEconomicLoss = {
    status: 'injured',
    gender: 'others',
    count: '', // get total numner of other dead from form
    loss: '', // get loss id from loss api call
};

export const infrastructureEconomicLoss = {
    status: 'injured',
    gender: 'others',
    count: '', // get total numner of other dead from form
    loss: '', // get loss id from loss api call
};

export const familyLoss = {
    status: 'injured',
    gender: 'others',
    count: '', // get total numner of other dead from form
    loss: '', // get loss id from loss api call
};

export const livestockDestroyed = {
    status: 'injured',
    gender: 'others',
    count: '', // get total numner of other dead from form
    loss: '', // get loss id from loss api call
};
