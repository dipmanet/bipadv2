import React from 'react';

import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
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

const getKey = x => x.key;
const getLabel = x => x.label;


export const getFilterInputElement = (filterParam) => {
    const {
        key,
        type: paramType,
        label,
        filter,
    } = filterParam;

    const type = filter.type || paramType;

    if (type === 'string') {
        return (
            <TextInput
                key={key}
                faramElementName={key}
                label={label}
            />
        );
    } else if (type === 'number') {
        return (
            <NumberInput
                key={key}
                faramElementName={key}
                label={label}
                title={label}
                separator=" "
            />
        );
    } else if (type === 'boolean') {
        return (
            <Checkbox
                key={key}
                faramElementName={key}
                label={label}
            />
        );
    } else if (type === 'select') {
        return (
            <SelectInput
                key={key}
                label={label}
                faramElementName={key}
                keySelector={getKey}
                labelSelector={getLabel}
                options={filter.options}
                // showLabel={false}
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
