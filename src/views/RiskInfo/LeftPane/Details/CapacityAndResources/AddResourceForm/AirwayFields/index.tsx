/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';
import TimeInput from '#rsci/TimeInput';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import styles from '../styles.scss';
import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
const AirwayFields: FunctionComponent = ({ resourceEnums, faramValues,
    optionsClassName, iconName, language: { language } }) => {
    const booleanCondition = [{ key: true, label: language === 'en' ? 'Yes' : 'हो' }, { key: false, label: language === 'en' ? 'No' : 'होइन' }];
    const booleanConditionNe = [{ key: true, label: language === 'en' ? 'Yes' : 'छ' }, { key: false, label: language === 'en' ? 'No' : 'छैन' }];

    return (
        // <DateInput
        // faramElementName="operatingDate"
        //     label="Operating Date"
        // />
        <Translation>
            {
                t => (
                    <>
                        <TextInput
                            faramElementName="areaOfAirport"
                            label={t('Area of airport(Sq Km)')}
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
                        <h1>{t('DISASTER MANAGEMENT')}</h1>
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
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="isDesignedFollowingBuildingCode"
                            label={t('Is the facility designed following building codes?')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasHumanitarianStagingArea"
                            label={t('Does the facility have humanitarian staging area?')}
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
                />
                <TextInput
                    faramElementName="endTime"
                    label="End Time"
                /> */}
                        <TimeInput
                            faramElementName="startTime"
                            label={t('Start Time')}
                        />
                        <TimeInput
                            faramElementName="endTime"
                            label={t('End Time')}
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


export default connect(mapStateToProps)(AirwayFields);
