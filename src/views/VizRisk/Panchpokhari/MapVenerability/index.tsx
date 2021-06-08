import React from 'react';
import mapboxgl from 'mapbox-gl';
import { isDefined } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { VectorTile } from '@mapbox/vector-tile';
import * as turf from '@turf/turf';
import Pbf from 'pbf';
import Zlib from 'zlib';
import MapboxLegendControl from '@watergis/mapbox-gl-legend';
import { getHillShadeLayer, getGeoJSON } from '#views/VizRisk/Jugal/utils';
import ci from '../RightPaneContents/RightPane4/ci';
// import buildings from '../Data/buildings';
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

const { data: cidata } = ci;
// const { data: buildingsData } = buildings;

const arr = cidata.features.map(item => [
    item.properties.Longitude,
    item.properties.Latitude,
]);
// const buildingsArr = buildingsData.features.map(item => [
//     Number(item.geometry.coordinates[0].toFixed(7)),
//     Number(item.geometry.coordinates[1].toFixed(7)),
// ]);


const points = turf.points(arr);
// const buildingpoints = turf.points(buildingsArr);


class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lat: 28.015490220644214,
            lng: 85.79108507481781,
            zoom: 9.8,
            incidentYear: '0',
            playState: true,
            ciChartData: [],
            searchTerm: '',
            osmID: 0,
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
            style: process.env.REACT_APP_VIZRISK_JUGAL_LANDSLIDE,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });

        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        this.map.on('style.load', () => {
            this.map.on('click', 'Buildings', (e) => {
                console.log('features:', e.features[0]);
                console.log('all e::', e);
                this.setState({ osmID: e.features[0].properties.osm_id });
                const filter = ['all', ['==', 'osm_id', e.features[0].properties.osm_id]];
                this.map.setFilter('Buildings', filter);
            });

            this.map.addSource('lsSusep', {
                type: 'raster',
                tiles: [getHillShadeLayer('jugal_durham_landslide_susceptibilty')],
                tileSize: 256,
            });

            this.map.addLayer(
                {
                    id: 'jugallsSuslayer',
                    type: 'raster',
                    source: 'lsSusep',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.addSource('seicHazard', {
                type: 'raster',
                tiles: [getHillShadeLayer('jugal_meteor_seismic_hazard_002')],
                tileSize: 256,
            });

            this.map.addLayer(
                {
                    id: 'jugallseicHazard',
                    type: 'raster',
                    source: 'seicHazard',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
            this.map.moveLayer('Buildings');
            this.map.moveLayer('jugallsSuslayer', 'jugallseicHazard');
            const drawFeatureID = '';
            const newDrawFeature = false;

            // add draw
            // const draw = new MapboxDraw({
            //     // this is used to allow for custom properties for styling
            //     // it appends the word "user_" to the property
            //     userProperties: true,
            //     controls: {
            //         // eslint-disable-next-line @typescript-eslint/camelcase
            //         combine_features: true,
            //         // eslint-disable-next-line @typescript-eslint/camelcase
            //         uncombine_features: false,
            //         polygon: true,
            //     },
            //     styles: [
            //         // default themes provided by MB Draw
            //         // default themes provided by MB Draw
            //         // default themes provided by MB Draw
            //         // default themes provided by MB Draw


            //         {
            //             id: 'gl-draw-polygon-fill-inactive',
            //             type: 'fill',
            //             filter: ['all', ['==', 'active', 'false'],
            //                 ['==', '$type', 'Polygon'],
            //                 ['!=', 'mode', 'static'],
            //             ],
            //             paint: {
            //                 'fill-color': '#3bb2d0',
            //                 'fill-outline-color': '#3bb2d0',
            //                 'fill-opacity': 0.1,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-polygon-fill-active',
            //             type: 'fill',
            //             filter: ['all', ['==', 'active', 'true'],
            //                 ['==', '$type', 'Polygon'],
            //             ],
            //             paint: {
            //                 'fill-color': '#ffffff',
            //                 'fill-outline-color': '#ffffff',
            //                 'fill-opacity': 0.1,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-polygon-midpoint',
            //             type: 'circle',
            //             filter: ['all', ['==', '$type', 'Point'],
            //                 ['==', 'meta', 'midpoint'],
            //             ],
            //             paint: {
            //                 'circle-radius': 3,
            //                 'circle-color': '#ffffff',
            //             },
            //         },
            //         {
            //             id: 'gl-draw-polygon-stroke-inactive',
            //             type: 'line',
            //             filter: ['all', ['==', 'active', 'false'],
            //                 ['==', '$type', 'Polygon'],
            //                 ['!=', 'mode', 'static'],
            //             ],
            //             layout: {
            //                 'line-cap': 'round',
            //                 'line-join': 'round',
            //             },
            //             paint: {
            //                 'line-color': '#3bb2d0',
            //                 'line-width': 2,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-polygon-stroke-active',
            //             type: 'line',
            //             filter: ['all', ['==', 'active', 'true'],
            //                 ['==', '$type', 'Polygon'],
            //             ],
            //             layout: {
            //                 'line-cap': 'round',
            //                 'line-join': 'round',
            //             },
            //             paint: {
            //                 'line-color': '#ffffff',
            //                 'line-dasharray': [0.2, 2],
            //                 'line-width': 2,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-line-inactive',
            //             type: 'line',
            //             filter: ['all', ['==', 'active', 'false'],
            //                 ['==', '$type', 'LineString'],
            //                 ['!=', 'mode', 'static'],
            //             ],
            //             layout: {
            //                 'line-cap': 'round',
            //                 'line-join': 'round',
            //             },
            //             paint: {
            //                 'line-color': '#3bb2d0',
            //                 'line-width': 2,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-line-active',
            //             type: 'line',
            //             filter: ['all', ['==', '$type', 'LineString'],
            //                 ['==', 'active', 'true'],
            //             ],
            //             layout: {
            //                 'line-cap': 'round',
            //                 'line-join': 'round',
            //             },
            //             paint: {
            //                 'line-color': '#ffffff',
            //                 'line-dasharray': [0.2, 2],
            //                 'line-width': 2,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
            //             type: 'circle',
            //             filter: ['all', ['==', 'meta', 'vertex'],
            //                 ['==', '$type', 'Point'],
            //                 ['!=', 'mode', 'static'],
            //             ],
            //             paint: {
            //                 'circle-radius': 5,
            //                 'circle-color': '#fff',
            //             },
            //         },
            //         {
            //             id: 'gl-draw-polygon-and-line-vertex-inactive',
            //             type: 'circle',
            //             filter: ['all', ['==', 'meta', 'vertex'],
            //                 ['==', '$type', 'Point'],
            //                 ['!=', 'mode', 'static'],
            //             ],
            //             paint: {
            //                 'circle-radius': 3,
            //                 'circle-color': '#ffffff',
            //             },
            //         },
            //         {
            //             id: 'gl-draw-point-point-stroke-inactive',
            //             type: 'circle',
            //             filter: ['all', ['==', 'active', 'false'],
            //                 ['==', '$type', 'Point'],
            //                 ['==', 'meta', 'feature'],
            //                 ['!=', 'mode', 'static'],
            //             ],
            //             paint: {
            //                 'circle-radius': 5,
            //                 'circle-opacity': 1,
            //                 'circle-color': '#fff',
            //             },
            //         },
            //         {
            //             id: 'gl-draw-point-inactive',
            //             type: 'circle',
            //             filter: ['all', ['==', 'active', 'false'],
            //                 ['==', '$type', 'Point'],
            //                 ['==', 'meta', 'feature'],
            //                 ['!=', 'mode', 'static'],
            //             ],
            //             paint: {
            //                 'circle-radius': 3,
            //                 'circle-color': '#3bb2d0',
            //             },
            //         },
            //         {
            //             id: 'gl-draw-point-stroke-active',
            //             type: 'circle',
            //             filter: ['all', ['==', '$type', 'Point'],
            //                 ['==', 'active', 'true'],
            //                 ['!=', 'meta', 'midpoint'],
            //             ],
            //             paint: {
            //                 'circle-radius': 7,
            //                 'circle-color': '#fff',
            //             },
            //         },
            //         {
            //             id: 'gl-draw-point-active',
            //             type: 'circle',
            //             filter: ['all', ['==', '$type', 'Point'],
            //                 ['!=', 'meta', 'midpoint'],
            //                 ['==', 'active', 'true'],
            //             ],
            //             paint: {
            //                 'circle-radius': 5,
            //                 'circle-color': '#ffffff',
            //             },
            //         },
            //         {
            //             id: 'gl-draw-polygon-fill-static',
            //             type: 'fill',
            //             filter: ['all', ['==', 'mode', 'static'],
            //                 ['==', '$type', 'Polygon'],
            //             ],
            //             paint: {
            //                 'fill-color': '#404040',
            //                 'fill-outline-color': '#404040',
            //                 'fill-opacity': 0.1,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-polygon-stroke-static',
            //             type: 'line',
            //             filter: ['all', ['==', 'mode', 'static'],
            //                 ['==', '$type', 'Polygon'],
            //             ],
            //             layout: {
            //                 'line-cap': 'round',
            //                 'line-join': 'round',
            //             },
            //             paint: {
            //                 'line-color': '#404040',
            //                 'line-width': 2,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-line-static',
            //             type: 'line',
            //             filter: ['all', ['==', 'mode', 'static'],
            //                 ['==', '$type', 'LineString'],
            //             ],
            //             layout: {
            //                 'line-cap': 'round',
            //                 'line-join': 'round',
            //             },
            //             paint: {
            //                 'line-color': '#404040',
            //                 'line-width': 2,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-point-static',
            //             type: 'circle',
            //             filter: ['all', ['==', 'mode', 'static'],
            //                 ['==', '$type', 'Point'],
            //             ],
            //             paint: {
            //                 'circle-radius': 5,
            //                 'circle-color': '#404040',
            //             },
            //         },

            //         // end default themes provided by MB Draw
            //         // end default themes provided by MB Draw
            //         // end default themes provided by MB Draw
            //         // end default themes provided by MB Draw


            //         // new styles for toggling colors
            //         // new styles for toggling colors
            //         // new styles for toggling colors
            //         // new styles for toggling colors

            //         {
            //             id: 'gl-draw-polygon-color-picker',
            //             type: 'fill',
            //             filter: ['all', ['==', '$type', 'Polygon'],
            //                 ['has', 'user_portColor'],
            //             ],
            //             paint: {
            //                 'fill-color': ['get', 'user_portColor'],
            //                 'fill-outline-color': ['get', 'user_portColor'],
            //                 'fill-opacity': 0.5,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-line-color-picker',
            //             type: 'line',
            //             filter: ['all', ['==', '$type', 'LineString'],
            //                 ['has', 'user_portColor'],
            //             ],
            //             paint: {
            //                 'line-color': ['get', 'user_portColor'],
            //                 'line-width': 2,
            //             },
            //         },
            //         {
            //             id: 'gl-draw-point-color-picker',
            //             type: 'circle',
            //             filter: ['all', ['==', '$type', 'Point'],
            //                 ['has', 'user_portColor'],
            //             ],
            //             paint: {
            //                 'circle-radius': 3,
            //                 'circle-color': ['get', 'user_portColor'],
            //             },
            //         },

            //     ],
            //     defaultMode: 'draw_ploygon',
            // });

            const draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true,
                },
                defaultMode: 'draw_polygon',
            });
            const updateArea = (e) => {
                const { handleDrawSelectedData } = this.props;
                const datad = draw.getAll();
                const dataArr = datad.features[0].geometry.coordinates;
                const searchWithin = turf.multiPolygon([dataArr], {});

                const ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
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
                const buildings = this.map.queryRenderedFeatures(
                    [point1, point2],
                    { layers: ['Buildings'] },
                );
                const farmlands = this.map.queryRenderedFeatures(
                    [point1, point2],
                    { layers: ['Farmlands'] },
                );
                const forest = this.map.queryRenderedFeatures(
                    [point1, point2],
                    { layers: ['Forest'] },
                );

                result.push({
                    buildings: buildings.length,
                    forest: forest.length,
                    farmlands: farmlands.length,
                });
                console.log('buildings: ', buildings);
                // eslint-disable-next-line no-underscore-dangle
                const { _pbf } = buildings[0]._vectorTileFeature;
                handleDrawSelectedData(result);

                this.map.fitBounds(bbox, {
                    padding: 20,
                });

                const data = _pbf.buf;
                // const Protobuf = require('pbf');

                // const tile = new VectorTile(new Pbf(data));
                let tile;
                Zlib.gunzip(data, (err, buffer) => {
                    tile = new VectorTile(new Pbf(data));
                    console.log('Buildings from whatnot:', tile);
                });

                // Contains a map of all layers
                // tile.layers;

                // const { building } = tile.layers;

                // Amount of features in this layer
                // Buildings.length;

                // Returns the first feature
                // console.log('Buildings from whatnot:', building.length);
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
        }
    }

    public componentWillUnmount() {
        this.map.remove();
        clearInterval(this.interval);
    }

    public getTitleFromLatLng = (featureObject) => {
        const latToCompare = featureObject.geometry.coordinates[1];
        const lngToCompare = featureObject.geometry.coordinates[0];
        const hT = cidata.features.filter(fC => fC.geometry.coordinates[0] === lngToCompare
            && fC.geometry.coordinates[1] === latToCompare)[0];

        if (hT.properties) {
            return hT.properties.CI;
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
                <p>${msg}</p>
            </div>
            `,
        ).addTo(this.map);
    };

    public handleSearch = () => {
        // get the searchID
        const searchId = this.state.searchTerm;

        // get the coordinates of the builing
        const coordinates = [85.7754320848645, 27.8364085713613];
        // zoom to this coordinate with some padding
        // this.zoomTo(polygonData);

        this.map.easeTo({
            zoom: 17,
            duration: 500,
            center: coordinates,

        });
        // show popup
        this.showPopupOnBldgs(coordinates, searchId);
        this.setState({ searchTerm: '' });
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
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
