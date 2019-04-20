import {
    listToMap,
} from '@togglecorp/fujs';

import {
    groupFilledList,
    groupList,
    sum,
} from '#utils/common';

export const metricOptions = [
    { key: 'count', label: 'No. of incidents' },
    { key: 'estimatedLoss', label: 'Total estimated loss' },
    { key: 'infrastructureDestroyedCount', label: 'Total infrastructure destroyed' },
    { key: 'livestockDestroyedCount', label: 'Total livestock destroyed' },
    { key: 'peopleDeathCount', label: 'Total people death' },
];

export const createMetric = type => (val) => {
    if (!val) {
        return 0;
    }
    return val[type] || 0;
};

export const metricMap = listToMap(
    metricOptions,
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
    } = regions;

    const ward = wardMap[wardId];

    const municipalityId = ward.municipality;
    const municipality = municipalityMap[municipalityId];

    const districtId = municipality.district;
    const district = districtMap[districtId];

    const provinceId = district.province;

    return {
        ward: wardId,
        municipality: municipalityId,
        district: districtId,
        province: provinceId,
    };
};

export const getSanitizedIncidents = (incidents, regions) => {
    const sanitizedIncidents = incidents.filter(({ incidentOn, wards }) => (
        incidentOn && wards && wards.length > 0
    )).map(incident => ({
        ...incident,
        incidentOn: new Date(incident.incidentOn).getTime(),
        ...getRegionInfoFromWard(
            incident.wards[0].id,
            regions,
        ),
    }));
    return sanitizedIncidents;
};

export const getMinMaxTime = (incidents, regions) => {
    const sanitizedIncidents = getSanitizedIncidents(incidents, regions);
    const timing = sanitizedIncidents.map(incident => incident.incidentOn);
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
        value.map(item => item.loss.estimatedLoss),
    ),
    infrastructureDestroyedCount: sum(value.map(
        item => item.loss.infrastructureDestroyedCount,
    )),
    livestockDestroyedCount: sum(
        value.map(item => item.loss.livestockDestroyedCount),
    ),
    peopleDeathCount: sum(
        value.map(item => item.loss.peopleDeathCount),
    ),
});

export const getGroupedIncidents = (incidents, groupingFn) => (
    groupList(incidents, groupingFn).map(getStat)
);

export const getFilledGroupedIncidents = (incidents, groupingFn) => (
    groupFilledList(incidents, groupingFn).map(getStat)
);

