/* eslint-disable max-len */
import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { isDefined } from '@togglecorp/fujs';
// eslint-disable-next-line import/no-unresolved
import * as geojson from 'geojson';
import { mapSources } from '#constants';
import demographicsData from '../Data/demographicsData';
import expressions from '../Data/expressions';
import * as PageTypes from '#store/atom/page/types';
import { getHillShadeLayer, getGeoJSON } from '#views/VizRisk/Jugal/utils';
import { AppState } from '#store/types';
import PageLayers from '../Data/pageLayers';
import {
    municipalitiesSelector,
    districtsSelector,
    wardsSelector,
    boundsSelector,
    selectedProvinceIdSelector,
    selectedDistrictIdSelector,
    selectedMunicipalityIdSelector,
} from '#selectors';

import {
    getWardFilter,
} from '#utils/domain';


interface State{
    lat: number;
    lng: number;
    zoom: number;
    categoriesCritical: string[];
}

interface OwnProps{
    rightElement: number;
    showPopulation: string;
    criticalElement: string;
    CIData: CIData;
    region: Region | undefined;
}

interface Region {
    adminLevel: number;
    geoarea: number;
}

interface CIData{
    type: geojson.GeoJsonTypes;
    features: Feature[];
}

interface Feature {
    properties: Properties;
    geometry: geojson.Geometry;
}

interface Properties {
    CI: string;
}

interface PropsFromAppState {
    districts: PageTypes.District[];
    municipalities: PageTypes.Municipality[];
    wards: PageTypes.Ward[];
    bounds: number[];
    selectedProvinceId: number | undefined;
    selectedDistrictId: number | undefined;
    selectedMunicipalityId: number | undefined;
}

type Props = OwnProps & PropsFromAppState;

type LngLat = any[];
const UNSUPPORTED_BROWSER = !mapboxgl.supported();
const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const {
    slideLayers1,
    slideLayers2,
    slideLayers3,
} = PageLayers;

const mapStateToProps = (state: AppState, props: Props): PropsFromAppState => ({
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    bounds: boundsSelector(state, props),
    selectedProvinceId: selectedProvinceIdSelector(state, props),
    selectedDistrictId: selectedDistrictIdSelector(state, props),
    selectedMunicipalityId: selectedMunicipalityIdSelector(state, props),
});

let hoveredWardId: (string | number |undefined);
const { populationWardExpression } = expressions;

const lat = 28.015490220644214;
const lng = 85.79108507481781;
const zoom = 9.8;
function noop() {}

const mapStyle = {
    position: 'absolute',
    width: 'calc(70%)',
    left: 'calc(30% - 60px)',
    top: 0,
    height: '100vh',
};

const JugalMap = (props: Props) => {
    const [categoriesCritical, setcategoriesCritical] = useState([]);
    const map = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const {
        wards,
        rightElement,
        CIData,
        criticalElement,
        showPopulation,
    } = props;

    useEffect(() => {
        if (UNSUPPORTED_BROWSER) {
            console.error('No Mapboxgl support.');
            return noop;
        }
        const { current: mapContainer } = mapContainerRef;
        if (!mapContainer) {
            console.error('No container found.');
            return noop;
        }
        if (map.current) { return noop; }


        const mapping = wards.filter(item => item.municipality === 23007).map(item => ({
            ...item,
            value: Number(item.title),
        }));

        const jugalMap = new mapboxgl.Map({
            container: mapContainer,
            style: process.env.REACT_APP_VIZRISK_JUGAL_LANDSLIDE,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });

        map.current = jugalMap;


        jugalMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        jugalMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        jugalMap.on('style.load', () => {
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
            jugalMap.addSource('jugalHillshade', {
                type: 'raster',
                tiles: [getHillShadeLayer('Jugal_hillshade')],
                tileSize: 256,
            });

            jugalMap.addLayer(
                {
                    id: 'jugalHillshadeLayer',
                    type: 'raster',
                    source: 'jugalHillshade',
                    layout: {},
                    paint: {
                        'raster-opacity': 0.25,
                    },
                },
            );
            console.log('CI data in map', CIData);

            // if (isDefined(CIData.features)) {
            const categories: any = [...new Set(CIData.features.map(
                item => item.properties.CI,
            ))];
            setcategoriesCritical(categories);
            console.log('categories', categories);
            categories.map((layer: string) => {
                jugalMap.addSource(layer, {
                    type: 'geojson',
                    data: getGeoJSON(layer, CIData),
                    cluster: true,
                    clusterRadius: 50,
                });
                jugalMap.addLayer({
                    id: `clusters-${layer}`,
                    type: 'circle',
                    source: layer,
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#a4ac5e',
                            100,
                            '#a4ac5e',
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40,
                        ],
                    },
                });
                jugalMap.addLayer({
                    id: `unclustered-point-${layer}`,
                    type: 'symbol',
                    source: layer,
                    filter: ['!', ['has', 'point_count']],
                    layout: {
                        'icon-image': ['downcase', ['get', 'CI']],
                        'icon-size': 0.3,
                        'icon-anchor': 'bottom',
                    },
                });
                jugalMap.addLayer({
                    id: `clusters-count-${layer}`,
                    type: 'symbol',
                    source: layer,
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                    },
                });
                categories.map((ci: string) => jugalMap.on('mousemove', `unclustered-point-${ci}`, (e: any) => {
                    if (e) {
                        const { lngLat } = e;
                        const coordinates: number[] = [lngLat.lng, lngLat.lat];
                        const ciName = e.features[0].properties.Name;
                        popup.setLngLat(coordinates).setHTML(
                            `<div style="padding: 5px;border-radius: 5px">
                                    <p>${ciName}</p>
                                </div>
                        `,
                        ).addTo(jugalMap);
                    }
                }));
                categories.map((ci: string) => jugalMap.on('mouseleave', `unclustered-point-${ci}`, () => {
                    jugalMap.getCanvas().style.cursor = '';
                    popup.remove();
                }));
                jugalMap.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                jugalMap.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                jugalMap.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');

                return null;
            });
            // }

            jugalMap.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
            });
            jugalMap.addSource('density', {
                type: 'vector',
                url: mapSources.populationDensity.url,
            });

            jugalMap.addLayer({
                id: 'ward-fill-local',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'fill',
                paint: {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['feature-state', 'value'],
                        1, 'rgb(255,143,13)', 2, 'rgb(255,111,0)',
                        3, 'rgb(255,111,0)', 4, 'rgb(255,143,13)',
                        5, 'rgb(255,111,0)', 6, 'rgb(255,207,142)',
                        7, 'rgb(255,143,13)', 8, 'rgb(207,144,119)',
                        99, 'rgb(255,235,199)',
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0,
                        1,
                    ],
                },
                filter: getWardFilter(3, 24, 23007, wards),
            });

            mapping.forEach((attribute) => {
                jugalMap.setFeatureState(
                    {
                        id: attribute.id,
                        source: 'vizrisk-fills',
                        sourceLayer: mapSources.nepal.layers.ward,
                    },
                    { value: attribute.value },
                );
            });

            jugalMap.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    jugalMap.getCanvas().style.cursor = 'pointer';

                    const { lngLat } = e;
                    const coordinates: LngLat = [lngLat.lng, lngLat.lat];
                    const wardno = e.features[0].properties.title;
                    const details = demographicsData.demographicsData.filter(item => item.name === `Ward ${wardno}`);
                    const totalPop = details[0].MalePop + details[0].FemalePop;
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                            <p> Total Population: ${totalPop}</p>
                        </div>
                        `,
                    ).addTo(jugalMap);
                    if (hoveredWardId) {
                        jugalMap.setFeatureState(
                            {
                                id: hoveredWardId,
                                source: 'vizrisk-fills',
                                sourceLayer: mapSources.nepal.layers.ward,
                            },
                            { hover: false },
                        );
                    }
                    hoveredWardId = e.features[0].id;
                    jugalMap.setFeatureState(
                        {
                            id: hoveredWardId,
                            source: 'vizrisk-fills',
                            sourceLayer: mapSources.nepal.layers.ward,

                        },
                        { hover: true },
                    );
                }
            });

            jugalMap.on('mouseleave', 'ward-fill-local', () => {
                jugalMap.getCanvas().style.cursor = '';
                popup.remove();
                if (hoveredWardId) {
                    jugalMap.setFeatureState(
                        {
                            source: 'vizrisk-fills',
                            id: hoveredWardId,
                            sourceLayer: mapSources.nepal.layers.ward,
                        },
                        { hover: false },

                    );
                    jugalMap.setPaintProperty('ward-fill-local', 'fill-color', populationWardExpression);
                }
                hoveredWardId = null;
            });

            jugalMap.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            jugalMap.moveLayer('jugalHillshadeLayer', 'Population Density');
            jugalMap.moveLayer('WardBoundary');
            jugalMap.moveLayer('Wardnumber');
        });
        const destroyMap = () => {
            jugalMap.remove();
        };

        return destroyMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (map.current && showPopulation && map.current.isStyleLoaded()) {
            console.log('showPopulation in', showPopulation);
            if (showPopulation === 'popdensity') {
                map.current.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            } else {
                map.current.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
            }
        }
    }, [showPopulation]);

    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            categoriesCritical.map((layer) => {
                if (map.current) {
                    map.current.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                    map.current.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                    map.current.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');
                }
                return null;
            });
            const layer = criticalElement;
            if (layer === 'all') {
                categoriesCritical.map((item: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'visible');
                        map.current.setLayoutProperty(`clusters-${item}`, 'visibility', 'visible');
                        map.current.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'visible');
                    }
                    return null;
                });
                map.current.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'visible');
                map.current.setLayoutProperty(`clusters-${layer}`, 'visibility', 'visible');
                map.current.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'visible');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [criticalElement]);

    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            if (rightElement === 0) {
                slideLayers2.map((layer: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'none');
                    }
                    return null;
                });
                slideLayers1.map((layer: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'visible');
                    }
                    return null;
                });
            }
            if (rightElement === 1) {
                slideLayers2.map((layer: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'visible');
                    }
                    return null;
                });
            }
            if (rightElement === 2) {
                map.current.setLayoutProperty('National Park', 'visibility', 'none');

                slideLayers2.map((layer: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'none');
                    }
                    return null;
                });
                slideLayers3.map((l) => {
                    if (map.current) {
                        map.current.setLayoutProperty(l, 'visibility', 'visible');
                    }
                    return null;
                });
                categoriesCritical.map((l) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`unclustered-point-${l}`, 'visibility', 'none');
                        map.current.setLayoutProperty(`clusters-${l}`, 'visibility', 'none');
                        map.current.setLayoutProperty(`clusters-count-${l}`, 'visibility', 'none');
                    }
                    return null;
                });
            }
            if (rightElement === 3) {
                console.log(categoriesCritical);
                categoriesCritical.map((l) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`unclustered-point-${l}`, 'visibility', 'visible');
                        map.current.moveLayer(`unclustered-point-${l}`);

                        map.current.setLayoutProperty(`clusters-${l}`, 'visibility', 'visible');
                        map.current.moveLayer(`clusters-${l}`);

                        map.current.setLayoutProperty(`clusters-count-${l}`, 'visibility', 'visible');
                        map.current.moveLayer(`clusters-count-${l}`);
                    }
                    return null;
                });
                map.current.setLayoutProperty('Population Density', 'visibility', 'none');
            }
            map.current.easeTo({
                pitch: 30,
                zoom,
                duration: 1000,
                center: [lng, lat],
            });
        }
    }, [categoriesCritical, rightElement]);

    return (
        <div>
            <div style={mapStyle} ref={mapContainerRef} />
        </div>
    );
};
export default connect(mapStateToProps)(JugalMap);
