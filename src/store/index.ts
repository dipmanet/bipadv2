import { compose, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import createLogger from "./middlewares/logger";

import reducer from "./reducer";

const actionsToSkipLogging: string[] = [
	// Add action to skip logging
	"auth/SET_AUTH",
];

const middleware = [createLogger(actionsToSkipLogging)];

// Override compose if development mode and redux extension is installed
const isDevelopmentMode = import.meta.env.DEV;
const overrideCompose = !!composeWithDevTools && isDevelopmentMode;

const applicableCompose = !overrideCompose
	? compose
	: composeWithDevTools({
			actionsBlacklist: actionsToSkipLogging,
	  });

const enhancer = applicableCompose(applyMiddleware(...middleware));

export default createStore(reducer, undefined, enhancer);
