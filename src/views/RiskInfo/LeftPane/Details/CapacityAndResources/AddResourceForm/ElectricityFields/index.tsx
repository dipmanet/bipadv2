import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import styles from '../styles.scss';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';

import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});
interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const ElectricityFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName, language: { language } }: Props) => {
    const electricityStatus = [
        { key: 'Operational', label: language === 'en' ? 'Operational' : 'संचालनमा छ ' },
        { key: 'Under construction', label: language === 'en' ? 'Under construction' : 'मर्मत चाहिन्छ' },
        { key: 'Survey', label: language === 'en' ? 'Survey' : 'काम गर्ने अवस्थामा छैन' }];

    return (
        <Translation>
            {
                t => (
                    <>
                        <SelectInput
                            faramElementName="status"
                            label={t('Status?')}
                            options={electricityStatus}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />


                        <TextInput
                            faramElementName="capacityInMw"
                            label={t('Capacity (In Megawatt)')}
                        />
                        <TextInput
                            faramElementName="promoter"
                            label={t('Promoter')}
                        />
                        <TextInput
                            faramElementName="phoneNumber"
                            label={t('Phone Number')}
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

export default connect(mapStateToProps)(ElectricityFields);
