
export const mainHeading = [
    { id: 1, name: 'Incident wise details' },
    { id: 2, name: 'Hazardwise summary' },
    { id: 3, name: 'Temporal summary' },
    { id: 4, name: 'Locationwise summary' },
];

export const bodyheader = {
    'Incident wise details':
        [
            { id: 1, name: 'Verified', type: 'string', key: 'verified' },
            { id: 2, name: 'Title', type: 'string', key: 'title' },
            { id: 3, name: 'Description', type: 'string', key: 'description' },
            { id: 4, name: 'Source', type: 'string', key: 'source' },
            { id: 5, name: 'Hazard', type: 'string', key: 'hazardInfo.title' },
            { id: 6, name: 'Incident on', type: 'date', key: 'incidentOn' },
            { id: 7, name: 'Province', type: 'string', key: 'provinceTitle' },
            { id: 8, name: 'District', type: 'string', key: 'districtTitle' },
            { id: 9, name: 'Municipality', type: 'string', key: 'municipalityTitle' },
            { id: 10, name: 'Ward', type: 'string', key: 'wardTitle' },
            { id: 11, name: 'Total estimated loss (NPR)', type: 'numeric', key: 'loss.estimatedLoss' },
            { id: 12, name: 'Agriculture economic loss (NPR)', type: 'numeric', key: 'loss.agricultureEconomicLoss' },
            { id: 13, name: 'Infrastructure economic loss (NPR)', type: 'numeric', key: 'loss.infrastructureEconomicLoss' },
            { id: 14, name: 'Total infrastructure destroyed', type: 'numeric', key: 'loss.infrastructureDestroyedCount' },
            { id: 15, name: 'House destroyed', type: 'numeric', key: 'loss.infrastructureDestroyedHouseCount' },
            { id: 16, name: 'House affected', type: 'numeric', key: 'loss.infrastructureAffectedHouseCount' },
            { id: 17, name: 'Total livestock destroyed', type: 'numeric', key: 'loss.livestockDestroyedCount' },
            { id: 18, name: 'Total - People Death', type: 'numeric', key: 'loss.peopleDeathCount' },
            { id: 19, name: 'Male - People Death', type: 'numeric', key: 'loss.peopleDeathMaleCount' },
            { id: 20, name: 'Female - People Death', type: 'numeric', key: 'loss.peopleDeathFemaleCount' },
            { id: 21, name: 'Unknown - People Death', type: 'numeric', key: 'loss.peopleDeathUnknownCount' },
            { id: 22, name: 'Disabled - People Death', type: 'numeric', key: 'loss.peopleDeathDisabledCount' },
            { id: 23, name: 'Total - People Missing', type: 'numeric', key: 'loss.peopleMissingCount' },
            { id: 24, name: 'Male - People Missing', type: 'numeric', key: 'loss.peopleMissingMaleCount' },
            { id: 25, name: 'Female - People Missing', type: 'numeric', key: 'loss.peopleMissingFemaleCount' },
            { id: 26, name: 'Unknown - People Missing', type: 'numeric', key: 'loss.peopleMissingUnknownCount' },
            { id: 27, name: 'Disabled - People Missing', type: 'numeric', key: 'loss.peopleMissingDisabledCount' },
            { id: 28, name: 'Total - People Injured', type: 'numeric', key: 'loss.peopleInjuredCount' },
            { id: 29, name: 'Male - People Injured', type: 'numeric', key: 'loss.peopleInjuredMaleCount' },
            { id: 30, name: 'Female - People Injured', type: 'numeric', key: 'loss.peopleInjuredFemaleCount' },
            { id: 31, name: 'Unknown - People Injured', type: 'numeric', key: 'loss.peopleInjuredUnknownCount' },
            { id: 32, name: 'Disabled - People Injured', type: 'numeric', key: 'loss.peopleInjuredDisabledCount' },
        ],
    'Hazardwise summary':
        [
            { id: 1, name: 'Hazard Type', key: 'hazardInfo.title', type: 'string' },
            { id: 2, name: 'Number of incident', key: 'numberOfIncident', type: 'numeric' },
            { id: 3, name: 'People death', key: 'loss.peopleDeathCount', type: 'numeric' },
            { id: 4, name: 'People missing', key: 'loss.peopleMissingCount', type: 'numeric' },
            { id: 5, name: 'People injured', key: 'loss.peopleInjuredCount', type: 'numeric' },
            { id: 6, name: 'House destroyed', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
            { id: 7, name: 'House affected', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
            { id: 8, name: 'livestock destroyed', key: 'loss.livestockDestroyedCount', type: 'numeric' },
        ],
    'Temporal summary':
        [
            { id: 1, name: 'Year', key: 'incidentOn', type: 'string' },
            { id: 2, name: 'Number of incident', key: 'numberOfIncident', type: 'numeric' },
            { id: 3, name: 'People death', key: 'loss.peopleDeathCount', type: 'numeric' },
            { id: 4, name: 'People missing', key: 'loss.peopleMissingCount', type: 'numeric' },
            { id: 5, name: 'People injured', key: 'loss.peopleInjuredCount', type: 'numeric' },
            { id: 6, name: 'House destroyed', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
            { id: 7, name: 'House affected', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
            { id: 8, name: 'livestock destroyed', key: 'loss.livestockDestroyedCount', type: 'numeric' },
        ],
    'Locationwise summary':
        [
            { id: 1, name: 'Province', key: 'provinceTitle', type: 'string' },
            { id: 2, name: 'Number of incident', key: 'numberOfIncident', type: 'numeric' },
            { id: 3, name: 'People death', key: 'loss.peopleDeathCount', type: 'numeric' },
            { id: 4, name: 'People missing', key: 'loss.peopleMissingCount', type: 'numeric' },
            { id: 5, name: 'People injured', key: 'loss.peopleInjuredCount', type: 'numeric' },
            { id: 6, name: 'House destroyed', key: 'loss.infrastructureDestroyedHouseCount', type: 'numeric' },
            { id: 7, name: 'House affected', key: 'loss.infrastructureAffectedHouseCount', type: 'numeric' },
            { id: 8, name: 'livestock destroyed', key: 'loss.livestockDestroyedCount', type: 'numeric' },
        ],


};
