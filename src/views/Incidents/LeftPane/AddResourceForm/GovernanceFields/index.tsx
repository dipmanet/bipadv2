import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';

const GovernanceFields: FunctionComponent = () => (
    <>
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
    </>
);

export default GovernanceFields;
