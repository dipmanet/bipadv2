// Check permission for the user
// eslint-disable-next-line import/prefer-default-export

import styles from './popupstyles.scss';

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

const dataItemsPopup = {
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

export const popupElement = (buildingData, msg, handleClick) => {
    const content = document.createElement('div');
    const heading = document.createElement('h2');
    heading.innerHTML = msg;
    heading.classList.add(styles.heading);
    content.classList.add(styles.content);
    content.appendChild(heading);

    if (Object.keys(buildingData).length > 2) {
        Object.keys(dataItemsPopup).map((item) => {
            const listItem = document.createElement('div');
            listItem.classList.add(styles.listItem);
            const l = document.createElement('span');
            const m = document.createElement('span');
            l.innerHTML = `${dataItemsPopup[item]}`;
            l.style.fontWeight = 'bold';
            m.innerHTML = `${buildingData[item]}`;
            m.classList.add(styles.m);
            listItem.appendChild(l);
            listItem.appendChild(m);
            content.appendChild(listItem);
            return null;
        });
    }
    const button = document.createElement('BUTTON');
    button.innerHTML = 'Add/Edit Details';
    button.addEventListener('click', handleClick, false);
    button.classList.add(styles.addButton);
    content.appendChild(button);

    return content;
};

const safeItems = {
    // Title: 'Safe Shelter House, Chanaura',
    Capacity: 'Shelter Capacity',
    altitude: 'Altitude',
    // precision: 'Precision',
    Ward: 'Ward',
    BuildingCo: 'Building Code',
    Cooking: 'Cooking',
    DisableFri: 'Disable Friendly',
    DrinkingWa: 'Drinking Water',
    Toilet: 'Toilet Available',
    AreInvento: 'Are inventories available for disaster response?',
    Structure: 'Structure(single or multiple storey)',
    'Local Add': 'Local Address',
};

export const popupElementFlood = (safeshelterObj) => {
    console.log('safeshelterObj', safeshelterObj);
    const content = document.createElement('div');
    const heading = document.createElement('h2');
    heading.innerHTML = safeshelterObj.Title;
    heading.classList.add(styles.heading);
    content.classList.add(styles.content);
    content.appendChild(heading);

    if (Object.keys(safeshelterObj).length > 2) {
        Object.keys(safeItems).map((item) => {
            const listItem = document.createElement('div');
            listItem.classList.add(styles.listItem);
            const l = document.createElement('span');
            const m = document.createElement('span');
            if (safeshelterObj[item]) {
                l.innerHTML = `${safeItems[item]}`;
                l.style.fontWeight = 'bold';
                m.innerHTML = `${safeshelterObj[item]}`;
                m.classList.add(styles.m);
                listItem.appendChild(l);
                listItem.appendChild(m);
                content.appendChild(listItem);
            }
            return null;
        });
    }
    return content;
};
