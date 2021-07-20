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
    { key: 'peopleDeathCount', label: 'People death' },
    { key: 'estimatedLoss', label: 'Estimated loss (NPR)' },
    { key: 'infrastructureDestroyedCount', label: 'Infrastructure destroyed' },
    { key: 'livestockDestroyedCount', label: 'Livestock destroyed' },
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
        '&legend_options=fontAntiAliasing:true;layout:vertical;columnheight:100;dpi:96;labelMargin:2;fontSize:9;',
        '&width=12',
        '&height=12',
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
export const generatePaintByQuantile = (
    colorDomain: string[],
    minValue: number,
    maxValue: number,
    categoryData: number[],
    parts: number,
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

export const getAttributeOptions = (resourceEnums: EnumItem[], attribute: string) => {
    const value = resourceEnums.find(r => r.attribute === attribute);
    const choices = (value && value.choices) || [];
    const options = choices.map(v => ({ key: v, label: v }));
    return options;
};
