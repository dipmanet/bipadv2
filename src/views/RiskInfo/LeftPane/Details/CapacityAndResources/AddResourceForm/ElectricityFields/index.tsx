import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import styles from '../styles.scss';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const ElectricityFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName }: Props) => {
    const electricityStatus = [{ key: 'Operational', label: 'Operational' }, { key: 'Under construction', label: 'Under construction' }, { key: 'Survey', label: 'Survey' }];

    return (
        <>
            <SelectInput
                faramElementName="status"
                label="Status?"
                options={electricityStatus}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />


            <TextInput
                faramElementName="capacityInMw"
                label="Capacity (In Megawatt)"
            />
            <TextInput
                faramElementName="promoter"
                label="Promoter"
            />
            <TextInput
                faramElementName="phoneNumber"
                label="Phone Number"
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

export default ElectricityFields;
