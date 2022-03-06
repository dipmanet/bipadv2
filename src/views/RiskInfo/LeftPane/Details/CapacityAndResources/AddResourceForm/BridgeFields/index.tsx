import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';
import styles from '../styles.scss';
import DateInput from '#rsci/DateInput';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const BridgeFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName }: Props) => {
    // const typeOptions = getAttributeOptions(resourceEnums, 'type');
    // const towerNameOptions = getAttributeOptions(resourceEnums, 'towers_name');
    // const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    // const offGridSiteOptions = getAttributeOptions(resourceEnums, 'off_grid_cell_sites');
    // const internetTypeOptions = getAttributeOptions(resourceEnums, 'internet_type');
    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
    const bridgeCondition = [{ key: 'Good', label: 'Good' }, { key: 'Bad', label: 'Bad' }];

    return (
        <>
            <DateInput
                faramElementName="dateOfOperation"
                label="From When was the bridge operational?"
                inputFieldClassName={styles.dateInput}
            />
            <SelectInput
                faramElementName="isMotorable"
                label="Is the bridge motorable?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            {faramValues.isMotorable
                && (
                    <NumberInput
                        faramElementName="noOfLanes"
                        label="How many lane does the bridge have?"
                    />
                )}

            <TextInput
                faramElementName="length"
                label="Length (in meter)"
            />
            <TextInput
                faramElementName="width"
                label="Width (in meter)"
            />

            <SelectInput
                faramElementName="condition"
                label="Condition of Bridge?"
                options={bridgeCondition}
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

export default BridgeFields;
