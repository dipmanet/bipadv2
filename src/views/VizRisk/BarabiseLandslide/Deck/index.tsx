/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import * as d3 from "d3";
import * as DeckGLMapbox from "@deck.gl/mapbox"; // namespace import workaround
const { MapboxLayer } = DeckGLMapbox;
import { Spring } from "@react-spring/web";
import { connect } from "react-redux";
import { DataFilterExtension } from "@deck.gl/extensions";
import { wardsSelector } from "#selectors";
import DelayedPointLayer from "../Components/DelayedPointLayer";
import Locations from "../Data/locations";
import MapLayers from "../Data/mapLayers";

import styles from "./styles.module.scss";

// Setup mapbox worker for CSP compliance
(async () => {
	const workerModule = await import("mapbox-gl/dist/mapbox-gl-csp-worker");
	// Assign worker class to the named export or the module itself
	mapboxgl.workerClass = workerModule.default || workerModule;
})();

interface DeckProps {
	viewState: any; // You may want to create a dedicated type
	onViewStateChange: (viewState: any) => void;
	libraries: any[];
	currentPage: number;
	handleFlyTo: (location: { longitude: number; latitude: number }) => void;
	bahrabiseLandSlide: any[];
	setNarrationDelay: (delay: number) => void;
	getIdle: (idle: boolean) => void;
	wards: any[];
}

const delayProp = window.location.search === "?target" ? "target" : "longitude";

const Deck: React.FC<DeckProps> = ({
	viewState,
	onViewStateChange,
	libraries,
	currentPage,
	handleFlyTo,
	bahrabiseLandSlide,
	setNarrationDelay,
	getIdle,
}) => {
	const mapAnimationDuration = 30000;
	const [glContext, setGLContext] = useState();
	const deckRef = useRef(null);
	const mapRef = useRef(null);
	const [radiusChange, setRadiusChange] = useState(false);
	const [allDataVisible, setAllDataVisible] = useState(true);
	const [reAnimate, setReAnimate] = useState(false);
	const [delay] = useState(2000);
	const [filter, setFilter] = useState<[number, number] | null>(null);
	const [landSlidePointsVisible, setLandslideVisible] = useState(true);

	const data = useMemo(
		() =>
			bahrabiseLandSlide.map((row) => ({
				timestamp: row.date,
				latitude: Number(row.position[1]),
				longitude: Number(row.position[0]),
			})),
		[bahrabiseLandSlide]
	);

	const dataFilter = useMemo(() => new DataFilterExtension({ filterSize: 1, fp64: false }), []);

	const getTimeRange = useCallback((datas: typeof data) => {
		if (!datas) return null;
		return datas.reduce(
			(range: [number, number], d) => {
				const t = d.timestamp;
				range[0] = Math.min(range[0], t);
				range[1] = Math.max(range[1], t);
				return range;
			},
			[Infinity, -Infinity]
		);
	}, []);

	const timeRange = useMemo(() => getTimeRange(data), [data, getTimeRange]);

	const filterValue = filter || timeRange || [0, 0];

	const longitudeDelayScale = useMemo(
		() =>
			d3
				.scaleLinear()
				.domain(d3.extent(libraries, (d) => d.date) as [number, number])
				.range([1, 0]),
		[libraries]
	);

	const targetDelayScale = useMemo(
		() =>
			d3
				.scaleLinear()
				.domain(d3.extent(libraries, (d) => d.distToTarget) as [number, number])
				.range([0, 1]),
		[libraries]
	);

	const getToolTip = useCallback(
		({ object }: { object: any }) =>
			object && currentPage === 5
				? {
						html: `<div><b>Ward ${object.title}</b></div>
                   <div>Family Count: ${object.familycount}</div>
                   <div>Total Population: ${object.femalepopulation + object.malepopulation}</div>`,
				  }
				: null,
		[currentPage]
	);

	const getHillshadeLayer = useCallback(
		() =>
			[
				`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
				"&version=1.1.1",
				"&service=WMS",
				"&request=GetMap",
				"&layers=Bipad:Barhabise_hillshade",
				"&tiled=true",
				"&width=256",
				"&height=256",
				"&srs=EPSG:3857",
				"&bbox={bbox-epsg-3857}",
				"&transparent=true",
				"&format=image/png",
			].join(""),
		[]
	);

	const getSusceptibilityLayer = useCallback(
		() =>
			[
				`${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
				"&version=1.1.0",
				"&service=WMS",
				"&request=GetMap",
				"&layers=Bipad:Barhabise_Durham_Susceptibility",
				"&tiled=true",
				"&width=256",
				"&height=256",
				"&srs=EPSG:3857",
				"&bbox={bbox-epsg-3857}",
				"&transparent=true",
				"&format=image/png",
			].join(""),
		[]
	);

	const onMapLoad = useCallback(() => {
		if (!mapRef.current) return;
		const map = mapRef.current.getMap();
		const { deck } = deckRef.current!;
		map.addLayer(new MapboxLayer({ id: "landslide-scatterplot", deck }));
		map.addLayer(new MapboxLayer({ id: "landslide-barabise", deck }));

		map.addSource("hillshadeBahrabiseLocal", {
			type: "raster",
			tiles: [getHillshadeLayer()],
			tileSize: 256,
		});

		map.addLayer({
			id: "bahrabiseHillshadeLocal",
			type: "raster",
			source: "hillshadeBahrabiseLocal",
			layout: {},
			paint: {
				"raster-opacity": 0.25,
			},
		});

		map.addSource("suseptibilityBahrabise", {
			type: "raster",
			tiles: [getSusceptibilityLayer()],
			tileSize: 256,
		});

		map.addLayer({
			id: "suseptibility-bahrabise",
			type: "raster",
			source: "suseptibilityBahrabise",
			paint: {
				"raster-opacity": 1,
			},
			layout: {
				visibility: "none",
			},
		});

		MapLayers.landuse.forEach((layer) => {
			map.setLayoutProperty(layer, "visibility", "none");
		});

		if (currentPage === 3) {
			MapLayers.landuse.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "visible");
			});
		}

		if (currentPage === 0) {
			MapLayers.landslide.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "visible");
			});
		}

		map.on("idle", () => getIdle(true));
	}, [currentPage, getHillshadeLayer, getSusceptibilityLayer, getIdle]);

	useEffect(() => {
		if (!mapRef.current) return;
		const map = mapRef.current.getMap();

		switch (currentPage) {
			case 0:
				handleFlyTo(Locations.nepal);
				setAllDataVisible(true);
				setRadiusChange(false);
				setLandslideVisible(false);
				setNarrationDelay(2000);
				MapLayers.landslide.forEach((layer) => {
					map.setLayoutProperty(layer, "visibility", "none");
				});
				break;
			case 1:
				setReAnimate(true);
				MapLayers.landslide.forEach((layer) => {
					map.setLayoutProperty(layer, "visibility", "visible");
				});
				break;
			case 2:
				setReAnimate(true);
				handleFlyTo(Locations.bahrabise);
				MapLayers.landuse.forEach((layer) => {
					map.setLayoutProperty(layer, "visibility", "none");
				});
				MapLayers.landslide.forEach((layer) => {
					map.setLayoutProperty(layer, "visibility", "visible");
				});
				break;
			case 3:
				setReAnimate(true);
				MapLayers.landslide.forEach((layer) => {
					map.setLayoutProperty(layer, "visibility", "none");
				});
				MapLayers.landuse.forEach((layer) => {
					map.setLayoutProperty(layer, "visibility", "visible");
				});
				break;
			case 4:
				MapLayers.landuse.forEach((layer) => {
					map.setLayoutProperty(layer, "visibility", "none");
				});
				map.setLayoutProperty("ward-fill-local", "visibility", "visible");
				break;
			default:
				break;
		}
	}, [currentPage, handleFlyTo, setNarrationDelay]);

	return (
		<Spring
			from={{ enterProgress: 0 }}
			to={{ enterProgress: 1 }}
			delay={delay}
			config={{ duration: mapAnimationDuration }}
			reset={reAnimate}>
			{(springProps) => {
				const layers = [
					new DelayedPointLayer({
						id: "landslide-scatterplot",
						data: libraries,
						getPosition: (d) => d.position,
						getFillColor: [209, 203, 111],
						getRadius: radiusChange ? 500 : 5000,
						radiusMinPixels: 3,
						visible: allDataVisible && currentPage === 0,
						animationProgress: springProps.enterProgress,
						pointDuration: 0.25,
						getDelayFactor: (d) =>
							delayProp === "longitude"
								? longitudeDelayScale(d.date)
								: targetDelayScale(d.distToTarget),
					}),
					new DelayedPointLayer({
						id: "landslide-barabise",
						data: bahrabiseLandSlide,
						getPosition: (d) => d.position,
						getFillColor: [209, 203, 111],
						getRadius: 500,
						radiusMinPixels: 8,
						animationProgress: springProps.enterProgress,
						visible: currentPage === 1,
					}),
					new ScatterplotLayer({
						id: "landslide-barabise1",
						data: bahrabiseLandSlide,
						opacity: 1,
						radiusScale: 300,
						radiusMinPixels: 1,
						wrapLongitude: true,
						visible: currentPage === 6,
						getPosition: (d) => d.position,
						getRadius: 500,
						getFillColor: [208, 208, 96],
						getFilterValue: (d) => d.timestamp,
						filterRange: [filterValue[0], filterValue[1]],
						filterSoftRange: [
							filterValue[0] * 0.9 + filterValue[1] * 0.1,
							filterValue[0] * 0.1 + filterValue[1] * 0.9,
						],
						extensions: [dataFilter],
						pickable: true,
					}),
				];

				return (
					<div className={styles.container}>
						<DeckGL
							ref={deckRef}
							layers={layers}
							initialViewState={Locations.nepal}
							controller={true}
							onWebGLInitialized={setGLContext}
							viewState={viewState}
							onViewStateChange={onViewStateChange}
							getTooltip={getToolTip}
							glOptions={{ stencil: true }}
							style={{ width: "70%", height: "100vh" }}>
							{glContext && (
								<Map
									ref={mapRef}
									gl={glContext}
									mapStyle={import.meta.env.REACT_APP_VIZRISK_BAHRABISE_LANDSLIDE}
									mapboxAccessToken={import.meta.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
									onLoad={onMapLoad}
								/>
							)}
						</DeckGL>
					</div>
				);
			}}
		</Spring>
	);
};

const mapStateToProps = (state: any) => ({
	wards: wardsSelector(state),
});

export default connect(mapStateToProps)(Deck);
