import { persistCombineReducers } from 'redux-persist';

import storeConfig from '#config/store';

import routeReducer from './route';
import siloDomainDataReducer from './siloDomainData';

const reducers = {
    route: routeReducer,
    siloDomainData: siloDomainDataReducer,
};

const reducer = persistCombineReducers(storeConfig, reducers);
export default reducer;

export * from './route';
export * from './siloDomainData/common';
export * from './siloDomainData/incidentPage';
export * from './siloDomainData/dashboardPage';
export * from './siloDomainData/responsePage';
