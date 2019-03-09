import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import getUserConfirmation from '#utils/getUserConfirmation';
import store from '#store';
import { AppState } from '#store/types';
import { initializeStyles } from '#rsu/styles';
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
                <BrowserRouter getUserConfirmation={getUserConfirmation}>
                    <App />
                </BrowserRouter>
            </Provider>
        );
    }
}
