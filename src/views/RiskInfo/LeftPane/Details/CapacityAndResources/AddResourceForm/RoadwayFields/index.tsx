import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import TimeInput from '#rsci/TimeInput';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import styles from '../styles.scss';

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
const RoadwayFields: FunctionComponent = ({ resourceEnums, faramValues,
    optionsClassName, iconName }) => {
    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];

    const type = [{ key: 'Vehicle Center', label: 'Vehicle Center' }, { key: 'Vehicle Committee', label: 'Vehicle Committee' }];


    return (

        <>
            <SelectInput
                faramElementName="type"
                label="Select either you are entering the details of vehicle center such as bus parks and stops or vehicle committee. "
                options={type}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <NumberInput
                faramElementName="numberOfTransporationFacilityAvailable"
                label="Number of transportation facilities"
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
            <SelectInput
                faramElementName="hasDisableFriendlyVehicle"
                label="Are disable friendly vehicle available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.hasDisableFriendlyVehicle
                && (
                    <NumberInput
                        faramElementName="nameAndNoOfDisableFriendlyVehicle"
                        label="Disable Friendly Vehicle types and count available?"
                    />
                )
            }
            {/* {faramValues.hasDisableFriendlyVehicle
                && (
                    <NumberInput
                        faramElementName="noOfDisableFriendlyVehicle"
                        label="Number of Disable Friendly Vehicle"
                    />
                )
            } */}
            <SelectInput
                faramElementName="designedWithBuildingCode"
                label="Is the building designed following building code? "
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />

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


export default RoadwayFields;
