/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { isDefined, _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import EarthquakeHazardLegends from '../Legends/EarthquakeHazardLegend';
import FloodDepthLegend from '#views/VizRisk/Common/Legends/FloodDepthLegend';
import { getHillShadeLayer, getGeoJSON } from '#views/VizRisk/Jugal/utils';


import styles from './styles.scss';


import {
    wardsSelector,
} from '#selectors';

const ciRef = {
    'Water sources': 'Water Source',
    'Trade and business (groceries, meat, textiles)': 'Trade and business',
    'Industry/ hydropower': 'Industry',
    'Hotel/resort/homestay': 'Hotel or Restaurant',
    Health: 'Hospital',
    'Government Buildings': 'Government Building',
    Bridge: 'Bridge',
    'Community buildings': 'Community Building',
    'Cultural heritage sites': 'Cultural Heritage',
    Finance: 'Financial Institution',
    Education: 'Education Institution',
};
const rasterLayers = [
    '5', '10', '20', '50', '75', '100',
    '200', '250', '500', '1000',
];

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const mapStateToProps = (state, props) => ({
    wards: wardsSelector(state),
});


class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lng: 85.79108507481781,
            lat: 28.015490220644214,
            zoom: 9.8,
            incidentYear: '0',
            playState: true,
            ciChartData: [],
            searchTerm: '',
            categoriesCritical: [],
            points: [],
            buildingpoints: [],
            opacitySes: 0.5,
            opacitySus: 0.5,
            opacityFlood: 0.5,
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom, opacitySes, opacitySus,
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
        this.map.addControl(new mapboxgl.ScaleControl(), 'top-right');
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        const { CIData: cidata, buildings } = this.props;


        if (isDefined(cidata.features)) {
            const arr = cidata.features.map(item => [
                item.properties.Longitude,
                item.properties.Latitude,
            ]);
            const points = turf.points(arr);
            this.setState({ points });
        }
        if (isDefined(buildings.features)) {
            const buildingsD = buildings.features.map(item => [
                Number(item.geometry.coordinates[0].toFixed(7)),
                Number(item.geometry.coordinates[1].toFixed(7)),
            ]);
            const buildingpointsData = turf.points(buildingsD);
            this.setState({ buildingpoints: buildingpointsData });


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
                const { points, buildingpoints } = this.state;
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
                                hazardTitle: ciRef[this.getTitleFromLatLng(i, cidata)],
                            });
                        return null;
                    });
                const coordList = dataArr[0]
                    .map(position => [parseFloat(position[0]), parseFloat(position[1])]);
                const line = turf.lineString(coordList);
                const bbox = turf.bbox(line);

                const point1 = this.map.project([bbox[0], bbox[1]]);
                const point2 = this.map.project([bbox[2], bbox[3]]);
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
            this.map.on('draw.modechange', (e) => {
                const data = draw.getAll();
                if (draw.getMode() === 'draw_polygon') {
                    const pids = [];
                    this.props.handleDrawResetData(true);
                    // ID of the added template empty feature
                    const lid = data.features[data.features.length - 1].id;

                    data.features.forEach((f) => {
                        if (f.geometry.type === 'Polygon' && f.id !== lid) {
                            pids.push(f.id);
                        }
                    });
                    draw.delete(pids);
                }
            });
            this.map.on('draw.delete', this.resetArea);
            this.map.on('draw.create', updateArea);
            this.map.on('draw.update', updateArea);
        }

        this.map.on('style.load', () => {
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
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
                tiles: [getHillShadeLayer('jugal_durham_landslide_susceptibility')],
                tileSize: 256,
            });

            this.map.addLayer(
                {
                    id: 'jugallsSuslayer',
                    type: 'raster',
                    source: 'lsSusep',
                    layout: {
                        visibility: 'visible',
                    },
                    paint: {
                        'raster-opacity': Number(opacitySus),
                    },
                },
            );
            this.map.addSource('seicHazard', {
                type: 'raster',
                tiles: [getHillShadeLayer('jugal_meteor_seismic_hazard_10')],
                tileSize: 256,
            });

            this.map.addLayer(
                {
                    id: 'jugallseicHazard',
                    type: 'raster',
                    source: 'seicHazard',
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'raster-opacity': Number(opacitySes),
                    },
                },
            );

            const { CIData } = this.props;

            // if (CIData.length > 0) {

            this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
            this.map.setLayoutProperty('Population Density', 'visibility', 'none');
            const landCoverLayers = ['Shrub', 'Forest', 'Farmlands', 'Buildings', 'Roads', 'Snow'];
            this.map.setLayoutProperty('National Park', 'visibility', 'none');
            landCoverLayers.map((l) => {
                this.map.setLayoutProperty(l, 'visibility', 'visible');
                return null;
            });
            this.map.moveLayer('Buildings');
            this.map.moveLayer('jugallsSuslayer', 'jugallseicHazard');

            rasterLayers.map((layer) => {
                this.map.addSource(`floodraster${layer}`, {
                    type: 'raster',
                    tiles: [this.getFloodRasterLayer(layer)],
                    tileSize: 256,
                });
                this.map.addLayer(
                    {
                        id: `raster-flood-${layer}`,
                        type: 'raster',
                        source: `floodraster${layer}`,
                        layout: {
                            visibility: 'none',
                        },
                        paint: {
                            'raster-opacity': 0.7,
                        },
                    },
                );
                return null;
            });
            // this.map.on('draw.delete', updateArea);
            // this.map.on('draw.update', updateArea);

            if (isDefined(CIData.features)) {
                const categoriesCritical = [...new Set(CIData.features.map(
                    item => item.properties.CI,
                ))];
                    // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ categoriesCritical });

                categoriesCritical.map((layer) => {
                    this.map.addSource(layer, {
                        type: 'geojson',
                        data: getGeoJSON(layer, CIData),
                        cluster: true,
                        clusterRadius: 50,
                    });
                    this.map.addLayer({
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

                    this.map.addLayer({
                        id: `unclustered-point-${layer}`,
                        type: 'symbol',
                        source: layer,
                        filter: ['!', ['has', 'point_count']],
                        layout: {
                            'icon-image': ['downcase', ['get', 'CI']],
                            'icon-size': 0.3,
                            'icon-anchor': 'bottom',
                        },
                    });

                    this.map.addLayer({
                        id: `clusters-count-${layer}`,
                        type: 'symbol',
                        source: layer,
                        layout: {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12,
                        },
                    });

                    this.map.moveLayer(`unclustered-point-${layer}`);
                    this.map.moveLayer(`clusters-${layer}`);
                    this.map.moveLayer(`clusters-count-${layer}`);


                    categoriesCritical.map(ci => this.map.on('mousemove', `unclustered-point-${ci}`, (e) => {
                        if (e) {
                            this.map.getCanvas().style.cursor = 'pointer';
                            const { lngLat } = e;
                            const coordinates = [lngLat.lng, lngLat.lat];
                            const ciName = e.features[0].properties.Name;
                            popup.setLngLat(coordinates).setHTML(
                                `<div style="padding: 5px;border-radius: 5px">
                            <p>${ciName}</p>
                        </div>
                        `,
                            ).addTo(this.map);
                        }
                    }));
                    categoriesCritical.map(ci => this.map.on('mouseleave', `unclustered-point-${ci}`, () => {
                        this.map.getCanvas().style.cursor = '';
                        popup.remove();
                    }));
                    return null;
                });
            }
        });
    }

    public componentDidUpdate(prevProps) {
        const { rasterLayer } = this.props;
        if (this.props.sesmicLayer !== prevProps.sesmicLayer) {
            if (this.props.sesmicLayer === 'ses') {
                this.map.setLayoutProperty('jugallseicHazard', 'visibility', 'visible');
                this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'none');
                this.map.setLayoutProperty(`raster-flood-${rasterLayer}`, 'visibility', 'none');
            } else if (this.props.sesmicLayer === 'sus') {
                this.map.setLayoutProperty('jugallseicHazard', 'visibility', 'none');
                this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'visible');
                this.map.setLayoutProperty(`raster-flood-${rasterLayer}`, 'visibility', 'none');
            } else {
                this.map.setLayoutProperty('jugallseicHazard', 'visibility', 'none');
                this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'none');
                this.map.setLayoutProperty(`raster-flood-${rasterLayer}`, 'visibility', 'visible');
            }
        }

        if (this.props.rasterLayer !== prevProps.rasterLayer) {
            this.switchFloodRasters(this.props.rasterLayer);
        }
    }

    public componentWillUnmount() {
        this.map.remove();
        clearInterval(this.interval);
    }

    public switchFloodRasters = (rL) => {
        rasterLayers.map((layer) => {
            this.map.setLayoutProperty(`raster-flood-${layer}`, 'visibility', 'none');
            return null;
        });

        this.map.setLayoutProperty(`raster-flood-${rL}`, 'visibility', 'visible');
        // this.map.moveLayer(`raster-flood-${rL}`);
    };

    public getFloodRasterLayer = (layerName: string) => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        `&layers=Bipad:Jugal_FD_1in${layerName}`,
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('');

    public getTitleFromLatLng = (featureObject, cidata) => {
        const latToCompare = featureObject.geometry.coordinates[1];
        const lngToCompare = featureObject.geometry.coordinates[0];
        const hT = cidata.features.filter(fC => fC.geometry.coordinates[0] === lngToCompare
            && fC.geometry.coordinates[1] === latToCompare)[0];

        if (hT.properties) {
            return hT.properties.CI;
        }
        return [];
    }

    public resetArea = () => {
        this.props.handleDrawResetData(true);
    };

    public handleInputChange = (e) => {
        const val = e.target.value;
        this.setState({ opacitySus: String(e.target.value) });
        this.map.setPaintProperty('jugallsSuslayer', 'raster-opacity', Number(val));
    }

    public handleInputChangeSes = (e) => {
        const val = e.target.value;
        this.setState({ opacitySes: String(e.target.value) });
        this.map.setPaintProperty('jugallseicHazard', 'raster-opacity', Number(val));
    }

    public handleInputChangeFlood = (e) => {
        const val = e.target.value;
        this.setState({ opacityFlood: String(e.target.value) });
        this.map.setPaintProperty(`raster-flood-${this.props.rasterLayer}`, 'raster-opacity', Number(val));
    }

    public getRasterLayer = () => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        '&layers=Bipad:Jugal_hillshade',
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('');

    public render() {
        const { searchTerm } = this.state;
        const mapStyle = {
            position: 'absolute',
            width: 'calc(70%)',
            left: 'calc(30% - 60px)',
            top: 0,
            // bottom: 0,
            height: '100vh',
            zIndex: 201,
        };

        return (
            <div>
                <div style={mapStyle} ref={(el) => { this.mapContainer = el; }} />

                <div className={styles.sliderandLegendContainer}>
                    {
                        this.props.sesmicLayer === 'sus'
            && (
                <>
                    <p className={_cs(styles.sliderLabel)}>
                        Layer Opacity
                    </p>
                    <input
                        onChange={this.handleInputChange}
                        id="slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={String(this.state.opacitySus)}
                        className={styles.slider}
                    />
                    <EarthquakeHazardLegends layer={this.props.sesmicLayer} />
                </>
            )
                    }
                    {
                        this.props.sesmicLayer === 'ses'
            && (
                <>
                    <p className={_cs(styles.sliderLabel)}>
                        Layer Opacity
                    </p>
                    <input
                        onChange={this.handleInputChangeSes}
                        id="slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={String(this.state.opacitySes)}
                        className={styles.slider}
                    />
                    <EarthquakeHazardLegends layer={this.props.sesmicLayer} />
                </>
            )
                    }

                    {
                        this.props.sesmicLayer === 'flood'
                && (
                    <>
                        <p className={_cs(styles.sliderLabel)}>
                            Layer Opacity
                        </p>
                        <input
                            onChange={this.handleInputChangeFlood}
                            id="slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={String(this.state.opacityFlood)}
                            className={styles.slider}
                        />
                        <FloodDepthLegend />
                    </>
                )
                    }
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
