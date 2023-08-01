/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Redux, { compose } from 'redux';
import Loader from 'react-loader';
import mapboxgl from 'mapbox-gl';

// import { ClientAttributes, createConnectedRequestCoordinator, createRequestClient, methods } from '#request';

import ReactDOM from 'react-dom';
import {
    setIbfPageAction,
} from '#actionCreators';

import {
    ibfPageSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    userSelector,
} from '#selectors';

import { AppState } from '#types';
import { mapSources } from '#constants';
import { District, Municipality, Ward } from '#store/atom/page/types';
import { User } from '#store/atom/auth/types';
import style from './styles.scss';
import LegendFilters from '../Constants/LegendFilters';
import { markerLocations, getCircleProp, getPaint, getScore, getRasterLayer } from '../Constants/MapExpressions';
import { getBboxFromDistrictArray, getDistrictArray } from '../utils';
import { PropsFromDispatch, PropsFromState } from '..';
import { getRequest } from '../Requests/apiCalls';
import HouseholdPopup from '../Components/HouseholdPopup';

interface Coordinates {
    lat: number;
    lng: number;
}

interface OwnProps {
    isSelectionActive: boolean;
    setCoordinates: (coordinates: Coordinates) => void;
    setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getEditHouseValue: () => void;
}
interface PropsFromMapState extends PropsFromState {
    district: District[];
    municipality: Municipality[];
    ward: Ward[];
    user: User;
}
interface Params {
    setPending: React.Dispatch<React.SetStateAction<boolean>>;
    municipality: string;
}

type ReduxProps = OwnProps & PropsFromDispatch & PropsFromMapState;

type Props = ReduxProps

const mapStateToProps = (state: AppState): PropsFromMapState => ({
    ibfPage: ibfPageSelector(state),
    district: districtsSelector(state),
    municipality: municipalitiesSelector(state),
    ward: wardsSelector(state),
    user: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
});

const Map = (props: Props) => {
    const mapRef = useRef<mapboxgl.Map | undefined>(undefined);
    const mapContainerRef = useRef(null);
    const markerRef = useRef<mapboxgl.Marker | undefined>(undefined);
    const popupHouseRef = useRef<mapboxgl.Popup | undefined>(undefined);

    const {
        ibfPage: { stations,
            selectedStation,
            leadTime,
            returnPeriod,
            stationDetail,
            filter,
            householdJson,
            householdDistrictAverage,
            showHouseHold,
            selectedIndicator,
            selectedLegend },
        user,
        ward,
        district,
        municipality,
        isSelectionActive,
        setCoordinates,
        setFormOpen,
        getEditHouseValue,
    } = props;

    // const [pending, setPending] = useState(false);
    // const [mun, setMun] = useState();


    // const rasterLayersYears = [2, 5, 20];

    const setSelectedStation = (station) => {
        props.setIbfPage({ selectedStation: station });
    };

    const getTitle = (level, id) => {
        if (level === 'district') {
            return district.filter(item => item.id === Number(id))[0].title;
        }
        if (level === 'municipality') {
            return municipality.filter(item => item.id === Number(id))[0].title;
        }

        return null;
    };

    const getMunicipalityBbox = () => {
        // let bboxArr = [];
        // if (filter.municipality.length > 1 || filter.municipality.length === 0) {
        //     if (filter.district) {
        //         const { bbox } = district.filter(item => item.id === Number(filter.district))[0];
        //         bboxArr = bbox;
        //         return bboxArr;
        //     }
        // }
        // if (filter.municipality.length > 0) {
        //     const { bbox } = municipality.filter(item => item.id === Number(filter.municipality[0].id))[0];
        //     bboxArr = bbox;
        // }
        // return bboxArr;
        const { bbox } = municipality.filter(item => item.id === Number(filter.municipality))[0];
        return bbox;
    };

    // let interval;
    // 1st
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/yilab/ckr1mucvr7q3f1ao91578bqcq',
            preserveDrawingBuffer: true,
            center: [84.394226, 28.1],
            zoom: 6.8,
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        mapRef.current = map;

        map.on('load', () => {
            markerLocations.map((img) => {
                map.loadImage(
                    img.image,
                    (error: any, image: any) => {
                        if (error) throw error;
                        map.addImage(img.name, image);
                    },
                );
                return null;
            });

            map.addSource('boundary-layer', {
                type: 'vector',
                url: mapSources.nepal.url,
            });

            map.addSource('centroid', {
                type: 'vector',
                url: mapSources.nepalCentroid.url,
            });

            if (mapRef.current) {
                mapRef.current.addSource('ibfRaster20', {
                    type: 'raster',
                    tiles: [getRasterLayer(20)],
                    tileSize: 256,
                });

                mapRef.current.addLayer(
                    {
                        id: 'raster-ibf-20',
                        type: 'raster',
                        source: 'ibfRaster20',
                        layout: { visibility: 'none' },
                        paint: {
                            'raster-opacity': 0.7,
                        },
                    },
                );
            }

            // rasterLayersYears.map((layer) => {
            //     if (mapRef.current) {
            //         mapRef.current.addSource(`ibfRaster${layer}`, {
            //             type: 'raster',
            //             tiles: [getRasterLayer(layer)],
            //             tileSize: 256,
            //         });

            //         mapRef.current.addLayer(
            //             {
            //                 id: `raster-ibf-${layer}`,
            //                 type: 'raster',
            //                 source: `ibfRaster${layer}`,
            //                 layout: { visibility: 'none' },
            //                 paint: {
            //                     'raster-opacity': 0.7,
            //                 },
            //             },
            //         );
            //     }
            //     return null;
            // });

            // Ward layer

            map.addLayer({
                id: 'ward-local',
                source: 'boundary-layer',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'line',
                paint: {
                    'line-color': '#ffff00',
                },
                layout: { visibility: 'none' },
            });

            map.addLayer({
                id: 'ward-centroid',
                source: 'centroid',
                'source-layer': mapSources.nepalCentroid.layers.ward,
                type: 'symbol',
                layout: {
                    'text-field': ['get', 'title'],
                    'text-size': 12,
                    visibility: 'none',
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });

            // Municipality Layer
            map.addLayer({
                id: 'municipality-centroid',
                source: 'centroid',
                'source-layer': mapSources.nepalCentroid.layers.municipality,
                type: 'symbol',
                layout: {
                    'text-field': ['get', 'title'],
                    'text-size': 12,
                    visibility: 'none',
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });

            map.addLayer({
                id: 'municipality-local',
                source: 'boundary-layer',
                'source-layer': mapSources.nepal.layers.municipality,
                type: 'line',
                paint: {
                    'line-color': '#ff0000',
                },
                layout: { visibility: 'none' },
                // filter: ['all', ['==', ['get', 'district'], filter.municipality]],
            });

            // District Layer
            map.addLayer({
                id: 'district-centroid',
                source: 'centroid',
                'source-layer': mapSources.nepalCentroid.layers.district,
                type: 'symbol',
                layout: {
                    'text-field': ['get', 'title'],
                    'text-size': 12,
                    visibility: 'none',
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });

            map.addLayer({
                id: 'district-local',
                source: 'boundary-layer',
                'source-layer': mapSources.nepal.layers.district,
                type: 'line',
                paint: {
                    'line-color': '#ff00ff',
                },
                layout: { visibility: 'none' },
            });

            map.addSource('stations', {
                type: 'geojson',
                data: stations,
            });

            // map.addSource('newstations', {
            //     type: 'geojson',
            //     data: stations,
            // });

            // let radius = 0.6;
            // map.addLayer({
            //     id: 'newlayer-main',
            //     source: 'newstations',
            //     paint: {
            //         'circle-opacity': 0,
            //         'circle-color': [
            //             'case',
            //             ['==', ['get', 'exceed_twenty', ['at', leadTime, ['get', 'calculation']]], true],
            //             'red',
            //             ['==', ['get', 'exceed_five', ['at', leadTime, ['get', 'calculation']]], true],
            //             'yellow',
            //             ['==', ['get', 'exceed_two', ['at', leadTime, ['get', 'calculation']]], true],
            //             'green',
            //             'white',
            //         ],
            //         'circle-stroke-width': 1,
            //         'circle-stroke-color': '#fff',
            //     },
            //     layout: {
            //         visibility: 'none',
            //     },
            // });

            // interval = setInterval(() => {
            //     map.setPaintProperty('newlayer-main', 'circle-radius', radius);
            //     radius = (radius + 0.8) % 16;
            // }, 60);

            map.addLayer({
                id: 'placesInitial',
                type: 'symbol',
                source: 'stations',
                layout: {
                    'icon-image': [
                        'case',
                        ['==', ['get', 'has_household_data'], true],
                        'LocationDefault',
                        'LocationDisabled',
                    ],
                    'icon-size': 0.06,
                    'icon-anchor': 'bottom',
                    'text-field': [
                        'case',
                        ['==', ['get', 'has_household_data'], true],
                        ['get', 'station_name'],
                        '',
                    ],
                    'text-size': 10,
                    'text-anchor': 'top',
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });

            map.on('mouseenter', 'placesInitial', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                const coordinates = e.features[0].geometry.coordinates.slice();
                const { station_name } = e.features[0].properties;
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                popup.setLngLat(coordinates).setHTML(
                    `<div style="padding: 0 15px;border-radius: 5px">
                    <p>${station_name}</p>
                    </div>
                    `,
                ).addTo(map);
            });

            map.on('mouseleave', 'placesInitial', () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });

            map.on('click', 'placesInitial', (e) => {
                const uniqueDistrictArray = getDistrictArray(stationDetail, e.features[0]);
                const bbox = getBboxFromDistrictArray(uniqueDistrictArray, district);

                if (e.features[0].properties.is_activated) {
                    if (bbox) {
                        map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 160 });
                    }
                    setSelectedStation(e.features[0]);
                    mapRef.current.setLayoutProperty('district-local', 'visibility', 'visible');
                    mapRef.current.setLayoutProperty('district-centroid', 'visibility', 'visible');
                    // mapRef
                    //     .current
                    //     .setLayoutProperty('raster-ibf-20', 'visibility', 'visible');
                }
            });

            map.on('mouseleave', 'placesInitial', () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        });

        return () => {
            // clearInterval(interval);
            map.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3rd
    const keys = ['numberOfChildren', 'numberOfElderly', 'numberOfPregnantLactating', 'numberOfDisabled'];
    // const nulldata = JSON.stringify(householdJson, (k, v) => {
    //     if (keys.includes(k) && v === null) return 0;
    //     if (k === 'incomeSource') {
    //         if (v) {
    //             const count = v.split(',').length;
    //             return count !== 0 ? 'Yes' : 'No';
    //         }
    //         return 'No';
    //     }
    //     return v;
    // });
    const nulldata = JSON.stringify(householdJson, (k, v) => {
        if (keys.includes(k) && v === null) return 0;
        if (k === 'incomeSource') {
            if (v) {
                const count = v.split(',').length;
                return count === 1 ? 10 : 0;
            }
            return v;
        }
        return v;
    });

    const nullToZerodata = JSON.parse(nulldata);

    const householdGeoJSON = {
        type: 'FeatureCollection',
        features: nullToZerodata.length > 0 && nullToZerodata.map(item => ({
            id: item.id,
            type: 'Feature',
            geometry: item.point,
            properties: { ...item },
        })),
    };

    useEffect(() => {
        if (popupHouseRef.current) {
            popupHouseRef.current.remove();
        }
        if (!mapRef.current) return;
        if (mapRef.current.isStyleLoaded()) {
            if (householdJson.length === 0) {
                if (mapRef.current.getLayer('household-main-data-layer')) {
                    mapRef.current.removeLayer('household-main-data-layer');
                }
                if (mapRef.current.getSource('household-main-data-source')) {
                    mapRef.current.removeSource('household-main-data-source');
                }
            }

            if (showHouseHold === 1) {
                if (mapRef.current.getLayer('household-main-data-layer')) {
                    mapRef.current.removeLayer('household-main-data-layer');
                }

                if (mapRef.current.getSource('household-main-data-source')) {
                    mapRef.current.removeSource('household-main-data-source');
                }

                mapRef.current.addSource('household-main-data-source', {
                    type: 'geojson',
                    data: householdGeoJSON,
                });

                mapRef.current.addLayer({
                    id: 'household-main-data-layer',
                    source: 'household-main-data-source',
                    type: 'circle',
                    paint: { 'circle-color': getPaint(selectedIndicator) },
                }, 'ward-local');

                mapRef.current.on('click', 'household-main-data-layer', (e) => {
                    if (popupHouseRef.current) {
                        popupHouseRef.current.remove();
                    }
                    if (e) {
                        const { lngLat } = e;
                        const coordinates = [lngLat.lng, lngLat.lat];

                        const { properties } = e.features[0];

                        const popupNode = document.createElement('div') as HTMLElement;
                        ReactDOM.render(<HouseholdPopup
                            user={user}
                            houseProperties={properties}
                            setOpen={setFormOpen}
                            getEditHouseValue={getEditHouseValue}
                        />, popupNode);
                        const popupHouse = new mapboxgl.Popup().setLngLat(e.lngLat).setDOMContent(popupNode).addTo(mapRef.current);
                        popupHouseRef.current = popupHouse;
                    }
                });
                mapRef.current.on('mouseenter', 'household-main-data-layer', (e) => {
                    mapRef.current.getCanvas().style.cursor = 'pointer';
                });

                mapRef.current.on('mouseleave', 'household-main-data-layer', () => {
                    mapRef.current.getCanvas().style.cursor = '';
                });
            }
        }
    }, [householdJson, showHouseHold, householdJson.length]);

    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            if (filter.district) {
                mapRef
                    .current
                    .setFilter('district-local', ['all', ['==', ['get', 'title'], getTitle('district', filter.district)]]);
                mapRef
                    .current
                    .setFilter('district-centroid', ['all', ['==', ['get', 'title'], getTitle('district', filter.district)]]);
                mapRef
                    .current
                    .setFilter('municipality-local', ['all', ['==', ['get', 'district'], Number(filter.district)]]);
                mapRef
                    .current
                    .setFilter('municipality-centroid', ['all', ['==', ['get', 'district'], Number(filter.district)]]);
                mapRef
                    .current
                    .setLayoutProperty('district-local', 'visibility', 'visible');
                mapRef
                    .current
                    .setLayoutProperty('municipality-local', 'visibility', 'visible');
                mapRef
                    .current
                    .setLayoutProperty('municipality-centroid', 'visibility', 'visible');
            }
            if (!filter.district && Object.keys(selectedStation).length > 0) {
                const array = getDistrictArray(stationDetail, selectedStation);
                const bbox = getBboxFromDistrictArray(array, district);
                mapRef
                    .current
                    .fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 150 });
                if (mapRef.current.getLayer('household-main-data-layer')) {
                    mapRef.current.removeLayer('household-main-data-layer');
                }
                mapRef
                    .current
                    .setLayoutProperty('district-local', 'visibility', 'visible');
                mapRef
                    .current
                    .setLayoutProperty('district-centroid', 'visibility', 'visible');
                mapRef
                    .current
                    .setLayoutProperty('municipality-local', 'visibility', 'none');
                mapRef
                    .current
                    .setLayoutProperty('municipality-centroid', 'visibility', 'none');
                mapRef
                    .current
                    .setLayoutProperty('ward-local', 'visibility', 'none');
                mapRef
                    .current
                    .setLayoutProperty('ward-centroid', 'visibility', 'none');
                // mapRef
                //     .current
                //     .setLayoutProperty('raster-ibf-20', 'visibility', 'none');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.district]);

    // 4th
    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            if (filter.municipality) {
                const bbox = getMunicipalityBbox();
                mapRef.current.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 150 });

                mapRef
                    .current
                    .setFilter('municipality-local', ['all', ['==', ['get', 'title'], getTitle('municipality', filter.municipality)]]);
                mapRef
                    .current
                    .setFilter('ward-local', ['all', ['==', ['get', 'municipality'], Number(filter.municipality)]]);
                mapRef
                    .current
                    .setFilter('ward-centroid', ['all', ['==', ['get', 'municipality'], Number(filter.municipality)]]);
                mapRef
                    .current
                    .setLayoutProperty('district-local', 'visibility', 'none');
                mapRef
                    .current
                    .setLayoutProperty('district-centroid', 'visibility', 'none');
                mapRef
                    .current
                    .setLayoutProperty('municipality-local', 'visibility', 'visible');
                mapRef
                    .current
                    .setLayoutProperty('ward-local', 'visibility', 'visible');
                mapRef
                    .current
                    .setLayoutProperty('ward-centroid', 'visibility', 'visible');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.municipality]);

    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded()) {
            if (filter.ward.length === 1) {
                const { bbox } = ward.filter(item => item.id === Number(filter.ward[0].id))[0];
                mapRef.current.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { duration: 2000, padding: 150 });

                mapRef.current.setFilter('ward-local', ['all', ['==', ['get', 'id'], filter.ward.map(wardItem => wardItem.id)[0]]]);
                mapRef.current.setFilter('household-main-data-layer', ['all', ['==', ['get', 'ward'], filter.ward[0].id]]);
            }

            if (filter.ward.length > 1) {
                const { bbox } = municipality.filter(item => item.id === Number(filter.municipality))[0];
                mapRef.current.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { duration: 2000, padding: 150 });

                mapRef
                    .current
                    .setFilter(
                        'ward-local',
                        ['all', ['in', ['get', 'id'], ['literal', filter.ward.map(wardItem => wardItem.id)]]],
                    );
                mapRef
                    .current
                    .setFilter(
                        'household-main-data-layer',
                        ['all', ['in', ['get', 'ward'], ['literal', filter.ward.map(wardItem => wardItem.id)]]],
                    );
            }

            if (filter.ward.length === 0 && filter.municipality) {
                const { bbox } = municipality.filter(item => item.id === Number(filter.municipality))[0];
                mapRef.current.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { duration: 2000, padding: 150 });

                mapRef
                    .current
                    .setFilter('municipality-local', ['all', ['==', ['get', 'title'], getTitle('municipality', filter.municipality)]]);

                mapRef
                    .current
                    .setFilter(
                        'household-main-data-layer',
                        ['all', ['==', ['get', 'municipality'], filter.municipality]],
                    );
                mapRef
                    .current
                    .setFilter('ward-local', ['all', ['==', ['get', 'municipality'], Number(filter.municipality)]]);
            }
        }
    }, [filter.ward.length]);

    // 5th
    useEffect(() => {
        if (mapRef.current && !mapRef.current.getLayer('household-main-data-layer')) return;

        if (mapRef.current && mapRef.current.isStyleLoaded() && showHouseHold === 1) {
            mapRef.current.setLayoutProperty('household-main-data-layer', 'visibility', 'visible');
        } else if (mapRef.current && mapRef.current.isStyleLoaded()) {
            mapRef.current.setLayoutProperty('household-main-data-layer', 'visibility', 'none');
        }
    }, [showHouseHold]);

    // 6th
    useEffect(() => {
        if (Object.keys(selectedStation).length === 0 && mapRef.current && mapRef.current.isStyleLoaded()) {
            mapRef.current.flyTo({
                center: [84.394226, 28.1],
                zoom: 6.8,
            });
            mapRef
                .current
                .setLayoutProperty('placesInitial', 'visibility', 'visible');

            mapRef
                .current
                .setLayoutProperty('district-local', 'visibility', 'none');
            mapRef
                .current
                .setLayoutProperty('district-centroid', 'visibility', 'none');
            mapRef
                .current
                .setLayoutProperty('municipality-local', 'visibility', 'none');
            mapRef
                .current
                .setLayoutProperty('municipality-centroid', 'visibility', 'none');

            mapRef
                .current
                .setLayoutProperty('ward-local', 'visibility', 'none');
            mapRef
                .current
                .setLayoutProperty('ward-centroid', 'visibility', 'none');

            mapRef.current.setLayoutProperty('raster-ibf-20', 'visibility', 'none');
        } else if (mapRef.current && mapRef.current.isStyleLoaded()) {
            mapRef
                .current
                .setLayoutProperty('raster-ibf-20', 'visibility', 'visible');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStation]);

    // 7th
    // useEffect(() => {
    //     if (mapRef.current && returnPeriod) {
    //         if (returnPeriod === 20) {
    //             mapRef.current.setLayoutProperty('raster-ibf-20', 'visibility', 'visible');
    //             mapRef.current.setLayoutProperty('raster-ibf-5', 'visibility', 'none');
    //             // mapRef.current.setLayoutProperty('raster-ibf-2', 'visibility', 'none');
    //         } else if (returnPeriod === 5) {
    //             mapRef.current.setLayoutProperty('raster-ibf-5', 'visibility', 'visible');
    //             mapRef.current.setLayoutProperty('raster-ibf-20', 'visibility', 'none');
    //             // mapRef.current.setLayoutProperty('raster-ibf-2', 'visibility', 'none');
    //         } else if (returnPeriod === 2) {
    //             // mapRef.current.setLayoutProperty('raster-ibf-2', 'visibility', 'visible');
    //             mapRef.current.setLayoutProperty('raster-ibf-20', 'visibility', 'none');
    //             mapRef.current.setLayoutProperty('raster-ibf-5', 'visibility', 'none');
    //         } else {
    //             // mapRef.current.setLayoutProperty('raster-ibf-2', 'visibility', 'none');
    //             mapRef.current.setLayoutProperty('raster-ibf-20', 'visibility', 'none');
    //             mapRef.current.setLayoutProperty('raster-ibf-5', 'visibility', 'none');
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [returnPeriod]);

    // 8th
    // useEffect(() => {
    //     if (mapRef.current) {
    //         mapRef.current.on('load', () => {
    //             mapRef.current.setPaintProperty('newlayer-main', 'circle-color', getCircleProp('color', leadTime));
    //             mapRef.current.setPaintProperty('newlayer-main', 'circle-opacity', getCircleProp('opacity', leadTime));
    //             mapRef.current.setPaintProperty('newlayer-main', 'circle-stroke-width', getCircleProp('strokewidth', leadTime));
    //             mapRef.current.setLayoutProperty('newlayer-main', 'visibility', 'visible');
    //         });
    //     }
    //     const timeout = setTimeout(() => {
    //         if (mapRef.current) {
    //             if (mapRef.current.isStyleLoaded()) {
    //                 mapRef.current.setPaintProperty('newlayer-main', 'circle-color', getCircleProp('color', leadTime));
    //                 mapRef.current.setPaintProperty('newlayer-main', 'circle-opacity', getCircleProp('opacity', leadTime));
    //                 mapRef.current.setPaintProperty('newlayer-main', 'circle-stroke-width', getCircleProp('strokewidth', leadTime));
    //                 mapRef.current.setLayoutProperty('newlayer-main', 'visibility', 'visible');
    //             }
    //         }
    //     }, 100);

    //     return () => clearTimeout(timeout);
    // }, [leadTime]);

    // 9th

    // 11th
    useEffect(() => {
        if (!mapRef.current) return;
        if (!mapRef.current.getLayer('household-main-data-layer')) return;

        if (filter.municipality && showHouseHold === 1) {
            mapRef.current.setPaintProperty('household-main-data-layer', 'circle-color', getPaint(selectedIndicator));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndicator, showHouseHold]);

    // 12th
    const getLegendFilter = (legend) => {
        if (legend) {
            return LegendFilters[legend];
        }
        return '';
    };

    useEffect(() => {
        if (!mapRef.current) return;
        if (!mapRef.current.getLayer('household-main-data-layer')) return;

        if (householdJson.length > 0) {
            if (selectedLegend === '') {
                mapRef.current.setFilter('household-main-data-layer');
            } else {
                if (mapRef.current.getLayer('household-main-data-layer')) {
                    mapRef.current.removeLayer('household-main-data-layer');
                }

                if (mapRef.current.getSource('household-main-data-source')) {
                    mapRef.current.removeSource('household-main-data-source');
                }

                mapRef.current.addSource('household-main-data-source', {
                    type: 'geojson',
                    data: householdGeoJSON,
                });
                mapRef.current.addLayer({
                    id: 'household-main-data-layer',
                    source: 'household-main-data-source',
                    type: 'circle',
                    paint: { 'circle-color': getPaint(selectedIndicator) },
                }, 'ward-local');
                mapRef.current.setFilter('household-main-data-layer', getLegendFilter(selectedLegend));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLegend]);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.remove();
        }
        const markerHandler = (e) => {
            if (e) {
                setCoordinates(e.lngLat);
                if (markerRef.current) {
                    markerRef.current.remove();
                }
                const grayCircle = document.createElement('div');
                grayCircle.classList.add(style.defaultMarker);
                const marker = new mapboxgl.Marker(grayCircle)
                    .setLngLat(e.lngLat)
                    .addTo(mapRef.current);
                markerRef.current = marker;
            }
        };

        if (isSelectionActive) {
            if (mapRef.current) {
                mapRef.current.on('click', markerHandler);
            }
        }
        return () => {
            mapRef.current.off('click', markerHandler);
        };
    }, [isSelectionActive]);

    const mapContainer = {
        position: 'absolute',
        top: '40px',
        right: '0',
        width: '100%',
        height: '100%',
    };

    return (
        <>
            {/* {pending
                && (
                    <div className={style.loader}>
                        <Loader color="white" />
                    </div>
                )
            } */}
            <div style={props.myStyle ? props.myStyle : mapContainer} ref={mapContainerRef} />
        </>
    );
};

// export default compose(
//     connect(mapStateToProps, mapDispatchToProps),
//     createConnectedRequestCoordinator<ReduxProps>(),
//     createRequestClient(requests),
// )(Map);
export default connect(mapStateToProps, mapDispatchToProps)(Map);
