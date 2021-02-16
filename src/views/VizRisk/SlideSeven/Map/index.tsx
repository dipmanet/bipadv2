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
    '#918b61',
    // '#5aa8a3',
];

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

            this.map.addLayer({
                id: 'ward-fill',
                type: 'fill',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                layout: visibleLayout,
                paint: colorPaint,
                filter: getWardFilter(5, 65, 58007, wards),
            }, 'water');

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


            this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'none');
            this.map.setLayoutProperty('2km-buffer-4xvqe1', 'visibility', 'none');
            this.map.setLayoutProperty('5km-buffer-d4g08s', 'visibility', 'none');
            this.map.setLayoutProperty('farmland-6zygfm', 'visibility', 'none');
            this.map.setLayoutProperty('farmfields-1l9fpy', 'visibility', 'none');
            this.map.setLayoutProperty('sandrajapur-44t4e0', 'visibility', 'none');
            // this.map.moveLayer('rajapurbuildingfootprint-feb10', 'ward-fill');
            this.map.setZoom(1);

            setTimeout(() => {
                this.map.flyTo({
                    center: [
                        81.123711,
                        28.436586,
                    ],
                    zoom: 11.4,
                    bearing: 0,
                    speed: 0.5,
                    curve: 2,
                    essential: true,
                });
            }, 3000);
        });
    }

    public componentWillReceiveProps(nextProps) {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
        } = this.props;

        if (this.map.isStyleLoaded()) {
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
                    this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'visible');
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'visible');
                }
                if (nextProps.exposedElement === 'school') {
                    this.map.setLayoutProperty('school-rajapur', 'visibility', 'visible');
                    this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'none');
                }
                if (nextProps.exposedElement === 'building') {
                    this.map.setLayoutProperty('rajapurbuildingfootprint-feb10', 'visibility', 'visible');
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
