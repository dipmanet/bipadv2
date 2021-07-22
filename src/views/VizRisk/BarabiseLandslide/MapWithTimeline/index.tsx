import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { drawStyle } from '../Data/mapbox';

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
} from '#selectors';


import TimelineSlider from './TimelineSlider';

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const epochs = [2014, 2015, 2016, 2017, 2018, 2019, 2020];

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
const ciRef = {
    health: 'Hospital',
    finance: 'Financial Institution',
    education: 'Education Instution',
};

class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lng: 85.90010912899756,
            lat: 27.821772478807212,
            zoom: 11,
            incidentYear: '9',
            playState: false,
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom,
        } = this.state;

        const { bahrabiseLandSlide, currentPage } = this.props;
        // if (currentPage === 6) {
        //     this.interval = setInterval(() => {
        //         this.setState((prevState) => {
        //             if (Number(prevState.incidentYear) < 10) {
        //                 return ({ incidentYear: String(Number(prevState.incidentYear) + 1) });
        //             }
        //             return ({ incidentYear: '0' });
        //         });
        //     }, 1000);
        // }

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: process.env.REACT_APP_VIZRISK_BAHRABISE_LANDSLIDE,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });


        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // this.map.addControl(new MapboxLegendControl({},
        // { reverseOrder: false }), 'bottom-right');

        this.map.on('style.load', () => {
            this.map.setLayoutProperty('bahrabiseWardOutline', 'visibility', 'visible');
            this.map.setLayoutProperty('bahrabiseWardText', 'visibility', 'visible');
            this.map.setLayoutProperty('bahrabiseForest', 'visibility', 'none');
            this.map.setLayoutProperty('bahrabiseRoads', 'visibility', 'none');
            this.map.addSource('hillshadeBahrabiseLocal', {
                type: 'raster',
                tiles: [this.getHillshadeLayer()],
                tileSize: 256,
            });

            this.map.addLayer(
                {
                    id: 'bahrabiseHillshadeLocal',
                    type: 'raster',
                    source: 'hillshadeBahrabiseLocal',
                    layout: {},
                    paint: {
                        'raster-opacity': 0.25,
                    },
                },
            );


            const features = this.props.bahrabiseLandSlide.map(item => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: item.position,
                },
                properties: {
                    date: item.date,
                },
            }));
            const geoData = {
                type: 'FeatureCollection',
                features,
            };
            this.map.addSource('incidents', {
                type: 'geojson',
                data: geoData,
            });
            this.map.addLayer(
                {
                    id: 'incidents-layer',
                    type: 'circle',
                    source: 'incidents',
                    layout: {},
                    paint: {
                        'circle-color': '#923f3f',
                    },
                },
            );
            this.map.moveLayer('incidents-layer');

            // this.handlePlayPause();
        });
    }

    public componentDidUpdate(prevProps) {
        const {
            yearClicked,
            currentPage,
            landslideYear,
            cidata,
            chartReset,
        } = this.props;


        if (currentPage === 6) {
            if (this.state.playState) {
                this.handleStateChange();
            }
        }
        if (currentPage !== prevProps.currentPage && currentPage === 7) {
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
            this.generateYearsArr().map((layer) => {
                this.map.setLayoutProperty(`${layer}`, 'visibility', 'visible');
                return null;
            });

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

            const resetArea = () => {
                this.props.handlechartReset(!chartReset);
            };
            epochs.map(ci => this.map.on('mouseenter', `${ci}`, (e) => {
                if (e) {
                    const { lngLat } = e;
                    console.log('e', e.features[0]);
                    const coordinates = [lngLat.lng, lngLat.lat];
                    const perimeter = e.features[0].properties.Perim_m;
                    const area = e.features[0].properties.Area_m2;
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                    <p>Perimeter: ${perimeter}</p>
                    <p>Area: ${area}</p>
                </div>
                `,
                    ).addTo(this.map);
                }
            }));
            epochs.map(ci => this.map.on('mouseleave', `${ci}`, () => {
                this.map.getCanvas().style.cursor = '';
                popup.remove();
            }));
            const updateArea = (e) => {
                const { getPolygon, handleDrawSelectedData } = this.props;
                console.log('cidata,', cidata);
                const arr = cidata.map(item => item.point.coordinates);
                const points = turf.points(arr);
                // const { points, buildingpoints } = this.state;
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
                                hazardTitle: ciRef[this.getTitleFromLatLng(i, cidata)],
                            });
                        return null;
                    });

                // getPolygon(dataArr);

                console.log('result', result);

                // const coordList = dataArr[0]
                //     .map(position => [parseFloat(position[0]), parseFloat(position[1])]);
                // const line = turf.lineString(coordList);
                // const bbox = turf.bbox(line);

                // const point1 = this.map.project([bbox[0], bbox[1]]);
                // const point2 = this.map.project([bbox[2], bbox[3]]);
                // const farmlands = this.map.queryRenderedFeatures(
                //     [point1, point2],
                //     { layers: ['Farmlands'] },
                // );
                // const forest = this.map.queryRenderedFeatures(
                //     [point1, point2],
                //     { layers: ['Forest'] },
                // );
                // const buildingsCount = ptsWithinBuildings.features.length;
                // result.push({
                //     buildings: buildingsCount,
                //     forest: forest.length,
                //     farmlands: farmlands.length,
                // });
                handleDrawSelectedData(result);

                // this.map.fitBounds(bbox, {
                //     padding: 20,
                // });
            };

            this.map.addControl(draw, 'top-right');
            this.map.on('draw.modechange', (e) => {
                const data = draw.getAll();
                // if (draw.getMode() === 'draw_polygon') {
                //     const pids = [];
                //     this.props.handleDrawResetData(true);
                //     // ID of the added template empty feature
                //     const lid = data.features[data.features.length - 1].id;

                //     data.features.forEach((f) => {
                //         if (f.geometry.type === 'Polygon' && f.id !== lid) {
                //             pids.push(f.id);
                //         }
                //     });
                //     draw.delete(pids);
                // }
            });

            this.map.on('draw.delete', resetArea);
            this.map.on('draw.create', updateArea);
            this.map.on('draw.update', updateArea);
        }

        if (currentPage === 7) {
            if (yearClicked !== prevProps.yearClicked) {
                this.resetPolyLayers();
                landslideYear.map((layer) => {
                    this.map.setLayoutProperty(`${layer}`, 'visibility', 'visible');
                    return null;
                });
            }
        }
    }

    public componentWillUnmount() {
        const { currentPage } = this.props;

        this.map.remove();
        if (currentPage === 6) {
            clearInterval(this.interval);
        }
    }

    public getTitleFromLatLng = (featureObject, cidata) => {
        const latToCompare = featureObject.geometry.coordinates[1];
        const lngToCompare = featureObject.geometry.coordinates[0];
        const hT = cidata.filter(fC => fC.point.coordinates[0] === lngToCompare
            && fC.point.coordinates[1] === latToCompare)[0];

        if (hT) {
            return hT.resourceType;
        }
        return [];
    }

    public generateYearsArr = () => {
        // const max = new Date().getFullYear() ;
        const max = 2020;
        const min = max - 6;
        const years = [];
        // eslint-disable-next-line no-plusplus
        for (let i = max; i >= min; i--) {
            years.push(i);
        }

        return years;
    };

    public resetPolyLayers = () => {
        this.generateYearsArr().map((l) => {
            this.map.setLayoutProperty(`${l}`, 'visibility', 'none');
            return null;
        });
    }

    public getGeoJSON = (filterBy: string, data: any) => {
        const geoObj = {};
        geoObj.type = 'FeatureCollection';
        geoObj.name = filterBy;
        geoObj.features = [];
        const d = data.features.filter(item => item.properties.hazardTitle === filterBy);
        geoObj.features.push(...d);
        return geoObj;
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

    public handlePlayPause = () => {
        this.setState(prevState => ({ playState: !prevState.playState }));
        if (this.state.playState) {
            clearInterval(this.interval);
        } else {
            this.interval = setInterval(() => {
                this.setState((prevState) => {
                    if (Number(prevState.incidentYear) < 10) {
                        return ({ incidentYear: String(Number(prevState.incidentYear) + 1) });
                    }
                    return ({ incidentYear: '0' });
                });
            }, 1000);
        }
    };

    public filterOnMap = (val) => {
        const yearInt = new Date(`${2011 + Number(val)}-01-01`).getTime();
        const nextYear = new Date(`${2011 + Number(val) + 1}-01-01`).getTime();
        let filters = [];
        // if (this.props.clickedItem === 'all') {
        filters = ['all', ['>', 'date', yearInt], ['<', 'date', nextYear]];
        // }

        // else {
        //     filters = ['all',
        //         ['>', 'incidentOn', yearInt],
        //         ['<', 'incidentOn', nextYear],
        //         ['==', 'hazardTitle', this.props.clickedItem]];
        // }
        // const hazardTitle = [...new Set(this.props.incidentList.features.map(
        //     item => item.properties.hazardTitle,
        // ))];
        const mapLayer = this.map.getLayer('bahrabiseBuildings');

        if (typeof mapLayer !== 'undefined') {
            // hazardTitle.map((layer) => {
            this.map.setFilter('incidents-layer', filters);
            // return null;
            // });
        }
    }

    public handleInputChange = (e) => {
        const val = e.target.value;
        this.props.handleIncidentChange(val);
        this.filterOnMap(val);
        this.setState({ incidentYear: e.target.value });
    }

    public handleStateChange = () => {
        const val = this.state.incidentYear;
        this.props.handleIncidentChange(val);
        this.filterOnMap(val);
        // this.setState({ incidentYear: e.target.value });
    }

    public getHillshadeLayer = () => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        '&layers=Bipad:Barhabise_hillshade',
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('');

    public render() {
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
                {
                    this.props.currentPage === 6
                    && (
                        <TimelineSlider
                            onChange={this.handleInputChange}
                            id="slider"
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={this.state.incidentYear}
                            playState={this.state.playState}
                            onPlayBtnClick={this.handlePlayPause}
                        />
                    )
                }
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
