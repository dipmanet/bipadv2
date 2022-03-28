export interface UserPermission {
    codename: string;
    app: string;
}

export interface GroupPermission {
    id: number;
    name: string;
    permissions: UserPermission[];
}

export interface User {
    id: number;
    email?: string;
    username: string;

    dateJoined?: string; // date
    firstName?: string;
    groups: GroupPermission[];
    isActive: boolean;
    isStaff: boolean;
    isSuperuser: boolean;
    lastLogin?: string; // date
    lastName?: string;
    profile: {
        district?: number;
        id: number;
        municipality?: number;
        optEmailNotification: boolean;
        optSmsNotification: boolean;
        organization?: number;
        phoneNumber?: string;
        province?: number;
        region?: 'national' | 'province' | 'district' | 'municipality';
        user: number;
    };
    userPermissions: UserPermission[];
}
// eslint-disable-next-line import/prefer-default-export
export interface AuthState {
    authenticated: boolean;
    sessionId?: string;
    csrftoken?: string;
    user?: User;
}

// eslint-disable-next-line import/prefer-default-export
export enum AuthType {
    SET_AUTH = 'auth/SET_AUTH',
    SET_USER_DETAIL = 'auth/SET_USER_DETAIL',
}

export interface SetAuthAction {
    type: typeof AuthType.SET_AUTH;
    authState: AuthState;
}

export interface SetUserDetailAction {
    type: typeof AuthType.SET_USER_DETAIL;
    user: User;
}

export type AuthActionTypes = SetAuthAction | SetUserDetailAction;
