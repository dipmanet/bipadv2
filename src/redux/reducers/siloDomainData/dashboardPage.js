import produce from 'immer';

// TYPE

export const DP__SET_ALERTS = 'siloDomainData/DASHBOARD_PAGE/SET_ALERTS';
export const DP__SET_FILTERS = 'siloDomainData/DASHBOARD_PAGE/SET_FILTERS';

// ACTION-CREATOR

export const setAlertListActionDP = ({ alertList }) => ({
    type: DP__SET_ALERTS,
    alertList,
});

export const setFiltersActionDP = ({ faramValues, faramErrors, pristine }) => ({
    type: DP__SET_FILTERS,
    faramValues,
    faramErrors,
    pristine,
});
// REDUCER

const setAlertList = (state, action) => {
    const {
        alertList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        if (!deferedState.dashboardPage) {
            deferedState.dashboardPage = {};
        }
        deferedState.dashboardPage.alertList = alertList;
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
        if (!deferedState.dashboardPage) {
            deferedState.dashboardPage = {};
        }
        if (!deferedState.dashboardPage.filters) {
            deferedState.dashboardPage.filters = {};
        }

        if (faramValues) {
            deferedState.dashboardPage.filters.faramValues = faramValues;
        }
        if (faramErrors) {
            deferedState.dashboardPage.filters.faramErrors = faramErrors;
        }
        if (pristine) {
            deferedState.dashboardPage.filters.pristine = pristine;
        }
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

// REDUCER MAP

const reducers = {
    [DP__SET_ALERTS]: setAlertList,
    [DP__SET_FILTERS]: setFilters,
};
export default reducers;
