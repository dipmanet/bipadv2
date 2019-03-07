import { persistCombineReducers } from 'redux-persist';
import localforage from 'localforage';

import routeReducer from './atom/route/reducer';
import pageReducer from './atom/page/reducer';

const rootReducer = persistCombineReducers(
    {
        blacklist: ['route', 'page'],
        key: 'bipad',
        version: 1,
        storage: localforage,
    },
    {
        // TODO: remove cast after latest update
        route: routeReducer as any,
        page: pageReducer as any,
    },
);

export default rootReducer;
