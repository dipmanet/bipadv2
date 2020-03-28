import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import Checkbox from '#rsci/Checkbox';

import { ResourceEnum, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';

interface Props {
    resourceEnums: ResourceEnum[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const CulturalFields: FunctionComponent<Props> = ({ resourceEnums }: Props) => {
    const religionOptions = getAttributeOptions(resourceEnums, 'religion');
    return (
        <>
            <SelectInput
                faramElementName="religion"
                label="Religion"
                options={religionOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <TextInput
                faramElementName="phoneNumber"
                label="Phone Number"
            />
            <TextInput
                faramElementName="openingHours"
                label="Opening Hours"
            />
            <TextInput
                faramElementName="emailAddress"
                label="Email Address"
            />
            <Checkbox
                faramElementName="drinkingWater"
                label="Drinking Water"
            />
            <Checkbox
                faramElementName="toilet"
                label="Toilet"
            />
            <TextInput
                faramElementName="type"
                label="Type"
            />
        </>
    );
};

export default CulturalFields;
