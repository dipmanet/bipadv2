import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import '@watergis/mapbox-gl-legend/css/styles.css';


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
            lng: 85.64347922706821,
            lat: 28.013604885888867,
            zoom: 9.8,
            incidentYear: '0',
            playState: true,
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom,
        } = this.state;

        const { clickedItem, incidentList } = this.props;
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

        // this.map.addControl(new MapboxLegendControl({},
        // { reverseOrder: false }), 'bottom-right');
        this.map.on('idle', () => {
            const { rightElement, enableNavBtns } = this.props;
            if (rightElement === 0) {
                enableNavBtns('Right');
            } else if (rightElement === 5) {
                enableNavBtns('Left');
            } else {
                enableNavBtns('both');
            }
        });
        this.map.on('style.load', () => {
            // const updateArea = (e) => {
            //     console.log(e);
            // };
            // const draw = new MapboxDraw({
            //     displayControlsDefault: false,
            //     controls: {
            //         polygon: true,
            //         trash: true,
            //     },
            //     defaultMode: 'draw_polygon',
            // });
            // this.map.addControl(draw, 'top-right');

            // this.map.on('draw.create', updateArea);
            // this.map.on('draw.delete', updateArea);
            // this.map.on('draw.update', updateArea);
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
            const hazardTitle = [...new Set(incidentList.features.map(
                item => item.properties.hazardTitle,
            ))];
            hazardTitle.map((layer) => {
                this.map.addSource(layer, {
                    type: 'geojson',
                    data: this.getGeoJSON(layer, incidentList),
                });
                this.map.addLayer(
                    {
                        id: `incidents-${layer}`,
                        type: 'circle',
                        source: layer,
                        layout: {},
                        paint: {
                            'circle-color': ['get', 'hazardColor'],
                        },
                    },
                );

                return null;
            });
        });
    }

    public componentDidUpdate(prevProps) {
        if (this.state.playState) {
            this.handleStateChange();
        }
        if (prevProps.clickedItem !== this.props.clickedItem) {
            this.handleStateChange();
        }
        const hazardTitle = [...new Set(this.props.incidentList.features.map(
            item => item.properties.hazardTitle,
        ))];

        if (prevProps.clickedItem !== this.props.clickedItem) {
            if (this.props.clickedItem === 'all') {
                hazardTitle.map((ht) => {
                    this.map.setLayoutProperty(`incidents-${ht}`, 'visibility', 'visible');
                    return null;
                });
            } else {
                hazardTitle.map((ht) => {
                    this.map.setLayoutProperty(`incidents-${ht}`, 'visibility', 'none');
                    return null;
                });
                this.map.setLayoutProperty(`incidents-${this.props.clickedItem}`, 'visibility', 'visible');
            }
        }
        // const inci = this.map.getLayer('incidents-Earthquake');
    }

    public componentWillUnmount() {
        this.map.remove();
        clearInterval(this.interval);
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
        if (this.props.clickedItem === 'all') {
            filters = ['all', ['>', 'incidentOn', yearInt], ['<', 'incidentOn', nextYear]];
        } else {
            filters = ['all',
                ['>', 'incidentOn', yearInt],
                ['<', 'incidentOn', nextYear],
                ['==', 'hazardTitle', this.props.clickedItem]];
        }
        const hazardTitle = [...new Set(this.props.incidentList.features.map(
            item => item.properties.hazardTitle,
        ))];
        const mapLayer = this.map.getLayer('Buildings');

        if (typeof mapLayer !== 'undefined') {
            hazardTitle.map((layer) => {
                this.map.setFilter(`incidents-${layer}`, filters);
                return null;
            });
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
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
