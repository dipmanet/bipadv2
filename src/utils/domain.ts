import { Obj, isTruthy } from '@togglecorp/fujs';
import {
    Loss,
    HazardType,
    Alert,
    Incident,
    RealTimeEarthquake,
    RealTimeRain,
    RealTimeRiver,
    Resource,
} from '#store/atom/page/types';

export const ONE_HUMAN_EQUIVALENT_MONEY = 50000;

// The following give the effect of loss. NOTE: They sum to 1
export const MONEY_LOSS_FACTOR = 0.2;
export const PEOPLE_LOSS_FACTOR = 0.4;
export const LIVESTOCK_LOSS_FACTOR = 0.1;
export const INFRASTRUCTURE_LOSS_FACTOR = 0.3;

export const calculateSeverity = (loss: Loss, scaleFactor: number = 1): number => {
    const {
        estimatedLoss = 0,
        peopleDeathCount = 0,
        livestockDestroyedCount = 0,
        infrastructureDestroyedCount = 0,
    } = loss;

    // NOTE: for now just return peopleDeathCount
    return peopleDeathCount;

    /*
    const offset = 0.2;

    const severity = offset +
        ((MONEY_LOSS_FACTOR * estimatedLoss) / ONE_HUMAN_EQUIVALENT_MONEY) +
        (PEOPLE_LOSS_FACTOR * peopleDeathCount) +
        (LIVESTOCK_LOSS_FACTOR * livestockDestroyedCount) +
        (INFRASTRUCTURE_LOSS_FACTOR * infrastructureDestroyedCount);

    return severity * scaleFactor;
    */
};

export const calculateCategorizedSeverity = (loss: Loss, scaleFactor?: number): string => {
    const severity = calculateSeverity(loss, scaleFactor);
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

export const alertToGeojson = (alertList: Alert[], hazards: Obj<HazardType>) => {
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
                    },
                };
            }),
    };

    return geojson;
};

// severityScaleFactor is to show severity as radius of circle in map, which is logarithmic
// and for small values, all severities look same for which we need to scale
const severityScaleFactor = 20000;

export const incidentPointToGeojson = (incidentList: Incident[], hazards: Obj<HazardType>) => ({
    type: 'FeatureCollection',
    features: incidentList
        .filter(incident => !!incident.point)
        .map((incident) => {
            const {
                id,
                point,
                loss,
                hazard,
                incidentOn,
            } = incident;
            return {
                id,
                type: 'Feature',
                geometry: { ...point },
                properties: {
                    incidentId: id,
                    severity: calculateCategorizedSeverity(loss, severityScaleFactor),
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
        .map((incident) => {
            const {
                id,
                polygon,
                loss,
                hazard,
                incidentOn,
            } = incident;
            return {
                id,
                type: 'Feature',
                geometry: { ...polygon },
                properties: {
                    incidentId: id,
                    severity: calculateSeverity(loss, severityScaleFactor),
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
            })),
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
            })),
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
