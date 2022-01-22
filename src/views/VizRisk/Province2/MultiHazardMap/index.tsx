/* eslint-disable no-else-return */
/* eslint-disable max-len */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import * as geojson from 'geojson';
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

import { getDistrictFilter } from '#utils/domain';
import styles from './styles.scss';
import HealthIcon from '#resources/icons/Health-facility.svg';
import Education from '#resources/icons/Educationcopy.png';
import Finance from '#resources/icons/bank.png';
import Health from '#resources/icons/healthcopy.png';
import Governance from '#resources/icons/governance.png';
import Culture from '#resources/icons/culture.png';
import Fireengine from '#resources/icons/Fireengine.png';
import Heli from '#resources/icons/Heli.png';


import { getgeoJsonLayer, getHillShadeLayer } from '../utils';
import { parseStringToNumber } from '../Functions';

import { districtsSelector } from '../../../../store/atom/page/selector';
import RainTooltip from '#views/Dashboard/Map/Tooltips/Alerts/Rain';
import RiverTooltip from '#views/Dashboard/Map/Tooltips/Alerts/River';
import PollutionTooltip from '#views/Dashboard/Map/Tooltips/Alerts/Pollution';
import FireTooltip from '../../../Dashboard/Map/Tooltips/Alerts/Fire/index';


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
    districts: districtsSelector(state),
});

let hoveredWardId: (string | number |undefined);
let draw;
function noop() {}
const MultiHazardMap = (props: Props) => {
    const {
        MAINKEYNAME,
        districts,
        rightElement,
        CIData,
        contactGeoJson,
        criticalElement,
        showPopulation,
        incidentList,
        handleIncidentChange,
        clickedItem,
        mapboxStyle,
        lng,
        lat,
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
        alerts,
    } = props;


    console.log('contact geo are', contactGeoJson);


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
    const [alertsDataArr, setAlertsDataArr] = useState([]);

    const susceptibilityLayerName = `${MAINKEYNAME}_durham_landslide_susceptibility`;
    const sesmicHazardLayerName = `${MAINKEYNAME}_meteor_seismic_hazard_10`;


    function EarthquakeTooltip(title: any, description: any, createdDate: any, referenceData: any) {
        throw new Error('Function not implemented.');
    }

    const AlertTooltip = ({ title, description, referenceType, referenceData, createdDate }) => {
        if (referenceType && referenceType === 'rain') {
            return RainTooltip(title, description, createdDate, referenceData);
        }
        if (referenceType && referenceType === 'river') {
            return RiverTooltip(title, description, createdDate, referenceData);
        }
        if (title.toUpperCase().includes('EARTH') && referenceData) {
            return EarthquakeTooltip(title, description, createdDate, referenceData);
        }
        if (referenceType && referenceType === 'fire') {
            return FireTooltip(title, description, createdDate, referenceData);
        }
        if (referenceType && referenceType === 'pollution') {
            return PollutionTooltip(title, description, createdDate, referenceData);
        }
        if (title) {
            return (
                <div className={styles.alertTooltip}>
                    <h3 className={styles.heading}>
                        {title}
                    </h3>
                    <div className={styles.description}>
                        { description }
                    </div>
                </div>
            );
        } return null;
    };

    const colorExtrusion = ['#ffeec2', '#f6daa7', '#f6c074', '#ec8209', '#c15401'];


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
        const yearInt = new Date(`${2017 + Number(val)}-01-01`).getTime();
        const nextYear = new Date(`${2017 + Number(val) + 1}-01-01`).getTime();
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

        const mapping = districts.filter(item => item.province === 2).map(item => ({
            ...item,
            value: item.title,
        }));

        const multihazardMap = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/yilab/cky6ydau933qq15o7bmmblnt4',
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
            multihazardMap.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
            });

            multihazardMap.addLayer({
                id: 'ward-fill-local',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.district,
                type: 'fill',

                paint: {
                    'fill-color': [
                        'match',
                        ['id'],
                        16, 'rgb(255,143,13)', 33, 'rgb(255,111,0)',
                        34, 'rgb(255,143,13)', 15, 'red', 17, 'rgb(255,143,13)',
                        18, 'rgb(255,143,13)', 19, 'rgb(255,143,13)', 32, 'green', 'red',
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        1,
                        1,
                    ],
                },
                layout: {
                    visibility: 'none',

                },
                filter: getDistrictFilter(2, null, districts),
            }, 'districtgeo');

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });


            mapping.forEach((attribute) => {
                multihazardMap.setFeatureState(
                    {
                        id: attribute.id,
                        source: 'vizrisk-fills',
                        sourceLayer: mapSources.nepal.layers.district,
                    },
                    { value: attribute.value },
                );
            });


            const alertsData = [...new Set(alerts.features.map(item => item.properties.Type))];

            console.log('alerts data is', alertsData);

            setAlertsDataArr(alertsData);

            alertsData.map((layer) => {
                multihazardMap.addSource(layer, {
				 type: 'geojson',
				 data: getGeoJSONPH(layer, alerts),
			 });

			 multihazardMap.addLayer(
                    {
                        id: `alerts-${layer}`,
                        type: 'circle',
                        source: layer,
                        paint: {
                            'circle-color': ['get', 'alertsColor'],
                            'circle-stroke-width': 1.2,
                            'circle-stroke-color': '#000000',
                            'circle-radius-transition': { duration: 0 },
                            'circle-opacity-transition': { duration: 0 },
                            'circle-radius': 6,
                            'circle-opacity': 0.8,
                        },
                        layout: {
                            visibility: 'none',
                        },
                    },
                );


                multihazardMap.on('click', `alerts-${layer}`, (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const { referenceData } = e.features[0].properties;
                    const { createdDate } = e.features[0].properties;
                    console.log('rrdata', referenceData, createdDate, e.features[0].properties.Type);
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    const popupNode = document.createElement('div');
                    ReactDOM.render(
                        <AlertTooltip
                            title="test"
                            description="test"
                            referenceData={JSON.parse(referenceData)}
                            createdDate={createdDate}
                            referenceType={e.features[0].properties.Type}
                        />, popupNode,
                    );
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setDOMContent(popupNode)
                        .addTo(multihazardMap);
                });

                return null;
            });


            const incidents: any = [...new Set(incidentList.features.map(
                item => item.properties.hazardTitle,
            ))];
            setIncidentsArr(incidents);


            multihazardMap.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    multihazardMap.getCanvas().style.cursor = 'pointer';
                    const { lngLat } = e;
                    console.log('event', e);

                    const coordinates: LngLat = [lngLat.lng, lngLat.lat];
                    const wardno = e.features[0].properties.title;
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
                                sourceLayer: mapSources.nepal.layers.district,
                            },
                            { hover: false },
                        );
                    }
                    hoveredWardId = e.features[0].id;
                    multihazardMap.setFeatureState(
                        {
                            id: hoveredWardId,
                            source: 'vizrisk-fills',
                            sourceLayer: mapSources.nepal.layers.district,

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

            // -----------------------------------------------SLIDE-6-------------------------------------------
            multihazardMap.addSource('temperature-fill-2010', {
                type: 'vector',
                url: mapSources.nepal.url,
            });

            multihazardMap.addLayer({
                id: 'temperature-fill-2010-data',
                source: 'temperature-fill-2010',
                'source-layer': mapSources.nepal.layers.district,
                type: 'fill',

                paint: {
                    'fill-color': [
                        'match',
                        ['id'],
                        16, 'rgb(189, 0, 38)', 33, 'rgb(189, 0, 38)',
                        34, 'rgb(189, 0, 38)', 15, 'rgb(189, 0, 38)', 17, 'rgb(189, 0, 38)',
                        18, 'rgb(189, 0, 38)', 19, 'rgb(189, 0, 38)', 32, 'rgb(189, 0, 38)', 'red',
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.8,
                        1,
                    ],
                },
                layout: {
                    visibility: 'none',

                },
                filter: getDistrictFilter(2, null, districts),
            }, 'districtgeo');

            multihazardMap.on('mousemove', 'temperature-fill-2010-data', (e) => {
                if (e.features.length > 0) {
                    multihazardMap.getCanvas().style.cursor = 'pointer';
                    const { lngLat } = e;
                    console.log('event', e);

                    const coordinates: LngLat = [lngLat.lng, lngLat.lat];
                    const wardno = e.features[0].properties.title;
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                            <p>${wardno}</p>
                        </div>
                        `,
                    ).addTo(multihazardMap);
                    if (hoveredWardId) {
                        multihazardMap.setFeatureState(
                            {
                                id: hoveredWardId,
                                source: 'temperature-fill-2010',
                                sourceLayer: mapSources.nepal.layers.district,
                            },
                            { hover: false },
                        );
                    }
                    hoveredWardId = e.features[0].id;
                    multihazardMap.setFeatureState(
                        {
                            id: hoveredWardId,
                            source: 'temperature-fill-2010',
                            sourceLayer: mapSources.nepal.layers.district,

                        },
                        { hover: true },
                    );
                }
            });
            multihazardMap.on('mouseleave', 'temperature-fill-2010-data', () => {
                multihazardMap.getCanvas().style.cursor = '';
                popup.remove();
                if (hoveredWardId) {
                    multihazardMap.setFeatureState(
                        {
                            source: 'temperature-fill-2010',
                            id: hoveredWardId,
                            sourceLayer: mapSources.nepal.layers.district,
                        },
                        { hover: false },

                    );
                    // multihazardMap.setPaintProperty('ward-fill-local', 'fill-color', populationWardExpression);
                }
                hoveredWardId = null;
            });
            // -----------------------------------------------SLIDE-7-------------------------------------------
            const ciCategory: any = [...new Set(CIData.features.map(
                item => item.properties.Type,
            ))];


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
                        console.log('ci event is', e);

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

            // -----------------------------------------------SLIDE-8-------------------------------------------
            const contactDataArr = [...new Set(contactGeoJson.features.map(item => item.properties.name))];
            console.log('contatctdataarr', contactDataArr);


            multihazardMap.addSource('contactInfo', {
				 type: 'geojson',
				 data: contactGeoJson,
				 cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
			 });

			 multihazardMap.addLayer(
                {
                    id: 'contacts-layer',
                    type: 'circle',
                    source: 'contactInfo',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            100,
                            '#f1f075',
                            750,
                            '#f28cb1',
                        ],
                        'circle-stroke-width': 1.2,
                        'circle-stroke-color': '#000000',
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
                    layout: {
                        visibility: 'none',
                    },
                },
            );

            multihazardMap.addLayer({
                id: 'contacts-cluster-count',
                type: 'symbol',
                source: 'contactInfo',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                    visibility: 'none',
                },
            });

            multihazardMap.addLayer({
                id: 'contacts-unclustered-point',
                type: 'circle',
                source: 'contactInfo',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#11b4da',
                    'circle-radius': 6,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                },
                layout: {
                    visibility: 'none',
                },
            });
            multihazardMap.on('click', 'contacts-unclustered-point', (e) => {
                const coordinates = e.features[0].geometry.coordinates.slice();
                const { name } = e.features[0].properties;
                const { mobileNumber } = e.features[0].properties;
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(`<div style="padding: 5px;border-radius: 5px">
					<p>${name}</p>
					<p>Contact No : ${mobileNumber}</p>
				</div>
		`)
                    .addTo(multihazardMap);
            });


            multihazardMap.setPaintProperty('Buildings', 'fill-extrusion-color', buildingColor);
        });


        multihazardMap.setZoom(1);
        setTimeout(() => {
            disableNavBtns('both');

            multihazardMap.easeTo({
                pitch: 25,
                center: [lng, lat],
                zoom: 8.2,
                duration: 8000,
            });
        }, 4000);
        const destroyMap = () => {
            multihazardMap.remove();
        };


        return destroyMap;
    }, []);


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
                if (map.current) {
                    map.current.setLayoutProperty(`incidents-${clickedItem}`, 'visibility', 'visible');
                }
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
                if (rightElement === 0 && legendElement === 'Adminstrative Map') {
                    layers[1].map((layer) => {
                        if (map.current) {
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
                    if (map.current) {
                        layers[3].map(layer => map.current.setLayoutProperty(layer, 'visibility', 'visible'));
                    }
                } else if (rightElement === 0 && legendElement === 'Landcover') {
                    layers[1].map((layer) => {
                        if (map.current) {
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
                    if (map.current) {
                        layers[3].map(layer => map.current.setLayoutProperty(layer, 'visibility', 'visible'));
                    }
                    map.current.easeTo({
                        pitch: 45,
                        zoom: 8.2,
                        duration: 1200,
                        // center: [lng, lat],
                    });
                } else if (rightElement === 0 && legendElement === 'Population By Ward') {
                    layers[2].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'visible');
                        }
                        return null;
                    });

                    layers[1].map((layer) => {
                        if (map.current) {
                            map.current.setLayoutProperty(layer, 'visibility', 'none');
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
                    zoom: 8.2,
                    duration: 1200,
                    // center: [lng, lat],
                });
            }


            if (rightElement === 2) {
                alertsDataArr.map((item) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`alerts-${item}`, 'visibility', 'visible');
                    }
                    return null;
                });
            } else {
                alertsDataArr.map((item) => {
                    if (map.current) {
                        map.current.setLayoutProperty(`alerts-${item}`, 'visibility', 'none');
                    }
                    return null;
                });
            }
            // -----------------------------------------------------Third Page-------------------------------------------------
            if ((ciPages && rightElement === 6 && clickedArr[0] === 1) || (rightElement === 3 && exposureElementsArr[1] === 1)) {
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
            if ((rightElement === 0 && (legendElement === 'Landcover' || 'Adminstrative Map')) || (rightElement === 2 && clickedArr[1] === 1) || (rightElement === 3 && exposureElementsArr[2] === 1)) {
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
                    zoom: 8.2,
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
                // layers[3].map(layer => map.current.setLayoutProperty(layer, 'visibility', 'none'));
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
            // ------------------------------------------------------------Buildings Data Layer-----------------------------------------

            if ((rightElement === 0 && legendElement === 'Landcover') || (rightElement === 2 && clickedArr[2] === 1) || (rightElement === 3 && exposureElementsArr[3] === 1)) {
                if (map.current) {
                    map.current.setLayoutProperty('buildingsdata', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('buildingsdata', 'visibility', 'none');
            }

            if (rightElement === 5) {
                if (map.current) {
                    map.current.setLayoutProperty('temperature-fill-2010-data', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('temperature-fill-2010-data', 'visibility', 'none');
            }

            if (rightElement === 7) {
                if (map.current) {
                    map.current.setLayoutProperty('contacts-layer', 'visibility', 'visible');
                    map.current.setLayoutProperty('contacts-cluster-count', 'visibility', 'visible');
                    map.current.setLayoutProperty('contacts-unclustered-point', 'visibility', 'visible');
                }
            } else {
                map.current.setLayoutProperty('contacts-layer', 'visibility', 'none');
                map.current.setLayoutProperty('contacts-cluster-count', 'visibility', 'none');
                map.current.setLayoutProperty('contacts-unclustered-point', 'visibility', 'none');
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
    }, [ciCategoryCritical, rightElement, legendElement, layers, exposureElementsArr, clickedArr, floodLayer, hazardLegendClickedArr]);


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
    }, [buildingVul]);


    return (
        <div>
            <div style={mapCSS} ref={mapContainerRef} />
        </div>
    );
};
export default connect(mapStateToProps)(MultiHazardMap);
function filterRange(totalPopulationByWard: any, arg1: number, arg2: number) {
    throw new Error('Function not implemented.');
}
