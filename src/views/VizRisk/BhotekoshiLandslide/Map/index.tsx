/* eslint-disable max-len */
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { mapSources } from '#constants';
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
import LanduseLayers from '../Data/mapLayers';
import {
    getWardFilter,
} from '#utils/domain';
import Demographics from '../Data/demographicsData';

const { landuse } = LanduseLayers;

const { demographicsData } = Demographics;
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
    1, 'rgb(255,143,13)', 2, 'rgb(255, 94, 0)',
    3, 'rgb(255,207,142)', 4, 'rgb(255,143,13)',
    5, 'rgb(255,143,13)',
];

class FloodHistoryMap extends React.Component {
    public constructor(props) {
        super(props);

        this.state = {
            lng: 85.93622448197604,
            lat: 27.918085332007227,
            zoom: 10.6,
            wardNumber: 'Hover to see ward number',
            categoriesCritical: [],
            resourceArr: [],

        };
    }

    public componentDidMount() {
        const {
            lng, lat, zoom, resourceArr,
        } = this.state;
        const {
            wards,
            selectedProvinceId: provinceId,
            selectedDistrictId: districtId,
            selectedMunicipalityId: municipalityId,
            incidentList,
            ci,
            currentPage,
        } = this.props;


        const mapping = wards.filter(item => item.municipality === 23003).map(item => ({
            ...item,
            value: Number(item.title),
        }));

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: process.env.REACT_APP_VIZRISK_BHOTEKOSHI_LANDSLIDE,
            center: [lng, lat],
            zoom,
            minZoom: 2,
            maxZoom: 22,
        });


        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');


        this.map.on('style.load', () => {
            this.map.addSource('hillshadeBahrabiseLocal', {
                type: 'raster',
                tiles: [this.getHillshadeLayer()],
                tileSize: 256,
            });

            this.map.addLayer(
                {
                    id: 'bahrabiseHillshadeLocal',
                    type: 'raster',
                    source: 'hillshadeBahrabiseLocal',
                    layout: {
                        visibility: 'none',
                    },
                    paint: {
                        'raster-opacity': 0.25,
                    },
                },
            );
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup',
            });


            if (ci.length > 0) {
                // const this.map = this.mapRef.current.getthis.Map();
                const features = ci.map(f => ({
                    properties: {
                        resourceType: f.resourceType,
                        title: f.title,
                        id: f.id,
                    },
                    geometry: f.point,
                }));
                const geoArr = {
                    type: 'FeatureCollection',
                    features,
                };
                const resourceAr = [...new Set(ci.map(c => c.resourceType))];
                this.setState({ resourceArr: resourceAr });
                resourceAr.map((layer) => {
                    this.map.addSource(`${layer}`, {
                        type: 'geojson',
                        data: this.getGeoJSON(layer, geoArr),
                        cluster: true,
                        clusterRadius: 50,
                    });
                    this.map.addLayer({
                        id: `clusters-ci-${layer}`,
                        type: 'circle',
                        source: `${layer}`,
                        filter: ['has', 'point_count'],
                        paint: {
                            'circle-color': [
                                'step',
                                ['get', 'point_count'],
                                '#a4ac5e',
                                // '#3b5bc2',
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
                        layout: {
                            visibility: 'none',
                        },
                    });

                    this.map.addLayer({
                        id: `unclustered-ci-${layer}`,
                        type: 'symbol',
                        source: `${layer}`,
                        filter: ['!', ['has', 'point_count']],
                        layout: {
                            'icon-image': ['get', 'resourceType'],
                            'icon-size': 0.3,
                            'icon-anchor': 'bottom',
                            visibility: 'none',
                        },
                    });
                    this.map.addLayer({
                        id: `clusters-count-ci-${layer}`,
                        type: 'symbol',
                        source: `${layer}`,
                        layout: {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12,
                            visibility: 'none',
                        },
                    });

                    this.map.on('mousemove', `unclustered-ci-${layer}`, (e) => {
                        if (e) {
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
                    });
                    this.map.on('mouseleave', `unclustered-ci-${layer}`, () => {
                        this.map.getCanvas().style.cursor = '';
                        popup.remove();
                    });
                    return null;
                });
            }
            this.map.addSource('vizrisk-fills', {
                type: 'vector',
                url: mapSources.nepal.url,
            });

            this.map.addLayer({
                id: 'ward-fill-local',
                source: 'vizrisk-fills',
                'source-layer': mapSources.nepal.layers.ward,
                type: 'fill',
                layout: {
                    visibility: 'none',
                },
                paint: {
                    'fill-color': populationWardExpression,
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0,
                        1,
                    ],
                },
                filter: getWardFilter(3, 24, 23003, wards),
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
            this.map.setLayoutProperty('bahrabisePopDensity', 'visibility', 'none');
            this.map.moveLayer('bahrabiseWardOutline');
            this.map.moveLayer('bahrabiseWardText');

            this.map.on('mousemove', 'ward-fill-local', (e) => {
                if (e.features.length > 0) {
                    this.map.getCanvas().style.cursor = 'pointer';

                    const { lngLat } = e;
                    const coordinates = [lngLat.lng, lngLat.lat];
                    const wardno = e.features[0].properties.title;
                    const details = demographicsData.filter(item => item.name === `Ward ${wardno}`);
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

            if (currentPage === 4) {
                landuse.map((l) => {
                    this.map.setLayoutProperty(l, 'visibility', 'none');
                    return null;
                });
                this.map.setLayoutProperty('bahrabiseHillshadeLocal', 'visibility', 'none');
                this.map.setLayoutProperty('bahrabisePopDensity', 'visibility', 'visible');
                this.map.setLayoutProperty('bahrabiseWardText', 'visibility', 'visible');
                this.map.setLayoutProperty('bahrabiseWardOutline', 'visibility', 'visible');
                this.map.moveLayer('bahrabiseWardOutline');
                this.map.moveLayer('bahrabiseWardText');
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
                resourceArr.map((layer) => {
                    this.map.setLayoutProperty(`clusters-ci-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`clusters-count-ci-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`unclustered-ci-${layer}`, 'visibility', 'none');
                    return null;
                });
            }


            if (currentPage === 5) {
                this.map.setLayoutProperty('bahrabiseHillshadeLocal', 'visibility', 'visible');
                this.state.resourceArr.map((layer) => {
                    this.map.setLayoutProperty(`clusters-ci-${layer}`, 'visibility', 'visible');
                    this.map.moveLayer(`clusters-ci-${layer}`);
                    this.map.setLayoutProperty(`clusters-count-ci-${layer}`, 'visibility', 'visible');
                    this.map.moveLayer(`clusters-count-ci-${layer}`);
                    this.map.setLayoutProperty(`unclustered-ci-${layer}`, 'visibility', 'visible');
                    this.map.moveLayer(`unclustered-ci-${layer}`);
                    return null;
                });
                landuse.map((l) => {
                    this.map.setLayoutProperty(l, 'visibility', 'visible');
                    return null;
                });
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
                this.map.setLayoutProperty('bahrabisePopDensity', 'visibility', 'none');

                this.map.setLayoutProperty('bahrabisePopDensity', 'visibility', 'none');
                this.map.setLayoutProperty('bahrabiseFill', 'visibility', 'visible');
            }
        });
    }

    public componentDidUpdate(prevProps) {
        const { population, currentPage } = this.props;
        const { resourceArr } = this.state;
        console.log('currentPage', currentPage);
        if (population !== prevProps.population) {
            if (population === 'ward') {
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
            }
            if (population === 'popdensity') {
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
            }
        }
        if (currentPage !== prevProps.currentPage) {
            if (currentPage === 5) {
                this.map.setLayoutProperty('bahrabiseHillshadeLocal', 'visibility', 'visible');
                resourceArr.map((layer) => {
                    this.map.setLayoutProperty(`clusters-ci-${layer}`, 'visibility', 'visible');
                    this.map.moveLayer(`clusters-ci-${layer}`);
                    this.map.setLayoutProperty(`clusters-count-ci-${layer}`, 'visibility', 'visible');
                    this.map.moveLayer(`clusters-count-ci-${layer}`);
                    this.map.setLayoutProperty(`unclustered-ci-${layer}`, 'visibility', 'visible');
                    this.map.moveLayer(`unclustered-ci-${layer}`);
                    return null;
                });
                landuse.map((l) => {
                    this.map.setLayoutProperty(l, 'visibility', 'visible');
                    return null;
                });
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'none');
                this.map.setLayoutProperty('bahrabisePopDensity', 'visibility', 'none');

                this.map.setLayoutProperty('bahrabisePopDensity', 'visibility', 'none');
                this.map.setLayoutProperty('bahrabiseFill', 'visibility', 'visible');
            }
            if (currentPage === 4) {
                landuse.map((l) => {
                    this.map.setLayoutProperty(l, 'visibility', 'none');
                    return null;
                });
                this.map.setLayoutProperty('bahrabiseHillshadeLocal', 'visibility', 'none');
                this.map.setLayoutProperty('bahrabisePopDensity', 'visibility', 'visible');
                this.map.setLayoutProperty('bahrabiseWardText', 'visibility', 'visible');
                this.map.setLayoutProperty('bahrabiseWardOutline', 'visibility', 'visible');
                this.map.moveLayer('bahrabiseWardOutline');
                this.map.moveLayer('bahrabiseWardText');
                this.map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
                resourceArr.map((layer) => {
                    this.map.setLayoutProperty(`clusters-ci-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`clusters-count-ci-${layer}`, 'visibility', 'none');
                    this.map.setLayoutProperty(`unclustered-ci-${layer}`, 'visibility', 'none');
                    return null;
                });
            }
        }
        if (this.props.criticalElement !== prevProps.criticalElement) {
            this.resetClusters();
            const layer = this.props.criticalElement;
            if (layer === 'all') {
                resourceArr.map((item) => {
                    this.map.setLayoutProperty(`unclustered-ci-${item}`, 'visibility', 'visible');
                    this.map.setLayoutProperty(`clusters-ci-${item}`, 'visibility', 'visible');
                    this.map.setLayoutProperty(`clusters-count-ci-${item}`, 'visibility', 'visible');
                    return null;
                });
            } else if (layer === 'helipad') {
                this.map.setLayoutProperty('clusters-ci-helipad', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-helipad', 'visibility', 'visible');
                this.map.setLayoutProperty('unclustered-ci-helipad', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-helipad');
            } else if (layer === 'health') {
                this.map.setLayoutProperty('clusters-ci-health', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-health', 'visibility', 'visible');
                this.map.setLayoutProperty('unclustered-ci-health', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-health');
            } else if (layer === 'finance') {
                this.map.setLayoutProperty('unclustered-ci-finance', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-finance', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-ci-finance', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-finance');
            } else if (layer === 'Governance') {
                this.map.setLayoutProperty('unclustered-ci-Governance', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-Governance', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-ci-Governance', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-Governance');
            } else if (layer === 'Industry') {
                this.map.setLayoutProperty('unclustered-ci-Industry', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-Industry', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-ci-Industry', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-Industry');
            } else if (layer === 'education') {
                this.map.setLayoutProperty('unclustered-ci-education', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-education', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-ci-education', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-education');
            } else if (layer === 'Culture') {
                this.map.setLayoutProperty('unclustered-ci-Cultural', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-Cultural', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-ci-Cultural', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-Cultural');
            } else if (layer === 'Tourism') {
                this.map.setLayoutProperty('unclustered-ci-Tourism', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-Tourism', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-ci-Tourism', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-Tourism');
            } else if (layer === 'Water sources') {
                this.map.setLayoutProperty('unclustered-ci-Water sources', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-Water sources', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-ci-Water sources', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-Water sources');
            } else if (layer === 'Trade and business') {
                this.map.setLayoutProperty('unclustered-ci-Trade and business', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-count-ci-Trade and business', 'visibility', 'visible');
                this.map.setLayoutProperty('clusters-ci-Trade and business', 'visibility', 'visible');
                this.map.moveLayer('clusters-count-ci-Trade and business');
            }
        }
    }

    public componentWillUnmount() {
        this.map.remove();
    }

    public resetClusters = () => {
        this.state.resourceArr.map((layer) => {
            this.map.setLayoutProperty(`unclustered-ci-${layer}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-ci-${layer}`, 'visibility', 'none');
            this.map.setLayoutProperty(`clusters-count-ci-${layer}`, 'visibility', 'none');

            return null;
        });
    }

    public getGeoJSON = (filterBy: string, data: any) => {
        const geoObj = {};
        geoObj.type = 'FeatureCollection';
        geoObj.name = filterBy;
        geoObj.features = [];
        const d = data.features.filter(item => item.properties.resourceType === filterBy);
        geoObj.features.push(...d);
        return geoObj;
    }

    public getHillshadeLayer = () => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        '&layers=Bipad:Bhotekoshi_Hillshade',
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('');

    public render() {
        const mapStyle = {
            position: 'absolute',
            width: '70%',
            left: 'calc(30% - 60px)',
            top: 0,
            // bottom: 0,
            height: '100vh',
            zIndex: 200,
        };

        return (
            <div>
                <div style={mapStyle} ref={(el) => { this.mapContainer = el; }} />
            </div>
        );
    }
}
export default connect(mapStateToProps)(FloodHistoryMap);
