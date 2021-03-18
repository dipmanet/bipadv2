import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { mapSources } from '#constants';
import SchoolGeoJSON from '../Data/rajapurGEOJSON';
import demographicsData from '../Data/demographicsData';
import styles from './styles.scss';
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

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


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

const categoriesCritical = [...new Set(criticalinfrastructures.features.map(
    item => item.properties.Type,
))];

const categoriesEvac = [...new Set(evaccenters.features.map(
    item => item.properties.Type,
))];

const rasterLayersYears = [5, 50, 100, 500];
const rasterLayers = rasterLayersYears.map(layer => `raster-rajapur-${layer}`);
const arrCritical = categoriesCritical.map(
    layer => [`clusters-count-${layer}`, `unclustered-point-${layer}`, `clusters-${layer}`],
);
const arrEvac = categoriesEvac.map(
    layer => [`evac-count-${layer}`, `evac-unclustered-${layer}`, `evac-${layer}`],
);
const criticalInfraClusters = [].concat(...arrCritical);
const evacClusters = [].concat(...arrEvac);


const slideOneLayers = [
    'water', 'waterway', 'gulariyaWardNumber',
    'gulariyaWardBoundary', 'gulariyaBoundary'];

const slideTwoLayers = ['water',
    'canalRajapur', 'rajapurbuildings', 'bridgeRajapur',
    'rajapurRoads', 'forestRajapur', 'agriculturelandRajapurPattern',
    'agriculturelandRajapur', 'wardOutline',
    'wardFill',
];

const slideThreeLayers = ['wardNumbers', 'water', 'wardOutline',
    'ward-fill-local', 'bufferRajapur',
    'population-extruded'];

const slideFourLayers = [
    ...criticalInfraClusters, 'water', 'wardOutline',
    'bridgeRajapur', 'canalRajapur',
    'waterway', 'rajapurRoads', 'wardFill',
];

const slideFiveLayers = [
    ...criticalInfraClusters, ...rasterLayers, 'rajapurbuildings', 'water',
    'bridgeRajapur', 'canalRajapur', 'waterway',
    'rajapurRoads', 'wardOutline', 'wardFill',
];
const slideSixLayers = [
    'safeshelterRajapurIcon', 'safeshelterRajapur',
    ...evacClusters, ...rasterLayers, 'water',
    'bridgeRajapur', 'rajapurRoads', 'canalRajapur', 'waterway',
    'wardOutline', 'wardFill',
];

class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lat: 28.210927128836925,
            lng: 81.34569465152305,
            zoom: 11,
            wardNumber: 'Hover to see ward number',
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom,
        } = this.state;
        const {
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

        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            // style: 'mapbox://styles/ankur20/ckmekywcl7ez817qipyrjqkfg',
            style: 'mapbox://styles/yilab/ckmekcddk1h9r17mect0out7a',
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });
        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        this.map.on('style.load', () => {
            this.map.setZoom(1);
            setTimeout(() => {
                this.map.easeTo({
                    zoom: 11.4,
                    duration: 8000,
                });
            }, 4000);
            this.map.easeTo({
                pitch: 20,
                duration: 2000,
            });
            // this.map.setPaintProperty('wardFill', 'fill-color', '#e0e0e0');
        });
    }

    // public componentWillReceiveProps(nextProps) {
    //     const {
    //         rasterLayer,
    //         showPopulation,
    //         criticalElement,
    //         evacElement,
    //         criticalFlood,
    //         rightElement,
    //     } = this.props;


    //     if (this.map.isStyleLoaded()) {
    //         if (nextProps.showPopulation !== showPopulation) {
    //             if (nextProps.showPopulation === 'popdensity') {
    //                 this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
    //             // this.map.setLayoutProperty('ward-outline', 'visibility', 'none');
    //             // this.map.setLayoutProperty('wardNumbers', 'visibility', 'none');
    //             } else {
    //                 this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
    //             }
    //         }
    //         if (nextProps.criticalFlood !== criticalFlood) {
    //             this.handleInfraClusterSwitch(nextProps.criticalFlood);
    //         }
    //         if (nextProps.rasterLayer !== rasterLayer) {
    //             this.handleFloodRasterSwitch(nextProps.rasterLayer);
    //         }
    //         if (nextProps.evacElement !== evacElement) {
    //             this.handleEvacClusterSwitch(nextProps.evacElement);
    //         }
    //         if (nextProps.criticalElement !== criticalElement) {
    //             this.handleInfraClusterSwitch(nextProps.criticalElement);
    //         }

    //         if (nextProps.rightElement !== rightElement) {
    //             if (nextProps.rightElement === 0) {
    //                 this.map.easeTo({
    //                     pitch: 0,
    //                     zoom: 11.4,
    //                     duration: 1000,
    //                 });
    //                 this.resetClusters();
    //                 this.orderLayers(slideOneLayers);
    //                 this.toggleVisiblity(slideTwoLayers, 'none');
    //                 this.toggleVisiblity(slideOneLayers, 'visible');
    //             } else if (nextProps.rightElement === 1) {
    //             // this.map.setPitch(40);
    //                 this.map.easeTo({
    //                     pitch: 40,
    //                     zoom: 12,
    //                     duration: 2000,
    //                 });
    //                 this.toggleVisiblity(slideThreeLayers, 'none');
    //                 this.toggleVisiblity(slideOneLayers, 'none');
    //                 this.toggleVisiblity(slideTwoLayers, 'visible');
    //                 this.map.setPaintProperty('wardFill', 'fill-color', '#b4b4b4');
    //                 this.orderLayers(slideTwoLayers);
    //             } else if (nextProps.rightElement === 2) {
    //                 this.toggleVisiblity(slideTwoLayers, 'none');
    //                 this.toggleVisiblity(slideFourLayers, 'none');
    //                 this.toggleVisiblity(slideThreeLayers, 'visible');
    //                 this.orderLayers(slideThreeLayers);
    //                 this.resetClusters();
    //             } else if (nextProps.rightElement === 3) {
    //                 this.toggleVisiblity(slideThreeLayers, 'none');
    //                 this.toggleVisiblity(slideFiveLayers, 'none');
    //                 this.toggleVisiblity(slideFourLayers, 'visible');

    //                 this.orderLayers(slideFourLayers);
    //                 this.handleInfraClusterSwitch(criticalElement);
    //                 this.hideFloodRasters();
    //             } else if (nextProps.rightElement === 4) {
    //                 this.toggleVisiblity(slideFourLayers, 'none');
    //                 this.toggleVisiblity(slideSixLayers, 'none');
    //                 this.toggleVisiblity(slideFiveLayers, 'visible');

    //                 this.orderLayers(slideFiveLayers);
    //                 this.handleInfraClusterSwitch(criticalFlood);
    //                 this.handleFloodRasterSwitch('5');
    //             } else if (nextProps.rightElement === 5) {
    //                 this.toggleVisiblity(slideFiveLayers, 'none');
    //                 this.toggleVisiblity(slideSixLayers, 'visible');
    //                 this.orderLayers(slideSixLayers);
    //                 this.handleFloodRasterSwitch('5');
    //                 this.handleEvacClusterSwitch(evacElement);
    //             }
    //         }
    //     }
    // }

    public componentWillUnmount() {
        this.map.remove();
    }

    public getRasterLayer = (years: number) => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        `&layers=Bipad:Rajapur_FD_1in${years}`,
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('')

    public getGeoJSON = (filterBy: string, data: any) => {
        const temp = {};
        temp.type = 'FeatureCollection';
        temp.name = filterBy;
        temp.crs = {};
        temp.crs.type = 'name';
        temp.crs.properties = {};
        temp.crs.properties.name = 'urn:ogc:def:crs:OGC:1.3:CRS84';
        temp.features = [];
        const ourD = data.features.filter(item => item.properties.Type === filterBy);
        temp.features.push(...ourD);
        return temp;
    }


    public hideFloodRasters = () => {
        rasterLayersYears.map((layer) => {
            this.map.setLayoutProperty(`raster-rajapur-${layer}`, 'visibility', 'none');
            return null;
        });
    };


    public resetClusters = () => {
        categoriesCritical.map((layer) => {
            this.map.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');

            return null;
        });
        categoriesEvac.map((layer) => {
            this.map.setLayoutProperty(
                `evac-${layer}`, 'visibility', 'none',
            );
            this.map.setLayoutProperty(
                `evac-count-${layer}`, 'visibility', 'none',
            );
            this.map.setLayoutProperty(
                `evac-unclustered-${layer}`, 'visibility', 'none',
            );

            this.map.setLayoutProperty('safeshelterRajapur', 'visibility', 'none');
            this.map.setLayoutProperty('safeshelterRajapurIcon', 'visibility', 'none');
            return null;
        });
    }

    public toggleVisiblity = (layers, state) => {
        layers.map((layer) => {
            this.map.setLayoutProperty(layer, 'visibility', state);
            return null;
        });
    };

    public orderLayers = (layers) => {
        const { length } = layers;
        if (length > 1) {
            for (let i = 0; i < (layers.length - 1); i += 1) {
                this.map.moveLayer(layers[i + 1], layers[i]);
            }
        }
    };

    public generatePaint = color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'value'],
            ...color,
        ],
        'fill-opacity': 1,
    });

    public handleInfraClusterSwitch = (layer) => {
        this.resetClusters();

        if (layer === 'all') {
            categoriesCritical.map((item) => {
                this.map.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'visible');
                this.map.setLayoutProperty(`clusters-${item}`, 'visibility', 'visible');
                this.map.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'visible');
                return null;
            });
        } else if (layer === 'health') {
            this.map.setLayoutProperty('clusters-Health', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-Health', 'visibility', 'visible');
            this.map.setLayoutProperty('unclustered-point-Health', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-Health');
        } else if (layer === 'bank') {
            this.map.setLayoutProperty('unclustered-point-Bank', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-Bank', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-Bank', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-Bank');
        } else if (layer === 'governance') {
            this.map.setLayoutProperty('unclustered-point-Governance', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-Governance', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-Governance', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-Bank');
        } else if (layer === 'industry') {
            this.map.setLayoutProperty('unclustered-point-Industry', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-Industry', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-Industry', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-Industry');
        } else if (layer === 'education') {
            this.map.setLayoutProperty('unclustered-point-Education', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-Education', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-Education', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-Education');
        } else if (layer === 'culture') {
            this.map.setLayoutProperty('unclustered-point-Culture', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-Culture', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-Culture', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-Culture');
        } else if (layer === 'tourism') {
            this.map.setLayoutProperty('unclustered-point-Tourism', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-Tourism', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-Tourism', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-Tourism');
        }
    };

    public handleEvacClusterSwitch = (layer) => {
        this.resetClusters();
        if (layer === 'all') {
            categoriesEvac.map((item) => {
                this.map.setLayoutProperty(`evac-count-${item}`, 'visibility', 'visible');
                this.map.setLayoutProperty(`evac-${item}`, 'visibility', 'visible');
                this.map.setLayoutProperty(`evac-unclustered-${item}`, 'visibility', 'visible');
                return null;
            });
        } else if (layer === 'education') {
            this.map.setLayoutProperty('evac-Education', 'visibility', 'visible');
            this.map.setLayoutProperty('evac-count-Education', 'visibility', 'visible');
            this.map.setLayoutProperty('evac-unclustered-Education', 'visibility', 'visible');
        } else if (layer === 'culture') {
            this.map.setLayoutProperty('evac-Culture', 'visibility', 'visible');
            this.map.setLayoutProperty('evac-count-Culture', 'visibility', 'visible');
            this.map.setLayoutProperty('evac-unclustered-Culture', 'visibility', 'visible');
        } else if (layer === 'safe') {
            this.map.setLayoutProperty('safeshelterRajapur', 'visibility', 'visible');
            this.map.setLayoutProperty('safeshelterRajapurIcon', 'visibility', 'visible');
        }
    };

    public handleFloodRasterSwitch = (layer) => {
        this.hideFloodRasters();
        if (layer === '5') {
            this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'visible');
        } else if (layer === '10') {
            this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'visible');
        } else if (layer === '50') {
            this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'visible');
        } else if (layer === '100') {
            this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'visible');
        } else if (layer === '500') {
            this.map.setLayoutProperty('raster-rajapur-500', 'visibility', 'visible');
        }
    }

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
