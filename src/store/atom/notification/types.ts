export interface NotificationPage {
    notificationData: [];
    notificationError: {};
    notificationsPending: boolean;
    showNotification: boolean;
}

export interface NotificationState {
    notificationPage: NotificationPage;
}


// ACTION TYPES

// eslint-disable-next-line import/prefer-default-export
export enum PageType {
    SET_NOTIFICATION_PAGE = 'page/NOTIFICATION/NOTIFICATION_PAGE',
}

// ACTION CREATOR INTERFACE

export interface SetNotificationPage {
    type: typeof PageType.SET_NOTIFICATION_PAGE;
    notificationPage: NotificationPage;
}

export type PageActionTypes = (
    SetNotificationPage
);
