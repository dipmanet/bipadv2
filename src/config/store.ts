import localforage from 'localforage';
import { createFilter } from 'redux-persist-transform-filter';


const storeConfig = {
    blacklist: ['route'],
    key: 'bipad',
    version: 2,
    storage: localforage,
};

export const transforms = {
};

export const actionsToSkipLogging: string[] = [
];

export default storeConfig;
