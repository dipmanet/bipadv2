/* eslint-disable react/prop-types */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl"; // Use Map instead of StaticMap
import * as DeckGLMapbox from "@deck.gl/mapbox"; // namespace import workaround
import * as d3 from "d3";
const { MapboxLayer } = DeckGLMapbox;
import mapboxgl from "mapbox-gl";
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

const mapStateToProps = (state) => ({
	// provinces: provincesSelector(state),
	wards: wardsSelector(state),
});

const delayProp = window.location.search === "?target" ? "target" : "longitude";

const Deck = (props) => {
	const mapanimationDuration = 30000;
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
		bahrabiseLandSlide,
		handleFlyTo: parentHandleFlyTo,
		getIdle,
	} = props;

	const data = bahrabiseLandSlide.map((row) => ({
		timestamp: row.date,
		latitude: Number(row.position[1]),
		longitude: Number(row.position[0]),
		// position: [Number(row.position[0]), Number(row.position[1])],
	}));

	const getToolTip = ({ object }) =>
		object &&
		currentPage === 5 && {
			html: `\
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

	const dataFilter = new DataFilterExtension({
		filterSize: 1,
		fp64: false,
	});

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

	const longitudeDelayScale = d3
		.scaleLinear()
		.domain(d3.extent(libraries, (d) => d.date))
		.range([1, 0]);
	const targetDelayScale = d3
		.scaleLinear()
		.domain(d3.extent(libraries, (d) => d.distToTarget))
		.range([0, 1]);

	const handleFlyTo = useCallback(
		(location) => {
			const map = mapRef.current?.getMap();
			if (!map) return;
			map.flyTo({
				center: [location.longitude, location.latitude],
				zoom: location.zoom ?? 12,
				bearing: location.bearing ?? 0,
				pitch: location.pitch ?? 0,
				duration: 2000,
				easing: (t) => t,
			});
			if (parentHandleFlyTo) {
				parentHandleFlyTo(location);
			}
		},
		[parentHandleFlyTo]
	);

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

		map.on("idle", () => {
			getIdle(true);
		});
	}, [currentPage, getIdle]);

	useEffect(() => {
		if (!mapRef.current) {
			return;
		}
		const map = mapRef.current.getMap();

		if (currentPage === 0) {
			handleFlyTo(Locations.nepal);
			setAllDataVisible(true);
			setRadiusChange(false);
			props.setNarrationDelay(2000);

			MapLayers.landslide.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "none");
			});
		} else if (currentPage === 1) {
			setReAnimate(true);
			MapLayers.landslide.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "visible");
			});
		} else if (currentPage === 2) {
			setReAnimate(true);
			handleFlyTo(Locations.bahrabise);

			MapLayers.landuse.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "none");
			});
			MapLayers.landslide.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "visible");
			});
		} else if (currentPage === 3) {
			setReAnimate(true);

			MapLayers.landslide.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "none");
			});
			MapLayers.landuse.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "visible");
			});
		} else if (currentPage === 4) {
			MapLayers.landuse.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "none");
			});
			map.setLayoutProperty("ward-fill-local", "visibility", "visible");
		} else if (currentPage === 8) {
			setReAnimate(true);
			MapLayers.criticalinfra.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "none");
			});
			MapLayers.landsliderisk.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "none");
			});
			map.setLayoutProperty("bahrabiseHillshadeLocal", "visibility", "none");
			MapLayers.suseptibility.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "visible");
			});
		} else if (currentPage === 9) {
			setReAnimate(true);
			MapLayers.suseptibility.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "none");
			});
			MapLayers.landsliderisk.forEach((layer) => {
				map.setLayoutProperty(layer, "visibility", "visible");
			});
		}
	}, [currentPage, handleFlyTo, props]);

	return (
		<Spring
			from={{ enterProgress: 0 }}
			to={{ enterProgress: 1 }}
			delay={delay}
			config={{ duration: mapanimationDuration }}
			reset={reAnimate}>
			{(springProps) => {
				const librariesLayer1 = [
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
					<div
						className={styles.container}
						style={{ position: "relative", width: "70%", height: "100vh" }}>
						<DeckGL
							ref={deckRef}
							layers={librariesLayer1}
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
								<Map
									ref={mapRef}
									gl={glContext}
									mapStyle={import.meta.env.VITE_APP_VIZRISK_BHOTEKOSHI_LANDSLIDE}
									mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN}
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

export default connect(mapStateToProps)(Deck);
