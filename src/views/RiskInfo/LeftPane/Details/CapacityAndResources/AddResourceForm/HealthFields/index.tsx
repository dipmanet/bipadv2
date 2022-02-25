/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import Checkbox from '#rsci/Checkbox';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import TimeInput from '#rsci/TimeInput';
import DateInput from '#rsci/DateInput';
import styles from '../styles.scss';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';


interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const HeathFields: FunctionComponent<Props> = ({ resourceEnums, faramValues,
    optionsClassName, iconName }: Props) => {
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
        <>
            <TextInput
                faramElementName="hfCode"
                label="Please specify HF Code"
            />
            <SelectInput
                faramElementName="authority"
                label="Authority"
                options={authority}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="authorityLevel"
                label="Authority Level"
                options={authorityLevel}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="ownership"
                label="OwnerShip"
                options={ownership}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="serviceType"
                label="Service Type"
                options={serviceType}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="operationalStatus"
                label="Operational Status"
                options={operationalStatus}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <NumberInput
                faramElementName="bedCount"
                label="Number of available bed "
            />

            <NumberInput
                faramElementName="hospitalBedCount"
                label="Hospital Bed"
            />
            <NumberInput
                faramElementName="icuBedCount"
                label="ICU Bed"
            />
            <NumberInput
                faramElementName="ventilatorBedCount"
                label="Ventilator Bed"
            />
            <h2>SERVICES AVAILABLE</h2>
            <Checkbox
                faramElementName="hasChildImmunization"
                label="Child Immunization"
            />
            <Checkbox
                faramElementName="hasTdVaccination"
                label="TD Vaccination"
            />
            <Checkbox
                faramElementName="vaccinationFacility"
                label="Vaccination facility"
            />
            <Checkbox
                faramElementName="hasImnci"
                label="Integrated Management of Neonatal and Childhood Illness (IMNCI)"
            />
            <Checkbox
                faramElementName="hasGrowthMonitoring"
                label="Growth Monitoring"
            />


            <SelectInput
                faramElementName="hasSafeMotherhood"
                label="Safe Motherhood"
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
                            label="Antenatal Care"
                        />
                        <Checkbox
                            faramElementName="hasPostnatalCare"
                            label="Postnatal Care"
                        />
                        <Checkbox
                            faramElementName="birthingCenter"
                            label="Birthing/Delivery Services"
                        />
                        <Checkbox
                            faramElementName="hasBasicEmergencyObstetricCare"
                            label="Basic Emergency Obstetric Care (BEOC)"
                        />
                        <Checkbox
                            faramElementName="hasComprehensiveEmergencyObstetricCare"
                            label="Comprehensive Emergency Obstetric Care (CEOC)"
                        />
                        <Checkbox
                            faramElementName="hasComprehensiveAbortionCare"
                            label="Comprehensive Abortion Care"
                        />
                        <Checkbox
                            faramElementName="hasPostAbortionCare"
                            label="Post Abortion Care"
                        />
                    </>
                ) : ''
            }

            <SelectInput
                faramElementName="familyPlanning"
                label="Family planning"
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
                            label="Condom/Pills/Depo-Provera"
                        />
                        <Checkbox
                            faramElementName="hasIucd"
                            label="IUCD"
                        />
                        <Checkbox
                            faramElementName="hasImplant"
                            label="Implant"
                        />
                        <Checkbox
                            faramElementName="hasVasectomy"
                            label="Vasectomy"
                        />
                        <Checkbox
                            faramElementName="hasMinilap"
                            label="Minilap"
                        />


                    </>
                ) : ''}


            <SelectInput
                faramElementName="hasOpd"
                label="OPD"
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
                                label="General"
                            />
                            <Checkbox
                                faramElementName="hasPediatric"
                                label="Pediatric"
                            />
                            <Checkbox
                                faramElementName="hasObsAndGynae"
                                label="Obs. and Gynae"
                            />
                            <Checkbox
                                faramElementName="hasDentalOpd"
                                label="Dental"
                            />
                            <Checkbox
                                faramElementName="hasSurgery"
                                label="Surgery"
                            />
                            <Checkbox
                                faramElementName="hasGastrointestinal"
                                label="Gastrointestinal"
                            />
                            <Checkbox
                                faramElementName="hasCardiac"
                                label="Cardiac"
                            />
                            <Checkbox
                                faramElementName="hasMental"
                                label="Mental"
                            />
                            <Checkbox
                                faramElementName="hasRespiratory"
                                label="Respiratory"
                            />
                            <Checkbox
                                faramElementName="hasNephrology"
                                label="Nephrology"
                            />
                            <Checkbox
                                faramElementName="hasEnt"
                                label="ENT"
                            />
                            <Checkbox
                                faramElementName="hasDermatology"
                                label="Dermatology"
                            />
                            <Checkbox
                                faramElementName="hasEndocrinology"
                                label="Endocrinology"
                            />
                            <Checkbox
                                faramElementName="hasOncology"
                                label="Oncology"
                            />
                            <Checkbox
                                faramElementName="hasNeurology"
                                label="Neurology"
                            />
                            <Checkbox
                                faramElementName="hasOphthalmology"
                                label="Ophthalmology"
                            />
                        </>
                    ) : ''
            }
            <Checkbox
                faramElementName="hasTreatementOfTb"
                label="Treatment of Tuberculosis"
            />

            <Checkbox
                faramElementName="hasTreatementOfMdrTb"
                label="Treatment of Multi-drug resistance (MDR) tuberculosis"
            />
            <Checkbox
                faramElementName="hasTreatementOfLeprosy"
                label="Treatment of Leprosy"
            />
            <Checkbox
                faramElementName="hasTreatementOfMalaria"
                label="Treatment of Malaria"
            />
            <Checkbox
                faramElementName="hasTreatementOfKalaazar"
                label="Treatment of Kala-azar"
            />
            <Checkbox
                faramElementName="hasTreatementOfJapaneseEncephalitis"
                label="Treatment of Japanese Encephalitis"
            />

            <SelectInput
                faramElementName="hasLaboratoryService"
                label="Laboratory Service"
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
                            label="HIV test"
                        />
                        <Checkbox
                            faramElementName="hasTestMalaria"
                            label="Malaria test"
                        />
                        <Checkbox
                            faramElementName="hasTestTb"
                            label="Tuberculosis test"
                        />
                        <Checkbox
                            faramElementName="hasTestKalaazar"
                            label="Kala-azar test"
                        />
                        <Checkbox
                            faramElementName="hasUrineRe"
                            label="Urine RE"
                        />
                        <Checkbox
                            faramElementName="hasStoolRe"
                            label="Stool RE"
                        />
                        <Checkbox
                            faramElementName="hasGeneralBloodCbc"
                            label="General Blood CBC"
                        />
                        <Checkbox
                            faramElementName="hasCulture"
                            label="Culture"
                        />
                        <Checkbox
                            faramElementName="hasHormones"
                            label="Hormones"
                        />
                        <Checkbox
                            faramElementName="hasLeprosySmearTest"
                            label="Leprosy Smear test"
                        />
                        <Checkbox
                            faramElementName="hasTestCovidPcr"
                            label="COVID PCR"
                        />
                        <Checkbox
                            faramElementName="hasTestCovidAntigen"
                            label="COVID Antigen"
                        />
                    </>
                ) : ''}

            <Checkbox
                faramElementName="hasVolunteerCounselingTest"
                label="Volunteer Counseling Test (VCT) for HIV/AIDS"
            />
            <Checkbox
                faramElementName="hasPmtct"
                label="Prevention of mother-to-child transmission (PMTCT)"
            />
            <Checkbox
                faramElementName="hasAntiRetroViralTreatment"
                label="Anti-retro Viral Treatment"
            />
            <Checkbox
                faramElementName="hasDental"
                label="Dental"
            />

            <Checkbox
                faramElementName="hasInPatient"
                label="In Patient"
            />


            <SelectInput
                faramElementName="hasRadiology"
                label="Radiology"
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
                                label="X-ray"
                            />
                            <Checkbox
                                faramElementName="hasXRayWithContrast"
                                label="X-ray with contrast"
                            />
                            <Checkbox
                                faramElementName="hasUltrasound"
                                label="Ultrasound"
                            />
                            <Checkbox
                                faramElementName="hasEchocardiogram"
                                label="Echocardiogram"
                            />
                            <Checkbox
                                faramElementName="hasEcg"
                                label="ECG"
                            />
                            <Checkbox
                                faramElementName="hasTrademill"
                                label="Trademill"
                            />
                            <Checkbox
                                faramElementName="hasCtScan"
                                label="CT Scan"
                            />
                            <Checkbox
                                faramElementName="hasMri"
                                label="MRI"
                            />
                            <Checkbox
                                faramElementName="hasEndoscopy"
                                label="Endoscopy"
                            />
                            <Checkbox
                                faramElementName="hasColonoscopy"
                                label="Colonoscopy"
                            />
                        </>
                    ) : ''
            }

            <SelectInput
                faramElementName="hasSurgicalService"
                label="Surgical Service"
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
                            label="Caesarian Section"
                        />
                        <Checkbox
                            faramElementName="hasGastrointestinalSurgery"
                            label="Gastro Intestinal"
                        />
                        <Checkbox
                            faramElementName="hasTraumaSurgery"
                            label="Trauma Surgery"
                        />
                        <Checkbox
                            faramElementName="hasCardiacSurgery"
                            label="Cardiac Surgery"
                        />
                        <Checkbox
                            faramElementName="hasNeuroSurgery"
                            label="Neuro Surgery"
                        />
                        <Checkbox
                            faramElementName="hasPlasticSurgery"
                            label="Plastic Surgery"
                        />
                    </>
                ) : ''}

            <SelectInput
                faramElementName="hasSpecializedService"
                label="Specialized Service"
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
                            label="ICU"
                        />
                        <Checkbox
                            faramElementName="hasCcu"
                            label="CCU"
                        />
                        <Checkbox
                            faramElementName="hasNicu"
                            label="NICU"
                        />
                        <Checkbox
                            faramElementName="hasMicu"
                            label="MICU"
                        />
                        <Checkbox
                            faramElementName="hasSncu"
                            label="SNCU"
                        />
                        <Checkbox
                            faramElementName="hasPicu"
                            label="PICU"
                        />
                    </>
                ) : ''}

            <Checkbox
                faramElementName="hasCardiacCatheterization"
                label="Cardiac Catheterization"
            />
            <Checkbox
                faramElementName="hasPhysiotherapy"
                label="Physiotherapy"
            />
            <Checkbox
                faramElementName="hasAmbulanceService"
                label="Ambulance services"
            />
            <Checkbox
                faramElementName="hasExtendedHealthService"
                label="Extended Health Service"
            />
            <Checkbox
                faramElementName="hasGeriatricWard"
                label="Geriatric Ward"
            />
            <Checkbox
                faramElementName="hasPharmacy"
                label="Pharmacy"
            />
            <Checkbox
                faramElementName="hasOcmc"
                label="OCMC"
            />
            <Checkbox
                faramElementName="hasHealthInsurance"
                label="Health Insurance"
            />
            <Checkbox
                faramElementName="hasSsu"
                label="SSU"
            />
            <Checkbox
                faramElementName="hasAyurvedaService"
                label="Ayurveda Service"
            />
            <Checkbox
                faramElementName="hasCovidClinicService"
                label="COVID Clinic Service"
            />
            <Checkbox
                faramElementName="hasEmergencyServices"
                label="Emergency services"
            />
            <Checkbox
                faramElementName="hasOperatingTheatre"
                label="Operating theatre"
            />


            <Checkbox
                faramElementName="hasBloodDonation"
                label="Blood donation"
            />
            <h2>LISTED FOR FREE TREATMENT BIPANNA</h2>
            <Checkbox
                faramElementName="hasFreeTreatmentKidneyDialysis"
                label="Kidney Dialysis"
            />

            <Checkbox
                faramElementName="hasFreeTreatmentKidneyTransplant"
                label="Kidney Transplant"
            />
            <Checkbox
                faramElementName="hasFreeTreatmentMedicationAfterKidneyTransplant"
                label="Medication After Kidney Transplant"
            />
            <Checkbox
                faramElementName="hasFreeTreatmentHeadInjury"
                label="Head Injury"
            />
            <Checkbox
                faramElementName="hasFreeTreatmentSpinalInjury"
                label="Spinal Injury"
            />
            <Checkbox
                faramElementName="hasFreeTreatmentAlzheimer"
                label="Alzheimer"
            />
            <Checkbox
                faramElementName="hasFreeTreatmentCancer"
                label="Cancer"
            />
            <Checkbox
                faramElementName="hasFreeTreatmentHeart"
                label="Heart"
            />
            <Checkbox
                faramElementName="hasFreeTreatmentParkinson"
                label="Parkinson"
            />
            <Checkbox
                faramElementName="hasFreeTreatmentSickleCellAnemia"
                label="Sickle Cell Anemia"
            />
            <h2>NUMBER OF EMPLOYEES</h2>
            <NumberInput
                faramElementName="noOfMaleEmployee"
                label="Number Of Male Employee"
            />
            <NumberInput
                faramElementName="noOfFemaleEmployee"
                label="Number Of Female Employee"
            />
            <NumberInput
                faramElementName="noOfOtherEmployee"
                label="Number Of Other Employee"
            />
            <NumberInput
                faramElementName="noOfEmployee"
                label="Total Number Of Employee"
                disabled
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledMaleEmployees"
                label="Number of Differently-abled Male Employees"
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledFemaleEmployees"
                label="Number of Differently-abled Female Employees"
            />
            <NumberInput
                faramElementName="noOfDifferentlyAbledOtherEmployees"
                label="Number of Differently-abled Other Employees"
            />
            <TextInput
                faramElementName="specialization"
                label="specialization"
            />
            <DateInput
                faramElementName="registrationEstDate"
                label="Registration/Est. Date"
                inputFieldClassName={styles.dateInput}
            />
            <DateInput
                faramElementName="lastRenewalDate"
                label="Last Renewal Date"
                inputFieldClassName={styles.dateInput}
            />
            <DateInput
                faramElementName="dateOfValidity"
                label="Date of Validity"
                inputFieldClassName={styles.dateInput}
            />
            <Checkbox
                faramElementName="hasInternetFacility"
                label="Internet Facility"
            />
            <h1>DISASTER MANAGEMENT</h1>
            <SelectInput
                faramElementName="isDesignedFollowingBuildingCode"
                label="Is the school designed following building codes?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="hasDisableFriendlyInfrastructure"
                label="Does the facility have disabled friendly infrastructure?"
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
                        label="Disable Friendly Infrastructures"
                    />
                )}

            <SelectInput
                faramElementName="hasHelipad"
                label="Does the institution have helipad facility?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />


            <SelectInput
                faramElementName="hasEvacuationRoute"
                label="Does the institution have evacuation route?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="hasFocalPerson"
                label="Does the institution have disaster focal point person?"
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
                            label="Disaster Focal Person Name"
                        />
                        <TextInput
                            faramElementName="focalPersonPhoneNumber"
                            label="Focal Person Contact Number"
                        />
                    </>
                )}

            <SelectInput
                faramElementName="hasOpenSpace"
                label="Does the institution has open space?"
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
                        label="Area of Open Space (Sq.Km)"
                    />
                )}
            <SelectInput
                faramElementName="hasMedicineStorageSpace"
                label="Does the institution has medical storage space?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="hasBackupElectricity"
                label="Does the institution have electricity backup?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />


            <h2>OPENING HOUR</h2>

            <TimeInput
                faramElementName="startTime"
                label="Start Time"
            />
            <TimeInput
                faramElementName="endTime"
                label="End Time"
            />
            <TextInput
                faramElementName="remarksOnOpeningHours"
                label="Remarks on Opening Hours"
            />
            <h1>CONTACT</h1>
            <TextInput
                faramElementName="phoneNumber"
                label="Phone Number"
            />
            <TextInput
                faramElementName="emailAddress"
                label="Email Address"
            />
            <TextInput
                faramElementName="website"
                label="Website"
            />
            <TextInput
                faramElementName="localAddress"
                label="Local Address"
            />
            {((faramValues.resourceType !== 'openspace') || (faramValues.resourceType !== 'communityspace'))
                ? (
                    <RawFileInput
                        faramElementName="picture"
                        showStatus
                        accept="image/*"
                    >
                        Upload Image
                    </RawFileInput>
                ) : ''}


        </>
    );
};

export default HeathFields;
