import produce from 'immer';

import * as Type from './types';

import initialState from './initialState';

// Covid
export const SetNotificationPageAction = notificationPage => ({
    type: Type.PageType.SET_NOTIFICATION_PAGE,
    notificationPage,
});

// Covid
const setNotificationPage = (state: Type.NotificationState, action: Type.SetNotificationPage) => {
    const { notificationPage: {
        notificationData,
        notificationError,
        notificationsPending,
        showNotification,
    } } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (notificationData) {
            deferedState.notificationPage.notificationData = notificationData;
        }
        if (showNotification) {
            deferedState.notificationPage.showNotification = true;
        }
        if (!showNotification) {
            deferedState.notificationPage.showNotification = false;
        }
    });
    console.log('test new state');
    return newState;
};

export default function routeReducer(
    state = initialState,
    action: Type.PageActionTypes,
): Type.NotificationState {
    switch (action.type) {
        case Type.PageType.SET_NOTIFICATION_PAGE:
            return setNotificationPage(state, action);
        default:
            return state;
    }
}
