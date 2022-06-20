/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import { getAttributeOptions } from '#utils/domain';
import NumberInput from '#rsci/NumberInput';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import styles from '../styles.scss';
import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
const FireEngineFields: FunctionComponent = ({ resourceEnums, faramValues,
    optionsClassName, iconName, language: { language } }) => {
    const booleanCondition = [{ key: true, label: language === 'en' ? 'Yes' : 'हो' },
    { key: false, label: language === 'en' ? 'No' : 'होइन' }];
    const booleanConditionNe = [{ key: true, label: language === 'en' ? 'Yes' : 'छ' },
    { key: false, label: language === 'en' ? 'No' : 'छैन' }];


    const fireEngineCondition = [
        { key: 'Operational', label: language === 'en' ? 'Operational' : 'संचालनमा छ ' },
        { key: 'Need Repair', label: language === 'en' ? 'Need Repair' : 'मर्मत चाहिन्छ' },
        { key: 'Not in working condition', label: language === 'en' ? 'Not in working condition' : 'काम गर्ने अवस्थामा छैन' }];
    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    return (
        // <DateInput
        // faramElementName="operatingDate"
        //     label="Operating Date"
        // />
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
                                    label={t('Please specify (other) operator type')}
                                />
                            )
                        }
                        <TextInput
                            faramElementName="focalPersonName"
                            label={t('Name of Focal Person')}
                        />
                        <TextInput
                            faramElementName="focalPersonContactNumber"
                            label={t('Contact Information of Focal Person')}
                        />
                        <NumberInput
                            faramElementName="numberOfTrainedEmployees"
                            label={t('Number of trained employee')}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasSafetyEquipmentEnabled"
                            label={t('Is safety equipment available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <TextInput
                            faramElementName="serviceSharingMuns"
                            label={t('Are there multiple municipalities that share the services from the firefighting apparatus?')}
                        />
                        <NumberInput
                            faramElementName="capacityOfFireEngine"
                            label={t('Capacity (Litre)')}
                        />
                        <TextInput
                            faramElementName="vehicleNumber"
                            label={t('Vehicle Number')}
                        />
                        <TextInput
                            faramElementName="driverName"
                            label={t("Driver's Name")}
                        />
                        <TextInput
                            faramElementName="contactNumber"
                            label={t("Driver's Contact Number")}
                        />
                        <TextInput
                            faramElementName="alternativeContactNumber"
                            label={t('Driver’s Alternative Number')}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="condition"
                            label={t('Condition of Fire fighting apparatus')}
                            options={fireEngineCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
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


export default connect(mapStateToProps)(FireEngineFields);
