import { createSelector } from 'reselect';
import { mapToList, listToMap } from '@togglecorp/fujs';

import { AppState } from '../../types';

export const hazardTypesSelector = ({ page }: AppState) =>
    page.hazardTypes;

export const hazardTypeListSelector = createSelector(
    hazardTypesSelector,
    hazardTypes => mapToList(hazardTypes, hazardType => hazardType),
);

// NOTE: removed
export const resourceTypesSelector = ({ page }: AppState) =>
    page.resourceTypes;

export const adminLevelListSelector = ({ page }: AppState) =>
    page.adminLevelList;

export const districtsSelector = ({ page }: AppState) =>
    page.districts;

export const provincesSelector = ({ page }: AppState) =>
    page.provinces;

export const municipalitiesSelector = ({ page }: AppState) =>
    page.municipalities;

export const wardsSelector = ({ page }: AppState) =>
    page.wards;

export const wardsMapSelector = createSelector(
    wardsSelector,
    wards => listToMap(wards, elem => elem.id),
);

export const resourceTypeListSelector = createSelector(
    resourceTypesSelector,
    resources => mapToList(resources),
);

export const mapStylesSelector = ({ page }: AppState) =>
    page.mapStyles;

export const mapStyleSelector = ({ page }: AppState) =>
    page.selectedMapStyle;

export const geoJsonsSelector = ({ page }: AppState) =>
    page.geoJsons;

export const districtsGeoJsonSelector = createSelector(
    geoJsonsSelector,
    geoJsons => geoJsons.district,
);
