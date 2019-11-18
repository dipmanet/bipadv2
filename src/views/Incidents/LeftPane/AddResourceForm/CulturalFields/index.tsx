import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';

const CulturalFields: FunctionComponent = () => (
    <>
        <TextInput
            faramElementName="religion"
            label="Religion"
        />
        <TextInput
            faramElementName="phoneNumber"
            label="Phone Number"
        />
        <TextInput
            faramElementName="openingHours"
            label="Opening Hours"
        />
    </>
);

export default CulturalFields;
