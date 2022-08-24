/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useContext, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { getGeoJSONPH } from '#views/VizRisk/Butwal/utils';
import mapSources from '#constants/mapSources';
import { wardsSelector } from '#selectors';
import { AppState } from '#types';
import { getWardFilter } from '#utils/domain';
import { parseStringToNumber } from '#views/VizRisk/Butwal/Functions';
import DemoGraphicsLegends from '#views/VizRisk/Butwal/Legends/DemographicsLegends';
import { getCommonRasterLayer } from '#views/VizRisk/Butwal/MultiHazardMap/utils';
import FloodHistoryLegends from '#views/VizRisk/Common/Legends/FloodDepthLegend';
import { MainPageDataContext, RatnaNagarMapContext } from '../context';
import PopupOnMapClick from '../Components/PopupOnMapClick';
import styles from './styles.scss';
import LandCoverLegends from '../Components/Legends/LandCoverLegends';
import {
    getCurrentType,
    getHouseHoldDataColor,
    getHouseHoldDataStatus,
    hideMapLayers,
    layoutSwitch,
    showMapLayers,
} from '../utils';
import RangeStatusLegend from '../Components/Legends/RangeStatusLegend';
import FloodHazardLegends from '../Components/Legends/FloodHazardLegends';
import InnundationLegend from '../Components/Legends/InnundationLegend';
import mapImages from './MapImages';
import RadioButton from '../Components/RadioButton';
import { floodHazardLayersArr } from '../expressions';

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}
const mapStateToProps = (state: AppState) => {
    console.log('mapStateToProps-stateValue', state);
    return ({
        wards: wardsSelector(state),
    });
};

let hoveredWardId: number | string | undefined;

const Map = (props: any) => {
    const { mapRef,
        mapCss,
        municipalityId,
        CIData, leftElement,
        ciNameList, setciNameList,
        clickedCiName, unClickedCIName,
        wards,
        rangeNames,
        setRangeNames,
        floodLayer,
        setFloodLayer,
        setNavIdleStatus,
        children } = props;

    const map = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapZoomEffect = useRef<any | undefined>(null);
    const popupRef = useRef<mapboxgl.Popup>();

    const {
        keyValueJsonData,
        householdData,
        rangeValues,
        currentHeaderVal,
        selectFieldValue,
        requiredQuery,
    } = useContext(MainPageDataContext);

    const [opacityFlood, setOpacityFlood] = useState<number | string>(0.25);
    const [innundationOpacity, setInnundationOpacity] = useState<number | string>(0.5);

    const demographicsData = keyValueJsonData && keyValueJsonData.length > 0 && keyValueJsonData.filter(
        (item: any) => item.key === 'vizrisk_ratnanagar_page3_populationdata_301_3_35_35007',
    )[0].value;

    function noop() { }

    const landoverLayers = [
        'farmland-ratnanagar',
        'industrial',
        'forestratnanagar',
        'waterratnanagar',
        'grasslandratnanagar',
        'countourratnanagar'];

    const populationStepColor = ['#ffffd6', '#fed990', '#fe9b2a', '#d95f0e', '#9a3404'];

    const totalPopulationByWard = demographicsData && demographicsData.map((item: { name: any; MalePop: any; FemalePop: any }) => (
        { ward: item.name, totalpop: item.MalePop + item.FemalePop }));

    const arrayValue = totalPopulationByWard && totalPopulationByWard.map((item: { totalpop: any }) => item.totalpop);

    const mainArray = Array.from({ length: arrayValue.length }, (v, i) => i + 1);
    const divider = arrayValue && Math.ceil(arrayValue.length / 5);

    if (arrayValue) {
        arrayValue.sort((a: number, b: number) => a - b);
    }
    const dividedSpecificData = arrayValue && new Array(Math.ceil(arrayValue.length / divider))
        .fill()
        .map(_ => arrayValue.splice(0, divider));
    const intervals: number[] = [];

    const nonEmptyData = dividedSpecificData && dividedSpecificData.filter((r: string | any[]) => r.length > 0);

    if (nonEmptyData) {
        nonEmptyData.map((d: any) => intervals.push(Math.max(...d) === 0
            ? Math.max(...d) + 1 : Math.max(...d)));
    }

    const getColor = (wardId: string | number) => {
        const colorCondition1 = totalPopulationByWard.filter(
            (item: { totalpop: number }) => item.totalpop <= intervals[0],
        );
        const colorCondition2 = totalPopulationByWard.filter(
            (item: { totalpop: number }) => item.totalpop >= intervals[0] && item.totalpop <= intervals[1],
        );
        const colorCondition3 = totalPopulationByWard.filter(
            (item: { totalpop: number }) => item.totalpop >= intervals[1] && item.totalpop <= intervals[2],
        );
        const colorCondition4 = totalPopulationByWard.filter(
            (item: { totalpop: number }) => item.totalpop >= intervals[2] && item.totalpop <= intervals[3],
        );
        const colorCondition5 = totalPopulationByWard.filter(
            (item: { totalpop: number }) => item.totalpop >= intervals[3],
        );

        const filteredWards1 = colorCondition1.map((item: { ward: string | number }) => item.ward);
        const filteredWards2 = colorCondition2.map((item: { ward: string | number }) => item.ward);
        const filteredWards3 = colorCondition3.map((item: { ward: string | number }) => item.ward);
        const filteredWards4 = colorCondition4.map((item: { ward: string | number }) => item.ward);
        const filteredWards5 = colorCondition5.map((item: { ward: string | number }) => item.ward);

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

        const mapping = wards.filter((item: { municipality: any }) => item.municipality === municipalityId).map((item: { title: any }) => ({
            ...item,
            value: Number(item.title),
        }));

        const multihazardMap = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/yilab/cl02b42zi00b414qm2i7xqqex',
            // style: process.env.REACT_APP_VIZRISK_RAJAPUR_FLOOD,

            // center: [
            //     84.51393887409917,
            //     27.619152424687197,
            // ],
            minZoom: 2,
            maxZoom: 22,
        });

        map.current = multihazardMap;

        if (mapRef) {
            mapRef.current = map.current;
        }

        multihazardMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        multihazardMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        mapZoomEffect.current = setTimeout(() => {
            multihazardMap.on('idle', () => {
                setNavIdleStatus(true);
            });
            multihazardMap.fitBounds(
                [84.4655766529013,
                    27.5488495368228,
                    84.5618032266611,
                    27.6813334045862,
                ], { duration: 10000, padding: 20 },
            );
        }, 2000);

        multihazardMap.on('style.load', () => {
            // --------------------------------------SLIDE-3 -> CI layer----------------------------------------
            const ciCategory: any = CIData && [...new Set(CIData.features.map(
                (item: any) => item.properties.Type,
            ))];

            if (setciNameList) {
                setciNameList(ciCategory);
            }

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });

            mapImages.forEach((img) => {
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
            if (ciCategory) {
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
                            'icon-image': layoutSwitch(layer),
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

                    return null;
                });
            }


            // -----------------------------DEMOGRAPHICS LAYER-----------------------------
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
            mapping.forEach((attribute: { id: any; value: any }) => {
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
                    const details = demographicsData.filter((item: { name: string }) => item.name === `Ward ${wardno}`);
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

            /**
             * Innundation Layer
             */

            multihazardMap.addSource('floodInundation', {
                type: 'raster',
                tiles: [getCommonRasterLayer('wfp_ratnanagar_2017')],
                tileSize: 256,
            });

            multihazardMap.addLayer(
                {
                    id: 'inundationLayer',
                    type: 'raster',
                    source: 'floodInundation',
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'raster-opacity': innundationOpacity,
                    },
                },

            );

            floodHazardLayersArr.map((layer) => {
                multihazardMap.addSource(`floodraster${layer.year}`, {
                    type: 'raster',
                    tiles: [getCommonRasterLayer(layer.layerName)],
                    tileSize: 256,
                });
                multihazardMap.addLayer(
                    {
                        id: `raster-flood-${layer.year}`,
                        type: 'raster',
                        source: `floodraster${layer.year}`,
                        layout: {
                            visibility: 'none',
                        },
                        paint: {
                            'raster-opacity': opacityFlood,
                        },
                    },
                );
                return null;
            });

            multihazardMap.setZoom(1);
        });


        const destroyMap = () => {
            multihazardMap.remove();
            clearTimeout(mapZoomEffect.current);
        };

        return destroyMap;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFloodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const opacity = e.target.value;
        setOpacityFlood(opacity);
        floodHazardLayersArr.map((l) => {
            if (map.current) {
                map.current.setPaintProperty(`raster-flood-${l.year}`,
                    'raster-opacity', Number(opacity));
            }
            return null;
        });
    };

    const handleInnundationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const opacity = e.target.value;
        setInnundationOpacity(opacity);
        if (map.current) {
            map.current.setPaintProperty('inundationLayer',
                'raster-opacity', Number(opacity));
        }
        return null;
    };
    console.log('hpuseholdata', householdData);

    useEffect(() => {
        const switchFloodRasters = (floodlayer: string) => {
            if (floodHazardLayersArr && floodHazardLayersArr.length > 0 && map.current) {
                floodHazardLayersArr.map((layer) => {
                    if (map.current) {
                        hideMapLayers(`raster-flood-${layer.year}`, map);
                    }
                    return null;
                });
                showMapLayers(`raster-flood-${floodlayer}`, map);
            }
        };

        if (map.current && floodHazardLayersArr && map.current.isStyleLoaded()) {
            switchFloodRasters(floodLayer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [floodLayer]);

    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            if (map.current) {
                map.current.easeTo({
                    pitch: 35,
                    zoom: 12.1,
                    duration: 1000,
                });
            }
            /**
             * Landcover Layer
             */
            if (leftElement === 1 || leftElement === 3) {
                landoverLayers.map((layer) => {
                    showMapLayers(layer, map);
                    return null;
                });
            } else {
                landoverLayers.map((layer) => {
                    hideMapLayers(layer, map);
                    return null;
                });
            }

            if (leftElement === 2) {
                showMapLayers('ward-fill-local', map);
                hideMapLayers('buildingratnanagar', map);
            } else {
                hideMapLayers('ward-fill-local', map);
                showMapLayers('buildingratnanagar', map);
            }

            if (leftElement === 4) {
                if (map.current) {
                    showMapLayers('inundationLayer', map);
                }
            } else {
                hideMapLayers('inundationLayer', map);
            }
            if (leftElement === 5) {
                showMapLayers(`raster-flood-${floodLayer}`, map);
            } else {
                hideMapLayers(`raster-flood-${floodLayer}`, map);
            }
            if (leftElement > 4 && leftElement < 9) {
                if (map.current) {
                    map.current.setPaintProperty('municipalitygeo', 'fill-color', '#eff1f1');
                    map.current.setPaintProperty('wardgeo', 'line-color', 'white');
                }
            } else {
                map.current.setPaintProperty('municipalitygeo', 'fill-color', '#ffffff');
                map.current.setPaintProperty('wardgeo', 'line-color', '#514d4d');

                /**
                 * Checking the housepoint layer before setting layout property
                 */

                if (map.current.getLayer('household-point')) {
                    hideMapLayers('household-point', map);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leftElement, floodLayer]);


    /**
     * handling critical infrastructures
     */

    useEffect(() => {
        if (leftElement === 3) {
            clickedCiName.map((layerName: string) => {
                showMapLayers(`clusters-${layerName}`, map);
                showMapLayers(`clusters-count-${layerName}`, map);
                showMapLayers(`unclustered-point-${layerName}`, map);

                return null;
            });
            unClickedCIName.map((layerName: string) => {
                hideMapLayers(`clusters-${layerName}`, map);
                hideMapLayers(`clusters-count-${layerName}`, map);
                hideMapLayers(`unclustered-point-${layerName}`, map);

                return null;
            });
        } else if (ciNameList) {
            ciNameList.map((layerName: string) => {
                hideMapLayers(`clusters-${layerName}`, map);
                hideMapLayers(`clusters-count-${layerName}`, map);
                hideMapLayers(`unclustered-point-${layerName}`, map);
                return null;
            });
        }
    }, [ciNameList, clickedCiName, leftElement, unClickedCIName]);

    const sideEffect = !!currentHeaderVal && !!selectFieldValue && requiredQuery[currentHeaderVal][selectFieldValue];
    console.log('sideEffect', sideEffect);


    useEffect(() => {
        if (popupRef.current) {
            popupRef.current.off();
            popupRef.current.remove();
            popupRef.current = undefined;
        }
        const filteredDataByRange: [] = [];
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < rangeValues.length; index++) {
            if (index % 2 !== 0) {
                // eslint-disable-next-line no-continue
                continue;
            }
            const filteredData = householdData.filter(
                item => (item[getCurrentType(leftElement)] / 10)
                    >= rangeValues[index] && (item[getCurrentType(leftElement)] / 10)
                    <= rangeValues[index + 1],
            );
            filteredDataByRange.push(...filteredData);
        }

        const filterdDataFromChart: any = [];

        for (const [index, data] of householdData.entries()) {
            const eachData: {
                filteredMetadata: any;
            } = householdData[index];
            // Ensuring every data is avaialable before filtering
            const checkRightCondition = eachData && !!currentHeaderVal && !!selectFieldValue
                && eachData.filteredMetadata && eachData.filteredMetadata[currentHeaderVal]
                && eachData.filteredMetadata[currentHeaderVal]
                && Object.keys(eachData.filteredMetadata[currentHeaderVal]).includes(Object.keys(requiredQuery[currentHeaderVal])[0])
                && eachData.filteredMetadata[currentHeaderVal][selectFieldValue] === sideEffect;

            if (checkRightCondition) {
                filterdDataFromChart.push(eachData);
            }
        }
        const filterdDataFromChartWithRange: any = [];

        if (sideEffect && rangeValues.length > 0 && filterdDataFromChart.length > 0) {
            for (let index = 0; index < rangeValues.length; index++) {
                if (index % 2 !== 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }
                const filteredData = filterdDataFromChart.filter(
                    (item: { [x: string]: number }) => (item[getCurrentType(leftElement)] / 10)
                        >= rangeValues[index] && (item[getCurrentType(leftElement)] / 10)
                        <= rangeValues[index + 1],
                );
                filterdDataFromChartWithRange.push(...filteredData);
            }
        }

        const dataForFloodReturnPeriod: any = [];
        if (sideEffect && leftElement === 5) {
            for (const [index, data] of householdData.entries()) {
                const eachData: {
                    filteredMetadata: any;
                } = householdData[index];
                // Ensuring every data is avaialable before filtering
                const checkFeildVal = eachData.filteredMetadata && eachData.filteredMetadata[currentHeaderVal]
                    && eachData.filteredMetadata[currentHeaderVal][selectFieldValue];
                if (sideEffect === '5 years' && checkFeildVal === '5 years') {
                    dataForFloodReturnPeriod.push(eachData);
                }
                if (sideEffect === '20 years' && (checkFeildVal === '20 years' || checkFeildVal === '5 years')) {
                    dataForFloodReturnPeriod.push(eachData);
                }
                if (sideEffect === '100 years' && (checkFeildVal === '100 years'
                    || checkFeildVal === '20 years' || checkFeildVal === '5 years')) {
                    dataForFloodReturnPeriod.push(eachData);
                }
            }
        }

        const checkDataForGeoJson = () => {
            switch (true) {
                case leftElement === 5 && dataForFloodReturnPeriod.length > 0:
                    return dataForFloodReturnPeriod;

                case sideEffect && filterdDataFromChart.length > 0
                    && rangeValues.length === 0 && leftElement !== 5:
                    return filterdDataFromChart;

                case sideEffect && filterdDataFromChart.length > 0
                    && rangeValues.length > 0 && leftElement !== 5:
                    return filterdDataFromChartWithRange;

                case rangeValues && rangeValues.length > 0:
                    return filteredDataByRange;

                default:
                    return householdData;
            }
        };

        const requiredGeoJsonDataArr = checkDataForGeoJson();


        const geoJsonMain = {
            type: 'FeatureCollection',
            features: requiredGeoJsonDataArr.map((item: { [x: string]: number; id: any; point: any }) => ({
                type: 'Feature',
                id: item.id,
                geometry: item.point,
                properties: {
                    name: getCurrentType(leftElement),
                    value: item[getCurrentType(leftElement)] / 10,
                    color: getHouseHoldDataColor(item[getCurrentType(leftElement)] / 10),
                    status: getHouseHoldDataStatus(item[getCurrentType(leftElement)] / 10),
                },
            })),
        };

        const popupMain = (e: { lngLat: any; features?: any }) => {
            if (popupRef.current) {
                popupRef.current.off();
                popupRef.current.remove();
                popupRef.current = undefined;
            }
            const { lngLat } = e;
            const coordinates: [number, number] = [lngLat.lng, lngLat.lat];

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            const popupNode = document.createElement('div');


            ReactDOM.render(
                <PopupOnMapClick
                    houseId={e.features && e.features[0].id}
                    data={e.features && e.features[0].properties}
                />, popupNode,
            );
            if (map.current) {
                const householdPopUp = new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setDOMContent(popupNode)
                    .addTo(map.current);

                popupRef.current = householdPopUp;
            }
        };

        if (map && map.current
            && leftElement > 4 && leftElement < 9) {
            if (map.current.getLayer('household-point')) {
                map.current.removeLayer('household-point');
            }

            if (map.current.getSource('householddata')) {
                map.current.removeSource('householddata');
            }

            map.current.addSource('householddata', {
                type: 'geojson',
                data: geoJsonMain,
            });

            map.current.addLayer({
                id: 'household-point',
                type: 'circle',
                source: 'householddata',
                paint: {
                    'circle-color': ['get', 'color'],
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 1.5, 13, 3, 15, 12],
                },
                layout: {
                    visibility: 'visible',
                },
            });


            map.current.on('click', 'household-point', popupMain);
        }
        return () => {
            if (map && map.current) {
                map.current.off('click', 'household-point', popupMain);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leftElement, sideEffect, rangeValues]);

    const mapValue = {
        map: map.current,
    };

    const mapCSSNone = {
        display: 'none',
    };

    return (
        <RatnaNagarMapContext.Provider value={mapValue}>
            <div
                ref={mapContainerRef}
                // className={leftElement === 9
                //     ? styles.mapCSSNone : styles.mapCSS}
                style={leftElement === 9 ? mapCSSNone : mapCss}
            >
                {leftElement === 2 && (
                    <DemoGraphicsLegends
                        demographicsData={demographicsData}
                    />
                )}
                {leftElement === 1 && <LandCoverLegends />}
                {leftElement === 4 && <InnundationLegend />}
                {leftElement > 4 && leftElement < 9 && (
                    <>
                        <RangeStatusLegend
                            rangeNames={rangeNames}
                            setRangeNames={setRangeNames}
                        />
                    </>
                )
                }
                {
                    (leftElement === 5
                        && (
                            <>
                                <div className={styles.sliderContainer}>
                                    <p className={styles.sliderLabelRatna}>
                                        Flood Layer Opacity
                                    </p>
                                    <input
                                        onChange={e => handleFloodChange(e)}
                                        id="slider"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={String(opacityFlood)}
                                        className={styles.slider}
                                    />
                                    <p className={styles.opacityLevel}>
                                        <span>0</span>
                                        <span>0.5</span>
                                        <span>1</span>
                                    </p>
                                    <FloodHistoryLegends />
                                    <FloodHazardLegends setFloodLayer={setFloodLayer} />
                                </div>
                            </>

                        ))}

                {
                    (leftElement === 4
                        && (
                            <>
                                <div className={styles.innundationSliderContainer}>
                                    <p className={styles.sliderLabelRatna}>
                                        Innundation Layer Opacity
                                    </p>
                                    <input
                                        onChange={e => handleInnundationChange(e)}
                                        id="slider"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={String(innundationOpacity)}
                                        className={styles.slider}
                                    />
                                    <p className={styles.opacityLevel}>
                                        <span>0</span>
                                        <span>0.5</span>
                                        <span>1</span>
                                    </p>
                                </div>
                            </>

                        ))}
                {children}
            </div>
        </RatnaNagarMapContext.Provider>

    );
};

export default connect(mapStateToProps)(Map);
