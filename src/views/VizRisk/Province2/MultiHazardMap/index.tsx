/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
// eslint-disable-next-line import/no-unresolved
import * as geojson from "geojson";
import { listToMap, _cs } from "@togglecorp/fujs";
import Heli from "#resources/icons/Heli.png";
import Education from "#resources/icons/Educationcopy.png";
import Finance from "#resources/icons/bank.png";
import Health from "#resources/icons/healthcopy.png";
import Governance from "#resources/icons/governance.png";
import Culture from "#resources/icons/culture.png";
import Fireengine from "#resources/icons/Fireengine.png";
import { getDistrictFilter } from "#utils/domain";
import FloodDepthLegend from "#views/VizRisk/Common/Legends/FloodDepthLegend";
import { AppState } from "#store/types";
import { mapSources } from "#constants";
import * as PageTypes from "#store/atom/page/types";
import { districtsSelector } from "../../../../store/atom/page/selector";
import { getFloodRasterLayer, getCommonRasterLayer, getGeoJSONPH, buildingColor } from "./utils";
import { getgeoJsonLayer } from "../utils";
import {
	AlertTooltip,
	generatePaint,
	generatePaintByQuantile,
	generatePaintQuantile,
	parseStringToNumber,
} from "../Functions";
import { hdiData, hpiData } from "../Data/vulnerabilityData";
import LandSlideSusLegend from "../Legends/LandSlideSusLegend";
import styles from "./styles.module.scss";

interface State {
	lat: number;
	lng: number;
	zoom: number;
	ciCategoryCritical: string[];
}

interface OwnProps {
	rightElement: number;
	showPopulation: string;
	criticalElement: string;
	CIData: CIData;
	region: Region | undefined;
	mapboxStyle: string;
	zoom: number;
	lng: number;
	lat: number;
	mapCSS: object;
	hillshadeLayerName: string;
	incidentList: CIData;
	handleIncidentChange: (arg: string) => void;
	clickedItem: string;
	mapConstants: MapConstants;
	expressions: Expressions;
	demographicsData: DemographicsData;
	floodLayer: FloodLayer;
	sesmicLayer: string;
	handleDrawSelectedData: (e: any) => void;
	handleDrawResetData: (e: boolean) => void;
	buildings: object[];
	vulnerabilityData: object[];
	setSingularBuilding: (f: boolean, e: object) => void;
	buildingVul: object;
	showAddForm: boolean;
	singularBuilding: boolean;
	provinceId: number;
}

type FloodLayer = "5" | "10" | "20" | "50" | "75" | "100" | "200" | "250" | "500" | "1000";

interface Expressions {
	populationWardExpression: string[];
}

interface DemographicsData {
	name: string;
	MalePop: number;
	FemalePop: number;
	TotalHousehold: number;
}

interface Region {
	adminLevel: number;
	geoarea: number;
}

interface CIData {
	type: geojson.GeoJsonTypes;
	features: Feature[];
}

interface Feature {
	properties: Properties;
	geometry: geojson.Geometry;
}

interface Properties {
	Type: string;
}

interface PropsFromAppState {
	wards: PageTypes.Ward[];
}

interface MapCSS {
	position: "absolute" | "relative";
	width: string;
	left: number;
	top: number;
	height: number;
}

interface MapConstants {
	layers: string[];
	mapCSS: MapCSS;
	mapboxStyle: string;
	zoom: number;
	lng: number;
	lat: number;
	hillshadeLayerName: string;
	incidentsPages: number[];
	ciPages: number[];
	incidentsSliderDelay: number;
	municipalityId: number;
	susceptibilityLayerName: string;
	inundationLayerLayerName: string;
	drawStyles: object[];
	ciRef: object;
	semicPages: number[];
	floodHazardPages: number[];
	susceptibiltyPages: number[];
	floodHazardLayersArr: FloodLayer[];
	buildingSourceLayerName: string;
	provinceId: number;
}

type Props = OwnProps & PropsFromAppState;

type LngLat = any[];
const UNSUPPORTED_BROWSER = !mapboxgl.supported();
const { VITE_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = import.meta.env;
if (TOKEN) {
	mapboxgl.accessToken = TOKEN;
}

const mapStateToProps = (state: AppState): PropsFromAppState => ({
	districts: districtsSelector(state),
});

let hoveredWardId: string | number | undefined;
let draw;
function noop() {}
const MultiHazardMap = (props: Props) => {
	const {
		MAINKEYNAME,
		districts,
		rightElement,
		CIData,
		contactGeoJson,
		criticalElement,
		showPopulation,
		incidentList,
		handleIncidentChange,
		clickedItem,
		mapboxStyle,
		lng,
		lat,
		floodHazardLayersArr,
		mapConstants: {
			layers,
			mapCSS,
			zoom,
			hillshadeLayerName,
			incidentsPages,
			ciPages,
			incidentsSliderDelay,
			ciRef,
			semicPages,
			floodHazardPages,
			susceptibiltyPages,
			buildingSourceLayerName,
		},
		demographicsData,
		expressions: { populationWardExpression },
		floodLayer,
		sesmicLayer,
		handleDrawSelectedData,
		handleDrawResetData,
		buildings,
		vulnerabilityData,
		setSingularBuilding,
		buildingVul,
		showAddForm,
		singularBuilding,
		legendElement,
		showCritical,
		clickedArr,
		exposureElementsArr,
		exposureElement,
		setpending,
		popdensitygeojson,
		hazardLegendClickedArr,
		buildingsData,
		enableNavBtns,
		disableNavBtns,
		populationDensityRange,
		satelliteImageYears,
		selectedYear,
		handleyearClick,
		satelliteYearDisabled,
		setsatelliteYearDisabled,
		setlegentItemDisabled,
		alerts,
		climateTempData,
		tempSelectedData,
		precipitationData,
		prepSelectedData,
		climateDataType,
		tempDataForMapUpto2010,
		tempDataForMapUpto2045,
		tempDataForMapUpto2065,
		prepDataForMapUpto2010,
		prepDataForMapUpto2045,
		prepDataForMapUpto2065,
		setclimateLineChartData,
		setdistrictIdIs,
		vulnerability,
		totalFloodLossData,
		totalLandslideLossData,
		clickedHazardItem,
		clickedFatalityInfraDamage,
		earthquakeData,
		earthquakeRisk,
	} = props;

	const [ciCategoryCritical, setciCategoryCritical] = useState<string[]>([]);
	const [opacitySus, setopacitySus] = useState<number>(0.5);
	const [opacitySes, setopacitySes] = useState<number>(0.5);
	const [opacityFlood, setopacityFlood] = useState<number>(0.5);
	const map = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [alertsDataArr, setAlertsDataArr] = useState([]);
	const [lossLegendsData, setlossLegendsData] = useState([]);

	const susceptibilityLayerName = "province_2_durham_landslide_susceptibility";

	const newDemoColorArray = ["#ffffd6", "#fed990", "#fe9b2a", "#d95f0e", "#9a3404"];

	const handleFloodChange = (e, mapType) => {
		const opacity = e.target.value;
		if (mapType === "flood") {
			setopacityFlood(opacity);
			floodHazardLayersArr.map((l) => {
				if (map.current) {
					map.current.setPaintProperty(`raster-flood-${l.year}`, "raster-opacity", Number(opacity));
				}
				return null;
			});
		} else if (mapType === "ses") {
			if (map.current) {
				map.current.setPaintProperty("inundationLayer", "raster-opacity", Number(opacity));
			}
			setopacitySes(opacity);
		} else if (mapType === "sus") {
			setopacitySus(opacity);
			if (map.current) {
				map.current.setPaintProperty("landslideLayer", "raster-opacity", Number(opacity));
			}
		}
	};
	const generateColor = (maxValue, minValue, colorMapping) => {
		const newColor = [];
		const { length } = colorMapping;
		const range = maxValue - minValue;
		colorMapping.forEach((color, i) => {
			const val = minValue + (i * range) / (length - 1);
			newColor.push(val);
			newColor.push(color);
		});
		return newColor;
	};

	const colorGrade = [
		"#ffe5d4",
		"#f9d0b8",
		"#f2bb9e",
		"#eca685",
		"#e4906e",
		"#dd7a59",
		"#d46246",
		"#cb4836",
		"#c22727",
	];

	const vulColors = ["#c73c32", "#d98452", "#e9bf8c", "#fff5d8", "#d3dba0", "#94c475", "#31ad5c"];

	const tempColors: string[] = [
		"#31a354",
		"#93ce82",
		"#ddf1b3",
		"#fef6cb",
		"#f2b294",
		"#d7595d",
		"#bd0026",
	];

	const rainColors: string[] = [
		"#ffffcc",
		"#c7e4b9",
		"#7fcdbb",
		"#41b6c4",
		"#1d91c0",
		"#225ea8",
		"#0c2c84",
	];

	const getChartData = (measurment: string, district: number) => {
		const mainData = (measurment === "temp" ? climateTempData : precipitationData).filter(
			(d) => d.district === district
		);
		const { rcp45, sdRcp45, rcp85, sdRcp85 } = mainData[0];
		const mapSdRcp45 = listToMap(
			sdRcp45,
			(d) => d.year,
			(d) => d.value
		);
		const mapRcp85 = listToMap(
			rcp85,
			(d) => d.year,
			(d) => d.value
		);
		const mapSdRcp85 = listToMap(
			sdRcp85,
			(d) => d.year,
			(d) => d.value
		);
		const yearWiseData = rcp45
			.map(({ year, value }) => ({
				year,
				rcp45Value: value || 0,
				sdRcp45Value: mapSdRcp45[year] || 0,
				rcp85Value: mapRcp85[year] || 0,
				sdRcp85Value: mapSdRcp85[year] || 0,
			}))
			.map(({ year, rcp45Value, sdRcp45Value, rcp85Value, sdRcp85Value }) => ({
				year,
				"RCP 4.5": Number(rcp45Value.toFixed(2)),
				"SD RCP 4.5": [
					Number((rcp45Value - sdRcp45Value).toFixed(2)),
					Number((rcp45Value + sdRcp45Value).toFixed(2)),
				],
				"RCP 8.5": Number(rcp85Value.toFixed(2)),
				"SD RCP 8.5": [
					Number((rcp85Value - sdRcp85Value).toFixed(2)),
					Number((rcp85Value + sdRcp85Value).toFixed(2)),
				],
			}));
		return yearWiseData;
	};

	const tempDataAccordingToYear = ["temp2010", "temp2045", "temp2065"];
	const prepDataAccordingToYear = ["prep2010", "prep2045", "prep2065"];
	const totalPopulationByWard = demographicsData.map((item) => ({
		ward: item.name,
		totalpop: item.MalePop + item.FemalePop,
	}));
	const arrayValue = totalPopulationByWard.map((item) => item.totalpop);
	const maxPop = Math.max(...arrayValue);
	const minPop = Math.min(...arrayValue);

	const colorForDemographics = generateColor(maxPop, minPop, newDemoColorArray);
	const colorForTemp = generateColor(26, 24, tempColors);
	const colorForPrep = generateColor(1800, 1500, rainColors);
	const colorForEarthquake = generateColor(2.18, 1.48, colorGrade);

	const colorForhdi = ["#c73c32", 0.386, "#c73c32", 0.4, "#e9bf8c", "#e9bf8c"];
	const colorForhpi = generatePaintByQuantile(
		[...vulColors].reverse(),
		36.4,
		46.4,
		hpiData.map((item) => item.value),
		7
	);

	const totalPeopleDeathFlood = totalFloodLossData.map((item) => item.totalPeopleDeath);
	const totalInfraDamageFlood = totalFloodLossData.map((item) => item.totalInfraDamage);
	const totalPeopleDeathLandslide = totalLandslideLossData.map((item) => item.totalPeopleDeath);
	const totalInfraDamageLandslide = totalLandslideLossData.map((item) => item.totalInfraDamage);

	const damageLossArray = [
		"totalPeopleDeathFlood",
		"totalInfraDamageFlood",
		"totalPeopleDeathLandslide",
		"totalInfraDamageLandslide",
	];
	const damageLossDataArray = [
		totalFloodLossData,
		totalFloodLossData,
		totalLandslideLossData,
		totalLandslideLossData,
	];

	const color1 = generateColor(
		Math.max(...totalPeopleDeathFlood),
		Math.min(...totalPeopleDeathFlood),
		colorGrade
	);
	const color2 = generateColor(
		Math.max(...totalInfraDamageFlood),
		Math.min(...totalInfraDamageFlood),
		colorGrade
	);

	const color3 = generateColor(
		Math.max(...totalPeopleDeathLandslide),
		Math.min(...totalPeopleDeathLandslide),
		colorGrade
	);
	const color4 = generateColor(
		Math.max(...totalInfraDamageLandslide),
		Math.min(...totalInfraDamageLandslide),
		colorGrade
	);

	const allDamageColors = [color1, color2, color3, color4];

	const earthquakeRiskScoreArray = earthquakeData.map((item: any) => ({
		value: item.data.riskScore,
		districtId: item.district,
	}));

	const images = [
		{
			name: "education",
			url: Education,
		},
		{
			name: "finance",
			url: Finance,
		},
		{
			name: "health",
			url: Health,
		},
		{
			name: "governance",
			url: Governance,
		},
		{
			name: "cultural",
			url: Culture,
		},
		{
			name: "fireengine",
			url: Fireengine,
		},
		{
			name: "helipad",
			url: Heli,
		},
	];

	useEffect(() => {
		disableNavBtns("both");
		if (UNSUPPORTED_BROWSER) {
			console.error("No Mapboxgl support.");
			return noop;
		}
		const { current: mapContainer } = mapContainerRef;
		if (!mapContainer) {
			console.error("No container found.");
			return noop;
		}
		if (map.current) {
			return noop;
		}

		const mapping = districts
			.filter((item) => item.province === 2)
			.map((item) => ({
				...item,
				value: item.id,
			}));

		const multihazardMap = new mapboxgl.Map({
			container: mapContainer,
			style: "mapbox://styles/yilab/cky6ydau933qq15o7bmmblnt4",
			center: [lng, lat],
			zoom,
			minZoom: 2,
			maxZoom: 22,
		});

		map.current = multihazardMap;

		multihazardMap.addControl(new mapboxgl.ScaleControl(), "bottom-left");

		multihazardMap.addControl(new mapboxgl.NavigationControl(), "top-right");

		const syncWait = (ms) => {
			const end = Date.now() + ms;
			while (Date.now() < end) break;
		};

		syncWait(4000);

		multihazardMap.on("idle", () => {
			setsatelliteYearDisabled(false);
			setlegentItemDisabled(false);
			if (rightElement === 0) {
				enableNavBtns("Right");
			} else if (rightElement === 4) {
				enableNavBtns("Left");
			}
			enableNavBtns("both");
		});

		multihazardMap.on("style.load", () => {
			// -------------------------------------------------SLIDE-1-------------------------
			multihazardMap.addSource("vizrisk-fills", {
				type: "vector",
				url: mapSources.nepal.url,
			});

			multihazardMap.addLayer(
				{
					id: "ward-fill-local",
					source: "vizrisk-fills",
					"source-layer": mapSources.nepal.layers.district,
					type: "fill",

					paint: generatePaint(colorForDemographics),
					layout: {
						visibility: "none",
					},
					filter: getDistrictFilter(2, null, districts),
				},
				"districtgeo"
			);

			const popup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false,
				className: "popup",
			});

			demographicsData.forEach((attribute) => {
				multihazardMap.setFeatureState(
					{
						id: attribute.id,
						source: "vizrisk-fills",
						sourceLayer: mapSources.nepal.layers.district,
					},
					{ value: attribute.MalePop + attribute.FemalePop }
				);
			});

			multihazardMap.on("mousemove", "ward-fill-local", (e) => {
				if (e.features.length > 0) {
					multihazardMap.getCanvas().style.cursor = "pointer";
					const { lngLat } = e;
					const coordinates: LngLat = [lngLat.lng, lngLat.lat];
					const wardno = e.features[0].properties.title;
					const details = demographicsData.filter((item) => item.name === `${wardno}`);
					const totalPop = details[0].MalePop + details[0].FemalePop;
					popup
						.setLngLat(coordinates)
						.setHTML(
							`<div style="padding: 5px;border-radius: 5px">
                            <p>${details[0].name} Total Population: ${parseStringToNumber(
								totalPop
							)}</p>
                        </div>
                        `
						)
						.addTo(multihazardMap);
					if (hoveredWardId) {
						multihazardMap.setFeatureState(
							{
								id: hoveredWardId,
								source: "vizrisk-fills",
								sourceLayer: mapSources.nepal.layers.ward,
							},
							{ hover: false }
						);
					}
					hoveredWardId = e.features[0].id;
					multihazardMap.setFeatureState(
						{
							id: hoveredWardId,
							source: "vizrisk-fills",
							sourceLayer: mapSources.nepal.layers.ward,
						},
						{ hover: true }
					);
				}
			});

			if (populationWardExpression) {
				multihazardMap.on("mouseleave", "ward-fill-local", () => {
					multihazardMap.getCanvas().style.cursor = "";
					popup.remove();
					if (hoveredWardId) {
						multihazardMap.setFeatureState(
							{
								source: "vizrisk-fills",
								id: hoveredWardId,
								sourceLayer: mapSources.nepal.layers.ward,
							},
							{ hover: false }
						);
					}
					hoveredWardId = null;
				});
			}

			// -----------------------------------------SLIDE-2----------------------
			damageLossArray.map((layer, i) => {
				multihazardMap.addSource(`damageloss-${layer}`, {
					type: "vector",
					url: mapSources.nepal.url,
				});

				multihazardMap.addLayer(
					{
						id: `${layer}`,
						source: `damageloss-${layer}`,
						"source-layer": mapSources.nepal.layers.district,
						type: "fill",
						paint: generatePaint(allDamageColors[i]),
						layout: {
							visibility: "none",
						},
						filter: getDistrictFilter(2, null, districts),
					},
					"districtgeo"
				);

				if (i === 0 || i === 2) {
					damageLossDataArray[i].forEach((attribute) => {
						multihazardMap.setFeatureState(
							{
								id: attribute.id,
								source: `damageloss-${layer}`,
								sourceLayer: mapSources.nepal.layers.district,
							},
							{ value: attribute.totalPeopleDeath }
						);
					});
				}
				if (i === 1 || i === 3) {
					damageLossDataArray[i].forEach((attribute) => {
						multihazardMap.setFeatureState(
							{
								id: attribute.id,
								source: `damageloss-${layer}`,
								sourceLayer: mapSources.nepal.layers.district,
							},
							{ value: attribute.totalInfraDamage }
						);
					});
				}

				return null;
			});

			// ------------------------------------------------SLIDE-3-------------------------------------------------------

			const alertsData = [...new Set(alerts.features.map((item) => item.properties.Type))];

			setAlertsDataArr(alertsData);

			alertsData.map((layer) => {
				multihazardMap.addSource(layer, {
					type: "geojson",
					data: getGeoJSONPH(layer, alerts),
				});

				multihazardMap.addLayer({
					id: `alerts-${layer}`,
					type: "circle",
					source: layer,
					paint: {
						"circle-color": ["get", "alertsColor"],
						"circle-stroke-width": 1.2,
						"circle-stroke-color": "#000000",
						"circle-radius-transition": { duration: 0 },
						"circle-opacity-transition": { duration: 0 },
						"circle-radius": 6,
						"circle-opacity": 0.8,
					},
					layout: {
						visibility: "none",
					},
				});

				multihazardMap.on("click", `alerts-${layer}`, (e) => {
					const coordinates = e.features[0].geometry.coordinates.slice();
					const { referenceData } = e.features[0].properties;
					const { createdDate } = e.features[0].properties;
					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
					}
					const popupNode = document.createElement("div");
					ReactDOM.render(
						<AlertTooltip
							title="test"
							description="test"
							referenceData={JSON.parse(referenceData)}
							createdDate={createdDate}
							referenceType={e.features[0].properties.Type}
						/>,
						popupNode
					);
					new mapboxgl.Popup()
						.setLngLat(coordinates)
						.setDOMContent(popupNode)
						.addTo(multihazardMap);
				});

				return null;
			});
			// ------------------------------------SLIDE-4-------------------------

			if (floodHazardLayersArr && floodHazardLayersArr.length > 0) {
				floodHazardLayersArr.map((layer) => {
					multihazardMap.addSource(`floodraster${layer.year}`, {
						type: "raster",
						tiles: [getFloodRasterLayer(layer.layername)],
						tileSize: 256,
					});
					multihazardMap.addLayer({
						id: `raster-flood-${layer.year}`,
						type: "raster",
						source: `floodraster${layer.year}`,
						layout: {
							visibility: "none",
						},
						paint: {
							"raster-opacity": opacityFlood,
						},
					});
					return null;
				});
			}
			multihazardMap.addSource("landslide", {
				type: "raster",
				tiles: [getCommonRasterLayer(susceptibilityLayerName)],
				tileSize: 256,
			});

			multihazardMap.addLayer({
				id: "landslideLayer",
				type: "raster",
				source: "landslide",
				layout: {
					visibility: "none",
				},
				paint: {
					"raster-opacity": opacitySus,
				},
			});
			multihazardMap.addSource("floodInundation", {
				type: "raster",
				tiles: [getCommonRasterLayer("province_2_wfp_flood_inundation_2019")],
				tileSize: 256,
			});

			multihazardMap.addLayer({
				id: "inundationLayer",
				type: "raster",
				source: "floodInundation",
				layout: {
					visibility: "none",
				},
				paint: {
					"raster-opacity": opacitySes,
				},
			});

			// -----------------------------------------------SLIDE-5-----------------------------
			const avialableVulColors = [colorForhdi, colorForhpi];
			const availableData = [hdiData, hpiData];
			["hdiData", "hpiData"].map((layer, i) => {
				multihazardMap.addSource(`vulnerability-fill-${layer}`, {
					type: "vector",
					url: mapSources.nepal.url,
				});

				multihazardMap.addLayer(
					{
						id: layer,
						source: `vulnerability-fill-${layer}`,
						"source-layer": mapSources.nepal.layers.district,
						type: "fill",
						paint: generatePaintQuantile(avialableVulColors[i]),
						layout: {
							visibility: "none",
						},
						filter: getDistrictFilter(2, null, districts),
					},
					"districtgeo"
				);

				availableData[i].forEach((attribute) => {
					multihazardMap.setFeatureState(
						{
							id: attribute.id,
							source: `vulnerability-fill-${layer}`,
							sourceLayer: mapSources.nepal.layers.district,
						},
						{ value: attribute.value }
					);
				});
				multihazardMap.on("mousemove", layer, (e) => {
					if (e.features.length > 0) {
						multihazardMap.getCanvas().style.cursor = "pointer";
						const { lngLat } = e;
						const coordinates: LngLat = [lngLat.lng, lngLat.lat];
						const wardno = e.features[0].state.value;
						popup
							.setLngLat(coordinates)
							.setHTML(
								`<div style="padding: 5px;border-top : 3px solid red;">
						     <p>${vulnerability === "Human Poverty Index" ? "HPI" : "HDI"}: ${wardno}</p></div>`
							)
							.addTo(multihazardMap);

						if (hoveredWardId !== null) {
							multihazardMap.setFeatureState(
								{
									id: hoveredWardId,
									source: `vulnerability-fill-${layer}`,
									sourceLayer: mapSources.nepal.layers.district,
								},
								{ hover: false }
							);
						}
						hoveredWardId = e.features[0].id;
						multihazardMap.setFeatureState(
							{
								id: hoveredWardId,
								source: `vulnerability-fill-${layer}`,
								sourceLayer: mapSources.nepal.layers.district,
							},
							{ hover: true }
						);
					}
				});
				multihazardMap.on("mouseleave", layer, () => {
					multihazardMap.getCanvas().style.cursor = "";
					popup.remove();
					if (hoveredWardId) {
						multihazardMap.setFeatureState(
							{
								source: `vulnerability-fill-${layer}`,
								id: hoveredWardId,
								sourceLayer: mapSources.nepal.layers.district,
							},
							{ hover: false }
						);
					}
					hoveredWardId = null;
				});

				return null;
			});

			multihazardMap.addSource("earthquake-data", {
				type: "vector",
				url: mapSources.nepal.url,
			});

			multihazardMap.addLayer(
				{
					id: "earthquake-risk-score",
					source: "earthquake-data",
					"source-layer": mapSources.nepal.layers.district,
					type: "fill",
					paint: generatePaint(colorForEarthquake),
					layout: {
						visibility: "none",
					},
					filter: getDistrictFilter(2, null, districts),
				},
				"districtgeo"
			);

			earthquakeRiskScoreArray.forEach((attribute) => {
				multihazardMap.setFeatureState(
					{
						id: attribute.districtId,
						source: "earthquake-data",
						sourceLayer: mapSources.nepal.layers.district,
					},
					{ value: attribute.value }
				);
			});

			// ------------------------------SLIDE-6---------------------------
			const mainTempData = [tempDataForMapUpto2010, tempDataForMapUpto2045, tempDataForMapUpto2065];
			const mainPrepData = [prepDataForMapUpto2010, prepDataForMapUpto2045, prepDataForMapUpto2065];

			tempDataAccordingToYear.map((layer, i) => {
				multihazardMap.addSource(`temperature-fill-${layer}`, {
					type: "vector",
					url: mapSources.nepal.url,
				});

				multihazardMap.addLayer(
					{
						id: layer,
						source: `temperature-fill-${layer}`,
						"source-layer": mapSources.nepal.layers.district,
						type: "fill",
						paint: generatePaint(colorForTemp),
						layout: {
							visibility: "none",
						},
						filter: getDistrictFilter(2, null, districts),
					},
					"districtgeo"
				);

				mainTempData[i].forEach((attribute) => {
					multihazardMap.setFeatureState(
						{
							id: attribute.id,
							source: `temperature-fill-${layer}`,
							sourceLayer: mapSources.nepal.layers.district,
						},
						{ value: parseFloat(attribute.value) }
					);
				});
				multihazardMap.on("mousemove", layer, (e) => {
					if (e.features.length > 0) {
						multihazardMap.getCanvas().style.cursor = "pointer";
						const { lngLat } = e;
						const coordinates: LngLat = [lngLat.lng, lngLat.lat];
						const wardno = e.features[0].state.value;
						popup
							.setLngLat(coordinates)
							.setHTML(
								`<div style="padding: 5px;border-top : 3px solid red;">
						     <p>RCP 4.5: ${wardno}</p></div>`
							)
							.addTo(multihazardMap);

						if (hoveredWardId !== null) {
							multihazardMap.setFeatureState(
								{
									id: hoveredWardId,
									source: `temperature-fill-${layer}`,
									sourceLayer: mapSources.nepal.layers.district,
								},
								{ hover: false }
							);
						}
						hoveredWardId = e.features[0].id;
						multihazardMap.setFeatureState(
							{
								id: hoveredWardId,
								source: `temperature-fill-${layer}`,
								sourceLayer: mapSources.nepal.layers.district,
							},
							{ hover: true }
						);
					}
				});
				multihazardMap.on("mouseleave", layer, () => {
					multihazardMap.getCanvas().style.cursor = "";
					popup.remove();
					if (hoveredWardId) {
						multihazardMap.setFeatureState(
							{
								source: `temperature-fill-${layer}`,
								id: hoveredWardId,
								sourceLayer: mapSources.nepal.layers.district,
							},
							{ hover: false }
						);
					}
					hoveredWardId = null;
				});

				return null;
			});

			prepDataAccordingToYear.map((layer, i) => {
				multihazardMap.addSource(`precipitation-fill-${layer}`, {
					type: "vector",
					url: mapSources.nepal.url,
				});

				multihazardMap.addLayer(
					{
						id: layer,
						source: `precipitation-fill-${layer}`,
						"source-layer": mapSources.nepal.layers.district,
						type: "fill",
						paint: generatePaint(colorForPrep),
						layout: {
							visibility: "none",
						},
						filter: getDistrictFilter(2, null, districts),
					},
					"districtgeo"
				);

				mainPrepData[i].forEach((attribute) => {
					multihazardMap.setFeatureState(
						{
							id: attribute.id,
							source: `precipitation-fill-${layer}`,
							sourceLayer: mapSources.nepal.layers.district,
						},
						{ value: parseFloat(attribute.value) }
					);
				});
				multihazardMap.on("mousemove", layer, (e) => {
					if (e.features.length > 0) {
						multihazardMap.getCanvas().style.cursor = "pointer";
						const { lngLat } = e;
						const coordinates: LngLat = [lngLat.lng, lngLat.lat];
						const wardno = e.features[0].state.value;
						popup
							.setLngLat(coordinates)
							.setHTML(
								`<div style="padding: 5px;border-top : 3px solid red;">
						     <p>RCP 4.5: ${wardno}</p></div>`
							)
							.addTo(multihazardMap);

						if (hoveredWardId !== null) {
							multihazardMap.setFeatureState(
								{
									id: hoveredWardId,
									source: `precipitation-fill-${layer}`,
									sourceLayer: mapSources.nepal.layers.district,
								},
								{ hover: false }
							);
						}
						hoveredWardId = e.features[0].id;
						multihazardMap.setFeatureState(
							{
								id: hoveredWardId,
								source: `precipitation-fill-${layer}`,
								sourceLayer: mapSources.nepal.layers.district,
							},
							{ hover: true }
						);
					}
				});
				multihazardMap.on("mouseleave", layer, () => {
					multihazardMap.getCanvas().style.cursor = "";
					popup.remove();
					if (hoveredWardId) {
						multihazardMap.setFeatureState(
							{
								source: `precipitation-fill-${layer}`,
								id: hoveredWardId,
								sourceLayer: mapSources.nepal.layers.district,
							},
							{ hover: false }
						);
					}
					hoveredWardId = null;
				});

				return null;
			});

			// -----------------------------------------------SLIDE-7--------------------------
			const ciCategory: any = [...new Set(CIData.features.map((item) => item.properties.Type))];

			setciCategoryCritical(ciCategory);

			images.forEach((img) => {
				map.current.loadImage(img.url, (error, image) => {
					if (error) throw error;
					map.current.addImage(img.name, image);
				});
			});

			ciCategory.map((layer: string) => {
				multihazardMap.addSource(layer, {
					type: "geojson",
					data: getGeoJSONPH(layer, CIData),
					cluster: true,
					clusterRadius: 50,
				});

				multihazardMap.addLayer({
					id: `clusters-${layer}`,
					type: "circle",
					source: layer,
					filter: ["has", "point_count"],
					layout: {
						visibility: "none",
					},
					paint: {
						"circle-color": ["step", ["get", "point_count"], "#3da1a6", 100, "#3da1a6"],
						"circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
					},
				});
				multihazardMap.addLayer({
					id: `clusters-count-${layer}`,
					type: "symbol",
					source: layer,
					// paint: { 'circle-color': '#d1e7e8' },
					layout: {
						"text-field": "{point_count_abbreviated}",
						"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
						"text-size": 12,
						visibility: "none",
					},
				});
				multihazardMap.addLayer({
					id: `unclustered-point-${layer}`,
					type: "symbol",
					source: layer,
					filter: ["!", ["has", "point_count"]],
					layout: {
						"icon-image":
							(layer === "education" && "education") ||
							(layer === "finance" && "finance") ||
							(layer === "health" && "health") ||
							(layer === "governance" && "governance") ||
							(layer === "cultural" && "cultural") ||
							(layer === "fireengine" && "fireengine") ||
							(layer === "helipad" && "helipad"),
						"icon-size": 0.08,
						"icon-anchor": "bottom",
						visibility: "none",
					},
				});

				ciCategory.map((ci: string) =>
					multihazardMap.on("mousemove", `unclustered-point-${ci}`, (e: any) => {
						if (e) {
							const { lngLat } = e;
							const coordinates: number[] = [lngLat.lng, lngLat.lat];
							const ciName = e.features[0].properties.Name;
							popup
								.setLngLat(coordinates)
								.setHTML(
									`<div style="padding: 5px;border-radius: 5px">
                                    <p>${ciName}</p>
                                </div>
                        `
								)
								.addTo(multihazardMap);
						}
					})
				);

				ciCategory.map((ci: string) =>
					multihazardMap.on("mouseleave", `unclustered-point-${ci}`, () => {
						multihazardMap.getCanvas().style.cursor = "";
						popup.remove();
					})
				);
				multihazardMap.moveLayer(`unclustered-point-${layer}`);
				multihazardMap.moveLayer(`clusters-${layer}`);
				multihazardMap.moveLayer(`clusters-count-${layer}`);

				return null;
			});

			// --------------------------SLIDE-8--------------------
			const contactDataArr = [
				...new Set(contactGeoJson.features.map((item) => item.properties.name)),
			];

			multihazardMap.addSource("contactInfo", {
				type: "geojson",
				data: contactGeoJson,
				cluster: true,
				clusterMaxZoom: 14,
				clusterRadius: 50,
			});

			multihazardMap.addLayer({
				id: "contacts-layer",
				type: "circle",
				source: "contactInfo",
				filter: ["has", "point_count"],
				paint: {
					"circle-color": [
						"step",
						["get", "point_count"],
						"#51bbd6",
						100,
						"#f1f075",
						750,
						"#f28cb1",
					],
					"circle-stroke-width": 1.2,
					"circle-stroke-color": "#000000",
					"circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
				},
				layout: {
					visibility: "none",
				},
			});

			multihazardMap.addLayer({
				id: "contacts-cluster-count",
				type: "symbol",
				source: "contactInfo",
				filter: ["has", "point_count"],
				layout: {
					"text-field": "{point_count_abbreviated}",
					"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
					"text-size": 12,
					visibility: "none",
				},
			});

			multihazardMap.addLayer({
				id: "contacts-unclustered-point",
				type: "circle",
				source: "contactInfo",
				filter: ["!", ["has", "point_count"]],
				paint: {
					"circle-color": "#11b4da",
					"circle-radius": 6,
					"circle-stroke-width": 1,
					"circle-stroke-color": "#fff",
				},
				layout: {
					visibility: "none",
				},
			});
			multihazardMap.on("click", "contacts-unclustered-point", (e) => {
				const coordinates = e.features[0].geometry.coordinates.slice();
				const { name } = e.features[0].properties;
				const { mobileNumber } = e.features[0].properties;
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}
				new mapboxgl.Popup()
					.setLngLat(coordinates)
					.setHTML(
						`<div style="padding: 5px;border-radius: 5px">
					<p>${name}</p>
					<p>Contact No : ${mobileNumber}</p>
				</div>
		`
					)
					.addTo(multihazardMap);
			});
		});

		multihazardMap.setZoom(1);
		setTimeout(() => {
			disableNavBtns("both");

			multihazardMap.easeTo({
				pitch: 25,
				center: [lng, lat],
				zoom: 8.2,
				duration: 8000,
			});
		}, 4000);
		const destroyMap = () => {
			multihazardMap.remove();
		};

		return destroyMap;
	}, []);

	useEffect(() => {
		if (rightElement === 6) {
			const switchFloodRasters = (floodlayer: FloodLayer) => {
				if (floodHazardLayersArr && floodHazardLayersArr.length > 0 && map.current) {
					floodHazardLayersArr.map((layer) => {
						if (map.current) {
							map.current.setLayoutProperty(`raster-flood-${layer.year}`, "visibility", "none");
						}
						return null;
					});
					map.current.setLayoutProperty(`raster-flood-${floodlayer}`, "visibility", "visible");
				}
			};

			if (map.current && floodHazardLayersArr && map.current.isStyleLoaded()) {
				switchFloodRasters(floodLayer);
			}
			if (map.current && map.current.isStyleLoaded()) {
				ciCategoryCritical.map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(`unclustered-point-${layer}`, "visibility", "none");
						map.current.setLayoutProperty(`clusters-${layer}`, "visibility", "none");
						map.current.setLayoutProperty(`clusters-count-${layer}`, "visibility", "none");
					}
					return null;
				});
				const layer = criticalElement;
				if (layer === "all") {
					ciCategoryCritical.map((item: string) => {
						if (map.current) {
							map.current.setLayoutProperty(`unclustered-point-${item}`, "visibility", "visible");
							map.current.setLayoutProperty(`clusters-${item}`, "visibility", "visible");
							map.current.setLayoutProperty(`clusters-count-${item}`, "visibility", "visible");
						}
						return null;
					});
				} else {
					map.current.setLayoutProperty(`unclustered-point-${layer}`, "visibility", "visible");
					map.current.setLayoutProperty(`clusters-${layer}`, "visibility", "visible");
					map.current.setLayoutProperty(`clusters-count-${layer}`, "visibility", "visible");
				}

				if (hazardLegendClickedArr[0] === 1) {
					if (map.current) {
						layers[3].map((layermain) =>
							map.current.setLayoutProperty(layermain, "visibility", "visible")
						);
						if (floodLayer) {
							map.current.setLayoutProperty(`raster-flood-${floodLayer}`, "visibility", "visible");
						}
					}
				} else {
					map.current.setLayoutProperty(`raster-flood-${floodLayer}`, "visibility", "none");
				}

				if (hazardLegendClickedArr[2] === 1) {
					if (map.current) {
						map.current.setLayoutProperty("landslideLayer", "visibility", "visible");
					}
				} else {
					map.current.setLayoutProperty("landslideLayer", "visibility", "none");
				}

				if (hazardLegendClickedArr[1] === 1) {
					if (map.current) {
						map.current.setLayoutProperty("inundationLayer", "visibility", "visible");
					}
				} else {
					map.current.setLayoutProperty("inundationLayer", "visibility", "none");
				}
				if (earthquakeRisk === "Earthquake Risk") {
					if (map.current) {
						map.current.setLayoutProperty("earthquake-risk-score", "visibility", "visible");
					}
				} else {
					map.current.setLayoutProperty("earthquake-risk-score", "visibility", "none");
				}
			}
		}
	}, [
		criticalElement,
		floodLayer,
		floodHazardLayersArr,
		clickedHazardItem,
		hazardLegendClickedArr,
		layers,
		earthquakeRisk,
	]);

	useEffect(() => {
		if (rightElement === 4) {
			const switchFloodRasters = (floodlayer: FloodLayer) => {
				if (floodHazardLayersArr && floodHazardLayersArr.length > 0 && map.current) {
					floodHazardLayersArr.map((layer) => {
						if (map.current) {
							map.current.setLayoutProperty(`raster-flood-${layer.year}`, "visibility", "none");
						}
						return null;
					});
					map.current.setLayoutProperty(`raster-flood-${floodlayer}`, "visibility", "visible");
				}
			};

			if (map.current && floodHazardLayersArr && map.current.isStyleLoaded()) {
				switchFloodRasters(floodLayer);
			}
		}
	}, [floodLayer, floodHazardLayersArr]);

	useEffect(() => {
		if (map.current) {
			tempDataAccordingToYear.map((layer) => {
				map.current.on("click", layer, (e) => {
					const { lngLat } = e;
					const coordinates: LngLat = [lngLat.lng, lngLat.lat];
					const districtId = e.features[0].id;
					setdistrictIdIs(districtId);
					if (tempSelectedData === "temp2010") {
						const data = getChartData("temp", districtId).filter((item) => item.year <= 2010);
						setclimateLineChartData(data);
					}
					if (tempSelectedData === "temp2045") {
						const data = getChartData("temp", districtId).filter(
							(item) => item.year <= 2045 && item.year >= 2015
						);
						setclimateLineChartData(data);
					}
					if (tempSelectedData === "temp2065") {
						const data = getChartData("temp", districtId).filter(
							(item) => item.year <= 2065 && item.year >= 2035
						);
						setclimateLineChartData(data);
					}
				});
				return null;
			});
		}
	}, [tempSelectedData]);

	useEffect(() => {
		if (map.current) {
			prepDataAccordingToYear.map((layer) => {
				map.current.on("click", layer, (e) => {
					const { lngLat } = e;
					const coordinates: LngLat = [lngLat.lng, lngLat.lat];
					const districtId = e.features[0].id;
					setdistrictIdIs(districtId);
					if (prepSelectedData === "prep2010") {
						const data = getChartData("prep", districtId).filter((item) => item.year <= 2010);
						setclimateLineChartData(data);
					}
					if (prepSelectedData === "prep2045") {
						const data = getChartData("prep", districtId).filter(
							(item) => item.year <= 2045 && item.year >= 2015
						);
						setclimateLineChartData(data);
					}
					if (prepSelectedData === "prep2065") {
						const data = getChartData("prep", districtId).filter(
							(item) => item.year <= 2065 && item.year >= 2035
						);
						setclimateLineChartData(data);
					}
				});
				return null;
			});
		}
	}, [prepSelectedData]);

	useEffect(() => {
		if (map.current && map.current.isStyleLoaded()) {
			// -----------------------------------------------------First Page-------------------------------------------------
			map.current.easeTo({
				pitch: 37,
				zoom: 8.2,
				duration: 1200,
				// center: [lng, lat],
			});
			if (rightElement === 0) {
				if (legendElement === "Adminstrative Map") {
					layers[1].map((layer) => {
						if (map.current) {
							map.current.setLayoutProperty(layer, "visibility", "visible");
						}
						return null;
					});
					layers[2].map((layer) => {
						if (map.current) {
							map.current.setLayoutProperty(layer, "visibility", "none");
						}
						return null;
					});
					if (map.current) {
						layers[3].map((layer) => map.current.setLayoutProperty(layer, "visibility", "visible"));
					}
				} else if (legendElement === "Landcover") {
					layers[1].map((layer) => {
						if (map.current) {
							map.current.setLayoutProperty(layer, "visibility", "visible");
						}
						return null;
					});
					layers[2].map((layer) => {
						if (map.current) {
							map.current.setLayoutProperty(layer, "visibility", "none");
						}
						return null;
					});
					if (map.current) {
						layers[3].map((layer) => map.current.setLayoutProperty(layer, "visibility", "visible"));
					}
					map.current.easeTo({
						pitch: 45,
						zoom: 8.2,
						duration: 1200,
						// center: [lng, lat],
					});
				} else if (legendElement === "Population By District") {
					layers[2].map((layer) => {
						if (map.current) {
							map.current.setLayoutProperty(layer, "visibility", "visible");
						}
						return null;
					});

					layers[1].map((layer) => {
						if (map.current) {
							map.current.setLayoutProperty(layer, "visibility", "none");
						}
						return null;
					});
				}
			} else {
				layers[1].map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(layer, "visibility", "none");
					}
					return null;
				});
				layers[2].map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(layer, "visibility", "none");
					}
					return null;
				});
			}

			if (rightElement === 2) {
				alertsDataArr.map((item) => {
					if (map.current) {
						map.current.setLayoutProperty(`alerts-${item}`, "visibility", "visible");
					}
					return null;
				});
			} else {
				alertsDataArr.map((item) => {
					if (map.current) {
						map.current.setLayoutProperty(`alerts-${item}`, "visibility", "none");
					}
					return null;
				});
			}
			// ----------------------------Third Page-----------------------------
			if (
				(ciPages && rightElement === 6 && clickedArr[0] === 1) ||
				(rightElement === 3 && exposureElementsArr[1] === 1)
			) {
				ciCategoryCritical.map((item: string) => {
					if (map.current) {
						map.current.setLayoutProperty(`clusters-${item}`, "visibility", "visible");
						map.current.moveLayer(`clusters-${item}`);
						map.current.setLayoutProperty(`clusters-count-${item}`, "visibility", "visible");
						map.current.moveLayer(`clusters-count-${item}`);
						map.current.setLayoutProperty(`unclustered-point-${item}`, "visibility", "visible");
						map.current.moveLayer(`unclustered-point-${item}`);
					}
					return null;
				});
			} else {
				ciCategoryCritical.map((item: string) => {
					if (map.current) {
						map.current.setLayoutProperty(`clusters-${item}`, "visibility", "none");
						map.current.moveLayer(`clusters-${item}`);
						map.current.setLayoutProperty(`clusters-count-${item}`, "visibility", "none");
						map.current.moveLayer(`clusters-count-${item}`);
						map.current.setLayoutProperty(`unclustered-point-${item}`, "visibility", "none");
						map.current.moveLayer(`unclustered-point-${item}`);
					}
					return null;
				});
			}
			if (
				(rightElement === 0 && (legendElement === "Landcover" || "Adminstrative Map")) ||
				(rightElement === 2 && clickedArr[1] === 1) ||
				(rightElement === 3 && exposureElementsArr[2] === 1)
			) {
				layers[1].map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(layer, "visibility", "visible");
					}
					return null;
				});
			} else {
				layers[1].map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(layer, "visibility", "none");
					}
					return null;
				});
			}

			// ------------------------------------------------------------Vulenerability Slide-Layer---------------------------------------------
			if (rightElement === 3) {
				if (map.current) {
					if (vulnerability === "Human Poverty Index") {
						map.current.setLayoutProperty("hpiData", "visibility", "visible");
					} else {
						map.current.setLayoutProperty("hpiData", "visibility", "none");
					}
					if (vulnerability === "Human Development Index") {
						map.current.setLayoutProperty("hdiData", "visibility", "visible");
					} else {
						map.current.setLayoutProperty("hdiData", "visibility", "none");
					}
				}
			} else {
				["hpiData", "hdiData"].map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(`${layer}`, "visibility", "none");
					}
					return null;
				});
			}

			// --------------------------------------------------------Damage and loss Layer---------------------------------------------
			if (rightElement === 1) {
				if (clickedHazardItem === "Flood Hazard" && clickedFatalityInfraDamage === "Fatality") {
					if (map.current) {
						map.current.setLayoutProperty("totalPeopleDeathFlood", "visibility", "visible");
					}
				} else {
					map.current.setLayoutProperty("totalPeopleDeathFlood", "visibility", "none");
				}

				if (
					clickedHazardItem === "Flood Hazard" &&
					clickedFatalityInfraDamage === "Infrastructure Damage"
				) {
					if (map.current) {
						map.current.setLayoutProperty("totalInfraDamageFlood", "visibility", "visible");
					}
				} else {
					map.current.setLayoutProperty("totalInfraDamageFlood", "visibility", "none");
				}
				if (clickedHazardItem === "Landslide Hazard" && clickedFatalityInfraDamage === "Fatality") {
					if (map.current) {
						map.current.setLayoutProperty("totalPeopleDeathLandslide", "visibility", "visible");
					}
				} else {
					map.current.setLayoutProperty("totalPeopleDeathLandslide", "visibility", "none");
				}
				if (
					clickedHazardItem === "Landslide Hazard" &&
					clickedFatalityInfraDamage === "Infrastructure Damage"
				) {
					if (map.current) {
						map.current.setLayoutProperty("totalInfraDamageLandslide", "visibility", "visible");
					}
				} else {
					map.current.setLayoutProperty("totalInfraDamageLandslide", "visibility", "none");
				}
			} else {
				damageLossArray.map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(`${layer}`, "visibility", "none");
					}
					return null;
				});
			}

			// -----------------------------------------------------Hazard Page-------------------------------------------------
			if ((rightElement === 4 || rightElement === 6) && hazardLegendClickedArr[0] === 1) {
				if (map.current) {
					layers[3].map((layer) => map.current.setLayoutProperty(layer, "visibility", "visible"));
					if (floodLayer) {
						map.current.setLayoutProperty(`raster-flood-${floodLayer}`, "visibility", "visible");
					}
				}
			} else {
				map.current.setLayoutProperty(`raster-flood-${floodLayer}`, "visibility", "none");
			}

			if (rightElement === 4 && hazardLegendClickedArr[2] === 1) {
				if (map.current) {
					map.current.setLayoutProperty("landslideLayer", "visibility", "visible");
				}
			} else {
				map.current.setLayoutProperty("landslideLayer", "visibility", "none");
			}

			if (rightElement === 4 && hazardLegendClickedArr[1] === 1) {
				if (map.current) {
					map.current.setLayoutProperty("inundationLayer", "visibility", "visible");
				}
			} else {
				map.current.setLayoutProperty("inundationLayer", "visibility", "none");
			}
			if ((rightElement === 4 || rightElement === 6) && earthquakeRisk === "Earthquake Risk") {
				if (map.current) {
					map.current.setLayoutProperty("earthquake-risk-score", "visibility", "visible");
				}
			} else {
				map.current.setLayoutProperty("earthquake-risk-score", "visibility", "none");
			}
			// ------------------------------------------------------------Climate Data Layer-----------------------------------------

			if (rightElement === 5 && climateDataType === "Temperature") {
				tempDataAccordingToYear.map((layer) => {
					if (layer === tempSelectedData) {
						if (map.current) {
							map.current.setLayoutProperty(`${layer}`, "visibility", "visible");
						}
					} else if (map.current) {
						map.current.setLayoutProperty(`${layer}`, "visibility", "none");
					}
					return null;
				});
			} else {
				tempDataAccordingToYear.map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(`${layer}`, "visibility", "none");
					}
					return null;
				});
			}

			if (rightElement === 5 && climateDataType === "Precipitation") {
				prepDataAccordingToYear.map((layer) => {
					if (layer === prepSelectedData) {
						if (map.current) {
							map.current.setLayoutProperty(`${layer}`, "visibility", "visible");
						}
					} else if (map.current) {
						map.current.setLayoutProperty(`${layer}`, "visibility", "none");
					}
					return null;
				});
			} else {
				prepDataAccordingToYear.map((layer) => {
					if (map.current) {
						map.current.setLayoutProperty(`${layer}`, "visibility", "none");
					}
					return null;
				});
			}

			if (clickedHazardItem === "Flood Hazard" && clickedFatalityInfraDamage === "Fatality") {
				setlossLegendsData(color1);
			}
			if (
				clickedHazardItem === "Flood Hazard" &&
				clickedFatalityInfraDamage === "Infrastructure Damage"
			) {
				setlossLegendsData(color2);
			}
			if (clickedHazardItem === "Landslide Hazard" && clickedFatalityInfraDamage === "Fatality") {
				setlossLegendsData(color3);
			}
			if (
				clickedHazardItem === "Landslide Hazard" &&
				clickedFatalityInfraDamage === "Infrastructure Damage"
			) {
				setlossLegendsData(color4);
			}

			if (rightElement === 7) {
				if (map.current) {
					map.current.setLayoutProperty("contacts-layer", "visibility", "visible");
					map.current.setLayoutProperty("contacts-cluster-count", "visibility", "visible");
					map.current.setLayoutProperty("contacts-unclustered-point", "visibility", "visible");
				}
			} else {
				map.current.setLayoutProperty("contacts-layer", "visibility", "none");
				map.current.setLayoutProperty("contacts-cluster-count", "visibility", "none");
				map.current.setLayoutProperty("contacts-unclustered-point", "visibility", "none");
			}
		}
	}, [
		rightElement,
		ciCategoryCritical,
		legendElement,
		layers,
		exposureElementsArr,
		clickedArr,
		floodLayer,
		hazardLegendClickedArr,
		tempSelectedData,
		prepSelectedData,
		climateDataType,
		vulnerability,
		clickedHazardItem,
		clickedFatalityInfraDamage,
	]);

	return (
		<div style={mapCSS} ref={mapContainerRef}>
			{rightElement === 1 && (
				<div className={styles.mainLegendDiv}>
					<p style={{ color: "white", margin: "0" }}>
						{clickedFatalityInfraDamage === "Fatality"
							? "People Death"
							: "Infrastructural Damage Count"}{" "}
					</p>
					<div className={styles.scale}>
						{lossLegendsData.map((c, i) => {
							if (i % 2 === 0) {
								return null;
							}

							return (
								<div className={styles.scaleElement} key={c}>
									<div
										key={c}
										className={styles.colorUnit}
										style={{
											// width: colorUnitWidth,
											backgroundColor: c,
										}}
									/>
									<div className={styles.value}>{Math.round(lossLegendsData[i - 1])}</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{rightElement === 5 && (
				<div className={styles.mainLegendDiv}>
					<p style={{ color: "white", margin: "0 0 3px 0", fontSize: "14px" }}>
						{climateDataType === "Temperature" ? "Temperature (°C) " : "Precipitation (mm/year) "}
					</p>
					<div className={styles.scale}>
						{(climateDataType === "Temperature" ? colorForTemp : colorForPrep).map((c, i) => {
							if (i % 2 === 0) {
								return null;
							}

							return (
								<div className={styles.scaleElement} key={c}>
									<div
										key={c}
										className={styles.colorUnit}
										style={{
											// width: colorUnitWidth,
											backgroundColor: c,
										}}
									/>
									<div className={styles.value}>
										{climateDataType === "Temperature"
											? colorForTemp[i - 1].toFixed(2)
											: Math.round(colorForPrep[i - 1])}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{rightElement === 3 && (
				<div className={styles.mainLegendDiv}>
					<p style={{ color: "white", margin: "0 0 3px 0", fontSize: "14px" }}>
						{vulnerability === "Human Development Index"
							? "Human Development Index"
							: "Human Poverty Index"}
					</p>
					<div className={styles.scale}>
						{(vulnerability === "Human Development Index"
							? ["#c73c32", "#e9bf8c", "#fff5d8"]
							: vulColors.reverse()
						).map((c, i) => (
							<div className={styles.scaleElement} key={c}>
								<div
									key={c}
									className={styles.colorUnit}
									style={{
										// width: colorUnitWidth,
										backgroundColor: c,
									}}
								/>
								<div className={styles.value}>
									{vulnerability === "Human Development Index"
										? [0.4, 0.5, 0.6][i]
										: colorForhpi.filter((item) => typeof item === "number")[i]}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
			{(rightElement === 4 || rightElement === 6) && earthquakeRisk === "Earthquake Risk" && (
				<div className={styles.mainLegendDiv}>
					<p style={{ color: "white", margin: "0 0 3px 0", fontSize: "14px" }}>
						Earthquake Risk Score
					</p>
					<div className={styles.scale}>
						{colorForEarthquake.map((c, i) => {
							if (i % 2 === 0) {
								return null;
							}

							return (
								<div className={styles.scaleElement} key={c}>
									<div
										key={c}
										className={styles.colorUnit}
										style={{
											// width: colorUnitWidth,
											backgroundColor: c,
										}}
									/>
									<div className={styles.value}>{colorForEarthquake[i - 1].toFixed(2)}</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{(rightElement === 4 || rightElement === 6) && hazardLegendClickedArr[0] === 1 && (
				<>
					<p className={_cs(styles.sliderLabel)}>Flood Layer Opacity</p>
					<input
						onChange={(e) => handleFloodChange(e, "flood")}
						id="slider"
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={String(opacityFlood)}
						className={styles.slider}
					/>
					<p className={_cs(styles.opacityLevel)}>
						<span>0</span>
						<span>0.5</span>
						<span>1</span>
					</p>
					<FloodDepthLegend />
				</>
			)}

			{(rightElement === 4 || rightElement === 6) && hazardLegendClickedArr[2] === 1 && (
				<>
					<p className={_cs(styles.sliderLabel2)}>Landslide Layer Opacity</p>
					<input
						onChange={(e) => handleFloodChange(e, "sus")}
						id="slider"
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={String(opacitySus)}
						className={styles.slider}
					/>
					<p className={_cs(styles.opacityLevel)}>
						<span>0</span>
						<span>0.5</span>
						<span>1</span>
					</p>
					<LandSlideSusLegend layer="sus" />
				</>
			)}
		</div>
	);
};
export default connect(mapStateToProps)(MultiHazardMap);
