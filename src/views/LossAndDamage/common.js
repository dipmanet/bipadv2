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

const getProvince = val => val.province;
const getDistrict = val => val.district;
const getMunicipality = val => val.municipality;
const getWard = val => val.ward;

// Get all information using ward
const getRegionInfoFromWard = (wardId, regions) => {
    const {
        wards: wardMap,
        municipalities: municipalityMap,
        districts: districtMap,
        provinces: provinceMap,
    } = regions;

    const ward = wardMap[wardId];

    if (!ward) {
        return {};
    }

    const municipalityId = ward.municipality;
    const municipality = municipalityMap[municipalityId];

    if (!municipality) {
        return {
            ward: wardId,

            wardTitle: ward.title,
        };
    }

    const districtId = municipality.district;
    const district = districtMap[districtId];

    if (!district) {
        return {
            ward: wardId,
            municipality: municipalityId,

            wardTitle: ward.title,
            municipalityTitle: municipality.title,
        };
    }

    const provinceId = district.province;
    const province = provinceMap[provinceId];

    if (!province) {
        return {
            ward: wardId,
            municipality: municipalityId,
            district: districtId,

            wardTitle: ward.title,
            municipalityTitle: municipality.title,
            districtTitle: district.title,
        };
    }

    return {
        ward: wardId,
        municipality: municipalityId,
        district: districtId,
        province: provinceId,

        wardTitle: ward.title,
        wardTitleNe: ward.title_ne,
        municipalityTitle: municipality.title,
        municipalityTitleNe: municipality.title_ne,
        districtTitle: district.title,
        districtTitleNe: district.title_ne,
        provinceTitle: province.title,
        provinceTitleNe: province.title_ne,
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
            livestockDestroyedCount: Math.max(
                acc.livestockDestroyedCount,
                val.livestockDestroyedCount,
            ),
            peopleDeathCount: Math.max(acc.peopleDeathCount, val.peopleDeathCount),
            peopleMissingCount: Math.max(acc.peopleMissingCount, val.peopleMissingCount),
            peopleInjuredCount: Math.max(acc.peopleInjuredCount, val.peopleInjuredCount),
        }),
        {
            count: 0,
            estimatedLoss: 0,
            infrastructureDestroyedCount: 0,
            livestockDestroyedCount: 0,
            peopleDeathCount: 0,
            peopleMissingCount: 0,
            peopleInjuredCount: 0,
        },
    )
);

export const getGroupMethod = (regionLevel) => {
    if (regionLevel === 1) {
        return getProvince;
    }

    if (regionLevel === 2) {
        return getDistrict;
    }

    if (regionLevel === 3) {
        return getMunicipality;
    }

    if (regionLevel === 4) {
        return getWard;
    }

    return getProvince;
};

const getStat = ({ key, value }) => ({
    key,
    count: value.length,
    estimatedLoss: sum(
        value.map(item => (item.loss || {}).estimatedLoss),
    ),
    livestockDestroyedCount: sum(
        value.map(item => (item.loss || {}).livestockDestroyedCount),
    ),
    livestockAffectedCount: sum(
        value.map(item => (item.loss || {}).livestockAffectedCount),
    ),
    peopleDeathCount: sum(
        value.map(item => (item.loss || {}).peopleDeathCount),
    ),
    peopleInjuredCount: sum(
        value.map(item => (item.loss || {}).peopleInjuredCount),
    ),
    peopleMissingCount: sum(
        value.map(item => (item.loss || {}).peopleMissingCount),
    ),
    peopleAffectedCount: sum(
        value.map(item => (item.loss || {}).peopleAffectedCount),
    ),
    familyAffectedCount: sum(
        value.map(item => (item.loss || {}).familyAffectedCount),
    ),
    familyRelocatedCount: sum(
        value.map(item => (item.loss || {}).familyRelocatedCount),
    ),
    familyEvacuatedCount: sum(
        value.map(item => (item.loss || {}).familyEvacuatedCount),
    ),
    infrastructureDestroyedCount: sum(value.map(
        item => (item.loss || {}).infrastructureDestroyedCount,
    )),
    infrastructureAffectedHouseCount: sum(value.map(
        item => (item.loss || {}).infrastructureAffectedHouseCount,
    )),
    infrastructureDestroyedHouseCount: sum(value.map(
        item => (item.loss || {}).infrastructureDestroyedHouseCount,
    )),
    infrastructureAffectedBridgeCount: sum(value.map(
        item => (item.loss || {}).infrastructureAffectedBridgeCount,
    )),
    infrastructureDestroyedBridgeCount: sum(value.map(
        item => (item.loss || {}).infrastructureDestroyedBridgeCount,
    )),
    infrastructureAffectedRoadCount: sum(value.map(
        item => (item.loss || {}).infrastructureAffectedRoadCount,
    )),
    infrastructureDestroyedRoadCount: sum(value.map(
        item => (item.loss || {}).infrastructureDestroyedRoadCount,
    )),
    infrastructureAffectedElectricityCount: sum(value.map(
        item => (item.loss || {}).infrastructureAffectedElectricityCount,
    )),
    infrastructureDestroyedElectricityCount: sum(value.map(
        item => (item.loss || {}).infrastructureDestroyedElectricityCount,
    )),
});

export const getSumStats = value => ({
    estimatedLoss: sum(value.map(item => item.estimatedLoss)),
    livestockDestroyedCount: sum(value.map(item => item.livestockDestroyedCount)),
    livestockAffectedCount: sum(value.map(item => item.livestockAffectedCount)),
    peopleDeathCount: sum(value.map(item => item.peopleDeathCount)),
    peopleInjuredCount: sum(value.map(item => item.peopleInjuredCount)),
    peopleMissingCount: sum(value.map(item => item.peopleMissingCount)),
    peopleAffectedCount: sum(value.map(item => item.peopleAffectedCount)),
    familyAffectedCount: sum(value.map(item => item.familyAffectedCount)),
    familyRelocatedCount: sum(value.map(item => item.familyRelocatedCount)),
    familyEvacuatedCount: sum(value.map(item => item.familyEvacuatedCount)),
    infrastructureDestroyedCount: sum(value.map(item => item.infrastructureDestroyedCount)),
    infrastructureAffectedHouseCount: sum(value.map(item => item.infrastructureAffectedHouseCount)),
    infrastructureDestroyedHouseCount: sum(value.map(
        item => item.infrastructureDestroyedHouseCount,
    )),
    infrastructureAffectedBridgeCount: sum(value.map(
        item => item.infrastructureAffectedBridgeCount,
    )),
    infrastructureDestroyedBridgeCount: sum(value.map(
        item => item.infrastructureDestroyedBridgeCount,
    )),
    infrastructureAffectedRoadCount: sum(value.map(
        item => item.infrastructureAffectedRoadCount,
    )),
    infrastructureDestroyedRoadCount: sum(value.map(
        item => item.infrastructureDestroyedRoadCount,
    )),
    infrastructureAffectedElectricityCount: sum(value.map(
        item => item.infrastructureAffectedElectricityCount,
    )),
    infrastructureDestroyedElectricityCount: sum(value.map(
        item => item.infrastructureDestroyedElectricityCount,
    )),
});

export const getGroupedIncidents = (incidents, groupingFn) => (
    groupList(incidents, groupingFn).map(getStat)
);

export const getFilledGroupedIncidents = (incidents, groupingFn) => (
    groupFilledList(incidents, groupingFn).map(getStat)
);
