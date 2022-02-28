import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import Checkbox from '#rsci/Checkbox';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import NumberInput from '#rsci/NumberInput';
import TimeInput from '#rsci/TimeInput';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';
import styles from '../styles.scss';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const CulturalFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName }: Props) => {
    // const religionOptions = getAttributeOptions(resourceEnums, 'religion');
    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
    return (
        <>
            <h1>DISASTER MANAGEMENT</h1>
            <SelectInput
                faramElementName="isDesignedFollowingBuildingCode"
                label="Is the facility designed following building codes?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="hasOpenSpace"
                label="Does the facility have open space?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.hasOpenSpace
                && (
                    <>
                        <TextInput
                            faramElementName="areaOfOpenSpace"
                            label="Area of open space (Sq.Km)"
                        />
                        <NumberInput
                            faramElementName="capacityOfOpenSpace"
                            label="Total capacity of the open space."
                        />
                    </>
                )}
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
                        label="Please specify,disable friendly infrastructures"
                    />
                )}
            <SelectInput
                faramElementName="drinkingWater"
                label="Is drinking water available? "
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="toilet"
                label="Is toilet available? "
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.toilet
                && (
                    <NumberInput
                        faramElementName="noOfToilets"
                        label="Number Of Toilets"
                    />
                )
            }

            <SelectInput
                faramElementName="hasWashFacility"
                label="Does the facility have WASH facility?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.hasWashFacility
                && (
                    <TextInput
                        faramElementName="specifyWashFacility"
                        label="Specify WASH facility available "
                    />

                )}
            <SelectInput
                faramElementName="hasSleepingFacility"
                label="Has sleeping facility available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.hasSleepingFacility
                && (
                    <NumberInput
                        faramElementName="noOfBeds"
                        label="Number of beds available"
                    />
                )}
            <NumberInput
                faramElementName="noOfMats"
                label="Number of mats available"
            />
            <NumberInput
                faramElementName="noOfCots"
                label="Number of cots available"
            />
            <TextInput
                faramElementName="otherFacilities"
                label="If other facilities are available, please specify."
            />
            <SelectInput
                faramElementName="hasElectricity"
                label="Does the facility have electricity facility?"
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
                label="Remarks on opening hours"
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

export default CulturalFields;
