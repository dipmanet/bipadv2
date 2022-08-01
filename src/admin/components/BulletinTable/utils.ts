interface Point {
    type: string;
    coordinates: number[];

}
// eslint-disable-next-line import/prefer-default-export
export const incidentSummary = {
    numberOfIncidents: 0,
    numberOfDeath: 0,
    numberOfMissing: 0,
    numberOfInjured: 0,
    estimatedLoss: 0,
    roadBlock: 0,
    cattleLoss: 0,
};

export const peopleLoss = {
    p1: {
        death: 0,
        missing: 0,
        injured: 0,
    },
    p2: {
        death: 0,
        missing: 0,
        injured: 0,
    },
    bagmati: {
        death: 0,
        missing: 0,
        injured: 0,
    },
    gandaki: {
        death: 0,
        missing: 0,
        injured: 0,
    },
    lumbini: {
        death: 0,
        missing: 0,
        injured: 0,
    },
    karnali: {
        death: 0,
        missing: 0,
        injured: 0,
    },
    sudurpaschim: {
        death: 0,
        missing: 0,
        injured: 0,
    },

};

export const hazardWiseLoss = {
    पहिरो: {
        deaths: 0,
        incidents: 0,
    },
    'हुरी बतास': {
        deaths: 0,
        incidents: 0,
    },
    भूकम्प: {
        deaths: 0,
        incidents: 0,
    },
    'हेलिकप्टर दुर्घटना': {
        deaths: 0,
        incidents: 0,
    },
    डढेलो: {
        deaths: 0,
        incidents: 0,
    },
};

export const genderWiseLoss = {
    male: 0,
    female: 0,
    unknown: 0,
};

export const covid24hrsStat = {
    affected: 0,
    femaleAffected: 0,
    maleAffected: 0,
    deaths: 0,
    recovered: 0,
};

export const covidTotalStat = {
    totalAffected: 0,
    totalActive: 0,
    totalRecovered: 0,
    totalDeaths: 0,
};

export const vaccineStat = {
    firstDosage: 0,
    secondDosage: 0,
};

export const covidProvinceWiseTotal = {
    p1: {
        totalAffected: 0,
        totalActive: 0,
        totalDeaths: 0,
    },
    p2: {
        totalAffected: 0,
        totalActive: 0,
        totalDeaths: 0,
    },
    bagmati: {
        totalAffected: 0,
        totalActive: 0,
        totalDeaths: 0,
    },
    gandaki: {
        totalAffected: 0,
        totalActive: 0,
        totalDeaths: 0,
    },
    lumbini: {
        totalAffected: 0,
        totalActive: 0,
        totalDeaths: 0,
    },
    karnali: {
        totalAffected: 0,
        totalActive: 0,
        totalDeaths: 0,
    },
    sudurpaschim: {
        totalAffected: 0,
        totalActive: 0,
        totalDeaths: 0,
    },
};

export const nepaliRef = {
    numberOfIncidents: 'घटना संख्या',
    numberOfDeath: 'मृत्‍यु संख्या',
    numberOfMissing: 'बेपत्ता संख्या',
    numberOfInjured: 'घाइते संख्या',
    estimatedLoss: 'अनुमानित क्ष्यती (लाख)',
    roadBlock: 'सडक अवरोध',
    cattleLoss: 'चौपाय',
    p1: 'प्रदेश न. १',
    p2: 'मधेश',
    sudurpaschim: 'सुदुर्पस्चिम',
    lumbini: 'लुम्बिनी',
    karnali: 'कर्णाली',
    bagmati: 'बाग्मति',
    gandaki: 'गण्डकी',
    death: 'मृत्यु संख्या',
    deaths: 'मृत्यु संख्या',
    missing: 'हराइरहेको संख्या',
    injured: 'घाइतेको संख्या',
    incidents: 'घटना',
    male: 'पुरुष',
    female: 'महिला',
    unknown: 'पहिचान नभएको',
    affected: 'संक्रमित संख्या',
    femaleAffected: 'मिहला संक्रमित संख्या',
    maleAffected: 'पुरुष संक्रमित संख्या',
    recovered: 'निको भएका संख्या',
    totalAffected: 'कुल संक्रमित संन्ख्या',
    totalActive: 'कुल सक्रिय संक्रमित संन्ख्या',
    totalDeaths: 'कुल मृत्‍यु संन्ख्या',
    totalRecovered: 'कुल निको भएका संन्ख्या',
    firstDosage: 'पहिलो मात्रा',
    secondDosage: 'दोस्रो मात्रा',
};


export const tableTitleRefOld = {
    sitrep: 'Sit Rep',
    province: 'Province',
    district: 'District',
    municipality: 'Municipality',
    ward: 'Ward',
    modifiedOn: 'Modified on',
    pdfFile: 'Bulletin PDF',
    dailySummary: 'Daily Summary',
    numberOfIncidents: 'No of Incidents',
    numberOfDeath: 'Deaths',
    numberOfMissing: 'Missing',
    numberOfInjured: 'Injured',
    estimatedLoss: 'Estimated Loss',
    roadBlock: 'Road Block',
    cattleLoss: 'Cattle Loss',
    p1DeathLoss: 'Province 1 Death',
    p1MissingLoss: 'Province 1 Missing',
    p1InjuredLoss: 'Province 1 Injured',
    p2DeathLoss: 'Province 2 Death',
    p2MissingLoss: 'Province 2 Missing',
    p2InjuredLoss: 'Province 2 Injured',
    p3DeathLoss: 'Bagmati Death',
    p3MissingLoss: 'Bagmati Missing',
    p3InjuredLoss: 'Bagmati Injured',
    p4DeathLoss: 'Gandaki Death',
    p4MissingLoss: 'Gandaki Missing',
    p4InjuredLoss: 'Gandaki Injured',
    p5DeathLoss: 'Lumbini Death',
    p5MissingLoss: 'Lumbini Missing',
    p5InjuredLoss: 'Lumbini Injured',
    p6DeathLoss: 'Karnali Death',
    p6MissingLoss: 'Karnali Missing',
    p6InjuredLoss: 'Karnali Injured',
    p7DeathLoss: 'Sudur Paschim Death',
    p7MissingLoss: 'Sudur Paschim Missing',
    p7InjuredLoss: 'Sudur Paschim Injured',
    deathMale: 'Total Death (Male)',
    deathFemale: 'Total Death (Female)',
    deathOther: 'Total Death (Other)',
    covidAffectedDaily: 'COVID-19 Affected (24 Hrs)',
    covidfemaleAffectedDaily: 'COVID-19 Affected Female (24 Hrs)',
    covidmaleAffectedDaily: 'COVID-19 Affected Male (24 Hrs)',
    coviddeathsDaily: 'COVID-19 Deaths (24 Hrs)',
    covidrecoveredDaily: 'COVID-19 Recovered (24 Hrs)',
    totalAffected: 'COVID-19 Total Affected',
    totalActive: 'COVID-19 Total Active',
    totalRecovered: 'COVID-19 Total Recovered',
    totalDeaths: 'COVID-19 Total Deaths',
    firstDosage: 'First Dosage',
    secondDosage: 'Second Dosage',
    covidp1totalAffected: 'Province 1 Covid Affected',
    covidp1totalActive: 'Province 1 Covid Active',
    covidp1totalDeaths: 'Province 1 Covid Death',
    covidp2totalAffected: 'Province 2 Covid Affected',
    covidp2totalActive: 'Province 2 Covid Active',
    covidp2totalDeaths: 'Province 2 Covid Death',
    covidp3totalAffected: 'Bagmati Covid Affected',
    covidp3totalActive: 'Bagmati Covid Active',
    covidp3totalDeaths: 'Bagmati Covid Death',
    covidp4totalAffected: 'Gandaki Covid Affected',
    covidp4totalActive: 'Gandaki Covid Active',
    covidp4totalDeaths: 'Gandaki Covid Death',
    covidp5totalAffected: 'Lumbini Covid Affected',
    covidp5totalActive: 'Lumbini Covid Active',
    covidp5totalDeaths: 'Lumbini Covid Death',
    covidp6totalAffected: 'Karnali Covid Affected',
    covidp6totalActive: 'Karnali Covid Active',
    covidp6totalDeaths: 'Karnali Covid Death',
    covidp7totalAffected: 'Sudurpaschim Covid Affected',
    covidp7totalActive: 'Sudurpaschim Covid Active',
    covidp7totalDeaths: 'Sudurpaschim Covid Death',
    // action: 'Actions',
};
export const tableTitleRef = {
    sitrep: 'Sit Rep',
    createdOn: 'Created on',
    modifiedOn: 'Modified on',
    pdfFile: 'Download Bulletin',
};
