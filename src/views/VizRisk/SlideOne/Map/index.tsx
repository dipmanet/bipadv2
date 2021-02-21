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

import RightPane from '../RightPane1';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5rdXIyMCIsImEiOiJja2tiOW4wNGIwNDh5MnBsY3EzeDNmcTV4In0.d4LelcSFDElA3BctgWvs1A';


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
];

let hoveredWardId = null;

class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lat: 28.42722351741294,
            lng: 81.12424608127894,
            zoom: 11,
            disableNavBtns: true,
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
            minZoom: 2,
            maxZoom: 15,
        });

        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        this.map.on('style.load', () => {
            const visibleLayout = {
                visibility: 'visible',
            };
            this.map.setZoom(1);

            this.map.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
            });
            this.map.addSource('density', {
                type: 'vector',
                url: mapSources.populationDensity.url,
            });
            // this.map.addLayer({
            //     id: 'density-population',
            //     source: 'density',
            //     'source-layer': 'density-b7o1uo',
            //     type: 'fill',
            //     paint: {
            //         'fill-color': '#627BC1',
            //         'fill-opacity': [
            //             'case',
            //             ['boolean', ['feature-state', 'hover'], false],
            //             0.5,
            //             1,
            //         ],
            //     },
            //     layout: {},
            // });

            this.map.addLayer({
                id: 'ward-fill-local',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'fill',
                paint: {
                    'fill-color': '#dee1b8',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0,
                        1,
                    ],
                },
                layout: {},
                filter: getWardFilter(5, 65, 58007, wards),
            });

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
            // this.map.on('moveend', this.handleFlyEnd);

            this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'none');
            this.map.setLayoutProperty('forestRajapur', 'visibility', 'none');
            this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'none');
            this.map.setLayoutProperty('sandRajapur', 'visibility', 'none');
            this.map.setLayoutProperty('population-extruded', 'visibility', 'none');
            this.map.setLayoutProperty('ward-fill', 'visibility', 'visible');
            this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            this.map.moveLayer('ward-fill', 'country-label');
            // this.map.moveLayer('ward-fill-local');
            this.map.moveLayer('waterway');
            this.map.setZoom(1);

            setTimeout(() => {
                this.map.flyTo({
                    center: [
                        81.123711,
                        28.436586,
                    ],
                    zoom: 11.4,
                    bearing: 0,
                    speed: 1,
                    curve: 1,
                    essential: false,
                });
            }, 2000);
            // console.log('this map', this.map);
            this.map.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    if (hoveredWardId) {
                        this.map.setFeatureState(
                            {
                                id: hoveredWardId,
                                source: 'vizrisk-fills',
                                // paint: { 'fill-color': '#eee' },
                                sourceLayer: mapSources.nepal.layers.ward,
                            },
                            { hover: false },
                        );
                    }
                    hoveredWardId = e.features[0].id;
                    this.map.setFeatureState(
                        {
                            id: hoveredWardId,
                            source: 'vizrisk-fills',
                            // paint: { 'fill-color': '#eee' },
                            sourceLayer: mapSources.nepal.layers.ward,

                        },
                        { hover: true },
                    );
                }
            });
            // this.map.on('mousemove', 'density-population', (e) => {
            //     if (e.features.length > 0) {
            //         if (hoveredWardId) {
            //             this.map.setFeatureState(
            //                 {
            //                     id: hoveredWardId,
            //                     source: 'density',
            //                     sourceLayer: mapSources.populationDensity.url,
            //                 },
            //                 { hover: false },
            //             );
            //         }
            //         console.log(e.features[0].id);
            //         hoveredWardId = e.features[0].id;
            //         this.map.setFeatureState(
            //             {
            //                 id: hoveredWardId,
            //                 source: 'density',
            //                 sourceLayer: mapSources.populationDensity.layers.density,

            //             },
            //             { hover: true },
            //         );
            //     }
            // });
        });
    }

    public componentWillReceiveProps(nextProps) {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
            rightElement,
        } = this.props;

        if (this.map.isStyleLoaded()) {
            if (nextProps.rightElement === 1) {
                this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'visible');
                this.map.setLayoutProperty('forestRajapur', 'visibility', 'visible');
                this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'visible');
                this.map.setLayoutProperty('sandRajapur', 'visibility', 'visible');
                this.map.setLayoutProperty('popnDensityRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('population-extruded', 'visibility', 'none');
                this.map.setPaintProperty('ward-fill', 'fill-color', '#b4b4b4');
                this.map.setPitch(40);
                this.map.setBearing(0);
            }
            if (nextProps.rightElement < 1) {
                this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'none');
                this.map.setLayoutProperty('forestRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('sandRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('popnDensityRajapur', 'visibility', 'none');
                this.map.setPaintProperty('ward-fill', 'fill-color', '#ffedb8');

                this.map.setPitch(0);
                this.map.setBearing(0);

                this.map.setLayoutProperty('population-extruded', 'visibility', 'none');
            }
            if (nextProps.rightElement > 1) {
                this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'none');
                this.map.setLayoutProperty('forestRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('sandRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('popnDensityRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
                this.map.setLayoutProperty('ward-outline', 'visibility', 'visible');
                this.map.setPitch(45);
                this.map.moveLayer('popnDensityRajapur');
                this.map.moveLayer('ward-outline');
                this.map.moveLayer('water');
                this.map.setLayoutProperty('population-extruded', 'visibility', 'visible');
            }
            if (nextProps.showRaster !== showRaster || nextProps.rasterLayer !== rasterLayer) {
                if (nextProps.showRaster && nextProps.rasterLayer === '5') {
                    this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '5') {
                    this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '10') {
                    this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '10') {
                    this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '20') {
                    this.map.setLayoutProperty('raster-rajapur-20', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '20') {
                    this.map.setLayoutProperty('raster-rajapur-20', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '50') {
                    this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '50') {
                    this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '75') {
                    this.map.setLayoutProperty('raster-rajapur-75', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '75') {
                    this.map.setLayoutProperty('raster-rajapur-75', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '100') {
                    this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '100') {
                    this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '200') {
                    this.map.setLayoutProperty('raster-rajapur-200', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '200') {
                    this.map.setLayoutProperty('raster-rajapur-200', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '250') {
                    this.map.setLayoutProperty('raster-rajapur-250', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '250') {
                    this.map.setLayoutProperty('raster-rajapur-250', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '500') {
                    this.map.setLayoutProperty('raster-rajapur-500', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '500') {
                    this.map.setLayoutProperty('raster-rajapur-500', 'visibility', 'none');
                }
                if (nextProps.showRaster && nextProps.rasterLayer === '1000') {
                    this.map.setLayoutProperty('raster-rajapur-1000', 'visibility', 'visible');
                }
                if (!nextProps.showRaster && nextProps.rasterLayer === '1000') {
                    this.map.setLayoutProperty('raster-rajapur-1000', 'visibility', 'none');
                }
            }
            if (nextProps.exposedElement !== exposedElement) {
                if (nextProps.exposedElement === 'all') {
                    this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'visible');
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'visible');
                }
                if (nextProps.exposedElement === 'school') {
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'visible');
                    this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'none');
                }
                if (nextProps.exposedElement === 'building') {
                    this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'visible');
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'none');
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

    public handleFlyEnd = () => {
        this.props.handleMoveEnd(true);
    }

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
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
