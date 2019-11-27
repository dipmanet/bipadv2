import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import Checkbox from '#rsci/Checkbox';

const HeathFields: FunctionComponent = () => (
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
        <TextInput
            faramElementName="operatorType"
            label="Operator Type"
        />
        <NumberInput
            faramElementName="noOfStaffs"
            label="No of staffs"
        />
    </>
);

export default HeathFields;
