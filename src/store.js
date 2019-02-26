import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from '#redux/middlewares/logger';
import siloBackgroundTasks from '#redux/middlewares/siloBackgroundTasks';
import { createActionSyncMiddleware } from '#rsu/redux-sync';

import reducer from '#redux/reducers';
import {
    isDevelopment,
    isTesting,
} from '#config/env';
import {
    reducersToSync,
    actionsToSkipLogging,
    uniqueTabId,
} from '#config/store';

const prepareStore = () => {
    // Invoke refresh access token every 10m
    const middleware = [
        createLogger(actionsToSkipLogging),
        createActionSyncMiddleware(reducersToSync, uniqueTabId),
        siloBackgroundTasks,
        thunk,
    ];

    // Get compose from Redux Devtools Extension
    // eslint-disable-next-line no-underscore-dangle
    const reduxExtensionCompose = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    // Override compose if development mode and redux extension is installed
    const overrideCompose = reduxExtensionCompose && (
        isDevelopment
    );
    const applicableComposer = !overrideCompose
        ? compose
        : reduxExtensionCompose({
            actionsBlacklist: actionsToSkipLogging,
        /* specify extention's options here */
        });

    const enhancer = applicableComposer(
        applyMiddleware(...middleware),
    );
    return createStore(reducer, undefined, enhancer);
};

// NOTE: replace 'undefined' with an initialState in future if needed, this is a temporary fix
const store = !isTesting ? prepareStore() : { getState: () => ({ lang: {} }) };
export default store;
