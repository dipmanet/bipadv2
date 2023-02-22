export const mainHeading = [
    { id: 1, name: 'Incident-wise details', nameNe: 'घटना अनुसार विवरण' },
    { id: 2, name: 'Hazard-wise summary', nameNe: 'प्रकोप अनुसार विवरण' },
    { id: 3, name: 'Temporal summary', nameNe: 'समय अनुसार विवरण ' },
    { id: 4, name: 'Location-wise summary', nameNe: 'स्थान अनुसार विवरण' },
];

export const bodyheader = {
    'Incident-wise details':
        [
            { id: 1, name: 'Verified', nameNe: 'प्रमाणित', type: 'string', key: 'verified' },
            { id: 2, name: 'Title', nameNe: 'शीर्षक', type: 'string', key: 'title', keyNe: 'titleNe' },
            { id: 3, name: 'Description', nameNe: 'विवरण ', type: 'string', key: 'description' },
            { id: 4, name: 'Source', nameNe: 'स्रोत', type: 'string', key: 'source' },
            { id: 5, name: 'Hazard', nameNe: 'प्रकोप', type: 'string', key: 'hazardInfo.title', keyNe: 'hazardInfo.titleNe' },
            { id: 6, name: 'Incident on', nameNe: 'घटना ', type: 'date', key: 'incidentOn' },
            { id: 7, name: 'Province', nameNe: 'प्रदेश', type: 'string', key: 'provinceTitle', keyNe: 'provinceTitleNe' },
            { id: 8, name: 'District', nameNe: 'जिल्‍ला', type: 'string', key: 'districtTitle', keyNe: 'districtTitleNe' },
            { id: 9, name: 'Municipality', nameNe: 'नगरपालिका', type: 'string', key: 'municipalityTitle', keyNe: 'municipalityTitleNe' },
            { id: 10, name: 'Ward', nameNe: 'वडा', type: 'string', key: 'wardTitle' },
            { id: 11, name: 'Total estimated loss (NPR)', nameNe: 'कुल अनुमानित क्षति (रु)', type: 'numeric', key: 'loss.estimatedLoss' },
            { id: 12, name: 'Agriculture economic loss (NPR)', nameNe: 'कृषि आर्थिक क्षति (रु)', type: 'numeric', key: 'loss.agricultureEconomicLoss' },
            { id: 13, name: 'Infrastructure economic loss (NPR)', nameNe: 'पूर्वाधारको आर्थिक क्षति (रु)', type: 'numeric', key: 'loss.infrastructureEconomicLoss' },
            { id: 14, name: 'Total infrastructure destroyed', nameNe: 'कुल पूर्वाधारको नोक्सान', type: 'numeric', key: 'loss.infrastructureDestroyedCount' },
            { id: 15, name: 'House destroyed', nameNe: 'घरधुरी नोक्सान', type: 'numeric', key: 'loss.infrastructureDestroyedHouseCount' },
            { id: 16, name: 'House affected', nameNe: 'घरधुरी प्रभावित', type: 'numeric', key: 'loss.infrastructureAffectedHouseCount' },
            { id: 17, name: 'Total livestock destroyed', nameNe: 'कुल पशुचौपाया क्षति', type: 'numeric', key: 'loss.livestockDestroyedCount' },
            { id: 18, name: 'Total - People Death', nameNe: 'कुल मृत्यु संख्या', type: 'numeric', key: 'loss.peopleDeathCount' },
            { id: 19, name: 'Male - People Death', nameNe: 'पुरुष – मृत्यु संख्या', type: 'numeric', key: 'loss.peopleDeathMaleCount' },
            { id: 20, name: 'Female - People Death', nameNe: 'महिला – मृत्यु संख्या', type: 'numeric', key: 'loss.peopleDeathFemaleCount' },
            { id: 21, name: 'Unknown - People Death', nameNe: 'अज्ञात – मृत्यु संख्या', type: 'numeric', key: 'loss.peopleDeathUnknownCount' },
            { id: 22, name: 'Disabled - People Death', nameNe: 'अपाङ्ग – मृत्यु संख्या', type: 'numeric', key: 'loss.peopleDeathDisabledCount' },
            { id: 23, name: 'Total - People Missing', nameNe: 'कुल – हराएका मानिस संख्या', type: 'numeric', key: 'loss.peopleMissingCount' },
            { id: 24, name: 'Male - People Missing', nameNe: 'पुरुष - हराएका मानिस संख्या', type: 'numeric', key: 'loss.peopleMissingMaleCount' },
            { id: 25, name: 'Female - People Missing', nameNe: 'महिला - हराएका मानिस संख्या', type: 'numeric', key: 'loss.peopleMissingFemaleCount' },
            { id: 26, name: 'Unknown - People Missing', nameNe: 'अज्ञात - हराएका मानिसहरु', type: 'numeric', key: 'loss.peopleMissingUnknownCount' },
            { id: 27, name: 'Disabled - People Missing', nameNe: 'अपाङ्ग - हराएका मानिसहरु', type: 'numeric', key: 'loss.peopleMissingDisabledCount' },
            { id: 28, name: 'Total - People Injured', nameNe: 'कुल – घाइते संख्या', type: 'numeric', key: 'loss.peopleInjuredCount' },
            { id: 29, name: 'Male - People Injured', nameNe: 'पुरुष – घाइते संख्या', type: 'numeric', key: 'loss.peopleInjuredMaleCount' },
            { id: 30, name: 'Female - People Injured', nameNe: 'महिला – घाइते संख्या', type: 'numeric', key: 'loss.peopleInjuredFemaleCount' },
            { id: 31, name: 'Unknown - People Injured', nameNe: 'अज्ञात – घाइते संख्या', type: 'numeric', key: 'loss.peopleInjuredUnknownCount' },
            { id: 32, name: 'Disabled - People Injured', nameNe: 'अपाङ्ग – घाइते संख्या', type: 'numeric', key: 'loss.peopleInjuredDisabledCount' },
        ],
    'Hazard-wise summary':
        [
            { id: 1, name: 'Hazard Type', nameNe: 'प्रकोपका प्रकार', key: 'hazardInfo.title', keyNe: 'hazardInfo.titleNe', type: 'string' },
            { id: 2, name: 'Number of incident', nameNe: 'घटना संख्या', key: 'numberOfIncident', type: 'numeric' },
            { id: 3, name: 'People death', nameNe: 'मृत्यु संख्या', key: 'loss.peopleDeathCount', type: 'numeric' },
            { id: 4, name: 'People missing', nameNe: 'हराएका मानिस संख्या', key: 'loss.peopleMissingCount', type: 'numeric' },
            { id: 5, name: 'People injured', nameNe: 'घाइते संख्या', key: 'loss.peopleInjuredCount', type: 'numeric' },
            { id: 6, name: 'House destroyed', nameNe: 'घरधुरी नष्ट', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
            { id: 7, name: 'House affected', nameNe: 'घरधुरी प्रभावित', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
            { id: 8, name: 'Livestock destroyed', nameNe: 'गाईवस्तु नष्ट', key: 'loss.livestockDestroyedCount', type: 'numeric' },
        ],
    'Temporal summary':
        [
            { id: 1, name: 'Year', nameNe: 'वर्ष', key: 'incidentOn', type: 'date' },
            { id: 2, name: 'Number of incident', nameNe: 'घटना संख्या', key: 'numberOfIncident', type: 'numeric' },
            { id: 3, name: 'People death', nameNe: 'मृत्यु संख्या', key: 'loss.peopleDeathCount', type: 'numeric' },
            { id: 4, name: 'People missing', nameNe: 'हराएका मानिस संख्या', key: 'loss.peopleMissingCount', type: 'numeric' },
            { id: 5, name: 'People injured', nameNe: 'घाइते संख्या', key: 'loss.peopleInjuredCount', type: 'numeric' },
            { id: 6, name: 'House destroyed', nameNe: 'घरधुरी नष्ट', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
            { id: 7, name: 'House affected', nameNe: 'घरधुरी प्रभावित', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
            { id: 8, name: 'Livestock destroyed', nameNe: 'गाईवस्तु नष्ट', key: 'loss.livestockDestroyedCount', type: 'numeric' },
        ],
    'Location-wise summary':
        [
            { id: 1, name: 'Province', nameNe: 'प्रदेश', key: 'provinceTitle', keyNe: 'provinceTitleNe', type: 'string' },
            { id: 2, name: 'Number of incident', nameNe: 'घटना संख्या', key: 'numberOfIncident', type: 'numeric' },
            { id: 3, name: 'People death', nameNe: 'मृत्यु संख्या', key: 'loss.peopleDeathCount', type: 'numeric' },
            { id: 4, name: 'People missing', nameNe: 'हराएका मानिस संख्या', key: 'loss.peopleMissingCount', type: 'numeric' },
            { id: 5, name: 'People injured', nameNe: 'घाइते संख्या', key: 'loss.peopleInjuredCount', type: 'numeric' },
            { id: 6, name: 'House destroyed', nameNe: 'घरधुरी नष्ट', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
            { id: 7, name: 'House affected', nameNe: 'घरधुरी प्रभावित', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
            { id: 8, name: 'Livestock destroyed', nameNe: 'गाईवस्तु नष्ट', key: 'loss.livestockDestroyedCount', type: 'numeric' },
        ],


};
