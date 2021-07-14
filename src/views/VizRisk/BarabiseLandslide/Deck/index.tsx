/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import mapboxgl from 'mapbox-gl';
import { PolygonLayer } from '@deck.gl/layers';
import MapGL, { StaticMap, FlyToInterpolator } from 'react-map-gl';
import { easeBackInOut } from 'd3-ease';
import * as d3 from 'd3';
import { MapboxLayer } from '@deck.gl/mapbox';
import Anime from 'react-anime';
import { Spring } from 'react-spring/renderprops';
import GL from '@luma.gl/constants';
import { connect } from 'react-redux';
import { scaleThreshold } from 'd3-scale';
import DelayedPointLayer from '../Components/DelayedPointLayer';
import Locations from '../Data/locations';
import MapLayers from '../Data/mapLayers';
import criticalinfrastructures from '../Data/criticalInfraGeoJSON';
import wardfill from '../Data/wardFill';
import { mapSources } from '#constants';
import {
    wardsSelector,
} from '#selectors';
import {
    getWardFilter,
} from '#utils/domain';
import styles from './styles.scss';

const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
    wards: wardsSelector(state),
});

const delayProp = window.location.search === '?target' ? 'target' : 'longitude';
const populationWardExpression = [
    'interpolate',
    ['linear'],
    ['feature-state', 'value'],
    1, '#fe9b2a', 2, '#fe9b2a',
    3, '#fe9b2a', 4, '#9a3404',
    5, '#d95f0e', 6, '#fe9b2a',
    7, '#ffffd6', 8, '#fe9b2a',
    9, '#fed990',
];

const Deck = (props) => {
    const [glContext, setGLContext] = useState();
    const deckRef = useRef(null);
    const mapRef = useRef(null);
    const [radiusChange, setRadiusChange] = useState(false);
    const [allDataVisible, setAllDataVisible] = useState(true);
    const [landSlidePointsVisible, setLandslideVisible] = useState(true);
    const [mapanimationDuration, setMapAnimateDuration] = useState(30000);
    const [reAnimate, setReAnimate] = useState(false);
    const [delay, setMapDelay] = useState(4000);
    // eslint-disable-next-line no-shadow
    const {
        viewState,
        onViewStateChange,
        libraries,
        currentPage,
        handleFlyTo,
        wards,
    } = props;
    const getToolTip = ({ object }) => (
        object && currentPage === 5 && {
            html: `\
          <div><b>Ward ${object.title}</b></div>
          <div>Family Count: ${object.familycount}</div>
          <div>Total Population: ${object.femalepopulation + object.malepopulation}</div>
          `,
        }
    );
    const getHillshadeLayer = () => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.1',
        '&service=WMS',
        '&request=GetMap',
        '&layers=Bipad:Barhabise_hillshade',
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('');

    const getSusceptibilityLayer = () => [
        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
        '&version=1.1.0',
        '&service=WMS',
        '&request=GetMap',
        '&layers=Bipad:Barhabise_Durham_Susceptibility',
        '&tiled=true',
        '&width=256',
        '&height=256',
        '&srs=EPSG:3857',
        '&bbox={bbox-epsg-3857}',
        '&transparent=true',
        '&format=image/png',
    ].join('');


    const longitudeDelayScale = d3.scaleLinear()
        .domain(d3.extent(libraries, d => d.date))
        .range([1, 0]);
    const targetDelayScale = d3.scaleLinear()
        .domain(d3.extent(libraries, d => d.distToTarget))
        .range([0, 1]);

    const onMapLoad = useCallback(() => {
        const map = mapRef.current.getMap();
        const { deck } = deckRef.current;
        map.addLayer(
            new MapboxLayer({ id: 'landslide-scatterplot', deck }),
            // Optionally define id from Mapbox layer stack under which to add deck layer
            // 'water',
        );
        map.addLayer(
            new MapboxLayer({ id: 'landslide-barabise', deck }),
            // Optionally define id from Mapbox layer stack under which to add deck layer
            // 'water',
        );
        // map.addLayer(
        //     new MapboxLayer({ id: 'population-polygons', deck }),
        //     // Optionally define id from Mapbox layer stack under which to add deck layer
        //     // 'water',
        // );
        map.addSource('hillshadeBahrabiseLocal', {
            type: 'raster',
            tiles: [getHillshadeLayer()],
            tileSize: 256,
        });

        map.addLayer(
            {
                id: 'bahrabiseHillshadeLocal',
                type: 'raster',
                source: 'hillshadeBahrabiseLocal',
                layout: {},
                paint: {
                    'raster-opacity': 0.25,
                },
            },
        );

        map.addSource('suseptibilityBahrabise', {
            type: 'raster',
            tiles: [getSusceptibilityLayer()],
            tileSize: 256,
        });

        map.addLayer(
            {
                id: 'suseptibility-bahrabise',
                type: 'raster',
                source: 'suseptibilityBahrabise',
                paint: {
                    'raster-opacity': 1,
                },
                layout: {
                    visibility: 'none',
                },
            },
        );
        // const criticalinfrastructuresdata = getGeoJSON(criticalinfrastructures.criticalData);
        // const categoriesCritical = [...new Set(criticalinfrastructuresdata.features.map(
        //     item => item.properties.resourceType,
        // ))];
        // categoriesCritical.map((layer) => {
        map.addSource('cilayer', {
            type: 'geojson',
            data: criticalinfrastructures.criticalData,
            cluster: true,
            clusterRadius: 50,
        });
        map.addLayer({
            id: 'clusters-ci',
            type: 'circle',
            source: 'cilayer',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    // '#a4ac5e',
                    '#3b5bc2',
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

        map.addLayer({
            id: 'unclustered-point-ci',
            type: 'symbol',
            source: 'cilayer',
            filter: ['!', ['has', 'point_count']],
            layout: {
                'icon-image': ['get', 'icon'],
                'icon-size': 0.3,
                visibility: 'none',
            },
        });

        map.addLayer({
            id: 'clusters-count-ci',
            type: 'symbol',
            source: 'cilayer',
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
                visibility: 'none',
            },
        });

        //     return null;
        // });
        MapLayers.landuse.map((layer) => {
            map.setLayoutProperty(layer, 'visibility', 'none');

            return null;
        });
        map.moveLayer('landslide-barabise');

        // map.setPaintProperty('bahrabiseFill', 'fill-color', 'rgb(108,171,7)');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }
        if (currentPage === 0) {
            const map = mapRef.current.getMap();
            handleFlyTo(Locations.nepal);
            setAllDataVisible(true);
            setRadiusChange(false);
            props.setNarrationDelay(2000);
            setLandslideVisible(false);
            MapLayers.landslide.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
        } else if (currentPage === 1) {
            const map = mapRef.current.getMap();

            props.setNarrationDelay(1000);
            setMapDelay(1000);
            setReAnimate(true);
            setMapAnimateDuration(1000);

            handleFlyTo(Locations.bahrabise);
            setRadiusChange(true);
            setAllDataVisible(false);
            setLandslideVisible(true);

            MapLayers.landuse.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });

            MapLayers.landslide.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
        } else if (currentPage === 2) {
            const map = mapRef.current.getMap();
            setReAnimate(true);
            MapLayers.landuse.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
            MapLayers.landslide.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
        } else if (currentPage === 3) {
            const map = mapRef.current.getMap();

            setReAnimate(true);

            MapLayers.landslide.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
            MapLayers.landuse.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
        } else if (currentPage === 4) {
            const map = mapRef.current.getMap();
            // setReAnimate(true);
            MapLayers.landuse.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });

            map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
        } else if (currentPage === 5) {
            const map = mapRef.current.getMap();
            setReAnimate(true);

            MapLayers.suseptibility.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
            MapLayers.criticalinfra.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
        } else if (currentPage === 6) {
            const map = mapRef.current.getMap();
            setReAnimate(true);

            MapLayers.criticalinfra.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
            MapLayers.suseptibility.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
            MapLayers.landsliderisk.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
        } else if (currentPage === 7) {
            const map = mapRef.current.getMap();
            setReAnimate(true);

            MapLayers.suseptibility.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
            MapLayers.landsliderisk.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    return (
        <Spring
            from={{ enterProgress: 0 }}
            to={{ enterProgress: 1 }}
            delay={delay}
            config={{ duration: mapanimationDuration }}
            reset={reAnimate}

        >
            {
                (springProps) => {
                    const librariesLayer1 = [
                        new DelayedPointLayer({
                            id: 'landslide-scatterplot',
                            data: props.libraries,
                            getPosition: d => d.position,
                            getFillColor: [209, 203, 111],
                            getRadius: radiusChange ? 500 : 5000,
                            radiusMinPixels: 3,
                            visible: allDataVisible,
                            animationProgress: springProps.enterProgress,
                            pointDuration: 0.25,
                            getDelayFactor: d => (delayProp === 'longitude'
                                ? longitudeDelayScale(d.date)
                                : targetDelayScale(d.distToTarget)),
                            // parameters: {
                            // // prevent flicker from z-fighting
                            //     [GL.DEPTH_TEST]: true,

                            //     [GL.BLEND]: true,
                            //     [GL.BLEND_COLOR]: [255, 0, 0, 0],
                            //     [GL.BLEND_SRC_RGB]: GL.ONE,
                            //     [GL.BLEND_DST_RGB]: GL.ONE,
                            //     [GL.BLEND_EQUATION]: GL.FUNC_ADD,
                            // },
                        }),
                        new DelayedPointLayer({
                            id: 'landslide-barabise',
                            data: props.bahrabiseLandSlide,
                            getPosition: d => d.position,
                            getFillColor: [209, 203, 111],
                            getRadius: 500,
                            radiusMinPixels: 3,
                            pickable: true,
                            // visible: allDataVisible,
                            animationProgress: springProps.enterProgress,
                            visible: currentPage === 1,
                            getDelayFactor: d => (delayProp === 'longitude'
                                ? longitudeDelayScale(d.date)
                                : targetDelayScale(d.distToTarget)),
                            parameters: {
                                // prevent flicker from z-fighting
                                // [GL.DEPTH_TEST]: false,

                                [GL.BLEND]: true,
                                [GL.BLEND_SRC_RGB]: GL.ONE,
                                [GL.BLEND_DST_RGB]: GL.ONE,
                                [GL.BLEND_EQUATION]: GL.FUNC_ADD,
                            },
                        }),
                        // new PolygonLayer({
                        //     id: 'population-polygons',
                        //     data: wardfill.wards,
                        //     pickable: true,
                        //     stroked: true,
                        //     filled: true,
                        //     wireframe: true,
                        //     extruded: true,
                        //     lineWidthMinPixels: 1,
                        //     visible: currentPage === 4,
                        //     getPolygon: d => d.coordinates,
                        //     getElevation: d => (d.femalepopulation + d.malepopulation) / 5,
                        //     getFillColor: d => d.color,
                        //     getLineColor: [80, 80, 80],
                        //     getLineWidth: 1,
                        // }),
                    ];
                    return (
                        <>
                            <div className={styles.container}>
                                <DeckGL
                                    ref={deckRef}
                                    layers={librariesLayer1}
                                    initialViewState={Locations.nepal}
                                    controller
                                    onWebGLInitialized={setGLContext}
                                    viewState={viewState}
                                    onViewStateChange={onViewStateChange}
                                    getTooltip={getToolTip}
                                    glOptions={{
                                    /* To render vector tile polygons correctly */
                                        stencil: true,
                                    }}
                                    width={'70%'}
                                    height={'100vh'}
                                >
                                    {glContext && (
                                        <StaticMap
                                            ref={mapRef}
                                            gl={glContext}
                                            mapStyle={
                                                process.env.REACT_APP_VIZRISK_BAHRABISE_LANDSLIDE
                                            }
                                            mapboxApiAccessToken={
                                                process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
                                            }
                                            onLoad={onMapLoad}
                                        />
                                    )}
                                </DeckGL>
                            </div>
                        </>
                    );
                }
            }
        </Spring>
    );
};

export default connect(mapStateToProps)(Deck);
