/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-len */
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
    Layer,
    LayerWithGroup,
    LayerGroup,
} from '#store/atom/page/types';
import {
    LegendItem,
    LayerHierarchy,
    LayerMap,
    EnumItem,
} from '#types';

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

interface AlertsWithReference extends Alert {
    referenceType?: string;
    referenceData?: string;
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
export const getAttributeOptions = (resourceEnums: EnumItem[], attribute: string) => {
    const value = resourceEnums.find(r => r.attribute === attribute);
    const choices = (value && value.choices) || [];
    const options = choices.map(v => ({ key: v, label: v }));
    return options;
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
    const listWithHazardFiltered = listWithHazard.filter(l => isDefined(l.hazard));

    const group = groupList(
        listWithHazardFiltered as Required<WithHazard>[],
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
    { key: 'count', label: 'Incidents' },
    { key: 'peopleDeathCount', label: 'Human death' },
    { key: 'estimatedLoss', label: 'Estimated loss (NPR)' },
    { key: 'infrastructureDestroyedCount', label: 'Infrastructure destroyed' },
    { key: 'livestockDestroyedCount', label: 'Livestock destroyed' },
    { key: 'peopleInjuredCount', label: 'Injured people' },
    { key: 'peopleMissingCount', label: 'Missing people' },
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

export const alertToPointGeojson = (alertList: AlertsWithReference[], hazards: Obj<HazardType>) => {
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
                    hazard: hazardId,
                    createdOn,
                    referenceType,
                    referenceData,
                    startedOn,
                } = alert;

                const geometry = polygon
                    ? centroid(polygon as AllGeoJSON).geometry
                    : point;

                const hazard = hazards[hazardId];

                if (hazard) {
                    return {
                        id,
                        type: 'Feature',
                        geometry: { ...geometry },
                        properties: {
                            title,
                            description,
                            hazardTitle: hazard.title,
                            hazardIcon: hazard.icon,
                            hazardColor: hazard.color || '#4666b0',
                            createdOn: new Date(createdOn).getTime(),
                            referenceType,
                            referenceData,
                            createdDate: createdOn,
                            startedOn,
                        },
                    };
                }
                return {};
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
                    hazard: hazardId,
                } = event;

                const geometry = polygon
                    ? centroid(polygon as AllGeoJSON).geometry
                    : point;

                const hazard = hazards[hazardId];

                if (hazard) {
                    return {
                        id,
                        type: 'Feature',
                        geometry: { ...geometry },
                        properties: {
                            title,
                            description,
                            severity,
                            createdOn,
                            hazardTitle: hazard.title,
                            hazardIcon: hazard.icon,
                            hazardColor: hazard.color || '#4666b0',
                        },
                    };
                }
                return {};
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
                hazard: hazardId,
                incidentOn,
                severityValue,
            } = incident;

            const hazard = hazards[hazardId];
            if (hazard) {
                return {
                    id,
                    type: 'Feature',
                    geometry: { ...point },
                    properties: {
                        incidentId: id,
                        severity: calculateCategorizedSeverity(severityValue),
                        hazardTitle: hazard.title,
                        hazardIcon: hazard.icon,
                        hazardColor: hazard.color || '#4666b0',
                        incidentOn: new Date(incidentOn).getTime(),
                    },
                };
            }
            return {};
        }),
});
const getNum = (val) => {
    const incidentDate = new Date(val).getTime();
    return incidentDate;
};

export const incidentPointToGeojsonVR = (
    incidentList: Incident[],
    hazards: Obj<HazardType>,
    year,
) => ({
    type: 'FeatureCollection',
    features: incidentList
        .filter(incident => (
            !!incident.point
            && getNum(incident.incidentOn) > year.ini
            && getNum(incident.incidentOn) < year.fin))
        .map(incident => ({
            ...incident,
            severityValue: calculateSeverity(incident.loss, severityScaleFactor),
            dateOccured: incident.incidentOn,
        }))
        .sort((a, b) => (b.incidentOn - a.incidentOn))
        .map((incident) => {
            const {
                id,
                point,
                hazard: hazardId,
                incidentOn,
                severityValue,
            } = incident;

            const hazard = hazards[hazardId];
            if (hazard) {
                return {
                    id,
                    type: 'Feature',
                    geometry: { ...point },
                    properties: {
                        incidentId: id,
                        severity: calculateCategorizedSeverity(severityValue),
                        hazardTitle: hazard.title,
                        hazardIcon: hazard.icon,
                        hazardColor: hazard.color || '#4666b0',
                        incidentOn: new Date(incidentOn).getTime(),
                    },
                };
            }
            return {};
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
                    waterLevel: river.waterLevel && Number(river.waterLevel.toFixed(1)),
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
                    one: rain.averages[0].value && Number(rain.averages[0].value.toFixed(1)),
                    three: rain.averages[1].value && Number(rain.averages[1].value.toFixed(1)),
                    six: rain.averages[2].value && Number(rain.averages[2].value.toFixed(1)),
                    twelve: rain.averages[3].value && Number(rain.averages[3].value.toFixed(1)),
                    twentyfour: rain.averages[4].value && Number(rain.averages[4].value.toFixed(1)),
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
                    ...pollution,
                    aqi: Math.round(pollution.aqi),
                },
            })),
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

export function getRasterTile(layer: { layername: string }) {
    const tileUrl = [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        `&layers=Bipad:${layer.layername}`,
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('');

    return tileUrl;
}
export function getFeatureInfo(layer: { layername: string }, coordinates) {
    const tileUrl = [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&VERSION=1.1.1',
        '&SERVICE=WMS',
        '&REQUEST=GetFeatureInfo',
        `&QUERY_LAYERS=Bipad:${layer.layername}`,
        `&LAYERS=Bipad:${layer.layername}`,
        '&exceptions=application/vnd.ogc.se_inimage',
        '&INFO_FORMAT=application/json',
        '&X=50',
        '&Y=50',
        '&STYLES=',
        `&BBOX=${coordinates[0]},${coordinates[1]},${coordinates[2]},${coordinates[3]}`,
        '&tiled=true',
        '&WIDTH=101',
        '&HEIGHT=101',
        '&SRS=EPSG:4326',
        '&TRANSPARENT=true',
        '&FORMAT=image/jpeg',
    ].join('');
    return tileUrl;
}
// export function getRasterTileBuilding() {
//     const tileUrl = [
//         `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
//         '&version=1.1.1',
//         '&service=WMS',
//         '&request=GetMap',
//         '&layers=Bipad:NPL_buildings_exposure_total_area',
//         '&tiled=true',
//         '&width=256',
//         '&height=256',
//         '&srs=EPSG:3857',
//         '&bbox={bbox-epsg-3857}',
//         '&transparent=true',
//         '&format=image/png',
//     ].join('');

//     return tileUrl;
// }
export const getBuildingFootprint = (years: number) => [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
    '&version=1.1.1',
    '&service=WMS',
    '&request=GetMap',
    '&layers=Bipad:NPL_buildings_exposure_total_area',
    '&tiled=true',
    '&width=256',
    '&height=256',
    '&srs=EPSG:3857',
    '&bbox={bbox-epsg-3857}',
    '&transparent=true',
    '&format=image/png',
].join('');
export function getRasterLegendUrl(layer: { layername: string }) {
    const legendUrl = [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetLegendGraphic',
        `&layer=Bipad:${layer.layername}`,
        '&format=image/png',
        '&legend_options=fontAntiAliasing:true;layout:vertical;dpi:96;labelMargin:2;fontSize:9;',
        '&width=12',
        '&height=12',
        '&scale=1',
    ].join('');

    return legendUrl;
}

export function getLayerHierarchy(
    layerList: LayerWithGroup[],
    layerGroupList: LayerGroup[],
    layerType = 'raster',
) {
    const tree: LayerHierarchy[] = [];
    const lookup: LayerMap = {};

    const newLayers = layerList.map(layer => ({
        ...layer,
        parent: layer.group ? layer.group.id : undefined,
        children: [],
        opacity: 0.5,
        type: 'raster',
    }));

    const newGroups = layerGroupList.map(group => ({
        ...group,
        children: [],
    }));

    const layersAndGroups = [...newGroups, ...newLayers];

    newGroups.forEach((element) => {
        lookup[element.id] = element;
    });

    layersAndGroups.forEach((element) => {
        if (element.parent) {
            lookup[element.parent].children.push(element);
        } else {
            tree.push(element);
        }
    });

    return tree;
}

function formatNumber(num: number) {
    return num.toFixed(2).replace(/\.00$/, '');
}

export function generateLegendData(colorPaint: (string | number)[], minValue: number = 0) {
    let initialValue = minValue;
    const legendData = colorPaint.reduce((acc: LegendItem[], _, index, array) => {
        if (index % 2 === 0) {
            const [colorValue, value] = array.slice(index, index + 2);
            const label = `${formatNumber(initialValue)} - ${formatNumber(Number(value))}`;
            const color = `${colorValue}`;
            initialValue = Number(value);

            acc.push({ label, color });
        }
        return acc;
    }, []);

    return legendData;
}

export const generatePaint = (colorDomain: string[], minValue: number, maxValue: number) => {
    const range = maxValue - minValue;
    const gap = range / colorDomain.length;

    const colors: (string | number)[] = [];
    const legend: {
        [key: string]: number;
    } = {};

    if (maxValue <= 1 || gap < 1) {
        colorDomain.forEach((color, i) => {
            const val = +(minValue + (i + 1) * gap).toFixed(1);
            // NOTE: avoid duplicates
            if (colors.length > 0 && colors[colors.length - 1] === val) {
                return;
            }
            colors.push(color);
            colors.push(val);
            legend[color] = val;
        });
    } else {
        colorDomain.forEach((color, i) => {
            const val = Math.floor(minValue + (i + 1) * gap);
            // NOTE: avoid duplicates
            if (colors.length > 0 && colors[colors.length - 1] === val) {
                return;
            }
            colors.push(color);
            colors.push(val);
            legend[color] = val;
        });
    }

    let paint: {
        'fill-color': string | any[];
        'fill-opacity': number | any[];
    } = {
        'fill-color': 'white',
        'fill-opacity': 0.1,
    };

    if (colors.length !== 0) {
        const fillColor = [
            'step',
            ['feature-state', 'value'],
            ...colors.slice(0, -1),
        ];

        const fillOpacity = [
            'case',
            ['==', ['feature-state', 'value'], null],
            0,
            ['==', ['feature-state', 'hovered'], true],
            0.5,
            1,
        ];

        paint = {
            'fill-color': fillColor,
            'fill-opacity': fillOpacity,
        };
    }

    return { paint, legend };
};

/**
 * @param colorDomain List of color to be shown in the legend
 * @param minValue Min value in the supplied data
 * @param maxValue Max value in the supplied data
 * @param categoryData Data that is to be distributed by quantile method
 * @param parts Number of divisions for quantile division
 */

export const houseHoldSummaryLGProfileData = (lgProfileData, sexRatioTotalPopulationLGProfile) => (
    [
        {
            color: '#2A7BBB',
            key: 'totalPopulation',
            label: 'Total Population',
            value: sexRatioTotalPopulationLGProfile,
        },
        {
            color: '#83A4D3',
            key: 'householdCount',
            label: 'Household Count',
            value: lgProfileData.totalHouseholds,
        },
    ]
);
export const literacyRatioLGProfileData = (lgProfileData, literatePeopleTotalPopulationLGProfile) => (
    [
        {
            color: '#2A7BBB',
            key: 'male',
            label: 'Male',

            value: (lgProfileData.literacyRate.male / literatePeopleTotalPopulationLGProfile) * 100,
        },
        {
            color: '#83A4D3',
            key: 'female',
            label: 'Female',
            value: (lgProfileData.literacyRate.female / literatePeopleTotalPopulationLGProfile) * 100,

        },
        {
            color: '#83A4D3',
            key: 'Other',
            label: 'other',
            value: (lgProfileData.literacyRate.other / literatePeopleTotalPopulationLGProfile) * 100,

        },
    ]
);
export const sexRatioLGProfileData = (lgProfileData, sexRatioTotalPopulationLGProfile) => (
    [
        {
            color: '#2A7BBB',
            key: 'male',
            label: 'Male',
            value: lgProfileData.gender.male,
            percent: (lgProfileData.gender.male / sexRatioTotalPopulationLGProfile) * 100,
        },
        {
            color: '#83A4D3',
            key: 'female',
            label: 'Female',
            value: lgProfileData.gender.female,
            percent: (lgProfileData.gender.female / sexRatioTotalPopulationLGProfile) * 100,
        },
        {
            color: '#83A4D3',
            key: 'Other',
            label: 'other',
            value: lgProfileData.gender.other,
            percent: (lgProfileData.gender.other / sexRatioTotalPopulationLGProfile) * 100,
        },
    ]
);
export const summationLGProfileBuildingFoundationData = lgProfileData => (
    (lgProfileData.buildingFoundationType.bambooTimber ? lgProfileData.buildingFoundationType.bambooTimber : 0)
    + (lgProfileData.buildingFoundationType.cement ? lgProfileData.buildingFoundationType.cement : 0)
    + (lgProfileData.buildingFoundationType.mud ? lgProfileData.buildingFoundationType.mud : 0)
    + (lgProfileData.buildingFoundationType.reinforcedConcrete ? lgProfileData.buildingFoundationType.reinforcedConcrete : 0)
    + (lgProfileData.buildingFoundationType.other ? lgProfileData.buildingFoundationType.other : 0)
);
export const summationLGProfileBuildingTypeData = lgProfileData => (
    (lgProfileData.buildingType.AdobeMudConstruction ? lgProfileData.buildingType.AdobeMudConstruction : 0)
    + (lgProfileData.buildingType.bamboo ? lgProfileData.buildingType.bamboo : 0)
    + (lgProfileData.buildingType.timber ? lgProfileData.buildingType.timber : 0)
    + (lgProfileData.buildingType.cementBrick ? lgProfileData.buildingType.cementBrick : 0)
    + (lgProfileData.buildingType.cementStone ? lgProfileData.buildingType.cementStone : 0)
    + (lgProfileData.buildingType.mudBrick ? lgProfileData.buildingType.mudBrick : 0)
    + (lgProfileData.buildingType.mudStone ? lgProfileData.buildingType.mudStone : 0)
    + (lgProfileData.buildingType.rcEngg ? lgProfileData.buildingType.rcEngg : 0)
    + (lgProfileData.buildingType.rcNonEngg ? lgProfileData.buildingType.rcNonEngg : 0)
    + (lgProfileData.buildingType.other ? lgProfileData.buildingType.other : 0)
);
export const summationLGProfileAgricultureProductData = lgProfileData => (
    (lgProfileData.majorAgriProducts.cereals ? lgProfileData.majorAgriProducts.cereals : 0)
    + (lgProfileData.majorAgriProducts.oilseeds ? lgProfileData.majorAgriProducts.oilseeds : 0)
    + (lgProfileData.majorAgriProducts.vegetableCrop ? lgProfileData.majorAgriProducts.vegetableCrop : 0)
    + (lgProfileData.majorAgriProducts.spicyCrop ? lgProfileData.majorAgriProducts.spicyCrop : 0)
    + (lgProfileData.majorAgriProducts.cashCrop ? lgProfileData.majorAgriProducts.cashCrop : 0)
);

export const summationLGProfileAgriculturePracticeData = lgProfileData => (
    (lgProfileData.agriculturePractice.totalNumberOfHouseholdEngagedInAgriculture ? lgProfileData.agriculturePractice.totalNumberOfHouseholdEngagedInAgriculture : 0)
    + (lgProfileData.agriculturePractice.householdHavingOwnLandForAgriculture ? lgProfileData.agriculturePractice.householdHavingOwnLandForAgriculture : 0)
    + (lgProfileData.agriculturePractice.householdRaisingLivestockForAgriculturePurposes ? lgProfileData.agriculturePractice.householdRaisingLivestockForAgriculturePurposes : 0)
);
export const summationLGProfileResidentHouseholdData = lgProfileData => (
    (lgProfileData.buildingsByResidentHh['0'] ? lgProfileData.buildingsByResidentHh['0'] : 0)
    + (lgProfileData.buildingsByResidentHh['1'] ? lgProfileData.buildingsByResidentHh['1'] : 0)
    + (lgProfileData.buildingsByResidentHh['2'] ? lgProfileData.buildingsByResidentHh['2'] : 0)
    + (lgProfileData.buildingsByResidentHh['3'] ? lgProfileData.buildingsByResidentHh['3'] : 0)
    + (lgProfileData.buildingsByResidentHh['4+'] ? lgProfileData.buildingsByResidentHh['4+'] : 0)
);
export const summationLGProfileDrinkingWaterData = lgProfileData => (
    (lgProfileData.drinkingWater.pipeWaterAtHome ? lgProfileData.drinkingWater.pipeWaterAtHome : 0)
    + (lgProfileData.drinkingWater.deepBoring ? lgProfileData.drinkingWater.deepBoring : 0)
    + (lgProfileData.drinkingWater.tubeWellHandPump ? lgProfileData.drinkingWater.tubeWellHandPump : 0)
    + (lgProfileData.drinkingWater.coveredWell ? lgProfileData.drinkingWater.coveredWell : 0)
    + (lgProfileData.drinkingWater.openWell ? lgProfileData.drinkingWater.openWell : 0)
    + (lgProfileData.drinkingWater.groundWater ? lgProfileData.drinkingWater.groundWater : 0)
    + (lgProfileData.drinkingWater.river ? lgProfileData.drinkingWater.river : 0)
);
export const summationLGProfileMajorOccupationData = lgProfileData => (
    (lgProfileData.majorOccupation.notEligible ? lgProfileData.majorOccupation.notEligible : 0)
    + (lgProfileData.majorOccupation.unknown ? lgProfileData.majorOccupation.unknown : 0)
    + (lgProfileData.majorOccupation.business ? lgProfileData.majorOccupation.business : 0)
    + (lgProfileData.majorOccupation.service ? lgProfileData.majorOccupation.service : 0)
    + (lgProfileData.majorOccupation.foreignEmployment ? lgProfileData.majorOccupation.foreignEmployment : 0)
    + (lgProfileData.majorOccupation.student ? lgProfileData.majorOccupation.student : 0)
    + (lgProfileData.majorOccupation.others ? lgProfileData.majorOccupation.others : 0)
);
export const summationLGProfileAverageMonthlyIncomeData = lgProfileData => (
    (lgProfileData.householdIncome.lessThanNpr15 ? lgProfileData.householdIncome.lessThanNpr15 : 0)
    + (lgProfileData.householdIncome['15To30'] ? lgProfileData.householdIncome['15To30'] : 0)
    + (lgProfileData.householdIncome['30To60'] ? lgProfileData.householdIncome['30To60'] : 0)
    + (lgProfileData.householdIncome['60To120'] ? lgProfileData.householdIncome['60To120'] : 0)
    + (lgProfileData.householdIncome['120To240'] ? lgProfileData.householdIncome['120To240'] : 0)
    + (lgProfileData.householdIncome.moreThan240 ? lgProfileData.householdIncome.moreThan240 : 0)
);
export const summationLGProfileHouseHoldData = lgProfileData => (
    (lgProfileData.noOfHouseholds.femaleHeadedHouseholds ? lgProfileData.noOfHouseholds.femaleHeadedHouseholds : 0)
    + (lgProfileData.noOfHouseholds.householdWithMemberAged60 ? lgProfileData.noOfHouseholds.householdWithMemberAged60 : 0)
    + (lgProfileData.noOfHouseholds.numberOfHouseholdsWithDifferentlyAbleIndividual ? lgProfileData.noOfHouseholds.numberOfHouseholdsWithDifferentlyAbleIndividual : 0)
);
export const summationLGProfileDisabilityData = lgProfileData => (
    (lgProfileData.disability.physicalDisabilities ? lgProfileData.disability.physicalDisabilities : 0)
    + (lgProfileData.disability.visualDisabilities ? lgProfileData.disability.visualDisabilities : 0)
    + (lgProfileData.disability.hearingDisabilities ? lgProfileData.disability.hearingDisabilities : 0)
    + (lgProfileData.disability.hearingVisualDisabilities ? lgProfileData.disability.hearingVisualDisabilities : 0)
    + (lgProfileData.disability.speakingDisabilities ? lgProfileData.disability.speakingDisabilities : 0)
    + (lgProfileData.disability.mentalDisabilities ? lgProfileData.disability.mentalDisabilities : 0)
    + (lgProfileData.disability.intellectualDisabilities ? lgProfileData.disability.intellectualDisabilities : 0)
    + (lgProfileData.disability.multipleDisabilities ? lgProfileData.disability.multipleDisabilities : 0)
);
export const summationLGProfileSocialSecurityData = lgProfileData => (
    (lgProfileData.socialSecurityBenefitAvailed.elderCitizen ? lgProfileData.socialSecurityBenefitAvailed.elderCitizen : 0)
    + (lgProfileData.socialSecurityBenefitAvailed.singleWomen ? lgProfileData.socialSecurityBenefitAvailed.singleWomen : 0)
    + (lgProfileData.socialSecurityBenefitAvailed.differentlyAble ? lgProfileData.socialSecurityBenefitAvailed.differentlyAble : 0)
    + (lgProfileData.socialSecurityBenefitAvailed.extinctCaste ? lgProfileData.socialSecurityBenefitAvailed.extinctCaste : 0)
    + (lgProfileData.socialSecurityBenefitAvailed.childSecurity ? lgProfileData.socialSecurityBenefitAvailed.childSecurity : 0)
    + (lgProfileData.socialSecurityBenefitAvailed.pension ? lgProfileData.socialSecurityBenefitAvailed.pension : 0)
    + (lgProfileData.socialSecurityBenefitAvailed.others ? lgProfileData.socialSecurityBenefitAvailed.others : 0)
    + (lgProfileData.socialSecurityBenefitAvailed.notAvailed ? lgProfileData.socialSecurityBenefitAvailed.notAvailed : 0)
    + (lgProfileData.socialSecurityBenefitAvailed.notApplicable ? lgProfileData.socialSecurityBenefitAvailed.notApplicable : 0)
);
export const summationLGProfileMigrationData = lgProfileData => (
    (lgProfileData.migration.mostlyPresent ? lgProfileData.migration.mostlyPresent : 0)
    + (lgProfileData.migration.notPresentInsideNepal ? lgProfileData.migration.notPresentInsideNepal : 0)
    + (lgProfileData.migration.notPresentOutsideNepal ? lgProfileData.migration.notPresentOutsideNepal : 0)
    + (lgProfileData.migration.notKnown ? lgProfileData.migration.notKnown : 0)
);
export const SummationLGProfileEducationLevelData = lgProfileData => (
    (lgProfileData.educationLevel.primary ? lgProfileData.educationLevel.primary : 0) + (lgProfileData.educationLevel.lowerSecondary ? lgProfileData.educationLevel.lowerSecondary : 0)
    + (lgProfileData.educationLevel.slcOrEquivalent ? lgProfileData.educationLevel.slcOrEquivalent : 0) + (lgProfileData.educationLevel.intermediateOrEquivalent ? lgProfileData.educationLevel.intermediateOrEquivalent : 0)
    + (lgProfileData.educationLevel.bachelorOrEquivalent ? lgProfileData.educationLevel.bachelorOrEquivalent : 0) + (lgProfileData.educationLevel.mastersPhd ? lgProfileData.educationLevel.mastersPhd : 0)
    + (lgProfileData.educationLevel.noEducation ? lgProfileData.educationLevel.noEducation : 0) + (lgProfileData.educationLevel.otherNonformal ? lgProfileData.educationLevel.otherNonformal : 0)
    + (lgProfileData.educationLevel.notEligible ? lgProfileData.educationLevel.notEligible : 0) + (lgProfileData.educationLevel.unknown ? lgProfileData.educationLevel.unknown : 0)
);
export const LGProfileBuildingFoundationData = (lgProfileData, summationLGProfileBuildingFoundation) => (
    [
        {
            key: 'bambooTimber',
            label: 'Bamboo/Timber',
            value: lgProfileData.buildingFoundationType.bambooTimber ? lgProfileData.buildingFoundationType.bambooTimber : 0,
            percentage: lgProfileData.buildingFoundationType.bambooTimber ? (lgProfileData.buildingFoundationType.bambooTimber / summationLGProfileBuildingFoundation) * 100 : 0,
        },
        {
            key: 'cement',
            label: 'Cement',
            value: lgProfileData.buildingFoundationType.cement ? lgProfileData.buildingFoundationType.cement : 0,
            percentage: lgProfileData.buildingFoundationType.cement ? (lgProfileData.buildingFoundationType.cement / summationLGProfileBuildingFoundation) * 100 : 0,
        },
        {
            key: 'mud',
            label: 'Mud',
            value: lgProfileData.buildingFoundationType.mud ? lgProfileData.buildingFoundationType.mud : 0,
            percentage: lgProfileData.buildingFoundationType.mud ? (lgProfileData.buildingFoundationType.mud / summationLGProfileBuildingFoundation) * 100 : 0,
        },
        {
            key: 'reinforcedConcrete',
            label: 'Re Inforced Concrete',
            value: lgProfileData.buildingFoundationType.reinforcedConcrete ? lgProfileData.buildingFoundationType.reinforcedConcrete : 0,
            percentage: lgProfileData.buildingFoundationType.reinforcedConcrete ? (lgProfileData.buildingFoundationType.reinforcedConcrete / summationLGProfileBuildingFoundation) * 100 : 0,
        },
        {
            key: 'other',
            label: 'Other',
            value: lgProfileData.buildingFoundationType.other ? lgProfileData.buildingFoundationType.other : 0,
            percentage: lgProfileData.buildingFoundationType.other ? (lgProfileData.buildingFoundationType.other / summationLGProfileBuildingFoundation) * 100 : 0,
        },
    ]
);
export const LGProfileBuildingTypeData = (lgProfileData, summationLGProfileBuildingType) => (
    [
        {
            key: 'AdobeMudConstruction',
            label: 'Adobe Mud Construction',
            value: lgProfileData.buildingType.AdobeMudConstruction ? lgProfileData.buildingType.AdobeMudConstruction : 0,
            percentage: lgProfileData.buildingType.AdobeMudConstruction ? (lgProfileData.buildingType.AdobeMudConstruction / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'bamboo',
            label: 'Bamboo',
            value: lgProfileData.buildingType.bamboo ? lgProfileData.buildingType.bamboo : 0,
            percentage: lgProfileData.buildingType.bamboo ? (lgProfileData.buildingType.bamboo / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'timber',
            label: 'Timber',
            value: lgProfileData.buildingType.timber ? lgProfileData.buildingType.timber : 0,
            percentage: lgProfileData.buildingType.timber ? (lgProfileData.buildingType.timber / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'cementBrick',
            label: 'Cement Brick',
            value: lgProfileData.buildingType.cementBrick ? lgProfileData.buildingType.cementBrick : 0,
            percentage: lgProfileData.buildingType.cementBrick ? (lgProfileData.buildingType.cementBrick / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'cementStone',
            label: 'Cement Stone',
            value: lgProfileData.buildingType.cementStone ? lgProfileData.buildingType.cementStone : 0,
            percentage: lgProfileData.buildingType.cementStone ? (lgProfileData.buildingType.cementStone / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'mudBrick',
            label: 'Mud Brick',
            value: lgProfileData.buildingType.mudBrick ? lgProfileData.buildingType.mudBrick : 0,
            percentage: lgProfileData.buildingType.mudBrick ? (lgProfileData.buildingType.mudBrick / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'mudStone',
            label: 'Mud Stone',
            value: lgProfileData.buildingType.mudStone ? lgProfileData.buildingType.mudStone : 0,
            percentage: lgProfileData.buildingType.mudStone ? (lgProfileData.buildingType.mudStone / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'rcEngg',
            label: 'RC Engg',
            value: lgProfileData.buildingType.rcEngg ? lgProfileData.buildingType.rcEngg : 0,
            percentage: lgProfileData.buildingType.rcEngg ? (lgProfileData.buildingType.rcEngg / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'rcNonEngg',
            label: 'RC Non Engg',
            value: lgProfileData.buildingType.rcNonEngg ? lgProfileData.buildingType.rcNonEngg : 0,
            percentage: lgProfileData.buildingType.rcNonEngg ? (lgProfileData.buildingType.rcNonEngg / summationLGProfileBuildingType) * 100 : 0,
        },
        {
            key: 'other',
            label: 'Other',
            value: lgProfileData.buildingType.other ? lgProfileData.buildingType.other : 0,
            percentage: lgProfileData.buildingType.other ? (lgProfileData.buildingType.other / summationLGProfileBuildingType) * 100 : 0,
        },
    ]
);

export const LGProfileAgricultureProductData = (lgProfileData, summationLGProfileAgricultureProduct) => (
    [
        {
            key: 'cereals',
            label: 'Cereals',
            value: lgProfileData.majorAgriProducts.cereals ? lgProfileData.majorAgriProducts.cereals : 0,
            percentage: lgProfileData.majorAgriProducts.cereals ? (lgProfileData.majorAgriProducts.cereals / summationLGProfileAgricultureProduct) * 100 : 0,
        },
        {
            key: 'oilseeds',
            label: 'Oilseeds',
            value: lgProfileData.majorAgriProducts.oilseeds ? lgProfileData.majorAgriProducts.oilseeds : 0,
            percentage: lgProfileData.majorAgriProducts.oilseeds ? (lgProfileData.majorAgriProducts.oilseeds / summationLGProfileAgricultureProduct) * 100 : 0,
        },
        {
            key: 'vegetableCrop',
            label: 'Vegetable Crop',
            value: lgProfileData.majorAgriProducts.vegetableCrop ? lgProfileData.majorAgriProducts.vegetableCrop : 0,
            percentage: lgProfileData.majorAgriProducts.vegetableCrop ? (lgProfileData.majorAgriProducts.vegetableCrop / summationLGProfileAgricultureProduct) * 100 : 0,
        },
        {
            key: 'spicyCrop',
            label: 'Spicy Crop',
            value: lgProfileData.majorAgriProducts.spicyCrop ? lgProfileData.majorAgriProducts.spicyCrop : 0,
            percentage: lgProfileData.majorAgriProducts.spicyCrop ? (lgProfileData.majorAgriProducts.spicyCrop / summationLGProfileAgricultureProduct) * 100 : 0,
        },
        {
            key: 'cashCrop',
            label: 'Cash Crop',
            value: lgProfileData.majorAgriProducts.cashCrop ? lgProfileData.majorAgriProducts.cashCrop : 0,
            percentage: lgProfileData.majorAgriProducts.cashCrop ? (lgProfileData.majorAgriProducts.cashCrop / summationLGProfileAgricultureProduct) * 100 : 0,
        },
    ]
);
export const LGProfileAgriculturePracticeData = (lgProfileData, summationLGProfileAgriculturePractice) => (
    [
        {
            key: 'totalNumberOfHouseholdEngagedInAgriculture',
            label: 'Total Number Of Household Engaged In Agriculture',
            value: lgProfileData.agriculturePractice.totalNumberOfHouseholdEngagedInAgriculture ? lgProfileData.agriculturePractice.totalNumberOfHouseholdEngagedInAgriculture : 0,
            percentage: lgProfileData.agriculturePractice.totalNumberOfHouseholdEngagedInAgriculture ? ((lgProfileData.agriculturePractice.totalNumberOfHouseholdEngagedInAgriculture / summationLGProfileAgriculturePractice) * 100).toFixed(2) : 0,
        },
        {
            key: 'householdHavingOwnLandForAgriculture',
            label: 'Household Having Own Land For Agriculture',
            value: lgProfileData.agriculturePractice.householdHavingOwnLandForAgriculture ? lgProfileData.agriculturePractice.householdHavingOwnLandForAgriculture : 0,
            percentage: lgProfileData.agriculturePractice.householdHavingOwnLandForAgriculture ? ((lgProfileData.agriculturePractice.householdHavingOwnLandForAgriculture / summationLGProfileAgriculturePractice) * 100).toFixed(2) : 0,
        },
        {
            key: 'householdRaisingLivestockForAgriculturePurposes',
            label: 'Household Raising Livestock For Agriculture Purposes',
            value: lgProfileData.agriculturePractice.householdRaisingLivestockForAgriculturePurposes ? lgProfileData.agriculturePractice.householdRaisingLivestockForAgriculturePurposes : 0,
            percentage: lgProfileData.agriculturePractice.householdRaisingLivestockForAgriculturePurposes ? ((lgProfileData.agriculturePractice.householdRaisingLivestockForAgriculturePurposes / summationLGProfileAgriculturePractice) * 100).toFixed(2) : 0,
        },
    ]
);
export const LGProfileResidentHouseholdData = (lgProfileData, summationLGProfileResidentHousehold) => (
    [
        {
            key: '0',
            label: '0',
            value: lgProfileData.buildingsByResidentHh['0'] ? lgProfileData.buildingsByResidentHh['0'] : 0,
            percentage: lgProfileData.buildingsByResidentHh['0'] ? (lgProfileData.buildingsByResidentHh['0'] / summationLGProfileResidentHousehold) * 100 : 0,
        },
        {
            key: '1',
            label: '1',
            value: lgProfileData.buildingsByResidentHh['1'] ? lgProfileData.buildingsByResidentHh['1'] : 0,
            percentage: lgProfileData.buildingsByResidentHh['1'] ? (lgProfileData.buildingsByResidentHh['1'] / summationLGProfileResidentHousehold) * 100 : 0,
        },
        {
            key: '2',
            label: '2',
            value: lgProfileData.buildingsByResidentHh['2'] ? lgProfileData.buildingsByResidentHh['2'] : 0,
            percentage: lgProfileData.buildingsByResidentHh['2'] ? (lgProfileData.buildingsByResidentHh['2'] / summationLGProfileResidentHousehold) * 100 : 0,
        },
        {
            key: '3',
            label: '3',
            value: lgProfileData.buildingsByResidentHh['3'] ? lgProfileData.buildingsByResidentHh['3'] : 0,
            percentage: lgProfileData.buildingsByResidentHh['3'] ? (lgProfileData.buildingsByResidentHh['3'] / summationLGProfileResidentHousehold) * 100 : 0,
        },
        {
            key: '4+',
            label: '4+',
            value: lgProfileData.buildingsByResidentHh['4+'] ? lgProfileData.buildingsByResidentHh['4+'] : 0,
            percentage: lgProfileData.buildingsByResidentHh['4+'] ? (lgProfileData.buildingsByResidentHh['4+'] / summationLGProfileResidentHousehold) * 100 : 0,
        },
    ]
);

export const LGProfileDrinkingWaterData = (lgProfileData, summationLGProfileDrinkingWater) => (
    [
        {
            key: 'pipeWaterAtHome',
            label: 'Pipe Water At Home',
            value: lgProfileData.drinkingWater.pipeWaterAtHome ? lgProfileData.drinkingWater.pipeWaterAtHome : 0,
            percentage: lgProfileData.drinkingWater.pipeWaterAtHome ? (lgProfileData.drinkingWater.pipeWaterAtHome / summationLGProfileDrinkingWater) * 100 : 0,
        },
        {
            key: 'deepBoring',
            label: 'Deep Boring',
            value: lgProfileData.drinkingWater.deepBoring ? lgProfileData.drinkingWater.deepBoring : 0,
            percentage: lgProfileData.drinkingWater.deepBoring ? (lgProfileData.drinkingWater.deepBoring / summationLGProfileDrinkingWater) * 100 : 0,
        },
        {
            key: 'tubeWellHandPump',
            label: 'TubeWell HandPump',
            value: lgProfileData.drinkingWater.tubeWellHandPump ? lgProfileData.drinkingWater.tubeWellHandPump : 0,
            percentage: lgProfileData.drinkingWater.tubeWellHandPump ? (lgProfileData.drinkingWater.tubeWellHandPump / summationLGProfileDrinkingWater) * 100 : 0,
        },
        {
            key: 'coveredWell',
            label: 'Covered Well',
            value: lgProfileData.drinkingWater.coveredWell ? lgProfileData.drinkingWater.coveredWell : 0,
            percentage: lgProfileData.drinkingWater.coveredWell ? (lgProfileData.drinkingWater.coveredWell / summationLGProfileDrinkingWater) * 100 : 0,
        },
        {
            key: 'openWell',
            label: 'Open Well',
            value: lgProfileData.drinkingWater.openWell ? lgProfileData.drinkingWater.openWell : 0,
            percentage: lgProfileData.drinkingWater.openWell ? (lgProfileData.drinkingWater.openWell / summationLGProfileDrinkingWater) * 100 : 0,
        },
        {
            key: 'groundWater',
            label: 'Ground Water',
            value: lgProfileData.drinkingWater.groundWater ? lgProfileData.drinkingWater.groundWater : 0,
            percentage: lgProfileData.drinkingWater.groundWater ? (lgProfileData.drinkingWater.groundWater / summationLGProfileDrinkingWater) * 100 : 0,
        },
        {
            key: 'river',
            label: 'River',
            value: lgProfileData.drinkingWater.river ? lgProfileData.drinkingWater.river : 0,
            percentage: lgProfileData.drinkingWater.river ? (lgProfileData.drinkingWater.river / summationLGProfileDrinkingWater) * 100 : 0,
        },
    ]
);
export const LGProfileAverageMajorOccupationData = (lgProfileData, summationLGProfileMajorOccupation) => (
    [
        {
            key: 'notEligible',
            label: 'Not Eligible',
            value: lgProfileData.majorOccupation.notEligible ? lgProfileData.majorOccupation.notEligible : 0,
            percentage: lgProfileData.majorOccupation.notEligible ? (lgProfileData.majorOccupation.notEligible / summationLGProfileMajorOccupation) * 100 : 0,
        },
        {
            key: 'unknown',
            label: 'Unknown',
            value: lgProfileData.majorOccupation.unknown ? lgProfileData.majorOccupation.unknown : 0,
            percentage: lgProfileData.majorOccupation.unknown ? (lgProfileData.majorOccupation.unknown / summationLGProfileMajorOccupation) * 100 : 0,
        },
        {
            key: 'business',
            label: 'Business',
            value: lgProfileData.majorOccupation.business ? lgProfileData.majorOccupation.business : 0,
            percentage: lgProfileData.majorOccupation.business ? (lgProfileData.majorOccupation.business / summationLGProfileMajorOccupation) * 100 : 0,
        },
        {
            key: 'service',
            label: 'Service',
            value: lgProfileData.majorOccupation.service ? lgProfileData.majorOccupation.service : 0,
            percentage: lgProfileData.majorOccupation.service ? (lgProfileData.majorOccupation.service / summationLGProfileMajorOccupation) * 100 : 0,
        },
        {
            key: 'foreignEmployment',
            label: 'Foreign Employment',
            value: lgProfileData.majorOccupation.foreignEmployment ? lgProfileData.majorOccupation.foreignEmployment : 0,
            percentage: lgProfileData.majorOccupation.foreignEmployment ? (lgProfileData.majorOccupation.foreignEmployment / summationLGProfileMajorOccupation) * 100 : 0,
        },
        {
            key: 'student',
            label: 'Student',
            value: lgProfileData.majorOccupation.student ? lgProfileData.majorOccupation.student : 0,
            percentage: lgProfileData.majorOccupation.student ? (lgProfileData.majorOccupation.student / summationLGProfileMajorOccupation) * 100 : 0,
        },
        {
            key: 'others',
            label: 'Others',
            value: lgProfileData.majorOccupation.others ? lgProfileData.majorOccupation.others : 0,
            percentage: lgProfileData.majorOccupation.others ? (lgProfileData.majorOccupation.others / summationLGProfileMajorOccupation) * 100 : 0,
        },
    ]
);

export const LGProfileAverageMonthlyIncomeData = (lgProfileData, summationLGProfileAverageMonthlyIncome) => (
    [
        {
            key: 'lessThanNpr15',
            label: 'Less Than Npr 15,000',
            value: lgProfileData.householdIncome.lessThanNpr15 ? lgProfileData.householdIncome.lessThanNpr15 : 0,
            percentage: lgProfileData.householdIncome.lessThanNpr15 ? (lgProfileData.householdIncome.lessThanNpr15 / summationLGProfileAverageMonthlyIncome) * 100 : 0,
        },
        {
            key: '15To30',
            label: 'NPR15,000 to NPR30,000',
            value: lgProfileData.householdIncome['15To30'] ? lgProfileData.householdIncome['15To30'] : 0,
            percentage: lgProfileData.householdIncome['15To30'] ? (lgProfileData.householdIncome['15To30'] / summationLGProfileAverageMonthlyIncome) * 100 : 0,
        },
        {
            key: '30To60',
            label: 'NPR30,000 to NPR60,000',
            value: lgProfileData.householdIncome['30To60'] ? lgProfileData.householdIncome['30To60'] : 0,
            percentage: lgProfileData.householdIncome['30To60'] ? (lgProfileData.householdIncome['30To60'] / summationLGProfileAverageMonthlyIncome) * 100 : 0,
        },
        {
            key: '60To120',
            label: 'NPR60,000 to NPR120,000',
            value: lgProfileData.householdIncome['60To120'] ? lgProfileData.householdIncome['60To120'] : 0,
            percentage: lgProfileData.householdIncome['60To120'] ? (lgProfileData.householdIncome['60To120'] / summationLGProfileAverageMonthlyIncome) * 100 : 0,
        },
        {
            key: '120To240',
            label: 'NPR120,000 to NPR240,000',
            value: lgProfileData.householdIncome['120To240'] ? lgProfileData.householdIncome['120To240'] : 0,
            percentage: lgProfileData.householdIncome['120To240'] ? (lgProfileData.householdIncome['120To240'] / summationLGProfileAverageMonthlyIncome) * 100 : 0,
        },
        {
            key: 'moreThan240',
            label: 'More Than Npr 240,000',
            value: lgProfileData.householdIncome.moreThan240 ? lgProfileData.householdIncome.moreThan240 : 0,
            percentage: lgProfileData.householdIncome.moreThan240 ? (lgProfileData.householdIncome.moreThan240 / summationLGProfileAverageMonthlyIncome) * 100 : 0,
        },
    ]
);


export const LGProfileHouseHoldData = (lgProfileData, summationLGProfileHouseHold) => (
    [
        {
            key: 'femaleHeadedHouseholds',
            label: 'Female Headed Households',
            value: lgProfileData.noOfHouseholds.femaleHeadedHouseholds ? lgProfileData.noOfHouseholds.femaleHeadedHouseholds : 0,
            percentage: lgProfileData.noOfHouseholds.femaleHeadedHouseholds ? (lgProfileData.noOfHouseholds.femaleHeadedHouseholds / summationLGProfileHouseHold) * 100 : 0,
        },
        {
            key: 'householdWithMemberAged60',
            label: 'Household With Member Aged 60',
            value: lgProfileData.noOfHouseholds.householdWithMemberAged60 ? lgProfileData.noOfHouseholds.householdWithMemberAged60 : 0,
            percentage: lgProfileData.noOfHouseholds.householdWithMemberAged60 ? (lgProfileData.noOfHouseholds.householdWithMemberAged60 / summationLGProfileHouseHold) * 100 : 0,
        },
        {
            key: 'numberOfHouseholdsWithDifferentlyAbleIndividual',
            label: 'Number Of Households With Differently Able Individual',
            value: lgProfileData.noOfHouseholds.numberOfHouseholdsWithDifferentlyAbleIndividual ? lgProfileData.noOfHouseholds.numberOfHouseholdsWithDifferentlyAbleIndividual : 0,
            percentage: lgProfileData.noOfHouseholds.numberOfHouseholdsWithDifferentlyAbleIndividual ? (lgProfileData.noOfHouseholds.numberOfHouseholdsWithDifferentlyAbleIndividual / summationLGProfileHouseHold) * 100 : 0,
        },
    ]
);
export const LGProfileDisabilityData = (lgProfileData, summationLGProfileDisability) => (
    [
        {
            key: 'physicalDisabilities',
            label: 'Physical Disabilities',
            value: lgProfileData.disability.physicalDisabilities ? lgProfileData.disability.physicalDisabilities : 0,
            percentage: lgProfileData.disability.physicalDisabilities ? (lgProfileData.disability.physicalDisabilities / summationLGProfileDisability) * 100 : 0,
        },
        {
            key: 'visualDisabilities',
            label: 'Visual Disabilities',
            value: lgProfileData.disability.visualDisabilities ? lgProfileData.disability.visualDisabilities : 0,
            percentage: lgProfileData.disability.visualDisabilities ? (lgProfileData.disability.visualDisabilities / summationLGProfileDisability) * 100 : 0,
        },
        {
            key: 'hearingDisabilities',
            label: 'Hearing Disabilities',
            value: lgProfileData.disability.hearingDisabilities ? lgProfileData.disability.hearingDisabilities : 0,
            percentage: lgProfileData.disability.hearingDisabilities ? (lgProfileData.disability.hearingDisabilities / summationLGProfileDisability) * 100 : 0,
        },
        {
            key: 'hearingVisualDisabilities',
            label: 'Hearing Visual Disabilities',
            value: lgProfileData.disability.hearingVisualDisabilities ? lgProfileData.disability.hearingVisualDisabilities : 0,
            percentage: lgProfileData.disability.hearingVisualDisabilities ? (lgProfileData.disability.hearingVisualDisabilities / summationLGProfileDisability) * 100 : 0,
        },
        {
            key: 'speakingDisabilities',
            label: 'Speaking Disabilities',
            value: lgProfileData.disability.speakingDisabilities ? lgProfileData.disability.speakingDisabilities : 0,
            percentage: lgProfileData.disability.speakingDisabilities ? (lgProfileData.disability.speakingDisabilities / summationLGProfileDisability) * 100 : 0,
        },
        {
            key: 'mentalDisabilities',
            label: 'Mental Disabilities',
            value: lgProfileData.disability.mentalDisabilities ? lgProfileData.disability.mentalDisabilities : 0,
            percentage: lgProfileData.disability.mentalDisabilities ? (lgProfileData.disability.mentalDisabilities / summationLGProfileDisability) * 100 : 0,
        },
        {
            key: 'intellectualDisabilities',
            label: 'Intellectual Disabilities',
            value: lgProfileData.disability.intellectualDisabilities ? lgProfileData.disability.intellectualDisabilities : 0,
            percentage: lgProfileData.disability.intellectualDisabilities ? (lgProfileData.disability.intellectualDisabilities / summationLGProfileDisability) * 100 : 0,
        },
        {
            key: 'multipleDisabilities',
            label: 'Multiple Disabilities',
            value: lgProfileData.disability.multipleDisabilities ? lgProfileData.disability.multipleDisabilities : 0,
            percentage: lgProfileData.disability.multipleDisabilities ? (lgProfileData.disability.multipleDisabilities / summationLGProfileDisability) * 100 : 0,
        },
    ]
);
export const LGProfileSocialSecurityData = (lgProfileData, summationLGProfileSocialSecurity) => (
    [
        {
            key: 'elderCitizen',
            label: 'Elder citizen',
            value: lgProfileData.socialSecurityBenefitAvailed.elderCitizen ? lgProfileData.socialSecurityBenefitAvailed.elderCitizen : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.elderCitizen ? (lgProfileData.socialSecurityBenefitAvailed.elderCitizen / summationLGProfileSocialSecurity) * 100 : 0,
        },
        {
            key: 'singleWomen',
            label: 'single women',
            value: lgProfileData.socialSecurityBenefitAvailed.singleWomen ? lgProfileData.socialSecurityBenefitAvailed.singleWomen : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.singleWomen ? (lgProfileData.socialSecurityBenefitAvailed.singleWomen / summationLGProfileSocialSecurity) * 100 : 0,
        },
        {
            key: 'differentlyAble',
            label: 'differently Able',
            value: lgProfileData.socialSecurityBenefitAvailed.differentlyAble ? lgProfileData.socialSecurityBenefitAvailed.differentlyAble : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.differentlyAble ? (lgProfileData.socialSecurityBenefitAvailed.differentlyAble / summationLGProfileSocialSecurity) * 100 : 0,
        },
        {
            key: 'extinctCaste',
            label: 'Extinct Caste',
            value: lgProfileData.socialSecurityBenefitAvailed.extinctCaste ? lgProfileData.socialSecurityBenefitAvailed.extinctCaste : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.extinctCaste ? (lgProfileData.socialSecurityBenefitAvailed.extinctCaste / summationLGProfileSocialSecurity) * 100 : 0,
        },
        {
            key: 'childSecurity',
            label: 'Child Security',
            value: lgProfileData.socialSecurityBenefitAvailed.childSecurity ? lgProfileData.socialSecurityBenefitAvailed.childSecurity : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.childSecurity ? (lgProfileData.socialSecurityBenefitAvailed.childSecurity / summationLGProfileSocialSecurity) * 100 : 0,
        },
        {
            key: 'pension',
            label: 'Pension',
            value: lgProfileData.socialSecurityBenefitAvailed.pension ? lgProfileData.socialSecurityBenefitAvailed.pension : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.pension ? (lgProfileData.socialSecurityBenefitAvailed.pension / summationLGProfileSocialSecurity) * 100 : 0,
        },
        {
            key: 'others',
            label: 'Others',
            value: lgProfileData.socialSecurityBenefitAvailed.others ? lgProfileData.socialSecurityBenefitAvailed.others : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.others ? (lgProfileData.socialSecurityBenefitAvailed.others / summationLGProfileSocialSecurity) * 100 : 0,
        },
        {
            key: 'notAvailed',
            label: 'Not Availed',
            value: lgProfileData.socialSecurityBenefitAvailed.notAvailed ? lgProfileData.socialSecurityBenefitAvailed.notAvailed : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.notAvailed ? (lgProfileData.socialSecurityBenefitAvailed.notAvailed / summationLGProfileSocialSecurity) * 100 : 0,
        },
        {
            key: 'notApplicable',
            label: 'Not Applicable',
            value: lgProfileData.socialSecurityBenefitAvailed.notApplicable ? lgProfileData.socialSecurityBenefitAvailed.notApplicable : 0,
            percentage: lgProfileData.socialSecurityBenefitAvailed.notApplicable ? (lgProfileData.socialSecurityBenefitAvailed.notApplicable / summationLGProfileSocialSecurity) * 100 : 0,
        },
    ]
);


export const LGProfileMigrationData = (lgProfileData, summationLGProfileMigration) => (
    [
        {
            key: 'mostlyPresent',
            label: 'Mostly Present',
            value: lgProfileData.migration.mostlyPresent ? lgProfileData.migration.mostlyPresent : 0,
            percentage: lgProfileData.migration.mostlyPresent ? (lgProfileData.migration.mostlyPresent / summationLGProfileMigration) * 100 : 0,
        },
        {
            key: 'notPresentInsideNepal',
            label: 'Not present,inside Nepal',
            value: lgProfileData.migration.notPresentInsideNepal ? lgProfileData.migration.notPresentInsideNepal : 0,
            percentage: lgProfileData.migration.notPresentInsideNepal ? (lgProfileData.migration.notPresentInsideNepal / summationLGProfileMigration) * 100 : 0,
        },
        {
            key: 'notPresentOutsideNepal',
            label: 'Not Present,Outside Nepal',
            value: lgProfileData.migration.notPresentOutsideNepal ? lgProfileData.migration.notPresentOutsideNepal : 0,
            percentage: lgProfileData.migration.notPresentOutsideNepal ? (lgProfileData.migration.notPresentOutsideNepal / summationLGProfileMigration) * 100 : 0,
        },
        {
            key: 'notKnown',
            label: 'Not Known',
            value: lgProfileData.migration.notKnown ? lgProfileData.migration.notKnown : 0,
            percentage: lgProfileData.migration.notKnown ? (lgProfileData.migration.notKnown / summationLGProfileMigration) * 100 : 0,
        },
    ]
);


export const LGProfileEducationLevelData = (lgProfileData, SummationLGProfileEducationLevel) => (
    [
        {
            key: 'primary',
            label: 'Primary',
            value: lgProfileData.educationLevel.primary ? lgProfileData.educationLevel.primary : 0,
            percentage: lgProfileData.educationLevel.primary ? (lgProfileData.educationLevel.primary / SummationLGProfileEducationLevel) * 100 : 0,
        },
        {
            key: 'lowerSecondary',
            label: 'Lower Secondary',
            value: lgProfileData.educationLevel.lowerSecondary ? lgProfileData.educationLevel.lowerSecondary : 0,
            percentage: lgProfileData.educationLevel.lowerSecondary ? ((lgProfileData.educationLevel.lowerSecondary / SummationLGProfileEducationLevel) * 100) : 0,
        },
        {
            key: 'slcOrEquivalent',
            label: 'SLC or equivalent',
            value: lgProfileData.educationLevel.slcOrEquivalent ? lgProfileData.educationLevel.slcOrEquivalent : 0,
            percentage: lgProfileData.educationLevel.slcOrEquivalent ? (lgProfileData.educationLevel.slcOrEquivalent / SummationLGProfileEducationLevel) * 100 : 0,
        },
        {
            key: 'intermediateOrEquivalent',
            label: 'Intermediate or equivalent',
            value: lgProfileData.educationLevel.intermediateOrEquivalent ? lgProfileData.educationLevel.intermediateOrEquivalent : 0,
            percentage: lgProfileData.educationLevel.intermediateOrEquivalent ? (lgProfileData.educationLevel.intermediateOrEquivalent / SummationLGProfileEducationLevel) * 100 : 0,
        },
        {
            key: 'bachelorOrEquivalent',
            label: 'Bachelor or Equivalent',
            value: lgProfileData.educationLevel.bachelorOrEquivalent ? lgProfileData.educationLevel.bachelorOrEquivalent : 0,
            percentage: lgProfileData.educationLevel.bachelorOrEquivalent ? (lgProfileData.educationLevel.bachelorOrEquivalent / SummationLGProfileEducationLevel) * 100 : 0,
        },
        {
            key: 'mastersPhd',
            label: 'Masters/Ph.D',
            value: lgProfileData.educationLevel.mastersPhd ? lgProfileData.educationLevel.mastersPhd : 0,
            percentage: lgProfileData.educationLevel.mastersPhd ? (lgProfileData.educationLevel.mastersPhd / SummationLGProfileEducationLevel) * 100 : 0,
        },
        {
            key: 'noEducation',
            label: 'No education',
            value: lgProfileData.educationLevel.noEducation ? lgProfileData.educationLevel.noEducation : 0,
            percentage: lgProfileData.educationLevel.noEducation ? (lgProfileData.educationLevel.noEducation / SummationLGProfileEducationLevel) * 100 : 0,
        },
        {
            key: 'otherNonformal',
            label: 'Other/Non-formal',
            value: lgProfileData.educationLevel.otherNonformal ? lgProfileData.educationLevel.otherNonformal : 0,
            percentage: lgProfileData.educationLevel.otherNonformal ? (lgProfileData.educationLevel.otherNonformal / SummationLGProfileEducationLevel) * 100 : 0,
        },
        {
            key: 'notEligible',
            label: 'Not Eligible(less than 5 years of age)',
            value: lgProfileData.educationLevel.notEligible ? lgProfileData.educationLevel.notEligible : 0,
            percentage: lgProfileData.educationLevel.notEligible ? (lgProfileData.educationLevel.notEligible / SummationLGProfileEducationLevel) * 100 : 0,
        },
        {
            key: 'unknown',
            label: 'Unknown',
            value: lgProfileData.educationLevel.unknown ? lgProfileData.educationLevel.unknown : 0,
            percentage: lgProfileData.educationLevel.unknown ? (lgProfileData.educationLevel.unknown / SummationLGProfileEducationLevel) * 100 : 0,
        },
    ]
);
export const lgProfileAgeGroupData = lgProfileData => (
    [
        {
            key: '0004Total',
            label: '00-04',
            value: lgProfileData.ageGroup['0004Total'] ? lgProfileData.ageGroup['0004Total'] : 0,
        },
        {
            key: '0509Total',
            label: '05 - 09',
            value: lgProfileData.ageGroup['0509Total'] ? lgProfileData.ageGroup['0509Total'] : 0,
        },
        {
            key: '1014Total',
            label: '10 - 14',
            value: lgProfileData.ageGroup['1014Total'] ? lgProfileData.ageGroup['1014Total'] : 0,
        },
        {
            key: '1519Total',
            label: '15 - 19',
            value: lgProfileData.ageGroup['1519Total'] ? lgProfileData.ageGroup['1519Total'] : 0,
        },
        {
            key: '2024Total',
            label: '20 - 24',
            value: lgProfileData.ageGroup['2024Total'] ? lgProfileData.ageGroup['2024Total'] : 0,
        },
        {
            key: '2529Total',
            label: '25 - 29',
            value: lgProfileData.ageGroup['2529Total'] ? lgProfileData.ageGroup['2529Total'] : 0,
        },
        {
            key: '3034Total',
            label: '30 - 34',
            value: lgProfileData.ageGroup['3034Total'] ? lgProfileData.ageGroup['3034Total'] : 0,
        },
        {
            key: '3539Total',
            label: '35 - 39',
            value: lgProfileData.ageGroup['3539Total'] ? lgProfileData.ageGroup['3539Total'] : 0,
        },
        {
            key: '4044Total',
            label: '40 - 44',
            value: lgProfileData.ageGroup['4044Total'] ? lgProfileData.ageGroup['4044Total'] : 0,
        },
        {
            key: '4549Total',
            label: '45 - 49',
            value: lgProfileData.ageGroup['4549Total'] ? lgProfileData.ageGroup['4549Total'] : 0,
        },
        {
            key: '5054Total',
            label: '50 - 54',
            value: lgProfileData.ageGroup['5054Total'] ? lgProfileData.ageGroup['5054Total'] : 0,
        },
        {
            key: '5559Total',
            label: '55 - 59',
            value: lgProfileData.ageGroup['5559Total'] ? lgProfileData.ageGroup['5559Total'] : 0,
        },
        {
            key: '6064Total',
            label: '60 - 64',
            value: lgProfileData.ageGroup['6064Total'] ? lgProfileData.ageGroup['6064Total'] : 0,
        },
        {
            key: '6569Total',
            label: '65 - 69',
            value: lgProfileData.ageGroup['6569Total'] ? lgProfileData.ageGroup['6569Total'] : 0,
        },
        {
            key: '7074Total',
            label: '70 - 74',
            value: lgProfileData.ageGroup['7074Total'] ? lgProfileData.ageGroup['7074Total'] : 0,
        },
        {
            key: '75MoreTotal',
            label: '75+',
            value: lgProfileData.ageGroup['75MoreTotal'] ? lgProfileData.ageGroup['75MoreTotal'] : 0,
        },
    ]
);


export const generatePaintByQuantile = (
    colorDomain: string[],
    minValue: number,
    maxValue: number,
    categoryData: number[],
    parts: number,
    adminLevel: number,
) => {
    const range = maxValue - minValue;
    const gap = range / colorDomain.length;

    /* Quantile Division starts */
    const data = categoryData;

    // Divide into equal number of events
    const divider = Math.ceil(data.length / parts);
    data.sort((a, b) => a - b);
    const dividedSpecificData = new Array(Math.ceil(data.length / divider))
        .fill()
        .map(_ => data.splice(0, divider));

    // remove any empty array from specific data
    const nonEmptyData = dividedSpecificData.filter(r => r.length > 0);

    const intervals: number[] = [];
    // push max value from each array inside nonEmptyData
    // plus 1 added to fix 0 - 0 issue
    nonEmptyData.map(d => intervals.push(Math.max(...d) === 0
        ? Math.max(...d) + 1 : Math.max(...d)));

    /* Quantile Division ends */

    const countBasedIntervals = intervals;
    const colors: (string | number)[] = [];
    const legend: {
        [key: string]: number;
    } = {};
    if (maxValue <= 1 || gap < 1) {
        colorDomain.forEach((color, i) => {
            const val = +(minValue + (i + 1) * gap).toFixed(1);
            // NOTE: avoid duplicates
            if (colors.length > 0 && colors[colors.length - 1] === val) {
                return;
            }
            colors.push(color);
            colors.push(val);
            legend[color] = val;
        });
    } else {
        colorDomain.forEach((color, i) => {
            // NOTE: avoid duplicates
            if (colors.length > 0 && colors[colors.length - 1] === countBasedIntervals[i]) {
                return;
            }
            colors.push(color);
            colors.push(countBasedIntervals[i]);
            legend[color] = countBasedIntervals[i];
        });
    }

    let legendPaint: {
        'fill-color': string | any[];
    } = {
        'fill-color': 'white',
    };
    let paint: {
        'fill-color': string | any[];
        'fill-opacity': number | any[];
    } = {
        'fill-color': 'white',
        'fill-opacity': 0.1,
    };
    if (colors.length !== 0) {
        const fillColor = adminLevel === 3 ? [
            'step',
            ['feature-state', 'value'],
            ...colors, colorDomain[0],

        ] : [
            'step',
            ['feature-state', 'value'],
            ...colors.slice(0, -1),
        ];

        const fillOpacity = [
            'case',
            ['==', ['feature-state', 'value'], null],
            0,
            ['==', ['feature-state', 'hovered'], true],
            0.5,
            1,
        ];

        paint = {
            'fill-color': fillColor,
            'fill-opacity': fillOpacity,
        };
        legendPaint = {
            'fill-color': fillColor,
        };
    }

    return { paint, legend, legendPaint };
};

export const capacityResource = [
    {
        id: 1,
        name: 'Education',
        resourceType: 'education',
        attribute: 'type',
        level: 1,
        subCategory: [
            {
                id: 1,
                name: 'Preprimary',
                type: 'Preprimary',
            },
            {
                id: 2,
                name: 'Basic Education',
                type: 'Basic Education',
            },
            {
                id: 3,
                name: 'High School',
                type: 'High School',
            },
            {
                id: 4,
                name: 'College',
                type: 'College',
            },
            {
                id: 5,
                name: 'University',
                type: 'University',
            },
            {
                id: 6,
                name: 'Traditional Education',
                type: 'Traditional Education',
            },
            {
                id: 7,
                name: 'Library',
                type: 'Library',
            },
            {
                id: 8,
                name: 'Other',
                type: 'Other',
            },
        ],
    },
    {
        id: 2,
        name: 'Health',
        resourceType: 'health',
        attribute: 'type',
        level: 1,
        subCategory: [
            {
                id: 9,
                name: 'Specialized Hospital',
                type: 'Specialized Hospital',
            },
            {
                id: 10,
                name: 'Center Hospital',
                type: 'Center Hospital',
            },
            {
                id: 11,
                name: 'Teaching Hospital',
                type: 'Teaching Hospital',
            },
            {
                id: 12,
                name: 'Regional Hospital',
                type: 'Regional Hospital',
            },
            {
                id: 13,
                name: 'Sub Regional Hospital',
                type: 'Sub Regional Hospital',
            },
            {
                id: 14,
                name: 'Zonal Hospital',
                type: 'Zonal Hospital',
            },
            {
                id: 15,
                name: 'District Hospital',
                type: 'District Hospital',
            },
            {
                id: 16,
                name: 'Basic Hospital',
                type: 'Basic Hospital',
            },
            {
                id: 17,
                name: 'General Hospital',
                type: 'General Hospital',
            },
            {
                id: 18,
                name: 'Primary Health Care Center',
                type: 'Primary Health Care Center',
            },
            {
                id: 19,
                name: 'Health Post',
                type: 'Health Post',
            },
            {
                id: 20,
                name: 'District Clinic (Including Institutional)',
                type: 'District Clinic (Including Institutional)',

            },
            {
                id: 21,
                name: 'Urban Health Center',
                type: 'Urban Health Center',

            },
            {
                id: 22,
                name: 'Community Health Unit',
                type: 'Community Health Unit',

            },
            {
                id: 23,
                name: 'Poly Clinic',
                type: 'Poly Clinic',

            },
            {
                id: 24,
                name: 'Clinic',
                type: 'Clinic',

            },
            {
                id: 25,
                name: 'Dental Clinic',
                type: 'Dental Clinic',

            },
            {
                id: 26,
                name: 'Diagnostic Center',
                type: 'Diagnostic Center',

            },
            {
                id: 27,
                name: 'Nursing Home',
                type: 'Nursing Home',

            },
            {
                id: 28,
                name: 'Rehabilitation',
                type: 'Rehabilitation',

            },
            {
                id: 29,
                name: 'Ayurveda Hospital',
                type: 'Ayurveda Hospital',

            },
            {
                id: 30,
                name: 'Zonal Ayurveda Aushadhalaya',
                type: 'Zonal Ayurveda Aushadhalaya',

            },
            {
                id: 31,
                name: 'District Ayurveda Health Center',
                type: 'District Ayurveda Health Center',

            },
            {
                id: 32,
                name: 'Ayurveda Aushadhalaya',
                type: 'Ayurveda Aushadhalaya',

            },
            {
                id: 33,
                name: 'Homeopathy Hospital',
                type: 'Homeopathy Hospital',

            },
            {
                id: 34,
                name: 'Unani Hospital',
                type: 'Unani Hospital',

            },
            {
                id: 35,
                name: 'Primary Hospital',
                type: 'Primary Hospital',

            },
            {
                id: 36,
                name: 'Secondary A Hospital',
                type: 'Secondary A Hospital',

            },
            {
                id: 37,
                name: 'Secondary B Hospital',
                type: 'Secondary B Hospital',

            },
            {
                id: 38,
                name: 'Tertiary Hospital',
                type: 'Tertiary Hospital',

            },
            {
                id: 39,
                name: 'Super Specialized Hospital',
                type: 'Super Specialized Hospital',

            },
            {
                id: 40,
                name: 'Basic Health Care Center',
                type: 'Basic Health Care Center',

            },
            {
                id: 41,
                name: 'Veterinary',
                type: 'Veterinary',

            },
            {
                id: 42,
                name: 'Pathology',
                type: 'Pathology',

            },
            {
                id: 43,
                name: 'Pharmacy',
                type: 'Pharmacy',

            },
        ],
    },
    {
        id: 3,
        name: 'Banking & Finance',
        resourceType: 'finance',
        attribute: 'type',
        level: 1,
        subCategory: [
            {
                id: 44,
                name: 'Commercial',
                type: 'Commercial',
            },
            {
                id: 45,
                name: 'Micro Credit Development',
                type: 'Micro Credit Development',
            },
            {
                id: 46,
                name: 'Finance',
                type: 'Finance',
            },
            {
                id: 47,
                name: 'Development Bank',
                type: 'Development Bank',
            },
            {
                id: 48,
                name: 'Cooperative',
                type: 'Cooperative',
            },
            {
                id: 49,
                name: 'Money Exchange',
                type: 'Money Exchange',
            },
            {
                id: 50,
                name: 'ATM',
                type: 'ATM',
            },

        ],
    },
    {
        id: 4,
        name: 'Communication',
        resourceType: 'communication',
        attribute: 'type',
        level: 1,
        subCategory: [
            {
                id: 51,
                name: 'FM Radio',
                type: 'FM Radio',
            },
            {
                id: 52,
                name: 'TV Station',
                type: 'TV Station',
            },
            {
                id: 53,
                name: 'Newspapers',
                type: 'Newspapers',
            },
            {
                id: 54,
                name: 'Phone Service',
                type: 'Phone Service',
            },
            {
                id: 55,
                name: 'Cable',
                type: 'Cable',
            },
            {
                id: 56,
                name: 'Online Media',
                type: 'Online Media',
            },
            {
                id: 57,
                name: 'Internet Service Provider',
                type: 'Internet Service Provider',
            },

        ],
    },
    {
        id: 5,
        name: 'Governance',
        resourceType: 'governance',
        attribute: 'type',
        level: 1,
        subCategory: [
            {
                id: 58,
                name: 'Government',
                type: 'Government',
            },
            {
                id: 59,
                name: 'INGO',
                type: 'INGO',
            },
            {
                id: 60,
                name: 'NGO',
                type: 'NGO',
            },
            {
                id: 61,
                name: 'CSO',
                type: 'CSO',
            },
            {
                id: 62,
                name: 'Other',
                type: 'Other',
            },

        ],
    },
    {
        id: 6,
        name: 'Hotel & Restaurant',
        resourceType: 'hotelandrestaurant',
        level: 1,
        attribute: 'type',
        subCategory: [
            {
                id: 63,
                name: 'Hotel',
                type: 'Hotel',
            },
            {
                id: 64,
                name: 'Restaurant',
                type: 'Restaurant',
            },
            {
                id: 65,
                name: 'Lodge',
                type: 'Lodge',
            },
            {
                id: 66,
                name: 'Resort',
                type: 'Resort',
            },
            {
                id: 67,
                name: 'Homestay',
                type: 'Homestay',
            },


        ],
    },
    {
        id: 7,
        name: 'Culture',
        resourceType: 'cultural',
        attribute: 'religion',
        level: 1,
        subCategory: [
            {
                id: 68,
                name: 'Hindu',
                type: 'Hindu',
            },
            {
                id: 69,
                name: 'Islam',
                type: 'Islam',
            },
            {
                id: 70,
                name: 'Christian',
                type: 'Christian',
            },
            {
                id: 71,
                name: 'Buddhist',
                type: 'Buddhist',
            },
            {
                id: 72,
                name: 'Kirat',
                type: 'Kirat',
            },
            {
                id: 73,
                name: 'Sikhism',
                type: 'Sikhism',
            },
            {
                id: 74,
                name: 'Judaism',
                type: 'Judaism',
            },
            {
                id: 75,
                name: 'Other',
                type: 'Other',
            },

        ],
    },
    {
        id: 8,
        name: 'Industry',
        resourceType: 'industry',
        attribute: 'subtype',
        level: 1,
        subCategory: [
            {
                id: 76,
                name: 'Cottage Industry',
                type: 'Cottage Industry',
            },
            {
                id: 77,
                name: 'Micro Industry',
                type: 'Micro Industry',
            },
            {
                id: 78,
                name: 'Small Industry',
                type: 'Small Industry',
            },
            {
                id: 79,
                name: 'Medium Industry',
                type: 'Medium Industry',
            },
            {
                id: 80,
                name: 'Large Industry',
                type: 'Large Industry',
            },
            {
                id: 999,
                name: 'Other',
                type: 'Other',
            },
        ],
    },
    {
        id: 9,
        name: 'Bridge',
        resourceType: 'bridge',
        level: 1,
        attribute: 'type',
        subCategory: [
            {
                id: 81,
                name: 'Arch Bridge',
                type: 'Arch Bridge',
            },
            {
                id: 82,
                name: 'Beam Bridge',
                type: 'Beam Bridge',
            },
            {
                id: 83,
                name: 'Cantilever Bridge',
                type: 'Cantilever Bridge',
            },
            {
                id: 84,
                name: 'Wooden Bridge',
                type: 'Wooden Bridge',
            },
            {
                id: 85,
                name: 'Suspension Bridge',
                type: 'Suspension Bridge',
            },
            {
                id: 86,
                name: 'Cable-stayed Bridge',
                type: 'Cable-stayed Bridge',
            },
            {
                id: 87,
                name: 'Culvert Bridge',
                type: 'Culvert Bridge',
            },
            {
                id: 88,
                name: 'Bailey Bridge',
                type: 'Bailey Bridge',
            },
            {
                id: 89,
                name: 'Truss Bridge',
                type: 'Truss Bridge',
            },
            {
                id: 90,
                name: 'Other',
                type: 'Other',

            },


        ],
    },
    // {
    //     // id: 10,
    //     name: 'Transportation',
    //     // resourceType: 'transportation',
    //     typeName: 'transportation',
    //     level: 2,
    //     // attribute: 'type',
    //     Category: [
    //         {
    //             id: 10,
    //             name: 'Roadway',
    //             resourceType: 'roadway',
    //             attribute: 'kindOfVehicle',
    //             subCategory: [
    //                 {
    //                     id: 91,
    //                     name: 'Bus',
    //                     type: 'Bus',
    //                 },
    //                 {
    //                     id: 92,
    //                     name: 'Micro',
    //                     type: 'Micro',
    //                 },
    //                 {
    //                     id: 93,
    //                     name: 'Van',
    //                     type: 'Van',
    //                 },
    //                 {
    //                     id: 94,
    //                     name: 'Other',
    //                     type: 'Other',
    //                 },

    //             ],
    //         },
    //         {
    //             id: 11,
    //             name: 'Waterway',
    //             resourceType: 'waterway',
    //             attribute: 'type',
    //             subCategory: [
    //                 {
    //                     id: 95,
    //                     name: 'General Boat',
    //                     type: 'General Boat',
    //                 },
    //                 {
    //                     id: 96,
    //                     name: 'Electrical Boat',
    //                     type: 'Electrical Boat',
    //                 },
    //                 {
    //                     id: 97,
    //                     name: 'Other',
    //                     type: 'Other',
    //                 },

    //             ],
    //         },
    //         {
    //             id: 12,
    //             name: 'Airway',
    //             resourceType: 'airway',
    //             attribute: 'type',
    //             subCategory: [
    //                 {
    //                     id: 98,
    //                     name: 'National',
    //                     type: 'National',
    //                 },
    //                 {
    //                     id: 99,
    //                     name: 'International',
    //                     type: 'International',
    //                 },


    //             ],
    //         },
    //         {
    //             id: 13,
    //             name: 'Helipad',
    //             resourceType: 'helipad',
    //             attribute: '',
    //             subCategory: [],
    //         },


    //     ],
    // },

    {
        id: 14,
        name: 'Electricity',
        resourceType: 'electricity',
        attribute: 'components',
        level: 1,
        subCategory: [
            {
                id: 100,
                name: 'Hydropower',
                type: 'Hydropower',
            },
            {
                id: 101,
                name: 'Substation',
                type: 'Substation',
            },
            {
                id: 102,
                name: 'Dam',
                type: 'Dam',
            },
            {
                id: 103,
                name: 'Transmission Pole',
                type: 'Transmission Pole',
            },
            {
                id: 104,
                name: 'Other',
                type: 'Other',

            },


        ],
    },


    // {

    //     name: 'Fire Fighting Apparatus',

    //     typeName: 'Fire Fighting Apparatus',
    //     level: 2,

    //     Category: [
    //         {
    //             id: 15,
    //             name: 'Fire Engine',
    //             resourceType: 'fireengine',
    //             attribute: 'type',
    //             subCategory: [],
    //         },


    //     ],
    // },


    // {
    //     id: 15,
    //     name: 'Fire Fighting Apparatus',
    //     resourceType: 'firefightingapparatus',
    //     attribute: 'type',
    //     level: 1,
    //     subCategory: [
    //         {
    //             id: 86,
    //             name: 'Fire Engine',
    //             type: 'Fire Engine',
    //         },
    //         {
    //             id: 87,
    //             name: 'Fire Bike',
    //             type: 'Fire Bike',
    //         },
    //         {
    //             id: 88,
    //             name: 'Other',
    //             type: 'Other',
    //         },


    //     ],
    // },
    {
        id: 16,
        name: 'Sanitation Service',
        resourceType: 'sanitation',
        attribute: 'type',
        level: 1,
        subCategory: [
            {
                id: 105,
                name: 'Landfill',
                type: 'Landfill',
            },
            {
                id: 106,
                name: 'Dumping Site',
                type: 'Dumping Site',
            },
            {
                id: 107,
                name: 'Public Toilet',
                type: 'Public Toilet',
            },


        ],
    },
    {
        id: 17,
        name: 'Water Supply Infrastructure',
        resourceType: 'watersupply',
        attribute: 'scale',
        level: 1,
        subCategory: [
            {
                id: 108,
                name: 'Small',
                type: 'Small',
            },
            {
                id: 109,
                name: 'Medium',
                type: 'Medium',
            },
            {
                id: 110,
                name: 'Large',
                type: 'Large',
            },


        ],
    },
    {
        id: 24,
        name: 'Roadway',
        resourceType: 'roadway',
        level: 1,
        attribute: 'kindOfVehicle',
        subCategory: [
            {
                id: 91,
                name: 'Bus',
                type: 'Bus',
            },
            {
                id: 92,
                name: 'Micro',
                type: 'Micro',
            },
            {
                id: 93,
                name: 'Van',
                type: 'Van',
            },
            {
                id: 94,
                name: 'Other',
                type: 'Other',
            },

        ],
    },
    {
        id: 25,
        name: 'Waterway',
        resourceType: 'waterway',
        level: 1,
        attribute: 'type',
        subCategory: [
            {
                id: 95,
                name: 'General Boat',
                type: 'General Boat',
            },
            {
                id: 96,
                name: 'Electrical Boat',
                type: 'Electrical Boat',
            },
            {
                id: 97,
                name: 'Other',
                type: 'Other',
            },

        ],
    },
    {
        id: 26,
        name: 'Airway',
        resourceType: 'airway',
        level: 1,
        attribute: 'type',
        subCategory: [
            {
                id: 98,
                name: 'National',
                type: 'National',
            },
            {
                id: 99,
                name: 'International',
                type: 'International',
            },


        ],
    },
    {
        id: 28,
        name: 'Fire Fighting Apparatus',
        resourceType: 'firefightingapparatus',
        attribute: 'typeOfApparatus',
        level: 1,
        subCategory: [
            {
                id: 86,
                name: 'Fire Engine',
                type: 'Fire Engine',
            },
            {
                id: 87,
                name: 'Fire Bike',
                type: 'Fire Bike',
            },
            {
                id: 88,
                name: 'Other',
                type: 'Other',
            },


        ],
    },
    {
        id: 27,
        name: 'Helipad',
        resourceType: 'helipad',
        attribute: '',
        level: 1,
        subCategory: [],
    },
    // {
    //     id: 23,
    //     name: 'Fire Engine',
    //     resourceType: 'fireengine',
    //     attribute: 'type',
    //     level: 1,
    //     subCategory: [
    //         {
    //             id: 86,
    //             name: 'Fire Engine',
    //             type: 'Fire Engine',
    //         },
    //         {
    //             id: 87,
    //             name: 'Fire Bike',
    //             type: 'Fire Bike',
    //         },
    //         {
    //             id: 88,
    //             name: 'Other',
    //             type: 'Other',
    //         },


    //     ],
    // },
    // {

    //     name: 'Open Space',

    //     typeName: 'Open Space',
    //     level: 2,

    //     Category: [
    //         {
    //             id: 18,
    //             name: 'Humanitarian Open Space',
    //             resourceType: 'openspace',
    //             attribute: '',
    //             subCategory: [],
    //         },
    //         {
    //             id: 19,
    //             name: 'Community Space',
    //             resourceType: 'communityspace',
    //             attribute: '',
    //             subCategory: [],
    //         },


    //     ],
    // },
    {
        id: 20,
        name: 'Humanitarian Open Space',
        resourceType: 'openspace',
        attribute: '',
        level: 1,
        subCategory: [],
    },
    {
        id: 21,
        name: 'Community Space',
        resourceType: 'communityspace',
        attribute: '',
        level: 1,
        subCategory: [],
    },
    {
        id: 22,
        name: 'Evacuation Centre',
        resourceType: 'evacuationcentre',
        attribute: '',
        level: 1,
        subCategory: [],
    },
];
