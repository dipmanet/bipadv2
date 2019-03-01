import { compose, createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createLogger from '#redux/middlewares/logger';
import reducer from '#redux/reducers';

import {
    isDevelopment,
    // isTesting,
} from '#config/env';
import {
    actionsToSkipLogging,
} from '#config/store';

export interface AppState {
    lang?: {
        strings?: {
            [key: string]: string;
        };
    };
}

const initialState: AppState = {
    lang: {
        strings: {
            name: 'hari',
            age: '12',
        },
    },
};

const prepareStore = (): Store<AppState> => {
    const middleware = [
        createLogger(actionsToSkipLogging),
    ];

    // Override compose if development mode and redux extension is installed
    const overrideCompose = !!composeWithDevTools && isDevelopment;
    const options = {
        // specify extention's options here
        actionsBlacklist: actionsToSkipLogging,
    };

    const applicableCompose = !overrideCompose
        ? compose
        : composeWithDevTools(options);

    const enhancer = applicableCompose(
        applyMiddleware(...middleware),
    );

    return createStore(reducer, initialState as any, enhancer);
};

// NOTE: replace 'undefined' with an initialState in future if needed, this is a temporary fix
// const store = !isTesting ? prepareStore() : { getState: () => ({ lang: {} }) };
export default prepareStore();
