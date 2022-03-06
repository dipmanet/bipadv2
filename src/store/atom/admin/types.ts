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
export type AdminMenu = [];

export interface AdminState {
    adminPage: AdminPage;
    adminMenu: AdminMenu;
}


// ACTION TYPES

// eslint-disable-next-line import/prefer-default-export
export enum PageType {
    SET_ADMIN_PAGE = 'page/ADMIN/ADMIN_PAGE',
    SET_ADMIN_MENU = 'page/ADMIN/ADMIN_MENU',
}

// ACTION CREATOR INTERFACE

export interface SetAdminPage {
    type: typeof PageType.SET_ADMIN_PAGE;
    adminPage: AdminPage;
}

export interface SetAdminMenu {
    type: typeof PageType.SET_ADMIN_MENU;
    adminPage: AdminMenu;
}

export type PageActionTypes = (
    SetAdminPage | SetAdminMenu
);
