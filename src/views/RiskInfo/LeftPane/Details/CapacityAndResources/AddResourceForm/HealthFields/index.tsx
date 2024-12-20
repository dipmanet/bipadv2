/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
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
import DateInput from '#rsci/DateInput';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';
import { languageSelector } from '#selectors';
import styles from '../styles.scss';

interface Props {
    resourceEnums: EnumItem[];
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const HeathFields: FunctionComponent<Props> = ({ resourceEnums, faramValues,
    optionsClassName, iconName, language: { language } }: Props) => {
    // const typeOptions = getAttributeOptions(resourceEnums, 'type');
    // const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
    const authority = [{ key: 'Government', label: 'Government' }, { key: 'Non Government', label: 'Non Government' }];
    const authorityLevel = [{ key: 'Federal', label: 'Federal' }, { key: 'Province', label: 'Province' }, { key: 'Local', label: 'Local' }];
    const ownership = [{ key: 'Ministry of Health and Population', label: 'Ministry of Health and Population' },
    { key: 'Ministry of Defense', label: 'Ministry of Defense' },
    { key: 'Ministry of Education', label: 'Ministry of Education' },
    { key: 'MoFAGA', label: 'MoFAGA' },
    { key: 'Ministry of Home Affairs', label: 'Ministry of Home Affairs' },
    { key: 'Charitable/Trust', label: 'Charitable/Trust' },
    { key: 'Cooperative Organization', label: 'Cooperative Organization' },
    { key: 'Humanitarian Organization', label: 'Humanitarian Organization' },
    { key: 'INGO', label: 'INGO' },
    { key: 'Missionary', label: 'Missionary' },
    { key: 'Non Government Organization', label: 'Non Government Organization' },
    { key: 'Private Enterprises', label: 'Private Enterprises' },
    { key: 'Local Government', label: 'Local Government' },
    { key: 'Provincial Government', label: 'Provincial Government' }];

    const serviceType = [{ key: 'Allopathy', label: 'Allopathy' }, { key: 'Homeopathy', label: 'Homeopathy' }, { key: 'Unany', label: 'Unany' },
    { key: 'Ayurveda', label: 'Ayurveda' }, { key: 'Integrated Service', label: 'Integrated Service' }];
    const operationalStatus = [{ key: 'Functional', label: 'Functional' }, { key: 'Non Functional', label: 'Non Functional' }, { key: 'Suspended', label: 'Suspended' },
    { key: 'Non Renewed', label: 'Non Renewed' }, { key: 'Closed', label: 'Closed' }];

    return (
        <Translation>
            {
                t => (

                    <>
                        <TextInput
                            faramElementName="hfCode"
                            label={t('Please specify HF Code')}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="authority"
                            label={t('Authority')}
                            options={authority}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="authorityLevel"
                            label={t('Authority Level')}
                            options={authorityLevel}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="ownership"
                            label={t('OwnerShip')}
                            options={ownership}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="serviceType"
                            label={t('Service Type')}
                            options={serviceType}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="operationalStatus"
                            label={t('Operational Status')}
                            options={operationalStatus}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <NumberInput
                            faramElementName="bedCount"
                            label={language === 'en'
                                ? 'Number of available bed '
                                : 'उपलब्ध बेड संख्या'}
                        />

                        <NumberInput
                            faramElementName="hospitalBedCount"
                            label={t('Hospital Bed')}
                        />
                        <NumberInput
                            faramElementName="icuBedCount"
                            label={t('ICU Bed')}
                        />
                        <NumberInput
                            faramElementName="ventilatorBedCount"
                            label={t('Ventilator Bed')}
                        />
                        <h2>{t('SERVICES AVAILABLE')}</h2>
                        <Checkbox
                            faramElementName="hasChildImmunization"
                            label={t('Child Immunization')}
                        />
                        <Checkbox
                            faramElementName="hasTdVaccination"
                            label={t('TD Vaccination')}
                        />
                        <Checkbox
                            faramElementName="vaccinationFacility"
                            label={t('Vaccination facility')}
                        />
                        <Checkbox
                            faramElementName="hasImnci"
                            label={t('Integrated Management of Neonatal and Childhood Illness (IMNCI)')}
                        />
                        <Checkbox
                            faramElementName="hasGrowthMonitoring"
                            label={t('Growth Monitoring')}
                        />


                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasSafeMotherhood"
                            label={t('Safe Motherhood')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                            hideClearButton
                        />
                        {
                            faramValues.hasSafeMotherhood ? (
                                <>
                                    <Checkbox
                                        faramElementName="hasAntenatalCare"
                                        label={t('Antenatal Care')}
                                    />
                                    <Checkbox
                                        faramElementName="hasPostnatalCare"
                                        label={t('Postnatal Care')}
                                    />
                                    <Checkbox
                                        faramElementName="birthingCenter"
                                        label={t('Birthing/Delivery Services')}
                                    />
                                    <Checkbox
                                        faramElementName="hasBasicEmergencyObstetricCare"
                                        label={t('Basic Emergency Obstetric Care (BEOC)')}
                                    />
                                    <Checkbox
                                        faramElementName="hasComprehensiveEmergencyObstetricCare"
                                        label={t('Comprehensive Emergency Obstetric Care (CEOC)')}
                                    />
                                    <Checkbox
                                        faramElementName="hasComprehensiveAbortionCare"
                                        label={t('Comprehensive Abortion Care')}
                                    />
                                    <Checkbox
                                        faramElementName="hasPostAbortionCare"
                                        label={t('Post Abortion Care')}
                                    />
                                </>
                            ) : ''
                        }

                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="familyPlanning"
                            label={t('Family planning')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                            hideClearButton
                        />
                        {faramValues.familyPlanning
                            ? (
                                <>
                                    <Checkbox
                                        faramElementName="hasCondomPillsDepoprovera"
                                        label={t('Condom/Pills/Depo-Provera')}
                                    />
                                    <Checkbox
                                        faramElementName="hasIucd"
                                        label={t('IUCD')}
                                    />
                                    <Checkbox
                                        faramElementName="hasImplant"
                                        label={t('Implant')}
                                    />
                                    <Checkbox
                                        faramElementName="hasVasectomy"
                                        label={t('Vasectomy')}
                                    />
                                    <Checkbox
                                        faramElementName="hasMinilap"
                                        label={t('Minilap')}
                                    />


                                </>
                            ) : ''}


                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasOpd"
                            label={t('OPD')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                            hideClearButton
                        />
                        {
                            faramValues.hasOpd
                                ? (
                                    <>
                                        <Checkbox
                                            faramElementName="hasGeneral"
                                            label={t('General')}
                                        />
                                        <Checkbox
                                            faramElementName="hasPediatric"
                                            label={t('Pediatric')}
                                        />
                                        <Checkbox
                                            faramElementName="hasObsAndGynae"
                                            label={t('Obs. and Gynae')}
                                        />
                                        <Checkbox
                                            faramElementName="hasDentalOpd"
                                            label={t('Dental')}
                                        />
                                        <Checkbox
                                            faramElementName="hasSurgery"
                                            label={t('Surgery')}
                                        />
                                        <Checkbox
                                            faramElementName="hasGastrointestinal"
                                            label={t('Gastrointestinal')}
                                        />
                                        <Checkbox
                                            faramElementName="hasCardiac"
                                            label={t('Cardiac')}
                                        />
                                        <Checkbox
                                            faramElementName="hasMental"
                                            label={t('Mental')}
                                        />
                                        <Checkbox
                                            faramElementName="hasRespiratory"
                                            label={t('Respiratory')}
                                        />
                                        <Checkbox
                                            faramElementName="hasNephrology"
                                            label={t('Nephrology')}
                                        />
                                        <Checkbox
                                            faramElementName="hasEnt"
                                            label={t('ENT')}
                                        />
                                        <Checkbox
                                            faramElementName="hasDermatology"
                                            label={t('Dermatology')}
                                        />
                                        <Checkbox
                                            faramElementName="hasEndocrinology"
                                            label={t('Endocrinology')}
                                        />
                                        <Checkbox
                                            faramElementName="hasOncology"
                                            label={t('Oncology')}
                                        />
                                        <Checkbox
                                            faramElementName="hasNeurology"
                                            label={t('Neurology')}
                                        />
                                        <Checkbox
                                            faramElementName="hasOphthalmology"
                                            label={t('Ophthalmology')}
                                        />
                                    </>
                                ) : ''
                        }
                        <Checkbox
                            faramElementName="hasTreatementOfTb"
                            label={t('Treatment of Tuberculosis')}
                        />

                        <Checkbox
                            faramElementName="hasTreatementOfMdrTb"
                            label={t('Treatment of Multi-drug resistance (MDR) tuberculosis')}
                        />
                        <Checkbox
                            faramElementName="hasTreatementOfLeprosy"
                            label={t('Treatment of Leprosy')}
                        />
                        <Checkbox
                            faramElementName="hasTreatementOfMalaria"
                            label={t('Treatment of Malaria')}
                        />
                        <Checkbox
                            faramElementName="hasTreatementOfKalaazar"
                            label={t('Treatment of Kala-azar')}
                        />
                        <Checkbox
                            faramElementName="hasTreatementOfJapaneseEncephalitis"
                            label={t('Treatment of Japanese Encephalitis')}
                        />

                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasLaboratoryService"
                            label={t('Laboratory Service')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                            hideClearButton
                        />
                        {faramValues.hasLaboratoryService
                            ? (
                                <>
                                    <Checkbox
                                        faramElementName="hasTestHiv"
                                        label={t('HIV test')}
                                    />
                                    <Checkbox
                                        faramElementName="hasTestMalaria"
                                        label={t('Malaria test')}
                                    />
                                    <Checkbox
                                        faramElementName="hasTestTb"
                                        label={t('Tuberculosis test')}
                                    />
                                    <Checkbox
                                        faramElementName="hasTestKalaazar"
                                        label={t('Kala-azar test')}
                                    />
                                    <Checkbox
                                        faramElementName="hasUrineRe"
                                        label={t('Urine RE')}
                                    />
                                    <Checkbox
                                        faramElementName="hasStoolRe"
                                        label={t('Stool RE')}
                                    />
                                    <Checkbox
                                        faramElementName="hasGeneralBloodCbc"
                                        label={t('General Blood CBC')}
                                    />
                                    <Checkbox
                                        faramElementName="hasCulture"
                                        label={t('Culture')}
                                    />
                                    <Checkbox
                                        faramElementName="hasHormones"
                                        label={t('Hormones')}
                                    />
                                    <Checkbox
                                        faramElementName="hasLeprosySmearTest"
                                        label={t('Leprosy Smear test')}
                                    />
                                    <Checkbox
                                        faramElementName="hasTestCovidPcr"
                                        label={t('COVID PCR')}
                                    />
                                    <Checkbox
                                        faramElementName="hasTestCovidAntigen"
                                        label={t('COVID Antigen')}
                                    />
                                </>
                            ) : ''}

                        <Checkbox
                            faramElementName="hasVolunteerCounselingTest"
                            label={t('Volunteer Counseling Test (VCT) for HIV/AIDS')}
                        />
                        <Checkbox
                            faramElementName="hasPmtct"
                            label={t('Prevention of mother-to-child transmission (PMTCT)')}
                        />
                        <Checkbox
                            faramElementName="hasAntiRetroViralTreatment"
                            label={t('Anti-retro Viral Treatment')}
                        />
                        <Checkbox
                            faramElementName="hasDental"
                            label={t('Dental')}
                        />

                        <Checkbox
                            faramElementName="hasInPatient"
                            label={t('In Patient')}
                        />


                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasRadiology"
                            label={t('Radiology')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                            hideClearButton
                        />
                        {
                            faramValues.hasRadiology
                                ? (
                                    <>
                                        <Checkbox
                                            faramElementName="hasXRay"
                                            label={t('X-ray')}
                                        />
                                        <Checkbox
                                            faramElementName="hasXRayWithContrast"
                                            label={t('X-ray with contrast')}
                                        />
                                        <Checkbox
                                            faramElementName="hasUltrasound"
                                            label={t('Ultrasound')}
                                        />
                                        <Checkbox
                                            faramElementName="hasEchocardiogram"
                                            label={t('Echocardiogram')}
                                        />
                                        <Checkbox
                                            faramElementName="hasEcg"
                                            label={t('ECG')}
                                        />
                                        <Checkbox
                                            faramElementName="hasTrademill"
                                            label={t('Trademill')}
                                        />
                                        <Checkbox
                                            faramElementName="hasCtScan"
                                            label={t('CT Scan')}
                                        />
                                        <Checkbox
                                            faramElementName="hasMri"
                                            label={t('MRI')}
                                        />
                                        <Checkbox
                                            faramElementName="hasEndoscopy"
                                            label={t('Endoscopy')}
                                        />
                                        <Checkbox
                                            faramElementName="hasColonoscopy"
                                            label={t('Colonoscopy')}
                                        />
                                    </>
                                ) : ''
                        }

                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasSurgicalService"
                            label={t('Surgical Service')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                            hideClearButton
                        />
                        {faramValues.hasSurgicalService
                            ? (
                                <>
                                    <Checkbox
                                        faramElementName="hasCaesarianSection"
                                        label={t('Caesarian Section')}
                                    />
                                    <Checkbox
                                        faramElementName="hasGastrointestinalSurgery"
                                        label={t('Gastro Intestinal')}
                                    />
                                    <Checkbox
                                        faramElementName="hasTraumaSurgery"
                                        label={t('Trauma Surgery')}
                                    />
                                    <Checkbox
                                        faramElementName="hasCardiacSurgery"
                                        label={t('Cardiac Surgery')}
                                    />
                                    <Checkbox
                                        faramElementName="hasNeuroSurgery"
                                        label={t('Neuro Surgery')}
                                    />
                                    <Checkbox
                                        faramElementName="hasPlasticSurgery"
                                        label={t('Plastic Surgery')}
                                    />
                                </>
                            ) : ''}

                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasSpecializedService"
                            label={t('Specialized Service')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                            hideClearButton
                        />
                        {faramValues.hasSpecializedService
                            ? (
                                <>
                                    <Checkbox
                                        faramElementName="hasIcu"
                                        label={t('ICU')}
                                    />
                                    <Checkbox
                                        faramElementName="hasCcu"
                                        label={t('CCU')}
                                    />
                                    <Checkbox
                                        faramElementName="hasNicu"
                                        label={t('NICU')}
                                    />
                                    <Checkbox
                                        faramElementName="hasMicu"
                                        label={t('MICU')}
                                    />
                                    <Checkbox
                                        faramElementName="hasSncu"
                                        label={t('SNCU')}
                                    />
                                    <Checkbox
                                        faramElementName="hasPicu"
                                        label={t('PICU')}
                                    />
                                </>
                            ) : ''}

                        <Checkbox
                            faramElementName="hasCardiacCatheterization"
                            label={t('Cardiac Catheterization')}
                        />
                        <Checkbox
                            faramElementName="hasPhysiotherapy"
                            label={t('Physiotherapy')}
                        />
                        <Checkbox
                            faramElementName="hasAmbulanceService"
                            label={t('Ambulance services')}
                        />
                        <Checkbox
                            faramElementName="hasExtendedHealthService"
                            label={t('Extended Health Service')}
                        />
                        <Checkbox
                            faramElementName="hasGeriatricWard"
                            label={t('Geriatric Ward')}
                        />
                        <Checkbox
                            faramElementName="hasPharmacy"
                            label={t('Pharmacy')}
                        />
                        <Checkbox
                            faramElementName="hasOcmc"
                            label={t('OCMC')}
                        />
                        <Checkbox
                            faramElementName="hasHealthInsurance"
                            label={t('Health Insurance')}
                        />
                        <Checkbox
                            faramElementName="hasSsu"
                            label={t('SSU')}
                        />
                        <Checkbox
                            faramElementName="hasAyurvedaService"
                            label={t('Ayurveda Service')}
                        />
                        <Checkbox
                            faramElementName="hasCovidClinicService"
                            label={t('COVID Clinic Service')}
                        />
                        <Checkbox
                            faramElementName="hasEmergencyServices"
                            label={t('Emergency services')}
                        />
                        <Checkbox
                            faramElementName="hasOperatingTheatre"
                            label={t('Operating theatre')}
                        />


                        <Checkbox
                            faramElementName="hasBloodDonation"
                            label={t('Blood donation')}
                        />
                        <h2>{t('LISTED FOR FREE TREATMENT BIPANNA')}</h2>
                        <Checkbox
                            faramElementName="hasFreeTreatmentKidneyDialysis"
                            label={t('Kidney Dialysis')}
                        />

                        <Checkbox
                            faramElementName="hasFreeTreatmentKidneyTransplant"
                            label={t('Kidney Transplant')}
                        />
                        <Checkbox
                            faramElementName="hasFreeTreatmentMedicationAfterKidneyTransplant"
                            label={t('Medication After Kidney Transplant')}
                        />
                        <Checkbox
                            faramElementName="hasFreeTreatmentHeadInjury"
                            label={t('Head Injury')}
                        />
                        <Checkbox
                            faramElementName="hasFreeTreatmentSpinalInjury"
                            label={t('Spinal Injury')}
                        />
                        <Checkbox
                            faramElementName="hasFreeTreatmentAlzheimer"
                            label={t('Alzheimer')}
                        />
                        <Checkbox
                            faramElementName="hasFreeTreatmentCancer"
                            label={t('Cancer')}
                        />
                        <Checkbox
                            faramElementName="hasFreeTreatmentHeart"
                            label={t('Heart')}
                        />
                        <Checkbox
                            faramElementName="hasFreeTreatmentParkinson"
                            label={t('Parkinson')}
                        />
                        <Checkbox
                            faramElementName="hasFreeTreatmentSickleCellAnemia"
                            label={t('Sickle Cell Anemia')}
                        />
                        <h2>{t('NUMBER OF EMPLOYEES')}</h2>
                        <NumberInput
                            faramElementName="noOfMaleEmployee"
                            label={t('Number Of Male Employee')}
                        />
                        <NumberInput
                            faramElementName="noOfFemaleEmployee"
                            label={t('Number Of Female Employee')}
                        />
                        <NumberInput
                            faramElementName="noOfOtherEmployee"
                            label={t('Number Of Other Employee')}
                        />
                        <NumberInput
                            faramElementName="noOfEmployee"
                            label={t('Total Number Of Employee')}
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
                        <TextInput
                            faramElementName="specialization"
                            label={t('specialization')}
                        />
                        <DateInput
                            className={'startDateInput'}
                            faramElementName="registrationEstDate"
                            label={t('Registration/Est. Date')}
                            inputFieldClassName={styles.dateInput}
                            language={language}
                            optimizePosition

                        />
                        <DateInput
                            className={'endDateInput'}
                            faramElementName="lastRenewalDate"
                            label={t('Last Renewal Date')}
                            inputFieldClassName={styles.dateInput}
                            language={language}
                            optimizePosition


                        />
                        <DateInput
                            className={'startEndDateInput'}
                            faramElementName="dateOfValidity"
                            label={t('Date of Validity')}
                            inputFieldClassName={styles.dateInput}
                            language={language}
                            optimizePosition


                        />
                        {/* <Checkbox
                faramElementName="hasInternetFacility"
                label="Internet Facility"
            /> */}
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
                            faramElementName="hasDisableFriendlyInfrastructure"
                            label={language === 'en'
                                ? 'Does the facility have disabled friendly infrastructure?'
                                : 'के स्वास्थ्य संस्थाको भवन आपंग मैत्री छ? '}
                            options={booleanCondition}
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
                            faramElementName="hasHelipad"
                            label={t('Does the institution have helipad facility?')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />


                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasEvacuationRoute"
                            label={t('Does the institution have evacuation route?')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasFocalPerson"
                            label={t('Does the institution have disaster focal point person?')}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.hasFocalPerson
                            && (
                                <>
                                    <TextInput
                                        faramElementName="focalPersonName"
                                        label={language === 'en'
                                            ? 'Disaster Focal Person Name' : 'फोकल व्यक्तिको नाम'}
                                    />
                                    <TextInput
                                        faramElementName="focalPersonPhoneNumber"
                                        label={language === 'en'
                                            ? 'Focal Person Contact Number'
                                            : 'फोकल व्यक्तिको फोन न'}
                                    />
                                </>
                            )}

                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasOpenSpace"
                            label={language === 'en'
                                ? 'Does the institution has open space?'
                                : 'के स्वास्थ्य संस्थामा खुल्ला ठाउँ (OpenSpace) छ? '}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        {faramValues.hasOpenSpace
                            && (
                                <TextInput
                                    faramElementName="areaOfOpenSpace"
                                    label={language === 'en'
                                        ? 'Area of Open Space (Sq.Km)'
                                        : 'खुल्ला ठाउँ (OpenSpace) क्षेत्रफल कति छ? '}
                                />
                            )}
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasMedicineStorageSpace"
                            label={language === 'en'
                                ? 'Does the institution has medical storage space?'
                                : 'चिकित्सा भण्डारण ठाउँ'}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />
                        <SelectInput
                            placeholder={language === 'en' ? 'Select an option' : 'विकल्प चयन गर्नुहोस्'}
                            faramElementName="hasBackupElectricity"
                            label={language === 'en'
                                ? 'Does the institution have electricity backup?' : 'बिधुत आपूर्तिकोब्याकअप छ? '}
                            options={booleanCondition}
                            keySelector={keySelector}
                            labelSelector={labelSelector}
                            optionsClassName={optionsClassName}
                            iconName={iconName}
                        />


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
                            label={language === 'en'
                                ? 'Remarks on Opening Hours'
                                : 'खुल्ने समयमा टिप्पणी भए '}
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

export default connect(mapStateToProps)(HeathFields);
