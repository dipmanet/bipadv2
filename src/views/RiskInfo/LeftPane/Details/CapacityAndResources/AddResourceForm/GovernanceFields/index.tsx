import React, { FunctionComponent } from 'react';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';
import NumberInput from '#rsci/NumberInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import TimeInput from '#rsci/TimeInput';
import styles from '../styles.scss';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';

import { languageSelector } from '#selectors';

interface Props {
    resourceEnums: EnumItem[];
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const GovernanceFields: FunctionComponent<Props> = ({
    resourceEnums,
    faramValues,
    optionsClassName,
    iconName,
    language: { language },
}: Props) => {
    // const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const booleanCondition = [
        { key: true, label: language === 'en' ? 'Yes' : 'हो' },
        { key: false, label: language === 'en' ? 'No' : 'होइन' },
    ];

    const booleanConditionNe = [
        { key: true, label: language === 'en' ? 'Yes' : 'छ' },
        { key: false, label: language === 'en' ? 'No' : 'छैन' },
    ];

    const operatorTypeOptions = getAttributeOptions(
        resourceEnums,
        'operator_type',
    );
    return (
        <Translation>
            {t => (
                <>
                    <SelectInput
                        faramElementName="operatorType"
                        label={t('Operator Type')}
                        options={operatorTypeOptions}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        optionsClassName={optionsClassName}
                        iconName={iconName}
                    />
                    {faramValues.operatorType === 'Other' && (
                        <TextInput
                            faramElementName="otherOperatorType"
                            label={t('Please specify (other) operator type ')}
                        />
                    )}
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
                        faramElementName="hasOpenSpace"
                        label={t('Does the facility have open space?')}
                        options={booleanConditionNe}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        optionsClassName={optionsClassName}
                        iconName={iconName}
                    />
                    {faramValues.hasOpenSpace && (
                        <TextInput
                            faramElementName="areaOfOpenSpace"
                            label={t('Area of Open Space (Sq.Km)')}
                        />
                    )}
                    <SelectInput
                        faramElementName="hasDisableFriendlyInfrastructure"
                        label={t(
                            'Does the facility have disabled friendly infrastructure?',
                        )}
                        options={booleanConditionNe}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        optionsClassName={optionsClassName}
                        iconName={iconName}
                    />
                    {faramValues.hasDisableFriendlyInfrastructure && (
                        <TextInput
                            faramElementName="specifyInfrastructure"
                            label={t('Please specify,Disable Friendly Infrastructures')}
                        />
                    )}

                    <SelectInput
                        faramElementName="hasDisasterMgmtUnit"
                        label={t(
                            'Does the facility have disaster management unit available?',
                        )}
                        options={booleanConditionNe}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        optionsClassName={optionsClassName}
                        iconName={iconName}
                    />
                    <SelectInput
                        faramElementName="hasEmployeeDrrTrained"
                        label={t('Has employee trained in disaster management?')}
                        options={booleanConditionNe}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        optionsClassName={optionsClassName}
                        iconName={iconName}
                    />
                    {faramValues.hasEmployeeDrrTrained && (
                        <TextInput
                            faramElementName="noOfEmployeeDrrTrained"
                            label={t(
                                'Number of total employee trained in disaster management',
                            )}
                        />
                    )}

                    <SelectInput
                        faramElementName="hasHelipad"
                        label={t('Does the institution has helipad?')}
                        options={booleanConditionNe}
                        keySelector={keySelector}
                        labelSelector={labelSelector}
                        optionsClassName={optionsClassName}
                        iconName={iconName}
                    />

                    <h2>{t('OPENING HOUR')}</h2>

                    <TimeInput faramElementName="startTime" label={t('Start Time')} />
                    <TimeInput faramElementName="endTime" label={t('End Time')} />
                    <TextInput
                        faramElementName="remarksOnOpeningHours"
                        label={t('Remarks on Opening Hours')}
                    />
                    <h1>{t('CONTACT')}</h1>
                    <TextInput faramElementName="phoneNumber" label={t('Phone Number')} />
                    <TextInput
                        faramElementName="emailAddress"
                        label={t('Email Address')}
                    />
                    <TextInput faramElementName="website" label={t('Website')} />
                    <TextInput
                        faramElementName="localAddress"
                        label={t('Local Address')}
                    />
                    {faramValues.resourceType !== 'openspace'
                      || faramValues.resourceType !== 'communityspace'
                        ? (
                            <RawFileInput
                                faramElementName="picture"
                                showStatus
                                accept="image/*"
                            >
                                {t('Upload Image')}
                            </RawFileInput>
                        ) : (
                            ''
                        )}
                </>
            )}
        </Translation>
    );
};

export default connect(mapStateToProps)(GovernanceFields);
