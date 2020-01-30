import React from 'react';
import { requiredCondition } from '@togglecorp/faram';

import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import TextArea from '#rsci/TextArea';

function HealthForm() {
    return (
        <>
            <TextInput
                faramElementName="title"
                label="Title"
            />
            <TextArea
                faramElementName="description"
                label="Description"
            />
            <NumberInput
                faramElementName="bedCount"
                label="Bed Count"
            />
            <TextInput
                faramElementName="type"
                label="Type"
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
                label="Email Address"
            />
            <NumberInput
                faramElementName="emergencyService"
                label="Emergency Service"
            />
            <NumberInput
                faramElementName="icu"
                label="ICU"
            />
            <NumberInput
                faramElementName="nicu"
                label="NICU"
            />
            <NumberInput
                faramElementName="operatingTheater"
                label="Operating Theater"
            />
            <NumberInput
                faramElementName="xRay"
                label="X-Ray"
            />
            <NumberInput
                faramElementName="ambulanceService"
                label="Ambulance Service"
            />
            <TextInput
                faramElementName="openingHours"
                label="Opening Hours"
            />
            <NumberInput
                faramElementName="noOfStaffs"
                label="No Of Staffs"
            />
            <NumberInput
                faramElementName="noOfBeds"
                label="No Of Beds"
            />
            <TextInput
                faramElementName="specialization"
                label="Specialization"
            />
        </>
    );
}

export const healthSchema = {
    title: [requiredCondition],
    description: [],
    bedCount: [],
    type: [],
    cbsCode: [],
    phoneNumber: [],
    emailAddress: [],
    emergencyService: [],
    icu: [],
    nicu: [],
    operatingTheater: [],
    xRay: [],
    ambulanceService: [],
    openingHours: [],
    noOfBeds: [],
    specialization: [],
};

export default HealthForm;
