/* eslint-disable max-len */
/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { isDefined, _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { getHillShadeLayer, getSingularBuildingData } from '#views/VizRisk/Panchpokhari/utils';
import EarthquakeHazardLegends from '../Legends/EarthquakeHazardLegend';
import expressions from '../Data/expressions';
import FloodDepthLegend from '#views/VizRisk/Common/Legends/FloodDepthLegend';
import HouseholdPopup from '#views/VizRisk/Common/HouseholdPopup';
import {
    popupElement,
    drawStyle,
    ciRef,
    rasterLayers,
    getFloodRasterLayer,
} from '#views/VizRisk/Common/utils';
import styles from './styles.scss';
import {
    // provincesSelector,
    wardsSelector,
} from '#selectors';
import Icon from '#rscg/Icon';

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const mapStateToProps = (state, props) => ({
    wards: wardsSelector(state),
});

const { buildingColor } = expressions;

const draw = new MapboxDraw({
    displayControlsDefault: false,
    userProperties: true,
    controls: {
        polygon: true,
        trash: true,
    },
    styles: drawStyle,
    defaultMode: 'draw_polygon',
});

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    className: 'popup',
});

class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);
        this.state = {
            lng: 85.64347922706821,
            lat: 28.013604885888867,
            zoom: 10.2,
            incidentYear: '0',
            playState: true,
            ciChartData: [],
            searchTerm: '',
            osmID: 0,
            points: [],
            buildingpoints: [],
            opacitySes: 0.5,
            opacitySus: 0.5,
            opacityFlood: 0.5,
            currentPoint: null,
            mapStyle: process.env.REACT_APP_VIZRISK_PANCHPOKHARI_MULTIHAZARD,
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom, opacitySes, opacitySus,
        } = this.state;


        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: this.state.mapStyle,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });
        this.map.addControl(new mapboxgl.ScaleControl(), 'top-right');

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        // this.map.on('closeAllPopups', () => {
        //     popup.remove();
        // });

        const { CIData: cidata, buildings } = this.props;

        if (isDefined(cidata.features)) {
            const arr = cidata.features.map(item => [
                item.properties.Longitude,
                item.properties.Latitude,
            ]);
            const points = turf.points(arr);
            this.setState({ points });
        }
        if (isDefined(buildings.length > 0)) {
            const buildingsD = buildings.filter(item => item.point !== undefined)
                .map(p => p.point.coordinates);
            // const buildingpointsData = turf.points(buildingsD);
            const features = buildings.filter(item => (item.osmId)).map(b => ({
                type: 'Feature',
                geometry: b.point,
                properties: {
                    osmId: b.osmId,
                    vuln: b.vulnerabilityScore || -1,
                },
            }));

            const buildingpointsData = {
                type: 'FeatureCollection',
                features,
            };
            this.setState({ buildingpoints: buildingpointsData });
            console.log('buildingpointsData', buildingpointsData);
            const updateArea = (e) => {
                const { handleDrawSelectedData } = this.props;
                const { points, buildingpoints } = this.state;
                console.time('function start');
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
                console.timeEnd('function start');

                console.time('bpoints array making');
                const bPoints = ptsWithinBuildings.features.map(item => item.geometry.coordinates);
                console.timeEnd('bpoints array making');
                result.push({
                    buildings: buildingsCount,
                    forest: forest.length,
                    farmlands: farmlands.length,
                    bPoints: bPoints || [],
                });
                handleDrawSelectedData(result);

                this.map.fitBounds(bbox, {
                    padding: 20,
                });
            };


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
            this.map.addControl(draw, 'top-right');
            this.map.on('draw.create', updateArea);
            this.map.on('draw.update', updateArea);
            this.map.on('draw.delete', this.resetArea);
        }

        this.map.on('style.load', () => {
            // this.map.setPaintProperty('Buildings', 'fill-extrusion-color', buildingColor);

            // this.map.setPaintProperty('Buildings', 'fill-extrusion-color', '#d3d3d3');
            this.map.on('click', 'buildingPoints', (e) => {
                console.log(' e.features[0].properties', e);
                this.setState({ osmID: e.features[0].properties.osmId });
                const searchTerm = e.features[0].properties.osmId;
                this.setState({ searchTerm });
                this.handleBuildingClick(true);
            });
            this.map.setLayoutProperty('Rock-Stone', 'visibility', 'visible');
            this.map.setLayoutProperty('Snow', 'visibility', 'visible');
            this.map.setLayoutProperty('Shrub', 'visibility', 'visible');
            this.map.setLayoutProperty('Forest', 'visibility', 'visible');
            this.map.setLayoutProperty('Farmlands', 'visibility', 'visible');
            this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
            this.map.setLayoutProperty('National Park', 'visibility', 'none');
            this.map.setLayoutProperty('Road', 'visibility', 'visible');
            // this.orderLayers('buildingPoints');
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
                    layout: {
                        visibility: 'visible',
                    },
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
                        'raster-opacity': Number(opacitySus),
                    },
                },
            );
            this.map.addSource('seicHazard', {
                type: 'raster',
                tiles: [getHillShadeLayer('panchpokhari_meteor_seismic_hazard_10')],
                tileSize: 256,
            });
            this.map.addSource('buildingPointSource', {
                type: 'geojson',
                data: this.state.buildingpoints,
            });
            this.map.addLayer({
                id: 'buildingPoints',
                type: 'circle',
                source: 'buildingPointSource',
                paint: {
                    'circle-color': '#e3e3e3',
                    'circle-radius': 7,
                    'circle-stroke-color': '#444',
                    'circle-stroke-width': 1,
                },
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
            this.map.setPaintProperty('buildingPoints', 'circle-color', buildingColor);
            // buildings.map((row) => {
            //     this.map.setFeatureState(
            //         {
            //             id: row.osmId || 0,
            //             source: 'composite',
            //             sourceLayer: 'ppkrBuildingsWithIDs',
            //         },
            //         {
            //             vuln: row.vulnerabilityScore || -1,
            //         },
            //     );
            //     // }
            //     return null;
            // });
            this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
            this.map.moveLayer('Buildings');
            this.map.moveLayer('jugallsSuslayer', 'jugallseicHazard');

            rasterLayers.map((layer) => {
                this.map.addSource(`floodraster${layer}`, {
                    type: 'raster',
                    tiles: [getFloodRasterLayer(layer)],
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
            } else if (this.props.sesmicLayer === 'flood') {
                this.map.setLayoutProperty('jugallseicHazard', 'visibility', 'none');
                this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'none');
                this.map.setLayoutProperty(`raster-flood-${rasterLayer}`, 'visibility', 'visible');
            } else {
                this.map.setLayoutProperty('jugallseicHazard', 'visibility', 'none');
                this.map.setLayoutProperty('jugallsSuslayer', 'visibility', 'none');
                this.map.setLayoutProperty(`raster-flood-${rasterLayer}`, 'visibility', 'none');
            }
        }
        if (this.props.singularBuilding !== prevProps.singularBuilding
            && !this.props.singularBuilding) {
            this.map.addControl(draw, 'top-right');
        }
        if (this.props.singularBuilding !== prevProps.singularBuilding
            && this.props.singularBuilding) {
            this.map.removeControl(draw);
        }
        if (this.props.rasterLayer !== prevProps.rasterLayer) {
            this.switchFloodRasters(this.props.rasterLayer);
        }
        if (this.props.buildingVul !== prevProps.buildingVul) {
            this.map.setFeatureState(
                {
                    id: this.props.buildingVul.osmId || 0,
                    source: 'composite',
                    sourceLayer: 'ppkrBuildingsWithIDs',
                },
                {
                    vuln: this.props.buildingVul.vulnerabilityScore || -1,
                },
            );
            this.map.setPaintProperty('Buildings', 'fill-extrusion-color', buildingColor);
        }
        if (this.props.showAddForm !== prevProps.showAddForm) {
            if (this.props.showAddForm) {
                if (this.state.cood) {
                    this.showPopupOnBldgs(
                        this.state.cood,
                        'Please enter building details on the left panel. ',
                    );
                }
            } else {
                this.map.fire('closeAllPopups');
            }
        }
    }

    public componentWillUnmount() {
        this.map.remove();
    }

    public switchFloodRasters = (rL) => {
        rasterLayers.map((layer) => {
            this.map.setLayoutProperty(`raster-flood-${layer}`, 'visibility', 'none');
            return null;
        });

        this.map.setLayoutProperty(`raster-flood-${rL}`, 'visibility', 'visible');
    };

    public resetArea = () => {
        this.props.handleDrawResetData(true);
    };

    public getTitleFromLatLng = (featureObject, cidata) => {
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

    public handleButtonClick = () => {
        // showing the data add form
        this.props.handleShowAddForm(true);
        // this.map.setStyle(process.env.REACT_APP_MAP_STYLE_SATELLITE);
        // this.setState({ mapStyle: process.env.REACT_APP_MAP_STYLE_SATELLITE });
        // change the popup
        this.showPopupOnBldgs(
            this.state.cood,
            {},
            'Please enter building details on the left panel.',
            false,
            this.props.buildingdataAddPermission,
        );
    }

    public showPopupOnBldgs = (coordinates, singularBuldingData, msg, showButton, permission) => {
        // this.map.fire('closeAllPopups');
        // const popupWithData = new mapboxgl.Popup({
        //     closeButton: false,
        //     closeOnClick: true,
        //     className: 'popup',
        // });

        const content = popupElement(
            singularBuldingData,
            msg,
            this.handleButtonClick,
            showButton,
            permission,
        );

        this.map.on('closeAllPopups', () => {
            popup.remove();
            // popupWithData.remove();
        });

        this.setState({ cood: coordinates });
        popup.remove();
        // popupWithData.remove();

        if (Object.keys(singularBuldingData).length > 2) {
            // popup.remove();
            popup.setLngLat(coordinates)
                .setDOMContent(
                    content,
                ).addTo(this.map);
        } else {
            // popupWithData.remove();
            popup.setLngLat(coordinates)
                .setDOMContent(
                    content,
                ).addTo(this.map);
        }
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

    public getHouseId = (id) => {
        const houseID = this.props.buildings.filter(item => item.osmId === id);
        if (houseID.length > 0) {
            return `House Owner Id: ${houseID[0].houseOwnerId}`;
        }
        return 'OSM Id missing';
    }

    public getOSMidFromHouseId = (houseID) => {
        const osmId = this.props.buildings
            .filter(item => Number(item.houseOwnerId) === Number(houseID));

        if (osmId.length > 0) {
            return osmId[0].osmId;
        }
        return null;
    }

    public handleBuildingClick = (clicked) => {
        let searchId;
        if (!clicked) {
            const housId = this.state.searchTerm;
            searchId = this.getOSMidFromHouseId(housId);
        } else {
            searchId = this.state.searchTerm;
        }

        if (searchId) {
            // looking for
            const { singularBuldingData, buildingdataAddPermission } = this.props;
            // const coordinatesObj = this.props.buildinggeojson
            //     .features.filter(b => Number(searchId) === Math.round(b.properties.osm_id));
            const coordinatesObj = this.state.buildingpoints
                .features.filter(b => Number(searchId) === b.properties.osmId);
            let cood = [];
            if (coordinatesObj.length > 0) {
                cood = coordinatesObj[0].geometry.coordinates;
                // here
                const singularBData = getSingularBuildingData(searchId, this.props.buildings);
                if (Object.keys(singularBData).length > 0) {
                    this.props.setSingularBuilding(true, singularBData);
                    this.setState({ searchTerm: '' });
                    this.map.easeTo({
                        zoom: 19,
                        duration: 500,
                        center: cood,
                    });
                    // this.showPopupOnBldgs(cood, `OSM_ID: ${searchId}`);

                    this.showPopupOnBldgs(
                        cood,
                        singularBData,
                        this.getHouseId(searchId),
                        true,
                        buildingdataAddPermission,
                    );
                } else {
                    // alert('No data available');
                    this.setState({ searchTerm: '' });
                    this.props.setSingularBuilding(true, { osmId: searchId, coordinatesObj });
                    if (buildingdataAddPermission) {
                        this.showPopupOnBldgs(
                            coordinatesObj[0].geometry.coordinates,
                            {},
                            'To add data click the following button',
                            true,
                            buildingdataAddPermission,
                        );
                    } else {
                        this.showPopupOnBldgs(
                            coordinatesObj[0].geometry.coordinates,
                            {},
                            'No Building Data Available',
                            false,
                            buildingdataAddPermission,
                        );
                    }
                    this.setState({ cood: coordinatesObj[0].geometry.coordinates });
                }
            } else {
                // alert('No data available');
                this.setState({ searchTerm: '' });
                this.props.setSingularBuilding(true, { osmId: searchId, coordinatesObj });
                console.warn('no coordinates found', coordinatesObj);
            }
        } else {
            this.props.setSingularBuilding(true, { osmId: searchId });
            this.setState({ searchTerm: '' });
            console.warn('no search id');
            // alert('No data available');
        }
    };

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

    public handleInputChangeFlood = (e) => {
        const val = e.target.value;
        this.setState({ opacityFlood: String(e.target.value) });

        // here
        this.map.setPaintProperty(`raster-flood-${this.props.rasterLayer}`, 'raster-opacity', Number(val));
    }

    public render() {
        const { searchTerm } = this.state;
        const mapStyle = {
            position: 'absolute',
            width: '70%',
            left: 'calc(30% - 60px)',
            top: 0,
            // bottom: 0,
            height: '100vh',
            zIndex: 20,
        };

        return (
            <div>
                <div style={mapStyle} ref={(el) => { this.mapContainer = el; }} />
                <div className={styles.searchBox}>
                    <button
                        type="button"
                        onClick={() => this.handleBuildingClick(false)}
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
                        placeholder={'Enter House Id'}
                    />
                </div>
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
