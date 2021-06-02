import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxLegendControl from '@watergis/mapbox-gl-legend';
import { mapSources } from '#constants';
import CIData from '../RightPaneContents/RightPane4/ci';
import demographicsData from '../RightPaneContents/RightPane3/DemographyChartData';
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

let hoveredWardId = null;
const populationWardExpression = [
    'interpolate',
    ['linear'],
    ['feature-state', 'value'],
    1, 'rgb(255,143,13)', 2, 'rgb(255,111,0)',
    3, 'rgb(255,111,0)', 4, 'rgb(255,111,0)',
    5, 'rgb(255,143,13)', 6, 'rgb(255, 94, 0)',
    7, 'rgb(255, 94, 0)', 8, 'rgb(255,143,13)',
    99, 'rgb(255,235,199)',
];
const {
    data: criticalinfrastructures,

} = CIData;

const categoriesCritical = [...new Set(criticalinfrastructures.features.map(
    item => item.properties.CI,
))];


const rasterLayersYears = [5, 20, 50, 100];
const rasterLayers = rasterLayersYears.map(layer => `raster-rajapur-${layer}`);
const arrCritical = categoriesCritical.map(
    layer => [`clusters-count-${layer}`, `unclustered-point-${layer}`, `clusters-${layer}`],
);

const criticalInfraClusters = [].concat(...arrCritical);


const slideOneLayers = ['incidents-layer', 'Ward No.',
    'water', 'waterway',
    'Ward Boundary Line', 'Panch Pokhari Boundary', 'municipalitycentroidgeo'];

const slideTwoLayers = ['Ward No.', 'water', 'Ward Boundary Line',
    'ward-fill-local',
];

const slideThreeLayers = ['incidents-layer'];

const slideFourLayers = [
    ...criticalInfraClusters, 'water', 'wardOutline',
    'bridgeRajapur', 'canalRajapur',
    'waterway', 'rajapurRoads', 'wardFill',
];

const slideFiveLayers = [
    ...criticalInfraClusters, 'rajapurbuildings', ...rasterLayers, 'water',
    'bridgeRajapur', 'canalRajapur', 'waterway',
    'rajapurRoads', 'wardOutline', 'wardFill',
];
const slideSixLayers = [
    'safeshelterRajapurIcon', 'safeshelterRajapur',
    ...rasterLayers, 'water',
    'bridgeRajapur', 'rajapurRoads', 'canalRajapur', 'waterway',
    'wardOutline', 'wardFill',
];

class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lng: 85.64347922706821,
            lat: 28.013604885888867,
            zoom: 10,
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
            incidentList,
        } = this.props;
        const mapping = wards.filter(item => item.municipality === 23010).map(item => ({
            ...item,
            value: Number(item.title),
        }));

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: process.env.REACT_APP_VIZRISK_PANCHPOKHARI_MULTIHAZARD,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });


        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

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
                        'icon-size': 0.3,
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


                if (this.props.rightElement !== 3) {
                    this.map.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');
                }

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
                    'fill-color': populationWardExpression,
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0,
                        1,
                    ],
                },
                filter: getWardFilter(3, 24, 23010, wards),
            });
            if (this.props.rightElement !== 1) {
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            }

            if (this.props.rightElement === 0) {
                this.map.addControl(new MapboxLegendControl({}, { reverseOrder: false }), 'bottom-right');
            }
            if (this.props.rightElement === 2) {
                this.map.addControl(new MapboxLegendControl({}, { reverseOrder: false }), 'bottom-right');
                this.map.setLayoutProperty('Scree', 'visibility', 'visible');
                this.map.setLayoutProperty('Scrub', 'visibility', 'visible');
                this.map.setLayoutProperty('Forest', 'visibility', 'visible');
                this.map.setLayoutProperty('Farmlands', 'visibility', 'visible');
                this.map.setLayoutProperty('Farmland', 'visibility', 'visible');
                this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
                this.map.setLayoutProperty('Roads', 'visibility', 'visible');
            } else {
                this.map.setLayoutProperty('Scree', 'visibility', 'none');
                this.map.setLayoutProperty('Scrub', 'visibility', 'none');
                this.map.setLayoutProperty('Forest', 'visibility', 'none');
                this.map.setLayoutProperty('Farmlands', 'visibility', 'none');
                this.map.setLayoutProperty('Farmland', 'visibility', 'none');
                this.map.setLayoutProperty('Buildings', 'visibility', 'none');
                this.map.setLayoutProperty('Roads', 'visibility', 'none');
            }
            if (this.props.rightElement === 1) {
                this.map.setLayoutProperty('Population Density', 'visibility', 'visible');
            }

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

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
            this.map.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    this.map.getCanvas().style.cursor = 'pointer';

                    const { lngLat } = e;
                    const coordinates = [lngLat.lng, lngLat.lat];
                    const wardno = e.features[0].properties.title;
                    const details = demographicsData.chartData.filter(item => item.name === `Ward ${wardno}`);
                    const totalPop = details[0].MalePop + details[0].FemalePop;
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                            <p> Total Population: ${totalPop}</p>
                        </div>
                        `,
                    ).addTo(this.map);
                    if (hoveredWardId) {
                        this.map.setFeatureState(
                            {
                                id: hoveredWardId,
                                source: 'vizrisk-fills',
                                sourceLayer: mapSources.nepal.layers.ward,
                            },
                            { hover: false },
                        );
                    }
                    hoveredWardId = e.features[0].id;
                    console.log('hoveredWardId,', hoveredWardId);
                    console.log('e.features[0]', e.features[0]);
                    this.map.setFeatureState(
                        {
                            id: hoveredWardId,
                            source: 'vizrisk-fills',
                            sourceLayer: mapSources.nepal.layers.ward,

                        },
                        { hover: true },
                    );
                }
            });

            this.map.on('mouseleave', 'ward-fill-local', () => {
                this.map.getCanvas().style.cursor = '';
                popup.remove();
                if (hoveredWardId) {
                    this.map.setFeatureState(
                        {
                            source: 'vizrisk-fills',
                            id: hoveredWardId,
                            sourceLayer: mapSources.nepal.layers.ward,
                        },
                        { hover: false },

                    );
                    this.map.setPaintProperty('ward-fill-local', 'fill-color', populationWardExpression);
                }
                hoveredWardId = null;
            });

            categoriesCritical.map(layer => this.map.on('mousemove', `unclustered-point-${layer}`, (e) => {
                if (e) {
                    console.log('efeatures', e.features);
                    this.map.getCanvas().style.cursor = 'pointer';
                    const { lngLat } = e;
                    const coordinates = [lngLat.lng, lngLat.lat];
                    const ciName = e.features[0].properties.Name;
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                            <p>${ciName}</p>
                        </div>
                        `,
                    ).addTo(this.map);
                }
            }));
            categoriesCritical.map(layer => this.map.on('mouseleave', `unclustered-point-${layer}`, () => {
                this.map.getCanvas().style.cursor = '';
                popup.remove();
            }));
            // this.map.setZoom(1);
            // this.props.disableNavBtns('both');
            // setTimeout(() => {
            //     this.props.disableNavBtns('both');

            //     this.map.easeTo({
            //         zoom: 10.2,
            //         duration: 8000,
            //     });
            // }, 4000);
            // this.map.setPaintProperty('wardFill', 'fill-color', '#e0e0e0');
        });
    }

    public componentWillReceiveProps(nextProps) {
        const {
            rasterLayer,
            showPopulation,
            criticalElement,
            criticalFlood,
            rightElement,
        } = this.props;

        // disable the button
        if (this.map.isStyleLoaded()) {
            if (nextProps.showPopulation !== showPopulation) {
                if (nextProps.showPopulation === 'popdensity') {
                    this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
                // this.map.setLayoutProperty('ward-outline', 'visibility', 'none');
                // this.map.setLayoutProperty('wardNumbers', 'visibility', 'none');
                } else {
                    this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
                }
            }
            if (nextProps.criticalFlood !== criticalFlood) {
                this.handleInfraClusterSwitch(nextProps.criticalFlood);
            }
            if (nextProps.rasterLayer !== rasterLayer) {
                this.handleFloodRasterSwitch(nextProps.rasterLayer);
            }

            if (nextProps.criticalElement !== criticalElement) {
                this.handleInfraClusterSwitch(nextProps.criticalElement);
            }

            if (nextProps.rightElement !== rightElement) {
                if (nextProps.rightElement === 0) {
                    this.map.easeTo({
                        pitch: 0,
                        zoom: 11.4,
                        duration: 1000,
                    });
                    this.resetClusters();
                    this.orderLayers(slideOneLayers);
                    this.toggleVisiblity(slideTwoLayers, 'none');
                    this.toggleVisiblity(slideOneLayers, 'visible');
                } else if (nextProps.rightElement === 1) {
                // this.map.setPitch(40);
                //     this.map.easeTo({
                //         pitch: 40,
                //         zoom: 12,
                //         duration: 2000,
                //     });
                    this.toggleVisiblity(slideThreeLayers, 'none');
                    this.toggleVisiblity(slideOneLayers, 'none');
                    this.toggleVisiblity(slideTwoLayers, 'visible');
                    this.orderLayers(slideTwoLayers);
                } else if (nextProps.rightElement === 2) {
                    this.toggleVisiblity(slideTwoLayers, 'none');
                    this.toggleVisiblity(slideFourLayers, 'none');
                    this.toggleVisiblity(slideThreeLayers, 'visible');
                    this.orderLayers(slideThreeLayers);
                    this.resetClusters();
                } else if (nextProps.rightElement === 3) {
                    this.toggleVisiblity(slideThreeLayers, 'none');
                    this.toggleVisiblity(slideFiveLayers, 'none');
                    this.toggleVisiblity(slideFourLayers, 'visible');

                    this.orderLayers(slideFourLayers);
                    this.handleInfraClusterSwitch(criticalElement);
                    this.hideFloodRasters();
                } else if (nextProps.rightElement === 4) {
                    this.toggleVisiblity(slideFourLayers, 'none');
                    this.toggleVisiblity(slideSixLayers, 'none');
                    this.toggleVisiblity(slideFiveLayers, 'visible');

                    this.orderLayers(slideFiveLayers);
                    this.handleInfraClusterSwitch(criticalFlood);
                    this.handleFloodRasterSwitch('5');
                } else if (nextProps.rightElement === 5) {
                    this.toggleVisiblity(slideFiveLayers, 'none');
                    this.toggleVisiblity(slideSixLayers, 'visible');
                    this.orderLayers(slideSixLayers);
                    this.handleFloodRasterSwitch('5');
                }
            }
        }
    }


    public componentDidUpdate(nextProps) {
        // const inci = this.map.getLayer('incidents-layer');
        // if (!inci) {
        //     this.map.addSource('incidents', {
        //         type: 'geojson',
        //         data: this.props.incidentList,
        //     });
        //     this.map.addLayer(
        //         {
        //             id: 'incidents-layer',
        //             type: 'circle',
        //             source: 'incidents',
        //             layout: {},
        //             paint: {
        //                 'circle-color': '#ff0000',
        //             },
        //         },
        //     );
        // }


        // if (this.props.rightElement === 1) {
        //     const updateArea = (e) => {
        //         console.log(e);
        //     };
        //     const draw = new MapboxDraw({
        //         displayControlsDefault: false,
        //         controls: {
        //             polygon: true,
        //             trash: true,
        //         },
        //         defaultMode: 'draw_polygon',
        //     });
        //     this.map.addControl(draw, 'top-right');

        //     this.map.on('draw.create', updateArea);
        //     this.map.on('draw.delete', updateArea);
        //     this.map.on('draw.update', updateArea);
        // } if (this.props.rightElement === 0) {
        //     this.map.removeControl('draw');
        // }
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
    ].join('');

    public getGeoJSON = (filterBy: string, data: any) => {
        const geoObj = {};
        geoObj.type = 'FeatureCollection';
        geoObj.name = filterBy;
        geoObj.features = [];
        const d = data.features.filter(item => item.properties.CI === filterBy);
        geoObj.features.push(...d);
        return geoObj;
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
        } else {
            this.map.setLayoutProperty(`clusters-${layer}`, 'visibility', 'visible');
            this.map.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'visible');
            this.map.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'visible');
            this.map.moveLayer(`clusters-count-${layer}`);
        }
    };


    public handleFloodRasterSwitch = (layer) => {
        this.hideFloodRasters();
        this.map.setLayoutProperty(`raster-rajapur-${layer}`, 'visibility', 'visible');
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

    public handleInputChange = (e) => {
        console.log('e:', e.target.value);
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
