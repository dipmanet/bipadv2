import { createSelector } from 'reselect';

const emptyObject = {};
const emptyArray = [];
const emptyFilter = {
    faramValues: {},
    faramErrors: {},
    pristine: true,
};

const incidentPageSelector = ({ siloDomainData }) =>
    siloDomainData.incidentPage || emptyObject;

export const filtersSelectorIP = createSelector(
    incidentPageSelector,
    incidentPage => incidentPage.filters || emptyFilter,
);

export const incidentListSelectorIP = createSelector(
    filtersSelectorIP,
    incidentPageSelector,
    // TODO: Remove this filter later
    (
        { faramValues: { hazardType } } = emptyFilter,
        { incidentList },
    ) => {
        if (!incidentList) {
            return emptyArray;
        }
        if (!hazardType || hazardType.length <= 0) {
            return incidentList;
        }

        return incidentList.filter(
            incident => hazardType.includes(incident.hazard),
        );
    },
);
