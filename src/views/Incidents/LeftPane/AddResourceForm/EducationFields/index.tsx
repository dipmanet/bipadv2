import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';

const EducationFields: FunctionComponent = () => (
    <>
        <NumberInput
            faramElementName="classroomCount"
            label="Classroom Count"
        />
        <TextInput
            faramElementName="operatorType"
            label="Operator Type"
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
    </>
);

export default EducationFields;
