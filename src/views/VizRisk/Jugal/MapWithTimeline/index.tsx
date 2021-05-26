import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxLegendControl from '@watergis/mapbox-gl-legend';
import { mapSources } from '#constants';
import SchoolGeoJSON from '../Data/rajapurGEOJSON';
import demographicsData from '../Data/demographicsData';
import styles from './styles.scss';
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

import {
    getWardFilter,
} from '#utils/domain';

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

const colorGrade = [
    '#ffedb8',
    '#ffffff',
];

const hoveredWardId = null;
const populationWardExpression = [
    'interpolate',
    ['linear'],
    ['feature-state', 'value'],
    1, '#fe9b2a', 2, '#fe9b2a',
    3, '#fe9b2a', 4, '#9a3404',
    5, '#d95f0e', 6, '#fe9b2a',
    7, '#ffffd6', 8, '#fe9b2a',
    9, '#fed990', 10, '#d95f0e',
];
const {
    criticalinfrastructures,
    evaccenters,
} = SchoolGeoJSON;

class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lat: 28.015490220644214,
            lng: 85.79108507481781,
            zoom: 11,
            wardNumber: 'Hover to see ward number',
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom,
        } = this.state;

        const mapping = [];

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

        this.map.addControl(new MapboxLegendControl({}, { reverseOrder: false }), 'bottom-right');
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
            const updateArea = (e) => {
                console.log(e);
            };
            const draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true,
                },
                defaultMode: 'draw_polygon',
            });
            this.map.addControl(draw, 'top-right');

            this.map.on('draw.create', updateArea);
            this.map.on('draw.delete', updateArea);
            this.map.on('draw.update', updateArea);

            this.map.addSource('incidents', {
                type: 'geojson',
                data: this.props.incidentList,
            });
            this.map.addLayer(
                {
                    id: 'incidents-layer',
                    type: 'circle',
                    source: 'incidents',
                    layout: {},
                    paint: {
                        'circle-color': '#ff0000',
                    },
                },
            );
        });
    }

    public componentDidUpdate() {
        const inci = this.map.getLayer('incidents-layer');
        if (!inci) {
            this.map.addSource('incidents', {
                type: 'geojson',
                data: this.props.incidentList,
            });
            this.map.addLayer(
                {
                    id: 'incidents-layer',
                    type: 'circle',
                    source: 'incidents',
                    layout: {},
                    paint: {
                        'circle-color': '#ff0000',
                    },
                },
            );
        }
    }

    public componentWillUnmount() {
        this.map.remove();
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
                <div className={styles.incidentsSlider}>
                    <input
                        onChange={this.handleInputChange}
                        id="slider"
                        type="range"
                        min="0"
                        max="11"
                        step="1"
                        value="0"
                    />
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
