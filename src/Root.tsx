import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

import getUserConfirmation from '#utils/getUserConfirmation';
import store, { AppState } from '#store';

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
        this.store = store;

        console.info('React version:', React.version);
    }

    public componentWillMount() {
        const afterRehydrateCallback = () => this.setState({ rehydrated: true });
        // NOTE: We can also use PersistGate instead of callback to wait for rehydration
        persistStore(this.store, undefined, afterRehydrateCallback);
    }

    private store: Store<AppState>;

    public render() {
        if (!this.state.rehydrated) {
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
