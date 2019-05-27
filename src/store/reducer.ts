import { persistCombineReducers } from 'redux-persist';
import { createFilter } from 'redux-persist-transform-filter';
import localforage from 'localforage';

import routeReducer from './atom/route/reducer';
import pageReducer from './atom/page/reducer';

const filterPageContent = createFilter(
    'page',
    [
        'mapStyles',
        'adminLevelList',

        'hidePopup',
        'selectedMapStyle',
        'region',
    ],
);


const rootReducer = persistCombineReducers(
    {
        blacklist: ['route'],
        key: 'bipad',
        version: 1,
        storage: localforage,
        transforms: [
            filterPageContent,
        ],
    },
    {
        // TODO: remove cast after latest update
        route: routeReducer as any,
        page: pageReducer as any,
    },
);

export default rootReducer;
