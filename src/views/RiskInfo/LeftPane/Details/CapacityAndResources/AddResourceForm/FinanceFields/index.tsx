import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import Checkbox from '#rsci/Checkbox';
import SelectInput from '#rsci/SelectInput';

import { ResourceEnum, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';

interface Props {
    resourceEnums: ResourceEnum[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const FinanceFields: FunctionComponent<Props> = ({ resourceEnums }: Props) => {
    const channelOptons = getAttributeOptions(resourceEnums, 'channel');
    const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    const bankTypeOptions = getAttributeOptions(resourceEnums, 'bank_type');

    return (
        <>
            <NumberInput
                faramElementName="cbsCode"
                label="Cbs Code"
            />
            <NumberInput
                faramElementName="population"
                label="Population"
            />
            <TextInput
                faramElementName="accessPointCount"
                label="Access Point Count"
            />
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
            <TextInput
                faramElementName="openingHours"
                label="Opening Hours"
            />
            <SelectInput
                faramElementName="channel"
                label="Channel"
                options={channelOptons}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <SelectInput
                faramElementName="operatorType"
                label="Operator Type"
                options={operatorTypeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <SelectInput
                faramElementName="bankType"
                label="Bank Type"
                options={bankTypeOptions}
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
            <Checkbox
                faramElementName="atmAvailable"
                label="Atm Available"
            />
            <TextInput
                faramElementName="placeAddress"
                label="Place Address"
            />
            <TextInput
                faramElementName="network"
                label="Network"
            />
        </>
    );
};

export default FinanceFields;
