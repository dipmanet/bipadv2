/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import * as d3 from 'd3';
import { MapboxLayer } from '@deck.gl/mapbox';
import mapboxgl from 'mapbox-gl';
import { Spring } from 'react-spring/renderprops';
import { connect } from 'react-redux';
import { DataFilterExtension } from '@deck.gl/extensions';
import DelayedPointLayer from '../Components/DelayedPointLayer';
import Locations from '../Data/locations';
import MapLayers from '../Data/mapLayers';
import {
    wardsSelector,
} from '#selectors';

import styles from './styles.scss';

mapboxgl.workerClass = require('mapbox-gl/dist/mapbox-gl-csp-worker').default;

const mapStateToProps = (state, props) => ({
    // provinces: provincesSelector(state),
    wards: wardsSelector(state),
});

const delayProp = window.location.search === '?target' ? 'target' : 'longitude';


const Deck = (props) => {
    const [glContext, setGLContext] = useState();
    const deckRef = useRef(null);
    const mapRef = useRef(null);
    const [radiusChange, setRadiusChange] = useState(false);
    const [allDataVisible, setAllDataVisible] = useState(true);
    const [mapanimationDuration, setMapAnimateDuration] = useState(30000);
    const [reAnimate, setReAnimate] = useState(false);
    const [delay, setMapDelay] = useState(2000);
    const [filter, setFilter] = useState(null);

    // eslint-disable-next-line no-shadow
    const {
        viewState,
        onViewStateChange,
        libraries,
        currentPage,
        handleFlyTo,
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
        '&layers=Bipad:Bhotekoshi_Hillshade',
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
    const data = props.bahrabiseLandSlide.map(row => ({
        timestamp: row.date,
        latitude: Number(row.position[1]),
        longitude: Number(row.position[0]),
        // depth: Number(row.Depth),
        // magnitude: Number(row.Magnitude)
    }));

    const dataFilter = new DataFilterExtension({
        filterSize: 1,
        // Enable for higher precision, e.g. 1 second granularity
        // See DataFilterExtension documentation for how to pick precision
        fp64: false,
    });
    const getTimeRange = (datas) => {
        if (!datas) {
            return null;
        }
        return datas.reduce(
            (range, d) => {
                const t = d.timestamp;
                // eslint-disable-next-line no-param-reassign
                range[0] = Math.min(range[0], t);
                // eslint-disable-next-line no-param-reassign
                range[1] = Math.max(range[1], t);
                return range;
            },
            [Infinity, -Infinity],
        );
    };
    const timeRange = useMemo(() => getTimeRange(data), [data]);
    const filterValue = filter || timeRange;


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
        );
        map.addLayer(
            new MapboxLayer({ id: 'landslide-barabise', deck }),
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


        if (currentPage === 8) {
            map.setLayoutProperty('suseptibility-bahrabise', 'visibility', 'visible');
            map.moveLayer('suseptibility-bahrabise');
        }

        MapLayers.landuse.map((layer) => {
            map.setLayoutProperty(layer, 'visibility', 'none');

            return null;
        });

        if (currentPage === 3) {
            MapLayers.landuse.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
        }

        if (currentPage === 0) {
            MapLayers.landslide.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });

            // map.setLayoutProperty('ward-fill-local', 'visibility', 'visible');
        }
        const { getIdle } = props;
        map.on('idle', (e) => {
            getIdle(true);
        });


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
            MapLayers.landslide.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
        } else if (currentPage === 1) {
            const map = mapRef.current.getMap();
            setReAnimate(true);
            MapLayers.landslide.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
        } else if (currentPage === 2) {
            const map = mapRef.current.getMap();
            setReAnimate(true);
            handleFlyTo(Locations.bahrabise);
            // map.panBy([0, 200]);
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

            // MapLayers.suseptibility.map((layer) => {
            //     map.setLayoutProperty(layer, 'visibility', 'none');
            //     return null;
            // });
            // MapLayers.criticalinfra.map((layer) => {
            //     map.setLayoutProperty(layer, 'visibility', 'visible');
            //     return null;
            // });
        } else if (currentPage === 8) {
            const map = mapRef.current.getMap();
            setReAnimate(true);

            MapLayers.criticalinfra.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });

            MapLayers.landsliderisk.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'none');
                return null;
            });
            map.setLayoutProperty('bahrabiseHillshadeLocal', 'visibility', 'none');
            MapLayers.suseptibility.map((layer) => {
                map.setLayoutProperty(layer, 'visibility', 'visible');
                return null;
            });
        } else if (currentPage === 9) {
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

    // useEffect(() => {
    //     if (!mapRef.current) {
    //         return;
    //     }

    // }, [ci]);
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
                            visible: allDataVisible && currentPage === 0,
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
                            radiusMinPixels: 8,
                            // pickable: true,
                            // visible: allDataVisible,
                            animationProgress: springProps.enterProgress,
                            visible: currentPage === 1,
                            // getDelayFactor: d => (delayProp === 'longitude'
                            //     ? longitudeDelayScale(d.date)
                            //     : targetDelayScale(d.distToTarget)),
                            // parameters: {
                            //     // prevent flicker from z-fighting
                            //     [GL.DEPTH_TEST]: false,

                            //     [GL.BLEND]: true,
                            //     [GL.BLEND_SRC_RGB]: GL.ONE,
                            //     [GL.BLEND_DST_RGB]: GL.ONE,
                            //     [GL.BLEND_EQUATION]: GL.FUNC_ADD,
                            // },
                        }),
                        new ScatterplotLayer({
                            id: 'landslide-barabise1',
                            data: props.bahrabiseLandSlide,
                            opacity: 1,
                            radiusScale: 300,
                            radiusMinPixels: 1,
                            wrapLongitude: true,
                            visible: currentPage === 6,
                            getPosition: d => d.position,
                            // getRadius: d => Math.pow(2, d.magnitude),
                            getRadius: 500,
                            // getFillColor: () => {
                            //     const r = Math.sqrt(Math.max(50, 0));
                            //     return [255 - r * 15, r * 5, r * 10];
                            // },
                            getFillColor: [208, 208, 96],
                            getFilterValue: d => d.timestamp,
                            filterRange: [filterValue[0], filterValue[1]],
                            filterSoftRange: [
                                filterValue[0] * 0.9 + filterValue[1] * 0.1,
                                filterValue[0] * 0.1 + filterValue[1] * 0.9,
                            ],
                            extensions: [dataFilter],
                            pickable: true,
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
                                                process.env.REACT_APP_VIZRISK_BHOTEKOSHI_LANDSLIDE
                                            }
                                            mapboxApiAccessToken={
                                                process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
                                            }
                                            onLoad={onMapLoad}
                                        />
                                    )}
                                </DeckGL>
                                {/* {timeRange && currentPage === 6
                                    ? (
                                        <RangeInput
                                            min={timeRange[0]}
                                            max={timeRange[1]}
                                            value={filterValue}
                                            animationSpeed={MS_PER_DAY * 30}
                                            formatLabel={formatLabel}
                                            onChange={setFilter}
                                        />
                                    )
                                    : ''} */}
                            </div>
                        </>
                    );
                }
            }
        </Spring>
    );
};

export default connect(mapStateToProps)(Deck);
