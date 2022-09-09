import { listToMap } from '@togglecorp/fujs';
import memoize from 'memoize-one';
// eslint-disable-next-line import/prefer-default-export
export const createSingleList = memoize((provinces, districts, municipalities) => {
    const adminLevelKeySelector = d => d.id;
    const provinceList = provinces.map(province => ({ ...province, adminLevel: 1 }));

    const provinceMap = listToMap(
        provinces,
        adminLevelKeySelector,
        province => province,
    );

    const districtList = districts.map((district) => {
        const province = provinceMap[district.province];
        return {
            ...district,
            adminLevel: 2,
            title: `${district.title}, ${province.title}`,
        };
    });

    const districtMap = listToMap(
        districts,
        adminLevelKeySelector,
        province => province,
    );

    const municipalityList = municipalities.map((municipality) => {
        const district = districtMap[municipality.district];
        const province = provinceMap[district.province];
        return {
            ...municipality,
            adminLevel: 3,
            title: `${municipality.title}, ${district.title}, ${province.title}`,
        };
    });

    return [...provinceList, ...districtList, ...municipalityList];
});
