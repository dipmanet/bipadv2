import React, { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { persistStore, Persistor } from "redux-persist";

import { styleProperties } from "#constants";
import ReduxContext from "#components/ReduxContext";

import store from "../src/store";
import { AppState } from "../src/store/types";
import { initializeStyles, setStyleProperties } from "#rscu/styles";
// import { RouterProvider } from "react-router-dom";
// import { router } from "../src/lib/router";

import { Store } from "redux";
import Layout from "./layout";

const App: React.FC = () => {
	const [rehydrated, setRehydrated] = useState(false);

	const storeRef = useRef<Store<AppState>>(store as Store<AppState>);
	const persistorRef = useRef<Persistor>(null);

	useEffect(() => {
		initializeStyles();
		setStyleProperties(styleProperties);

		// Add icons

		persistorRef.current = persistStore(storeRef.current, undefined, () => {
			setRehydrated(true);
		});
	}, []);

	if (!rehydrated) {
		return <div />;
	}

	return (
		<Provider store={storeRef.current}>
			<ReduxContext.Provider value={{ persistor: persistorRef.current! }}>
				<Layout />
			</ReduxContext.Provider>
		</Provider>
	);
};

export default App;
