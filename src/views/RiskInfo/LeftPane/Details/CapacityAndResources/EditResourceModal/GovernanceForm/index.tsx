import React from 'react';
import {
    requiredCondition,
} from '@togglecorp/faram';

import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import TextArea from '#rsci/TextArea';

function GovernanceForm() {
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
            <TextInput
                faramElementName="type"
                label="Type"
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
            <NumberInput
                faramElementName="noOfEmployee"
                label="No Of Employee"
            />
            <TextInput
                faramElementName="openingHours"
                label="Opening Hours"
            />
        </>
    );
}

export const governanceSchema = {
    fields: {
        title: [requiredCondition],
        description: [],
        type: [],
        phoneNumber: [],
        emailAddress: [],
        website: [],
        noOfEmployee: [],
        openingHours: [],
    },
};

export default GovernanceForm;
