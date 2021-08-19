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
