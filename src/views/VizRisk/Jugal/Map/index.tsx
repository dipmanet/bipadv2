/* eslint-disable max-len */
import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import * as geojson from 'geojson';
import { mapSources } from '#constants';
import demographicsData from '../Data/demographicsData';
import expressions from '../Data/expressions';
import * as PageTypes from '#store/atom/page/types';
import { getHillShadeLayer, getGeoJSON } from '#views/VizRisk/Jugal/utils';
import { AppState } from '#store/types';
import MapConstants from '../Data/mapConstants';

import {
    wardsSelector,
} from '#selectors';

import {
    getWardFilter,
} from '#utils/domain';
import styles from './styles.scss';

import Icon from '#rscg/Icon';


interface State{
    lat: number;
    lng: number;
    zoom: number;
    categoriesCritical: string[];
}

interface PropsFromAppState {
    wards: PageTypes.Ward[];
}

interface OwnProps{
    rightElement: number;
    showPopulation: string;
    criticalElement: string;
    CIData: CIData;
    region: Region | undefined;
    mapboxStyle: string;
    zoom: number;
    lng: number;
    lat: number;
    mapCSS: object;
    hillshadeLayerName: string;
    incidentList: CIData;
    handleIncidentChange: (arg: string) => void;
    clickedItem: string;
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
    wards: PageTypes.Ward[];
}

type Props = OwnProps & PropsFromAppState;

type LngLat = any[];
const UNSUPPORTED_BROWSER = !mapboxgl.supported();
const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const {
    layers,
    mapCSS,
    mapboxStyle,
    zoom,
    lng,
    lat,
    hillshadeLayerName,
    incidentsPages,
    ciPages,
    incidentsSliderDelay,
    municipalityId,
} = MapConstants;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    wards: wardsSelector(state),
});

let hoveredWardId: (string | number |undefined);
const { populationWardExpression } = expressions;

function noop() {}
const JugalMap = (props: Props) => {
    const [categoriesCritical, setcategoriesCritical] = useState([]);
    const [incidentsArr, setIncidentsArr] = useState([]);
    const [playState, setPlayState] = useState(false);
    const [incidentYear, setIncidentYear] = useState('0');

    const interval = useRef<Timeout>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const {
        wards,
        rightElement,
        CIData,
        criticalElement,
        showPopulation,
        incidentList,
        handleIncidentChange,
        clickedItem,
    } = props;
    const getIncidentsGeoJSON = (filterBy: string, data: any) => {
        const geoObj = {
            type: 'FeatureCollection',
            features: [],
        };
        const d = data.features.filter(item => item.properties.hazardTitle === filterBy);
        geoObj.features.push(...d);
        return geoObj;
    };

    const handlePlayPause = () => {
        setPlayState(!playState);
    };

    const filterOnMap = (val: string) => {
        const yearInt = new Date(`${2011 + Number(val)}-01-01`).getTime();
        const nextYear = new Date(`${2011 + Number(val) + 1}-01-01`).getTime();
        let filters: T[] = [];
        if (clickedItem === 'all') {
            filters = ['all', ['>', 'incidentOn', yearInt], ['<', 'incidentOn', nextYear]];
        } else {
            filters = ['all',
                ['>', 'incidentOn', yearInt],
                ['<', 'incidentOn', nextYear],
                ['==', 'hazardTitle', clickedItem]];
        }
        const hazardTitle = [...new Set(incidentList.features.map(
            item => item.properties.hazardTitle,
        ))];
        hazardTitle.map((layer) => {
            if (map.current) {
                map.current.setFilter(`incidents-${layer}`, filters);
            }
            return null;
        });
    };

    const handleInputChange = (e) => {
        if (e) {
            clearInterval(interval.current);
            const val = e.target.value;
            setIncidentYear(val);
            handleIncidentChange(val);
            if (map.current && map.current.isStyleLoaded()) {
                filterOnMap(val);
            }
        } else {
            let val: string;
            if (Number(incidentYear) < 10) {
                setIncidentYear((prevTime) => {
                    val = String(Number(prevTime) + 1);
                    return val;
                });
            } else {
                setIncidentYear('0');
                val = '0';
            }
            handleIncidentChange(val);
            if (map.current && map.current.isStyleLoaded()) {
                filterOnMap(val);
            }
        }
    };


    useEffect(() => {
        if (incidentsPages.indexOf(rightElement + 1) !== -1) {
            interval.current = setInterval(() => {
                if (!playState) {
                    handleInputChange(null);
                } else if (interval.current) {
                    clearInterval(interval.current);
                }
            }, incidentsSliderDelay);
        }
        return () => {
            clearInterval(interval.current);
        };
    });

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

        const mapping = wards.filter(item => item.municipality === municipalityId).map(item => ({
            ...item,
            value: Number(item.title),
        }));


        const jugalMap = new mapboxgl.Map({
            container: mapContainer,
            style: mapboxStyle,
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
            jugalMap.addSource('hillshade', {
                type: 'raster',
                tiles: [getHillShadeLayer(hillshadeLayerName)],
                tileSize: 256,
            });

            jugalMap.addLayer(
                {
                    id: 'hillshadeLayer',
                    type: 'raster',
                    source: 'hillshade',
                    layout: {},
                    paint: {
                        'raster-opacity': 0.25,
                    },
                },
            );
            const categories: any = [...new Set(CIData.features.map(
                item => item.properties.CI,
            ))];
            setcategoriesCritical(categories);
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
                        'icon-image': ['downcase', ['get', 'icon']],
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

            jugalMap.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
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
                filter: getWardFilter(3, 24, municipalityId, wards),
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
            jugalMap.moveLayer('hillshadeLayer', 'Population Density');
            jugalMap.moveLayer('WardBoundary');
            jugalMap.moveLayer('Wardnumber');

            const incidents = [...new Set(incidentList.features.map(
                item => item.properties.hazardTitle,
            ))];
            setIncidentsArr(incidents);
            incidents.map((layer) => {
                jugalMap.addSource(layer, {
                    type: 'geojson',
                    data: getIncidentsGeoJSON(layer, incidentList),
                });
                jugalMap.addLayer(
                    {
                        id: `incidents-${layer}`,
                        type: 'circle',
                        source: layer,
                        layout: {
                            visibility: 'none',
                        },
                        paint: {
                            'circle-color': ['get', 'hazardColor'],
                        },
                    },
                );
                jugalMap.addLayer(
                    {
                        id: `incidents-icon-${layer}`,
                        type: 'symbol',
                        source: layer,
                        layout: {
                            'icon-image': ['get', 'hazardIcon'],
                            visibility: 'none',
                        },
                    },
                );

                return null;
            });

            if (rightElement > 0) {
                layers[layers.length - 1].map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'visible');
                    }
                    return null;
                });
                layers[0].map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'none');
                    }
                    return null;
                });
                incidents.map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`incidents-${layer}`, 'visibility', 'visible');
                        map.current.setLayoutProperty(`incidents-icon-${layer}`, 'visibility', 'visible');
                        map.current.moveLayer(`incidents-${layer}`);
                        map.current.moveLayer(`incidents-icon-${layer}`);
                    }
                    return null;
                });
            }
        });
        const destroyMap = () => {
            jugalMap.remove();
        };

        return destroyMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (map.current && showPopulation && map.current.isStyleLoaded()) {
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
            } else {
                map.current.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'visible');
                map.current.setLayoutProperty(`clusters-${layer}`, 'visibility', 'visible');
                map.current.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'visible');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [criticalElement]);

    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            if (rightElement <= layers.length - 1
                && layers[rightElement].length > 0
            ) {
                if (rightElement === 0) {
                    layers[0].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'visible');
                        }
                        return null;
                    });
                    if (layers.length > 1) {
                        layers[1].map((layer) => {
                            if (map.current) {
                                map.current.setLayoutProperty(layer, 'visibility', 'none');
                            }
                            return null;
                        });
                    }
                } else if (rightElement < layers.length - 1 && rightElement > 0) {
                    layers[rightElement - 1].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
                        }
                        return null;
                    });
                    layers[rightElement + 1].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
                        }
                        return null;
                    });
                    layers[rightElement].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'visible');
                        }
                        return null;
                    });
                } else if (rightElement === layers.length - 1 && rightElement > 0) {
                    layers[layers.length - 1].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'visible');
                        }
                        return null;
                    });
                    if (layers.length > 1) {
                        layers[layers.length - 2].map((layer) => {
                            if (map.current) {
                                map.current.setLayoutProperty(layer, 'visibility', 'none');
                            }
                            return null;
                        });
                    }
                }
                map.current.easeTo({
                    pitch: 30,
                    zoom,
                    duration: 1000,
                    center: [lng, lat],
                });
            }

            if (ciPages && ciPages.indexOf(rightElement + 1) !== -1) {
                categoriesCritical.map((item: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`clusters-${item}`, 'visibility', 'visible');
                        map.current.moveLayer(`clusters-${item}`);
                        map.current.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'visible');
                        map.current.moveLayer(`clusters-count-${item}`);
                        map.current.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'visible');
                        map.current.moveLayer(`unclustered-point-${item}`);
                    }
                    return null;
                });
            } else {
                categoriesCritical.map((item: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`clusters-${item}`, 'visibility', 'none');
                        map.current.moveLayer(`clusters-${item}`);
                        map.current.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'none');
                        map.current.moveLayer(`clusters-count-${item}`);
                        map.current.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'none');
                        map.current.moveLayer(`unclustered-point-${item}`);
                    }
                    return null;
                });
            }

            if (incidentsArr.length > 0 && incidentsPages.indexOf(rightElement + 1) !== -1) {
                incidentsArr.map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`incidents-${layer}`, 'visibility', 'visible');
                        map.current.setLayoutProperty(`incidents-icon-${layer}`, 'visibility', 'visible');
                    }
                    return null;
                });
            } else {
                incidentsArr.map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`incidents-${layer}`, 'visibility', 'none');
                        map.current.moveLayer(`incidents-${layer}`);
                        map.current.setLayoutProperty(`incidents-icon-${layer}`, 'visibility', 'none');
                        map.current.moveLayer(`incidents-icon-${layer}`);
                    }
                    return null;
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesCritical, rightElement]);

    useEffect(() => {
        if (incidentsPages.indexOf(rightElement + 1) !== -1) {
            if (clickedItem === 'all') {
                if (map.current && map.current.isStyleLoaded()) {
                    filterOnMap(incidentYear);
                }
                incidentsArr.map((ht) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`incidents-${ht}`, 'visibility', 'visible');
                    }
                    return null;
                });
            } else {
                incidentsArr.map((ht) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`incidents-${ht}`, 'visibility', 'none');
                    }
                    return null;
                });
                map.current.setLayoutProperty(`incidents-${clickedItem}`, 'visibility', 'visible');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickedItem]);


    return (
        <div>
            <div style={mapCSS} ref={mapContainerRef}>
                {
                    incidentsPages.indexOf(rightElement + 1) !== -1
                    && (
                        <div className={styles.incidentsSlider}>
                            <button
                                className={styles.playButton}
                                type="button"
                                onClick={handlePlayPause}
                            >
                                {
                                    playState
                                        ? (
                                            <Icon
                                                name="play"
                                                className={styles.playpauseIcon}
                                            />
                                        ) : (
                                            <Icon
                                                name="pause"
                                                className={styles.playpauseIcon}
                                            />
                                        )}
                            </button>

                            <div className={styles.rangeWrap}>
                                <div
                                    style={{ left: `calc(${Number(incidentYear) * 10}% - ${Number(incidentYear) * 2}px)` }}
                                    className={styles.rangeValue}
                                    id="rangeV"
                                >
                                    {Number(incidentYear) + 2011}
                                </div>
                                <input
                                    onChange={handleInputChange}
                                    id="slider"
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="1"
                                    value={incidentYear}
                                    className={styles.slider}
                                />
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    );
};
export default connect(mapStateToProps)(JugalMap);
