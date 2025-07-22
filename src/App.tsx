import React from "react";
import { Store } from "redux";
import { Provider } from "react-redux";
import { persistStore, Persistor } from "redux-persist";

import { styleProperties } from "#constants";
import ReduxContext from "#components/ReduxContext";

import { addIcon } from "#rscg/Icon";
import { iconNames } from "#constants";

import store from "#store";
import { AppState } from "#store/types";
import { initializeStyles, setStyleProperties } from "#rscu/styles";

import DataLoader from "#components/DataLoader";
import { RouterProvider } from "react-router-dom";
import { router } from "#utils/router";

interface State {
	rehydrated: boolean;
}
interface Props {}

export default class Root extends React.Component<Props, State> {
	private store: Store<AppState> = store as Store<AppState>;
	private persistor!: Persistor;

	public constructor(props: Props) {
		super(props);
		this.state = { rehydrated: false };

		// Initialize global styles and theme
		initializeStyles();
		setStyleProperties(styleProperties);

		// Load all icons
		Object.entries(iconNames).forEach(([key, value]) => {
			addIcon("font", key, value);
		});
	}

	componentDidMount() {
		this.persistor = persistStore(this.store, undefined, () => {
			this.setState({ rehydrated: true });
		});
	}

	public render() {
		if (!this.state.rehydrated) {
			// Optional: Replace with a loader or splash screen if needed
			return <div />;
		}

		return (
			<Provider store={this.store}>
				<ReduxContext.Provider value={{ persistor: this.persistor }}>
					{/* <DataLoader> */}
					<RouterProvider router={router} />
					{/* </DataLoader> */}
				</ReduxContext.Provider>
			</Provider>
		);
	}
}
