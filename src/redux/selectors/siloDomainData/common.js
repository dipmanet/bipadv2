import { createSelector } from 'reselect';
import { mapToList } from '@togglecorp/fujs';

const emptyObject = {};
const emptyArray = [];

export const hazardTypesSelector = ({ siloDomainData }) =>
    siloDomainData.hazardTypes || emptyObject;

export const adminLevelListSelector = ({ siloDomainData }) =>
    siloDomainData.adminLevelList || emptyArray;

export const geoAreasSelector = ({ siloDomainData }) =>
    siloDomainData.geoAreas || emptyObject;

export const hazardTypeListSelector = createSelector(
    hazardTypesSelector,
    hazards => mapToList(hazards) || emptyArray,
);
