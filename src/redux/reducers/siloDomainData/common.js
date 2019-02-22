import produce from 'immer';
import { listToMap } from '@togglecorp/fujs';

// TYPE

export const SET_HAZARD_TYPES = 'siloDomainData/SET_HAZARD_TYPES';
export const SET_MAP_STYLES = 'siloDomainData/SET_MAP_STYLES';
export const SET_MAP_STYLE = 'siloDomainData/SET_MAP_STYLE';

// ACTION-CREATOR

export const setHazardTypesAction = ({ hazardTypes }) => ({
    type: SET_HAZARD_TYPES,
    hazardTypes,
});

export const setMapStylesAction = mapStyles => ({
    type: SET_MAP_STYLES,
    mapStyles,
});
export const setMapStyleAction = mapStyle => ({
    type: SET_MAP_STYLE,
    mapStyle,
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

const setMapStyles = (state, action) => {
    const {
        mapStyles,
    } = action;

    const newState = { ...state };
    newState.mapStyles = mapStyles;
    return newState;
};

const setMapStyle = (state, action) => {
    const {
        mapStyle,
    } = action;

    const newState = { ...state };
    newState.selectedMapStyle = mapStyle;
    return newState;
};

// REDUCER MAP

const reducers = {
    [SET_HAZARD_TYPES]: setHazardTypes,
    [SET_MAP_STYLES]: setMapStyles,
    [SET_MAP_STYLE]: setMapStyle,
};
export default reducers;
