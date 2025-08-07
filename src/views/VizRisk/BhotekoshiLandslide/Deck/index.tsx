/* eslint-disable react/prop-types */
import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import * as d3 from "d3";
import MapboxLayer from "@deck.gl/mapbox";
import mapboxgl from "mapbox-gl";
import { useSpring, animated } from "@react-spring/web";
import { connect } from "react-redux";
import { DataFilterExtension } from "@deck.gl/extensions";
import { wardsSelector } from "#selectors";
import DelayedPointLayer from "../Components/DelayedPointLayer";
import Locations from "../Data/locations";
import MapLayers from "../Data/mapLayers";

import styles from "./styles.module.scss";

import("mapbox-gl/dist/mapbox-gl-csp-worker").then((worker) => {
	mapboxgl.workerClass = worker.default;
});

const mapStateToProps = (state) => ({
	// provinces: provincesSelector(state),
	wards: wardsSelector(state),
});

const delayProp = window.location.search === "?target" ? "target" : "longitude";

const Deck = (props) => {
	const [glContext, setGLContext] = useState();
	const deckRef = useRef(null);
	const mapRef = useRef(null);
	const [radiusChange, setRadiusChange] = useState(false);
	const [allDataVisible, setAllDataVisible] = useState(true);
	const [reAnimate, setReAnimate] = useState(false);
	const [delay, setMapDelay] = useState(2000);
	const [filter, setFilter] = useState(null);

	const {
		viewState,
		onViewStateChange,
		libraries,
		currentPage,
		handleFlyTo,
		bahrabiseLandSlide,
		setNarrationDelay,
		getIdle,
	} = props;

	const data = bahrabiseLandSlide.map((row) => ({
		timestamp: row.date,
		latitude: Number(row.position[1]),
		longitude: Number(row.position[0]),
	}));

	const longitudeDelayScale = d3
		.scaleLinear()
		.domain(d3.extent(libraries, (d) => d.date))
		.range([1, 0]);

	const targetDelayScale = d3
		.scaleLinear()
		.domain(d3.extent(libraries, (d) => d.distToTarget))
		.range([0, 1]);

	const getTimeRange = (datas) => {
		if (!datas) return null;
		return datas.reduce(
			(range, d) => {
				const t = d.timestamp;
				range[0] = Math.min(range[0], t);
				range[1] = Math.max(range[1], t);
				return range;
			},
			[Infinity, -Infinity]
		);
	};

	const timeRange = useMemo(() => getTimeRange(data), [data]);
	const filterValue = filter || timeRange;

	const animationProps = useSpring({
		from: { enterProgress: 0 },
		to: { enterProgress: 1 },
		reset: reAnimate,
		delay: delay,
		config: { duration: 30000 },
		onRest: () => setReAnimate(false),
	});

	const getToolTip = ({ object }) =>
		object &&
		currentPage === 5 && {
			html: `
        <div><b>Ward ${object.title}</b></div>
        <div>Family Count: ${object.familycount}</div>
        <div>Total Population: ${object.femalepopulation + object.malepopulation}</div>
      `,
		};

	const getHillshadeLayer = () =>
		[
			`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
			"&version=1.1.1",
			"&service=WMS",
			"&request=GetMap",
			"&layers=Bipad:Bhotekoshi_Hillshade",
			"&tiled=true",
			"&width=256",
			"&height=256",
			"&srs=EPSG:3857",
			"&bbox={bbox-epsg-3857}",
			"&transparent=true",
			"&format=image/png",
		].join("");

	const getSusceptibilityLayer = () =>
		[
			`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
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
		].join("");

	const onMapLoad = useCallback(() => {
		const map = mapRef.current.getMap();
		const { deck } = deckRef.current;

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
			paint: { "raster-opacity": 0.25 },
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
			paint: { "raster-opacity": 1 },
			layout: { visibility: "none" },
		});

		if (currentPage === 8) {
			map.setLayoutProperty("suseptibility-bahrabise", "visibility", "visible");
			map.moveLayer("suseptibility-bahrabise");
		}

		MapLayers.landuse.forEach((layer) =>
			map.setLayoutProperty(layer, "visibility", currentPage === 3 ? "visible" : "none")
		);
		MapLayers.landslide.forEach((layer) =>
			map.setLayoutProperty(layer, "visibility", currentPage === 0 ? "visible" : "none")
		);
		map.on("idle", () => getIdle(true));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!mapRef.current) return;
		const map = mapRef.current.getMap();

		const flyAndVisibility = (flyTo, landuseVisible, landslideVisible) => {
			handleFlyTo(flyTo);
			setReAnimate(true);
			MapLayers.landuse.forEach((layer) =>
				map.setLayoutProperty(layer, "visibility", landuseVisible ? "visible" : "none")
			);
			MapLayers.landslide.forEach((layer) =>
				map.setLayoutProperty(layer, "visibility", landslideVisible ? "visible" : "none")
			);
		};

		switch (currentPage) {
			case 0:
				flyAndVisibility(Locations.nepal, false, false);
				setAllDataVisible(true);
				setRadiusChange(false);
				setNarrationDelay(2000);
				break;
			case 1:
				setReAnimate(true);
				MapLayers.landslide.forEach((layer) =>
					map.setLayoutProperty(layer, "visibility", "visible")
				);
				break;
			case 2:
				flyAndVisibility(Locations.bahrabise, false, true);
				break;
			case 3:
				setReAnimate(true);
				flyAndVisibility(null, true, false);
				break;
			case 4:
				map.setLayoutProperty("ward-fill-local", "visibility", "visible");
				break;
			case 8:
				setReAnimate(true);
				MapLayers.criticalinfra.forEach((layer) =>
					map.setLayoutProperty(layer, "visibility", "none")
				);
				MapLayers.landsliderisk.forEach((layer) =>
					map.setLayoutProperty(layer, "visibility", "none")
				);
				map.setLayoutProperty("bahrabiseHillshadeLocal", "visibility", "none");
				MapLayers.suseptibility.forEach((layer) =>
					map.setLayoutProperty(layer, "visibility", "visible")
				);
				break;
			case 9:
				setReAnimate(true);
				MapLayers.suseptibility.forEach((layer) =>
					map.setLayoutProperty(layer, "visibility", "none")
				);
				MapLayers.landsliderisk.forEach((layer) =>
					map.setLayoutProperty(layer, "visibility", "visible")
				);
				break;
			default:
				break;
		}
	}, [currentPage]);

	const layers = [
		new DelayedPointLayer({
			id: "landslide-scatterplot",
			data: libraries,
			getPosition: (d) => d.position,
			getFillColor: [209, 203, 111],
			getRadius: radiusChange ? 500 : 5000,
			radiusMinPixels: 3,
			visible: allDataVisible && currentPage === 0,
			animationProgress: animationProps.enterProgress.get(),
			pointDuration: 0.25,
			getDelayFactor: (d) =>
				delayProp === "longitude" ? longitudeDelayScale(d.date) : targetDelayScale(d.distToTarget),
		}),
		new DelayedPointLayer({
			id: "landslide-barabise",
			data: bahrabiseLandSlide,
			getPosition: (d) => d.position,
			getFillColor: [209, 203, 111],
			getRadius: 500,
			radiusMinPixels: 8,
			visible: currentPage === 1,
			animationProgress: animationProps.enterProgress.get(),
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
			extensions: [new DataFilterExtension({ filterSize: 1, fp64: false })],
			pickable: true,
		}),
	];

	return (
		<animated.div className={styles.container}>
			<DeckGL
				ref={deckRef}
				layers={layers}
				initialViewState={Locations.nepal}
				controller
				onWebGLInitialized={setGLContext}
				viewState={viewState}
				onViewStateChange={onViewStateChange}
				getTooltip={getToolTip}
				glOptions={{ stencil: true }}
				width={"70%"}
				height={"100vh"}>
				{glContext && (
					<StaticMap
						ref={mapRef}
						gl={glContext}
						mapStyle={import.meta.env.VITE_APP_VIZRISK_BHOTEKOSHI_LANDSLIDE}
						mapboxApiAccessToken={import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN}
						onLoad={onMapLoad}
					/>
				)}
			</DeckGL>
		</animated.div>
	);
};

export default connect(mapStateToProps)(Deck);
