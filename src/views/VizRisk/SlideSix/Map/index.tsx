import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import * as turf from '@turf/turf';
import { mapSources, vizriskmapStyles } from '#constants';

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

import {
    getWardFilter,
} from '#utils/domain';
import RightPane from '../RightPane';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5rdXIyMCIsImEiOiJja2tiOW4wNGIwNDh5MnBsY3EzeDNmcTV4In0.d4LelcSFDElA3BctgWvs1A';
const colorGrade = [
    '#394da7',
];

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
            lat: 28.42722351741294,
            lng: 81.12424608127894,
            zoom: 11,
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom,
        } = this.state;
        const {
            bounds,
            // provinces,
            districts,
            municipalities,
            wards,

            selectedProvinceId: provinceId,
            selectedDistrictId: districtId,
            selectedMunicipalityId: municipalityId,
        } = this.props;
        const mapping = [];
        if (wards) {
            wards.map((item) => {
                const { id } = item;
                if (item.municipality === 58007) {
                    mapping.push({ id, value: 1 });
                }
                return null;
            });
        }

        const color = this.generateColor(1, 0, colorGrade);
        const colorPaint = this.generatePaint(color);
        // Container to put React generated content in.

        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/ankur20/ckkwdvg544to217orazo712ra',
            center: [lng, lat],
            zoom,
            minZoom: 9,
            maxZoom: 15,
            bearing: 0,
        });
        // San Francisco
        const origin = [-122.414, 37.776];

        // Washington DC
        const destination = [-77.032, 38.913];

        // A simple line from origin to destination.
        const route = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: [origin, destination],
                    },
                },
            ],
        };

        // Calculate the distance in kilometers between route start/end point.
        const lineDistance = turf.length(route.features[0]);

        const arc = [];

        // Number of steps to use in the arc and animation, more steps means
        // a smoother arc and animation, but too many steps will result in a
        // low frame rate
        const steps = 500;

        // Draw an arc between the `origin` & `destination` of the two points
        for (let i = 0; i < lineDistance; i += lineDistance / steps) {
            const segment = turf.along(route.features[0], i);
            arc.push(segment.geometry.coordinates);
        }

        // Update the route with calculated arc coordinates
        route.features[0].geometry.coordinates = arc;

        // Used to increment the value of the point measurement against the route.
        const counter = 0;


        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        this.map.on('style.load', () => {
            const visibleLayout = {
                visibility: 'visible',
            };
            const hiddenLayout = {
                visibility: 'none',
            };
            const tileUrl6 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in100',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            this.map.addSource('route', {
                type: 'geojson',
                data: route,
            });
            this.map.addSource('rasterrajapur100', {
                type: 'raster',
                tiles: [tileUrl6],
                tileSize: 256,

            });
            this.map.addLayer(
                {
                    id: 'raster-rajapur-100',
                    type: 'raster',
                    source: 'rasterrajapur100',
                    layout: {},
                    paint: {
                        'raster-opacity': 0.7,
                    },
                },
            );
            this.map.addLayer({
                id: 'route',
                source: 'route',
                type: 'line',
                paint: {
                    'line-width': 2,
                    'line-color': '#007cbf',
                },
            });

            this.map.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
            });
            this.map.addLayer({
                id: 'ward-fill',
                type: 'fill',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                layout: hiddenLayout,
                paint: colorPaint,
                filter: getWardFilter(5, 65, 58007, wards),
            }, 'water');

            this.map.addSource('contours', {
                type: 'vector',
                url: 'mapbox://mapbox.mapbox-terrain-v2',
            });
            this.map.addLayer({
                id: 'contours',
                type: 'line',
                source: 'contours',
                'source-layer': 'contour',
                layout: {
                    // make layer visible by default
                    visibility: 'visible',
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#ffffff',
                    'line-width': 1,
                },
            });

            this.map.setLayoutProperty('density-b7o1uo', 'visibility', 'visible');
            this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'none');
            this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'none');
            this.map.moveLayer('density-b7o1uo', 'ward-fill');
            this.map.setLayoutProperty('farmfields-1l9fpy', 'visibility', 'none');
            this.map.setLayoutProperty('sandrajapur-44t4e0', 'visibility', 'none');
        });
    }

    public componentWillReceiveProps(nextProps) {
        const {
            showRaster,
            rasterLayer,
            showSlide,
        } = this.props;

        if (this.map.isStyleLoaded()) {
            if (nextProps.showSlide !== showSlide) {
                if (nextProps.showSlide === 'population') {
                    this.map.moveLayer('density-b7o1uo', 'ward-fill');
                    this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'none');
                    this.map.setLayoutProperty('density-b7o1uo', 'visibility', 'visible');
                    this.map.setPaintProperty('density-b7o1uo', 'fill-opacity', 1);
                    this.map.setLayoutProperty('ward-fill', 'visibility', 'none');
                    this.map.moveLayer('5km-buffer-d4g08s');
                    this.map.moveLayer('2km-buffer-4xvqe1');
                }
                if (nextProps.showSlide === 'hazard') {
                    this.map.moveLayer('ward-fill', 'density-b7o1uo');
                    this.map.setLayoutProperty('ward-fill', 'visibility', 'visible');
                    this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'visible');
                    this.map.setPaintProperty('ward-fill', 'fill-opacity', 1);
                    this.map.setLayoutProperty('density-b7o1uo', 'visibility', 'none');
                    this.map.moveLayer('5km-buffer-d4g08s');
                    this.map.moveLayer('2km-buffer-4xvqe1');
                }

                if (nextProps.showSlide === 'all') {
                    this.map.setLayoutProperty('density-b7o1uo', 'visibility', 'visible');
                    this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'visible');
                    this.map.moveLayer('density-b7o1uo', 'ward-fill');
                    this.map.setLayoutProperty('ward-fill', 'visibility', 'visible');
                    this.map.setPaintProperty('ward-fill', 'fill-opacity', 0.5);
                    this.map.moveLayer('5km-buffer-d4g08s');
                    this.map.moveLayer('2km-buffer-4xvqe1');
                }
            }
        }
    }

    public componentWillUnmount() {
        this.map.remove();
    }

    public generatePaint = color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'value'],
            ...color,
        ],
        'fill-opacity': 0.87,
    });

    public generateColor = (maxValue, minValue, colorMapping) => {
        const newColor = [];
        const { length } = colorMapping;
        const range = maxValue - minValue;
        colorMapping.forEach((color, i) => {
            const val = minValue + ((i * range) / (length - 1));
            newColor.push(val);
            newColor.push(color);
        });
        return newColor;
    };

    public render() {
        const mapStyle = {
            position: 'absolute',
            width: '70%',
            right: '65px',
            top: 0,
            bottom: 0,
            left: 0,
        };

        return (
            <div>
                <div style={mapStyle} ref={(el) => { this.mapContainer = el; }} />
                {/* <RightPane /> */}
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
