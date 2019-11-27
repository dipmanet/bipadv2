import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import Checkbox from '#rsci/Checkbox';

const FinanceFields: FunctionComponent = () => (
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
            faramElementName="channel"
            label="Channel"
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
        <TextInput
            faramElementName="operatorType"
            label="Operator Type"
        />
        <TextInput
            faramElementName="bankType"
            label="Bank Type"
        />
        <Checkbox
            faramElementName="atmAvailable"
            label="Atm Available"
        />
        <Checkbox
            faramElementName="placeAddress"
            label="Place Address"
        />
    </>
);

export default FinanceFields;
