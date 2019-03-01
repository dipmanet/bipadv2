interface ReducerGroup<T, Q> {
    [key: string]: ((state: T, action: Q) => T);
}

const createReducerWithMap =
    <T, Q extends { type: string }>
    (reducers: ReducerGroup<T, Q>, initialState: T) =>
        (state = initialState, action: Q): T => {
            const { type } = action;
            const reducer = reducers[type];
            if (!reducer) {
                return state;
            }
            return reducer(state, action);
        };
export default createReducerWithMap;
