import { mapToMap, mapToList, listToMap } from '@togglecorp/fujs';

export const getFilterItems = (resourceAttributes) => {
    const values = mapToMap(
        resourceAttributes,
        key => key,
        (value, key) => ({
            key,
            filterParams: value.filter(x => !!x.filter),
        }),
    );
    return values;
};

export const getSchema = (resourceAttributes) => {
    const filterItems = getFilterItems(resourceAttributes);
    const fields = mapToMap(
        filterItems,
        key => key,
        value => ({
            fields: {
                show: [],
                ...listToMap(
                    value.filterParams,
                    v => v.key,
                    () => [],
                ),
            },
        }),
    );
    return {
        fields,
    };
};

export const getFilterOperations = resourceAttributes => mapToMap(
    resourceAttributes,
    key => key,
    attrs => listToMap(
        attrs.filter(attr => !!attr.filter),
        attr => attr.key,
        attr => attr.filter.operation,
    ),
);


const equalityOperator = (x, y) => x === y;

const checkFilters = (
    obj,
    attrVals,
    filterOperations = {},
) => {
    const valid = Object.entries(filterOperations)
        .every(([attributeKey, operator]) => {
            if (
                attrVals[attributeKey] === undefined
                || attrVals[attributeKey] === ''
                || attrVals[attributeKey] === false
            ) {
                return true;
            }
            return (operator || equalityOperator)(obj[attributeKey], attrVals[attributeKey]);
        });
    return valid;
};

export const createResourceFilter = (faramValues, resourceAttributes) => {
    // The operations for filtering attributes
    const filterOperations = getFilterOperations(resourceAttributes);

    // Only show types whose show attribute is true
    const appliedFilters = Object
        .entries(faramValues)
        .filter(([_, attrVals]) => attrVals.show);

    const filterFunc = obj => appliedFilters.some(
        ([type, { show, ...attrVals }]) => (
            obj.resourceType === type && checkFilters(obj, attrVals, filterOperations[type])
        ),
    );
    return filterFunc;
};
