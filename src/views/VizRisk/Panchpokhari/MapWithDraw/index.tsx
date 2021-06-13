import React from 'react';
import mapboxgl from 'mapbox-gl';
import { isDefined } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { VectorTile } from '@mapbox/vector-tile';
import * as turf from '@turf/turf';
import MapboxLegendControl from '@watergis/mapbox-gl-legend';
import EarthquakeHazardLegends from '../Legends/EarthquakeHazardLegend';
import { getHillShadeLayer, getGeoJSON } from '#views/VizRisk/Panchpokhari/utils';
import ci from '../RightPaneContents/RightPane4/ci';
import buildings from '#views/VizRisk/Panchpokhari/Data/buildings';
import '@watergis/mapbox-gl-legend/css/styles.css';

import styles from './styles.scss';


import {
    // provincesSelector,
    municipalitiesSelector,
    districtsSelector,
    wardsSelector,
    regionLevelSelector,
    boundsSelector,
    selectedProvinceIdSelector,
    selectedDistrictIdSelector,
    selectedMunicipalityIdSelector,
    incidentListSelectorIP,
} from '#selectors';
import Icon from '#rscg/Icon';


const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    regionLevelFromAppState: regionLevelSelector(state, props),
    bounds: boundsSelector(state, props),
    selectedProvinceId: selectedProvinceIdSelector(state, props),
    selectedDistrictId: selectedDistrictIdSelector(state, props),
    selectedMunicipalityId: selectedMunicipalityIdSelector(state, props),
});

// const {
//     data: criticalinfrastructures,
// } = CIData;

// const categoriesCritical = [...new Set(criticalinfrastructures.features.map(
//     item => item.properties.Type,
// ))];

const { data: cidata } = ci;
const { data: buildingsData } = buildings;

const arr = cidata.features.map(item => [
    item.properties.Longitude,
    item.properties.Latitude,
]);
const buildingsArr = buildingsData.features.map(item => [
    Number(item.geometry.coordinates[0].toFixed(7)),
    Number(item.geometry.coordinates[1].toFixed(7)),
]);


const points = turf.points(arr);
const buildingpoints = turf.points(buildingsArr);


class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lng: 85.64347922706821,
            lat: 28.013604885888867,
            zoom: 9.8,
            incidentYear: '0',
            playState: true,
            ciChartData: [],
            searchTerm: '',
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom,
        } = this.state;


        this.interval = setInterval(() => {
            this.setState((prevState) => {
                if (Number(prevState.incidentYear) < 10) {
                    return ({ incidentYear: String(Number(prevState.incidentYear) + 1) });
                }
                return ({ incidentYear: '0' });
            });
        }, 1000);

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: process.env.REACT_APP_VIZRISK_PANCHPOKHARI_MULTIHAZARD,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });

        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        this.map.on('style.load', () => {
            this.map.setLayoutProperty('Rock-Stone', 'visibility', 'visible');
            this.map.setLayoutProperty('Snow', 'visibility', 'visible');
            this.map.setLayoutProperty('Shrub', 'visibility', 'visible');
            this.map.setLayoutProperty('Forest', 'visibility', 'visible');
            this.map.setLayoutProperty('Farmlands', 'visibility', 'visible');
            this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
            this.map.setLayoutProperty('Roads', 'visibility', 'visible');
            this.map.setLayoutProperty('National Park', 'visibility', 'none');
            this.map.addSource('hillshadePachpokhari', {
                type: 'raster',
                tiles: [this.getRasterLayer()],
                tileSize: 256,
            });
            this.map.addLayer(
                {
                    id: 'raster-hillshade',
                    type: 'raster',
                    source: 'hillshadePachpokhari',
                    layout: {},
                    paint: {
                        'raster-opacity': 0.25,
                    },
                },
            );
            this.map.addSource('lsSusep', {
                type: 'raster',
                tiles: [getHillShadeLayer('panchpokhari_durham_landslide_susceptibility')],
                tileSize: 256,
            });

            this.map.addLayer(
                {
                    id: 'jugallsSuslayer',
                    type: 'raster',
                    source: 'lsSusep',
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'raster-opacity': 0.6,
                    },
                },
            );
            this.map.addSource('seicHazard', {
                type: 'raster',
                tiles: [getHillShadeLayer('panchpokhari_meteor_seismic_hazard_002')],
                tileSize: 256,
            });

            this.map.addLayer(
                {
                    id: 'jugallseicHazard',
                    type: 'raster',
                    source: 'seicHazard',
                    layout: {
                        visibility: 'visible',

                    },
                    paint: {
                        'raster-opacity': 0.6,
                    },
                },
            );
            this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
            this.map.setLayoutProperty('Population Density', 'visibility', 'none');
            this.map.moveLayer('jugallsSuslayer', 'jugallseicHazard');
            this.map.moveLayer('Buildings');

            const draw = new MapboxDraw({
                displayControlsDefault: false,
                userProperties: true,
                controls: {
                    polygon: true,
                    trash: true,
                },
                styles: [

                    {
                        id: 'gl-draw-polygon-fill-inactive',
                        type: 'fill',
                        filter: ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Polygon'],
                            ['!=', 'mode', 'static'],
                        ],
                        paint: {
                            'fill-color': '#3bb2d0',
                            'fill-outline-color': '#3bb2d0',
                            'fill-opacity': 0.1,
                        },
                    },
                    {
                        id: 'gl-draw-polygon-fill-active',
                        type: 'fill',
                        filter: ['all', ['==', 'active', 'true'],
                            ['==', '$type', 'Polygon'],
                        ],
                        paint: {
                            'fill-color': '#fbb03b',
                            'fill-outline-color': '#fbb03b',
                            'fill-opacity': 0.1,
                        },
                    },
                    {
                        id: 'gl-draw-polygon-midpoint',
                        type: 'circle',
                        filter: ['all', ['==', '$type', 'Point'],
                            ['==', 'meta', 'midpoint'],
                        ],
                        paint: {
                            'circle-radius': 3,
                            'circle-color': '#fbb03b',
                        },
                    },
                    {
                        id: 'gl-draw-polygon-stroke-inactive',
                        type: 'line',
                        filter: ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Polygon'],
                            ['!=', 'mode', 'static'],
                        ],
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round',
                        },
                        paint: {
                            'line-color': '#3bb2d0',
                            'line-width': 2,
                        },
                    },
                    {
                        id: 'gl-draw-polygon-stroke-active',
                        type: 'line',
                        filter: ['all', ['==', 'active', 'true'],
                            ['==', '$type', 'Polygon'],
                        ],
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round',
                        },
                        paint: {
                            'line-color': '#fbb03b',
                            'line-dasharray': [0.2, 2],
                            'line-width': 2,
                        },
                    },
                    {
                        id: 'gl-draw-line-inactive',
                        type: 'line',
                        filter: ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'LineString'],
                            ['!=', 'mode', 'static'],
                        ],
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round',
                        },
                        paint: {
                            'line-color': '#3bb2d0',
                            'line-width': 2,
                        },
                    },
                    {
                        id: 'gl-draw-line-active',
                        type: 'line',
                        filter: ['all', ['==', '$type', 'LineString'],
                            ['==', 'active', 'true'],
                        ],
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round',
                        },
                        paint: {
                            'line-color': '#fbb03b',
                            'line-dasharray': [0.2, 2],
                            'line-width': 2,
                        },
                    },
                    {
                        id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
                        type: 'circle',
                        filter: ['all', ['==', 'meta', 'vertex'],
                            ['==', '$type', 'Point'],
                            ['!=', 'mode', 'static'],
                        ],
                        paint: {
                            'circle-radius': 5,
                            'circle-color': '#fff',
                        },
                    },
                    {
                        id: 'gl-draw-polygon-and-line-vertex-inactive',
                        type: 'circle',
                        filter: ['all', ['==', 'meta', 'vertex'],
                            ['==', '$type', 'Point'],
                            ['!=', 'mode', 'static'],
                        ],
                        paint: {
                            'circle-radius': 3,
                            'circle-color': '#fbb03b',
                        },
                    },
                    {
                        id: 'gl-draw-point-point-stroke-inactive',
                        type: 'circle',
                        filter: ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Point'],
                            ['==', 'meta', 'feature'],
                            ['!=', 'mode', 'static'],
                        ],
                        paint: {
                            'circle-radius': 5,
                            'circle-opacity': 1,
                            'circle-color': '#fff',
                        },
                    },
                    {
                        id: 'gl-draw-point-inactive',
                        type: 'circle',
                        filter: ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Point'],
                            ['==', 'meta', 'feature'],
                            ['!=', 'mode', 'static'],
                        ],
                        paint: {
                            'circle-radius': 3,
                            'circle-color': '#3bb2d0',
                        },
                    },
                    {
                        id: 'gl-draw-point-stroke-active',
                        type: 'circle',
                        filter: ['all', ['==', '$type', 'Point'],
                            ['==', 'active', 'true'],
                            ['!=', 'meta', 'midpoint'],
                        ],
                        paint: {
                            'circle-radius': 7,
                            'circle-color': '#fff',
                        },
                    },
                    {
                        id: 'gl-draw-point-active',
                        type: 'circle',
                        filter: ['all', ['==', '$type', 'Point'],
                            ['!=', 'meta', 'midpoint'],
                            ['==', 'active', 'true'],
                        ],
                        paint: {
                            'circle-radius': 5,
                            'circle-color': '#fbb03b',
                        },
                    },
                    {
                        id: 'gl-draw-polygon-fill-static',
                        type: 'fill',
                        filter: ['all', ['==', 'mode', 'static'],
                            ['==', '$type', 'Polygon'],
                        ],
                        paint: {
                            'fill-color': '#404040',
                            'fill-outline-color': '#404040',
                            'fill-opacity': 0.1,
                        },
                    },
                    {
                        id: 'gl-draw-polygon-stroke-static',
                        type: 'line',
                        filter: ['all', ['==', 'mode', 'static'],
                            ['==', '$type', 'Polygon'],
                        ],
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round',
                        },
                        paint: {
                            'line-color': '#404040',
                            'line-width': 2,
                        },
                    },
                    {
                        id: 'gl-draw-line-static',
                        type: 'line',
                        filter: ['all', ['==', 'mode', 'static'],
                            ['==', '$type', 'LineString'],
                        ],
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round',
                        },
                        paint: {
                            'line-color': '#404040',
                            'line-width': 2,
                        },
                    },
                    {
                        id: 'gl-draw-point-static',
                        type: 'circle',
                        filter: ['all', ['==', 'mode', 'static'],
                            ['==', '$type', 'Point'],
                        ],
                        paint: {
                            'circle-radius': 5,
                            'circle-color': '#404040',
                        },
                    },

                    {
                        id: 'gl-draw-polygon-color-picker',
                        type: 'fill',
                        // filter: ['all', ['==', '$type', 'Polygon'],
                        //     ['has', 'user_portColor'],
                        // ],
                        paint: {
                            'fill-color': '#ff0000',
                            'fill-outline-color': '#ffffff',
                            'fill-opacity': 0.1,
                        },
                    },
                    {
                        id: 'gl-draw-line-color-picker',
                        type: 'line',
                        // filter: ['all', ['==', '$type', 'LineString'],
                        //     ['has', 'user_portColor'],
                        // ],
                        paint: {
                            'line-color': '#ffffff',
                            'line-width': 2,
                        },
                    },
                    {
                        id: 'gl-draw-point-color-picker',
                        type: 'circle',
                        // filter: ['all', ['==', '$type', 'Point'],
                        //     ['has', 'user_portColor'],
                        // ],
                        paint: {
                            'circle-radius': 3,
                            'circle-color': '#ffffff',
                        },
                    },
                ],
                defaultMode: 'draw_polygon',
            });
            const updateArea = (e) => {
                const { handleDrawSelectedData } = this.props;
                const datad = draw.getAll();
                const dataArr = datad.features[0].geometry.coordinates;
                const searchWithin = turf.multiPolygon([dataArr], {});

                const ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
                const ptsWithinBuildings = turf.pointsWithinPolygon(buildingpoints, searchWithin);
                const result = [];
                const n = ptsWithin
                    .features
                    .map((i) => {
                        result
                            .push({
                                geometry: i.geometry,
                                hazardTitle: this.getTitleFromLatLng(i),
                            });
                        return null;
                    });
                const coordList = dataArr[0]
                    .map(position => [parseFloat(position[0]), parseFloat(position[1])]);
                const line = turf.lineString(coordList);
                const bbox = turf.bbox(line);

                const point1 = this.map.project([bbox[0], bbox[1]]);
                const point2 = this.map.project([bbox[2], bbox[3]]);


                // todo: need to filter the buildings result further by points data using turf
                // const buildingsCount = this.map.queryRenderedFeatures(
                //     [point1, point2],
                //     { layers: ['Buildings'] },
                // );
                const farmlands = this.map.queryRenderedFeatures(
                    [point1, point2],
                    { layers: ['Farmlands'] },
                );
                const forest = this.map.queryRenderedFeatures(
                    [point1, point2],
                    { layers: ['Forest'] },
                );
                const buildingsCount = ptsWithinBuildings.features.length;
                result.push({
                    buildings: buildingsCount,
                    forest: forest.length,
                    farmlands: farmlands.length,
                });

                handleDrawSelectedData(result);

                this.map.fitBounds(bbox, {
                    padding: 20,
                });
            };

            this.map.addControl(draw, 'top-right');

            this.map.on('draw.create', updateArea);
            // this.map.on('draw.delete', updateArea);
            // this.map.on('draw.update', updateArea);
        });
    }

    public componentDidUpdate(prevProps) {
        if (this.props.sesmicLayer !== prevProps.sesmicLayer) {
            if (this.props.sesmicLayer === 'ses') {
                this.map.setLayoutProperty('jugallseicHazard', 'visibility', 'visible');
                this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'none');
            } else {
                this.map.setLayoutProperty('jugallseicHazard', 'visibility', 'none');
                this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'visible');
            }
            // if (this.props.sesmicLayer === 'sesHide') {
            //     this.map.setLayoutProperty('jugallseicHazard', 'visibility', 'none');
            // }
            // if (this.props.sesmicLayer === 'sus') {
            //     this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'visible');
            // }
            // if (this.props.sesmicLayer === 'susHide') {
            //     this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'none');
            // }
        }
    }

    public componentWillUnmount() {
        this.map.remove();
        clearInterval(this.interval);
    }

    public getRasterLayer = () => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        '&layers=Bipad:Panchpokhari_hillshade',
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('');

    public getTitleFromLatLng = (featureObject) => {
        const latToCompare = featureObject.geometry.coordinates[1];
        const lngToCompare = featureObject.geometry.coordinates[0];
        const hT = cidata.features.filter(fC => fC.geometry.coordinates[0] === lngToCompare
            && fC.geometry.coordinates[1] === latToCompare)[0];

        if (hT.properties) {
            return hT.properties.Type;
        }
        return [];
    }

    public zoomToBbox = (data) => {
        const coordList = data
            .map(position => [parseFloat(position[0]), parseFloat(position[1])]);
        const line = turf.lineString(coordList);
        const bbox = turf.bbox(line);
        this.map.fitBounds(bbox, {
            padding: 20,
        });
    }

    public handleSearchTerm = (e) => {
        this.setState({ searchTerm: e.target.value });
    }

    public showPopupOnBldgs = (coordinates, msg) => {
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true,
            className: 'popup',
        });
        popup.setLngLat(coordinates).setHTML(
            `<div style="padding: 5px;border-radius: 5px">
                <p>OSM_ID: ${msg}</p>
            </div>
            `,
        ).addTo(this.map);
    };

    public handleSearch = () => {
        // get the searchID
        const searchId = this.state.searchTerm;

        // get the coordinates of the builing
        const coordinatesObj = buildingsData
            .features.filter(b => Number(searchId) === Math.round(b.properties.osmid));
        // zoom to this coordinate with some padding
        // this.zoomTo(polygonData);
        let cood = [];
        if (coordinatesObj.length > 0) {
            cood = coordinatesObj[0].geometry.coordinates;
            this.map.easeTo({
                zoom: 19,
                duration: 1000,
                center: cood,
            });
            // show popup
            this.showPopupOnBldgs(cood, searchId);
            this.setState({ searchTerm: '' });
        } else {
            alert('Please enter valid building id');
        }
    };

    public render() {
        const { searchTerm } = this.state;
        const mapStyle = {
            position: 'absolute',
            width: '70%',
            left: 'calc(30% - 60px)',
            top: 0,
            // bottom: 0,
            height: '100vh',
        };

        return (
            <div>
                <div style={mapStyle} ref={(el) => { this.mapContainer = el; }} />
                <div className={styles.searchBox}>
                    <button
                        type="button"
                        onClick={this.handleSearch}
                        className={styles.searchbutton}
                    >
                        <Icon
                            name="search"
                            className={styles.searchIcon}
                        />
                    </button>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={this.handleSearchTerm}
                        placeholder={'Enter house id'}
                    />
                </div>
                <EarthquakeHazardLegends layer={this.props.sesmicLayer} />
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
