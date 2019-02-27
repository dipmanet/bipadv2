import { createSelector } from 'reselect';
import { mapToList } from '@togglecorp/fujs';

const emptyObject = {};
const emptyList = [];

export const hazardTypesSelector = ({ siloDomainData }) =>
    siloDomainData.hazardTypes || emptyObject;

export const resourceTypesSelector = ({ siloDomainData }) =>
    siloDomainData.resourceTypes || emptyObject;

export const adminLevelListSelector = ({ siloDomainData }) =>
    siloDomainData.adminLevelList || emptyList;

export const districtsSelector = ({ siloDomainData }) =>
    siloDomainData.districts || emptyList;

export const provincesSelector = ({ siloDomainData }) =>
    siloDomainData.provinces || emptyList;

export const municipalitiesSelector = ({ siloDomainData }) =>
    siloDomainData.municipalities || emptyList;

export const wardsSelector = ({ siloDomainData }) =>
    siloDomainData.wards || emptyList;

export const hazardTypeListSelector = createSelector(
    hazardTypesSelector,
    hazards => mapToList(hazards) || emptyList,
);

export const resourceTypeListSelector = createSelector(
    resourceTypesSelector,
    resources => mapToList(resources) || emptyList,
);

export const mapStylesSelector = ({ siloDomainData }) =>
    siloDomainData.mapStyles || emptyList;

export const mapStyleSelector = ({ siloDomainData }) =>
    siloDomainData.selectedMapStyle;
