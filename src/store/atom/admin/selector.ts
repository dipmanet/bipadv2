/* eslint-disable import/prefer-default-export */
import { AppState } from '../../types';

export const adminPageSelector = (
    { admin }: AppState,
) => admin.adminPage;
export const adminMenuSelector = (
    { admin }: AppState,
) => admin.adminMenu;
