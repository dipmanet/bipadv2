const getOptions = (data, attribute) => data.filter(i => i.attribute === attribute)[0].choices;
// eslint-disable-next-line import/prefer-default-export
export const getBuildingOptions = (enumData: array) => (
    {
        physicalFactors: [
            {
                title: 'Foundation Type',
                options: getOptions(enumData, 'foundation_type'),
                select: true,
            },
            {
                title: 'Roof Type',
                options: getOptions(enumData, 'roof_type'),
                select: true,
            },
            {
                title: 'Storeys',
                select: false,
            },
            {
                title: 'Ground Surface',
                options: getOptions(enumData, 'ground_surface'),
                select: true,
            },
            {
                title: 'Building Condition',
                options: getOptions(enumData, 'building_condition'),

                select: true,
            },
            {
                title: 'Damage Grade',
                options: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                ],
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
                select: true,
            },
        ],

    }

);
