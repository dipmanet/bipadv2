import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';

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


class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lng: 85.90010912899756,
            lat: 27.821772478807212,
            zoom: 11,
            incidentYear: '0',
            playState: true,
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom,
        } = this.state;

        const { bahrabiseLandSlide, currentPage } = this.props;
        if (currentPage === 6) {
            this.interval = setInterval(() => {
                this.setState((prevState) => {
                    if (Number(prevState.incidentYear) < 10) {
                        return ({ incidentYear: String(Number(prevState.incidentYear) + 1) });
                    }
                    return ({ incidentYear: '0' });
                });
            }, 1000);
        }

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
            console.log('geodata: ', geoData);
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
            console.log('map:', this.map);
            this.map.moveLayer('incidents-layer');
        });
    }

    public componentDidUpdate(prevProps) {
        const { currentPage } = this.props;
        if (currentPage === 6) {
            if (this.state.playState) {
                this.handleStateChange();
            }
        }
        if (currentPage !== prevProps.currentPage && currentPage === 7) {
            this.map.setLayoutProperty('lsPoly', 'visibility', 'visible');
        }
    }

    public componentWillUnmount() {
        const { currentPage } = this.props;

        this.map.remove();
        if (currentPage === 6) {
            clearInterval(this.interval);
        }
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
