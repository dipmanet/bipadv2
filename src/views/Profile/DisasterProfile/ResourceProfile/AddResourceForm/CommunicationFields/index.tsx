import React, { FunctionComponent } from 'react';

import NumberInput from '#rsci/NumberInput';
import TextInput from '#rsci/TextInput';
import SelectInput from '#rsci/SelectInput';

import { ResourceEnum, KeyLabel } from '#types';
import { getAttributeOptions } from '#utils/domain';

interface Props {
    resourceEnums: ResourceEnum[];
}

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;

const TourismFields: FunctionComponent<Props> = ({ resourceEnums }: Props) => {
    const typeOptions = getAttributeOptions(resourceEnums, 'type');
    const towerNameOptions = getAttributeOptions(resourceEnums, 'towers_name');
    const operatorTypeOptions = getAttributeOptions(resourceEnums, 'operator_type');
    const offGridSiteOptions = getAttributeOptions(resourceEnums, 'off_grid_cell_sites');
    const internetTypeOptions = getAttributeOptions(resourceEnums, 'internet_type');
    return (
        <>
            <SelectInput
                faramElementName="type"
                label="Type"
                options={typeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <SelectInput
                faramElementName="towersName"
                label="Tower Type"
                options={towerNameOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <TextInput
                faramElementName="isp"
                label="ISP"
            />
            <NumberInput
                faramElementName="coverageRadius"
                label="Coverage Radius (km)"
            />
            <SelectInput
                faramElementName="operatorType"
                label="Operator Type"
                options={operatorTypeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />

            <SelectInput
                faramElementName="offGridCellSites"
                label="Off Grid Cell Sites"
                options={offGridSiteOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <SelectInput
                faramElementName="internetType"
                label="Internet Type"
                options={internetTypeOptions}
                keySelector={keySelector}
                labelSelector={labelSelector}
            />
            <TextInput
                faramElementName="phoneNumber"
                label="Phone Number"
            />
            <TextInput
                faramElementName="emailAddress"
                label="Email Address"
            />
            <TextInput
                faramElementName="openingHours"
                label="Opening Hours"
            />
            <TextInput
                faramElementName="website"
                label="Website"
            />
            <NumberInput
                faramElementName="frequency"
                label="Frequency(MHz)"
            />
        </>
    );
};

export default TourismFields;
