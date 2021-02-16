import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import turf from 'turf';
import { mapSources, vizriskmapStyles } from '#constants';
import SchoolGeoJSON from '../../SchoolGeoJSON';
import SafeshelterGeoJSON from '../../safeShelter';
import ManualIcon from '#resources/images/chisapanistation.png';


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
            districts,
            municipalities,
            wards,

            selectedProvinceId: provinceId,
            selectedDistrictId: districtId,
            selectedMunicipalityId: municipalityId,
        } = this.props;

        const { schools: schoolgeo } = SchoolGeoJSON;
        const { chisapani } = SchoolGeoJSON;
        // const { safeshelter } = SafeshelterGeoJSON;
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
        });

        this.map.setZoom(10);
        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        this.map.on('style.load', () => {
            const visibleLayout = {
                visibility: 'visible',
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

            this.map.loadImage(
                ManualIcon,
                (error, image) => {
                    if (error) throw error;
                    this.map.addImage('cat', image);
                    this.map.addSource('catpoint', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [81.28247497323619, 28.638615848729966],
                                    },
                                },
                            ],
                        },
                    });
                    this.map.addLayer({
                        id: 'points',
                        type: 'symbol',
                        source: 'catpoint',
                        layout: {
                            'icon-image': 'cat',
                            'icon-size': 1,
                        },
                    });
                },
            );

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
            this.map.addSource('schoolsRajapur', {
                type: 'geojson',
                data: schoolgeo,
            });
            this.map.addSource('chisapani', {
                type: 'geojson',
                data: chisapani,
            });
            this.map.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
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

            this.map.addLayer(
                {
                    id: 'school-rajapur',
                    type: 'circle',
                    source: 'schoolsRajapur',
                    layout: {},
                    paint: {
                        'circle-color': '#ff4811',
                        'circle-radius': 4,
                    },
                },
            );
            this.map.addLayer(
                {
                    id: 'chisapani-bardiya',
                    type: 'circle',
                    source: 'chisapani',
                    layout: {},
                    paint: {
                        'circle-color': '#ffff00',
                        'circle-radius': 6,
                    },
                },
            );
            this.map.addLayer({
                id: 'ward-fill',
                type: 'fill',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                layout: visibleLayout,
                paint: colorPaint,
                filter: getWardFilter(5, 65, 58007, wards),
            }, 'rajapurbuildingfootprint-feb10');


            this.map.addLayer({
                id: 'ward-outline',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'line',
                paint: vizriskmapStyles.ward.outline,
                layout: visibleLayout,
                filter: getWardFilter(5, 65, 58007, wards),
            });

            this.map.addLayer({
                id: 'ward-label',
                'source-layer': mapSources.nepalCentroid.layers.ward,
                type: 'symbol',
                paint: vizriskmapStyles.wardLabel.paint,
                layout: vizriskmapStyles.wardLabel.layout,
                filter: getWardFilter(5, 65, 58007, wards),
            });
            this.map.setZoom(11.4);
            this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-20', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-75', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-200', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-250', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-500', 'visibility', 'none');
            this.map.setLayoutProperty('raster-rajapur-1000', 'visibility', 'none');
            this.map.setLayoutProperty('safeshelter-clipped', 'visibility', 'visible');
            this.map.setLayoutProperty('chisapani-bardiya', 'visibility', 'none');
            this.map.moveLayer('chisapani-bardiya');
            this.map.moveLayer('water');
            this.map.setLayoutProperty('2km-buffer-4xvqe1', 'visibility', 'none');
            this.map.setLayoutProperty('5km-buffer-d4g08s', 'visibility', 'none');

            this.map.setLayoutProperty('farmland-6zygfm', 'visibility', 'none');
            this.map.setLayoutProperty('farmfields-1l9fpy', 'visibility', 'none');
            this.map.setLayoutProperty('sandrajapur-44t4e0', 'visibility', 'none');
            this.map.setLayoutProperty('roadsrajapur-45d9c4', 'visibility', 'visible');
            this.map.setLayoutProperty('canalrajapur-8o865s', 'visibility', 'visible');
            this.map.moveLayer('roadsrajapur-45d9c4', 'water');

            // this.map.moveLayer('rajapurbuildingfootprint-feb10', 'ward-fill');
        });
    }

    public componentWillReceiveProps(nextProps) {
        const {
            rasterLayer,
            exposedElement,
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
            if (nextProps.exposedElement !== exposedElement) {
                if (nextProps.exposedElement === 'all') {
                    this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'visible');
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'visible');
                    this.map.setLayoutProperty('roadsrajapur-45d9c4', 'visibility', 'visible');
                    this.map.setLayoutProperty('canalrajapur-8o865s', 'visibility', 'visible');
                }
                if (nextProps.exposedElement === 'school') {
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'visible');
                    this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'none');
                    this.map.setLayoutProperty('roadsrajapur-45d9c4', 'visibility', 'none');
                    this.map.setLayoutProperty('canalrajapur-8o865s', 'visibility', 'none');
                }
                if (nextProps.exposedElement === 'building') {
                    this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'visible');
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'none');
                    this.map.setLayoutProperty('roadsrajapur-45d9c4', 'visibility', 'none');
                    this.map.setLayoutProperty('canalrajapur-8o865s', 'visibility', 'none');
                }
                if (nextProps.exposedElement === 'roads') {
                    this.map.setLayoutProperty('roadsrajapur-45d9c4', 'visibility', 'visible');
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'none');
                    this.map.setLayoutProperty('canalrajapur-8o865s', 'visibility', 'none');
                    this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'none');
                }
                if (nextProps.exposedElement === 'canals') {
                    this.map.setLayoutProperty('canalrajapur-8o865s', 'visibility', 'visible');
                    this.map.setLayoutProperty('roadsrajapur-45d9c4', 'visibility', 'none');
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'none');
                    this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'none');
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
        'fill-opacity': 1,
    });

    public polyMask = (maskVal, boundsVal) => {
        const bboxPoly = turf.bboxPolygon(boundsVal);
        return turf.difference(bboxPoly, maskVal);
    };

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
            left: '0%',
            top: 0,
            bottom: 0,
        };

        return (
            <div>
                <div style={mapStyle} ref={(el) => { this.mapContainer = el; }} />
                <RightPane />
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
