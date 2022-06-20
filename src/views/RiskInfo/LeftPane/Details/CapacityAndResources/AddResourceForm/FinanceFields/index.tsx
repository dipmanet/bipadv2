import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import Checkbox from '#rsci/Checkbox';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import TimeInput from '#rsci/TimeInput';
import styles from '../styles.scss';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const FinanceFields: FunctionComponent<Props> = ({ resourceEnums, faramValues,
    optionsClassName, iconName, language: { language } }: Props) => {
    // const channelOptons = getAttributeOptions(resourceEnums, 'channel');
    // const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    // const bankTypeOptions = getAttributeOptions(resourceEnums, 'bank_type');
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
                                    label={t('Please specify (other) operator type ')}
                                />
                            )
                        }
                        <h2>{t('SERVICES AVAILABLE')}</h2>
                        <Checkbox
                            faramElementName="bank"
                            label={t('Bank')}
                        />
                        <Checkbox
                            faramElementName="moneyExchange"
                            label={t('Money Exchange')}
                        />
                        <Checkbox
                            faramElementName="atm"
                            label={t('ATM')}
                        />
                        <Checkbox
                            faramElementName="hasOtherServices"
                            label={t('Other')}
                        />
                        {faramValues.hasOtherServices
                            && (
                                <TextInput
                                    faramElementName="otherServices"
                                    label={t('Other Services')}
                                />
                            )
                        }
                        <NumberInput
                            faramElementName="serviceUsers"
                            label={t('Number of Service Users')}
                        />
                        <h2>{t('NUMBER OF EMPLOYEES')}</h2>
                        <NumberInput
                            faramElementName="noOfMaleEmployee"
                            label={t('Number of Male Employee')}
                        />
                        <NumberInput
                            faramElementName="noOfFemaleEmployee"
                            label={t('Number of Female Employee')}
                        />
                        <NumberInput
                            faramElementName="noOfOtherEmployee"
                            label={t('Number of Other Employee')}
                        />
                        <NumberInput
                            faramElementName="noOfEmployee"
                            label={t('Total Number of Employee')}
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

                        <h2>{t('OPENING HOUR')}</h2>

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

export default connect(mapStateToProps)(FinanceFields);
