/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import React, { FunctionComponent } from 'react';

import TextInput from '#rsci/TextInput';
import DateInput from '#rsci/DateInput';
import SelectInput from '#rsci/SelectInput';
import LocationInput from '#components/LocationInput';
import RawFileInput from '#rsci/RawFileInput';
import styles from '../styles.scss';

const keySelector = (d: KeyLabel) => d.key;
const labelSelector = (d: KeyLabel) => d.label;
const HelipadFields: FunctionComponent = ({ resourceEnums, faramValues,
    optionsClassName, iconName }) => {
    const ownerShipCondition = [{ key: 'Civil Aviation Authority of Nepal', label: 'Civil Aviation Authority of Nepal' },
    { key: 'Nepal Army', label: 'Nepal Army' },
    { key: 'Nepal Police', label: 'Nepal Police' },
    { key: 'Armed Police Force', label: 'Armed Police Force' },
    { key: 'Other', label: 'Other' },
    ];
    const booleanCondition = [{ key: true, label: 'Yes' }, { key: false, label: 'No' }];
    const surfaceLevel = [{ key: 'Ground', label: 'Ground' }, { key: 'Elevated', label: 'Elevated' }];
    const surfaceType = [{ key: 'Concrete', label: 'Concrete' },
    { key: 'Grass land', label: 'Grass land' },
    { key: 'Dirt surface', label: 'Dirt surface' },
    { key: 'Other', label: 'Other' }];
    const helipadCondition = [{ key: 'Operational', label: 'Operational' }, { key: 'Need Repair', label: 'Need Repair' },
    { key: 'Not in working condition', label: 'Not in working condition' }];
    return (
        // <DateInput
        // faramElementName="operatingDate"
        //     label="Operating Date"
        // />
        <>
            <TextInput
                faramElementName="operatingDate"
                label="Operating Date"
            />
            <SelectInput
                faramElementName="ownership"
                label="Ownership"
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
                        label="If ownership is not mentioned above (other), name it here"
                    />
                )
            }
            <SelectInput
                faramElementName="followsGuidelines"
                label="Is the helipad build following the standard operational
                guidelines, 2075 of Civil Aviation Authority of Nepal?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <TextInput
                faramElementName="area"
                label="Area of Helipad(sq m)"
            />
            <TextInput
                faramElementName="altitude"
                label="Altitude"
            />
            <h1>HELIPAD DETAILS</h1>
            <SelectInput
                faramElementName="surfaceLevel"
                label="Surface Level "
                options={surfaceLevel}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="surfaceType"
                label="Surface Type
                "
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
                        label="If the surface type is not mentioned above (other), name it here. "
                    />
                )
            }
            <SelectInput
                faramElementName="hasRoadAccess"
                label="Has Road Access?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="storageFacilityAvailable"
                label="Has Storage Facility Available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="internetFacilityAvailable"
                label="Has Internet Facility Available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="windDirectionIndicatorAvailable"
                label="Has Wind Direction Indicator Available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="heliMarkerAvailable"
                label="Has Heli Marker Available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="nightLightingAvailable"
                label="Has Night lighting Available?"
                options={booleanCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <SelectInput
                faramElementName="helipadCondition"
                label="Condition Of Helipad?"
                options={helipadCondition}
                keySelector={keySelector}
                labelSelector={labelSelector}
                optionsClassName={optionsClassName}
                iconName={iconName}
            />
            <h1>CONTACT</h1>
            <TextInput
                faramElementName="focalPersonName"
                label="Name of focal person"
            />
            <TextInput
                faramElementName="focalPersonNumber"
                label="Contact of focal person"
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


export default HelipadFields;
