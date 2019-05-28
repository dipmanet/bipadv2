import { Obj, isTruthy, isDefined, normalize } from '@togglecorp/fujs';
import { centroid, AllGeoJSON, convex } from '@turf/turf';

import { hazardIcons } from '#resources/data';
import {
    Loss,
    HazardType,
    WithHazard,
    Alert,
    Event,
    Incident,
    RealTimeEarthquake,
    RealTimeRain,
    RealTimeRiver,
    RealTimeFire,
    RealTimePollution,
    Ward,
    Municipality,
    District,
    Resource,
} from '#store/atom/page/types';
import { groupList } from '#utils/common';

// NOTE: interface for Ward, Municipality, ...
interface Geo {
    id: number;
    centroid: object;
    title: string;
}

interface Shape {
    type: string;
    coordinates: unknown[];
}

const hasMultiplePolygon = (polygon: Shape) => (
    polygon.type === 'MultiPolygon' && polygon.coordinates.length > 1
);

// export const ONE_HUMAN_EQUIVALENT_MONEY = 50000;

// The following give the effect of loss. NOTE: They sum to 1
// export const MONEY_LOSS_FACTOR = 0.2;
// export const PEOPLE_LOSS_FACTOR = 0.4;
// export const LIVESTOCK_LOSS_FACTOR = 0.1;
// export const INFRASTRUCTURE_LOSS_FACTOR = 0.3;

export const calculateSeverity = (loss: Loss | undefined, scaleFactor: number = 1): number => {
    if (!loss) {
        return 0;
    }
    const {
        peopleDeathCount = 0,
        /*
        estimatedLoss = 0,
        livestockDestroyedCount = 0,
        infrastructureDestroyedCount = 0,
         */
    } = loss;

    const offset = 0;

    // NOTE: for now just return peopleDeathCount
    return offset + (peopleDeathCount * scaleFactor);

    /*
    const severity = offset +
        ((MONEY_LOSS_FACTOR * estimatedLoss) / ONE_HUMAN_EQUIVALENT_MONEY) +
        (PEOPLE_LOSS_FACTOR * peopleDeathCount) +
        (LIVESTOCK_LOSS_FACTOR * livestockDestroyedCount) +
        (INFRASTRUCTURE_LOSS_FACTOR * infrastructureDestroyedCount);

    return severity * scaleFactor;
    */
};

const severityScaleFactor = 1;

export const calculateCategorizedSeverity = (severity: number): string => {
    if (!severity) {
        return 'Minor';
    }
    if (severity < 10) {
        return 'Major';
    }
    if (severity < 100) {
        return 'Severe';
    }
    return 'Catastrophic';
};

export const getHazardColor = (hazards: Obj<HazardType>, hazardId?: number) => {
    if (!hazardId) {
        return '#4666b0';
    }
    const hazard = hazards[hazardId];
    if (!hazard || !hazard.color) {
        return '#4666b0';
    }
    return hazard.color;
};

export const getHazardIcon = (hazards: Obj<HazardType>, hazardId?: number) => {
    if (!hazardId) {
        return hazardIcons.unknown;
    }
    const hazard = hazards[hazardId];
    if (!hazard || !hazard.icon) {
        return hazardIcons.unknown;
    }
    return hazard.icon;
};

export const hazardTypesList = (listWithHazard: WithHazard[], hazardTypes: Obj<HazardType>) => {
    const group = groupList(
        listWithHazard.filter(l => l.hazard),
        item => item.hazard,
    );

    return group.map(h => (
        {
            title: (hazardTypes[h.key] || {}).title,
            color: (hazardTypes[h.key] || {}).color,
        }
    ));
};

export const lossMetrics = [
    { key: 'count', label: 'No. of incidents' },
    { key: 'estimatedLoss', label: 'Total estimated loss (NPR)' },
    { key: 'infrastructureDestroyedCount', label: 'Total infrastructure destroyed' },
    { key: 'livestockDestroyedCount', label: 'Total livestock destroyed' },
    { key: 'peopleDeathCount', label: 'Total people death' },
];

// CONVERSION TO GEOJSON

export const alertToPolygonGeojson = (alertList: Alert[], hazards: Obj<HazardType>) => {
    const geojson = {
        type: 'FeatureCollection',
        features: alertList
            .filter(alert => isTruthy(alert.polygon))
            .map((alert) => {
                const {
                    id,
                    title,
                    polygon,
                    description,
                    createdOn,
                } = alert;

                return {
                    id,
                    type: 'Feature',
                    geometry: {
                        ...polygon,
                    },
                    properties: {
                        title,
                        description,
                        hazardColor: getHazardColor(hazards, alert.hazard),
                        createdOn,
                    },
                };
            }),
    };

    return geojson;
};

export const alertToConvexPolygonGeojson = (alertList: Alert[], hazards: Obj<HazardType>) => {
    const geojson = {
        type: 'FeatureCollection',
        features: alertList
            .filter(alert => isTruthy(alert.polygon) && hasMultiplePolygon(alert.polygon as Shape))
            .map((alert) => {
                const {
                    id,
                    polygon,
                } = alert;

                const convexPolygon = convex(polygon as AllGeoJSON).geometry;

                return {
                    id,
                    type: 'Feature',
                    geometry: {
                        ...convexPolygon,
                    },
                    properties: {
                        hazardColor: getHazardColor(hazards, alert.hazard),
                    },
                };
            }),
    };

    return geojson;
};

export const alertToPointGeojson = (alertList: Alert[], hazards: Obj<HazardType>) => {
    const geojson = {
        type: 'FeatureCollection',
        features: alertList
            .filter(alert => isTruthy(alert.polygon) || isTruthy(alert.point))
            .map((alert) => {
                const {
                    id,
                    title,
                    polygon,
                    point,
                    description,
                    createdOn,
                } = alert;

                const geometry = polygon
                    ? centroid(polygon as AllGeoJSON).geometry
                    : point;

                return {
                    id,
                    type: 'Feature',
                    geometry: { ...geometry },
                    properties: {
                        title,
                        description,
                        hazardColor: getHazardColor(hazards, alert.hazard),
                        createdOn: new Date(createdOn).getTime(),
                    },
                };
            }),
    };

    return geojson;
};

export const eventToConvexPolygonGeojson = (eventList: Event[], hazards: Obj<HazardType>) => {
    const geojson = {
        type: 'FeatureCollection',
        features: eventList
            .filter(event => isTruthy(event.polygon) && hasMultiplePolygon(event.polygon as Shape))
            .map((event) => {
                const {
                    id,
                    polygon,
                    hazard,
                } = event;

                const convexPolygon = convex(polygon as AllGeoJSON).geometry;

                return {
                    id,
                    type: 'Feature',
                    geometry: {
                        ...convexPolygon,
                    },
                    properties: {
                        hazardColor: getHazardColor(hazards, hazard),
                    },
                };
            }),
    };

    return geojson;
};

export const eventToPolygonGeojson = (eventList: Event[], hazards: Obj<HazardType>) => {
    const geojson = {
        type: 'FeatureCollection',
        features: eventList
            .filter(event => isTruthy(event.polygon))
            .map((event) => {
                const {
                    id,
                    title,
                    polygon,
                    description,
                    severity,
                    hazard,
                } = event;

                return {
                    id,
                    type: 'Feature',
                    geometry: {
                        ...polygon,
                    },
                    properties: {
                        title,
                        description,
                        severity,
                        hazardColor: getHazardColor(hazards, hazard),
                    },
                };
            }),
    };

    return geojson;
};

export const eventToPointGeojson = (eventList: Event[], hazards: Obj<HazardType>) => {
    const geojson = {
        type: 'FeatureCollection',
        features: eventList
            .filter(event => isTruthy(event.polygon) || isTruthy(event.point))
            .map((event) => {
                const {
                    id,
                    title,
                    polygon,
                    point,
                    description,
                    severity,
                    createdOn,
                    hazard,
                } = event;

                const geometry = polygon
                    ? centroid(polygon as AllGeoJSON).geometry
                    : point;

                return {
                    id,
                    type: 'Feature',
                    geometry: { ...geometry },
                    properties: {
                        title,
                        description,
                        severity,
                        createdOn,
                        hazardColor: getHazardColor(hazards, hazard),
                    },
                };
            }),
    };
    return geojson;
};

export const incidentPointToGeojson = (incidentList: Incident[], hazards: Obj<HazardType>) => ({
    type: 'FeatureCollection',
    features: incidentList
        .filter(incident => !!incident.point)
        .map(incident => ({
            ...incident,
            severityValue: calculateSeverity(incident.loss, severityScaleFactor),
        }))
        .sort((a, b) => (b.severityValue - a.severityValue))
        .map((incident) => {
            const {
                id,
                point,
                hazard,
                incidentOn,
                severityValue,
            } = incident;
            return {
                id,
                type: 'Feature',
                geometry: { ...point },
                properties: {
                    incidentId: id,
                    severity: calculateCategorizedSeverity(severityValue),
                    hazardColor: getHazardColor(hazards, hazard),
                    incidentOn: new Date(incidentOn).getTime(),
                },
            };
        }),
});

export const incidentPolygonToGeojson = (incidentList: Incident[], hazards: Obj<HazardType>) => ({
    type: 'FeatureCollection',
    features: incidentList
        .filter(incident => !!incident.polygon)
        .map(incident => ({
            ...incident,
            severityValue: calculateSeverity(incident.loss, severityScaleFactor),
        }))
        .sort((a, b) => (b.severityValue - a.severityValue))
        .map((incident) => {
            const {
                id,
                polygon,
                hazard,
                incidentOn,
                severityValue,
            } = incident;
            return {
                id,
                type: 'Feature',
                geometry: { ...polygon },
                properties: {
                    incidentId: id,
                    // FIXME: why use this here
                    severity: calculateCategorizedSeverity(severityValue),
                    hazardColor: getHazardColor(hazards, hazard),
                    incidentOn: new Date(incidentOn).getTime(),
                },
            };
        }),
});

export const resourceToGeojson = (resourceList: Resource[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: resourceList
            .filter(resource => !!resource.point)
            .map(resource => ({
                id: resource.id,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: resource.point.coordinates,
                },
                properties: {
                    iconName: resource.resourceType,
                    title: resource.title,
                    distance: resource.distance,
                },
            }))
            .sort((a, b) => (a.properties.distance - b.properties.distance)),
    };
    return geojson;
};

export const earthquakeToGeojson = (realTimeEarthquakeList: RealTimeEarthquake[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: realTimeEarthquakeList
            .filter(earthquake => earthquake.point)
            .map(earthquake => ({
                id: earthquake.id,
                type: 'Feature',
                geometry: {
                    ...earthquake.point,
                },
                properties: {
                    earthquakeId: earthquake.id,
                    address: earthquake.address,
                    description: earthquake.description,
                    eventOn: earthquake.eventOn,
                    magnitude: earthquake.magnitude,
                },
            }))
            .sort((a, b) => (a.properties.magnitude - b.properties.magnitude)),
    };
    return geojson;
};

export const riverToGeojson = (realTimeRiverList: RealTimeRiver[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: realTimeRiverList
            .filter(river => river.point)
            .map(river => ({
                id: river.id,
                type: 'Feature',
                geometry: {
                    ...river.point,
                },
                properties: {
                    riverId: river.id,
                    title: river.title,
                    description: river.description,
                    basin: river.basin,
                    status: river.status,
                    steady: river.steady,
                },
            })),
    };
    return geojson;
};

export const rainToGeojson = (realTimeRainList: RealTimeRain[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: realTimeRainList
            .filter(rain => rain.point)
            .map(rain => ({
                id: rain.id,
                type: 'Feature',
                geometry: {
                    ...rain.point,
                },
                properties: {
                    rainId: rain.id,
                    title: rain.title,
                    description: rain.description,
                    basin: rain.basin,
                    status: rain.status,
                },
            })),
    };
    return geojson;
};

export const fireToGeojson = (realTimeFireList: RealTimeFire[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: realTimeFireList
            .filter(fire => fire.point)
            .map(fire => ({
                id: fire.id,
                type: 'Feature',
                geometry: {
                    ...fire.point,
                },
                properties: {
                    fireId: fire.id,
                    brightness: fire.brightness,
                    confidence: fire.confidence,
                    eventOn: fire.eventOn,
                    scan: fire.scan,
                    landCover: fire.landCover,
                    opacity: fire.confidence / 100,
                },
            })),
    };
    return geojson;
};

export const pollutionToGeojson = (realTimePollutionList: RealTimePollution[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: realTimePollutionList
            .filter(pollution => pollution.point)
            .map(pollution => ({
                id: pollution.id,
                type: 'Feature',
                geometry: {
                    ...pollution.point,
                },
                properties: {
                    pollutionId: pollution.id,
                    location: pollution.location,
                    city: pollution.city,
                    measuredOn: pollution.measuredOn,
                    measurements: pollution.measurements,
                    pm25: +pollution.measurements.flat().find(d => d.parameter === 'pm25' && d.unit === 'µg/m³').value || 0,
                },
            }))
            .sort((a, b) => (a.properties.pm25 - b.properties.pm25)),
    };
    return geojson;
};

export const regionLabelToGeojson = (adminLevels: Geo[]) => {
    const geojson = {
        type: 'FeatureCollection',
        features: adminLevels
            .map(level => ({
                id: level.id,
                type: 'Feature',
                geometry: {
                    ...level.centroid,
                },
                properties: {
                    adminLevelId: level.id,
                    title: level.title,
                },
            })),
    };

    return geojson;
};

// GEOJSON FILTER
export function getWardFilter(
    selectedProvinceId: number | undefined,
    selectedDistrictId: number | undefined,
    selectedMunicipalityId: number | undefined,
    wards: Ward[],
) {
    if (selectedMunicipalityId) {
        return [
            'match',
            ['id'],
            wards
                .filter(w => w.municipality === selectedMunicipalityId)
                .map(w => w.id),
            true,
            false,
        ];
    }
    if (selectedDistrictId) {
        return [
            'match',
            ['id'],
            wards
                .filter(w => w.district === selectedDistrictId)
                .map(w => w.id),
            true,
            false,
        ];
    }
    if (selectedProvinceId) {
        return [
            'match',
            ['id'],
            wards
                .filter(w => w.province === selectedProvinceId)
                .map(w => w.id),
            true,
            false,
        ];
    }
    return undefined;
}

export function getMunicipalityFilter(
    selectedProvinceId: number | undefined,
    selectedDistrictId: number | undefined,
    selectedMunicipalityId: number | undefined,
    municipalities: Municipality[],
) {
    if (selectedMunicipalityId) {
        return ['==', ['id'], selectedMunicipalityId];
    }
    if (selectedDistrictId) {
        return [
            'match',
            ['id'],
            municipalities
                .filter(m => m.district === selectedDistrictId)
                .map(m => m.id),
            true,
            false,
        ];
    }
    if (selectedProvinceId) {
        return [
            'match',
            ['id'],
            municipalities
                .filter(m => m.province === selectedProvinceId)
                .map(m => m.id),
            true,
            false,
        ];
    }
    return undefined;
}

export function getDistrictFilter(
    selectedProvinceId: number | undefined,
    selectedDistrictId: number | undefined,
    districts: District[],
) {
    if (selectedDistrictId) {
        return ['==', ['id'], selectedDistrictId];
    }
    if (selectedProvinceId) {
        return [
            'match',
            ['id'],
            districts
                .filter(d => d.province === selectedProvinceId)
                .map(d => d.id),
            true,
            false,
        ];
    }
    return undefined;
}

export function getProvinceFilter(selectedProvinceId: number | undefined) {
    if (selectedProvinceId) {
        return ['==', ['id'], selectedProvinceId];
    }
    return undefined;
}
