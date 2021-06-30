/* eslint-disable max-len */
/* eslint-disable react/no-did-update-set-state */
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
    1, '#fe9b2a', 2, '#fe9b2a',
    3, '#fe9b2a', 4, '#9a3404',
    5, '#d95f0e', 6, '#fe9b2a',
    7, '#ffffd6', 8, '#fe9b2a',
    9, '#fed990', 10, '#d95f0e',
];


const rasterLayersYears = [5, 50, 100, 500];
const rasterLayers = rasterLayersYears.map(layer => `raster-rajapur-${layer}`);

const slideOneLayers = ['wardNumbers',
    'water', 'waterway', 'municipalitycentroidgeo',
    'wardOutline', 'wardFill'];

const slideTwoLayers = ['water',
    'canalRajapur', 'rajapurbuildings', 'bridgeRajapur',
    'rajapurRoads', 'forestRajapur', 'agriculturelandRajapurPattern',
    'agriculturelandRajapur', 'wardOutline',
    'wardFill',
];

const slideThreeLayers = ['wardNumbers', 'water', 'wardOutline',
    'ward-fill-local', 'bufferRajapur',
    'population-extruded'];


class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lat: 28.42722351741294,
            lng: 81.12424608127894,
            zoom: 11,
            wardNumber: 'Hover to see ward number',
            categoriesCritical: [],
            categoriesEvac: [],
            slideFourLayers: [],
            slideFiveLayers: [],
            slideSixLayers: [],
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
            cI: criticalinfrastructures,
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

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: process.env.REACT_APP_VIZRISK_RAJAPUR_FLOOD,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });

        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

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
                    const details = demographicsData.demographicsData.filter(item => item.name === `Ward ${wardno}`);
                    const totalPop = details[0].MalePop + details[0].FemalePop;
                    // const description = (
                    //     `Ward No:
                    //         ${wardno}
                    //     Male Population: ${details[0].MalePop}
                    //     Female Population: ${details[0].FemalePop}
                    //     Total Household: ${details[0].TotalHousehold}
                    //         `
                    // );
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                            <p> Total Population: ${totalPop}</p>
                        </div>
                        `,
                    ).addTo(this.map);
                    if (hoveredWardId) {
                        this.setState({ wardNumber: hoveredWardId });
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

            this.map.setZoom(1);
            this.props.disableNavBtns('both');
            setTimeout(() => {
                this.props.disableNavBtns('both');

                this.map.easeTo({
                    zoom: 11.4,
                    duration: 8000,
                });
            }, 4000);
            this.map.setPaintProperty('wardFill', 'fill-color', '#e0e0e0');
        });
    }


    public componentWillReceiveProps(nextProps) {
        const {
            rasterLayer,
            showPopulation,
            criticalElement,
            evacElement,
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
            if (nextProps.evacElement !== evacElement) {
                this.handleEvacClusterSwitch(nextProps.evacElement);
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
                    this.map.easeTo({
                        pitch: 40,
                        zoom: 12,
                        duration: 2000,
                    });
                    this.toggleVisiblity(slideThreeLayers, 'none');
                    this.toggleVisiblity(slideOneLayers, 'none');
                    this.toggleVisiblity(slideTwoLayers, 'visible');
                    this.map.setPaintProperty('wardFill', 'fill-color', '#b4b4b4');
                    this.orderLayers(slideTwoLayers);
                } else if (nextProps.rightElement === 2) {
                    this.toggleVisiblity(slideTwoLayers, 'none');
                    this.toggleVisiblity(this.state.slideFourLayers, 'none');
                    this.toggleVisiblity(slideThreeLayers, 'visible');
                    this.orderLayers(slideThreeLayers);
                    this.resetClusters();
                } else if (nextProps.rightElement === 3) {
                    this.toggleVisiblity(slideThreeLayers, 'none');
                    this.toggleVisiblity(this.state.slideFiveLayers, 'none');
                    this.toggleVisiblity(this.state.slideFourLayers, 'visible');

                    this.orderLayers(this.state.slideFourLayers);
                    this.handleInfraClusterSwitch(criticalElement);
                    this.hideFloodRasters();
                } else if (nextProps.rightElement === 4) {
                    this.toggleVisiblity(this.state.slideFourLayers, 'none');
                    this.toggleVisiblity(this.state.slideSixLayers, 'none');
                    this.toggleVisiblity(this.state.slideFiveLayers, 'visible');

                    this.orderLayers(this.state.slideFiveLayers);
                    this.handleInfraClusterSwitch(criticalFlood);
                    this.handleFloodRasterSwitch('5');
                } else if (nextProps.rightElement === 5) {
                    this.toggleVisiblity(this.state.slideFiveLayers, 'none');
                    this.toggleVisiblity(this.state.slideSixLayers, 'visible');
                    this.orderLayers(this.state.slideSixLayers);
                    this.handleFloodRasterSwitch('5');
                    this.handleEvacClusterSwitch(evacElement);
                }
            }
        }
    }

    public componentDidUpdate(prevProps) {
        const {
            wards,
            cI,
        } = this.props;
        // const { criticalinfrastructures } = SchoolGeoJSON;


        if (this.props.cI !== prevProps.cI && this.props.cI.features.length > 0) {
            const evacCulture = cI.features.filter(item => item.properties.Type === 'cultural');
            const evaceducation = cI.features.filter(item => item.properties.Type === 'education');

            const categoriesEvac = ['cultural', 'education'];
            // const categoriesEvac = [...new Set(evaccenters.features.map(
            //     item => item.properties.Type,
            // ))];
            const arrEvac = categoriesEvac.map(
                layer => [`evac-count-${layer}`, `evac-unclustered-${layer}`, `evac-${layer}`],
            );

            const evacClusters = [].concat(...arrEvac);
            console.log('cI from server', cI);
            const featuresArr = cI.features
                .filter(item => item.geometry !== undefined)
                .map((item) => {
                    console.log(item.geometry);
                    return {
                        properties: item.properties,
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: item.geometry.coordinates,
                        },
                    };
                });
            const criticalinfrastructures = {
                type: 'FeatureCollection',
                name: 'CI',
                features: featuresArr,
            };
            const evaccenters = {
                type: 'FeatureCollection',
                name: 'CI',
                features: [...evacCulture, ...evaceducation],
            };
            const categoriesCritical = [...new Set(criticalinfrastructures.features.map(
                item => item.properties.results__r,
            ))];
            this.setState({ categoriesCritical });
            this.setState({ categoriesEvac });
            const arrCritical = categoriesCritical.map(
                layer => [`clusters-count-${layer}`, `unclustered-point-${layer}`, `clusters-${layer}`],
            );
            const criticalInfraClusters = [].concat(...arrCritical);


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

            this.setState({ slideFourLayers });
            this.setState({ slideFiveLayers });
            this.setState({ slideSixLayers });


            console.log('evaccenters', evaccenters);
            console.log('criticalinfrastructures', criticalinfrastructures);
            // console.log('slideFourLayers', slideFourLayers);
            // console.log('slideFiveLayers', slideFiveLayers);
            // console.log('map', this.map);
            const mapLayer = this.map.getLayer('clusters-finance');
            if (typeof mapLayer === 'undefined') {
                categoriesEvac.map((layer) => {
                    this.map.addSource(`evac-${layer}`, {
                        type: 'geojson',
                        data: this.getGeoJSON(layer, evaccenters),
                        cluster: true,
                        clusterRadius: 50,
                    });

                    this.map.addLayer({
                        id: `evac-clusters-${layer}`,
                        type: 'circle',
                        source: `evac-${layer}`,
                        filter: ['has', 'point_count'],
                        paint: {
                            'circle-color': [
                                'step',
                                ['get', 'point_count'],
                                '#ff0000',
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
                        id: `evac-unclustered-point-${layer}`,
                        type: 'symbol',
                        source: `evac-${layer}`,
                        filter: ['!', ['has', 'point_count']],
                        layout: {
                            'icon-image': ['get', 'icon'],
                            'icon-size': 0.3,
                        },
                    });

                    this.map.addLayer({
                        id: `evac-clusters-count-${layer}`,
                        type: 'symbol',
                        source: `evac-${layer}`,
                        layout: {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12,
                        },
                    });

                    this.map.setLayoutProperty(`evac-unclustered-point-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`evac-clusters-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`evac-clusters-count-${layer}`, 'visibility', 'none');

                    return null;
                });
                console.log('categoriesCritical', categoriesCritical);
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
                            // 'circle-color': '#a4ac5e',
                            // 'circle-radius': 20,
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
                            'icon-image': ['downcase', ['get', 'results__r']],
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


                    this.map.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');
                    return null;
                });
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
        const ourD = data.features.filter(item => item.properties.results__r === filterBy);
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
        this.state.categoriesCritical.map((layer) => {
            this.map.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');

            return null;
        });
        // categoriesEvac.map((layer) => {
        //     this.map.setLayoutProperty(
        //         `evac-${layer}`, 'visibility', 'none',
        //     );
        //     this.map.setLayoutProperty(
        //         `evac-count-${layer}`, 'visibility', 'none',
        //     );
        //     this.map.setLayoutProperty(
        //         `evac-unclustered-${layer}`, 'visibility', 'none',
        //     );

        //     this.map.setLayoutProperty('safeshelterRajapur', 'visibility', 'none');
        //     this.map.setLayoutProperty('safeshelterRajapurIcon', 'visibility', 'none');
        //     return null;
        // });
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
            this.state.categoriesCritical.map((item) => {
                this.map.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'visible');
                this.map.setLayoutProperty(`clusters-${item}`, 'visibility', 'visible');
                this.map.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'visible');
                return null;
            });
        } else if (layer === 'Health') {
            this.map.setLayoutProperty('clusters-health', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-health', 'visibility', 'visible');
            this.map.setLayoutProperty('unclustered-point-health', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-health');
        } else if (layer === 'bank') {
            this.map.setLayoutProperty('unclustered-point-finance', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-finance', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-finance', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-finance');
        } else if (layer === 'governance') {
            this.map.setLayoutProperty('unclustered-point-governance', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-governance', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-governance', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-Bank');
        } else if (layer === 'industry') {
            this.map.setLayoutProperty('unclustered-point-industry', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-industry', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-industry', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-industry');
        } else if (layer === 'education') {
            this.map.setLayoutProperty('unclustered-point-education', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-education', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-education', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-education');
        } else if (layer === 'culture') {
            this.map.setLayoutProperty('unclustered-point-culture', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-culture', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-culture', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-culture');
        } else if (layer === 'tourism') {
            this.map.setLayoutProperty('unclustered-point-tourism', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-count-tourism', 'visibility', 'visible');
            this.map.setLayoutProperty('clusters-tourism', 'visibility', 'visible');
            this.map.moveLayer('clusters-count-tourism');
        }
    };

    public handleEvacClusterSwitch = (layer) => {
        this.resetClusters();
        if (layer === 'all') {
            this.state.categoriesEvac.map((item) => {
                this.map.setLayoutProperty(`evac-count-${item}`, 'visibility', 'visible');
                this.map.setLayoutProperty(`evac-${item}`, 'visibility', 'visible');
                this.map.setLayoutProperty(`evac-unclustered-${item}`, 'visibility', 'visible');
                return null;
            });
        } else if (layer === 'education') {
            this.map.setLayoutProperty('evac-education', 'visibility', 'visible');
            this.map.setLayoutProperty('evac-count-education', 'visibility', 'visible');
            this.map.setLayoutProperty('evac-unclustered-education', 'visibility', 'visible');
        } else if (layer === 'culture') {
            this.map.setLayoutProperty('evac-culture', 'visibility', 'visible');
            this.map.setLayoutProperty('evac-count-culture', 'visibility', 'visible');
            this.map.setLayoutProperty('evac-unclustered-culture', 'visibility', 'visible');
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
