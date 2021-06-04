import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import MapboxLegendControl from '@watergis/mapbox-gl-legend';
import ci from '../RightPaneContents/RightPane4/ci';
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
    incidentListSelectorIP,
} from '#selectors';


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
const arr = cidata.features.map(item => [
    item.properties.Longitude,
    item.properties.Latitude,
]);

const points = turf.points(arr);


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
                // data here
                const dataArr = datad.features[0].geometry.coordinates;
                console.log('selected', dataArr);
                const searchWithin = turf.multiPolygon([dataArr], {});

                const ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
                // extract the features from these points
                console.log('pts within:', ptsWithin);
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
                handleDrawSelectedData(result);
                // this.setState({ ciChartData: result });
            };
            this.map.addControl(draw, 'top-right');

            this.map.on('draw.create', updateArea);
            // this.map.on('draw.delete', updateArea);
            // this.map.on('draw.update', updateArea);

            this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
        });
    }


    public componentWillUnmount() {
        this.map.remove();
        clearInterval(this.interval);
    }

    public getTitleFromLatLng = (featureObject) => {
        const latToCompare = featureObject.geometry.coordinates[1];
        const lngToCompare = featureObject.geometry.coordinates[0];
        const hT = cidata.features.filter(fC => fC.geometry.coordinates[0] === lngToCompare
            && fC.geometry.coordinates[1] === latToCompare)[0].properties.CI;
        return hT;
    }

    public getGeoJSON = (filterBy: string, datum: any) => {
        const geoObj = {};
        geoObj.type = 'FeatureCollection';
        geoObj.name = filterBy;
        geoObj.features = [];
        const d = datum.features.filter(item => item.properties.hazardTitle === filterBy);
        geoObj.features.push(...d);
        return geoObj;
    }

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
        hazardTitle.map((layer) => {
            this.map.setFilter(`incidents-${layer}`, filters);
            return null;
        });
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
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
