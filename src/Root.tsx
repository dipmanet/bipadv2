import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, Persistor } from 'redux-persist';

import styleProperties from '#constants/styleProperties';
import ReduxContext from '#components/ReduxContext';

import { addIcon } from '#rscg/Icon';
import { iconNames } from '#constants';

import store from '#store';
import { AppState } from '#store/types';
import {
    initializeStyles,
    setStyleProperties,
} from '#rsu/styles';

import App from './App';

interface State {
    rehydrated: boolean;
}
interface Props {
}

/* Loads redux into memory */
/* Create redux context */
export default class Root extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = { rehydrated: false };

        initializeStyles();
        setStyleProperties(styleProperties);

        // Add icons
        Object.keys(iconNames).forEach((key) => {
            addIcon('font', key, iconNames[key]);
        });

        console.info('React version:', React.version);

        // FIXME: later
        this.store = store as Store<AppState>;
        // NOTE: We can also use PersistGate instead of callback to wait for rehydration
        this.persistor = persistStore(this.store, undefined, this.setRehydrated);
    }

    private persistor: Persistor;

    private setRehydrated = () => {
        this.setState({ rehydrated: true });
    }

    private store: Store<AppState>;

    public render() {
        const { rehydrated } = this.state;

        if (!rehydrated) {
            // NOTE: showing empty div, this lasts for a fraction of a second
            return <div />;
        }

        return (
            <Provider store={this.store}>
                <ReduxContext.Provider
                    value={{ persistor: this.persistor }}
                >
                    <App />
                </ReduxContext.Provider>
            </Provider>
        );
    }
}
