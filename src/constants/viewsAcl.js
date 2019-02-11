/*
const notExportCreatable = ({ isLoggedIn, hasAnalysisFramework, exportPermissions }) => (
    !isLoggedIn || !hasAnalysisFramework || !exportPermissions.create
);
*/

// NOTE: route related to a project should either have
// projectPermissions.view or any other permissions
const acl = {
    dashboard: {},
    riskInfo: {},
    capacityAndResources: {},
    inicidents: {},

    projectDenied: {},
    fourHundredThree: {},
    fourHundredFour: {},
};

export default acl;
