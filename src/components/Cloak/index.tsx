import React from 'react';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { listToMap, isNotDefined } from '@togglecorp/fujs';

import { AppState } from '#store/types';
import { User } from '#store/atom/auth/types';
import { District, Municipality } from '#store/atom/page/types';
import {
    districtsSelector,
    municipalitiesSelector,
    // provincesSelector,
    userSelector,
} from '#selectors';

interface Mapping {
    province: { [key: number]: boolean};
    district: { [key: number]: boolean};
    municipality: { [key: number]: boolean};
}

interface Params {
    add_incident?: boolean;
    delete_incident?: boolean;
    verify_incident?: boolean;
    approve_incident?: boolean;
    change_incident?: boolean;

    add_document?: boolean;
    delete_document?: boolean;
    change_document?: boolean;

    verify_people?: boolean;
    verify_livestock?: boolean;
    verify_family?: boolean;

    add_contact?: boolean;
    change_contact?: boolean;
    delete_contact?: boolean;

    add_resource?: boolean;
}

interface OwnProps {
    hiddenIf?: (params: Params) => boolean;
    disabledIf?: (params: Params) => boolean;
    children: React.ReactElement;

    regionLevel?: 'national' | 'province' | 'district' | 'municipality';
    regionId?: number;

    user?: User;
}

interface PropsFromState {
    districts: District[];
    // provinces: Province[];
    municipalities: Municipality[];
    user?: User;
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    // provinces: provincesSelector(state),
    user: userSelector(state),
});

type Props = OwnProps & PropsFromState;

function getMunicipalitiesForDistrict(
    districtId: number,
    municipalities: Municipality[],
) {
    const filteredMunicipalities = municipalities.filter(m => m.district === districtId);
    return listToMap(
        filteredMunicipalities,
        m => m.id,
        () => true,
    );
}

function getDistrictsForProvince(provinceId: number, districts: District[]) {
    const filteredDistricts = districts.filter(d => d.province === provinceId);
    return listToMap(
        filteredDistricts,
        d => d.id,
        () => true,
    );
}

function getMunicipalitiesForProvince(
    provinceId: number,
    districts: District[],
    municipalities: Municipality[],
) {
    const filteredDistricts = districts.filter(d => d.province === provinceId);

    return filteredDistricts.reduce(
        (acc, district) => ({
            ...acc,
            ...getMunicipalitiesForDistrict(district.id, municipalities),
        }),
        {},
    );
}

export function getParams(user: User | undefined): Params {
    if (!user) {
        return {};
    }

    let mapping = listToMap(
        user.userPermissions,
        p => p.codename,
        () => true,
    );

    if (user.groups) {
        user.groups.forEach((group) => {
            mapping = {
                ...mapping,
                ...listToMap(
                    group.permissions,
                    p => p.codename,
                    () => true,
                ),
            };
        });
    }

    return mapping;
}

function getAccessibleRegionMapping(
    user: User | undefined,
    districts: District[],
    municipalities: Municipality[],
): Mapping {
    // TODO: if region is set, then this is a regional user
    // 1. by default it is a national user
    // 2. no need to check for national user
    // 3. for others, create an access mapping and check if current resource is in that mapping

    const defaultMapping = {
        province: {},
        district: {},
        municipality: {},
    };

    if (!user) {
        return defaultMapping;
    }

    const {
        isSuperuser,
        profile: {
            region,
            province,
            municipality,
            district,
        },
    } = user;

    // No need to calculate for national user or super user
    if (isSuperuser || region === 'national') {
        return defaultMapping;
    }

    if (region === 'province' && province) {
        return {
            province: { [province]: true },
            district: getDistrictsForProvince(province, districts),
            municipality: getMunicipalitiesForProvince(province, districts, municipalities),
        };
    }
    if (region === 'district' && district) {
        return {
            ...defaultMapping,
            district: { [district]: true },
            municipality: getMunicipalitiesForDistrict(district, municipalities),
        };
    }
    if (region === 'municipality' && municipality) {
        return {
            ...defaultMapping,
            municipality: { [municipality]: true },
        };
    }

    return defaultMapping;
}

export function isRegionAccessible(
    regionLevel: Props['regionLevel'] | undefined,
    regionId: Props['regionId'] | undefined,
    user: User | undefined,
    districts: District[],
    municipalities: Municipality[],
) {
    // Get no access if there is no user
    if (!user) {
        return false;
    }
    // Get full access if resource is not associated with region
    if (isNotDefined(regionLevel)) {
        return true;
    }

    const {
        profile: {
            region: userRegion,
        },
    } = user;

    // Get no access if there is no user.profile.region
    if (isNotDefined(userRegion)) {
        return false;
    }

    // NOTE: Get access to national level if user is national user
    if (regionLevel === 'national' && userRegion === 'national') {
        return true;
    }

    // NOTE: Get no access if regionLevel is not national, and there is no region id
    if (isNotDefined(regionId)) {
        return false;
    }

    const mapping = getAccessibleRegionMapping(
        user,
        districts,
        municipalities,
    );

    // Get access to other regional level, if they are in the mapping
    return (
        (regionLevel === 'province' && mapping.province[regionId])
        || (regionLevel === 'district' && mapping.district[regionId])
        || (regionLevel === 'municipality' && mapping.municipality[regionId])
    );
}

class Cloak extends React.Component<Props> {
    private getUserParams = memoize(getParams);

    private isRegionAccessibleToUser = memoize(isRegionAccessible);

    public render() {
        const {
            children,
            hiddenIf,
            disabledIf,

            // provinces,
            districts,
            municipalities,

            user,

            regionLevel,
            regionId,
        } = this.props;

        console.warn('here', user);
        // NOTE: No restriction for super user
        if (user && user.isSuperuser) {
            return children;
        }

        const params = this.getUserParams(user);

        const hidden = (hiddenIf && hiddenIf(params)) || !this.isRegionAccessibleToUser(
            regionLevel,
            regionId,

            user,
            districts,
            municipalities,
        );

        if (hidden) {
            return null;
        }

        const disabled = disabledIf && disabledIf(params);
        if (disabled) {
            return React.cloneElement(children, { disabled: true });
        }

        return children;
    }
}

export default connect(mapStateToProps)(Cloak);
