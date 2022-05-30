/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
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
import { languageSelector } from '#selectors';

interface Props {
    resourceEnums: EnumItem[];
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const WaterSupplyInfrastructureFields:
    FunctionComponent<Props> = ({ resourceEnums,
        faramValues, optionsClassName, iconName, language: { language } }: Props) => {
        // const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
        const booleanCondition = [{ key: true, label: language === 'en' ? 'Yes' : 'हो' },
        { key: false, label: language === 'en' ? 'No' : 'होइन' }];
        const booleanConditionNe = [{ key: true, label: language === 'en' ? 'Yes' : 'छ' },
        { key: false, label: language === 'en' ? 'No' : 'छैन' }];
        const operatorTypeOptions = [
            {
                key: 'Private',
                label: language === 'en' ? 'Private' : 'निजी',
            },
            {
                key: 'Government',
                label: language === 'en' ? 'Government' : 'सरकारी',
            },
            {
                key: 'Community',
                label: language === 'en' ? 'Community' : 'सामुदायिक',
            },
            {
                key: 'Other',
                label: language === 'en' ? 'Other' : 'अन्य',
            },
        ];
        const placementofTank = [
            {
                key: 'Surface',
                label: language === 'en' ? 'Surface' : 'सतह',
            },
            {
                key: 'Underground',
                label: language === 'en' ? 'Underground' : 'भूमिगत',
            },
            {
                key: 'Elevated',
                label: language === 'en' ? 'Elevated' : 'उच्‍च',
            },
        ];
        const sourceOfWater = [
            {
                key: 'Underground ',
                label: language === 'en' ? 'Underground' : 'भूमिगत',
            },
            {
                key: 'Lifting water ',
                label: language === 'en' ? 'Lifting water' : 'उठाएको पानी',
            },
        ];
        return (
            <Translation>
                {
                    t => (
                        <>
                            <SelectInput
                                faramElementName="placementOfWaterTank"
                                label={t('Placement of Tank')}
                                options={placementofTank}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                optionsClassName={optionsClassName}
                                iconName={iconName}
                            />
                            <SelectInput
                                faramElementName="sourceOfWater"
                                label={t('Source of Water')}
                                options={sourceOfWater}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                optionsClassName={optionsClassName}
                                iconName={iconName}
                            />

                            <SelectInput
                                faramElementName="isElectricityNeededToPumpWater"
                                label={t('Is electricity needed to pump water?')}
                                options={booleanCondition}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                optionsClassName={optionsClassName}
                                iconName={iconName}
                            />
                            <DateInput
                                faramElementName="tankBuildDate"
                                label={t('When system was build?')}
                                inputFieldClassName={styles.dateInput}
                                language={language}
                            />


                            <SelectInput
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
                                        label={t('If type is not mentioned above (other), name it here')}
                                    />
                                )
                            }

                            <SelectInput
                                faramElementName="hasTechnicalStaff"
                                label={t('Does the facility have technical staff?')}
                                options={booleanConditionNe}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                optionsClassName={optionsClassName}
                                iconName={iconName}
                            />
                            {faramValues.hasTechnicalStaff
                                && (
                                    <TextInput
                                        faramElementName="technicalStaffDetail"
                                        label={t('Name and contact number of technical staff')}
                                    />
                                )

                            }
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
                            <NumberInput
                                faramElementName="noOfServiceUsers"
                                label={t('Number of Service Users')}
                            />
                            <SelectInput
                                faramElementName="isWaterSupplyOperational"
                                label={t('Is the water supply infrastructure operational?')}
                                options={booleanConditionNe}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                optionsClassName={optionsClassName}
                                iconName={iconName}
                            />
                            <h1>{t('DISASTER MANAGEMENT')}</h1>
                            <SelectInput
                                faramElementName="isDesignedFollowingBuildingCode"
                                label={t('Is the facility designed following building codes?')}
                                options={booleanCondition}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                optionsClassName={optionsClassName}
                                iconName={iconName}
                            />
                            <SelectInput
                                faramElementName="hasEvacuationRoute"
                                label={t('Does the facility have evacuation route?')}
                                options={booleanConditionNe}
                                keySelector={keySelector}
                                labelSelector={labelSelector}
                                optionsClassName={optionsClassName}
                                iconName={iconName}
                            />

                            <SelectInput
                                faramElementName="hasDisableFriendlyInfrastructure"
                                label={t('Does the facility have disabled friendly infrastructure?')}
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
                                        label={t('Please specify,Disable friendly infrastructures')}
                                    />
                                )}


                            <h2>{t('OPENING HOUR')}</h2>
                            {/* <label htmlFor="startTime">START TIME</label>
            <input type="time" id="startTime" name="startTime" /> */}
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
                                label={t('Remarks on Opening Hours')}
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

export default connect(mapStateToProps)(WaterSupplyInfrastructureFields);
