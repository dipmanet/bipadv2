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
import styles from '../styles.scss';

import { languageSelector } from '#selectors';

interface Props {
    resourceEnums: EnumItem[];
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const EvacuationCentreFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName, language: { language } }: Props) => {
    // const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const operatorTypeOptions = [
        { key: 'Government', label: language === 'en' ? 'Government' : 'सरकारी' },
        { key: 'INGO', label: language === 'en' ? 'INGO' : 'आईएनजीओ' },
        { key: 'NGO', label: language === 'en' ? 'NGO' : 'एनजीओ' },
        { key: 'CSO', label: language === 'en' ? 'CSO' : 'सामुदायिक' }];


    const booleanCondition = [
        { key: true, label: language === 'en' ? 'Yes' : 'हो' },
        { key: false, label: language === 'en' ? 'No' : 'होइन' }];
    const booleanConditionNe = [
        { key: true, label: language === 'en' ? 'Yes' : 'छ' },
        { key: false, label: language === 'en' ? 'No' : 'छैन' }];
    const structureOption = [
        { key: 'Single story', label: language === 'en' ? 'Single story' : 'एक तले' },
        { key: 'Multiple story', label: language === 'en' ? 'Multiple story' : 'बहु तले' }];


    return (
        <Translation>
            {
                t => (
                    <>
                        <SelectInput
                            faramElementName="operatedBy"
                            label={t('Operated By')}
                            options={operatorTypeOptions}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />

                        <SelectInput
                            faramElementName="structure"
                            label={t('Is the facility single story or multi story?')}
                            options={structureOption}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <NumberInput
                            faramElementName="capacity"
                            label={t('Number of people that can be accommodated')}
                        />
                        <TextInput
                            faramElementName="useOfEvacuationCenter"
                            label={t('Use of evacuation center, please specify')}
                        />
                        <h1>{t('DISASTER MANAGEMENT')}</h1>

                        <SelectInput
                            faramElementName="designedWithBuildingCode"
                            label={t('Is the building designed following building code?')}
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
                            faramElementName="hasDrinkingWater"
                            label={t('Is drinking water available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            faramElementName="hasToilet"
                            label={t('Is toilet available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                        />
                        {faramValues.hasToilet
                && (
                    <NumberInput
                        faramElementName="noOfToilets"
                        label={t('How many toilets are available?')}
                    />

                )}
                        <SelectInput
                            faramElementName="hasHandWashingFacility"
                            label={t('Does the facility have hand washing facility?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                        />
                        {faramValues.hasHandWashingFacility
                && (
                    <NumberInput
                        faramElementName="noOfHandWashingFacility"
                        label={t('How many hand washing facility is available?')}
                    />

                )}
                        <SelectInput
                            faramElementName="hasFoodPreparationFacility"
                            label={t('Is food preparation facility available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                        />
                        {faramValues.hasFoodPreparationFacility
                && (
                    <NumberInput
                        faramElementName="noOfFoodPreparationFacility"
                        label={t('How many food preparation facility is available?')}
                    />

                )}
                        <SelectInput
                            faramElementName="hasSleepingFacility"
                            label={t('Is sleeping facility available such as bed/cot/mat?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                        />
                        {faramValues.hasSleepingFacility
                && (
                    <NumberInput
                        faramElementName="noOfSleepingFacility"
                        label={t('How many sleeping facility is available?')}
                    />

                )}
                        <SelectInput
                            faramElementName="hasDisableFriendlyInfrastructure"
                            label={t('Does the facility have disabled friendly infrastructure?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                        />
                        {faramValues.hasDisableFriendlyInfrastructure
                && (
                    <TextInput
                        faramElementName="specifyInfrastructure"
                        label={t('Please specify Disable Friendly Infrastructures')}
                    />

                )}
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

export default connect(mapStateToProps)(EvacuationCentreFields);
