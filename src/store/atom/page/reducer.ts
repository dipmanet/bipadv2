import produce from 'immer';
import { listToMap } from '@togglecorp/fujs';

import * as Type from './types';
import initialState from './initialState';

// ACTION CREATORS

export const setHazardTypesAction = (
    { hazardTypes }: { hazardTypes: Type.HazardType[] },
) => ({
    type: Type.PageType.SET_HAZARD_TYPES,
    hazardTypes,
});

export const setMapStylesAction = (
    mapStyles: Type.MapStyle[],
) => ({
    type: Type.PageType.SET_MAP_STYLES,
    mapStyles,
});
export const setMapStyleAction = (
    mapStyle: string,
) => ({
    type: Type.PageType.SET_MAP_STYLE,
    mapStyle,
});

export const setProvincesAction = (
    { provinces }: { provinces: Type.Province[] },
) => ({
    type: Type.PageType.SET_PROVINCES,
    provinces,
});

export const setDistrictsAction = (
    { districts }: { districts: Type.District[] },
) => ({
    type: Type.PageType.SET_DISTRICTS,
    districts,
});

export const setDistrictsGeoJsonAction = (
    { districtGeoJson }: { districtGeoJson: Type.GeoJson },
) => ({
    type: Type.PageType.SET_DISTRICTS_GEO_JSON,
    districtGeoJson,
});

export const setMunicipalitiesAction = (
    { municipalities }: { municipalities: Type.Municipality[] },
) => ({
    type: Type.PageType.SET_MUNICIPALITIES,
    municipalities,
});

export const setWardsAction = (
    { wards }: { wards: Type.Ward[] },
) => ({
    type: Type.PageType.SET_WARDS,
    wards,
});

//  REDUCERS

const setHazardTypes = (state: Type.PageState, action: Type.SetHazardType) => {
    const { hazardTypes } = action;
    const newState = produce(state, (deferedState) => {
        // eslint-disable-next-line no-param-reassign
        deferedState.hazardTypes = listToMap(
            hazardTypes,
            hazardType => hazardType.id,
            hazardType => hazardType,
        );
    });
    return newState;
};

const setMapStyles = (state: Type.PageState, action: Type.SetMapStyles) => {
    const { mapStyles } = action;
    const newState = {
        ...state,
        mapStyles,
    };
    return newState;
};

const setMapStyle = (state: Type.PageState, action: Type.SetMapStyle) => {
    const { mapStyle } = action;
    const newState = {
        ...state,
        selectedMapStyle: mapStyle,
    };
    return newState;
};

const setProvinces = (state: Type.PageState, action: Type.SetProvinces) => {
    const { provinces } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.provinces = provinces;
    });
    return newState;
};

const setDistricts = (state: Type.PageState, action: Type.SetDistricts) => {
    const { districts } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.districts = districts;
    });
    return newState;
};

const setDistrictsGeoJson = (state: Type.PageState, action: Type.SetDistrictGeoJson) => {
    const { districtsGeoJson } = action;
    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.geoJsons.district = districtsGeoJson;
    });
    return newState;
};

const setMunicipalities = (state: Type.PageState, action: Type.SetMunicipalities) => {
    const { municipalities } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.municipalities = municipalities;
    });
    return newState;
};

const setWards = (state: Type.PageState, action: Type.SetWards) => {
    const { wards } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.wards = wards;
    });
    return newState;
};

// dashboard

export default function routeReducer(
    state = initialState,
    action: Type.PageActionTypes,
): Type.PageState {
    switch (action.type) {
        case Type.PageType.SET_HAZARD_TYPES:
            return setHazardTypes(state, action);
        case Type.PageType.SET_MAP_STYLES:
            return setMapStyles(state, action);
        case Type.PageType.SET_MAP_STYLE:
            return setMapStyle(state, action);
        case Type.PageType.SET_PROVINCES:
            return setProvinces(state, action);
        case Type.PageType.SET_DISTRICTS:
            return setDistricts(state, action);
        case Type.PageType.SET_DISTRICTS_GEO_JSON:
            return setDistrictsGeoJson(state, action);
        case Type.PageType.SET_MUNICIPALITIES:
            return setMunicipalities(state, action);
        case Type.PageType.SET_WARDS:
            return setWards(state, action);
        default:
            return state;
    }
}
