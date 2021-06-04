import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import MapboxLegendControl from '@watergis/mapbox-gl-legend';
import { mapSources } from '#constants';
import CIData from '../RightPaneContents/RightPane4/ci';
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
const {
    data: criticalinfrastructures,
} = CIData;

const categoriesCritical = [...new Set(criticalinfrastructures.features.map(
    item => item.properties.CI,
))];

const landCoverLayers = ['Scree', 'Scrub', 'Forest', 'Farmlands', 'Buildings', 'Roads', 'Glacier'];

const popDensityLayers = ['Population Density', 'WardBoundary', 'Wardnumber'];

class JugalMap extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            lat: 28.015490220644214,
            lng: 85.79108507481781,
            zoom: 10,
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
            categoriesCritical.map((layer) => {
                this.jugalMap.addSource(layer, {
                    type: 'geojson',
                    data: getGeoJSON(layer, criticalinfrastructures),
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
                        'icon-image': ['get', 'icon'],
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

                if (rightElement !== 3) {
                    this.jugalMap.setLayoutProperty(`unclustered-point-${layer}`, 'visibility', 'none');
                    this.jugalMap.setLayoutProperty(`clusters-${layer}`, 'visibility', 'none');
                    this.jugalMap.setLayoutProperty(`clusters-count-${layer}`, 'visibility', 'none');
                }

                return null;
            });

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
                this.jugalMap.addControl(new MapboxLegendControl({}, { reverseOrder: false }), 'bottom-right');
                this.jugalMap.setLayoutProperty('Buildings', 'visibility', 'visible');
                this.jugalMap.moveLayer('Buildings');
            }
            if (rightElement === 1) {
                popDensityLayers.map((l) => {
                    this.jugalMap.setLayoutProperty(l, 'visibility', 'visible');
                    return null;
                });
                this.jugalMap.setLayoutProperty('Jugal Mun Bondary', 'visibility', 'none');
                this.jugalMap.setLayoutProperty('Jugal Contour', 'visibility', 'none');
                this.jugalMap.setLayoutProperty('jugalHillshade', 'visibility', 'none');
            } else {
                this.jugalMap.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            }

            if (rightElement === 2) {
                this.jugalMap.addControl(new MapboxLegendControl({}, { reverseOrder: false }), 'bottom-right');
                landCoverLayers.map((l) => {
                    this.jugalMap.setLayoutProperty(l, 'visibility', 'none');
                    return null;
                });
            } else {
                landCoverLayers.map((l) => {
                    this.jugalMap.setLayoutProperty(l, 'visibility', 'visible');
                    return null;
                });
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

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
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
                    console.log('hoveredWardId,', hoveredWardId);
                    console.log('e.features[0]', e.features[0]);
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

            categoriesCritical.map(layer => this.jugalMap.on('mousemove', `unclustered-point-${layer}`, (e) => {
                if (e) {
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
            categoriesCritical.map(layer => this.jugalMap.on('mouseleave', `unclustered-point-${layer}`, () => {
                this.jugalMap.getCanvas().style.cursor = '';
                popup.remove();
            }));
        });
    }

    public componentWillUnmount() {
        this.jugalMap.remove();
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
