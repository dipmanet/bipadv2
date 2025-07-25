import React from "react";
import { Store } from "redux";
import { Provider } from "react-redux";
import { persistStore, Persistor } from "redux-persist";

import ReduxContext from "#components/ReduxContext";

import { addIcon } from "#rscg/Icon";
import { iconNames, styleProperties } from "#constants";

import store from "#store";
import { AppState } from "#store/types";
import { initializeStyles, setStyleProperties } from "#rscu/styles";

import App from "./App";
import { BrowserRouter } from "react-router-dom";

interface State {
	rehydrated: boolean;
}
type Props = unknown;

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
			addIcon("font", key, iconNames[key as keyof typeof iconNames]);
		});

		console.info("React version:", React.version);

		// FIXME: later
		this.store = store as Store<AppState>;
	}

	private persistor!: Persistor; // initialized in componentDidMount

	private setRehydrated = () => {
		this.setState({ rehydrated: true });
	};

	private store: Store<AppState>;

	public componentDidMount() {
		// Now persistor initializes after mount, safe for setState
		this.persistor = persistStore(this.store, undefined, this.setRehydrated);
	}

	public render() {
		const { rehydrated } = this.state;

		if (!rehydrated) {
			// NOTE: showing empty div, this lasts for a fraction of a second
			return <div />;
		}

		return (
			<Provider store={this.store}>
				<ReduxContext.Provider value={{ persistor: this.persistor }}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</ReduxContext.Provider>
			</Provider>
		);
	}
}
