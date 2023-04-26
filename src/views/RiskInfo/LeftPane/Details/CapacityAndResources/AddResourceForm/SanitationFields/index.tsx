import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import { languageSelector } from '#selectors';
import styles from '../styles.scss';


const mapStateToProps = state => ({
    language: languageSelector(state),
});

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const SanitationFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName, language: { language } }: Props) => {
    // const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    const booleanCondition = [{ key: true, label: language === 'en' ? 'Yes' : 'हो' }, { key: false, label: language === 'en' ? 'No' : 'होइन' }];
    const operatorTypeOptions = [{ key: 'Government', label: language === 'en' ? 'Government' : 'सरकारी' }, { key: 'Private', label: language === 'en' ? 'Private' : 'निजी' }, { key: 'Community', label: language === 'en' ? 'Community' : 'सामुदायिक' }, { key: 'Other', label: language === 'en' ? 'Other' : 'अन्य' }];

    return (
        <Translation>
            {
                t => (
                    <>

                        <TextInput
                            faramElementName="area"
                            label={t('Area')}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="isPermanent"
                            label={t('Is it Permanent?')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.type === 'Public Toilet'
                            && (
                                <>
                                    <NumberInput
                                        faramElementName="noOfToilets"
                                        label={t('If the facility is public toilet, number of toilet available')}
                                    />
                                    <NumberInput
                                        faramElementName="noOfMaleToilets"
                                        label={t('If the facility is public toilet, number of male toilet available')}
                                    />
                                    <NumberInput
                                        faramElementName="noOfFemaleToilets"
                                        label={t('If the facility is public toilet, number of female toilet available')}
                                    />
                                    <NumberInput
                                        faramElementName="noOfCommonToilets"
                                        label={t('If the facility is public toilet, number of common toilet available')}
                                    />
                                    <NumberInput
                                        faramElementName="noOfTaps"
                                        label={t('If the facility is public toilet, number of tabs available')}
                                    />
                                </>
                            )

                        }
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
                                    label={t('If type is not mentioned above (other), name it here')}
                                />
                            )
                        }
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

export default connect(mapStateToProps)(SanitationFields);
