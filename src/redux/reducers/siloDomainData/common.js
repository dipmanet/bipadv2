import produce from 'immer';
import { listToMap } from '#rsu/common';

// TYPE

export const SET_HAZARD_TYPES = 'siloDomainData/SET_HAZARD_TYPES';

// ACTION-CREATOR

export const setHazardTypesAction = ({ hazardTypes }) => ({
    type: SET_HAZARD_TYPES,
    hazardTypes,
});

// REDUCER

const setHazardTypes = (state, action) => {
    const {
        hazardTypes,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.hazardTypes = listToMap(
            hazardTypes,
            hazardType => hazardType.pk,
        );
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

// REDUCER MAP

const reducers = {
    [SET_HAZARD_TYPES]: setHazardTypes,
};
export default reducers;
