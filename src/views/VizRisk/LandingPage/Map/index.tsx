import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';

import { AppState } from '#types';
import { mapSources, mapStyles } from '#constants';
import { hideMapLayers, showMapLayers } from '#views/VizRisk/RatnaNagar/utils';
import { provincesSelector, municipalitiesSelector } from '#selectors';
import { vzRiskMunicipalData, vzRiskProvinceData } from '../VzRiskData';

import styles from './styles.scss';
import { checkIndicator, checkType, filterDataWithIndicator, vizRiskType } from '../utils';

const mapStateToProps = (state: AppState) => ({
    provinces: provincesSelector(state),
    municipalities: municipalitiesSelector(state),

});


const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;

if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}
interface Props {
    vzLabel: string;
    provinces: any;
    municipalities: any;
    selctFieldCurrentValue: string;
    clickedVizrisk: string;
    setClickedVizrisk: React.Dispatch<React.SetStateAction<string>>;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    searchBbox: any;
}

let hoverId: number | undefined;

const Map = (props: Props) => {
    const mapContainerRef = useRef<React.MutableRefObject<HTMLElement | undefined>>();
    const updateMap = useRef<mapboxgl.Map>(null);

    const { vzLabel,
        provinces,
        municipalities,
        selctFieldCurrentValue,
        clickedVizrisk,
        setClickedVizrisk,
        setShowMenu,
        searchBbox } = props;

    function noop() { }

    useEffect(() => {
        const { current: mapContainer } = mapContainerRef;
        if (!mapContainer) {
            return noop;
        }
        const provinceIdarray = vzRiskProvinceData.map(item => item.id);

        const allData = provinces.map((data: any) => ({
            ...data,
            value: !!provinceIdarray.includes(data.id),
            indicator: checkIndicator(vzRiskProvinceData, data),
        }));
        const array = vzRiskMunicipalData.map(item => item.id);

        const allDataMunipal = municipalities.map((data: any) => ({
            ...data,
            value: !!array.includes(data.id),
            indicator: checkIndicator(vzRiskMunicipalData, data),
        }));

        const allAvialableVizrisks = [...vzRiskMunicipalData, ...vzRiskProvinceData]
            .map(item => item.id);


        const landingPageMap = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/yilab/cl4npfhi4002x14l5jf8bn4d3',
            logoPosition: 'top-left',
            minZoom: 5,
            // makes initial map center to Nepal
            // center: {
            //     lng: 84.394226,
            //     lat: 28.384151,
            // },
            zoom: 7,
        });

        if (updateMap) {
            updateMap.current = landingPageMap;
        }
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'popup',
        });
        landingPageMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        landingPageMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        landingPageMap.on('style.load', () => {
            landingPageMap.resize();
            landingPageMap.fitBounds([[79.161987, 25.923467], [89.626465, 30.789037]],
                { duration: 0 });
            landingPageMap.addSource('base-outline', {
                type: 'vector',
                url: mapSources.nepal.url,
            });
            allData.forEach((attribute: any) => {
                landingPageMap.setFeatureState({
                    id: attribute.id,
                    source: 'base-outline',
                    sourceLayer: mapSources.nepal.layers.province,
                }, {
                    indicator: attribute.indicator,
                    color: checkType(attribute.indicator),
                });
            });

            landingPageMap.addLayer({
                id: 'province-vizrisk',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.province,
                type: 'fill',
                paint: {
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.8,
                        1,
                    ],
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'value'], 'true'],
                        'red', 'black',
                    ],
                },
                layout: {
                    visibility: 'none',
                },
            });

            landingPageMap.addLayer({
                id: 'province-vizrisk-extrusion',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.province,
                type: 'fill-extrusion',
                paint: {
                    'fill-extrusion-color': ['feature-state', 'color'],

                    // Get `fill-extrusion-height` from the source `height` property.
                    'fill-extrusion-height': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        10000,
                        0,
                    ],
                    // Get `fill-extrusion-base` from the source `base_height` property.
                    'fill-extrusion-base': 15,

                    // Make extrusions slightly opaque to see through indoor walls.
                    // 'fill-extrusion-opacity': [
                    //     'case',
                    //     ['boolean', ['feature-state', 'hover'], false],
                    //     0.8,
                    //     1,
                    // ],
                },
                layout: {
                    visibility: 'visible',
                },

            });

            allDataMunipal.forEach((attribute: any) => {
                landingPageMap.setFeatureState({
                    id: attribute.id,
                    source: 'base-outline',
                    sourceLayer: mapSources.nepal.layers.municipality,
                }, {
                    indicator: attribute.indicator,
                    color: checkType(attribute.indicator),
                });
            });

            landingPageMap.addLayer({
                id: 'municipality-vizrisk',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.municipality,
                type: 'fill',
                paint: {
                    'fill-opacity':
                        [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            0.8,
                            1,
                        ],
                    'fill-color': ['feature-state', 'color'],
                },

            });
            landingPageMap.addLayer({
                id: 'municipality-vizrisk-extrusion',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.municipality,
                type: 'fill-extrusion',
                paint: {
                    'fill-extrusion-color': ['feature-state', 'color'],

                    // Get `fill-extrusion-height` from the source `height` property.
                    'fill-extrusion-height': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        10000,
                        0,
                    ],

                    // Get `fill-extrusion-base` from the source `base_height` property.
                    'fill-extrusion-base': 0,

                    // Make extrusions slightly opaque to see through indoor walls.
                    // 'fill-extrusion-opacity': [
                    //     'case',
                    //     ['boolean', ['feature-state', 'hover'], false],
                    //     0.8,
                    //     1,
                    // ],
                },
                layout: {
                    visibility: 'visible',
                },

            });

            landingPageMap.on('click', 'municipality-vizrisk', (e) => {
                if (e && e.features && e.features[0]) {
                    const name = e.features[0].properties.title;

                    if (allAvialableVizrisks.includes(e.features[0].id)) {
                        setClickedVizrisk(name);
                        setShowMenu(false);
                    }
                }
            });
            landingPageMap.on('mousemove', 'municipality-vizrisk', (e) => {
                landingPageMap.getCanvas().style.cursor = 'pointer';
                if (e && e.features && e.features[0] && e.features[0].properties) {
                    const { lngLat } = e;
                    const coordinates: number[] = [lngLat.lng, lngLat.lat];
                    const name = e.features[0].properties.title;
                    const type = e.features[0].state.indicator;


                    popup.setLngLat(coordinates).setHTML(
                        `<div style="display : flex; flex-direction:column ;
                        align-items : center ;padding: 5px;border-radius: 1px;background-color : rgb(3, 33, 46);">
                        <p style="margin:0px;padding:5px;color:cyan;text-transform: uppercase;font-weight:bold;">${name}</p>
                        <p style="margin:0px;padding:5px;color:white;font-weight:bold;">${vizRiskType(type)}</p>
                         </div>
        `,
                    ).addTo(landingPageMap);
                    if (hoverId) {
                        landingPageMap.setFeatureState(
                            {
                                id: hoverId,
                                source: 'base-outline',
                                sourceLayer: mapSources.nepal.layers.municipality,
                            },
                            { hover: false },
                        );
                    }
                    hoverId = e.features[0].id;
                    landingPageMap.setFeatureState(
                        {
                            id: hoverId,
                            source: 'base-outline',
                            sourceLayer: mapSources.nepal.layers.municipality,

                        },
                        { hover: true },
                    );
                }
            });
            landingPageMap.on('mouseleave', 'municipality-vizrisk', (e) => {
                landingPageMap.getCanvas().style.cursor = '';
                if (hoverId) {
                    landingPageMap.setFeatureState(
                        {
                            source: 'base-outline',
                            id: hoverId,
                            sourceLayer: mapSources.nepal.layers.municipality,
                        },
                        { hover: false },

                    );
                }
                hoverId = undefined;
                popup.remove();
            });
            landingPageMap.on('click', 'province-vizrisk', (e) => {
                if (e && e.features && e.features[0]) {
                    const name = e.features[0].properties.title;
                    if (allAvialableVizrisks.includes(e.features[0].id)) {
                        setClickedVizrisk(name);
                        setShowMenu(false);
                    }
                }
            });
            landingPageMap.on('mousemove', 'province-vizrisk', (e) => {
                landingPageMap.getCanvas().style.cursor = 'pointer';
                if (e && e.features && e.features[0] && e.features[0].properties) {
                    const { lngLat } = e;
                    const coordinates: number[] = [lngLat.lng, lngLat.lat];
                    const name = e.features[0].properties.title;
                    const type = e.features[0].state.indicator;

                    popup.setLngLat(coordinates).setHTML(
                        `<div style="display : flex; flex-direction:column ;
                        align-items : center ;padding: 5px;border-radius: 1px;background-color : rgb(3, 33, 46);">
                        <p style="margin:0px;padding:5px;color:cyan;text-transform: uppercase;font-weight:bold;">${name}</p>
                        <p style="margin:0px;padding:5px;color:white;font-weight:bold;">${vizRiskType(type)}</p>
                         </div>
        `,
                    ).addTo(landingPageMap);
                    if (hoverId) {
                        landingPageMap.setFeatureState(
                            {
                                id: hoverId,
                                source: 'base-outline',
                                sourceLayer: mapSources.nepal.layers.province,
                            },
                            { hover: false },
                        );
                    }
                    hoverId = e.features[0].id;
                    landingPageMap.setFeatureState(
                        {
                            id: hoverId,
                            source: 'base-outline',
                            sourceLayer: mapSources.nepal.layers.province,

                        },
                        { hover: true },
                    );
                }
            });
            landingPageMap.on('mouseleave', 'province-vizrisk', (e) => {
                landingPageMap.getCanvas().style.cursor = '';
                if (hoverId) {
                    landingPageMap.setFeatureState(
                        {
                            source: 'base-outline',
                            id: hoverId,
                            sourceLayer: mapSources.nepal.layers.province,
                        },
                        { hover: false },

                    );
                }
                hoverId = undefined;
                popup.remove();
            });
            allData.forEach((attribute: any) => {
                landingPageMap.setFeatureState({
                    id: attribute.id,
                    source: 'base-outline',
                    sourceLayer: mapSources.nepal.layers.province,
                }, { value: attribute.value, indicator: attribute.indicator });
            });


            landingPageMap.addLayer({
                id: 'province-outline',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.province,
                type: 'line',
                paint: mapStyles.province.outline,
                layout: {
                    visibility: 'none',
                },
            });
            landingPageMap.addLayer({
                id: 'municipality-outline',
                source: 'base-outline',
                'source-layer': mapSources.nepal.layers.municipality,
                type: 'line',
                paint: {
                    // 'line-color': '#72b6ac',
                    'line-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        '#C1292E',
                        '#C1292E',
                    ],
                    'line-width': 1,
                },
                layout: {
                    visibility: 'visible',
                },
            });
        });


        return () => landingPageMap.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (searchBbox.length > 0) {
            if (updateMap.current) {
                updateMap.current.fitBounds(searchBbox, { padding: 20 });
            }
        }
    }, [searchBbox]);


    useEffect(() => {
        const array = vzRiskMunicipalData.map(item => item.id);

        const allDataMunipal = municipalities.map((data: any) => ({
            ...data,
            value: !!array.includes(data.id),
            indicator: checkIndicator(vzRiskMunicipalData, data),
        }));

        const floodId = filterDataWithIndicator(allDataMunipal, 6);
        const landSlideId = filterDataWithIndicator(allDataMunipal, 12);
        const multiHazardId = filterDataWithIndicator(allDataMunipal, 14);
        const provinceIdarray = vzRiskProvinceData.map(item => item.id);

        if (updateMap.current && updateMap.current.isStyleLoaded()) {
            if (vzLabel === 'province') {
                showMapLayers('province-outline', updateMap);
                showMapLayers('province-vizrisk', updateMap);
                showMapLayers('province-vizrisk-extrusion', updateMap);
                updateMap.current.setFilter('province-vizrisk-extrusion',
                    ['match', ['id'], provinceIdarray, true, false]);
            } else {
                hideMapLayers('province-outline', updateMap);
                hideMapLayers('province-vizrisk', updateMap);
                hideMapLayers('province-vizrisk-extrusion', updateMap);
            }

            if (vzLabel === 'municipality') {
                showMapLayers('municipality-outline', updateMap);
                showMapLayers('municipality-vizrisk', updateMap);
                showMapLayers('municipality-vizrisk-extrusion', updateMap);
                switch (selctFieldCurrentValue) {
                    case 'Flood Exposure':
                        updateMap.current.setFilter('municipality-vizrisk',
                            ['match', ['id'], floodId, true, false]);
                        updateMap.current.setFilter('municipality-vizrisk-extrusion',
                            ['match', ['id'], floodId, true, false]);
                        break;
                    case 'Landslide Exposure':
                        updateMap.current.setFilter('municipality-vizrisk',
                            ['match', ['id'], landSlideId, true, false]);
                        updateMap.current.setFilter('municipality-vizrisk-extrusion',
                            ['match', ['id'], landSlideId, true, false]);
                        break;
                    case 'Multi-hazard Exposure':
                        updateMap.current.setFilter('municipality-vizrisk',
                            ['match', ['id'], multiHazardId, true, false]);
                        updateMap.current.setFilter('municipality-vizrisk-extrusion',
                            ['match', ['id'], multiHazardId, true, false]);
                        break;

                    default:
                        updateMap.current.setFilter('municipality-vizrisk',
                            ['match', ['id'], [...floodId, ...landSlideId, ...multiHazardId], true, false]);
                        break;
                }
            } else {
                hideMapLayers('municipality-outline', updateMap);
                hideMapLayers('municipality-vizrisk', updateMap);
                hideMapLayers('municipality-vizrisk-extrusion', updateMap);
            }
        }
    }, [municipalities, selctFieldCurrentValue, vzLabel]);

    return (
        <div
            style={{ zIndex: clickedVizrisk && -1 }}
            ref={mapContainerRef}
            className={styles.landingPageMap}
        />
    );
};

export default connect(mapStateToProps)(Map);
