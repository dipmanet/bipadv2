import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { mapSources, vizriskmapStyles } from '#constants';
import SchoolGeoJSON from '../../SchoolGeoJSON';


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

const rasterLayersYears = [5, 10, 50, 100, 500];

const slideOneLayers = [
    'wardNumbers', 'ward-outline',
    'ward-fill', 'waterway'];

const slideTwoLayers = [
    'ward-fill', 'rajapurbuildings',
    'forestRajapur', 'agriculturelandRajapur',
    'bridgesRajapur', 'canalRajapur', 'waterway',
    'rajapurRoads',
];

const slideThreeLayers = ['ward-outline', 'ward-fill-local', 'population-extruded'];
const slideFourLayers = [
    'ward-fill', 'bridgesRajapur',
    'canalRajapur', 'waterway',
    'rajapurRoads',
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
            style: 'mapbox://styles/ankur20/ckkwdvg544to217orazo712ra',
            // style: 'mapbox://styles/ankur20/cklf0bpke3ay017k7dlanuj5i',
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });
        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        this.map.on('style.load', () => {
            categoriesCritical.map((layer) => {
                this.map.addSource(layer, {
                    type: 'geojson',
                    data: this.getGeoJSON(layer, criticalinfrastructures),
                    cluster: true,
                    clusterRadius: 50,
                });
                this.map.addLayer({
                    id: `clusters-${layer}`,
                    type: 'circle',
                    source: layer,
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#a4ac5e',
                            100,
                            '#a4ac5e',

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
                    id: `unclustered-point-${layer}`,
                    type: 'symbol',
                    source: layer,
                    filter: ['!', ['has', 'point_count']],
                    layout: {

                        'icon-image': ['get', 'icon'],
                    },
                });

                this.map.addLayer({
                    id: `clusters-count-${layer}`,
                    type: 'symbol',
                    source: layer,
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                    },
                });

                this.map.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                this.map.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                this.map.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');


                return null;
            });

            categoriesEvac.map((layer) => {
                this.map.addSource(`evac${layer}`, {
                    type: 'geojson',
                    data: this.getGeoJSON(layer, evaccenters),
                    cluster: true,
                    clusterRadius: 50,
                });
                this.map.addLayer({
                    id: `evac-${layer}`,
                    type: 'circle',
                    source: `evac${layer}`,
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#a4ac5e',
                            100,
                            '#a4ac5e',

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
                this.map.setLayoutProperty(`evac-${layer}`, 'visibility', 'none');

                return null;
            });

            rasterLayersYears.map((layer) => {
                this.map.addSource(`rasterrajapur${layer}`, {
                    type: 'raster',
                    tiles: [this.getRasterLayer(layer)],
                    tileSize: 256,
                });

                this.map.addLayer(
                    {
                        id: `raster-rajapur-${layer}`,
                        type: 'raster',
                        source: `rasterrajapur${layer}`,
                        layout: {},
                        paint: {
                            'raster-opacity': 0.7,
                        },
                    },
                );
                this.map.setLayoutProperty(`raster-rajapur-${layer}`, 'visibility', 'none');
                return null;
            });

            this.map.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
            });

            this.map.addSource('density', {
                type: 'vector',
                url: mapSources.populationDensity.url,
            });

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
            this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');

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

            this.map.setZoom(11.4);

            setTimeout(() => {
                this.map.flyTo({
                    center: [
                        81.123711,
                        28.436586,
                    ],
                    zoom: 11.4,
                    bearing: 0,
                    speed: 0.7,
                    curve: 1,
                    essential: false,
                });
            }, 2000);
        });
    }

    public componentWillReceiveProps(nextProps) {
        const {
            showRaster,
            rasterLayer,
            exposedElement,
            rightElement,
            showPopulation,
            criticalElement,
            evacElement,
        } = this.props;


        if (this.map.isStyleLoaded()) {
            if (nextProps.rightElement === 0) {
                this.map.setPitch(0);
                this.map.setBearing(0);
                this.toggleVisiblity(slideOneLayers, 'visible');
                this.orderLayers(slideOneLayers);
                this.toggleVisiblity(slideTwoLayers, 'none');
            }
            if (nextProps.rightElement === 1) {
                this.map.setPitch(40);
                this.toggleVisiblity(slideOneLayers, 'none');
                this.toggleVisiblity(slideTwoLayers, 'visible');
                this.orderLayers(slideTwoLayers);
            }

            if (nextProps.rightElement === 2) {
                this.toggleVisiblity(slideTwoLayers, 'none');
                this.toggleVisiblity(slideThreeLayers, 'visible');
                this.orderLayers(slideThreeLayers);
            }

            if (nextProps.rightElement === 3 || nextProps.rightElement === 4) {
                this.toggleVisiblity(slideFourLayers, 'visible');
                this.toggleVisiblity(slideThreeLayers, 'none');
                this.orderLayers(slideFourLayers);
                if (nextProps.criticalElement !== criticalElement) {
                    if (nextProps.criticalElement === 'all') {
                        categoriesCritical.map((item) => {
                            this.map.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'visible');
                            this.map.setLayoutProperty(`clusters-${item}`, 'visibility', 'visible');
                            this.map.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'visible');

                            return null;
                        });
                    }
                    if (nextProps.criticalElement === 'health') {
                        this.map.setLayoutProperty('unclustered-point-Health', 'visibility', 'visible');
                        this.map.setLayoutProperty('cluster-count-Health', 'visibility', 'visible');
                        this.map.setLayoutProperty('clusters-Health', 'visibility', 'visible');
                        // this.moveCounts();

                        // this.map.moveLayer('unclustered-point-Health');
                        this.map.moveLayer('clusters-Health');
                        this.map.moveLayer('cluster-count-Health');
                        this.map.moveLayer('unclustered-point-Health');
                    }
                    if (nextProps.criticalElement === 'bank') {
                        this.map.setLayoutProperty('unclustered-point-bank', 'visibility', 'visible');
                        this.map.setLayoutProperty('cluster-count-bank', 'visibility', 'visible');
                        this.map.setLayoutProperty('clusters-bank', 'visibility', 'visible');
                        // this.moveCounts();

                        // this.map.moveLayer('unclustered-point-bank');
                        this.map.moveLayer('clusters-bank');
                        this.map.moveLayer('cluster-count-bank');
                        this.map.moveLayer('unclustered-point-bank');
                    }
                    if (nextProps.criticalElement === 'governance') {
                        this.map.setLayoutProperty('unclustered-point-governance', 'visibility', 'visible');
                        this.map.setLayoutProperty('cluster-count-governance', 'visibility', 'visible');
                        this.map.setLayoutProperty('clusters-governance', 'visibility', 'visible');
                        // this.moveCounts();

                        // this.map.moveLayer('unclustered-point-governance');
                        this.map.moveLayer('clusters-governance');
                        this.map.moveLayer('cluster-count-governance');
                        this.map.moveLayer('unclustered-point-governance');
                    }
                    if (nextProps.criticalElement === 'industry') {
                        this.map.setLayoutProperty('unclustered-point-industry', 'visibility', 'visible');
                        this.map.setLayoutProperty('cluster-count-industry', 'visibility', 'visible');
                        this.map.setLayoutProperty('clusters-industry', 'visibility', 'visible');
                        // this.moveCounts();

                        // this.map.moveLayer('unclustered-point-industry');
                        this.map.moveLayer('clusters-industry');
                        this.map.moveLayer('cluster-count-industry');
                        this.map.moveLayer('unclustered-point-industry');
                    }
                    if (nextProps.criticalElement === 'education') {
                        this.map.setLayoutProperty('unclustered-point-education', 'visibility', 'visible');
                        this.map.setLayoutProperty('cluster-count-education', 'visibility', 'visible');
                        this.map.setLayoutProperty('clusters-education', 'visibility', 'visible');
                        // this.moveCounts();

                        this.map.moveLayer('clusters-education');
                        this.map.moveLayer('cluster-count-education');
                        this.map.moveLayer('unclustered-point-education');
                    }
                    if (nextProps.criticalElement === 'culture') {
                        this.map.setLayoutProperty('unclustered-point-culture', 'visibility', 'visible');
                        this.map.setLayoutProperty('cluster-count-culture', 'visibility', 'visible');
                        this.map.setLayoutProperty('clusters-culture', 'visibility', 'visible');

                        this.map.moveLayer('clusters-culture');
                        this.map.moveLayer('cluster-count-culture');
                        this.map.moveLayer('unclustered-point-culture');

                        // this.moveCounts();

                        // this.map.moveLayer('clusters-culture');
                        // this.map.moveLayer('cluster-count-culture');
                        // this.map.moveLayer('unclustered-point-culture');
                    }
                    if (nextProps.criticalElement === 'tourism') {
                        this.map.setLayoutProperty('unclustered-point-tourism', 'visibility', 'visible');
                        this.map.setLayoutProperty('cluster-count-tourism', 'visibility', 'visible');
                        this.map.setLayoutProperty('clusters-tourism', 'visibility', 'visible');
                        // this.moveCounts();
                        // this.map.moveLayer('unclustered-point-tourism');
                    }
                }


                if (nextProps.rightElement === 4) {
                    this.map.moveLayer('raster-rajapur-50', 'clusters-Health');
                    this.map.moveLayer('raster-rajapur-10', 'clusters-Health');
                    this.map.moveLayer('raster-rajapur-50', 'clusters-Health');
                    this.map.moveLayer('raster-rajapur-100', 'clusters-Health');
                    this.map.moveLayer('raster-rajapur-1000', 'clusters-Health');
                    if (nextProps.rasterLayer === '5') {
                        this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'visible');
                        this.map.moveLayer('raster-rajapur-5', 'clusters-Health');
                    }
                    if (nextProps.rasterLayer === '10') {
                        this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'visible');
                        this.map.moveLayer('raster-rajapur-10', 'clusters-Health');
                    }
                    if (nextProps.rasterLayer === '50') {
                        this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'visible');
                        this.map.moveLayer('raster-rajapur-50', 'clusters-Health');
                    }
                    if (nextProps.rasterLayer === '100') {
                        this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'visible');
                        this.map.moveLayer('raster-rajapur-100', 'clusters-Health');
                    }
                    if (nextProps.rasterLayer === '1000') {
                        this.map.setLayoutProperty('raster-rajapur-1000', 'visibility', 'visible');
                        this.map.moveLayer('raster-rajapur-1000', 'clusters-Health');
                    }

                    this.map.setLayoutProperty('rajapurbuildings', 'visibility', 'visible');
                    this.map.setLayoutProperty('forestRajapur', 'visibility', 'visible');
                    this.map.setLayoutProperty('agriculturelandRajapur', 'visibility', 'visible');
                    this.map.setLayoutProperty('waterway', 'visibility', 'visible');
                }
            }


            if (nextProps.rightElement === 5) {
                this.map.setLayoutProperty('ward-outline', 'visibility', 'visible');
                this.map.setLayoutProperty('rajapurRoads', 'visibility', 'visible');
                this.map.setLayoutProperty('bridgesRajapur', 'visibility', 'visible');

                this.map.setPitch(45);
                this.map.moveLayer('ward-outline');

                this.map.setPaintProperty('ward-fill', 'fill-color', '#ffedb8');
                this.map.setLayoutProperty('ward-fill', 'visibility', 'visible');

                if (nextProps.evacElement === 'all') {
                    this.resetClusters();
                    this.map.setLayoutProperty('unclustered-point-education', 'visibility', 'visible');
                    this.map.setLayoutProperty('cluster-count-education', 'visibility', 'visible');
                    this.map.setLayoutProperty('clusters-education', 'visibility', 'visible');
                    this.map.setLayoutProperty('unclustered-point-culture', 'visibility', 'visible');
                    this.map.setLayoutProperty('cluster-count-culture', 'visibility', 'visible');
                    this.map.setLayoutProperty('clusters-culture', 'visibility', 'visible');
                    this.map.setLayoutProperty('safeshelterRajapurIcon', 'visibility', 'visible');
                }
                if (nextProps.evacElement === 'education') {
                    this.resetClusters();
                    this.map.setLayoutProperty('unclustered-point-education', 'visibility', 'visible');
                    this.map.setLayoutProperty('cluster-count-education', 'visibility', 'visible');
                    this.map.setLayoutProperty('clusters-education', 'visibility', 'visible');
                }

                if (nextProps.evacElement === 'culture') {
                    this.resetClusters();
                    this.map.setLayoutProperty('unclustered-point-culture', 'visibility', 'visible');
                    this.map.setLayoutProperty('cluster-count-culture', 'visibility', 'visible');
                    this.map.setLayoutProperty('clusters-culture', 'visibility', 'visible');
                }
                if (nextProps.evacElement === 'safe') {
                    this.resetClusters();
                    this.map.setLayoutProperty('safeshelterRajapurIcon', 'visibility', 'visible');
                }

                if (nextProps.rasterLayer === '5') {
                    this.resetFloodRasters();
                    this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'visible');
                    this.map.moveLayer('raster-rajapur-5', 'clusters-Health');
                }
                if (nextProps.rasterLayer === '10') {
                    this.resetFloodRasters();
                    this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'visible');
                    this.map.moveLayer('raster-rajapur-10', 'clusters-Health');
                }
                if (nextProps.rasterLayer === '50') {
                    this.resetFloodRasters();
                    this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'visible');
                    this.map.moveLayer('raster-rajapur-50', 'clusters-Health');
                }
                if (nextProps.rasterLayer === '100') {
                    this.resetFloodRasters();
                    this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'visible');
                    this.map.moveLayer('raster-rajapur-100', 'clusters-Health');
                }
                if (nextProps.rasterLayer === '1000') {
                    this.resetFloodRasters();
                    this.map.setLayoutProperty('raster-rajapur-1000', 'visibility', 'visible');
                    this.map.moveLayer('raster-rajapur-1000', 'clusters-Health');
                }
            }
        }
    }

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


    public resetFloodRasters = () => {
        this.map.setLayoutProperty('raster-rajapur-5', 'visibility', 'none');
        this.map.setLayoutProperty('raster-rajapur-10', 'visibility', 'none');
        this.map.setLayoutProperty('raster-rajapur-50', 'visibility', 'none');
        this.map.setLayoutProperty('raster-rajapur-100', 'visibility', 'none');
        this.map.setLayoutProperty('raster-rajapur-500', 'visibility', 'none');
    };


    public resetClusters = () => {
        categoriesCritical.map((item) => {
            this.map.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-${item}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'none');

            return null;
        });
        evaccenters.map((item) => {
            this.map.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-${item}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'none');

            return null;
        });
        this.map.setLayoutProperty('safeshelterRajapurIcon', 'visibility', 'none');
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
