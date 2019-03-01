import { compose, createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import createLogger from '#redux/middlewares/logger';
import reducer from '#redux/reducers';

import {
    isDevelopment,
    // isTesting,
} from '#config/env';
import {
    actionsToSkipLogging,
} from '#config/store';

export interface AppState {
    siloDomainData?: object;
    route?: object;
}

const initialState: AppState = {
    siloDomainData: {
        adminLevelList: [
            {
                id: 1,
                title: 'Province',
            },
            {
                id: 2,
                title: 'District',
            },
            {
                id: 3,
                title: 'Municipality',
            },
        ],
        provinces: [],
        districts: [],
        municipalities: [],
        wards: [],

        selectedMapStyle: 'mapbox://styles/mapbox/streets-v11',
        mapStyles: [
            {
                name: 'light',
                style: 'mapbox://styles/mapbox/light-v10',
                color: '#cdcdcd',
            },
            {
                name: 'street',
                style: 'mapbox://styles/mapbox/streets-v11',
                color: '#ece0ca',
            },
            {
                name: 'outdoor',
                style: 'mapbox://styles/mapbox/outdoors-v11',
                color: '#c8dd97',
            },
            {
                name: 'satellite',
                style: 'mapbox://styles/mapbox/satellite-streets-v11',
                color: '#c89966',
            },
            {
                name: 'roads',
                style: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
                color: '#671076',
            },
        ],

        hazardTypes: {},

        // Page related

        dashboardPage: {
            alertList: [],
            filters: {
                faramValues: {
                    dateRange: 30,
                    region: {
                        adminLevel: 1,
                    },
                },
                faramErrors: {},
                pristine: true,
            },
        },

        incidentPage: {
            incidentList: [],
            filters: {
                faramValues: {
                    dateRange: 30,
                    region: {
                        adminLevel: 1,
                    },
                },
                faramErrors: {},
                pristine: true,
            },
        },

        responsePage: {
            resourceList: [],
        },

        filters: {
            faramValues: {
                dateRange: 30,
                region: {
                    adminLevel: 1,
                },
            },
            faramErrors: {},
            pristine: true,
        },

        // FIXME: Remove Geojson from redux

        geoJsons: {
            district: {
                type: 'FeatureCollection',
                features: [
                    {
                        id: 1,
                        type: 'Feature',
                        geometry: {
                            type: 'MultiPolygon',
                            coordinates: [[[
                                [87, 27],
                                [87, 28],
                                [86, 28],
                                [87, 27],
                            ]]],
                        },
                    },
                ],
            },
            municipality: {},
        },
    },
    route: {
        path: undefined,
        url: undefined,
        isExact: undefined,
        params: {},
        routeState: {},
        isFirstPage: true,
    },
};

const prepareStore = (): Store<AppState> => {
    const middleware = [
        createLogger(actionsToSkipLogging),
    ];

    // Override compose if development mode and redux extension is installed
    const overrideCompose = !!composeWithDevTools && isDevelopment;
    const options = {
        // specify extention's options here
        actionsBlacklist: actionsToSkipLogging,
    };

    const applicableCompose = !overrideCompose
        ? compose
        : composeWithDevTools(options);

    const enhancer = applicableCompose(
        applyMiddleware(...middleware),
    );

    return createStore(reducer, initialState as any, enhancer);
};

// NOTE: replace 'undefined' with an initialState in future if needed, this is a temporary fix
// const store = !isTesting ? prepareStore() : { getState: () => ({ lang: {} }) };
export default prepareStore();
