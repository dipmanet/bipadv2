import React from 'react';

import { mapToMap } from '@togglecorp/fujs';

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

export const getFilterOperations = resourceAttributes => mapToMap(
    resourceAttributes,
    key => key,
    attrs => attrs.filter(attr => !!attr.filter).reduce(
        (acc, attr) => ({ ...acc, [attr.key]: attr.filter.operation }),
        {},
    ),
);

const getKey = x => x.key;
const getLabel = x => x.label;


export const getFilterInputElement = (filterParam, show, elementProps = {}) => {
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
                {...elementProps}
                key={key}
                faramElementName={key}
                label={label}
                disabled={!show}
            />
        );
    }

    if (type === 'number') {
        return (
            <NumberInput
                {...elementProps}
                key={key}
                faramElementName={key}
                label={label}
                title={label}
                separator=" "
                disabled={!show}
            />
        );
    }

    if (type === 'boolean') {
        return (
            <Checkbox
                {...elementProps}
                key={key}
                faramElementName={key}
                label={label}
                disabled={!show}
            />
        );
    }

    if (type === 'select') {
        return (
            <SelectInput
                {...elementProps}
                key={key}
                label={label}
                faramElementName={key}
                keySelector={getKey}
                labelSelector={getLabel}
                options={filter.options}
                disabled={!show}
            />
        );
    }

    return (
        <TextInput
            {...elementProps}
            key={filterParam.key}
            faramElementName={filterParam.key}
            label={filterParam.label}
            disabled={!show}
        />
    );
};
