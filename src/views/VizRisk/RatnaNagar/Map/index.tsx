/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import ReactDOM from 'react-dom';
import styles from './styles.scss';
import Education from '#resources/icons/Educationcopy.png';
import Finance from '#resources/icons/bank.png';
import Health from '#resources/icons/healthcopy.png';
import Governance from '#resources/icons/governance.png';
import Culture from '#resources/icons/culture.png';
import Fireengine from '#resources/icons/Fireengine.png';
import Heli from '#resources/icons/Heli.png';
import { getGeoJSONPH } from '#views/VizRisk/Butwal/utils';
import PopupOnMapClick from '../Components/PopupOnMapClick';
import RangeStatusLegend from '../Components/Legends/RangeStatusLegend';

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

let clickedId: string | number | undefined;
const Map = (props: any) => {
    const { CIData, leftElement, ciNameList, setciNameList, clickedCiName, unClickedCIName } = props;

    const map = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapZoomEffect = useRef<any| undefined>(null);

    function noop() {}

    const images = [
        { name: 'education',
            url: Education },
        { name: 'finance',
            url: Finance },
        { name: 'health',
            url: Health },
        { name: 'governance',
            url: Governance },
        { name: 'cultural',
            url: Culture },
        { name: 'fireengine',
            url: Fireengine },
        { name: 'helipad',
            url: Heli },

    ];

    const ratnaNagarVizriskCoordinates = [
        {
            id: 1,
            geometry: { type: 'Point', coordinates: [84.49574, 27.61634] },
            properties: {
                name: 'dummy a',
                color: 'red',
            },
        },
        {
            id: 2,
            geometry: { type: 'Point', coordinates: [84.49735, 27.61905] },
            properties: {
                name: 'dummy b',
                color: 'blue',

            },
        },
        {
            id: 3,
            geometry: { type: 'Point', coordinates: [84.50101, 27.62052] },
            properties: {
                name: 'dummy c',
                color: 'pink',

            },
        },
        {
            id: 4,
            geometry: { type: 'Point', coordinates: [84.50503, 27.61976] },
            properties: {
                name: 'dummy d',
                color: 'orange',
            },
        },
    ];

    const dummyGeojson = {
        type: 'FeatureCollection',
        features: ratnaNagarVizriskCoordinates.map(item => ({
            type: 'Feature',
            id: item.id,
            geometry: item.geometry,
            properties: item.properties,
        })),
    };
    useEffect(() => {
        const { current: mapContainer } = mapContainerRef;
        if (!mapContainer) {
            console.error('No container found.');
            return noop;
        }
        // if (map.current) { return noop; }

        const multihazardMap = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/yilab/cl02b42zi00b414qm2i7xqqex',
            minZoom: 2,
            maxZoom: 22,
        });

        map.current = multihazardMap;

        multihazardMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        multihazardMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        multihazardMap.on('style.load', () => {
            // --------------------------------------SLIDE-3----------------------------------------
            const ciCategory: any = [...new Set(CIData.features.map(
                item => item.properties.Type,
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
                        (error, image) => {
                            if (error) throw error;
                            map.current.addImage(img.name, image);
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

            // Hazard ,exposure dummy data

            multihazardMap.addSource('exposure', {
                type: 'geojson',
                data: dummyGeojson,
                // cluster: true,
                // clusterMaxZoom: 14,
                // clusterRadius: 50,
            });

            multihazardMap.addLayer({
                id: 'exposure-point',
                type: 'circle',
                source: 'exposure',
                // filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': ['get', 'color'],
                    'circle-radius': [
					    'case',
					    ['boolean', ['feature-state', 'clicked'], false],
					    9,
					    6,
                    ],
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                },
                layout: {
                    visibility: 'none',
                },
            });

            multihazardMap.on('click', 'exposure-point', (e) => {
                const { lngLat } = e;
                const coordinates = [lngLat.lng, lngLat.lat];

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                const popupNode = document.createElement('div');


                if (clickedId) {
                    multihazardMap.setFeatureState(
                        { id: clickedId,
                            source: 'exposure' },
                        { clicked: false },
                    );
                }
                clickedId = e.features[0].id;
                multihazardMap.setFeatureState(
                    { id: clickedId,
                        source: 'contactInfo' },
                    { clicked: true },
                );

                ReactDOM.render(
                    <PopupOnMapClick mainType={'Hazard'} />, popupNode,
                );
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setDOMContent(popupNode)
                    .addTo(multihazardMap);
            });

            multihazardMap.setZoom(1);

            mapZoomEffect.current = setTimeout(() => {
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

    console.log('leftElemnt in map is', leftElement, ciNameList);


    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            if (leftElement === 2) {
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

            if (leftElement === 3) {
                if (map.current) {
                    map.current.setLayoutProperty('exposure-point', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('exposure-point', 'visibility', 'none');
            }
        }
    }, [ciNameList, clickedCiName, leftElement, unClickedCIName]);


    return (
        <div ref={mapContainerRef} className={leftElement === 9 ? styles.mapCSSNone : styles.mapCSS}>
            <RangeStatusLegend />
        </div>
    );
};

export default Map;
