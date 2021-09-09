// Check permission for the user
// eslint-disable-next-line import/prefer-default-export
export const checkPermission = (user, codeName, app) => {
    let permission = false;
    if (!user) {
        permission = false;
    } else if (user.isSuperuser) {
        permission = true;
    }
    if (user && user.groups) {
        user.groups.forEach((group) => {
            if (group.permissions) {
                group.permissions.forEach((p) => {
                    if (p.codename === codeName && p.app === app) {
                        permission = true;
                    }
                });
            } else {
                permission = false;
            }
        });
    }
    if (user && user.userPermissions) {
        user.userPermissions.forEach((a) => {
            if (a.codename === codeName && a.app === app) {
                permission = true;
            }
        });
    } else {
        permission = false;
    }
    return permission;
    // temporary set true to all user for testing
    // return true;
};

export const dataItemsPopup = {
    buildingCondition: 'Building Condition',
    storeys: 'Storyes',
    groundSurface: 'Ground Surface',
    foundationType: 'Foundation Type',
    roofType: 'Roof Type',
    damageGrade: 'Damage Grade',
    nameOfHouseOwner: 'Name of House Owner',
    ageOfHouseOwner: 'Age of House Owner',
    ownership: 'Ownership',
    noOfMale: 'No. of Males',
    noOfFemale: 'No. of Females',
    noOfOther: 'No. of Others Gender',
    totalPopulation: 'Total Population',
    peopleWithDisability: 'People with Disability',
    seniorCitizens: 'Senior Citizens',
    chronicallyIll: 'Chronically Ill',
    pregnantWomen: 'Pregnant Women',
    childrenUnderFive: 'Children Under Five',
    singleWomen: 'Single Women',
    majorOccupation: 'Major Occupation',
    supportingOccupation: 'Supporting Occupation',
    averageAnnualIncome: 'Average Annual Income',
    healthPostDistance: 'Health Post Distance',
    schoolDistance: 'School Distance',
    roadDistance: 'Road Distance',
    policeStationDistance: 'Police Station Distance',
    drinkingWaterDistance: 'Drinking Wate Distance',
    openSafeSpaceDistance: 'Open Space Distance',
    flashFlood: 'Flash Flood',
};
