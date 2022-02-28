import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import TimeInput from '#rsci/TimeInput';
import styles from '../styles.scss';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
const WaterwayFields: FunctionComponent = ({ resourceEnums, faramValues,
    optionsClassName, iconName }) => {
    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
    const boatCondition = [{ key: 'Good', label: 'Good' }, { key: 'Bad', label: 'Bad' }];

    return (

        <>
            <SelectInput
                faramElementName="condition"
                label="Select the condition of boats"
                options={boatCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />


            <h2>NUMBER OF EMPLOYEES</h2>
            <NumberInput
                faramElementName="noOfMaleEmployee"
                label="Number of Male Employees"
            />
            <NumberInput
                faramElementName="noOfFemaleEmployee"
                label="Number of Female Employees"
            />
            <NumberInput
                faramElementName="noOfOtherEmployee"
                label="Number of Other Employees"
            />
            <NumberInput
                faramElementName="noOfEmployee"
                label="Total Number of Employees"
                disabled
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledMaleEmployees"
                label="Number of Differently-abled Male Employees"
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledFemaleEmployees"
                label="Number of Differently-abled Female Employees"
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledOtherEmployees"
                label="Number of Differently-abled Other Employees"
            />
            <h1>DISASTER MANAGEMENT</h1>

            <SelectInput
                faramElementName="hasDisableFriendlyInfrastructure"
                label="Does the facility have disabled friendly infrastructure?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.hasDisableFriendlyInfrastructure
                && (
                    <TextInput
                        faramElementName="specifyInfrastructure"
                        label="Please specify,Disable friendly infrastructures "
                    />
                )}


            <h2>OPENING HOUR</h2>

            <TimeInput
                faramElementName="startTime"
                label="Start Time"
            />
            <TimeInput
                faramElementName="endTime"
                label="End Time"
            />
            <TextInput
                faramElementName="remarksOnOpeningHours"
                label="Remarks on Opening Hours"
            />
            <h1>CONTACT</h1>
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
                faramElementName="localAddress"
                label="Local Address"
            />
            {((faramValues.resourceType !== 'openspace') || (faramValues.resourceType !== 'communityspace'))
                ? (
                    <RawFileInput
                        faramElementName="picture"
                        showStatus
                        accept="image/*"
                    >
                        Upload Image
                    </RawFileInput>
                ) : ''}


        </>
    );
};


export default WaterwayFields;
