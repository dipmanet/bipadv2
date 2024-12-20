import React, { useMemo, useCallback } from 'react';
import { isDefined } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';

import {
    Region,
    RegionValues,
} from '#types';

import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';

function getAdminLevel(province?: number, district?: number, municipality?: number, ward?: number) {
    if (isDefined(ward)) {
        return 4;
    }
    if (isDefined(municipality)) {
        return 3;
    }
    if (isDefined(district)) {
        return 2;
    }
    if (isDefined(province)) {
        return 1;
    }
    return 0;
}

function getGeoArea(adminLevel?: number, province?: number,
    district?: number, municipality?: number, ward?: number) {
    if (adminLevel === 1) {
        return province;
    }
    if (adminLevel === 2) {
        return district;
    }
    if (adminLevel === 3) {
        return municipality;
    }
    if (adminLevel === 4) {
        return ward;
    }
    return undefined;
}

export interface RegionValuesAlt {
    province?: number;
    municipality?: number;
    district?: number;
    ward?: number;
}

interface Props {
    value: RegionValuesAlt;
    onChange: (regionValueAlt: RegionValuesAlt) => void;
}

const FullStepwiseRegionSelectInput = (props: Props) => {
    const {
        value,
        onChange,
        ...otherProps
    } = props;

    const handleRegionSelectChange = useCallback((region: Region, regionValues: RegionValues) => {
        const newRegionValues = {
            province: regionValues.provinceId,
            ward: regionValues.wardId,
            municipality: regionValues.municipalityId,
            district: regionValues.districtId,
        };

        onChange(newRegionValues);
    }, [onChange]);

    const newValue = useMemo(() => {
        const {
            province,
            district,
            municipality,
            ward,
        } = value;

        const adminLevel = getAdminLevel(province, district, municipality, ward);
        const geoarea = getGeoArea(adminLevel, province, district, municipality, ward);

        return {
            adminLevel,
            geoarea,
        };
    }, [value]);

    return (
        <StepwiseRegionSelectInput
            value={newValue}
            onChange={handleRegionSelectChange}
            {...otherProps}
        />
    );
};

export default FullStepwiseRegionSelectInput;
