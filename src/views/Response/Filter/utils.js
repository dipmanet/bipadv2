import React from 'react';

import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import Checkbox from '#rsci/Checkbox';

export const getFilterItems = (resourceAttributes) => {
    const filterTypes = Object.keys(resourceAttributes);
    const filterItems = filterTypes.reduce((a, type) => ([
        ...a,
        {
            key: type,
            filterParams: resourceAttributes[type].filter(x => !!x.filter),
        },
    ]),
    []);
    return filterItems;
};

export const getSchema = (resourceAttributes) => {
    const filterItems = getFilterItems(resourceAttributes);
    const fields = filterItems.reduce((a, filterItem) => ({
        ...a,
        [filterItem.key]: {
            fields: {
                show: [],
                ...filterItem.filterParams.reduce((acc, x) => ({ ...acc, [x.key]: [] }), {}),
            },
        },
    }),
    {});
    return {
        fields,
    };
};


export const getFilterInputElement = (filterParam) => {
    const { type } = filterParam;

    if (type === 'string') {
        return (
            <TextInput
                key={filterParam.key}
                faramElementName={filterParam.key}
                label={filterParam.label}
            />
        );
    } else if (type === 'number') {
        return (
            <NumberInput
                key={filterParam.key}
                faramElementName={filterParam.key}
                label={filterParam.label}
                title={filterParam.label}
                separator=" "
            />
        );
    } else if (type === 'boolean') {
        return (
            <Checkbox
                key={filterParam.key}
                faramElementName={filterParam.key}
                label={filterParam.label}
            />
        );
    }
    return (
        <TextInput
            key={filterParam.key}
            faramElementName={filterParam.key}
            label={filterParam.label}
        />
    );
};
