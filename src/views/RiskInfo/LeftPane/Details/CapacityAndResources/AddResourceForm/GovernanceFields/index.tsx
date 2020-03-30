import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const GovernanceFields: FunctionComponent<Props> = ({ resourceEnums }: Props) => {
    const typeOptions = getAttributeOptions(resourceEnums, 'type');

    return (
        <>
            <TextInput
                faramElementName="phoneNumber"
                label="Phone Number"
            />
            <TextInput
                faramElementName="emailAddress"
                label="Email Address"
            />
            <TextInput
                faramElementName="website"
                label="Website"
            />
            <SelectInput
                faramElementName="type"
                label="Type"
                options={typeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <NumberInput
                faramElementName="noOfEmployee"
                label="No Of Employee"
            />
            <NumberInput
                faramElementName="openingHours"
                label="Opening Hours"
            />
        </>
    );
};

export default GovernanceFields;
