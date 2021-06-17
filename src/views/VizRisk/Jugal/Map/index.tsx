import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import MapboxLegendControl from '@watergis/mapbox-gl-legend';
import { isDefined } from '@togglecorp/fujs';
import { mapSources } from '#constants';
import demographicsData from '../Data/demographicsData';
import expressions from '../Data/expressions';
import * as PageTypes from '#store/atom/page/types';
import '@watergis/mapbox-gl-legend/css/styles.css';
import { getHillShadeLayer, getGeoJSON } from '#views/VizRisk/Jugal/utils';

import {
    municipalitiesSelector,
    districtsSelector,
    wardsSelector,
    boundsSelector,
    selectedProvinceIdSelector,
    selectedDistrictIdSelector,
    selectedMunicipalityIdSelector,
} from '#selectors';

import {
    getWardFilter,
} from '#utils/domain';

interface State{
    lat: number;
    lng: number;
    zoom: number;
}

interface OwnProps{
    rightElement: number;
}

interface PropsFromAppState {
    districts: PageTypes.District[];
    municipalities: PageTypes.Municipality[];
    wards: PageTypes.Ward[];
    bounds: [];
    selectedProvinceId: number;
    selectedDistrictId: number;
    selectedMunicipalityId: number;
}

type Props = OwnProps & PropsFromAppState;

const { REACT_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = process.env;
if (TOKEN) {
    mapboxgl.accessToken = TOKEN;
}

const mapStateToProps = (state, props) => ({
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    bounds: boundsSelector(state, props),
    selectedProvinceId: selectedProvinceIdSelector(state, props),
    selectedDistrictId: selectedDistrictIdSelector(state, props),
    selectedMunicipalityId: selectedMunicipalityIdSelector(state, props),
});

let hoveredWardId = null;
const { populationWardExpression } = expressions;


const landCoverLayers = ['Rock-Stone', 'Shrub', 'Forest', 'Farmlands', 'Buildings', 'Roads', 'Snow'];

const popDensityLayers = ['Population Density', 'WardBoundary', 'Wardnumber'];

class JugalMap extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            lat: 28.015490220644214,
            lng: 85.79108507481781,
            zoom: 10,
            categoriesCritical: [],
        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom,
        } = this.state;

        const {
            wards,
            rightElement,
        } = this.props;

        const mapping = wards.filter(item => item.municipality === 23007).map(item => ({
            ...item,
            value: Number(item.title),
        }));

        this.jugalMap = new mapboxgl.Map({
            container: this.mapContainer,
            style: process.env.REACT_APP_VIZRISK_JUGAL_LANDSLIDE,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });


        this.jugalMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        this.jugalMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        this.jugalMap.on('style.load', () => {
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });
            this.jugalMap.addSource('jugalHillshade', {
                type: 'raster',
                tiles: [getHillShadeLayer('Jugal_hillshade')],
                tileSize: 256,
            });

            this.jugalMap.addLayer(
                {
                    id: 'jugalHillshadeLayer',
                    type: 'raster',
                    source: 'jugalHillshade',
                    layout: {},
                    paint: {
                        'raster-opacity': 0.25,
                    },
                },
            );

            const { CIData } = this.props;

            // if (CIData.length > 0) {
            if (isDefined(CIData.features)) {
                const categoriesCritical = [...new Set(CIData.features.map(
                    item => item.properties.CI,
                ))];
                    // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ categoriesCritical });

                categoriesCritical.map((layer) => {
                    this.jugalMap.addSource(layer, {
                        type: 'geojson',
                        data: getGeoJSON(layer, CIData),
                        cluster: true,
                        clusterRadius: 50,
                    });
                    this.jugalMap.addLayer({
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

                    this.jugalMap.addLayer({
                        id: `unclustered-point-${layer}`,
                        type: 'symbol',
                        source: layer,
                        filter: ['!', ['has', 'point_count']],
                        layout: {
                            'icon-image': ['downcase', ['get', 'CI']],
                            'icon-size': 0.3,
                            'icon-anchor': 'bottom',
                        },
                    });

                    this.jugalMap.addLayer({
                        id: `clusters-count-${layer}`,
                        type: 'symbol',
                        source: layer,
                        layout: {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12,
                        },
                    });
                    categoriesCritical.map(ci => this.jugalMap.on('mousemove', `unclustered-point-${ci}`, (e) => {
                        if (e) {
                            console.log('efeatures', e.features);
                            this.jugalMap.getCanvas().style.cursor = 'pointer';
                            const { lngLat } = e;
                            const coordinates = [lngLat.lng, lngLat.lat];
                            const ciName = e.features[0].properties.Name;
                            popup.setLngLat(coordinates).setHTML(
                                `<div style="padding: 5px;border-radius: 5px">
                            <p>${ciName}</p>
                        </div>
                        `,
                            ).addTo(this.jugalMap);
                        }
                    }));
                    categoriesCritical.map(ci => this.jugalMap.on('mouseleave', `unclustered-point-${ci}`, () => {
                        this.jugalMap.getCanvas().style.cursor = '';
                        popup.remove();
                    }));
                    if (this.props.rightElement !== 3) {
                        this.jugalMap.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                        this.jugalMap.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                        this.jugalMap.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');
                    }

                    return null;
                });
            }


            this.jugalMap.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
            });
            this.jugalMap.addSource('density', {
                type: 'vector',
                url: mapSources.populationDensity.url,
            });

            this.jugalMap.addLayer({
                id: 'ward-fill-local',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'fill',
                paint: {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['feature-state', 'value'],
                        1, 'rgb(255,143,13)', 2, 'rgb(255,111,0)',
                        3, 'rgb(255,111,0)', 4, 'rgb(255,143,13)',
                        5, 'rgb(255,111,0)', 6, 'rgb(255,207,142)',
                        7, 'rgb(255,143,13)', 8, 'rgb(207,144,119)',
                        99, 'rgb(255,235,199)',
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0,
                        1,
                    ],
                },
                filter: getWardFilter(3, 24, 23007, wards),
            });
            console.log('jugal map:', this.jugalMap);
            if (rightElement === 0) {
                this.jugalMap.setLayoutProperty('Buildings', 'visibility', 'visible');
                this.jugalMap.moveLayer('Buildings');
                this.jugalMap.setLayoutProperty('Population Density', 'visibility', 'none');
            }
            if (rightElement === 1) {
                console.log('rightElement', rightElement);
                popDensityLayers.map((l) => {
                    this.jugalMap.setLayoutProperty(l, 'visibility', 'visible');
                    return null;
                });
                this.jugalMap.setLayoutProperty('National Park', 'visibility', 'visible');
                this.jugalMap.setPaintProperty('National Park', 'fill-color', 'rgb(247,229,184)');
                this.jugalMap.moveLayer('National Park');


                this.jugalMap.setLayoutProperty('Jugal Mun Bondary', 'visibility', 'none');
                this.jugalMap.setLayoutProperty('Jugal Contour', 'visibility', 'none');
                this.jugalMap.setLayoutProperty('jugalHillshadeLayer', 'visibility', 'none');
                this.jugalMap.moveLayer('WardBoundary');
                this.jugalMap.moveLayer('Wardnumber');
            } else {
                this.jugalMap.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            }

            if (rightElement === 2) {
                this.jugalMap.setLayoutProperty('National Park', 'visibility', 'none');
                landCoverLayers.map((l) => {
                    this.jugalMap.setLayoutProperty(l, 'visibility', 'visible');
                    return null;
                });
                this.jugalMap.setLayoutProperty('Population Density', 'visibility', 'none');
            }
            if (rightElement === 3) {
                this.jugalMap.setLayoutProperty('National Park', 'visibility', 'none');
                landCoverLayers.map((l) => {
                    this.jugalMap.setLayoutProperty(l, 'visibility', 'visible');
                    return null;
                });
                this.jugalMap.setLayoutProperty('Population Density', 'visibility', 'none');
            }

            // else {
            //     landCoverLayers.map((l) => {
            //         this.jugalMap.setLayoutProperty(l, 'visibility', 'visible');
            //         return null;
            //     });
            // }


            mapping.forEach((attribute) => {
                this.jugalMap.setFeatureState(
                    {
                        id: attribute.id,
                        source: 'vizrisk-fills',
                        sourceLayer: mapSources.nepal.layers.ward,
                    },
                    { value: attribute.value },
                );
            });


            this.jugalMap.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    this.jugalMap.getCanvas().style.cursor = 'pointer';

                    const { lngLat } = e;
                    const coordinates = [lngLat.lng, lngLat.lat];
                    const wardno = e.features[0].properties.title;
                    const details = demographicsData.demographicsData.filter(item => item.name === `Ward ${wardno}`);
                    const totalPop = details[0].MalePop + details[0].FemalePop;
                    popup.setLngLat(coordinates).setHTML(
                        `<div style="padding: 5px;border-radius: 5px">
                            <p> Total Population: ${totalPop}</p>
                        </div>
                        `,
                    ).addTo(this.jugalMap);
                    if (hoveredWardId) {
                        this.jugalMap.setFeatureState(
                            {
                                id: hoveredWardId,
                                source: 'vizrisk-fills',
                                sourceLayer: mapSources.nepal.layers.ward,
                            },
                            { hover: false },
                        );
                    }
                    hoveredWardId = e.features[0].id;
                    this.jugalMap.setFeatureState(
                        {
                            id: hoveredWardId,
                            source: 'vizrisk-fills',
                            sourceLayer: mapSources.nepal.layers.ward,

                        },
                        { hover: true },
                    );
                }
            });

            this.jugalMap.on('mouseleave', 'ward-fill-local', () => {
                this.jugalMap.getCanvas().style.cursor = '';
                popup.remove();
                if (hoveredWardId) {
                    this.jugalMap.setFeatureState(
                        {
                            source: 'vizrisk-fills',
                            id: hoveredWardId,
                            sourceLayer: mapSources.nepal.layers.ward,
                        },
                        { hover: false },

                    );
                    this.jugalMap.setPaintProperty('ward-fill-local', 'fill-color', populationWardExpression);
                }
                hoveredWardId = null;
            });
        });
    }

    public componentDidUpdate(prevProps) {
        if (this.props.showPopulation !== prevProps.showPopulation) {
            if (this.props.showPopulation === 'popdensity') {
                this.jugalMap.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            } else {
                this.jugalMap.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
            }
        }
        if (this.props.criticalElement !== prevProps.criticalElement) {
            this.resetClusters();
            console.log('CI categories', this.state.categoriesCritical);

            const layer = this.props.criticalElement;
            if (layer === 'all') {
                this.state.categoriesCritical.map((item) => {
                    this.jugalMap.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'visible');
                    this.jugalMap.setLayoutProperty(`clusters-${item}`, 'visibility', 'visible');
                    this.jugalMap.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'visible');
                    return null;
                });
            } else if (layer === 'Health') {
                this.jugalMap.setLayoutProperty('clusters-Health', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Health', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('unclustered-point-Health', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Health');
            } else if (layer === 'Bank') {
                this.jugalMap.setLayoutProperty('unclustered-point-Finance', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Finance', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Finance', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Finance');
            } else if (layer === 'Governance') {
                this.jugalMap.setLayoutProperty('unclustered-point-Government Buildings', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Government Buildings', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Government Buildings', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Government Buildings');
            } else if (layer === 'Industry') {
                this.jugalMap.setLayoutProperty('unclustered-point-Industry/ hydropower', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Industry/ hydropower', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Industry/ hydropower', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Industry/ hydropower');
            } else if (layer === 'Education') {
                this.jugalMap.setLayoutProperty('unclustered-point-Education', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Education', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Education', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Education');
            } else if (layer === 'Culture') {
                this.jugalMap.setLayoutProperty('unclustered-point-Community buildings', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Community buildings', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Community buildings', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('unclustered-point-Cultural heritage sites', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Cultural heritage sites', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Cultural heritage sites', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Community buildings');
            } else if (layer === 'Tourism') {
                this.jugalMap.setLayoutProperty('unclustered-point-Hotel/resort/homestay', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Hotel/resort/homestay', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Hotel/resort/homestay', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Hotel/resort/homestay');
            } else if (layer === 'Water sources') {
                this.jugalMap.setLayoutProperty('unclustered-point-Water sources', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-count-Water sources', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Water sources', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Water sources');
            } else if (layer === 'Trade and business') {
                this
                    .jugalMap
                    .setLayoutProperty(
                        'unclustered-point-Trade and business (groceries, meat, textiles)',
                        'visibility', 'visible',
                    );
                this.jugalMap.setLayoutProperty('clusters-count-Trade and business (groceries, meat, textiles)', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('clusters-Trade and business (groceries, meat, textiles)', 'visibility', 'visible');
                this.jugalMap.moveLayer('clusters-count-Trade and business (groceries, meat, textiles)');
            }
        }
        if (prevProps.CIData !== this.props.CIData) {
            const { CIData } = this.props;
            // if (CIData.length > 0) {
            if (isDefined(CIData.features)) {
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    className: 'popup',
                });
                const categoriesCritical = [...new Set(CIData.features.map(
                    item => item.properties.CI,
                ))];
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ categoriesCritical });

                categoriesCritical.map((layer) => {
                    this.jugalMap.addSource(layer, {
                        type: 'geojson',
                        data: getGeoJSON(layer, CIData),
                        cluster: true,
                        clusterRadius: 50,
                    });
                    this.jugalMap.addLayer({
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

                    this.jugalMap.addLayer({
                        id: `unclustered-point-${layer}`,
                        type: 'symbol',
                        source: layer,
                        filter: ['!', ['has', 'point_count']],
                        layout: {
                            'icon-image': ['downcase', ['get', 'CI']],
                            'icon-size': 0.3,
                            'icon-anchor': 'bottom',
                        },
                    });

                    this.jugalMap.addLayer({
                        id: `clusters-count-${layer}`,
                        type: 'symbol',
                        source: layer,
                        layout: {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12,
                        },
                    });
                    categoriesCritical.map(ci => this.jugalMap.on('mousemove', `unclustered-point-${ci}`, (e) => {
                        if (e) {
                            this.jugalMap.getCanvas().style.cursor = 'pointer';
                            const { lngLat } = e;
                            const coordinates = [lngLat.lng, lngLat.lat];
                            const ciName = e.features[0].properties.Name;
                            console.log('name', e.features[0].properties.Name);
                            console.log('properties', e.features[0].properties);
                            popup.setLngLat(coordinates).setHTML(
                                `<div style="padding: 5px;border-radius: 5px">
                            <p>${ciName}</p>
                        </div>
                        `,
                            ).addTo(this.jugalMap);
                        }
                    }));
                    categoriesCritical.map(ci => this.jugalMap.on('mouseleave', `unclustered-point-${ci}`, () => {
                        this.jugalMap.getCanvas().style.cursor = '';
                        popup.remove();
                    }));
                    if (this.props.rightElement !== 3) {
                        this.jugalMap.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                        this.jugalMap.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                        this.jugalMap.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');
                    }

                    return null;
                });
            }
        }
    }

    public componentWillUnmount() {
        this.jugalMap.remove();
    }

    public resetClusters = () => {
        this.state.categoriesCritical.map((layer) => {
            this.jugalMap.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
            this.jugalMap.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
            this.jugalMap.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');

            return null;
        });
    }

    [x: string]: any;

    public render() {
        const mapStyle = {
            position: 'absolute',
            width: '70%',
            left: 'calc(30% - 60px)',
            top: 0,
            height: '100vh',
        };

        return (
            <div>
                <div style={mapStyle} ref={(el) => { this.mapContainer = el; }} />
            </div>
        );
    }
}
export default connect(mapStateToProps)(JugalMap);
