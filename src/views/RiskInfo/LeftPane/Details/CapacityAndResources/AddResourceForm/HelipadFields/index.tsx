/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';
import styles from '../styles.scss';

import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});
const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
const HelipadFields: FunctionComponent = ({ resourceEnums, faramValues,
    optionsClassName, iconName, language: { language } }) => {
    const ownerShipCondition = [
        { key: 'Civil Aviation Authority of Nepal', label: language === 'en' ? 'Civil Aviation Authority of Nepal' : 'नेपाल नागरिक उड्डयन प्राधिकरण' },
        { key: 'Nepal Army', label: language === 'en' ? 'Nepal Army' : 'नेपाली सेना' },
        { key: 'Nepal Police', label: language === 'en' ? 'Nepal Police' : 'नेपाल प्रहरी' },
        { key: 'Armed Police Force', label: language === 'en' ? 'Armed Police Force' : 'सशस्त्र प्रहरी बल' },
        { key: 'Other', label: language === 'en' ? 'Other' : 'अन्य' },
    ];
    const booleanCondition = [{ key: true, label: language === 'en' ? 'Yes' : 'हो' },
    { key: false, label: language === 'en' ? 'No' : 'होइन' }];
    const booleanConditionNe = [{ key: true, label: language === 'en' ? 'Yes' : 'छ' },
    { key: false, label: language === 'en' ? 'No' : 'छैन' }];

    const surfaceLevel = [
        { key: 'Ground', label: language === 'en' ? 'Ground' : 'ग्राउन्ड' },
        { key: 'Elevated', label: language === 'en' ? 'Elevated' : 'उचाई' }];

    const surfaceType = [{ key: 'Concrete', label: language === 'en' ? 'Concrete' : 'कंक्रीट' },
    { key: 'Grass land', label: language === 'en' ? 'Grass land' : 'घाँसे  जमिन' },
    { key: 'Dirt surface', label: language === 'en' ? 'Dirt surface' : 'माटो सतह' },
    { key: 'Other', label: language === 'en' ? 'Other' : 'अन्य' }];
    const helipadCondition = [
        { key: 'Operational', label: language === 'en' ? 'Operational' : 'संचालनमा छ ' },
        { key: 'Need Repair', label: language === 'en' ? 'Need Repair' : 'मर्मत चाहिन्छ' },
        { key: 'Not in working condition', label: language === 'en' ? 'Not in working condition' : 'काम गर्ने अवस्थामा छैन' }];
    return (
        <Translation>
            {
                t => (
                    <>
                        {/* <TextInput
                faramElementName="operatingDate"
                label="Operating Date"
            /> */}
                        <DateInput
                            faramElementName="operatingDate"
                            label={t('Operating Date')}
                            inputFieldClassName={styles.dateInput}
                            language={language}
                        />
                        <SelectInput
                            faramElementName="ownership"
                            label={t('Ownership')}
                            options={ownerShipCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.ownership === 'Other'
                            && (
                                <TextInput
                                    faramElementName="otherOwnership"
                                    label={t('If ownership is not mentioned above (other), name it here')}
                                />
                            )
                        }
                        <SelectInput
                            faramElementName="followsGuidelines"
                            label={t('Is the helipad build following the standard operational guidelines, 2075 of Civil Aviation Authority of Nepal?')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <TextInput
                            faramElementName="area"
                            label={t('Area of Helipad(sq m)')}
                        />
                        <TextInput
                            faramElementName="altitude"
                            label={t('Altitude')}
                        />
                        <h1>{t('HELIPAD DETAILS')}</h1>
                        <SelectInput
                            faramElementName="surfaceLevel"
                            label={t('Surface Level')}
                            options={surfaceLevel}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            faramElementName="surfaceType"
                            label={t('Surface Type')}
                            options={surfaceType}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.surfaceType === 'Other'
                            && (
                                <TextInput
                                    faramElementName="otherSurfaceType"
                                    label={t('If the surface type is not mentioned above (other), name it here.')}
                                />
                            )
                        }
                        <SelectInput
                            faramElementName="hasRoadAccess"
                            label={t('Has Road Access?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            faramElementName="storageFacilityAvailable"
                            label={t('Has Storage Facility Available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            faramElementName="internetFacilityAvailable"
                            label={t('Has Internet Facility Available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            faramElementName="windDirectionIndicatorAvailable"
                            label={t('Has Wind Direction Indicator Available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            faramElementName="heliMarkerAvailable"
                            label={t('Has Heli Marker Available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            faramElementName="nightLightingAvailable"
                            label={t('Has Night lighting Available?')}
                            options={booleanConditionNe}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            faramElementName="helipadCondition"
                            label={t('Condition Of Helipad?')}
                            options={helipadCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <h1>{t('CONTACT')}</h1>
                        <TextInput
                            faramElementName="focalPersonName"
                            label={t('Name of focal person')}
                        />
                        <TextInput
                            faramElementName="focalPersonNumber"
                            label={t('Contact of focal person')}
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


export default connect(mapStateToProps)(HelipadFields);
