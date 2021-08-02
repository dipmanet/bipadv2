import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { isDefined } from '@togglecorp/fujs';
// eslint-disable-next-line import/no-unresolved
import * as geojson from 'geojson';
import { mapSources } from '#constants';
import demographicsData from '../Data/demographicsData';
import expressions from '../Data/expressions';
import * as PageTypes from '#store/atom/page/types';
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
    categoriesCritical: string[];
}

interface OwnProps{
    rightElement: number;
    showPopulation: string;
    criticalElement: string;
    CIData: CIData;
}

interface CIData{
    type: geojson.GeoJsonTypes;
    features: Feature[];
}

interface Feature {
    properties: Properties;
    geometry: geojson.Geometry;
}

interface Properties {
    CI: string;
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

type LngLat = any[];

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

let hoveredWardId: (string | null) = null;
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

            if (isDefined(CIData.features)) {
                const categoriesCritical: any = [...new Set(CIData.features.map(
                    item => item.properties.CI,
                ))];
                    // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ categoriesCritical });

                categoriesCritical.map((layer: string) => {
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
                    categoriesCritical.map((ci: string) => this.jugalMap.on('mousemove', `unclustered-point-${ci}`, (e: any) => {
                        if (e) {
                            const { lngLat } = e;
                            const coordinates: number[] = [lngLat.lng, lngLat.lat];
                            const ciName = e.features[0].properties.Name;
                            popup.setLngLat(coordinates).setHTML(
                                `<div style="padding: 5px;border-radius: 5px">
                                    <p>${ciName}</p>
                                </div>
                        `,
                            ).addTo(this.jugalMap);
                        }
                    }));
                    categoriesCritical.map((ci: string) => this.jugalMap.on('mouseleave', `unclustered-point-${ci}`, () => {
                        this.jugalMap.getCanvas().style.cursor = '';
                        popup.remove();
                    }));
                    if (rightElement !== 3) {
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
            if (rightElement === 0) {
                this.jugalMap.setLayoutProperty('Buildings', 'visibility', 'visible');
                this.jugalMap.moveLayer('Buildings');
                this.jugalMap.setLayoutProperty('Population Density', 'visibility', 'none');
            }
            if (rightElement === 1) {
                popDensityLayers.map((l) => {
                    this.jugalMap.setLayoutProperty(l, 'visibility', 'visible');
                    return null;
                });
                this.jugalMap.setLayoutProperty('National Park', 'visibility', 'visible');
                this.jugalMap.setLayoutProperty('National Park Text', 'visibility', 'visible');
                this.jugalMap.setPaintProperty('National Park', 'fill-color', 'rgb(247,229,184)');
                this.jugalMap.moveLayer('National Park');
                this.jugalMap.moveLayer('National Park Text');


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
                    const coordinates: LngLat = [lngLat.lng, lngLat.lat];
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

    public componentDidUpdate(prevProps: OwnProps) {
        const { showPopulation, criticalElement } = this.props;

        if (showPopulation !== prevProps.showPopulation) {
            if (showPopulation === 'popdensity') {
                this.jugalMap.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            } else {
                this.jugalMap.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
            }
        }
        if (criticalElement !== prevProps.criticalElement) {
            this.resetClusters();
            const { categoriesCritical } = this.state;

            const layer = criticalElement;
            if (layer === 'all') {
                categoriesCritical.map((item) => {
                    this.jugalMap.setLayoutProperty(`unclustered-point-${item}`, 'visibility', 'visible');
                    this.jugalMap.setLayoutProperty(`clusters-${item}`, 'visibility', 'visible');
                    this.jugalMap.setLayoutProperty(`clusters-count-${item}`, 'visibility', 'visible');
                    return null;
                });
                this.jugalMap.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'visible');
                this.jugalMap.setLayoutProperty(`clusters-${layer}`, 'visibility', 'visible');
                this.jugalMap.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'visible');
            }
        }
    }

    public componentWillUnmount() {
        this.jugalMap.remove();
    }

    public resetClusters = () => {
        const { categoriesCritical } = this.state;
        categoriesCritical.map((layer) => {
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
            width: 'calc(70%)',
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
