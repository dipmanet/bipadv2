import React, { useState, useRef, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { produce } from "immer";
import "mapbox-gl/dist/mapbox-gl.css";

import { getLayerName } from "./utils";
import { Layer, Sources, Source } from "./type";
import { MapChildContext } from "./context";

const UNSUPPORTED_BROWSER = !mapboxgl.supported();
const { VITE_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = import.meta.env;
if (TOKEN) {
	mapboxgl.accessToken = TOKEN;
}

type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface LastIn {
	id: string | number | undefined;
	layerName: string;
	sourceName: string;
	sourceLayer: string | undefined;
}

interface ExtendedLayer extends Layer {
	layerKey: string;
	sourceKey: string;
}

function findLayerFromLayers(layers: ExtendedLayer[], layerKey: string) {
	const layer = layers.find((l) => l.layerKey === layerKey);
	return layer;
}

function getLayersForSources(sources: Sources) {
	const layers = Object.entries(sources)
		.filter(([_, source]) => !!source.layers)
		.map(([sourceKey, source]) =>
			Object.entries(source.layers).map(([layerKey, layer]) => ({
				...layer,
				sourceKey,
				layerKey: getLayerName(sourceKey, layerKey),
			}))
		)
		.flat();
	return layers;
}

function noop() {}

interface Props {
	mapStyle: mapboxgl.MapboxOptions["style"];
	mapOptions: Omit<mapboxgl.MapboxOptions, "style" | "container">;

	scaleControlShown: boolean;
	scaleControlPosition?: Position;
	scaleControlOptions?: ConstructorParameters<typeof mapboxgl.ScaleControl>[0];

	navControlShown: boolean;
	navControlPosition?: Position;
	navControlOptions?: ConstructorParameters<typeof mapboxgl.NavigationControl>[0];

	debug?: boolean;
}

const Map: React.FC<Props> = (props) => {
	const {
		mapStyle: mapStyleFromProps,
		mapOptions,

		scaleControlPosition,
		scaleControlShown,
		scaleControlOptions,

		navControlShown,
		navControlOptions,
		navControlPosition,

		children,
		clickHandler,
		debug,
		handleMapClicked,
	} = props;

	const [initialDebug] = useState(debug);

	const [mapStyle, setMapStyle] = useState<mapboxgl.MapboxOptions["style"]>(undefined);
	const [loaded, setLoaded] = useState<boolean>(false);

	const boundsRef = useRef<[number, number, number, number] | undefined>();
	const paddingRef = useRef<number | undefined>();
	const durationRef = useRef<number | undefined>();

	const lastIn = useRef<LastIn | undefined>(undefined);
	const mapDestroyedRef = useRef(false);
	const sourcesRef = useRef<Sources>({});
	const mapRef = useRef<mapboxgl.Map | undefined>(undefined);
	const mapContainerRef = useRef<HTMLDivElement>(null);

	const setBounds = useCallback(
		(
			bounds: [number, number, number, number] | undefined,
			padding: number | undefined,
			duration: number | undefined
		) => {
			boundsRef.current = bounds;
			paddingRef.current = padding;
			durationRef.current = duration;
		},
		[]
	);

	// Create map
	useEffect(
		() => {
			if (UNSUPPORTED_BROWSER) {
				console.error("No Mapboxgl support.");
				return noop;
			}
			const { current: mapContainer } = mapContainerRef;
			if (!mapContainer) {
				console.error("No container found.");
				return noop;
			}

			const mapboxglMap = new mapboxgl.Map({
				container: mapContainer,
				style: mapStyleFromProps,
				preserveDrawingBuffer: true,
				...mapOptions,
			});

			mapRef.current = mapboxglMap;
			// FIXME: we shouldn't always set cursor to pointer
			// mapboxglMap.getCanvas().style.cursor = 'pointer';

			if (scaleControlShown) {
				const scale = new mapboxgl.ScaleControl(scaleControlOptions);
				mapboxglMap.addControl(scale, scaleControlPosition);
			}

			if (navControlShown) {
				// NOTE: don't we need to remove control on unmount?
				const nav = new mapboxgl.NavigationControl(navControlOptions);
				mapboxglMap.addControl(nav, navControlPosition);
			}

			/*
            // TODO: need to resize map in some cases
            const timer = setTimeout(() => {
                mapboxglMap.resize();
            }, 200);
            */

			const handleClick = (data: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
				if (!mapRef.current) {
					return;
				}

				if (clickHandler) {
					clickHandler(data);
					handleMapClicked(data);
				}
				const layers = getLayersForSources(sourcesRef.current);

				const { point, lngLat } = data;

				const clickableLayerKeys = layers
					.filter((layer) => !!layer.onClick)
					.map((layer) => layer.layerKey);

				const clickableFeatures = mapRef.current.queryRenderedFeatures(point, {
					layers: clickableLayerKeys,
				});

				if (clickableFeatures.length <= 0) {
					// TODO: add a global handler
					if (clickableLayerKeys.length > 0) {
						const currentlayer = clickableLayerKeys[clickableLayerKeys.length - 1];
						const layer = findLayerFromLayers(layers, currentlayer.name);
						clickableFeatures.every((clickableFeature) => {
							if (layer && layer.onClick) {
								return !layer.onClick(clickableFeature, lngLat, point);
							}
							return null;
						});

						return;
					}
				}
				clickableFeatures.every((clickableFeature) => {
					const {
						layer: { id },
					} = clickableFeature;
					const layer = findLayerFromLayers(layers, id);
					if (layer && layer.onClick) {
						return !layer.onClick(clickableFeature, lngLat, point);
					}
					return false;
				});
			};

			const handleDoubleClick = (data: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
				if (!mapRef.current) {
					return;
				}

				const layers = getLayersForSources(sourcesRef.current);

				const { point, lngLat } = data;

				const clickableLayerKeys = layers
					.filter((layer) => !!layer.onDoubleClick)
					.map((layer) => layer.layerKey);

				const clickableFeatures = mapRef.current.queryRenderedFeatures(point, {
					layers: clickableLayerKeys,
				});

				if (clickableFeatures.length <= 0) {
					console.warn("No clickable layer found.");
					// TODO: add a global handler
					return;
				}
				clickableFeatures.every((clickableFeature) => {
					const {
						layer: { id },
					} = clickableFeature;

					const layer = findLayerFromLayers(layers, id);
					if (layer && layer.onDoubleClick) {
						return !layer.onDoubleClick(clickableFeature, lngLat, point);
					}
					return false;
				});
			};

			const handleMouseMove = (data: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
				if (!mapRef.current) {
					return;
				}

				const layers = getLayersForSources(sourcesRef.current);

				const { point, lngLat } = data;

				/*
                // FIXME: this interferes with the mapboxgl draw plugin
                const interactiveLayerKeys = layers
                    .filter(layer => !!layer.onClick || !!layer.onDoubleClick)
                    .map(layer => layer.layerKey);
                const interactiveFeatures = mapRef.current.queryRenderedFeatures(
                    point,
                    { layers: interactiveLayerKeys },
                );
                if (interactiveFeatures.length <= 0) {
                    mapboxglMap.getCanvas().style.cursor = '';
                } else {
                    mapboxglMap.getCanvas().style.cursor = 'pointer';
                }
                */

				const hoverableLayerKeys = layers
					.filter((layer) => !!layer.onMouseEnter || !!layer.onMouseLeave)
					.map((layer) => layer.layerKey);

				const hoverableFeatures = mapRef.current.queryRenderedFeatures(point, {
					layers: hoverableLayerKeys,
				});

				if (hoverableFeatures.length <= 0) {
					if (lastIn.current) {
						mapboxglMap.removeFeatureState(
							{
								id: lastIn.current.id,
								source: lastIn.current.sourceName,
								sourceLayer: lastIn.current.sourceLayer,
							},
							"hovered"
						);
						const layer = findLayerFromLayers(layers, lastIn.current.layerName);
						if (layer && layer.onMouseLeave) {
							layer.onMouseLeave();
						}
					}
					lastIn.current = undefined;
					return;
				}

				const firstFeature = hoverableFeatures[0];
				if (
					!lastIn.current ||
					firstFeature.source !== lastIn.current.sourceName ||
					firstFeature.sourceLayer !== lastIn.current.sourceLayer ||
					firstFeature.layer.id !== lastIn.current.layerName ||
					firstFeature.id !== lastIn.current.id
				) {
					if (lastIn.current) {
						mapboxglMap.removeFeatureState(
							{
								id: lastIn.current.id,
								source: lastIn.current.sourceName,
								sourceLayer: lastIn.current.sourceLayer,
							},
							"hovered"
						);
					}
					if (
						lastIn.current &&
						(firstFeature.source !== lastIn.current.sourceName ||
							firstFeature.sourceLayer !== lastIn.current.sourceLayer ||
							firstFeature.layer.id !== lastIn.current.layerName)
					) {
						const layer = findLayerFromLayers(layers, lastIn.current.layerName);
						if (layer && layer.onMouseLeave) {
							layer.onMouseLeave();
						}
					}

					lastIn.current = {
						id: firstFeature.id,
						layerName: firstFeature.layer.id,
						sourceName: firstFeature.source,
						sourceLayer: firstFeature.sourceLayer,
					};

					mapboxglMap.setFeatureState(
						{
							id: lastIn.current.id,
							source: lastIn.current.sourceName,
							sourceLayer: lastIn.current.sourceLayer,
						},
						{ hovered: true }
					);

					const {
						layer: { id },
					} = firstFeature;
					const layer = findLayerFromLayers(layers, id);
					if (layer && layer.onMouseEnter) {
						layer.onMouseEnter(firstFeature, lngLat, point);
					}
				}
			};

			const handleResize = () => {
				if (!mapRef.current) {
					return;
				}
				if (!boundsRef.current) {
					return;
				}
				// NOTE: just to be safe here
				if (boundsRef.current.length < 4) {
					return;
				}

				const [fooLon, fooLat, barLon, barLat] = boundsRef.current;
				mapRef.current.fitBounds(
					[
						[fooLon, fooLat],
						[barLon, barLat],
					],
					{
						padding: paddingRef.current,
						duration: durationRef.current,
					}
				);
			};

			mapboxglMap.on("click", handleClick);
			mapboxglMap.on("dblclick", handleDoubleClick);
			mapboxglMap.on("mousemove", handleMouseMove);
			mapboxglMap.on("resize", handleResize);

			const destroy = () => {
				// clearTimeout(timer);

				mapboxglMap.off("click", handleClick);
				mapboxglMap.off("dblclick", handleDoubleClick);
				mapboxglMap.off("mousemove", handleMouseMove);
				mapboxglMap.off("resize", handleResize);

				sourcesRef.current = {};
				lastIn.current = undefined;
				mapDestroyedRef.current = true;

				if (initialDebug) {
					console.warn("Removing map");
				}
				mapboxglMap.remove();
			};

			return destroy;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[initialDebug]
	);

	// Handle style load and map ready
	useEffect(() => {
		if (UNSUPPORTED_BROWSER || !mapRef.current || !mapStyleFromProps) {
			return noop;
		}
		sourcesRef.current = {};
		lastIn.current = undefined;

		if (initialDebug) {
			console.warn(`Setting map style ${mapStyleFromProps}`);
		}
		mapRef.current.setStyle(mapStyleFromProps);

		const onStyleData = () => {
			if (initialDebug) {
				console.info("Passing mapStyle:", mapStyleFromProps);
			}
			setMapStyle(mapStyleFromProps);
		};
		mapRef.current.once("styledata", onStyleData);

		const onLoad = () => {
			setLoaded(true);
		};
		mapRef.current.once("load", onLoad);

		return () => {
			if (mapRef.current) {
				mapRef.current.off("styledata", onStyleData);

				mapRef.current.off("load", onLoad);
			}
		};
	}, [mapStyleFromProps, initialDebug]);

	const isMapDestroyed = useCallback(() => !!mapDestroyedRef.current, []);

	const isSourceDefined = useCallback((sourceKey: string) => !!sourcesRef.current[sourceKey], []);

	const getSource = useCallback((sourceKey: string) => sourcesRef.current[sourceKey], []);

	const setSource = useCallback((source: Source) => {
		sourcesRef.current = produce(sourcesRef.current, (safeSource) => {
			const { name } = source;

			safeSource[name] = source;
		});
	}, []);

	const removeSource = useCallback(
		(sourceKey: string) => {
			if (!sourcesRef.current[sourceKey]) {
				return;
			}

			sourcesRef.current = produce(sourcesRef.current, (safeSource) => {
				delete safeSource[sourceKey];
			});

			if (mapRef.current) {
				if (initialDebug) {
					console.warn(`Removing source: ${sourceKey}`);
				}
				mapRef.current.removeSource(sourceKey);
			}
		},
		[initialDebug]
	);

	const mapChildren = children as React.ReactElement<unknown>;
	if (UNSUPPORTED_BROWSER) {
		return mapChildren;
	}

	const childrenProps = {
		map: mapRef.current,
		mapStyle: loaded ? mapStyle : undefined,
		mapContainerRef,

		isSourceDefined,
		getSource,
		setSource,
		removeSource,

		isMapDestroyed,

		setBounds,
		debug: initialDebug,
	};

	return <MapChildContext.Provider value={childrenProps}>{mapChildren}</MapChildContext.Provider>;
};

Map.defaultProps = {
	scaleControlShown: false,
	scaleControlPosition: "bottom-right",

	navControlShown: false,
	navControlPosition: "top-right",

	debug: false,
};

export default Map;
