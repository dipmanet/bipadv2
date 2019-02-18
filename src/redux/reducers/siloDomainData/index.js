import createReducerWithMap from '#utils/createReducerWithMap';

import commonReducers from './common';
import incidentPage from './incidentPage';

import initialSiloDomainData from '../../initial-state/siloDomainData';

const reducers = {
    ...commonReducers,
    ...incidentPage,
};

const reducer = createReducerWithMap(reducers, initialSiloDomainData);
export default reducer;
