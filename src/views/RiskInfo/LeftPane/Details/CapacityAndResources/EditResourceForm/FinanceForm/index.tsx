import React from 'react';
import { requiredCondition } from '@togglecorp/faram';

import TextInput from '#rsci/TextInput';
import NumberInput from '#rsci/NumberInput';
import TextArea from '#rsci/TextArea';
import Checkbox from '#rsci/Checkbox';

function FinanceForm() {
    return (
        <>
            <TextInput
                faramElementName="title"
                label="Title"
                autoFocus
            />
            <TextArea
                faramElementName="description"
                label="Description"
            />
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
            <NumberInput
                faramElementName="accessPointCount"
                label="Access Point Count"
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
                label="atmAvailable"
                faramElementName="ATM Available"
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
}

export const financeSchema = {
    fields: {
        title: [requiredCondition],
        description: [],
        cbsCode: [],
        population: [],
        channel: [],
        accessPointCount: [],
        type: [],
        phoneNumber: [],
        emailAddress: [],
        website: [],
        openingHours: [],
        operatorType: [],
        bankType: [],
        atmAvailable: [],
        placeAddress: [],
        network: [],
    },
};

export default FinanceForm;
