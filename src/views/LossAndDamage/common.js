import {
    listToMap,
} from '@togglecorp/fujs';

import {
    groupFilledList,
    groupList,
    sum,
} from '#utils/common';

import { lossMetrics } from '#utils/domain';

export const createMetric = type => (val) => {
    if (!val) {
        return 0;
    }
    return val[type] || 0;
};

export const metricMap = listToMap(
    lossMetrics,
    item => item.key,
    (item, key) => ({
        ...item,
        metricFn: createMetric(key),
    }),
);

export const getProvince = val => val.province;
export const getDistrict = val => val.district;
export const getMunicipality = val => val.municipality;
export const getWard = val => val.ward;

// Get all information using ward
export const getRegionInfoFromWard = (wardId, regions) => {
    const {
        wards: wardMap,
        municipalities: municipalityMap,
        districts: districtMap,
        provinces: provinceMap,
    } = regions;

    const ward = wardMap[wardId];

    const municipalityId = ward.municipality;
    const municipality = municipalityMap[municipalityId];

    const districtId = municipality.district;
    const district = districtMap[districtId];

    const provinceId = district.province;
    const province = provinceMap[provinceId];

    return {
        ward: wardId,
        municipality: municipalityId,
        district: districtId,
        province: provinceId,

        wardTitle: ward.title,
        municipalityTitle: municipality.title,
        districtTitle: district.title,
        provinceTitle: province.title,
    };
};

export const getSanitizedIncidents = (incidents, regions, hazardTypes) => {
    const sanitizedIncidents = incidents.filter(({ incidentOn, wards }) => (
        incidentOn && (wards && wards.length > 0)
    )).map(incident => ({
        ...incident,
        incidentOn: new Date(incident.incidentOn).getTime(),
        ...getRegionInfoFromWard(
            incident.wards[0].id,
            regions,
        ),
        hazardInfo: hazardTypes[incident.hazard],
    }));
    return sanitizedIncidents;
};

export const getMinDate = (incidents) => {
    if (!incidents || incidents.length <= 0) {
        return undefined;
    }

    const sanitizedIncidents = incidents
        .filter(({ incidentOn }) => incidentOn)
        .map(incident => new Date(incident.incidentOn).getTime());

    return Math.min(...sanitizedIncidents);
};

export const getMinMaxTime = (incidents) => {
    const timing = incidents.map(incident => incident.incidentOn);
    const minTime = Math.min(...timing);
    const maxTime = Math.max(...timing);
    return { minTime, maxTime };
};

export const getAggregatedStats = incidents => (
    incidents.reduce(
        (acc, val) => ({
            count: Math.max(acc.count, val.count),
            estimatedLoss: Math.max(acc.estimatedLoss, val.estimatedLoss),
            infrastructureDestroyedCount: Math.max(
                acc.infrastructureDestroyedCount,
                val.infrastructureDestroyedCount,
            ),
            liveStockDestroyedCount: Math.max(
                acc.liveStockDestroyedCount,
                val.liveStockDestroyedCount,
            ),
            peopleDeathCount: Math.max(acc.peopleDeathCount, val.peopleDeathCount),
        }),
        {
            count: 0,
            estimatedLoss: 0,
            infrastructureDestroyedCount: 0,
            livestockDestroyedCount: 0,
            peopleDeathCount: 0,
        },
    )
);

export const getGroupMethod = (regionLevel) => {
    if (regionLevel === 1) {
        return getProvince;
    } else if (regionLevel === 2) {
        return getDistrict;
    } else if (regionLevel === 3) {
        return getMunicipality;
    } else if (regionLevel === 4) {
        return getWard;
    }

    return getProvince;
};

export const getStat = ({ key, value }) => ({
    key,
    count: value.length,
    estimatedLoss: sum(
        value.map(item => (item.loss || {}).estimatedLoss),
    ),
    infrastructureDestroyedCount: sum(value.map(
        item => (item.loss || {}).infrastructureDestroyedCount,
    )),
    livestockDestroyedCount: sum(
        value.map(item => (item.loss || {}).livestockDestroyedCount),
    ),
    peopleDeathCount: sum(
        value.map(item => (item.loss || {}).peopleDeathCount),
    ),
});

export const getGroupedIncidents = (incidents, groupingFn) => (
    groupList(incidents, groupingFn).map(getStat)
);

export const getFilledGroupedIncidents = (incidents, groupingFn) => (
    groupFilledList(incidents, groupingFn).map(getStat)
);

