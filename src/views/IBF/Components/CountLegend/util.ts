// eslint-disable-next-line import/prefer-default-export
export const valueToScore = (name, value) => {
    if (name === 'historicalImpactssndDamage') {
        if (value.every(i => i.value)) {
            return 55;
        }
        if (value.some(i => i.value)) {
            return 27.5;
        }
        if (value.every(i => i.value === null || i.value === 'null')) {
            return -1;
        }
        return 0;
    }

    if (name === 'incomeSource') {
        const count = value && value.split(',').length;
        if (count >= 2) return 0;
        if (count === 1) return 10;
        if (value === null || value === 'null') return -1;
    }


    if (name === 'numberofDependentPop') {
        const count = value.reduce((a, c) => a + c.value, 0);
        if (count === 1 || count === 2) return 7.5;
        if (count > 2) return 15;
        if (value === null || value === 'null') return -1;
        return count;
    }
    if (name === 'vicinityToRivers') {
        if (value === 'Less than 100 m') return 45;
        if (value === '100-500 m') return 22.5;
        if (value === '500 m– 1 km' || value === 'More than 1 km') return 0;
        if (value === null || value === 'null') return -1;
    } else if (name === 'femaleHeadedHousehold') {
        if (value) return 5;
        if (value === null || value === 'null') return -1;
        return 0;
    } else if (name === 'annualIncome') {
        if (value === 'More than 1 lakh') return 0;
        if (value === 'Less than 40 thousand') return 15;
        if (value === '40-60 thousand' || value === '60 thousand to 1 lakh') return 7.5;
        if (value === null || value === 'null') return -1;
    } else if (name === 'houseType') {
        if (value === 'Reinforced, Well-built structure') return 0;
        if (value === 'Made of ordinary bricks, Blocks, Prefave, Metc.al, Zinc sheets etc.'
        || value === 'Made of ordinary bricks, Blocks, Prefave, Metal, Zinc sheets, etc.') return 15;

        if (value === 'Local house made of stone, Rural structures – mud, bamboo, bricks, etc.'
         || value === 'Local stone-made, Rural structures – mud, bamboo, bricks, etc.') return 30;
        if (value === null || value === 'null') return -1;
    } else if (name === 'floodImpactInHouse') {
        if (value === '1-2 times') return 0;
        if (value === '3-4 times') return 12.5;
        if (value === '5-6 times' || value === '7-8 times' || value === 'More than 8 times') return 25;
        if (value === null || value === 'null') return -1;
    } else if (name === 'hasAccessToDrinkingWater') {
        if (value) return 0;
        if (value === null || value === 'null') return -1;
        return 10;
    } else if (name === 'hasAccessToEarlyWarningInformation') {
        if (value) return 0;
        if (value === null || value === 'null') return -1;
        return 30;
    } else if (name === 'hasInvolvmentToCommunityGroup') {
        if (value) return 0;
        if (value === null || value === 'null') return -1;
        return 10;
    } else if (name === 'hasAccessToFinancialServices') {
        if (value) return 0;
        if (value === null || value === 'null') return -1;
        return 10;
    } else if (name === 'hasAvailabilityOfSocialSecurity') {
        if (value) return 0;
        if (value === null || value === 'null') return -1;
        return 10;
    } else if (name === 'distanceToSafeShelter') {
        if (value === 'Within 10 minutes' || value === '10 minutes to half an hour') return 10;
        if (value === 'Half an hour to 1 hour' || value === 'More than 1 hour') return 0;
        if (value === null || value === 'null') return -1;
        return 20;
    } else if (name === 'educationLevel') {
        if (value === 'Illiterate') return 10;
        if (value === 'Class 5' || value === 'Graduate' || value === 'Secondary Level') return 5;
        if (value === 'Literate') return 0;
        if (value === null || value === 'null') return -1;
    }
    return '';
};
