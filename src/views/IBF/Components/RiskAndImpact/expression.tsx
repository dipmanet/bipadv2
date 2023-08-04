/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-continue */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable import/prefer-default-export */
export const getExistingRiskData = (householdDistrictAverage) => {
    const existingRiskData = [
        {
            title: 'Risk',
            score: householdDistrictAverage ? householdDistrictAverage.avg_risk_score : 'N/A',
            key: 'risk',
            content: [
                {
                    key: 'Risk Score',
                    value: 'risk',
                },
                {
                    key: 'Hazard Exposure',
                    value: 'hazard',
                },
                {
                    key: 'Vulnerability',
                    value: 'vulnerability',
                },
                {
                    key: 'Lack Of Coping Capacity',
                    value: 'lackOfCopingCapacity',
                },
            ],
        },
        {
            title: 'Hazard',
            score: householdDistrictAverage ? householdDistrictAverage.avg_hazard_and_exposure : 'N/A',
            key: 'hazard',
            content: [
                {
                    key: 'Historical Impacts and damage',
                    value: 'historicalImpactsAndDamage',
                },
                {
                    key: 'Vicinity to rivers',
                    value: 'vicinityToRivers',
                },
            ],
        },

        {
            title: 'Vulnerability',
            score: householdDistrictAverage ? householdDistrictAverage.avg_vulnerability : 'N/A',
            key: 'vulnerability',
            content: [
                {
                    key: 'Number of dependent population',
                    value: 'numberOfDependentPop',
                },
                {
                    key: 'Female headed household',
                    value: 'femaleHeadedHousehold',
                },
                {
                    key: 'Income Source',
                    value: 'incomeSource',
                },
                {
                    key: 'Annual Income',
                    value: 'annualIncome',
                },
                {
                    key: 'House Type',
                    value: 'houseType',
                },
                {
                    key: 'Flood impact in past 30 years',
                    value: 'floodImpactInHouse',
                },
            ],
        },

        {
            title: 'Lack of Coping Capacity',
            score: householdDistrictAverage ? householdDistrictAverage.avg_lack_of_coping_capacity : 'N/A',
            key: 'lackofcoping',
            content: [
                {
                    key: 'Access to drinking water',
                    value: 'accessToDrinkingWater',
                },
                {
                    key: 'Early warning info access',
                    value: 'earlyWarningInformationAccess',
                },
                {
                    key: 'Involvement of family',
                    value: 'involvementOfFamily',
                },
                {
                    key: 'Access to financial',
                    value: 'accessToFinancial',
                },
                {
                    key: 'Education Level',
                    value: 'educationLevel',
                },
                {
                    key: 'Availability of social security',
                    value: 'availabilityOfSocialSecurity',
                },
                {
                    key: ' Distance to safe shelter',
                    value: 'distanceToSafeShelter',
                },
            ],
        },
    ];
    return existingRiskData;
};

const impactedValues = [
    'Early Messaging',
    'House Strengthening',
    'Early Harvasting',
    'Wall Support',
    'Cash Transfer Assistance',
    'Evaculation',
    'These households are not impacted by the forecasted flood events.',
];
const getSlice = (a, b) => impactedValues.slice(a, b);


export const getImpactedValue = (indicatorValue, countValue, setImpactedValue) => {
    switch (indicatorValue) {
        case 'Very High':
            setImpactedValue({ impactVal: getSlice(0, 6), ind: indicatorValue, countValue });
            break;
        case 'High':
            setImpactedValue({ impactVal: getSlice(0, 6), ind: indicatorValue, countValue });
            break;
        case 'Medium':
            setImpactedValue({ impactVal: getSlice(0, 4), ind: indicatorValue, countValue });
            break;
        case 'Low':
            setImpactedValue({ impactVal: getSlice(0, 3), ind: indicatorValue, countValue });
            break;
        case 'No Impact':
            setImpactedValue({ impactVal: getSlice(6, 7), ind: indicatorValue, countValue });
            break;
        default:
            break;
    }
};


export const calculation = (data, indicators) => {
    const datas = data;
    let normalized_hazard_and_exposure;
    let normalized_vulnerability;
    let normalized_lack_of_coping_capacity;
    let normalized_risk_score;
    let min_vulnerability_value = 1000;
    let max_vulnerability_value = 0;
    let min_hazard_value = 1000;
    let max_hazard_value = 0;
    let min_cop_capacity = 1000;
    let max_cop_capacity = 0;
    let riskAverage = 0;
    let hazardAverage = 0;
    let vulnerabilityAverage = 0;
    let copingCapacityAverage = 0;
    const weightCalculation = (indicatorData, indicatorName, subIndicatorName) => {
        const weight = indicatorData
            .find(i => i.indicatorName === indicatorName).subindicators
            .find(d => d.subIndicatorName === subIndicatorName).weightInPercent;
        return weight;
    };
    const socialScoreCalculation = (subIndicatorName, componentValue) => {
        const { score } = indicators.find(i => i.indicatorName === 'Social').subindicators
            .find(d => d.subIndicatorName === subIndicatorName)
            .subindicatorComponents.find(r => r.component === componentValue);
        return score;
    };

    // const listKeys = [
    //     'hasAccessToDrinkingWater', 'hasAccessToEarlyWarningInformation', 'hasInvolvmentToCommunityGroup',
    //     'hasAccessToFinancialServices', 'hasAvailabilityOfSocialSecurity',
    //     'educationLevel', 'hasAvailabilityOfSocialSecurity', 'annualIncome',
    //     'houseTypeWall', 'floodImpactInThirtyYears', 'vicinityToRivers', 'hasHouseDamage',
    //     'hasLivelihoodAffect', 'hasLossOfFamilyMembers',
    //     'floodReturnPeriod',
    // ];

    // const nullValueCheck = (dataItem) => {
    //     for (const i of listKeys) {
    //         if (dataItem[i] === null) {
    //             return true;
    //         }
    //     }
    //     return false;
    // };

    for (const i of datas) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        i.coping_capacity_score = null;
        i.vulnerability_score = null;
        i.hazardExposure_score = null;
        i.normalized_risk_score = null;
        i.normalized_lack_of_coping_capacity = null;
        i.normalized_hazard_and_exposure = null;
        i.normalized_vulnerability = null;
        // if (nullValueCheck(i)) {
        //     continue;
        // }

        const hazard1_score = i.hasHouseDamage && i.hasLivelihoodAffect && i.hasLossOfFamilyMembers
            ? 1
            : (i.hasHouseDamage || i.hasLivelihoodAffect || i.hasLossOfFamilyMembers)
                ? 0.5 : 0;
        const hazard2_score = i.vicinityToRivers === 'Less than 100 m' ? 1 : i.vicinityToRivers === '100-500 m' ? 0.5 : 0;
        const hazard3_score = i.floodReturnPeriod <= 20 ? 1 : i.floodReturnPeriod > 20 ? 0.5 : 0;
        const hazard1_weight = weightCalculation(indicators, 'Hazard and Exposure', 'Historical Impacts and Damage (Loss of family members, House damage, Livelihood affect)');

        const hazard2_weight = weightCalculation(indicators, 'Hazard and Exposure', 'Vicinity to Rivers');
        const hazard3_weight = weightCalculation(indicators, 'Hazard and Exposure', 'Flood hazard map of meteor zoning');
        const cop_capacity1_score = i.hasAccessToDrinkingWater ? 0 : 1;
        const cop_capacity2_score = i.hasAccessToEarlyWarningInformation ? 0 : 1;
        const cop_capacity3_score = i.hasInvolvmentToCommunityGroup ? 0 : 1;
        const cop_capacity4_score = i.hasAccessToFinancialServices ? 0 : 1;
        const cop_capacity5_score = i.educationLevel === 'Illiterate' ? 1 : i.educationLevel === ' Literate' ? 0.5 : 0;
        const cop_capacity6_score = i.hasAvailabilityOfSocialSecurity ? 0 : 1;
        const cop_capacity7_score = i.distanceOfSafeShelter === '10 minutes to half an hour' || i.distanceOfSafeShelter === 'Within 10 minutes'
            ? 0
            : i.distanceOfSafeShelter === 'Half an hour to 1 hour' || i.distanceOfSafeShelter === 'More than 1 hour'
                ? 0.5 : 1;
        const cop_capacity1_weight = weightCalculation(indicators, 'Coping Capacity Indicators', 'Access to drinking water');
        const cop_capacity2_weight = weightCalculation(indicators, 'Coping Capacity Indicators', 'Early warning Information Access');
        const cop_capacity3_weight = weightCalculation(indicators, 'Coping Capacity Indicators', 'Involvement of family member in community group');
        const cop_capacity4_weight = weightCalculation(indicators, 'Coping Capacity Indicators', 'Access to financial services');
        const cop_capacity5_weight = weightCalculation(indicators, 'Coping Capacity Indicators', 'Education Level');
        const cop_capacity6_weight = weightCalculation(indicators, 'Coping Capacity Indicators', 'Availability of Social Security');
        const cop_capacity7_weight = weightCalculation(indicators, 'Coping Capacity Indicators', 'Distance to safe shelter');


        let social1_score;
        let social2_score;
        const economic1_score = i.isOtherJob ? 0 : 1;
        const economic2_score = i.annualIncome === 'Less than 40 thousand' ? 1 : i.annualIncome === 'More than 1 lakh' ? 0 : 0.5;
        const economic1_weight = weightCalculation(indicators, 'Economic', 'Income Source');
        const economic2_weight = weightCalculation(indicators, 'Economic', 'Annual Income');

        const physical1_score = i.houseTypeWall === 'Local house made of stone, Rural structures – mud, bamboo, bricks, etc.'
            ? 1 : i.houseTypeWall === 'Reinforced, Well-built structure'
                ? 0 : i.houseTypeWall === 'Made of ordinary bricks, Blocks, Prefave, Metc.al, Zinc sheets etc.'
                    ? 0.5 : 0;
        const physical2_score = i.floodImpactInThirtyYears === '1-2 times' ? 0 : i.floodImpactInThirtyYears === '3-4 times' ? 0.5 : 1;
        const physical1_weight = weightCalculation(indicators, 'Physical', 'House Type');
        const physical2_weight = weightCalculation(indicators, 'Physical', 'Flood impact in house/land in the past 30 years (Flood frequency)');


        const social1_total = i.numberOfChildren + i.numberOfElderly + i.numberOfDisabled + i.numberOfPregnantLactating;
        const social2_total = i.isFemaleHeadedHousehold ? 1 : 0;
        const social1_weight = weightCalculation(indicators, 'Social', 'Number of Dependant Population (Children, Elderly, Disabled, Pregnant/Lactating)');
        const social2_weight = weightCalculation(indicators, 'Social', 'Female Headed Household');
        if (social1_total > 2) {
            social1_score = socialScoreCalculation('Number of Dependant Population (Children, Elderly, Disabled, Pregnant/Lactating)', 'More than 2');
        } else if (social1_total > 1) {
            social1_score = socialScoreCalculation('Number of Dependant Population (Children, Elderly, Disabled, Pregnant/Lactating)', '1 to 2');
        } else {
            social1_score = socialScoreCalculation('Number of Dependant Population (Children, Elderly, Disabled, Pregnant/Lactating)', '0');
        }


        if (social2_total === 1) {
            social2_score = socialScoreCalculation('Female Headed Household', 'Yes');
        } else {
            social2_score = socialScoreCalculation('Female Headed Household', 'No');
        }

        const cop_capacity1_final_value = (cop_capacity1_weight * cop_capacity1_score) / 100;
        const cop_capacity2_final_value = (cop_capacity2_weight * cop_capacity2_score) / 100;
        const cop_capacity3_final_value = (cop_capacity3_weight * cop_capacity3_score) / 100;
        const cop_capacity4_final_value = (cop_capacity4_weight * cop_capacity4_score) / 100;
        const cop_capacity5_final_value = (cop_capacity5_weight * cop_capacity5_score) / 100;
        const cop_capacity6_final_value = (cop_capacity6_weight * cop_capacity6_score) / 100;
        const cop_capacity7_final_value = (cop_capacity7_weight * cop_capacity7_score) / 100;


        const economic1_final_value = (economic1_weight * economic1_score) / 100;
        const economic2_final_value = (economic2_weight * economic2_score) / 100;
        const economic = economic1_final_value + economic2_final_value;

        const social1_final_value = (social1_weight * social1_score) / 100;
        const social2_final_value = (social2_weight * social2_score) / 100;
        const social = social1_final_value + social2_final_value;

        const physical1_final_value = (physical1_weight * physical1_score) / 100;
        const physical2_final_value = (physical2_weight * physical2_score) / 100;
        const physical = physical1_final_value + physical2_final_value;

        const hazard1_final_value = (hazard1_weight * hazard1_score) / 100;
        const hazard2_final_value = (hazard2_weight * hazard2_score) / 100;
        const hazard3_final_value = (hazard3_weight * hazard3_score) / 100;
        const hazard = Number((hazard1_final_value + hazard2_final_value + hazard3_final_value).toFixed(4));
        const vulnerability = Number((social + economic + physical).toFixed(4));
        const coping_capacity = Number((cop_capacity1_final_value + cop_capacity2_final_value
          + cop_capacity3_final_value + cop_capacity4_final_value
          + cop_capacity5_final_value + cop_capacity6_final_value + cop_capacity7_final_value).toFixed(4));
        i.coping_capacity_score = coping_capacity;
        i.vulnerability_score = vulnerability;
        i.hazardExposure_score = hazard;

        if (coping_capacity < min_cop_capacity) {
            min_cop_capacity = coping_capacity;
        }
        if (coping_capacity > max_cop_capacity) {
            max_cop_capacity = coping_capacity;
        }

        if (hazard < min_hazard_value) {
            min_hazard_value = hazard;
        }
        if (hazard > max_hazard_value) {
            max_hazard_value = hazard;
        }

        if (vulnerability < min_vulnerability_value) {
            min_vulnerability_value = vulnerability;
        }
        if (vulnerability > max_vulnerability_value) {
            max_vulnerability_value = vulnerability;
        }
    }


    for (const i of datas) {
        normalized_hazard_and_exposure = Number((((i.hazardExposure_score - min_hazard_value) / (max_hazard_value - min_hazard_value)) * 10).toFixed(4));
        normalized_vulnerability = Number((((i.vulnerability_score - min_vulnerability_value) / (max_vulnerability_value - min_vulnerability_value)) * 10).toFixed(4));
        normalized_lack_of_coping_capacity = Number((((i.coping_capacity_score - min_cop_capacity) / (max_cop_capacity - min_cop_capacity)) * 10).toFixed(4));
        normalized_risk_score = Number(((normalized_vulnerability ** (1 / 3)) * (normalized_hazard_and_exposure ** (1 / 3)) * (normalized_lack_of_coping_capacity ** (1 / 3))).toFixed(4));
        let riskLevel;
        let floodDepthLevel;
        if (normalized_risk_score < 2) {
            riskLevel = 1;
        } else if (normalized_risk_score < 3.5) {
            riskLevel = 2;
        } else if (normalized_risk_score < 5) {
            riskLevel = 3;
        } else if (normalized_risk_score < 6.5) {
            riskLevel = 4;
        } else {
            riskLevel = 5;
        }
        if (i.floodDepth === 0) {
            floodDepthLevel = 0;
        } else if (i.floodDepth < 1) {
            floodDepthLevel = 1;
        } else if (i.floodDepth < 2) {
            floodDepthLevel = 2;
        } else {
            floodDepthLevel = 3;
        }
        const impactScore = riskLevel * floodDepthLevel;
        i.impactScore = impactScore;
        i.normalized_risk_score = normalized_risk_score;
        i.normalized_lack_of_coping_capacity = normalized_lack_of_coping_capacity;
        i.normalized_hazard_and_exposure = normalized_hazard_and_exposure;
        i.normalized_vulnerability = normalized_vulnerability;
        riskAverage += normalized_risk_score;

        hazardAverage += normalized_hazard_and_exposure;
        vulnerabilityAverage += normalized_vulnerability;
        copingCapacityAverage += normalized_lack_of_coping_capacity;
    }

    const vulnerability = {};
    const hazard = {};
    const copingCapacity = {};
    for (const i of indicators) {
        if (i.indicatorName === 'Social' || i.indicatorName === 'Economic' || i.indicatorName === 'Physical') {
            for (const j of i.subindicators) {
                vulnerability[j.subIndicatorName] = {};
                vulnerability[j.subIndicatorName].id = j.id;
                vulnerability[j.subIndicatorName].weight = j.weightInPercent;
            }
        }
        if (i.indicatorName === 'Hazard and Exposure') {
            for (const j of i.subindicators) {
                hazard[j.subIndicatorName] = {};
                hazard[j.subIndicatorName].id = j.id;
                hazard[j.subIndicatorName].weight = j.weightInPercent;
            }
        }
        if (i.indicatorName === 'Coping Capacity Indicators') {
            for (const j of i.subindicators) {
                copingCapacity[j.subIndicatorName] = {};
                copingCapacity[j.subIndicatorName].id = j.id;
                copingCapacity[j.subIndicatorName].weight = j.weightInPercent;
            }
        }
    }

    riskAverage = Number(((riskAverage) / (datas.length)).toFixed(4));
    hazardAverage = Number(((hazardAverage) / (datas.length)).toFixed(4));
    vulnerabilityAverage = Number(((vulnerabilityAverage) / (datas.length)).toFixed(4));
    copingCapacityAverage = Number(((copingCapacityAverage) / (datas.length)).toFixed(4));
    const finalDatas = [{
        houseHoldDatas: datas,
        averageDatas: {
            avg_risk_score: riskAverage,
            avg_vulnerability: vulnerabilityAverage,
            avg_lack_of_coping_capacity: copingCapacityAverage,
            avg_hazard_and_exposure: hazardAverage,
        },
        weight_Data: {
            vulnerability,
            hazard,
            lackofcopingcapacity: copingCapacity,
        },
    }];
    return finalDatas;
};
