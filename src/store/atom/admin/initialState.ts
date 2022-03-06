import { AdminState } from './types';

const state: AdminState = {
    adminPage: {
        adminDataMain: [],
        loadingAdmin: true,
        loadingAdminPost: false,
        postError: '',
        loadingAdminGetId: false,
        adminDataMainId: [],
        errorAdminId: '',
        loadingAdminPutUser: false,
    },
    adminMenu: [],
};
export default state;
