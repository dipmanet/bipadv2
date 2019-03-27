import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import styleProperties from '#constants/styleProperties';

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
        // FIXME: later
        this.store = store as Store<AppState>;

        initializeStyles();
        setStyleProperties(styleProperties);

        console.info('React version:', React.version);
    }

    public componentDidMount() {
        // NOTE: We can also use PersistGate instead of callback to wait for rehydration
        persistStore(this.store, undefined, this.setRehydrated);
    }

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
                <App />
            </Provider>
        );
    }
}
