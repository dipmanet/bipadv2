/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import { getAttributeOptions } from '#utils/domain';
import NumberInput from '#rsci/NumberInput';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import styles from '../styles.scss';

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
const FireEngineFields: FunctionComponent = ({ resourceEnums, faramValues,
    optionsClassName, iconName }) => {
    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];

    const fireEngineCondition = [{ key: 'Operational', label: 'Operational' },
    { key: 'Need Repair', label: 'Need Repair' },
    { key: 'Not in working condition', label: 'Not in working condition' }];
    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    return (
        // <DateInput
        // faramElementName="operatingDate"
        //     label="Operating Date"
        // />
        <>
            <SelectInput
                faramElementName="operatorType"
                label="Operator Type"
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
                        label="Please specify (other) operator type "
                    />
                )
            }
            <TextInput
                faramElementName="focalPersonName"
                label="Name of Focal Person"
            />
            <TextInput
                faramElementName="focalPersonContactNumber"
                label="Contact Information of Focal Person"
            />
            <NumberInput
                faramElementName="numberOfTrainedEmployees"
                label="Number of trained employee"
            />
            <SelectInput
                faramElementName="hasSafetyEquipmentEnabled"
                label="Is safety equipment available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <TextInput
                faramElementName="serviceSharingMuns"
                label="Are there multiple municipalities that share the services from the firefighting apparatus?"
            />
            <NumberInput
                faramElementName="capacityOfFireEngine"
                label="Capacity (Litre) "
            />
            <TextInput
                faramElementName="vehicleNumber"
                label="Vehicle Number"
            />
            <TextInput
                faramElementName="driverName"
                label="Driver's Name"
            />
            <TextInput
                faramElementName="contactNumber"
                label="Driver's Contact Number"
            />
            <TextInput
                faramElementName="alternativeContactNumber"
                label="Driver’s Alternative Number"
            />
            <SelectInput
                faramElementName="condition"
                label="Condition of Fire fighting apparatus"
                options={fireEngineCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
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


export default FireEngineFields;
