/* eslint-disable no-else-return */
/* eslint-disable max-len */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import * as geojson from 'geojson';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { bound, isDefined, isInteger, _cs } from '@togglecorp/fujs';
import Loader from 'react-loader';
import { mapSources } from '#constants';
import * as PageTypes from '#store/atom/page/types';
import {
    getFloodRasterLayer,
    getCommonRasterLayer,
    getGeoJSONPH,
    drawStyles,
    getTitleFromLatLng,
    buildingColor,
    getSingularBuildingData,
    getOSMidFromHouseId,
    getHouseId,
} from './utils';
import { AppState } from '#store/types';

import {
    wardsSelector,
} from '#selectors';

import {
    generatePaintByQuantile,
    getWardFilter,
    incidentPointToGeojson,
} from '#utils/domain';
import styles from './styles.scss';
import TimelineSlider from './TimelineSlider';
import EarthquakeHazardLegends from '#views/VizRisk/Common/Legends/EarthquakeHazardLegend';
import FloodDepthLegend from '#views/VizRisk/Common/Legends/FloodDepthLegend';
import SearchBox from './SearchBox';

import HealthIcon from '#resources/icons/Health-facility.svg';
import Education from '#resources/icons/Educationcopy.png';
import Finance from '#resources/icons/bank.png';
import Health from '#resources/icons/healthcopy.png';
import Governance from '#resources/icons/governance.png';
import Culture from '#resources/icons/culture.png';
import Fireengine from '#resources/icons/Fireengine.png';
import Heli from '#resources/icons/Heli.png';


import LandSlideSusLegend from '../Legends/LandSlideSusLegend';
import { getgeoJsonLayer, getHillShadeLayer } from '../utils';
import SatelliteLegends from '../Legends/SatelliteLegend';
import { getSanitizedIncidents } from '#views/LossAndDamage/common';


interface State{
    lat: number;
    lng: number;
    zoom: number;
    ciCategoryCritical: string[];
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
    mapConstants: MapConstants;
    expressions: Expressions;
    demographicsData: DemographicsData;
    floodLayer: FloodLayer;
    sesmicLayer: string;
    handleDrawSelectedData: (e: any) => void;
    handleDrawResetData: (e: boolean) => void;
    buildings: object[];
    vulnerabilityData: object[];
    setSingularBuilding: (f: boolean, e: object) => void;
    buildingVul: object;
    showAddForm: boolean;
    singularBuilding: boolean;
    provinceId: number;
}

type FloodLayer = '5' | '10' | '20' | '50' | '75' | '100' | '200' | '250' | '500' | '1000';

interface Expressions {
    populationWardExpression: string[];
}

interface DemographicsData {
    name: string;
    MalePop: number;
    FemalePop: number;
    TotalHousehold: number;
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
    Type: string;
}

interface PropsFromAppState {
    wards: PageTypes.Ward[];
}

interface MapCSS {
    position: 'absolute' | 'relative';
    width: string;
    left: number;
    top: number;
    height: number;
}

interface MapConstants {
    layers: string[];
    mapCSS: MapCSS;
    mapboxStyle: string;
    zoom: number;
    lng: number;
    lat: number;
    hillshadeLayerName: string;
    incidentsPages: number[];
    ciPages: number[];
    incidentsSliderDelay: number;
    municipalityId: number;
    susceptibilityLayerName: string;
    sesmicHazardLayerName: string;
    drawStyles: object[];
    ciRef: object;
    semicPages: number[];
    floodHazardPages: number[];
    susceptibiltyPages: number[];
    floodHazardLayersArr: FloodLayer[];
    buildingSourceLayerName: string;
    provinceId: number;
}

type Props = OwnProps & PropsFromAppState;

type LngLat = any[];
const UNSUPPORTED_BROWSER = !mapboxgl.supported();
const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    wards: wardsSelector(state),
});

let hoveredWardId: (string | number |undefined);
let draw;
function noop() {}
const MultiHazardMap = (props: Props) => {
    const {
        MAINKEYNAME,
        wards,
        rightElement,
        CIData,
        criticalElement,
        showPopulation,
        incidentList,
        handleIncidentChange,
        clickedItem,
        mapboxStyle,
        boundingBox,
        lng,
        lat,
        municipalityId,
        provinceId,
        districtId,
        floodHazardLayersArr,
        mapConstants: {
            layers,
            mapCSS,
            zoom,
            hillshadeLayerName,
            incidentsPages,
            ciPages,
            incidentsSliderDelay,
            ciRef,
            semicPages,
            floodHazardPages,
            susceptibiltyPages,
            // floodHazardLayers,
            buildingSourceLayerName,
        },
        demographicsData,
        expressions: { populationWardExpression },
        floodLayer,
        sesmicLayer,
        handleDrawSelectedData,
        handleDrawResetData,
        buildings,
        vulnerabilityData,
        setSingularBuilding,
        buildingVul,
        showAddForm,
        singularBuilding,
        legendElement,
        showCritical,
        clickedArr,
        exposureElementsArr,
        exposureElement,
        setpending,
        popdensitygeojson,
        hazardLegendClickedArr,
        buildingsData,
        enableNavBtns,
        disableNavBtns,
        populationDensityRange,
        satelliteImageYears,
        selectedYear,
        handleyearClick,
        satelliteYearDisabled,
        setsatelliteYearDisabled,
        setlegentItemDisabled,


    } = props;


    const [ciCategoryCritical, setciCategoryCritical] = useState<string[]>([]);
    const [incidentsArr, setIncidentsArr] = useState<string[]>([]);
    const [playState, setPlayState] = useState<boolean>(false);
    const [incidentYear, setIncidentYear] = useState<string>('0');
    const [opacitySus, setopacitySus] = useState<number>(0.5);
    const [opacitySes, setopacitySes] = useState<number>(0.5);
    const [opacityFlood, setopacityFlood] = useState<number>(0.5);
    const [osmID, setosmID] = useState<number | null>(null);
    const [searchTerm, setsearchTerm] = useState<string | null>(null);
    const [cood, setcood] = useState<[number, number] | null>(null);
    const [rangeArr, setrangeArr] = useState([]);
    const [demoColor, setdemoColor] = useState([]);
    const points = useRef<turf.AllGeoJSON | null>(null);
    const interval = useRef<Timeout>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const buildingpointsData = useRef<object[]| null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);


    const susceptibilityLayerName = `${MAINKEYNAME}_durham_landslide_susceptibility`;
    const sesmicHazardLayerName = `${MAINKEYNAME}_meteor_seismic_hazard_10`;


    const newDemoColorArray = ['#ffffd6', '#fed990', '#fe9b2a', '#d95f0e', '#9a3404'];

    const totalPopulationByWard = demographicsData.map(item => ({ ward: item.name, totalpop: item.MalePop + item.FemalePop }));
    const arrayValue = totalPopulationByWard.map(item => item.totalpop);
    const maxPop = Math.max(...arrayValue);
    const minPop = Math.min(...arrayValue);
    const popStep = Math.floor((maxPop - minPop) / 5);
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


    const getColor = (wardId) => {
        const colorCondition1 = totalPopulationByWard.filter(item => item.totalpop <= intervals[0]);
        const colorCondition2 = totalPopulationByWard.filter(item => item.totalpop >= intervals[0] && item.totalpop <= intervals[1]);
        const colorCondition3 = totalPopulationByWard.filter(item => item.totalpop >= intervals[1] && item.totalpop <= intervals[2]);
        const colorCondition4 = totalPopulationByWard.filter(item => item.totalpop >= intervals[2] && item.totalpop <= intervals[3]);
        const colorCondition5 = totalPopulationByWard.filter(item => item.totalpop >= intervals[3]);

        const filteredWards1 = colorCondition1.map(item => item.ward);
        const filteredWards2 = colorCondition2.map(item => item.ward);
        const filteredWards3 = colorCondition3.map(item => item.ward);
        const filteredWards4 = colorCondition4.map(item => item.ward);
        const filteredWards5 = colorCondition5.map(item => item.ward);
        if (filteredWards1.includes(`Ward ${wardId}`)) {
            return newDemoColorArray[0];
        } else if (filteredWards2.includes(`Ward ${wardId}`)) {
            return newDemoColorArray[1];
        } else if (filteredWards3.includes(`Ward ${wardId}`)) {
            return newDemoColorArray[2];
        } else if (filteredWards4.includes(`Ward ${wardId}`)) {
            return newDemoColorArray[3];
        } else if (filteredWards5.includes(`Ward ${wardId}`)) {
            return newDemoColorArray[4];
        } else {
            return null;
        }
    };


    const colorExtrusion = ['#ffeec2', '#f6daa7', '#f6c074', '#ec8209', '#c15401'];

    const range1 = populationDensityRange.map(item => item.range1)[0];
    const range2 = populationDensityRange.map(item => item.range2)[1];
    const range3 = populationDensityRange.map(item => item.range3)[2];
    const range4 = populationDensityRange.map(item => item.range4)[3];
    const range5 = populationDensityRange.map(item => item.range5)[4];


    const calculateHeight = (density) => {
        let extrusionHeight;
        if (density < range1[1]) {
            extrusionHeight = 100;
            return extrusionHeight;
        } else if ((density > range2[0]) && (density < range2[1])) {
            extrusionHeight = 200;
            return extrusionHeight;
        } else if ((density > range3[0]) && (density < range3[1])) {
            extrusionHeight = 300;
            return extrusionHeight;
        } else if ((density > range4[0]) && (density < range4[1])) {
            extrusionHeight = 400;
            return extrusionHeight;
        } else {
            extrusionHeight = 500;
            return extrusionHeight;
        }
    };

    const calculateColor = (density) => {
        let extrusionColor;
        if (density < range1[1]) {
            extrusionColor = colorExtrusion[0];
            return extrusionColor;
        } else if ((density > range2[0]) && (density < range2[1])) {
            extrusionColor = colorExtrusion[1];
            return extrusionColor;
        } else if ((density > range3[0]) && (density < range3[1])) {
            extrusionColor = colorExtrusion[2];
            return extrusionColor;
        } else if ((density > range4[0]) && (density < range4[1])) {
            extrusionColor = colorExtrusion[3];
            return extrusionColor;
        } else {
            extrusionColor = colorExtrusion[4];
            return extrusionColor;
        }
    };

    const popDensityGridGeoJSon = {
    	type: 'FeatureCollection',
    	features: popdensitygeojson.features.map(item => ({
    		type: 'Feature',
    		properties: {
    			Name: item.properties.PageName,
    			height: calculateHeight(item.properties.Density),
    			baseheight: 0,
                color: calculateColor(item.properties.Density),

    		},
            geometry: item.geometry,
    	})),
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
    		0,
    		1,
    	],
        };
    };


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

    const filterOnMap = (val) => {
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

    const handleFloodChange = (e, mapType) => {
        const opacity = e.target.value;
        if (mapType === 'flood') {
            setopacityFlood(opacity);
            floodHazardLayersArr.map((l) => {
                if (map.current) {
                    map.current.setPaintProperty(`raster-flood-${l.year}`, 'raster-opacity', Number(opacity));
                }
                return null;
            });
        } else if (mapType === 'ses') {
            if (map.current) {
                map.current.setPaintProperty('sesmicHazard', 'raster-opacity', Number(opacity));
            }
            setopacitySes(opacity);
        } else if (mapType === 'sus') {
            setopacitySus(opacity);
            if (map.current) {
                map.current.setPaintProperty('landslideLayer', 'raster-opacity', Number(opacity));
            }
        }
    };

    const resetArea = () => {
        console.log('resetting data...');

        handleDrawResetData(true);
    };

    const showPopupOnBldgs = (coordinates: [number, number], msg: string) => {
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true,
            className: 'popup',
        });
        if (map.current) {
            popup.setLngLat(coordinates).setHTML(
                `<div style="padding: 5px;border-radius: 5px">
                    <p>${msg}</p>
                </div>
                `,
            ).addTo(map.current);
        }
    };


    const showMarker = (coordinate: [number, number], msg: string) => {
        const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            className: 'popup',
        });
        if (map.current) {
            popup.setLngLat(coordinate).setHTML(
                `<div style="padding: 5px;border-radius: 5px">
                    <p>${msg}</p>
                </div>
                `,
            ).addTo(map.current);
        }
    };

    const handleSearchTerm = (e) => {
        setsearchTerm(e.target.value);
    };

    const updateArea = () => {
        const datad = draw.getAll();
        const dataArr = datad.features[0].geometry.coordinates;
        const searchWithin = turf.multiPolygon([dataArr], {});
        const ptsWithin = turf.pointsWithinPolygon(points.current, searchWithin);
        const ptsWithinBuildings = turf.pointsWithinPolygon(buildingpointsData.current, searchWithin);
        const result = [];
        ptsWithin
            .features
            .map((i) => {
                result
                    .push({
                        geometry: i.geometry,
                        hazardTitle: ciRef[getTitleFromLatLng(i, CIData)],
                    });
                return null;
            });
        const coordList = dataArr[0]
            .map(position => [parseFloat(position[0]), parseFloat(position[1])]);
        const line = turf.lineString(coordList);
        const bbox = turf.bbox(line);

        const buildingsCount = ptsWithinBuildings.features.length;
        const bPoints = ptsWithinBuildings.features.map(item => item.geometry.coordinates);
        result.push({
            buildings: buildingsCount,
            bPoints: bPoints || [],
        });

        handleDrawSelectedData(result);
        if (map.current) {
            map.current.fitBounds(bbox, {
                padding: 20,
            });
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
            }, 1000);
        }
        return () => {
            clearInterval(interval.current);
        };
    });

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


        const multihazardMap = new mapboxgl.Map({
            container: mapContainer,
            style: mapboxStyle,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });

        map.current = multihazardMap;


        multihazardMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        multihazardMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // multihazardMap.fitBounds([
        //     [boundingBox[0], boundingBox[1]],
        //     [boundingBox[2], boundingBox[3]],
        // ]);
        disableNavBtns('both');
        const syncWait = (ms) => {
            const end = Date.now() + ms;
            while (Date.now() < end) break;
        };

        syncWait(4000);


        multihazardMap.on('idle', () => {
            setsatelliteYearDisabled(false);
            setlegentItemDisabled(false);
            if (rightElement === 0) {
                enableNavBtns('Right');
            } else if (rightElement === 4) {
                enableNavBtns('Left');
            }
            enableNavBtns('both');
        });


        multihazardMap.on('style.load', () => {
            // setTimeout(() => {
            // multihazardMap.easeTo({
            //     zoom: 11.4,
            //     duration: 8000,
            //     center: [lng, lat],
            // });
            // }, 10000);
            // map.current.easeTo({
            //     pitch: 20,
            //     zoom: 11.4,
            //     duration: 6000,
            //     center: [lng, lat],
            // });
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
                filter: getWardFilter(provinceId, districtId, municipalityId, wards),
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


            const incidents: any = [...new Set(incidentList.features.map(
                item => item.properties.hazardTitle,
            ))];
            setIncidentsArr(incidents);


            incidents.map((layer) => {
                multihazardMap.addSource(layer, {
                    type: 'geojson',
                    data: getIncidentsGeoJSON(layer, incidentList),
                });
                multihazardMap.addLayer(
                    {
                        id: `incidents-${layer}`,
                        type: 'circle',
                        source: layer,
                        paint: {
                            'circle-color': ['get', 'hazardColor'],
                            'circle-stroke-width': 1.2,
                            'circle-stroke-color': '#000000',
                            'circle-radius': 8,
                            'circle-opacity': 0.8,
                        },
                        layout: {
                            visibility: 'none',
                        },
                    },
                );
                multihazardMap.addLayer(
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


                multihazardMap.setLayoutProperty(`incidents-${layer}`, 'visibility', 'none');
                multihazardMap.setLayoutProperty(`incidents-icon-${layer}`, 'visibility', 'none');
                return null;
            });

            const ciCategory: any = [...new Set(CIData.features.map(
                item => item.properties.Type,
            ))];

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
            setciCategoryCritical(ciCategory);


            images.forEach((img) => {
                map.current.loadImage(
                    img.url,
                    (error, image) => {
                        if (error) throw error;
                        map.current.addImage(img.name, image);
                    },
                );
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
                        'icon-image': (layer === 'education' && 'education') || (layer === 'finance' && 'finance') || (layer === 'health' && 'health') || (layer === 'governance' && 'governance') || (layer === 'cultural' && 'cultural') || (layer === 'fireengine' && 'fireengine') || (layer === 'helipad' && 'helipad'),
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


            multihazardMap.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    multihazardMap.getCanvas().style.cursor = 'pointer';
                    const { lngLat } = e;

                    const coordinates: LngLat = [lngLat.lng, lngLat.lat];
                    const wardno = e.features[0].properties.title;
                    const details = demographicsData.filter(item => item.name === `Ward ${wardno}`);
                    const totalPop = details[0].MalePop + details[0].FemalePop;
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                            <p> Total Population: ${totalPop}</p>
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

            if (populationWardExpression) {
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
                        // multihazardMap.setPaintProperty('ward-fill-local', 'fill-color', populationWardExpression);
                    }
                    hoveredWardId = null;
                });
            }
            // multihazardMap.addSource('hillshade', {
            //     type: 'raster',
            //     tiles: [getCommonRasterLayer(hillshadeLayerName)],
            //     tileSize: 256,
            // });

            // multihazardMap.addLayer(
            //     {
            //         id: 'hillshadeLayer',
            //         type: 'raster',
            //         source: 'hillshade',
            //         layout: {},
            //         paint: {
            //             'raster-opacity': 0.25,
            //         },
            //     },
            // );


            if (floodHazardLayersArr && floodHazardLayersArr.length > 0) {
                floodHazardLayersArr.map((layer) => {
                    multihazardMap.addSource(`floodraster${layer.year}`, {
                        type: 'raster',
                        tiles: [getFloodRasterLayer(layer.layername)],
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
            }
            multihazardMap.addSource('landslide', {
                type: 'raster',
                tiles: [getCommonRasterLayer(susceptibilityLayerName)],
                tileSize: 256,
            });

            multihazardMap.addLayer(
                {
                    id: 'landslideLayer',
                    type: 'raster',
                    source: 'landslide',
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'raster-opacity': opacitySus,
                    },
                },
            );
            multihazardMap.addSource('seicHazard', {
                type: 'raster',
                tiles: [getCommonRasterLayer(sesmicHazardLayerName)],
                tileSize: 256,
            });

            multihazardMap.addLayer(
                {
                    id: 'sesmicHazard',
                    type: 'raster',
                    source: 'seicHazard',
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'raster-opacity': opacitySes,
                    },
                },

            );
            multihazardMap.addSource('buildingsPolygon', {
                type: 'geojson',
                data: getgeoJsonLayer(`${MAINKEYNAME}_buildings`),

            });
            multihazardMap.addLayer(
                {
                    id: 'buildingsdata',
                    type: 'fill-extrusion',
                    source: 'buildingsPolygon',
                    layout: {
                        visibility: 'none',

                    },
                    paint: {

                        'fill-extrusion-color': '#964B00',
                        'fill-extrusion-height': 10,
                        'fill-extrusion-base': 0,
                        'fill-extrusion-opacity': 1,
                    },

                },

            );
            multihazardMap.addSource('popdensityGrid', {
                type: 'geojson',
                data: popDensityGridGeoJSon,

            });
            multihazardMap.addLayer(
                {
                    id: 'popdensitylayer3d',
                    type: 'fill-extrusion',
                    source: 'popdensityGrid',
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'fill-extrusion-color': ['get', 'color'],
                        'fill-extrusion-height': ['get', 'height'],
                        'fill-extrusion-base': ['get', 'baseheight'],
                        'fill-extrusion-opacity': 0.9,
                    },

                }, 'wardgeo',
            );
            multihazardMap.addSource('popdensity', {
                type: 'geojson',
                data: popdensitygeojson,

            });

            multihazardMap.addLayer(
                {
                    id: 'popdensitylayer',
                    type: 'fill',
                    source: 'popdensity',
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'fill-color': '#f8f7f7',
                        'fill-outline-color': '#000000',
                        'fill-opacity': 0.5,
                    },

                }, 'popdensitylayer3d',
            );

            if (satelliteImageYears && satelliteImageYears.length > 0) {
                satelliteImageYears.map((layer) => {
                    multihazardMap.addSource(`satelliteImage_${layer.year}`, {
                        type: 'raster',
                        tiles: [getHillShadeLayer(layer.name)],
                        tileSize: 256,
                    });
                    multihazardMap.addLayer(
                        {
                            id: `satelliteImageMain_${layer.year}`,
                            type: 'raster',
                            source: `satelliteImage_${layer.year}`,
                            layout: {
                                visibility: 'none',
                            },
                            paint: {
                                'raster-opacity': 1,
                            },
                        },
                    );
                    return null;
                });
            }

            vulnerabilityData.map((row) => {
                multihazardMap.setFeatureState(
                    {
                        id: row.osmId || 0,
                        source: 'composite',
                        sourceLayer: buildingSourceLayerName,
                    },
                    {
                        vuln: row.vulnerabilityScore || -1,
                    },
                );
                return null;
            });

            multihazardMap.setPaintProperty('Buildings', 'fill-extrusion-color', buildingColor);
            multihazardMap.moveLayer('hillshadeLayer', 'Population Den,sity');
            multihazardMap.moveLayer('Ward Boundary Line');
            multihazardMap.moveLayer('Ward No.');
            multihazardMap.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            multihazardMap.moveLayer('ward-fill-local', 'Ward Boundary Line');
        });


        multihazardMap.setZoom(1);
        setTimeout(() => {
            disableNavBtns('both');

            multihazardMap.easeTo({
                pitch: 25,
                center: [lng, lat],
                zoom: 11.7,
                duration: 8000,
            });
        }, 4000);
        const destroyMap = () => {
            multihazardMap.remove();
        };


        return destroyMap;
    }, [municipalityId, provinceId]);


    useEffect(() => {
        if (map.current && showPopulation && map.current.isStyleLoaded() && rightElement === 0) {
            if (showPopulation === 'popdensity') {
                map.current.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            } else {
                map.current.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
            }
        }
    }, [rightElement, showPopulation]);

    useEffect(() => {
        const switchFloodRasters = (floodlayer: FloodLayer) => {
            if (floodHazardLayersArr && floodHazardLayersArr.length > 0 && map.current) {
                floodHazardLayersArr.map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`raster-flood-${layer.year}`, 'visibility', 'none');
                    }
                    return null;
                });
                map.current.setLayoutProperty(`raster-flood-${floodlayer}`, 'visibility', 'visible');
            }
        };

        if (map.current && floodHazardLayersArr && map.current.isStyleLoaded()) {
            switchFloodRasters(floodLayer);
        }
    }, [floodHazardLayersArr, floodLayer]);


    useEffect(() => {
        if (rightElement === 1) {
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

    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            ciCategoryCritical.map((layer) => {
                if (map.current) {
                    map.current.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                    map.current.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                    map.current.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');
                }
                return null;
            });
            const layer = criticalElement;
            if (layer === 'all') {
                ciCategoryCritical.map((item: string) => {
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
            // -----------------------------------------------------First Page-------------------------------------------------
            if (rightElement <= layers.length - 1
                && layers[rightElement].length > 0
            ) {
                if (rightElement === 0 && legendElement === 'Admin Boundary') {
                    layers[1].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
                        }
                        return null;
                    });
                    layers[2].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
                        }
                        return null;
                    });
                } else if (rightElement === 0 && legendElement === 'Landcover') {
                    layers[1].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'visible');
                            map.current.setLayoutProperty(layer, 'visibility', 'visible');
                        }
                        return null;
                    });
                    layers[2].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
                        }
                        return null;
                    });
                    map.current.easeTo({
                        pitch: 45,
                        zoom: 11.8,
                        duration: 1200,
                        // center: [lng, lat],
                    });
                } else if (rightElement === 0 && legendElement === 'Population By Ward') {
                    layers[1].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
                        }
                        return null;
                    });
                    layers[2].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'visible');
                        }
                        return null;
                    });
                } else if (rightElement > 0) {
                    layers[1].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
                        }
                        return null;
                    });
                    layers[2].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
                        }
                        return null;
                    });
                }
            }
            if (rightElement === 2) {
                map.current.easeTo({
                    pitch: 27,
                    zoom: 11.7,
                    duration: 1200,
                    // center: [lng, lat],
                });
            }

            // -----------------------------------------------------Third Page-------------------------------------------------
            if ((ciPages && ciPages.indexOf(rightElement + 1) !== -1 && clickedArr[0] === 1) || (rightElement === 3 && exposureElementsArr[1] === 1)) {
                ciCategoryCritical.map((item: string) => {
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
                ciCategoryCritical.map((item: string) => {
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
            if ((rightElement === 0 && legendElement === 'Landcover') || (rightElement === 2 && clickedArr[2] === 1) || (rightElement === 3 && exposureElementsArr[2] === 1)) {
                layers[1].map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'visible');
                    }
                    return null;
                });
            } else {
                layers[1].map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(layer, 'visibility', 'none');
                    }
                    return null;
                });
            }

            if (rightElement === 4) {
                map.current.easeTo({
                    pitch: 37,
                    zoom: 11.6,
                    duration: 1200,
                    // center: [lng, lat],
                });
            }

            // -----------------------------------------------------Hazard Page-------------------------------------------------
            if (rightElement === 3 && hazardLegendClickedArr[0] === 1) {
                if (map.current) {
                    layers[3].map(layer => map.current.setLayoutProperty(layer, 'visibility', 'visible'));
                    if (floodLayer) {
                        map.current.setLayoutProperty(`raster-flood-${floodLayer}`, 'visibility', 'visible');
                    }
                }
            } else {
                map.current.setLayoutProperty(`raster-flood-${floodLayer}`, 'visibility', 'none');
                layers[3].map(layer => map.current.setLayoutProperty(layer, 'visibility', 'none'));
            }


            if (rightElement === 3 && hazardLegendClickedArr[1] === 1) {
                if (map.current) {
                    map.current.setLayoutProperty('landslideLayer', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('landslideLayer', 'visibility', 'none');
            }

            if (rightElement === 3 && hazardLegendClickedArr[2] === 1) {
                if (map.current) {
                    map.current.setLayoutProperty('sesmicHazard', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('sesmicHazard', 'visibility', 'none');
            }
            // ------------------------------------------Population Density Layer----------------------------------
            if ((rightElement === 2 && clickedArr[1] === 1) || (rightElement === 3 && exposureElementsArr[0] === 1)) {
                if (map.current) {
                    map.current.setLayoutProperty('popdensitylayer3d', 'visibility', 'visible');
                    map.current.setLayoutProperty('popdensitylayer', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('popdensitylayer3d', 'visibility', 'none');
                map.current.setLayoutProperty('popdensitylayer', 'visibility', 'none');
            }
            // ------------------------------------------------------------Buildings Data Layer-----------------------------------------

            if ((rightElement === 0 && legendElement === 'Landcover') || (rightElement === 2 && clickedArr[3] === 1) || (rightElement === 3 && exposureElementsArr[3] === 1)) {
                if (map.current) {
                    map.current.setLayoutProperty('buildingsdata', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('buildingsdata', 'visibility', 'none');
            }

            if (rightElement === 4) {
                if (map.current) {
                    map.current.setLayoutProperty(`satelliteImageMain_${selectedYear}`, 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty(`satelliteImageMain_${selectedYear}`, 'visibility', 'none');
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
    }, [ciCategoryCritical, rightElement, legendElement, layers, exposureElementsArr, clickedArr, floodLayer, hazardLegendClickedArr]);


    useEffect(() => {
        const switchSatelliteImage = (imageLayer: FloodLayer) => {
            if (satelliteImageYears && satelliteImageYears.length > 0 && map.current) {
                satelliteImageYears.map((layer) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`satelliteImageMain_${layer.year}`, 'visibility', 'none');
                    }
                    return null;
                });
                map.current.setLayoutProperty(`satelliteImageMain_${selectedYear}`, 'visibility', 'visible');
            }
        };

        if (map.current && satelliteImageYears && map.current.isStyleLoaded()) {
            switchSatelliteImage(selectedYear);
        }
    }, [satelliteImageYears, selectedYear]);

    useEffect(() => {
        if (rightElement === 5) {
            if (buildings.features && map.current) {
                const buildingsD = buildings.features.map(item => [
                    Number(item.geometry.coordinates[0].toFixed(7)),
                    Number(item.geometry.coordinates[1].toFixed(7)),
                ]);
                buildingpointsData.current = turf.points(buildingsD);
                if (draw) {
                    map.current.removeControl(draw);
                    draw = null;
                }
                draw = new MapboxDraw({
                    displayControlsDefault: false,
                    userProperties: true,
                    controls: {
                        polygon: true,
                        trash: true,
                    },
                    styles: drawStyles,
                    defaultMode: 'draw_polygon',
                });

                // drawElement.current = draw;
                map.current.addControl(draw, 'top-right');
                map.current.on('draw.modechange', () => {
                    const data = draw.getAll();
                    if (draw.getMode() === 'draw_polygon') {
                        const pids = [];
                        handleDrawResetData(true);
                        const lid = data.features[data.features.length - 1].id;

                        data.features.forEach((f) => {
                            if (f.geometry.type === 'Polygon' && f.id !== lid) {
                                pids.push(f.id);
                            }
                        });
                        draw.delete(pids);
                    }
                });

                map.current.on('draw.delete', resetArea);
                map.current.on('draw.create', updateArea);
                map.current.on('draw.update', updateArea);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rightElement]);


    useEffect(() => {
        if (rightElement === 6) {
            if (vulnerabilityData.length > 0 && map.current) {
                const buildingsD = vulnerabilityData.filter(item => item.point !== undefined)
                    .map(p => p.point.coordinates);
                buildingpointsData.current = turf.points(buildingsD);

                if (draw) {
                    map.current.removeControl(draw);
                    draw = null;
                }

                draw = new MapboxDraw({
                    displayControlsDefault: false,
                    userProperties: true,
                    controls: {
                        polygon: true,
                        trash: true,
                    },
                    styles: drawStyles,
                    defaultMode: 'draw_polygon',
                });

                // drawElement.current = draw;

                map.current.addControl(draw, 'top-right');
                map.current.on('draw.modechange', () => {
                    const data = draw.getAll();
                    if (draw.getMode() === 'draw_polygon') {
                        const pids = [];
                        handleDrawResetData(true);
                        const lid = data.features[data.features.length - 1].id;

                        data.features.forEach((f) => {
                            if (f.geometry.type === 'Polygon' && f.id !== lid) {
                                pids.push(f.id);
                            }
                        });
                        draw.delete(pids);
                    }
                });

                map.current.on('draw.delete', resetArea);
                map.current.on('draw.create', updateArea);
                map.current.on('draw.update', updateArea);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rightElement]);

    useEffect(() => {
        if (rightElement < 5 && map.current) {
            if (draw) {
                map.current.removeControl(draw);
                draw = null;
            }
        }
    }, [rightElement]);

    const handleBuildingClick = (clicked: boolean, search) => {
        let searchId: string | null;
        if (!clicked) {
            const housId = searchTerm;
            searchId = getOSMidFromHouseId(housId, vulnerabilityData);
        } else {
            searchId = search;
        }
        if (searchId) {
            const coordinatesObj = buildings
                .features.filter(b => Number(searchId) === Math.round(b.properties.osm_id));
            let coordinate = [];
            if (coordinatesObj.length > 0) {
                coordinate = coordinatesObj[0].geometry.coordinates;
                const singularBData = getSingularBuildingData(searchId, vulnerabilityData);
                if (Object.keys(singularBData).length > 0) {
                    setSingularBuilding(true, singularBData);
                    setsearchTerm(null);
                    if (map.current) {
                        map.current.easeTo({
                            zoom: 19,
                            duration: 500,
                            center: coordinate,
                        });
                    }
                    showPopupOnBldgs(coordinate, getHouseId(searchId, vulnerabilityData));
                } else {
                    setsearchTerm(null);
                    setSingularBuilding(true, { osmId: searchId, coordinatesObj });
                    showMarker(coordinatesObj[0].geometry.coordinates, 'No data');
                    setcood(coordinatesObj[0].geometry.coordinates);
                }
            } else {
                setsearchTerm(null);
                setSingularBuilding(true, { osmId: searchId, coordinatesObj });
            }
        } else {
            setSingularBuilding(true, { osmId: searchId });
            setsearchTerm(null);
        }
    };

    useEffect(() => {
        if (vulnerabilityData) {
            vulnerabilityData.map((row) => {
                if (map.current && map.current.isStyleLoaded()) {
                    map.current.setFeatureState(
                        {
                            id: row.osmId || 0,
                            source: 'composite',
                            sourceLayer: buildingSourceLayerName,
                        },
                        {
                            vuln: row.vulnerabilityScore || -1,
                        },
                    );
                }
                return null;
            });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vulnerabilityData, map.current]);

    useEffect(() => {
        if (map.current) {
            map.current.on('click', 'Buildings', (e) => {
                setosmID(e.features[0].properties.osm_id);
                setsearchTerm(e.features[0].properties.osm_id);
                handleBuildingClick(true, e.features[0].properties.osm_id);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map.current]);


    useEffect(() => {
        if (map.current && map.current.isStyleLoaded()) {
            map.current.setFeatureState(
                {
                    id: buildingVul.osmId || 0,
                    source: 'composite',
                    sourceLayer: buildingSourceLayerName,
                },
                {
                    vuln: buildingVul.vulnerabilityScore || -1,
                },
            );
            map.current.setPaintProperty('Buildings', 'fill-extrusion-color', buildingColor);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildingVul]);

    useEffect(() => {
        if (showAddForm) {
            if (cood) {
                showMarker(cood, 'Editing...');
            }
        }
    }, [cood, showAddForm]);


    // useEffect(() => {
    //     if (singularBuilding) {
    //         if (map.current) {
    //             map.current.removeControl(draw);
    //         }
    //     } else if (map.current) {
    //         map.current.addControl(draw, 'top-right');
    //     }
    // }, [singularBuilding]);

    return (
        <div>
            <div style={mapCSS} ref={mapContainerRef}>
                {
                    incidentsPages.indexOf(rightElement + 1) !== -1
                    && (
                        <TimelineSlider
                            handlePlayPause={handlePlayPause}
                            handleInputChange={handleInputChange}
                            playState={playState}
                            incidentYear={incidentYear}
                        />
                    )
                }
                {
                    rightElement === 4
                    && (
                        <SatelliteLegends
                            satelliteImageYears={satelliteImageYears}
                            selectedYear={selectedYear}
                            handleyearClick={handleyearClick}
                            satelliteYearDisabled={satelliteYearDisabled}
                        />
                    )
                }

                {
                    rightElement === 6
                    && (
                        <SearchBox
                            handleBuildingClick={handleBuildingClick}
                            searchTeam={searchTerm}
                            handleSearchTerm={handleSearchTerm}
                        />
                    )
                }
                <div>
                    {
                        rightElement === 3 && hazardLegendClickedArr[1] === 1
                && (
                    <>
                        <p className={_cs(styles.sliderLabel)}>
                            Layer Opacity
                        </p>
                        <input
                            onChange={e => handleFloodChange(e, 'sus')}
                            id="slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={String(opacitySus)}
                            className={styles.slider}
                        />
                        <LandSlideSusLegend layer="sus" />
                    </>
                )
                    }
                    {
                        rightElement === 3 && hazardLegendClickedArr[2] === 1
                && (
                    <>
                        <p className={_cs(styles.sliderLabel)}>
                            Layer Opacity
                        </p>
                        <input
                            onChange={e => handleFloodChange(e, 'ses')}
                            id="slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={String(opacitySes)}
                            className={styles.slider}
                        />
                        <LandSlideSusLegend layer="ses" />
                    </>
                )
                    }
                    {
                        (rightElement === 3 && hazardLegendClickedArr[0] === 1)
                && (
                    <>
                        <p className={_cs(styles.sliderLabel)}>
                            Layer Opacity
                        </p>
                        <input
                            onChange={e => handleFloodChange(e, 'flood')}
                            id="slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={String(opacityFlood)}
                            className={styles.slider}
                        />
                        <FloodDepthLegend />
                    </>
                )
                    }
                </div>

                {
                    (rightElement === 4 && satelliteYearDisabled)
                        ? (
                            <div className={styles.loaderInfo}>
                                <Loader color="#fff" className={styles.loader} />
                                <p className={styles.loaderText}>
						Loading Data...
                                </p>
                            </div>
                        ) : ''
                }


            </div>
        </div>
    );
};
export default connect(mapStateToProps)(MultiHazardMap);
function filterRange(totalPopulationByWard: any, arg1: number, arg2: number) {
    throw new Error('Function not implemented.');
}
