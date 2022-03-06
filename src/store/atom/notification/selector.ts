/* eslint-disable import/prefer-default-export */
import { AppState } from '../../types';

export const notificationPageSelector = (
    { notification }: AppState,
) => notification.notificationPage;
