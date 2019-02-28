import produce from 'immer';

export const RP__SET_RESOURCE_LIST = 'siloDomainData/RESOURCE_PAGE/SET_RESOURCE';

export const setResourceListActionRP = ({ resourceList }) => ({
    type: RP__SET_RESOURCE_LIST,
    resourceList,
});

export const setResourceList = (state, action) => {
    const {
        resourceList,
    } = action;

    const newState = produce(state, (deferedState) => {
        /* eslint-disable no-param-reassign */
        deferedState.responsePage.resourceList = resourceList;
        /* eslint-enable no-param-reassign */
    });

    return newState;
};

const reducers = {
    [RP__SET_RESOURCE_LIST]: setResourceList,
};

export default reducers;
