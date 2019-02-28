import produce from 'immer';

// TYPE

export const IP__SET_INCIDENT_LIST = 'siloDomainData/INCIDENT_PAGE/SET_INCIDENT_LIST';
export const IP__SET_INCIDENT = 'siloDomainData/INCIDENT_PAGE/SET_INCIDENT';
export const IP__SET_FILTERS = 'siloDomainData/INCIDENT_PAGE/SET_FILTERS';

// ACTION-CREATOR

export const setIncidentListActionIP = ({ incidentList }) => ({
    type: IP__SET_INCIDENT_LIST,
    incidentList,
});

export const setIncidentActionIP = ({ incident }) => ({
    type: IP__SET_INCIDENT,
    incident,
});

export const setFiltersActionIP = ({ faramValues, faramErrors, pristine }) => ({
    type: IP__SET_FILTERS,
    faramValues,
    faramErrors,
    pristine,
});
// REDUCER

const setIncidentList = (state, action) => {
    const {
        incidentList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.incidentPage) {
            deferedState.incidentPage = {};
        }
        deferedState.incidentPage.incidentList = incidentList;
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

const setIncident = (state, action) => {
    const {
        incident,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.incidentPage) {
            deferedState.incidentPage = {};
        }

        const {
            incidentPage: {
                incidentList,
            },
        } = deferedState;

        const incidentIndex = incidentList.find(d => d.id === incident.id);
        if (incidentIndex !== -1) {
            incidentList.splice(incidentIndex, 1, incident);
        } else {
            incidentList.push(incident);
        }
        /* eslint-enable no-param-reassign */
    });
    return newState;
};

const setFilters = (state, action) => {
    const {
        faramValues,
        faramErrors,
        pristine,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.incidentPage) {
            deferedState.incidentPage = {};
        }
        if (!deferedState.incidentPage.filters) {
            deferedState.incidentPage.filters = {};
        }

        if (faramValues) {
            deferedState.incidentPage.filters.faramValues = faramValues;
        }
        if (faramErrors) {
            deferedState.incidentPage.filters.faramErrors = faramErrors;
        }
        if (pristine) {
            deferedState.incidentPage.filters.pristine = pristine;
        }
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

// REDUCER MAP

const reducers = {
    [IP__SET_INCIDENT_LIST]: setIncidentList,
    [IP__SET_INCIDENT]: setIncident,
    [IP__SET_FILTERS]: setFilters,
};
export default reducers;
