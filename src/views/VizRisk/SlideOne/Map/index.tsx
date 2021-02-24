import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import turf from 'turf';
import { mapSources, vizriskmapStyles } from '#constants';
import SchoolGeoJSON from '../../SchoolGeoJSON';
import SafeshelterGeoJSON from '../../safeShelter';
import Education from '../Icons/Education.svg';
import ManualIcon from '#resources/images/chisapanistation.png';
import Bank from '../Icons/rupees.svg';
import Culture from '../Icons/Area.svg';
import Governance from '../Icons/bridge.svg';
import Health from '../Icons/hospital.svg';
import Industry from '../Icons/industry.svg';
import Tourism from '../Icons/tourism.svg';
import Communication from '../Icons/TempMin.svg';
import Transportation from '../Icons/TempMax.svg';


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
    '#ffffff',
];

let hoveredWardId = null;
const fillThis = [
    'interpolate',
    ['linear'],
    ['feature-state', 'value'],
    1, '#fe9b2a', 2, '#fe9b2a',
    3, '#fe9b2a', 4, '#9a3404',
    5, '#d95f0e', 6, '#fe9b2a',
    7, '#ffffd6', 8, '#fe9b2a',
    9, '#fed990', 10, '#d95f0e',
];


class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lat: 28.42722351741294,
            lng: 81.12424608127894,
            zoom: 11,
            disableNavBtns: true,
            wardNumber: 'Hover to see ward number',
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
        const { criticalinfrastructures } = SchoolGeoJSON;
        const mapping = [];
        if (wards) {
            wards.map((item) => {
                const { id } = item;
                if (item.municipality === 58007) {
                    if (item.title === '1') {
                        mapping.push({ id, value: 1 });
                    }
                    if (item.title === '2') {
                        mapping.push({ id, value: 2 });
                    }
                    if (item.title === '3') {
                        mapping.push({ id, value: 3 });
                    }
                    if (item.title === '4') {
                        mapping.push({ id, value: 4 });
                    }
                    if (item.title === '5') {
                        mapping.push({ id, value: 5 });
                    }
                    if (item.title === '6') {
                        mapping.push({ id, value: 6 });
                    }
                    if (item.title === '7') {
                        mapping.push({ id, value: 7 });
                    }
                    if (item.title === '8') {
                        mapping.push({ id, value: 8 });
                    }
                    if (item.title === '9') {
                        mapping.push({ id, value: 9 });
                    }
                    if (item.title === '10') {
                        mapping.push({ id, value: 10 });
                    }
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

            // console.log('map: ', this.map);


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

            this.map.addLayer({
                id: 'ward-fill-local',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'fill',
                paint: {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['feature-state', 'value'],
                        1, '#fe9b2a', 2, '#fe9b2a',
                        3, '#fe9b2a', 4, '#9a3404',
                        5, '#d95f0e', 6, '#fe9b2a',
                        7, '#ffffd6', 8, '#fe9b2a',
                        9, '#fed990', 10, '#d95f0e',
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0,
                        1,
                    ],
                },
                filter: getWardFilter(5, 65, 58007, wards),
            });

            this.map.addSource('criticalinfra', {
                type: 'geojson',
                data: criticalinfrastructures,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
            });

            this.map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'criticalinfra',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6',
                        100,
                        '#f1f075',
                        750,
                        '#f28cb1',
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40,
                    ],
                },
            });

            this.map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'criticalinfra',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                },
            });

            this.map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'criticalinfra',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#11b4da',
                    'circle-radius': 4,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff',
                },
            });

            mapping.forEach((attribute) => {
                this.map.setFeatureState(
                    {
                        id: attribute.id,
                        source: 'vizrisk-fills',
                        sourceLayer: mapSources.nepal.layers.ward,
                    },
                    { value: attribute.value },
                );
            });
            this.map.on('click', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    if (hoveredWardId) {
                        this.setState({ wardNumber: hoveredWardId });
                        this.map.setFeatureState(
                            {
                                id: hoveredWardId,
                                source: 'vizrisk-fills',
                                // paint: { 'fill-color': '#eee' },
                                sourceLayer: mapSources.nepal.layers.ward,
                            },
                            { hover: false },
                        );
                        this.map.setPaintProperty('ward-fill-local', 'fill-color', '#112330');
                        // this.map.setZoom(14);
                        // this.map.setLayoutProperty('ward-fill-local', 'fill-opacity', 0.3);
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
            this.map.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    if (hoveredWardId) {
                        this.setState({ wardNumber: hoveredWardId });
                        this.map.setFeatureState(
                            {
                                id: hoveredWardId,
                                source: 'vizrisk-fills',
                                // paint: { 'fill-color': '#eee' },
                                sourceLayer: mapSources.nepal.layers.ward,
                            },
                            { hover: false },
                        );
                        // this.map.setPaintProperty('ward-fill-local', 'fill-color', '#112330');
                        // this.map.setZoom(14);
                        // this.map.setPaintProperty('ward-fill-local', 'fill-opacity', 0.8);
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
            this.map.on('mouseleave', 'ward-fill-local', () => {
                if (hoveredWardId) {
                    this.map.setFeatureState(
                        {
                            source: 'vizrisk-fills',
                            id: hoveredWardId,
                            sourceLayer: mapSources.nepal.layers.ward,
                        },
                        { hover: false },

                    );
                    this.map.setPaintProperty('ward-fill-local', 'fill-color', fillThis);
                    // this.map.setLayoutProperty('ward-fill-local', 'fill-opacity', 1);
                }
                hoveredWardId = null;
            });


            this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'none');
            this.map.setLayoutProperty('forestRajapur', 'visibility', 'none');
            this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'none');
            this.map.setLayoutProperty('population-extruded', 'visibility', 'none');
            this.map.setLayoutProperty('ward-fill', 'visibility', 'visible');
            this.map.moveLayer('ward-fill', 'country-label');
            this.map.moveLayer('waterway');
            this.map.setLayoutProperty('unclustered-point', 'visibility', 'none');
            this.map.setLayoutProperty('cluster-count', 'visibility', 'none');
            this.map.setLayoutProperty('clusters', 'visibility', 'none');
            this.map.setZoom(1);
        });
    }

    public componentWillReceiveProps(nextProps) {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
            rightElement,
            showPopulation,
        } = this.props;

        if (this.map.isStyleLoaded()) {
            if (nextProps.rightElement === 1) {
                this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'visible');
                this.map.setLayoutProperty('forestRajapur', 'visibility', 'visible');
                this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'visible');
                // this.map.setLayoutProperty('sandRajapur', 'visibility', 'visible');
                this.map.setLayoutProperty('popnDensityRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('population-extruded', 'visibility', 'none');
                this.map.setPaintProperty('ward-fill', 'fill-color', '#b4b4b4');
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');

                this.map.setPitch(40);
                this.map.setBearing(0);

                this.map.setLayoutProperty('unclustered-point', 'visibility', 'none');
                this.map.setLayoutProperty('cluster-count', 'visibility', 'none');
                this.map.setLayoutProperty('clusters', 'visibility', 'none');
            }
            if (nextProps.rightElement < 1) {
                this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'none');
                this.map.setLayoutProperty('forestRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'none');
                // this.map.setLayoutProperty('sandRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('popnDensityRajapur', 'visibility', 'none');
                this.map.setPaintProperty('ward-fill', 'fill-color', '#ffedb8');
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');

                this.map.setPitch(0);
                this.map.setBearing(0);

                this.map.setLayoutProperty('population-extruded', 'visibility', 'none');
                this.map.setLayoutProperty('unclustered-point', 'visibility', 'none');
                this.map.setLayoutProperty('cluster-count', 'visibility', 'none');
                this.map.setLayoutProperty('clusters', 'visibility', 'none');
            }
            if (nextProps.rightElement === 2) {
                this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'none');
                this.map.setLayoutProperty('forestRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'none');
                // this.map.setLayoutProperty('sandRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('popnDensityRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
                this.map.setLayoutProperty('ward-outline', 'visibility', 'visible');

                this.map.setPitch(45);
                this.map.moveLayer('popnDensityRajapur');
                this.map.moveLayer('ward-outline');
                this.map.moveLayer('water');
                this.map.setLayoutProperty('waterway', 'visibility', 'none');
                this.map.setLayoutProperty('population-extruded', 'visibility', 'visible');
                this.map.setLayoutProperty('unclustered-point', 'visibility', 'none');
                this.map.setLayoutProperty('cluster-count', 'visibility', 'none');
                this.map.setLayoutProperty('clusters', 'visibility', 'none');
            }

            if (nextProps.rightElement === 3) {
                this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'none');
                this.map.setLayoutProperty('forestRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'none');
                // this.map.setLayoutProperty('sandRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('popnDensityRajapur', 'visibility', 'none');
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
                this.map.setLayoutProperty('ward-outline', 'visibility', 'visible');

                this.map.setPitch(45);
                this.map.moveLayer('ward-outline');
                this.map.moveLayer('water');
                this.map.setLayoutProperty('population-extruded', 'visibility', 'none');
                this.map.setLayoutProperty('unclustered-point', 'visibility', 'visible');
                this.map.setLayoutProperty('cluster-count', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters', 'visibility', 'visible');
                this.map.setPaintProperty('ward-fill', 'fill-color', '#ffedb8');
                this.map.setLayoutProperty('ward-fill', 'visibility', 'visible');
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
            if (nextProps.showPopulation !== showPopulation) {
                if (showPopulation === 'ward') {
                    this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
                    this.map.setLayoutProperty('population-extruded', 'visibility', 'visible');
                    this.map.moveLayer('ward-fill-local', 'population-extruded');
                }
                if (showPopulation === 'popdensity') {
                    this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
                    this.map.setLayoutProperty('population-extruded', 'visibility', 'visible');
                    this.map.moveLayer('population-extruded', 'ward-fill-local');
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
        // const wardStyle = {
        //     position: 'absolute',
        //     width: '100px',
        //     height: '100px',
        //     backgroundColor: '#fff',
        //     top: '100px',
        //     left: '50px',
        //     zIndex: '2',
        // };
        return (
            <div>
                <div style={mapStyle} ref={(el) => { this.mapContainer = el; }} />
                {/* <div style={wardStyle}>{this.state.wardNumber}</div> */}

            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
