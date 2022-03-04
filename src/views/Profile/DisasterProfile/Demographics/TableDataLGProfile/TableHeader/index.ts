/* eslint-disable import/prefer-default-export */
export const TableHeader = () => (
    [{
        id: 1,
        data: [
            {
                category: 'Ward Number',
                subCategory: [],
                keyHeader: '',
                key: [],
            },
            {
                category: 'Education Attainment',

                subCategory: ['Primary', 'Lower Secondary',
                    'SLC or equivalent', 'Intermediate or equivalent',
                    'Bachelor or equivalent',
                    'Masters / Ph.D',
                    'No education',
                    'Other / Non-formal',
                    'Not eligible (less than 5 years of age)',
                    'Unknown'],
                keyHeader: 'educationLevel',
                key: [
                    'primary', 'lowerSecondary', 'slcOrEquivalent',
                    'intermediateOrEquivalent', 'bachelorOrEquivalent',
                    'mastersPhd', 'noEducation', 'otherNonformal', 'notEligible',
                    'unknown',
                ],
            },
            {
                category: 'Migration',
                subCategory: ['Mostly Present', 'Not present, inside Nepal',
                    'Not present, outside Nepal', 'Not known',
                ],
                keyHeader: 'migration',
                key: [
                    'mostlyPresent', 'notPresentInsideNepal', 'notPresentOutsideNepal',
                    'notKnown',
                ],
            },
            {
                category: 'Social Security ',
                subCategory: ['Elder citizen', 'Single women',
                    'Differently able', 'Extinct caste', 'Child security',
                    'Pension', 'Others', 'Not availed', 'Not applicable',
                ],
                keyHeader: 'socialSecurityBenefitAvailed',
                key: [
                    'elderCitizen', 'singleWomen', 'differentlyAble',
                    'extinctCaste', 'childSecurity', 'pension', 'others', 'notAvailed',
                    'notApplicable',
                ],
            },
            {
                category: 'People with Disability ',
                subCategory: ['Physical Disabilities', 'Visual Disabilities',
                    'Hearing Disabilities',
                    'Hearing-Visual Disabilities', 'Speaking Disabilities ',
                    'Mental Disabilities',
                    'Intellectual Disabilities', 'Multiple Disabilities ',
                ],
                keyHeader: 'disability',
                key: [
                    'physicalDisabilities', 'visualDisabilities', 'hearingDisabilities',
                    'hearingVisualDisabilities', 'speakingDisabilitiesking', 'mentalDisabilities',
                    'intellectualDisabilities', 'multipleDisabilities',

                ],
            },
            {
                category: 'Major occupation ',
                subCategory: ['Agriculture/livestock farming', 'Daily wage worker',
                    'Business', 'Service', 'Foreign employment ',
                    'Student', 'Other',
                ],
                keyHeader: 'majorOccupation',
                key: ['agriculture', 'dailyWageWorker',
                    'business', 'service', 'foreignEmployment',
                    'student', 'others',

                ],
            },
        ],
    },
    {
        id: 2,
        data: [
            {
                category: 'Ward Number',
                subCategory: [],
                keyHeader: '',
                key: [],
            },
            {
                category: 'Household Statistics ',

                subCategory: ['Female Headed Household', 'Household with Member Aged 60+',
                    'Number of Households with Differently able Individuals'],
                keyHeader: 'noOfHouseholds',
                key: ['femaleHeadedHouseholds', 'householdWithMemberAged60',
                    'numberOfHouseholdsWithDifferentlyAbleIndividual',
                ],
            },
            {
                category: 'Households Monthly Income ',
                subCategory: ['Less than NPR 15,000', 'NPR 15,000 - NPR 30,000',
                    'NPR 30,000 - NPR 60,000', 'NPR 60,000 - NPR 120,000', 'NPR 120,000 - NPR 240,000',
                    'More than NPR 240,000',
                ],
                keyHeader: 'householdIncome',
                key: ['lessThanNpr15', '15To30',
                    '30To60', '60To120', '120To240', 'moreThan240',
                ],
            },
            {
                category: 'Drinking Water',
                subCategory: ['Pipe Water at Home', 'Deep Boring',
                    'Tube well/Hand pump', 'Covered well', 'Open well',
                    'Ground water', 'River',
                ],
                keyHeader: 'drinkingWater',
                key: ['pipeWaterAtHome', 'deepBoring',
                    'tubeWellHandPump', 'coveredWell', 'openWell', 'groundWater',
                    'river',
                ],
            },
            {
                category: 'Buildings by number of resident house ',
                subCategory: ['0', '1',
                    '2', '3', '4 ',
                ],
                keyHeader: 'buildingsByResidentHh',
                key: ['0', '1',
                    '2', '4', 'fourMore',
                ],
            },

        ],
    },
    {
        id: 3,
        data: [
            {
                category: 'Ward Number',
                subCategory: [],
                keyHeader: '',
                key: [],
            },
            {
                category: 'Agriculture Practice',
                subCategory: ['Total Number of Household engaged in Agriculture',
                    'Household having own land for agriculture ', 'Household Raising Livestock For Agriculture Purposes'],
                keyHeader: 'agriculturePractice',
                key: ['totalNumberOfHouseholdEngagedInAgriculture', 'householdHavingOwnLandForAgriculture',
                    'householdRaisingLivestockForAgriculturePurposes',
                ],
            },
            {
                category: 'Major Agricultural products',
                subCategory: ['Cereals', 'Oilseeds',
                    'Vegetable crop', 'Spicy crops', 'Cash Crops',

                ],
                keyHeader: 'majorAgriProducts',
                key: ['cereals', 'oilseeds',
                    'vegetableCrop', 'spicyCrop', 'cashCrop',
                ],
            },
            // {
            //     category: 'Food Production ',
            //     subCategory: ['Less than 3 months', 'More than 3 months',
            //         '7-9 months', '9-12 months',
            //     ],
            // },


        ],
    },
    {
        id: 4,
        data: [
            {
                category: 'Ward Number',
                subCategory: [],
                keyHeader: '',
                key: [],
            },
            {
                category: 'Buildings by Type of Superstructure',

                subCategory: ['Adobe/Mud Construction', 'Bamboo', 'Timber', 'Cement Mortar - Brick',
                    'Cement Mortar - Stone', 'Mud Mortar - Brick',
                    'Mud Mortar - Stone',
                    'RC (Engineered)',
                    'RC (Non-Engineered)', 'Others'],
                keyHeader: 'buildingType',
                key: ['AdobeMudConstruction', 'bamboo',
                    'timber', 'cementBrick', 'cementStone',
                    'mudBrick', 'mudStone', 'rcEngg', 'rcNonEngg',
                    'other',
                ],
            },
            {
                category: 'Buildings by Type of Foundation',
                subCategory: ['Bamboo/Timber', 'Cement - Stone/Brick',
                    'Mud Mortar - Stone/Brick', 'RC', 'Others',
                ],
                keyHeader: 'buildingFoundationType',
                key: ['bambooTimber', 'cement',
                    'mud', 'reinforcedConcrete', 'other',
                ],
            },
        ],
    },
        // {
        //     id: 5,
        //     data: [
        //         {
        //             category: 'Ward Number',
        //             subCategory: [],
        //         },
        //         {
        //             category: 'Landuse Practice',

        //             subCategory: ['Agricultural Land',
        // 'Residential Area', 'Commercial Area', 'Industrial Area',
        //                 'Mines and Minerals area', 'Cultural and Archaeological Area',
        //                 'River and Lake Reservoir',
        //                 'Forest Area', 'Public Use and Open Space Area',
        //                 'Building Materials Excavation Area', 'Others'],
        //         },

        //     ],
        // },

    ]
);
