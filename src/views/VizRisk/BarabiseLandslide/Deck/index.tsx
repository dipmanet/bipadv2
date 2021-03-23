import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import MapGL, { StaticMap, FlyToInterpolator } from 'react-map-gl';
import { easeBackInOut } from 'd3-ease';
import * as d3 from 'd3';
import { MapboxLayer } from '@deck.gl/mapbox';
import Anime from 'react-anime';
import { Spring } from 'react-spring/renderprops';

import DelayedPointLayer from '../Components/DelayedPointLayer';
import Locations from './locations';


const delayProp = window.location.search === '?target' ? 'target' : 'longitude';
const librariesAnimation = { enterProgress: 0, duration: 2000 };


const Deck = (props) => {
    // DeckGL and mapbox will both draw into this WebGL context
    const [glContext, setGLContext] = useState();
    const deckRef = useRef(null);
    const mapRef = useRef(null);
    const [showLibraries, setshowLibraries] = useState(false);
    const [showData, setShowData] = useState(false);
    const [deckLayers, setLayers] = useState([]);
    const librariesMass = useMemo;
    // eslint-disable-next-line no-shadow
    const {
        librariesData,
        location,
        viewState,
        onViewStateChange,
        libraries,
    } = props;

    const [duration, setDuration] = useState(2000);

    const longitudeDelayScale = d3.scaleLinear()
        .domain(d3.extent(props.libraries, d => d.position[0]))
        .range([1, 0]);
    const targetDelayScale = d3.scaleLinear()
        .domain(d3.extent(props.libraries, d => d.distToTarget))
        .range([0, 1]);

    const onMapLoad = useCallback(() => {
        const map = mapRef.current.getMap();
        const { deck } = deckRef.current;

        // You must initialize an empty deck.gl layer to prevent flashing
        map.addLayer(
            // This id has to match the id of the deck.gl layer
            new MapboxLayer({ id: 'my-scatterplot', deck }),
            // Optionally define id from Mapbox layer stack under which to add deck layer
            // 'water',
        );
    }, []);

    return (
        <Spring
            from={{ enterProgress: 0 }}
            to={{ enterProgress: 1 }}
            delay={4000}
            config={{ duration: 5000 }}
        >
            {
                (springProps) => {
                    const librariesLayer1 = new DelayedPointLayer({
                        id: 'my-scatterplot',
                        data: props.libraries,
                        getPosition: d => d.position,
                        getFillColor: [250, 100, 200],
                        getRadius: 5000,
                        radiusMinPixels: 3,

                        animationProgress: springProps.enterProgress,

                        getDelayFactor: d => (delayProp === 'longitude'
                            ? longitudeDelayScale(d.position[0])
                            : targetDelayScale(d.distToTarget)),
                        // parameters: {
                        //     // prevent flicker from z-fighting
                        //     [GL.DEPTH_TEST]: false,

                    //     [GL.BLEND]: true,
                    //     [GL.BLEND_SRC_RGB]: GL.ONE,
                    //     [GL.BLEND_DST_RGB]: GL.ONE,
                    //     [GL.BLEND_EQUATION]: GL.FUNC_ADD,
                    // },
                    });
                    return (
                        <>
                            <DeckGL
                                ref={deckRef}
                                layers={librariesLayer1}
                                initialViewState={Locations.nepal}
                                controller
                                onWebGLInitialized={setGLContext}
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
