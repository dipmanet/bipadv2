import { persistCombineReducers } from 'redux-persist';
import { createFilter } from 'redux-persist-transform-filter';
import localforage from 'localforage';

import routeReducer from './atom/route/reducer';
import pageReducer from './atom/page/reducer';
import authReducer from './atom/auth/reducer';
import covidReducer from './atom/covid/reducer';
import healthInfrastructureReducer from './atom/healthinfrastructure/reducer';
import notificationReducer from './atom/notification/reducer';

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
        blacklist: ['auth', 'route'],
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
        auth: authReducer as any,
        covid: covidReducer as any,
        healthInfrastructure: healthInfrastructureReducer as any,
        notification: notificationReducer as any,
    },
);

export default rootReducer;
