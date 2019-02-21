import { createSelector } from 'reselect';
import { incidentIdFromRouteSelector } from '../route';

const emptyObject = {};
const emptyArray = [];
const emptyFilter = {
    faramValues: {},
    faramErrors: {},
    pristine: true,
};

// FIXME: this is repeated
const getDateFromRange = (range) => {
    let value;
    switch (range) {
        case 'past3Days':
            value = 3;
            break;
        case 'past7Days':
            value = 7;
            break;
        case 'past2Weeks':
            value = 14;
            break;
        case 'past1Month':
            value = 30;
            break;
        default:
            value = 0;
    }

    // const now = new Date();
    // NOTE: setting now to specific time
    const now = new Date(1550600100990);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setDate(now.getDate() - value);

    return now.getTime();
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
        { faramValues } = emptyFilter,
        { incidentList },
    ) => {
        const { hazardType, dateRange } = faramValues;
        if (!incidentList) {
            return emptyArray;
        }

        let returnList = incidentList;
        if (hazardType && hazardType.length > 0) {
            returnList = returnList.filter(
                incident => hazardType.includes(incident.hazard),
            );
        }

        if (dateRange) {
            const date = getDateFromRange(dateRange);
            returnList = returnList.filter(
                incident => incident.incident_on > date,
            );
        }

        return returnList;
    },
);

export const incidentSelector = createSelector(
    incidentIdFromRouteSelector,
    incidentPageSelector,
    (id, { incidentList }) => {
        const incident = incidentList.find(
            i => String(i.pk) === String(id),
        );

        return incident || emptyObject;
    },
);
