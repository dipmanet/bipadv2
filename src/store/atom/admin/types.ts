export interface AdminPage {
    adminDataMain: [];
    loadingAdmin: boolean;
    loadingAdminPost: boolean;
    postError: string;
    loadingAdminGetId: boolean;
    adminDataMainId: [];
    errorAdminId: string;
    loadingAdminPutUser: boolean;
}

export interface AdminState {
    adminPage: AdminPage;
}


// ACTION TYPES

// eslint-disable-next-line import/prefer-default-export
export enum PageType {
    SET_ADMIN_PAGE = 'page/ADMIN/ADMIN_PAGE',
}

// ACTION CREATOR INTERFACE

export interface SetAdminPage {
    type: typeof PageType.SET_ADMIN_PAGE;
    adminPage: AdminPage;
}

export type PageActionTypes = (
    SetAdminPage
);
