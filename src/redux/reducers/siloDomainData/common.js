import produce from 'immer';
import { listToMap } from '@togglecorp/fujs';

// TYPE

export const SET_HAZARD_TYPES = 'siloDomainData/SET_HAZARD_TYPES';
export const SET_MAP_STYLES = 'siloDomainData/SET_MAP_STYLES';
export const SET_MAP_STYLE = 'siloDomainData/SET_MAP_STYLE';
export const SET_PROVINCES = 'siloDomainData/SET_PROVINCES';
export const SET_DISTRICTS = 'siloDomainData/SET_DISTRICTS';
export const SET_DISTRICTS_GEO_JSON = 'siloDomainData/SET_DISTRICTS_GEO_JSON';
export const SET_MUNICIPALITIES = 'siloDomainData/SET_MUNICIPALITIES';
export const SET_WARDS = 'siloDomainData/SET_WARDS';

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

export const setProvincesAction = ({ provinces }) => ({
    type: SET_PROVINCES,
    provinces,
});

export const setDistrictsAction = ({ districts }) => ({
    type: SET_DISTRICTS,
    districts,
});

export const setDistrictsGeoJsonAction = ({ districtGeoJson }) => ({
    type: SET_DISTRICTS_GEO_JSON,
    districtGeoJson,
});

export const setMunicipalitiesAction = ({ municipalities }) => ({
    type: SET_MUNICIPALITIES,
    municipalities,
});

export const setWardsAction = ({ wards }) => ({
    type: SET_WARDS,
    wards,
});

// REDUCER

const setHazardTypes = (state, action) => {
    const {
        hazardTypes,
    } = action;

    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.hazardTypes = hazardTypes;
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

const setProvinces = (state, action) => {
    const {
        provinces,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.provinces = provinces;
    });
    return newState;
};

const setDistricts = (state, action) => {
    const {
        districts,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.districts = districts;
    });
    return newState;
};

const setDistrictsGeoJson = (state, action) => {
    const {
        districtsGeoJson,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.geoJsons.district = districtsGeoJson;
    });
    return newState;
};

const setMunicipalities = (state, action) => {
    const {
        municipalities,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.municipalities = municipalities;
    });
    return newState;
};

const setWards = (state, action) => {
    const {
        wards,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.wards = wards;
    });
    return newState;
};


// REDUCER MAP

const reducers = {
    [SET_HAZARD_TYPES]: setHazardTypes,
    [SET_MAP_STYLES]: setMapStyles,
    [SET_MAP_STYLE]: setMapStyle,
    [SET_PROVINCES]: setProvinces,
    [SET_DISTRICTS]: setDistricts,
    [SET_DISTRICTS_GEO_JSON]: setDistrictsGeoJson,
    [SET_MUNICIPALITIES]: setMunicipalities,
    [SET_WARDS]: setWards,
};
export default reducers;
