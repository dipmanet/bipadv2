const getOptions = (data, attribute) => data.filter(i => i.attribute === attribute)[0].choices;
// eslint-disable-next-line import/prefer-default-export
export const getBuildingOptions = (enumData: array) => (
    {
        physicalFactors: [
            {
                title: 'Houseowner ID',
                select: false,
            },
            {
                title: 'Foundation Type',
                options: getOptions(enumData, 'foundation_type'),
                select: true,
                placeholder: 'Please select the Foundation Type',
            },
            {
                title: 'Roof Type',
                options: getOptions(enumData, 'roof_type'),
                select: true,
                placeholder: 'Please select the Roof Type',
            },
            {
                title: 'Storeys',
                select: false,
            },
            {
                title: 'Ground Surface',
                options: getOptions(enumData, 'ground_surface'),
                select: true,
                placeholder: 'Please select the Ground Surface',
            },
            {
                title: 'Building Condition',
                options: getOptions(enumData, 'building_condition'),
                placeholder: 'Please select the Building Condition',
                select: true,
            },
            {
                title: 'Damage Grade',
                options: [
                    1,
                    2,
                    3,
                    4,
                    5,
                ],
                placeholder: 'Please select the Damage Grade',
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
        ],
        socialFactors: [
            {
                title: 'Number of People/House Members',
                select: false,
            },
            {
                title: 'Male Members',
                select: false,
            },
            {
                title: 'Female Members',
                select: false,
            },
            {
                title: 'Ownership of House',
                options: getOptions(enumData, 'ownership'),
                placeholder: 'Please select the Ownership of House',
                select: true,
            },
            {
                title: 'No. of Members (less than 5 years old)',
                select: false,
            },
            {
                title: 'No. of Members (65 years old and above)',
                select: false,
            },
            {
                title: 'People with Disability',
                select: false,
            },
            {
                title: 'Distance from Medical Centers (minutes)',
                select: false,
            },
            {
                title: 'Distance from Security Center (minutes)',
                select: false,
            },
            {
                title: 'Distance from School (minutes)',
                select: false,
            },
            {
                title: 'Distance from Open Space (minutes)',
                select: false,
            },
        ],
        economicFactor: [
            {
                title: 'Main source of income',
                options: getOptions(enumData, 'major_occupation'),
                placeholder: 'Please select the Main source of income',
                select: true,
            },
            {
                title: 'Supporting occupation',
                options: getOptions(enumData, 'supporting_occupation'),
                placeholder: 'Please select the Supporting occupation',
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
                placeholder: 'Please select the Sufficiency of Agriculture product (in months) ',
                select: true,
            },
        ],
    }

);

export const refData = {
    'Foundation Type': 'foundationType',
    'Roof Type': 'roofType',
    Storeys: 'storeys',
    'Ground Surface': 'groundSurface',
    'Distance from Road (meters)': 'roadDistance',
    'Drinking Water Distance (minutes)': 'drinkingWaterDistance',
    'Number of People/House Members': 'totalPopulation',
    'Male Members': 'noOfMale',
    'Female Members': 'noOfFemale',
    'No. of Members (65 years old and above)': 'seniorCitizens',
    'No. of Members (less than 5 years old)': 'childrenUnderFive',
    'Ownership of House': 'ownership',
    'People with Disability': 'peopleWithDisability',
    'Distance from Medical Centers (minutes)': 'healthPostDistance',
    'Distance from Security Center (minutes)': 'policeStationDistance',
    'Distance from School (minutes)': 'schoolDistance',
    'Distance from Open Space (minutes)': 'openSafeSpaceDistance',
    'Main source of income': 'majorOccupation',
    'Average yearly income (Nepalese Rupees)': 'averageAnnualIncome',
    'Sufficiency of Agriculture product (Months)': 'suffency',
    'Building Condition': 'buildingCondition',
    'Damage Grade': 'damageGrade',
    'Houseowner ID': 'houseOwnerId',
    'Supporting occupation': 'supportingOccupation',
};

export const getSelectTypes = data => [...new Set(data.filter(f => f.select).map(p => p.title))];
export const getInputTypes = data => [...new Set(data.filter(f => !f.select).map(p => p.title))];
