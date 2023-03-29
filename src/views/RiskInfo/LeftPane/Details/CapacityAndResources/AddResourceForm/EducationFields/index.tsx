import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import TimeInput from '#rsci/TimeInput';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';
import {
    languageSelector,
} from '#selectors';
import styles from '../styles.scss';


interface Props {
    resourceEnums: EnumItem[];
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const EducationFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName, language: { language } }: Props) => {
    // const typeOptions = getAttributeOptions(resourceEnums, 'type');


    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');

    const booleanCondition = [{ key: true, label: language === 'en' ? 'Yes' : 'हो' }, { key: false, label: language === 'en' ? 'No' : 'होइन' }];
    const booleanConditionNe = [{ key: true, label: language === 'en' ? 'Yes' : 'छ' }, { key: false, label: language === 'en' ? 'No' : 'छैन' }];


    return (

        <Translation>
            {
                t => (
                    <>
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="operatorType"
                            label={t('Operator Type')}
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
                                    label={t('Please specify operator type')}
                                />
                            )
                        }

                        <NumberInput
                            faramElementName="classroomCount"
                            label={t('Number of Classrooms')}
                        />
                        <NumberInput
                            faramElementName="area"
                            label={t('Area Of School (Sq.Km)')}
                        />
                        <h2>{t('NUMBER OF EMPLOYEES')}</h2>
                        <NumberInput
                            faramElementName="noOfMaleEmployee"
                            label={t('Number of Male Employees')}
                        />
                        <NumberInput
                            faramElementName="noOfFemaleEmployee"
                            label={t('Number of Female Employees')}
                        />
                        <NumberInput
                            faramElementName="noOfOtherEmployee"
                            label={t('Number of Other Employees')}
                        />
                        <NumberInput
                            faramElementName="noOfEmployee"
                            label={t('Total Number of Employees')}
                            disabled
                        />
                        <NumberInput
                            faramElementName="noOfDifferentlyAbledMaleEmployees"
                            label={t('Number of Differently-abled Male Employees')}
                        />
                        <NumberInput
                            faramElementName="noOfDifferentlyAbledFemaleEmployees"
                            label={t('Number of Differently-abled Female Employees')}
                        />
                        <NumberInput
                            faramElementName="noOfDifferentlyAbledOtherEmployees"
                            label={t('Number of Differently-abled Other Employees')}
                        />
                        <h2>{t('NUMBER OF STUDENTS')}</h2>
                        <NumberInput
                            faramElementName="noOfMaleStudent"
                            label={t('Number of Male Students')}
                        />
                        <NumberInput
                            faramElementName="noOfFemaleStudent"
                            label={t('Number of Female Students')}
                        />
                        <NumberInput
                            faramElementName="noOfOtherStudent"
                            label={t('Number of Other Students')}
                        />
                        <NumberInput
                            faramElementName="noOfStudent"
                            label={t('Total Number of Students')}
                            disabled
                        />
                        <NumberInput
                            faramElementName="noOfDifferentlyAbledMaleStudents"
                            label={t('Number of Differently-abled Male Students')}
                        />
                        <NumberInput
                            faramElementName="noOfDifferentlyAbledFemaleStudents"
                            label={t('Number of Differently-abled Female Students')}
                        />
                        <NumberInput
                            faramElementName="noOfDifferentlyAbledOtherStudents"
                            label={t('Number of Differently-abled Other Students')}
                        />
                        <h2>{t('STUDENT AGE GROUP')}</h2>
                        <NumberInput
                            faramElementName="noOfStudentsLessThanTen"
                            label={t('Less than 10 years')}
                        />
                        <NumberInput
                            faramElementName="noOfStudentsTenToFifteen"
                            label={t('Between 10-15 years')}
                        />
                        <NumberInput
                            faramElementName="noOfStudentsFifteenToTwenty"
                            label={t('Between 15-20 years')}
                        />
                        <NumberInput
                            faramElementName="noOfStudentsMoreThanTwenty"
                            label={t('Above 20 years')}
                        />
                        <h1>{t('DISASTER MANAGEMENT')}</h1>
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="isDesignedFollowingBuildingCode"
                            label={t('Is the school designed following building codes?')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />

                        <TextInput
                            faramElementName="remarksOnBuildingCode"
                            label={t('Remarks on Building Code')}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasOpenSpace"
                            label={language === 'en'
                                ? 'Does the facility have open space?'
                                : 'के विद्यालयमा खुल्ला ठाउँ (OpenSpace) छ? '}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.hasOpenSpace
                            && (
                                <TextInput
                                    faramElementName="areaOfOpenSpace"
                                    label={t('Area of Open Space (Sq.Km)')}
                                />
                            )}
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasDisableFriendlyInfrastructure"
                            label={language === 'en'
                                ? 'Does the facility have disabled friendly infrastructure?'
                                : 'के विद्यालयमा अपांग मैत्री पूर्वाधार निर्माण गरिएका छन्? '}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.hasDisableFriendlyInfrastructure
                            && (
                                <TextInput
                                    faramElementName="specifyInfrastructure"
                                    label={t('Disable Friendly Infrastructures')}
                                />
                            )}
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasEvacuationRoute"
                            label={t('Does the facility have evacuation route?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasDisasterCommittee"
                            label={t('Does the school have disaster committee or/and other related clubs?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.hasDisasterCommittee
                            && (
                                <TextInput
                                    faramElementName="specifyCommittee"
                                    label={language === 'en'
                                        ? 'Disaster Management committee or related Clubs'
                                        : 'यदी, गर्छ भने, यहाँ उल्लेख गर्नुहोस्र ।'}
                                />
                            )}
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasDisasterAwarenessConducted"
                            label={t('Has disaster related awareness and training programs been conducted within the school?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.hasDisasterAwarenessConducted
                            && (
                                <TextInput
                                    faramElementName="specifyAwarenessProgram"
                                    label={language === 'en'
                                        ? 'Name of Disaster related awareness and training program conducted within the school.'
                                        : 'यदी, गर्छ भने, यहाँ उल्लेख गर्नुहोस्र ।'}
                                />
                            )}
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="providesDisasterEducationToStudent"
                            label={t('Does the school provide disaster related education to students?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />

                        {faramValues.providesDisasterEducationToStudent
                            && (
                                <TextInput
                                    faramElementName="specifyDisasterEducation"
                                    label={language === 'en'
                                        ? 'Disaster related education provided by school'
                                        : 'यदी, गर्छ भने, यहाँ उल्लेख गर्नुहोस्र ।'}
                                />
                            )}
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasHealthCenterPsychoCounseling"
                            label={t('Does the school have health center and/or psycho-counseling?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />

                        <h2>{t('OPENING HOUR')}</h2>

                        {/* <TextInput
                faramElementName="startTime"
                label="Start Time"
            /> */}
                        <TimeInput
                            faramElementName="startTime"
                            label={t('Start Time')}
                        />
                        <TimeInput
                            faramElementName="endTime"
                            label={t('End Time')}
                        />
                        <TextInput
                            faramElementName="remarksOnOpeningHours"
                            label={t('Remarks on opening hours')}
                        />
                        <h1>{t('CONTACT')}</h1>
                        <TextInput
                            faramElementName="phoneNumber"
                            label={t('Phone Number')}
                        />
                        <TextInput
                            faramElementName="emailAddress"
                            label={t('Email Address')}
                        />
                        <TextInput
                            faramElementName="website"
                            label={t('Website')}
                        />
                        <TextInput
                            faramElementName="localAddress"
                            label={t('Local Address')}
                        />
                        {((faramValues.resourceType !== 'openspace') || (faramValues.resourceType !== 'communityspace'))
                            ? (
                                <RawFileInput
                                    faramElementName="picture"
                                    showStatus
                                    accept="image/*"
                                    language={language}
                                >
                                    {t('Upload Image')}
                                </RawFileInput>
                            ) : ''}


                    </>
                )
            }
        </Translation>

    );
};

export default connect(mapStateToProps)(EducationFields);
