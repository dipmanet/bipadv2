import { User } from '#store/atom/auth/types';

const getCurrentSlug = () => {
    const location = window.location.href;
    const menuSlug = location.split(`${process.env.REACT_APP_DOMAIN}`)[1].split('/admin')[1];
    return menuSlug.split('/')[menuSlug.split('/').length - 1];
};

// eslint-disable-next-line import/prefer-default-export
export const getUserPermission = (user: User) => {
    const slug = getCurrentSlug();
    const pObj: string[] = [];
    if (user.isSuperuser) {
        return 'superuser';
    }
    if (user && slug) {
        const { groups } = user;
        if (user.groups && user.groups.length > 0) {
            groups.map((permObj) => {
                const p = permObj.permissions;
                p.map((perm) => {
                    if (perm.app === 'adminportal' && perm.codename.split('_')[0] === slug) {
                        pObj.push(perm.codename.split('_')[1]);
                    }
                    return null;
                });
                return null;
            });
        }
    }
    if (pObj.length > 0) {
        return pObj[0];
    }
    if (user && slug && user.userPermissions && user.userPermissions.length > 0) {
        user.userPermissions.map((uP) => {
            if (uP.app === 'adminportal' && uP.codename.split('_')[0] === slug) {
                pObj.push(uP.codename.split('_')[1]);
            }
            return null;
        });
    }
    return pObj[0];
};
