/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import GL from '@luma.gl/constants';
import { ScatterplotLayer } from '@deck.gl/layers';
import MapGL, { StaticMap, FlyToInterpolator } from 'react-map-gl';
import { easeBackInOut } from 'd3-ease';
import * as d3 from 'd3';
import { MapboxLayer } from '@deck.gl/mapbox';
import Anime from 'react-anime';
import { Spring } from 'react-spring/renderprops';
import DelayedPointLayer from '../Components/DelayedPointLayer';
import Locations from './locations';
import MapLayers from './mapLayers';

const delayProp = window.location.search === '?target' ? 'target' : 'longitude';


const Deck = (props) => {
    const [glContext, setGLContext] = useState();
    const deckRef = useRef(null);
    const mapRef = useRef(null);
    const [radiusChange, setRadiusChange] = useState(false);
    const [allDataVisible, setAllDataVisible] = useState(true);
    const [landSlidePointsVisible, setLandslideVisible] = useState(false);
    const [animationDuration, setAnimateDuration] = useState(10000);
    const [reAnimate, setReAnimate] = useState(false);
    const [delay, setDelay] = useState(4000);
    // eslint-disable-next-line no-shadow
    const {
        viewState,
        onViewStateChange,
        libraries,
        currentPage,
        handleFlyTo,
    } = props;

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
    const longitudeDelayScale = d3.scaleLinear()
        .domain(d3.extent(props.libraries, d => d.date))
        .range([1, 0]);
    const targetDelayScale = d3.scaleLinear()
        .domain(d3.extent(props.libraries, d => d.distToTarget))
        .range([0, 1]);

    const onMapLoad = useCallback(() => {
        const map = mapRef.current.getMap();
        const { deck } = deckRef.current;

        map.addLayer(
            new MapboxLayer({ id: 'landslide-scatterplot', deck }),
            // Optionally define id from Mapbox layer stack under which to add deck layer
            // 'water',
        );
        map.addSource('hillshadeBahrabiseLocal', {
            type: 'raster',
            tiles: [getHillshadeLayer()],
            tileSize: 256,
        });

        map.addLayer(
            {
                id: 'bahrabiseHillshadeLocal',
                type: 'raster',
                source: 'hillshadeBahrabise',
                layout: {},
                paint: {
                    'raster-opacity': 0.35,
                },
            }, 'bahrabiseFarmland',
        );
        MapLayers.landuse.map((layer) => {
            map.setLayoutProperty(layer, 'visibility', 'none');

            return null;
        });
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }
        if (currentPage === 2) {
            const map = mapRef.current.getMap();
            handleFlyTo(Locations.bahrabise);
            setRadiusChange(true);
            setAllDataVisible(false);

            setReAnimate(true);
            setAnimateDuration(3000);
            setDelay(1000);

            MapLayers.landuse.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
            map.setLayoutProperty('bahrabiseFill', 'visibility', 'visible');
            map.setLayoutProperty('bahrabiseWardOutline', 'visibility', 'visible');
            setLandslideVisible(true);
        } else if (currentPage === 1) {
            const map = mapRef.current.getMap();
            handleFlyTo(Locations.nepal);
            setAllDataVisible(true);
            map.setLayoutProperty('bahrabiseFill', 'visibility', 'none');
        } else if (currentPage === 3) {
            const map = mapRef.current.getMap();
            MapLayers.landuse.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
            setReAnimate(true);
            setAnimateDuration(1000);
            setLandslideVisible(false);
        } else if (currentPage === 4) {
            // const map = mapRef.current.getMap();
            // MapLayers.landuse.map((layer) => {
            //     map.setLayoutProperty(layer, 'visibility', 'visible');
            //     return null;
            // });
            setReAnimate(true);
            setAnimateDuration(1000);
            setLandslideVisible(false);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    return (
        <Spring
            from={{ enterProgress: 0 }}
            to={{ enterProgress: 1 }}
            delay={delay}
            config={{ duration: animationDuration }}
            reset={reAnimate}

        >
            {
                (springProps) => {
                    const librariesLayer1 = [new DelayedPointLayer({
                        id: 'landslide-scatterplot',
                        data: props.libraries,
                        getPosition: d => d.position,
                        getFillColor: [209, 203, 111],
                        getRadius: radiusChange ? 500 : 5000,
                        radiusMinPixels: 3,
                        visible: allDataVisible,
                        animationProgress: springProps.enterProgress,
                        getDelayFactor: d => (delayProp === 'longitude'
                            ? longitudeDelayScale(d.date)
                            : targetDelayScale(d.distToTarget)),
                        // parameters: {
                        //     // prevent flicker from z-fighting
                        //     // [GL.DEPTH_TEST]: false,

                        //     [GL.BLEND]: true,
                        //     [GL.BLEND_SRC_RGB]: GL.ONE,
                        //     [GL.BLEND_DST_RGB]: GL.ONE,
                        //     [GL.BLEND_EQUATION]: GL.FUNC_ADD,
                        // },
                    }),
                    new DelayedPointLayer({
                        id: 'landslide-scatterplot2',
                        data: props.bahrabiseLandSlide,
                        getPosition: d => d.position,
                        getFillColor: [209, 203, 111],
                        getRadius: 500,
                        radiusMinPixels: 3,
                        // visible: allDataVisible,
                        animationProgress: springProps.enterProgress,
                        visible: landSlidePointsVisible,
                        getDelayFactor: d => (delayProp === 'longitude'
                            ? longitudeDelayScale(d.date)
                            : targetDelayScale(d.distToTarget)),
                        // parameters: {
                        //     // prevent flicker from z-fighting
                        //     // [GL.DEPTH_TEST]: false,

                        //     [GL.BLEND]: true,
                        //     [GL.BLEND_SRC_RGB]: GL.ONE,
                        //     [GL.BLEND_DST_RGB]: GL.ONE,
                        //     [GL.BLEND_EQUATION]: GL.FUNC_ADD,
                        // },
                    }),
                    ];
                    return (
                        <>
                            <DeckGL
                                ref={deckRef}
                                layers={librariesLayer1}
                                initialViewState={Locations.nepal}
                                controller
                                onWebGLInitialized={setGLContext}
                                viewState={viewState}
                                onViewStateChange={onViewStateChange}
                                glOptions={{
                                    /* To render vector tile polygons correctly */
                                    stencil: true,
                                }}
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
                        </>
                    );
                }
            }
        </Spring>
    );
};

export default Deck;
