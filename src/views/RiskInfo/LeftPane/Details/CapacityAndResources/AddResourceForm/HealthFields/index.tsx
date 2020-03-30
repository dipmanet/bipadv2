import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import Checkbox from '#rsci/Checkbox';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const HeathFields: FunctionComponent<Props> = ({ resourceEnums }: Props) => {
    const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');

    return (
        <>
            <NumberInput
                faramElementName="bedCount"
                label="Bed Count"
            />
            <NumberInput
                faramElementName="cbsCode"
                label="Cbs Code"
            />
            <TextInput
                faramElementName="phoneNumber"
                label="Phone Number"
            />
            <TextInput
                faramElementName="emailAddress"
                label="Label"
            />
            <Checkbox
                faramElementName="emergencyService"
                label="Emergency Service"
            />
            <Checkbox
                faramElementName="icu"
                label="icu"
            />
            <Checkbox
                faramElementName="nicu"
                label="nicu"
            />
            <Checkbox
                faramElementName="operationTheater"
                label="Opeartion Theater"
            />
            <Checkbox
                faramElementName="xRay"
                label="X-ray"
            />
            <Checkbox
                faramElementName="ambulanceService"
                label="Amublance Service"
            />
            <TextInput
                faramElementName="openingHours"
                label="Opening Hours"
            />
            <SelectInput
                faramElementName="operatorType"
                label="Operator Type"
                options={operatorTypeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <SelectInput
                faramElementName="type"
                label="Type"
                options={typeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <NumberInput
                faramElementName="noOfStaffs"
                label="No of staffs"
            />
            <NumberInput
                faramElementName="noOfBeds"
                label="No of beds"
            />
            <TextInput
                faramElementName="specialization"
                label="Specialization"
            />
        </>
    );
};

export default HeathFields;
