import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { EnumItem, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';
import RawFileInput from '#rsci/RawFileInput';
import LocationInput from '#components/LocationInput';
import styles from '../styles.scss';

interface Props {
    resourceEnums: EnumItem[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const SanitationFields: FunctionComponent<Props> = ({ resourceEnums,
    faramValues, optionsClassName, iconName }: Props) => {
    // const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
    const operatorTypeOptions = [{ key: 'Government', label: 'Government' }, { key: 'Private', label: 'Private' }, { key: 'Community', label: 'Community' }, { key: 'Other', label: 'Other' }];

    return (
        <>

            <TextInput
                faramElementName="area"
                label="Area"
            />
            <SelectInput
                faramElementName="isPermanent"
                label="Is it Permanent?"
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
            label="If the facility is public toilet, number of toilet available "
        />
        <NumberInput
            faramElementName="noOfMaleToilets"
            label="If the facility is public toilet, number of male toilet available "
        />
        <NumberInput
            faramElementName="noOfFemaleToilets"
            label="If the facility is public toilet, number of female toilet available "
        />
        <NumberInput
            faramElementName="noOfCommonToilets"
            label="If the facility is public toilet, number of common toilet available "
        />
        <NumberInput
            faramElementName="noOfTaps"
            label="If the facility is public toilet, number of tabs available"
        />
    </>
)

            }
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
                        label="If type is not mentioned above (other), name it here"
                    />
                )
            }
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

export default SanitationFields;
