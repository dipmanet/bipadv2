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
    '#918b61',
    // '#5aa8a3',
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

        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/ankur20/ckkwdvg544to217orazo712ra',
            center: [lng, lat],
            zoom,
            minZoom: 9,
            maxZoom: 15,
            bearing: 0,
        });
        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        this.map.on('style.load', () => {
            const visibleLayout = {
                visibility: 'visible',
            };
            const hiddenLayout = {
                visibility: 'none',
            };
            const tileUrl1 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in5',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            const tileUrl2 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:rajapur-meteor-flood-10',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            const tileUrl3 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in20',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            const tileUrl4 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in50',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            const tileUrl5 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in75',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
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
            const tileUrl7 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in200',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            const tileUrl8 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in250',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            const tileUrl9 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in500',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            const tileUrl10 = [
                `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                '&version=1.1.1',
                '&service=WMS',
                '&request=GetMap',
                '&layers=Bipad:Rajapur_FD_1in1000',
                '&tiled=true',
                '&width=256',
                '&height=256',
                '&srs=EPSG:3857',
                '&bbox={bbox-epsg-3857}',
                '&transparent=true',
                '&format=image/png',
            ].join('');
            this.map.addSource('rasterrajapur5', {
                type: 'raster',
                tiles: [tileUrl1],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur10', {
                type: 'raster',
                tiles: [tileUrl2],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur20', {
                type: 'raster',
                tiles: [tileUrl3],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur50', {
                type: 'raster',
                tiles: [tileUrl4],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur75', {
                type: 'raster',
                tiles: [tileUrl5],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur100', {
                type: 'raster',
                tiles: [tileUrl6],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur200', {
                type: 'raster',
                tiles: [tileUrl7],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur250', {
                type: 'raster',
                tiles: [tileUrl8],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur500', {
                type: 'raster',
                tiles: [tileUrl9],
                tileSize: 256,

            });
            this.map.addSource('rasterrajapur1000', {
                type: 'raster',
                tiles: [tileUrl10],
                tileSize: 256,

            });
            this.map.addLayer(
                {
                    id: 'raster-rajapur-5',
                    type: 'raster',
                    source: 'rasterrajapur5',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.addLayer(
                {
                    id: 'raster-rajapur-10',
                    type: 'raster',
                    source: 'rasterrajapur10',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.addLayer(
                {
                    id: 'raster-rajapur-20',
                    type: 'raster',
                    source: 'rasterrajapur20',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.addLayer(
                {
                    id: 'raster-rajapur-50',
                    type: 'raster',
                    source: 'rasterrajapur50',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.addLayer(
                {
                    id: 'raster-rajapur-75',
                    type: 'raster',
                    source: 'rasterrajapur75',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.addLayer(
                {
                    id: 'raster-rajapur-100',
                    type: 'raster',
                    source: 'rasterrajapur100',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );

            this.map.addLayer(
                {
                    id: 'raster-rajapur-200',
                    type: 'raster',
                    source: 'rasterrajapur200',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );

            this.map.addLayer(
                {
                    id: 'raster-rajapur-250',
                    type: 'raster',
                    source: 'rasterrajapur250',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.addLayer(
                {
                    id: 'raster-rajapur-500',
                    type: 'raster',
                    source: 'rasterrajapur500',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
                    },
                },
            );
            this.map.addLayer(
                {
                    id: 'raster-rajapur-1000',
                    type: 'raster',
                    source: 'rasterrajapur1000',
                    layout: {},
                    paint: {
                        'raster-opacity': 1,
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
                layout: visibleLayout,
                paint: colorPaint,
                filter: getWardFilter(5, 65, 58007, wards),
            }, 'water');


            this.map.setZoom(11.4);
            this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-20', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-75', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-200', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-250', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-500', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-1000', 'visibility', 'none');

            this.map.setLayoutProperty('density-b7o1uo', 'visibility', 'visible');
            this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'none');
            this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'none');
            this.map.moveLayer('density-b7o1uo', '5km-buffer-d4g08s');
            this.map.moveLayer('2km-buffer-4xvqe1', '5km-buffer-d4g08s');
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
        const resetRasterLayers = () => {
            this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-20', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-75', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-200', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-250', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-500', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-1000', 'visibility', 'none');
        };
        if (this.map.isStyleLoaded()) {
            if (nextProps.showSlide !== showSlide) {
                if (nextProps.showSlide === 'population') {
                    resetRasterLayers();
                    this.map.moveLayer('density-b7o1uo', 'ward-fill');
                    this.map.setLayoutProperty('density-b7o1uo', 'visibility', 'visible');
                    this.map.setPaintProperty('density-b7o1uo', 'fill-opacity', 1);
                    this.map.setLayoutProperty('ward-fill', 'visibility', 'none');
                    this.map.moveLayer('5km-buffer-d4g08s');
                    this.map.moveLayer('2km-buffer-4xvqe1');
                }
                if (nextProps.showSlide === 'hazard') {
                    this.map.moveLayer('ward-fill', 'density-b7o1uo');
                    this.map.setLayoutProperty('ward-fill', 'visibility', 'visible');
                    this.map.setPaintProperty('ward-fill', 'fill-opacity', 1);
                    this.map.setLayoutProperty(`raster-rajapur-${rasterLayer}`, 'visibility', 'visible');
                    this.map.setLayoutProperty('density-b7o1uo', 'visibility', 'none');
                    this.map.moveLayer('5km-buffer-d4g08s');
                    this.map.moveLayer('2km-buffer-4xvqe1');
                    this.map.moveLayer('water');
                }

                if (nextProps.showSlide === 'all') {
                    this.map.setLayoutProperty('density-b7o1uo', 'visibility', 'visible');
                    this.map.moveLayer('density-b7o1uo', 'ward-fill');
                    this.map.setLayoutProperty('ward-fill', 'visibility', 'visible');
                    this.map.setLayoutProperty(`raster-rajapur-${rasterLayer}`, 'visibility', 'visible');
                    this.map.setPaintProperty('ward-fill', 'fill-opacity', 0.5);
                    this.map.moveLayer('5km-buffer-d4g08s');
                    this.map.moveLayer('2km-buffer-4xvqe1');
                }
            }
            if (nextProps.rasterLayer !== rasterLayer) {
                if (nextProps.rasterLayer === '5') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'visible');
                }
                if (nextProps.rasterLayer === '10') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'visible');
                }
                if (nextProps.rasterLayer === '20') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-20', 'visibility', 'visible');
                }
                if (nextProps.rasterLayer === '50') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'visible');
                }
                if (nextProps.rasterLayer === '100') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'visible');
                }
                if (nextProps.rasterLayer === '200') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-200', 'visibility', 'visible');
                }
                if (nextProps.rasterLayer === '250') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-250', 'visibility', 'visible');
                }
                if (nextProps.rasterLayer === '500') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-500', 'visibility', 'visible');
                }
                if (nextProps.rasterLayer === '1000') {
                    resetRasterLayers();
                    this.map.setLayoutProperty('raster-rajapur-1000', 'visibility', 'visible');
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
