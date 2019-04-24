import localforage from 'localforage';

const storeConfig = {
    blacklist: ['route'],
    key: 'bipad',
    version: 2,
    storage: localforage,
};

export const actionsToSkipLogging: string[] = [
];

export default storeConfig;
