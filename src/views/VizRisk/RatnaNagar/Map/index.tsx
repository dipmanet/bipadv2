/* eslint-disable max-len */
import React, { useContext, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Education from '#resources/icons/Educationcopy.png';
import Finance from '#resources/icons/bank.png';
import Health from '#resources/icons/healthcopy.png';
import Governance from '#resources/icons/governance.png';
import Culture from '#resources/icons/culture.png';
import Fireengine from '#resources/icons/Fireengine.png';
import Heli from '#resources/icons/Heli.png';
import { getGeoJSONPH } from '#views/VizRisk/Butwal/utils';
import mapSources from '#constants/mapSources';
import { wardsSelector } from '#selectors';
import { AppState } from '#types';
import { getWardFilter } from '#utils/domain';
import { parseStringToNumber } from '#views/VizRisk/Butwal/Functions';
import DemoGraphicsLegends from '#views/VizRisk/Butwal/Legends/DemographicsLegends';
import { MainPageDataContext } from '../context';
import RangeStatusLegend from '../Components/Legends/RangeStatusLegend';
import PopupOnMapClick from '../Components/PopupOnMapClick';
import styles from './styles.scss';
import LandCoverLegends from '../Components/Legends/LandCoverLegends';
import { getHouseHoldDataColor, getHouseHoldDataStatus } from '../utils';

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}
const mapStateToProps = (state: AppState) => ({
    wards: wardsSelector(state),
});

let clickedId: string | number | undefined;
let hoveredWardId: number | string | undefined;
const Map = (props: any) => {
    const { municipalityId,
        CIData, leftElement,
        ciNameList, setciNameList,
        clickedCiName, unClickedCIName,
        wards, enableNavBtns,
        disableNavBtns } = props;

    const map = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapZoomEffect = useRef<any | undefined>(null);

    const {
        keyValueJsonData,
        householdData,
    } = useContext(MainPageDataContext);

    const demographicsData = keyValueJsonData && keyValueJsonData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page3_populationdata_301_3_35_35007',
    )[0].value;

    function noop() { }

    const images = [
        {
            name: 'education',
            url: Education,
        },
        {
            name: 'finance',
            url: Finance,
        },
        {
            name: 'health',
            url: Health,
        },
        {
            name: 'governance',
            url: Governance,
        },
        {
            name: 'cultural',
            url: Culture,
        },
        {
            name: 'fireengine',
            url: Fireengine,
        },
        {
            name: 'helipad',
            url: Heli,
        },

    ];


    const landoverLayers = ['farmland-ratnanagar', 'industrial', 'forestratnanagar', 'waterratnanagar'];

    const exposureGeoJson = {
        type: 'FeatureCollection',
        features: householdData.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.point,
            properties: {
                value: item.exposure / 10,
                color: getHouseHoldDataColor(item.exposure / 10),
                status: getHouseHoldDataStatus(item.exposure / 10),
            },
        })),
    };

    const hazardGeoJson = {
        type: 'FeatureCollection',
        features: householdData.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.point,
            properties: {
                value: item.hazard / 10,
                color: getHouseHoldDataColor(item.hazard / 10),
                status: getHouseHoldDataStatus(item.hazard / 10),

            },
        })),
    };
    const sensitivityGeoJson = {
        type: 'FeatureCollection',
        features: householdData.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.point,
            properties: {
                value: item.sensitivity / 10,
                color: getHouseHoldDataColor(item.sensitivity / 10),
                status: getHouseHoldDataStatus(item.sensitivity / 10),

            },
        })),
    };
    const adaptiveCapacityGeoJson = {
        type: 'FeatureCollection',
        features: householdData.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.point,
            properties: {
                value: item.adaptiveCapacity / 10,
                color: getHouseHoldDataColor(item.adaptiveCapacity / 10),
                status: getHouseHoldDataStatus(item.adaptiveCapacity / 10),

            },
        })),
    };


    const allHouseHoldDataTypes = [
        { name: 'Exposure', data: exposureGeoJson },
        { name: 'Hazard', data: hazardGeoJson },
        { name: 'Sensitivity', data: sensitivityGeoJson },
        { name: 'AdaptiveCapacity', data: adaptiveCapacityGeoJson },
    ];
    const populationStepColor = ['#ffffd6', '#fed990', '#fe9b2a', '#d95f0e', '#9a3404'];

    const totalPopulationByWard = demographicsData.map(item => (
        { ward: item.name, totalpop: item.MalePop + item.FemalePop }));

    const arrayValue = totalPopulationByWard.map(item => item.totalpop);

    const mainArray = Array.from({ length: arrayValue.length }, (v, i) => i + 1);
    const divider = Math.ceil(arrayValue.length / 5);
    arrayValue.sort((a, b) => a - b);
    const dividedSpecificData = new Array(Math.ceil(arrayValue.length / divider))
        .fill()
        .map(_ => arrayValue.splice(0, divider));
    const intervals: number[] = [];
    const nonEmptyData = dividedSpecificData.filter(r => r.length > 0);
    nonEmptyData.map(d => intervals.push(Math.max(...d) === 0
        ? Math.max(...d) + 1 : Math.max(...d)));


    const getColor = (wardId: string | number) => {
        const colorCondition1 = totalPopulationByWard.filter(
            item => item.totalpop <= intervals[0],
        );
        const colorCondition2 = totalPopulationByWard.filter(
            item => item.totalpop >= intervals[0] && item.totalpop <= intervals[1],
        );
        const colorCondition3 = totalPopulationByWard.filter(
            item => item.totalpop >= intervals[1] && item.totalpop <= intervals[2],
        );
        const colorCondition4 = totalPopulationByWard.filter(
            item => item.totalpop >= intervals[2] && item.totalpop <= intervals[3],
        );
        const colorCondition5 = totalPopulationByWard.filter(
            item => item.totalpop >= intervals[3],
        );

        const filteredWards1 = colorCondition1.map(item => item.ward);
        const filteredWards2 = colorCondition2.map(item => item.ward);
        const filteredWards3 = colorCondition3.map(item => item.ward);
        const filteredWards4 = colorCondition4.map(item => item.ward);
        const filteredWards5 = colorCondition5.map(item => item.ward);

        if (filteredWards1.includes(`Ward ${wardId}`)) {
            return populationStepColor[0];
        } if (filteredWards2.includes(`Ward ${wardId}`)) {
            return populationStepColor[1];
        } if (filteredWards3.includes(`Ward ${wardId}`)) {
            return populationStepColor[2];
        } if (filteredWards4.includes(`Ward ${wardId}`)) {
            return populationStepColor[3];
        } if (filteredWards5.includes(`Ward ${wardId}`)) {
            return populationStepColor[4];
        }
        return null;
    };


    const fillPaint = () => {
        const colorArray = mainArray.map(item => [item, getColor(item)]);


        const saveArray = [];

        for (let i = 0; i < colorArray.length; i += 1) {
            const newArray = [...colorArray[i]];
            saveArray.push(...newArray);
        }
        return {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['feature-state', 'value'],
                ...saveArray,
            ],
            'fill-opacity':
                [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    1,
                ],
        };
    };

    useEffect(() => {
        const { current: mapContainer } = mapContainerRef;
        if (!mapContainer) {
            console.error('No container found.');
            return noop;
        }
        // if (map.current) { return noop; }

        const mapping = wards.filter(item => item.municipality === municipalityId).map(item => ({
            ...item,
            value: Number(item.title),
        }));

        const multihazardMap = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/yilab/cl02b42zi00b414qm2i7xqqex',
            minZoom: 2,
            maxZoom: 22,
        });

        map.current = multihazardMap;

        multihazardMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        multihazardMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        multihazardMap.on('idle', () => {
            if (leftElement === 0) {
                enableNavBtns('Right');
            } else if (leftElement === 9) {
                enableNavBtns('Left');
            }
            enableNavBtns('both');
        });


        multihazardMap.on('style.load', () => {
            // --------------------------------------SLIDE-3----------------------------------------
            const ciCategory: any = [...new Set(CIData.features.map(
                (item: any) => item.properties.Type,
            ))];
            setciNameList(ciCategory);
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
            // setciCategoryCritical(ciCategory);


            images.forEach((img) => {
                if (map.current) {
                    map.current.loadImage(
                        img.url,
                        (error: any, image: any) => {
                            if (error) throw error;
                            if (map.current) {
                                map.current.addImage(img.name, image);
                            }
                        },
                    );
                }
            });

            ciCategory.map((layer: string) => {
                multihazardMap.addSource(layer, {
                    type: 'geojson',
                    data: getGeoJSONPH(layer, CIData),
                    cluster: true,
                    clusterRadius: 50,
                });


                multihazardMap.addLayer({
                    id: `clusters-${layer}`,
                    type: 'circle',
                    source: layer,
                    filter: ['has', 'point_count'],
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#3da1a6',
                            100,
                            '#3da1a6',
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

                multihazardMap.addLayer({
                    id: `clusters-count-${layer}`,
                    type: 'symbol',
                    source: layer,
                    // paint: { 'circle-color': '#d1e7e8' },
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                        visibility: 'none',
                    },
                });
                multihazardMap.addLayer({
                    id: `unclustered-point-${layer}`,
                    type: 'symbol',
                    source: layer,
                    filter: ['!', ['has', 'point_count']],
                    layout: {

                        'icon-image': (layer === 'education' && 'education')
                            || (layer === 'finance' && 'finance')
                            || (layer === 'health' && 'health')
                            || (layer === 'governance' && 'governance')
                            || (layer === 'cultural' && 'cultural')
                            || (layer === 'fireengine' && 'fireengine')
                            || (layer === 'helipad' && 'helipad'),
                        'icon-size': 0.08,
                        'icon-anchor': 'bottom',
                        visibility: 'none',

                    },
                });


                ciCategory.map((ci: string) => multihazardMap.on('mousemove', `unclustered-point-${ci}`, (e: any) => {
                    if (e) {
                        const { lngLat } = e;
                        const coordinates: number[] = [lngLat.lng, lngLat.lat];
                        const ciName = e.features[0].properties.Name;
                        popup.setLngLat(coordinates).setHTML(
                            `<div style="padding: 5px;border-radius: 5px">
                                    <p>${ciName}</p>
                                </div>
                        `,
                        ).addTo(multihazardMap);
                    }
                }));

                ciCategory.map((ci: string) => multihazardMap.on('mouseleave', `unclustered-point-${ci}`, () => {
                    multihazardMap.getCanvas().style.cursor = '';
                    popup.remove();
                }));
                multihazardMap.moveLayer(`unclustered-point-${layer}`);
                multihazardMap.moveLayer(`clusters-${layer}`);
                multihazardMap.moveLayer(`clusters-count-${layer}`);

                return null;
            });

            // -----------------------------DEMOFRAPHICS LAYER-----------------------------
            multihazardMap.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
            });

            multihazardMap.addLayer({
                id: 'ward-fill-local',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'fill',

                paint: fillPaint(),
                layout: {
                    visibility: 'none',

                },
                filter: getWardFilter(3, 35, municipalityId, wards),
            }, 'wardgeo');
            mapping.forEach((attribute) => {
                multihazardMap.setFeatureState(
                    {
                        id: attribute.id,
                        source: 'vizrisk-fills',
                        sourceLayer: mapSources.nepal.layers.ward,
                    },
                    { value: attribute.value },
                );
            });
            multihazardMap.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features && e.features.length > 0) {
                    multihazardMap.getCanvas().style.cursor = 'pointer';
                    const { lngLat } = e;

                    const coordinates: [number, number] = [lngLat.lng, lngLat.lat];
                    const wardno = e.features[0].properties && e.features[0].properties.title;
                    const details = demographicsData.filter(item => item.name === `Ward ${wardno}`);
                    const totalPop = details[0].MalePop + details[0].FemalePop;
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                            <p>${details[0].name} Total Population: ${parseStringToNumber(totalPop)}</p>
                        </div>
                        `,
                    ).addTo(multihazardMap);
                    if (hoveredWardId) {
                        multihazardMap.setFeatureState(
                            {
                                id: hoveredWardId,
                                source: 'vizrisk-fills',
                                sourceLayer: mapSources.nepal.layers.ward,
                            },
                            { hover: false },
                        );
                    }
                    hoveredWardId = e.features[0].id;
                    multihazardMap.setFeatureState(
                        {
                            id: hoveredWardId,
                            source: 'vizrisk-fills',
                            sourceLayer: mapSources.nepal.layers.ward,

                        },
                        { hover: true },
                    );
                }
            });
            multihazardMap.on('mouseleave', 'ward-fill-local', () => {
                multihazardMap.getCanvas().style.cursor = '';
                popup.remove();
                if (hoveredWardId) {
                    multihazardMap.setFeatureState(
                        {
                            source: 'vizrisk-fills',
                            id: hoveredWardId,
                            sourceLayer: mapSources.nepal.layers.ward,
                        },
                        { hover: false },

                    );
                }
                hoveredWardId = undefined;
            });

            // Hazard ,exposure dummy data
            allHouseHoldDataTypes.map((household) => {
                multihazardMap.addSource(`household-${household.name}`, {
                    type: 'geojson',
                    data: household.data,
                    // cluster: true,
                    // clusterRadius: 50,
                });

                multihazardMap.addLayer({
                    id: `household-point-${household.name}`,
                    type: 'circle',
                    source: `household-${household.name}`,

                    // filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': ['get', 'color'],
                        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 1.5, 15, 6],
                    },
                    layout: {
                        visibility: 'none',
                    },
                });

                multihazardMap.on('click', `household-point-${household.name}`, (e) => {
                    e.preventDefault();
                    const { lngLat } = e;
                    const coordinates: [number, number] = [lngLat.lng, lngLat.lat];

                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    const popupNode = document.createElement('div');


                    if (clickedId) {
                        multihazardMap.setFeatureState(
                            {
                                id: clickedId,
                                source: 'exposure',
                            },
                            { clicked: false },
                        );
                    }
                    if (e.features) {
                        clickedId = e.features[0].id;
                    }
                    multihazardMap.setFeatureState(
                        {
                            id: clickedId,
                            source: 'exposure',
                        },
                        { clicked: true },
                    );


                    ReactDOM.render(
                        <PopupOnMapClick
                            mainType={household.name}
                            data={e.features[0].properties}
                        />, popupNode,
                    );
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setDOMContent(popupNode)
                        .addTo(multihazardMap);
                });

                multihazardMap.on('click', (e) => {
                    if (e.defaultPrevented === false) {
                        multihazardMap.setFeatureState(
                            {
                                id: clickedId,
                                source: 'exposure',
                            },
                            { clicked: false },
                        );
                    }
                });
                return null;
            });


            multihazardMap.setZoom(1);

            mapZoomEffect.current = setTimeout(() => {
                disableNavBtns('both');
                multihazardMap.easeTo({
                    pitch: 25,
                    center: [
                        84.51393887409917,
                        27.619152424687197,
                    ],
                    zoom: 11.7,
                    duration: 8000,
                });
            }, 4000);
        });


        const destroyMap = () => {
            multihazardMap.remove();
            clearTimeout(mapZoomEffect.current);
        };

        return destroyMap;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            // -------------------------------------LANDCOVER LAYER-------------------------------
            if (leftElement === 1 || leftElement === 3) {
                landoverLayers.map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'visible');
                    }
                    return null;
                });
            } else {
                landoverLayers.map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'none');
                    }
                    return null;
                });
            }

            if (leftElement === 2) {
                if (!map.current) return;
                map.current.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
            } else {
                map.current.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            }
            if (leftElement === 3) {
                clickedCiName.map((layerName: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`clusters-${layerName}`, 'visibility', 'visible');
                        map.current.moveLayer(`clusters-${layerName}`);

                        map.current.setLayoutProperty(`clusters-count-${layerName}`, 'visibility', 'visible');
                        map.current.moveLayer(`clusters-count-${layerName}`);

                        map.current.setLayoutProperty(`unclustered-point-${layerName}`, 'visibility', 'visible');
                        map.current.moveLayer(`unclustered-point-${layerName}`);
                    }
                    return null;
                });
                unClickedCIName.map((layerName: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`clusters-${layerName}`, 'visibility', 'none');
                        map.current.moveLayer(`clusters-${layerName}`);

                        map.current.setLayoutProperty(`clusters-count-${layerName}`, 'visibility', 'none');
                        map.current.moveLayer(`clusters-count-${layerName}`);

                        map.current.setLayoutProperty(`unclustered-point-${layerName}`, 'visibility', 'none');
                        map.current.moveLayer(`unclustered-point-${layerName}`);
                    }
                    return null;
                });
            } else {
                ciNameList.map((layerName: string) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`clusters-${layerName}`, 'visibility', 'none');
                        map.current.moveLayer(`clusters-${layerName}`);

                        map.current.setLayoutProperty(`clusters-count-${layerName}`, 'visibility', 'none');
                        map.current.moveLayer(`clusters-count-${layerName}`);

                        map.current.setLayoutProperty(`unclustered-point-${layerName}`, 'visibility', 'none');
                        map.current.moveLayer(`unclustered-point-${layerName}`);
                    }
                    return null;
                });
            }

            if (leftElement > 3 && leftElement < 9) {
                if (map.current) {
                    map.current.setLayoutProperty('municipalitygeo', 'visibility', 'none');
                    map.current.setPaintProperty('wardgeo', 'line-color', 'white');
                    map.current.setPaintProperty('wardname', 'text-color', '#ede9dd');
                }
            } else {
                map.current.setLayoutProperty('municipalitygeo', 'visibility', 'visible');
                map.current.setPaintProperty('wardgeo', 'line-color', '#514d4d');
                map.current.setPaintProperty('wardname', 'text-color', '#000000');
            }


            if (leftElement === 4) {
                if (map.current) {
                    map.current.setLayoutProperty('household-point-Exposure', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('household-point-Exposure', 'visibility', 'none');
            }
            if (leftElement === 6) {
                if (map.current) {
                    map.current.setLayoutProperty('household-point-Hazard', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('household-point-Hazard', 'visibility', 'none');
            }
            if (leftElement === 7) {
                if (map.current) {
                    map.current.setLayoutProperty('household-point-Sensitivity', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('household-point-Sensitivity', 'visibility', 'none');
            }
            if (leftElement === 8) {
                if (map.current) {
                    map.current.setLayoutProperty('household-point-AdaptiveCapacity', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('household-point-AdaptiveCapacity', 'visibility', 'none');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ciNameList, clickedCiName,
        landoverLayers, leftElement, unClickedCIName]);


    return (
        <div
            ref={mapContainerRef}
            className={leftElement === 9
                ? styles.mapCSSNone : styles.mapCSS}
        >
            {leftElement > 3 && leftElement < 9 && <RangeStatusLegend />}
            {leftElement === 2 && <DemoGraphicsLegends demographicsData={demographicsData} />}
            {leftElement === 1 && <LandCoverLegends />}
        </div>
    );
};

export default connect(mapStateToProps)(Map);
