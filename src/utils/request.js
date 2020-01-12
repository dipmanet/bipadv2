export const getResponse = (requests, key, defaultValue = {}) => {
    const { response = defaultValue } = (requests || {})[key];
    return response;
};

export const getResults = (requests, key, defaultValue = []) => {
    const {
        response: {
            results = defaultValue,
        } = {},
    } = (requests || {})[key];

    return results;
};

export const getPending = (requests, key) => {
    const {
        pending,
    } = (requests || {})[key];

    return pending;
};

export const isAnyRequestPending = (requests) => {
    if (!requests) {
        return undefined;
    }

    const requestKeys = Object.keys(requests);
    const pending = requestKeys.some(
        requestKey => requests[requestKey].pending,
    );

    return pending;
};
