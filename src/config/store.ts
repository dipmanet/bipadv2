import localforage from 'localforage';

const storeConfig = {
    blacklist: ['notify', 'route', 'app', 'siloDomainData'],
    key: 'bipad',
    version: 2,
    storage: localforage,
};


// NOTE: these are not actually reducers but the prefixes in the
// action types.
// It might be better to rename this to actionsToSync
export const reducersToSync: string[] = [
    'lang',
    'auth',
    'domainData',
];

export const actionsToSkipLogging: string[] = [
];

export default storeConfig;
