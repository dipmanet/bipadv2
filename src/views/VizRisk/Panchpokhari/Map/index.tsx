import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxLegendControl from '@watergis/mapbox-gl-legend';
import { isDefined } from '@togglecorp/fujs';
import { mapSources } from '#constants';
// import CIData from '../RightPaneContents/RightPane4/ci';
import demographicsData from '../RightPaneContents/RightPane3/DemographyChartData';
import styles from './styles.scss';
import '@watergis/mapbox-gl-legend/css/styles.css';
import { getHillShadeLayer, getGeoJSONPH } from '#views/VizRisk/Panchpokhari/utils';

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
// const {
//     data: criticalinfrastructures,
// } = CIData;

// const categoriesCritical = [...new Set(criticalinfrastructures.features.map(
//     item => item.properties.Type,
// ))];


class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lng: 85.64347922706821,
            lat: 28.013604885888867,
            zoom: 10,
            wardNumber: 'Hover to see ward number',
            categoriesCritical: [],
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


        this.map.on('style.load', () => {
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
            console.log('right element', this.props.rightElement);
            this.map.addSource('hillshadePachpokhari', {
                type: 'raster',
                tiles: [this.getRasterLayer()],
                tileSize: 256,
            });
            this.map.addLayer(
                {
                    id: 'raster-hillshade',
                    type: 'raster',
                    source: 'hillshadePachpokhari',
                    layout: {},
                    paint: {
                        'raster-opacity': 0.25,
                    },
                },
            );
            const { CIData } = this.props;

            if (isDefined(CIData.features)) {
                const categoriesCritical = [...new Set(CIData.features.map(
                    item => item.properties.Type,
                ))];
                this.setState({ categoriesCritical });

                categoriesCritical.map((layer) => {
                    this.map.addSource(layer, {
                        type: 'geojson',
                        data: getGeoJSONPH(layer, CIData),
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
                            'icon-image': ['downcase', ['get', 'Type']],
                            'icon-size': 0.3,
                            'icon-anchor': 'bottom',
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

                    // here
                    categoriesCritical.map(ci => this.map.on('mousemove', `unclustered-point-${ci}`, (e) => {
                        if (e) {
                            console.log('efeatures', e.features);
                            this.map.getCanvas().style.cursor = 'pointer';
                            const { lngLat } = e;
                            const coordinates = [lngLat.lng, lngLat.lat];
                            const ciName = e.features[0].properties.title;
                            popup.setLngLat(coordinates).setHTML(
                                `<div style="padding: 5px;border-radius: 5px">
                            <p>${ciName}</p>
                        </div>
                        `,
                            ).addTo(this.map);
                        }
                    }));
                    categoriesCritical.map(ci => this.map.on('mouseleave', `unclustered-point-${ci}`, () => {
                        this.map.getCanvas().style.cursor = '';
                        popup.remove();
                    }));
                    return null;
                });
            }


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

                this.map.setLayoutProperty('Rock-Stone', 'visibility', 'none');
                this.map.setLayoutProperty('Snow', 'visibility', 'none');
                this.map.setLayoutProperty('Shrub', 'visibility', 'none');
                this.map.setLayoutProperty('Forest', 'visibility', 'none');
                this.map.setLayoutProperty('Farmlands', 'visibility', 'none');
                this.map.setLayoutProperty('Buildings', 'visibility', 'none');
                this.map.setLayoutProperty('Roads', 'visibility', 'none');
            }

            if (this.props.rightElement === 0) {
                this.map.setLayoutProperty('National Park', 'visibility', 'visible');
                this.map.setLayoutProperty('raster-hillshade', 'visibility', 'visible');
                this.map.moveLayer('raster-hillshade');
                this.map.setLayoutProperty('Snow', 'visibility', 'none');
                this.map.setLayoutProperty('Shrub', 'visibility', 'none');
                this.map.setLayoutProperty('Forest', 'visibility', 'none');
                this.map.setLayoutProperty('Farmlands', 'visibility', 'none');
                this.map.setLayoutProperty('Buildings', 'visibility', 'none');
                this.map.setLayoutProperty('Roads', 'visibility', 'none');
            }
            if (this.props.rightElement === 2) {
                this.map.setLayoutProperty('Snow', 'visibility', 'visible');
                this.map.setLayoutProperty('Shrub', 'visibility', 'visible');
                this.map.setLayoutProperty('Forest', 'visibility', 'visible');
                this.map.setLayoutProperty('Farmlands', 'visibility', 'visible');
                this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
                this.map.setLayoutProperty('Roads', 'visibility', 'visible');
                this.map.setLayoutProperty('National Park', 'visibility', 'none');
            }
            if (this.props.rightElement === 3) {
                this.map.setLayoutProperty('Snow', 'visibility', 'visible');
                this.map.setLayoutProperty('Shrub', 'visibility', 'visible');
                this.map.setLayoutProperty('Forest', 'visibility', 'visible');
                this.map.setLayoutProperty('Farmlands', 'visibility', 'visible');
                this.map.setLayoutProperty('Buildings', 'visibility', 'visible');
                this.map.setLayoutProperty('Roads', 'visibility', 'visible');
                this.map.setLayoutProperty('National Park', 'visibility', 'none');
            }
            if (this.props.rightElement === 1) {
                this.map.setLayoutProperty('Population Density', 'visibility', 'visible');
                this.map.setLayoutProperty('Ward Boundary Line', 'visibility', 'visible');
                this.map.moveLayer('Ward Boundary Line');
                this.map.setLayoutProperty('Ward No.', 'visibility', 'visible');
                this.map.moveLayer('Ward No.');
                this.map.setLayoutProperty('raster-hillshade', 'visibility', 'none');
                this.map.setLayoutProperty('National Park', 'visibility', 'visible');

                this.map.setLayoutProperty('Snow', 'visibility', 'none');
                this.map.setLayoutProperty('Shrub', 'visibility', 'none');
                this.map.setLayoutProperty('Forest', 'visibility', 'none');
                this.map.setLayoutProperty('Farmlands', 'visibility', 'none');
                this.map.setLayoutProperty('Buildings', 'visibility', 'none');
                this.map.setLayoutProperty('Roads', 'visibility', 'none');
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


    public componentDidUpdate(prevProps) {
        if (this.props.showPopulation !== prevProps.showPopulation) {
            if (this.props.showPopulation === 'popdensity') {
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            } else {
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
            }
        }
        if (this.props.criticalElement !== prevProps.criticalElement) {
            this.resetClusters();
            const { categoriesCritical } = this.state;
            const layer = this.props.criticalElement;
            if (layer === 'all') {
                categoriesCritical.map((item) => {
                    this.map.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'visible');
                    this.map.setLayoutProperty(`clusters-${item}`, 'visibility', 'visible');
                    this.map.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'visible');
                    return null;
                });
            } else if (layer === 'Health') {
                this.map.setLayoutProperty('clusters-Health', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Health', 'visibility', 'visible');
                this.map.setLayoutProperty('unclustered-point-Health', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Health');
            } else if (layer === 'Finance') {
                this.map.setLayoutProperty('unclustered-point-Finance', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Finance', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-Finance', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Finance');
            } else if (layer === 'Governance') {
                this.map.setLayoutProperty('unclustered-point-Governance', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Governance', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-Governance', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Bank');
            } else if (layer === 'Industry') {
                this.map.setLayoutProperty('unclustered-point-Industry', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Industry', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-Industry', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Industry');
            } else if (layer === 'Education') {
                this.map.setLayoutProperty('unclustered-point-Education', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Education', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-Education', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Education');
            } else if (layer === 'Culture') {
                this.map.setLayoutProperty('unclustered-point-Culture', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Culture', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-Culture', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Culture');
            } else if (layer === 'Tourism') {
                this.map.setLayoutProperty('unclustered-point-Tourism', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Tourism', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-Tourism', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Tourism');
            } else if (layer === 'Water sources') {
                this.map.setLayoutProperty('unclustered-point-Water sources', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Water sources', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-Water sources', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Water sources');
            } else if (layer === 'Trade and business') {
                this.map.setLayoutProperty('unclustered-point-Trade and business', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-Trade and business', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-Trade and business', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-Trade and business');
            }
        }
        if (prevProps.CIData !== this.props.CIData) {
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
            const { CIData } = this.props;
            const inci = this.map.getLayer('Buildings');
            // if (CIData.length > 0) {
            if (isDefined(CIData.features) && typeof inci !== 'undefined') {
                const categoriesCritical = [...new Set(CIData.features.map(
                    item => item.properties.Type,
                ))];
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ categoriesCritical });

                categoriesCritical.map((layer) => {
                    this.map.addSource(layer, {
                        type: 'geojson',
                        data: getGeoJSONPH(layer, CIData),
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
                            'icon-image': ['downcase', ['get', 'Type']],
                            'icon-size': 0.3,
                            'icon-anchor': 'bottom',
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
                    categoriesCritical.map(ci => this.map.on('mousemove', `unclustered-point-${ci}`, (e) => {
                        if (e) {
                            console.log('efeatures', e.features);
                            this.map.getCanvas().style.cursor = 'pointer';
                            const { lngLat } = e;
                            const coordinates = [lngLat.lng, lngLat.lat];
                            const ciName = e.features[0].properties.title;
                            popup.setLngLat(coordinates).setHTML(
                                `<div style="padding: 5px;border-radius: 5px">
                            <p>${ciName}</p>
                        </div>
                        `,
                            ).addTo(this.map);
                        }
                    }));
                    categoriesCritical.map(ci => this.map.on('mouseleave', `unclustered-point-${ci}`, () => {
                        this.map.getCanvas().style.cursor = '';
                        popup.remove();
                    }));
                    if (this.props.rightElement !== 3) {
                        this.map.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                        this.map.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                        this.map.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');
                    }
                    return null;
                });
            }
        }
    }

    public componentWillUnmount() {
        this.map.remove();
    }

    public getRasterLayer = () => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        '&layers=Bipad:Panchpokhari_hillshade',
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


    public resetClusters = () => {
        this.state.categoriesCritical.map((layer) => {
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
            this.state.categoriesCritical.map((item) => {
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
