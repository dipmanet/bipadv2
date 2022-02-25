/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import TimeInput from '#rsci/TimeInput';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import styles from '../styles.scss';
import DateInput from '#rsci/DateInput';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const WaterSupplyInfrastructureFields:
    FunctionComponent<Props> = ({ resourceEnums,
        faramValues, optionsClassName, iconName }: Props) => {
        // const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
        const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
        const operatorTypeOptions = [
            {
                key: 'Private',
                label: 'Private',
            },
            {
                key: 'Government',
                label: 'Government',
            },
            {
                key: 'Community',
                label: 'Community',
            },
            {
                key: 'Other',
                label: 'Other',
            },
        ];
        const placementofTank = [
            {
                key: 'Surface',
                label: 'Surface',
            },
            {
                key: 'Underground',
                label: 'Underground',
            },
            {
                key: 'Elevated',
                label: 'Elevated',
            },
        ];
        const sourceOfWater = [
            {
                key: 'Underground ',
                label: 'Underground ',
            },
            {
                key: 'Lifting water ',
                label: 'Lifting water ',
            },
        ];
        console.log('resource enum', resourceEnums);
        return (
            <>
                <SelectInput
                    faramElementName="placementOfWaterTank"
                    label="Placement of Tank"
                    options={placementofTank}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    optionsClassName={optionsClassName}
                    iconName={iconName}
                />
                <SelectInput
                    faramElementName="sourceOfWater"
                    label="Source of Water"
                    options={sourceOfWater}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    optionsClassName={optionsClassName}
                    iconName={iconName}
                />

                <SelectInput
                    faramElementName="isElectricityNeededToPumpWater"
                    label="Is electricity needed to pump water?"
                    options={booleanCondition}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    optionsClassName={optionsClassName}
                    iconName={iconName}
                />
                <DateInput
                    faramElementName="tankBuildDate"
                    label="When system was build? "
                    inputFieldClassName={styles.dateInput}
                />


                <SelectInput
                    faramElementName="operatorType"
                    label="Operator Type"
                    options={operatorTypeOptions}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    optionsClassName={optionsClassName}
                    iconName={iconName}
                />
                {(faramValues.operatorType === 'Other')
                    && (
                        <TextInput
                            faramElementName="otherOperatorType"
                            label="If type is not mentioned above (other), name it here"
                        />
                    )
                }

                <SelectInput
                    faramElementName="hasTechnicalStaff"
                    label="Does the facility have technical staff?"
                    options={booleanCondition}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    optionsClassName={optionsClassName}
                    iconName={iconName}
                />
                {faramValues.hasTechnicalStaff
                    && (
                        <TextInput
                            faramElementName="technicalStaffDetail"
                            label="Name and contact number of technical staff"
                        />
                    )

                }
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
                <NumberInput
                    faramElementName="noOfServiceUsers"
                    label="Number of Service Users"
                />
                <SelectInput
                    faramElementName="isWaterSupplyOperational"
                    label="Is the water supply infrastructure operational?"
                    options={booleanCondition}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    optionsClassName={optionsClassName}
                    iconName={iconName}
                />
                <h1>DISASTER MANAGEMENT</h1>
                <SelectInput
                    faramElementName="isDesignedFollowingBuildingCode"
                    label="Is the facility designed following building codes?
                "
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
                            label="Please specify,Disable friendly infrastructures"
                        />
                    )}


                <h2>OPENING HOUR</h2>
                {/* <label htmlFor="startTime">START TIME</label>
            <input type="time" id="startTime" name="startTime" /> */}
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

export default WaterSupplyInfrastructureFields;
