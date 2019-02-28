import createReducerWithMap from '#utils/createReducerWithMap';

import commonReducers from './common';
import incidentPageReducers from './incidentPage';
import dashboardPageReducers from './dashboardPage';
import responsePageReducers from './responsePage';

import initialSiloDomainData from '../../initial-state/siloDomainData';

const reducers = {
    ...commonReducers,
    ...incidentPageReducers,
    ...dashboardPageReducers,
    ...responsePageReducers,
};

const reducer = createReducerWithMap(reducers, initialSiloDomainData);
export default reducer;
