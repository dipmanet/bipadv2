// export const riskScoreParams = [
//     'Risk Score At Household Level',
//     'Hazard Exposure At Household Level',
//     'Vulnerability At Household Level',
//     'Lack of Coping Capacity At Household Level',
//     'Historical Impact & Damage At Household Level',
//     'HHs Distance from River',
//     'Number of Dependent Population',
//     'Head of Household',
//     'Income Source',
//     'Annual Income',
//     'House Type',
//     'Flood Impact in House',
//     'Access to Drinking Water',
//     'Early Warning Info Access',
//     'Involvement of Family',
//     'Access to Financial',
//     'Education Level',
//     'Availability of Social Security',
//     'Distance to Safe Shelther',
// ];
export const riskScoreParams = [
    {
        id: 'risk',
        title: 'Risk Score At Household Level',
    },
    {
        id: 'hazard',
        title: 'Hazard Exposure At Household Level',
    },
    {
        id: 'vulnerability',
        title: 'Vulnerability At Household Level',
    },
    {
        id: 'lackOfCopingCapacity',
        title: 'Lack of Coping Capacity At Household Level',
    },
    {
        id: 'historicalImpactsAndDamage',
        title: 'Historical Impact & Damage At Household Level',
    },
    {
        id: 'vicinityToRivers',
        title: 'HHs Distance from River',
    },
    {
        id: 'numberOfDependentPop',
        title: 'Number of Dependent Population',
    },
    {
        id: 'femaleHeadedHousehold',
        title: 'Head of Household',
    },
    {
        id: 'incomeSource',
        title: 'Income Source',
    },
    {
        id: 'annualIncome',
        title: 'Annual Income',
    },
    {
        id: 'houseType',
        title: 'House Type',
    },
    {
        id: 'floodImpactInHouse',
        title: 'Flood Impact in House',
    },
    {
        id: 'floodImpactInHouse',
        title: 'Flood Impact in House',
    },
    {
        id: 'accessToDrinkingWater',
        title: 'Access to Drinking Water',
    },
    {
        id: 'earlyWarningInformationAccess',
        title: 'Early Warning Info Access',
    },
    {
        id: 'involvementOfFamily',
        title: 'Involvement of Family',
    },
    {
        id: 'accessToFinancial',
        title: 'Access to Financial',
    },
    {
        id: 'educationLevel',
        title: 'Education Level',
    },
    {
        id: 'availabilityOfSocialSecurity',
        title: 'Availability of Social Security',
    },
    {
        id: 'distanceToSafeShelter',
        title: 'Distance to Safe Shelther',
    },
    {
        id: 'impactedFive',
        title: 'Five year impact',
    },
    {
        id: 'impactedTwenty',
        title: 'Twenty year impact',
    },
    {
        id: 'impactedTwo',
        title: 'Two year impact',
    },
];

export const existingRiskRange = {
    risk: [
        {
            indicator: 'Very High',
            range: [6.5, 10],
            color: '#9D3C3D',
            legend: 'riskVeryHigh',
        },
        {
            indicator: 'High',
            range: [5.0, 6.5],
            color: '#C24F34',
            legend: 'riskHigh',
        },
        {
            indicator: 'Medium',
            range: [3.5, 5.0],
            color: '#EEA541',
            legend: 'riskMedium',
        },
        {
            indicator: 'Low',
            range: [2.0, 3.5],
            color: '#799655',
            legend: 'riskLow',
        },
        {
            indicator: 'Very Low',
            range: [0, 2.0],
            color: '#489DDA',
            legend: 'riskVeryLow',
        },
    ],
    hazard: [
        {
            indicator: 'Very High',
            range: [6.5, 10],
            color: '#9D3C3D',
            legend: 'hazardVeryHigh',
        },
        {
            indicator: 'High',
            range: [5.0, 6.5],
            color: '#C24F34',
            legend: 'hazardHigh',

        },
        {
            indicator: 'Medium',
            range: [3.5, 5.0],
            color: '#EEA541',
            legend: 'hazardMedium',

        },
        {
            indicator: 'Low',
            range: [2.0, 3.5],
            color: '#799655',
            legend: 'hazardLow',

        },
        {
            indicator: 'Very Low',
            range: [0, 2.0],
            color: '#489DDA',
            legend: 'hazardVeryLow',

        },
    ],
    vulnerability: [
        {
            indicator: 'Very High',
            range: [6.5, 10],
            color: '#9D3C3D',
            legend: 'vulnerabilityVeryHigh',

        },
        {
            indicator: 'High',
            range: [5.0, 6.5],
            color: '#C24F34',
            legend: 'vulnerabilityHigh',

        },
        {
            indicator: 'Medium',
            range: [3.5, 5.0],
            color: '#EEA541',
            legend: 'vulnerabilityMedium',

        },
        {
            indicator: 'Low',
            range: [2.0, 3.5],
            color: '#799655',
            legend: 'vulnerabilityLow',

        },
        {
            indicator: 'Very Low',
            range: [0, 2.0],
            color: '#489DDA',
            legend: 'vulnerabilityVeryLow',

        },
    ],
    lackOfCopingCapacity: [
        {
            indicator: 'Very High',
            range: [6.5, 10],
            color: '#9D3C3D',
            legend: 'lackofcopingVeryHigh',
        },
        {
            indicator: 'High',
            range: [5.0, 6.5],
            color: '#C24F34',
            legend: 'lackofcopingHigh',

        },
        {
            indicator: 'Medium',
            range: [3.5, 5.0],
            color: '#EEA541',
            legend: 'lackofcopingMedium',

        },
        {
            indicator: 'Low',
            range: [2.0, 3.5],
            color: '#799655',
            legend: 'lackofcopingLow',

        },
        {
            indicator: 'Very Low',
            range: [0, 2.0],
            color: '#489DDA',
            legend: 'lackofcopingVeryLow',

        },
    ],
    historicalImpactsAndDamage: [
        {
            indicator: 'Human AND Economic Loss',
            range: [55],
            color: '#C85041',
            legend: 'historicalAndLoss',

        },
        {
            indicator: 'Human OR Economic Loss',
            range: [27.5],
            color: '#DCA75B',
            legend: 'historicalOrLoss',
        },
        {
            indicator: 'No Loss',
            range: [0],
            color: '#94C268',
            legend: 'historicalNoLoss',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noHistoricalLossData',
        },
    ],
    vicinityToRivers: [
        {
            indicator: '< 100m',
            range: [45],
            color: '#C85041',
            legend: 'vicinityLessthan100',

        },
        {
            indicator: '100 to 500m',
            range: [22.5],
            color: '#DCA75B',
            legend: 'vicinityBetween100and500',

        },
        {
            indicator: '> 500m',
            range: [0],
            color: '#94C268',
            legend: 'vicinityMorethan500',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noVicinityData',
        },
    ],
    numberOfDependentPop: [
        {
            indicator: 'None',
            range: [0],
            color: '#94C268',
            legend: 'numberOfDependentNone',

        },
        {
            indicator: '1 to 2 Dependent People',
            range: [7.5],
            color: '#DCA75B',
            legend: 'numberOfDependentBetween1and2',
        },
        {
            indicator: '> 2 Dependent People',
            range: [15],
            color: '#C85041',
            legend: 'numberOfDependentMorethan2',
        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noNumberOfDependentData',
        },
    ],
    femaleHeadedHousehold: [
        {
            indicator: 'Female Headed HHs',
            range: [5],
            color: '#C85041',
            legend: 'femaleHeadedHousehold',
        },
        // {
        //     indicator: 'Male Headed HHs',
        //     range: [0],
        //     color: '#94C268',
        //     legend: 'maleHeadedHousehold',
        // },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noFemaleHeadedData',
        },
    ],
    incomeSource: [
        {
            indicator: 'HHs with Single Occupation',
            range: [10],
            color: '#C85041',
            legend: 'incomeSourceSingle',

        },
        {
            indicator: 'HHs with Multiple Occupation',
            range: [0],
            color: '#94C268',
            legend: 'incomeSourceMultiple',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noIncomeSourceTypeData',
        },
    ],
    annualIncome: [
        {
            indicator: '>NPR 100,000',
            range: [0],
            color: '#94C268',
            legend: 'annualIncomeMorethan100000',
        },
        {
            indicator: 'NPR 40,000-100,000',
            range: [7.5],
            color: '#DCA75B',
            legend: 'annualIncomeBetween40000and100000',
        },
        {
            indicator: '<NPR 40,000',
            range: [15],
            color: '#C85041',
            legend: 'annualIncomeLessthan40000',
        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noAnnualIncomeData',
        },
    ],
    houseType: [
        {
            indicator: 'Made from Local Stone',
            range: [30],
            color: '#C85041',
            legend: 'houseTypeLocal',

        },
        {
            indicator: 'Block and Prefab',
            range: [15],
            color: '#DCA75B',
            legend: 'houseTypePrefab',

        },
        {
            indicator: 'Well made(RCC)',
            range: [0],
            color: '#94C268',
            legend: 'houseTypeRcc',
        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noHouseTypeData',
        },
    ],
    floodImpactInHouse: [
        {
            indicator: '> 5 Times',
            range: [25],
            color: '#C85041',
            legend: 'floodImpactInHouseMorethan5',

        },
        {
            indicator: '3 to 5 Times',
            range: [12.5],
            color: '#DCA75B',
            legend: 'floodImpactInHouseBetween3and5',

        },
        {
            indicator: '< 2 Times',
            range: [0],
            color: '#94C268',
            legend: 'floodImpactInHouseLessthan2',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noFloodImpactData',
        },
    ],
    accessToDrinkingWater: [
        {
            indicator: 'Access to Drinking Water',
            range: [0],
            color: '#94C268',
            legend: 'accessToDrinkingWater',

        },
        {
            indicator: 'No Access to Drinking Water',
            range: [10],
            color: '#C85041',
            legend: 'noAccessToDrinkingWater',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noAccessToDrinkingWaterData',
        },
    ],
    earlyWarningInformationAccess: [
        {
            indicator: 'Access To Early Warning Information',
            range: [0],
            color: '#94C268',
            legend: 'earlyWarningInformationAccess',

        },
        {
            indicator: 'No Access To Early Warning Information',
            range: [30],
            color: '#C85041',
            legend: 'earlyWarningInformationNoAccess',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noEarlyWarningData',
        },
    ],
    involvementOfFamily: [
        {
            indicator: 'Involvement Of family',
            range: [0],
            color: '#94C268',
            legend: 'involvementOfFamily',

        },
        {
            indicator: 'No Involvement Of family',
            range: [10],
            color: '#C85041',
            legend: 'noInvolvementOfFamily',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noFamilyInvolvementData',
        },
    ],
    accessToFinancial: [
        {
            indicator: 'Access To Financial',
            range: [0],
            color: '#94C268',
            legend: 'accessToFinancial',

        },
        {
            indicator: 'No Access To Financial',
            range: [10],
            color: '#C85041',
            legend: 'noAccessToFinancial',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noFinancialData',
        },
    ],
    educationLevel: [
        {
            indicator: 'Literate',
            range: [0],
            color: '#94C268',
            legend: 'educationLevelLiterate',
        },
        {
            indicator: 'Formal',
            range: [5],
            color: '#DCA75B',
            legend: 'educationLevelFormal',

        },
        {
            indicator: 'Illiterate',
            range: [10],
            color: '#C85041',
            legend: 'educationLevelIlliterate',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noEducationData',
        },
    ],
    availabilityOfSocialSecurity: [
        {
            indicator: 'Access To Social Security',
            range: [0],
            color: '#94C268',
            legend: 'accessToSocial',

        },
        {
            indicator: 'No Access To Social Security',
            range: [10],
            color: '#C85041',
            legend: 'noAccessToSocial',

        },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noSocialData',
        },
    ],
    distanceToSafeShelter: [
        {
            indicator: '30 mins To Safe Shelter',
            range: [10],
            color: '#94C268',
            legend: 'thirtyminsToSafeShelter',

        },
        {
            indicator: '>30 mins To Safe Shelter',
            range: [0],
            color: '#DCA75B',
            legend: 'morethan30minsToSafeShelter',

        },
        // {
        //     indicator: 'No Access To Safe Shelter',
        //     range: [20],
        //     color: '#C85041',
        //     legend: 'noAccessToSafeShelter',

        // },
        {
            indicator: 'Data not available',
            range: [-1],
            color: 'gray',
            legend: 'noSafeShelterData',

        },
    ],
    impactScore: [
        {
            indicator: 'Very High',
            range: [10.0, 15.0],
            color: '#DB4439',
            legend: 'veryHighImpact',

        },
        {
            indicator: 'High',
            range: [5.0, 9.0],
            color: '#E7A54B',
            legend: 'highImpact',

        },
        {
            indicator: 'Medium',
            range: [3.0, 4.0],
            color: '#ADB014',
            legend: 'mediumImpact',
        },
        {
            indicator: 'Low',
            range: [1.0, 2.0],
            color: '#85C55B',
            legend: 'lowImpact',

        },
        {
            indicator: 'No Impact',
            range: [],
            color: 'gray',
            legend: 'noImpact',

        },
    ],
};
