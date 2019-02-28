/*
const notExportCreatable = ({ isLoggedIn, hasAnalysisFramework, exportPermissions }) => (
    !isLoggedIn || !hasAnalysisFramework || !exportPermissions.create
);
*/

const acl = {
    dashboard: {},
    riskInfo: {},
    capacityAndResources: {},
    incidents: {},
    response: {},

    projectDenied: {},
    fourHundredThree: {},
    fourHundredFour: {},
};

export default acl;
