import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const EducationFields: FunctionComponent<Props> = ({ resourceEnums }: Props) => {
    const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');

    return (
        <>
            <NumberInput
                faramElementName="classroomCount"
                label="Classroom Count"
            />
            <SelectInput
                faramElementName="operatorType"
                label="Operator Type"
                options={operatorTypeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <TextInput
                faramElementName="openingHours"
                label="Opening Hours"
            />
            <TextInput
                faramElementName="phoneNumber"
                label="Phone Number"
            />
            <TextInput
                faramElementName="emailAddress"
                label="Email Address"
            />
            <NumberInput
                faramElementName="noOfEmployee"
                label="Number of Employee"
            />
            <NumberInput
                faramElementName="noOfStudent"
                label="Number of Student"
            />
            <SelectInput
                faramElementName="type"
                label="Type"
                options={typeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
        </>
    );
};

export default EducationFields;
