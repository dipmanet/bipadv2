import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import TimeInput from '#rsci/TimeInput';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';
import styles from '../styles.scss';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const EvacuationCentreFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName }: Props) => {
    // const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const operatorTypeOptions = [{ key: 'Government', label: 'Government' }, { key: 'INGO', label: 'INGO' }, { key: 'NGO', label: 'NGO' }, { key: 'CSO', label: 'CSO' }];

    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
    const structureOption = [{ key: 'Single story', label: 'Single story' }, { key: 'Multiple story', label: 'Multiple story' }];


    return (
        <>
            <SelectInput
                faramElementName="operatedBy"
                label="Operated By"
                options={operatorTypeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />

            <SelectInput
                faramElementName="structure"
                label="Is the facility single story or multi story?"
                options={structureOption}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <NumberInput
                faramElementName="capacity"
                label="Number of people that can be accommodated"
            />
            <TextInput
                faramElementName="useOfEvacuationCenter"
                label="Use of evacuation center, please specify"
            />
            <h1>DISASTER MANAGEMENT</h1>

            <SelectInput
                faramElementName="designedWithBuildingCode"
                label="Is the building designed following building code?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="hasEvacuationRoute"
                label="Does the facility have evacuation route?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="hasDrinkingWater"
                label="Is drinking water available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="hasToilet"
                label="Is toilet available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
            />
            {faramValues.hasToilet
                && (
                    <NumberInput
                        faramElementName="noOfToilets"
                        label="How many toilets are available? "
                    />

                )}
            <SelectInput
                faramElementName="hasHandWashingFacility"
                label="Does the facility have hand washing facility?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
            />
            {faramValues.hasHandWashingFacility
                && (
                    <NumberInput
                        faramElementName="noOfHandWashingFacility"
                        label="How many hand washing facility is available?"
                    />

                )}
            <SelectInput
                faramElementName="hasFoodPreparationFacility"
                label="Is food preparation facility available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
            />
            {faramValues.hasFoodPreparationFacility
                && (
                    <NumberInput
                        faramElementName="noOfFoodPreparationFacility"
                        label="How many food preparation facility is available?"
                    />

                )}
            <SelectInput
                faramElementName="hasSleepingFacility"
                label="Is sleeping facility available such as bed/cot/mat?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
            />
            {faramValues.hasSleepingFacility
                && (
                    <NumberInput
                        faramElementName="noOfSleepingFacility"
                        label=" How many sleeping facility is available?"
                    />

                )}
            <SelectInput
                faramElementName="hasDisableFriendlyInfrastructure"
                label="Does the facility have disabled friendly infrastructure?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
            />
            {faramValues.hasDisableFriendlyInfrastructure
                && (
                    <TextInput
                        faramElementName="specifyInfrastructure"
                        label=" Please specify Disable Friendly Infrastructures"
                    />

                )}
            <h2>OPENING HOUR</h2>

            {/* <TextInput
                faramElementName="startTime"
                label="Start Time"
            /> */}
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

export default EvacuationCentreFields;
