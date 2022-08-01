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

const EducationFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName }: Props) => {
    // const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');

    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];

    return (
        <>
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
                        label="Please specify operator type"
                    />
                )
            }

            <NumberInput
                faramElementName="classroomCount"
                label="Number of Classrooms"
            />
            <NumberInput
                faramElementName="area"
                label="Area Of School (Sq.Km)"
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
            <h2>NUMBER OF STUDENTS</h2>
            <NumberInput
                faramElementName="noOfMaleStudent"
                label="Number of Male Students"
            />
            <NumberInput
                faramElementName="noOfFemaleStudent"
                label="Number of Female Students"
            />
            <NumberInput
                faramElementName="noOfOtherStudent"
                label="Number of Other Students"
            />
            <NumberInput
                faramElementName="noOfStudent"
                label="Total Number of Students"
                disabled
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledMaleStudents"
                label="Number of Differently-abled Male Students"
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledFemaleStudents"
                label="Number of Differently-abled Female Students"
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledOtherStudents"
                label="Number of Differently-abled Other Students"
            />
            <h2>STUDENT AGE GROUP</h2>
            <NumberInput
                faramElementName="noOfStudentsLessThanTen"
                label="Less than 10 years"
            />
            <NumberInput
                faramElementName="noOfStudentsTenToFifteen"
                label="Between 10-15 years"
            />
            <NumberInput
                faramElementName="noOfStudentsFifteenToTwenty"
                label="Between 15-20 years"
            />
            <NumberInput
                faramElementName="noOfStudentsMoreThanTwenty"
                label="Above 20 years"
            />
            <h1>DISASTER MANAGEMENT</h1>
            <SelectInput
                faramElementName="isDesignedFollowingBuildingCode"
                label="Is the school designed following building codes?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />

            <TextInput
                faramElementName="remarksOnBuildingCode"
                label="Remarks on Building Code"
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
                    <TextInput
                        faramElementName="areaOfOpenSpace"
                        label="Area of Open Space (Sq.Km) "
                    />
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
                        label="Disable Friendly Infrastructures"
                    />
                )}
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
                faramElementName="hasDisasterCommittee"
                label="Does the school have disaster committee or/and other related clubs?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.hasDisasterCommittee
                && (
                    <TextInput
                        faramElementName="specifyCommittee"
                        label="Disaster Management committee or related Clubs"
                    />
                )}
            <SelectInput
                faramElementName="hasDisasterAwarenessConducted"
                label="Has disaster related awareness and training programs been conducted within the school?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.hasDisasterAwarenessConducted
                && (
                    <TextInput
                        faramElementName="specifyAwarenessProgram"
                        label="Name of Disaster related awareness and training program conducted within the school."
                    />
                )}
            <SelectInput
                faramElementName="providesDisasterEducationToStudent"
                label="Does the school provide disaster related education to students?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />

            {faramValues.providesDisasterEducationToStudent
                && (
                    <TextInput
                        faramElementName="specifyDisasterEducation"
                        label="Disaster related education provided by school"
                    />
                )}
            <SelectInput
                faramElementName="hasHealthCenterPsychoCounseling"
                label="Does the school have health center and/or psycho-counseling?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />

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

export default EducationFields;
