import React from "react";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import { mapSources } from "#constants";
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
} from "#selectors";
import { getWardFilter } from "#utils/domain";
import { drawStyle } from "../Data/mapbox";
import RiskScores from "../Data/riskScores";

import TimelineSlider from "./TimelineSlider";

const hoveredWardId = null;

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

const { VITE_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = import.meta.env;
if (TOKEN) {
	mapboxgl.accessToken = TOKEN;
}

const epochs = [2014, 2015, 2016, 2017, 2018, 2019, 2020];

const riskExpression = [
	"interpolate",
	["linear"],
	["feature-state", "value"],
	1,
	"rgb(230,245,152)",
	2,
	"rgb(230,245,152)",
	3,
	"rgb(245,173,96)",
	4,
	"rgb(213,62,79)",
	5,
	"rgb(254,251,191)",
	6,
	"rgb(230,245,152)",
	7,
	"rgb(171,221,196)",
	8,
	"rgb(254,251,191)",
	9,
	"rgb(252,224,139)",
];

const ciRef = {
	health: "Hospital",
	finance: "Financial Institution",
	education: "Education Institution",
};
const draw = new MapboxDraw({
	displayControlsDefault: false,
	userProperties: true,
	controls: {
		polygon: true,
		trash: true,
	},
	styles: drawStyle,
	defaultMode: "draw_polygon",
});

const { scores } = RiskScores;
const landuseLayers = [
	"bahrabiseForest",
	"bahrabiseBuildings",
	"bahrabiseBridge",
	"bahrabiseRoads",
	"bahrabiseFarmland",
	// 'bahrabiseFill',
	"bahrabiseStone",
	"bahrabiseShingle",
	"bahrabiseScree",
	"bahrabiseScrub",
	// 'bahrabiseContourVals',
	// 'bahrabiseContourLines',
	// 'bahrabiseHillshadeLocal',
];
class FloodHistoryMap extends React.Component {
	public constructor(props) {
		super(props);

		this.state = {
			lng: 85.898603799247,
			lat: 27.844366075661792,
			zoom: 11.4,
			incidentYear: "9",
			playState: false,
			geoArr: {},
			resourceArr: [],
		};
	}

	public componentDidMount() {
		const { lng, lat, zoom } = this.state;

		const { cidata: ci, wards } = this.props;

		mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: import.meta.env.VITE_APP_VIZRISK_BAHRABISE_LANDSLIDE,
			center: [lng, lat],
			zoom,
			minZoom: 2,
			maxZoom: 22,
		});

		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false,
			className: "popup",
		});

		this.map.addControl(new mapboxgl.ScaleControl(), "bottom-left");

		this.map.addControl(new mapboxgl.NavigationControl(), "top-right");

		// this.map.addControl(new MapboxLegendControl({},
		// { reverseOrder: false }), 'bottom-right');
		const mapping = wards
			.filter((item) => item.municipality === 23002)
			.map((item) => ({
				...item,
				value: Number(item.title),
			}));
		const { getIdle } = this.props;
		this.map.on("idle", (e) => {
			getIdle(true);
		});
		this.map.on("style.load", () => {
			this.map.setLayoutProperty("bahrabiseWardOutline", "visibility", "visible");
			this.map.setLayoutProperty("bahrabiseWardText", "visibility", "visible");
			this.map.setLayoutProperty("bahrabiseForest", "visibility", "none");
			this.map.setLayoutProperty("bahrabiseRoads", "visibility", "none");
			this.map.setLayoutProperty("bahrabiseScrub", "visibility", "none");
			this.map.setLayoutProperty("bahrabiseScree", "visibility", "none");
			this.map.setLayoutProperty("bahrabiseShingle", "visibility", "none");
			this.map.setLayoutProperty("bahrabiseStone", "visibility", "none");
			this.map.setLayoutProperty("bahrabiseFarmland", "visibility", "none");
			this.map.addSource("hillshadeBahrabiseLocal", {
				type: "raster",
				tiles: [this.getHillshadeLayer()],
				tileSize: 256,
			});

			this.map.addLayer({
				id: "bahrabiseHillshadeLocal",
				type: "raster",
				source: "hillshadeBahrabiseLocal",
				paint: {
					"raster-opacity": 0.25,
				},
			});

			this.map.addSource("suseptibilityBahrabise", {
				type: "raster",
				tiles: [this.getSusceptibilityLayer()],
				tileSize: 256,
			});

			this.map.addLayer({
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

			const features = this.props.bahrabiseLandSlide.map((item) => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: item.position,
				},
				properties: {
					date: item.date,
					severity: this.getSeverityScore(item),
				},
			}));

			const geoData = {
				type: "FeatureCollection",
				features,
			};
			this.map.addSource("incidents", {
				type: "geojson",
				data: geoData,
			});
			this.map.addLayer({
				id: "incidents-layer",
				type: "circle",
				source: "incidents",
				layout: {},
				paint: {
					"circle-color": "#923f3f",
					"circle-radius": ["get", "severity"],
				},
			});

			this.map.addSource("vizrisk-fills", {
				type: "vector",
				url: mapSources.nepal.url,
			});

			this.map.addLayer({
				id: "risk-fill-local",
				source: "vizrisk-fills",
				"source-layer": mapSources.nepal.layers.ward,
				type: "fill",
				paint: {
					"fill-color": riskExpression,
					"fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0, 1],
				},
				layout: {
					visibility: "none",
				},
				filter: getWardFilter(3, 24, 23002, wards),
			});

			mapping.forEach((attribute) => {
				this.map.setFeatureState(
					{
						id: attribute.id,
						source: "vizrisk-fills",
						sourceLayer: mapSources.nepal.layers.ward,
					},
					{ value: attribute.value }
				);
			});

			this.map.on("mousemove", "risk-fill-local", (e) => {
				if (e.features.length > 0) {
					this.map.getCanvas().style.cursor = "pointer";

					const { lngLat } = e;
					const coordinates = [lngLat.lng, lngLat.lat];

					const wardno = e.features[0].properties.title;
					const riskScore = scores.filter((s) => s.ward === wardno)[0].score;
					popup
						.setLngLat(coordinates)
						.setHTML(
							`<div style="padding: 5px;border-radius: 5px">
                                <p> Ward No.: ${wardno} </p>
                                <p> Risk: ${riskScore} </p>
                            </div>
                            `
						)
						.addTo(this.map);
				}
			});

			this.map.on("mouseleave", "risk-fill-local", () => {
				this.map.getCanvas().style.cursor = "";
				popup.remove();
			});

			if (ci.length > 0) {
				// const this.map = this.mapRef.current.getthis.Map();
				const cifeatures = ci.map((f) => ({
					properties: {
						resourceType: f.resourceType,
						title: f.title,
						id: f.id,
					},
					geometry: f.point,
				}));
				const geoArr = {
					type: "FeatureCollection",
					features: cifeatures,
				};
				const resourceArr = [...new Set(ci.map((c) => c.resourceType))];
				this.setState({ resourceArr });
				this.setState({ geoArr });
				resourceArr.map((layer) => {
					this.map.addSource(`${layer}`, {
						type: "geojson",
						data: this.getGeoJSON(layer, geoArr),
						cluster: true,
						clusterRadius: 50,
					});
					this.map.addLayer({
						id: `clusters-ci-${layer}`,
						type: "circle",
						source: `${layer}`,
						filter: ["has", "point_count"],
						paint: {
							"circle-color": ["step", ["get", "point_count"], "#a4ac5e", 100, "#a4ac5e"],
							"circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
						},
						layout: {
							visibility: "none",
						},
					});

					this.map.addLayer({
						id: `unclustered-ci-${layer}`,
						type: "symbol",
						source: `${layer}`,
						filter: ["!", ["has", "point_count"]],
						layout: {
							"icon-image": ["get", "resourceType"],
							"icon-size": 0.3,
							"icon-anchor": "bottom",
							visibility: "none",
						},
					});
					this.map.addLayer({
						id: `clusters-count-ci-${layer}`,
						type: "symbol",
						source: `${layer}`,
						layout: {
							"text-field": "{point_count_abbreviated}",
							"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
							"text-size": 12,
							visibility: "none",
						},
					});
					this.map.on("mousemove", `unclustered-ci-${layer}`, (e) => {
						if (e) {
							this.map.getCanvas().style.cursor = "pointer";
							const { lngLat } = e;
							const coordinates = [lngLat.lng, lngLat.lat];
							const ciName = e.features[0].properties.title;
							popup
								.setLngLat(coordinates)
								.setHTML(
									`<div style="padding: 5px;border-radius: 5px">
                            <p>${ciName}</p>
                        </div>
                        `
								)
								.addTo(this.map);
						}
					});
					this.map.on("mouseleave", `unclustered-ci-${layer}`, () => {
						this.map.getCanvas().style.cursor = "";
						popup.remove();
					});
					return null;
				});
			}
			// this.handlePlayPause();
			this.map.moveLayer("suseptibility-bahrabise", "bahrabiseFarmland");
			this.map.moveLayer("risk-fill-local", "bahrabiseWardOutline");
		});
	}

	public componentDidUpdate(prevProps) {
		const {
			yearClicked,
			currentPage,
			landslideYear,
			cidata,
			chartReset,
			hideCI,
			criticalElement,
			polygonResponse,
			hideOSMLayers,
		} = this.props;
		const { resourceArr } = this.state;
		if (criticalElement !== prevProps.criticalElement) {
			this.resetClusters();
			const layer = criticalElement;
			if (layer === "all") {
				resourceArr.map((item) => {
					this.map.setLayoutProperty(`unclustered-ci-${item}`, "visibility", "visible");
					this.map.setLayoutProperty(`clusters-ci-${item}`, "visibility", "visible");
					this.map.setLayoutProperty(`clusters-count-ci-${item}`, "visibility", "visible");
					return null;
				});
			} else if (layer === "health") {
				this.map.setLayoutProperty("clusters-ci-health", "visibility", "visible");
				this.map.setLayoutProperty("clusters-count-ci-health", "visibility", "visible");
				this.map.setLayoutProperty("unclustered-ci-health", "visibility", "visible");
			} else if (layer === "finance") {
				this.map.setLayoutProperty("unclustered-ci-finance", "visibility", "visible");
				this.map.setLayoutProperty("clusters-count-ci-finance", "visibility", "visible");
				this.map.setLayoutProperty("clusters-ci-finance", "visibility", "visible");
			} else if (layer === "education") {
				this.map.setLayoutProperty("unclustered-ci-education", "visibility", "visible");
				this.map.setLayoutProperty("clusters-count-ci-education", "visibility", "visible");
				this.map.setLayoutProperty("clusters-ci-education", "visibility", "visible");
			}
		}

		if (currentPage === 6 && prevProps.currentPage === 7) {
			this.map.removeControl(draw);
		}

		if (currentPage === 7 && prevProps.currentPage === 8) {
			this.map.removeControl(draw);
		}

		if (currentPage === 6) {
			if (this.state.playState) {
				this.handleStateChange();
			}
		}

		if (currentPage === 7 || currentPage === 8) {
			if (yearClicked !== prevProps.yearClicked) {
				this.resetPolyLayers();
				landslideYear.map((layer) => {
					this.map.setLayoutProperty(`${layer}`, "visibility", "visible");
					return null;
				});
				this.state.resourceArr.map((layer) => null);
			}
		}
		if (currentPage !== prevProps.currentPage && currentPage === 6) {
			this.map.setLayoutProperty("incidents-layer", "visibility", "visible");
		}
		if (currentPage !== prevProps.currentPage && currentPage === 7) {
			const popup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false,
				className: "popup",
			});

			this.map.setLayoutProperty("incidents-layer", "visibility", "none");
			this.map.setLayoutProperty("suseptibility-bahrabise", "visibility", "none");

			this.generateYearsArr().map((layer) => {
				this.map.setLayoutProperty(`${layer}`, "visibility", "visible");
				return null;
			});
			landuseLayers.map((lyr) => {
				this.map.setLayoutProperty(lyr, "visibility", "visible");
				return null;
			});
			const resetArea = () => {
				this.props.handlechartReset(!chartReset);
			};
			epochs.map((ci) =>
				this.map.on("mouseenter", `${ci}`, (e) => {
					if (e) {
						const { lngLat } = e;
						const coordinates = [lngLat.lng, lngLat.lat];
						const perimeter = e.features[0].properties.Perim_m;
						const area = e.features[0].properties.Area_m2;
						popup
							.setLngLat(coordinates)
							.setHTML(
								`<div style="padding: 5px;border-radius: 5px">
                    <p>Perimeter: ${perimeter} m</p>
                    <p>Area: ${area} sq m</p>
                </div>
                `
							)
							.addTo(this.map);
					}
				})
			);
			epochs.map((ci) =>
				this.map.on("mouseleave", `${ci}`, () => {
					this.map.getCanvas().style.cursor = "";
					popup.remove();
				})
			);
			const updateArea = (e) => {
				const { handleDrawSelectedData } = this.props;
				const arr = cidata.map((item) => item.point.coordinates);
				const points = turf.points(arr);

				const polyArr = polygonResponse.features.map((pItem) => pItem.geometry.coordinates);
				const polyPoints = turf.points(polyArr);

				const datad = draw.getAll();
				const dataArr = datad.features[0].geometry.coordinates;

				const searchWithin = turf.multiPolygon([dataArr], {});
				const ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
				const polyptsWithin = turf.pointsWithinPolygon(polyPoints, searchWithin);
				const result = [];
				const n = ptsWithin.features.map((i) => {
					result.push({
						geometry: i.geometry,
						hazardTitle: ciRef[this.getTitleFromLatLng(i, cidata)],
					});
					return null;
				});
				const m = polyptsWithin.features.map((j) => {
					result.push({
						geometry: j.geometry,
						landslideYear: this.getYearfromLatLng(j, polygonResponse),
					});
					return null;
				});
				handleDrawSelectedData(result, dataArr);
				// this.map.fitBounds(bbox, {
				//     padding: 20,
				// });
			};

			this.map.addControl(draw, "top-right");
			this.map.on("draw.modechange", (e) => {
				const data = draw.getAll();
				// if (draw.getMode() === 'draw_polygon') {
				//     const pids = [];
				//     this.props.handleDrawResetData(true);
				//     // ID of the added template empty feature
				//     const lid = data.features[data.features.length - 1].id;

				//     data.features.forEach((f) => {
				//         if (f.geometry.type === 'Polygon' && f.id !== lid) {
				//             pids.push(f.id);
				//         }
				//     });
				//     draw.delete(pids);
				// }
			});

			this.map.on("draw.delete", resetArea);
			this.map.on("draw.create", updateArea);
			this.map.on("draw.update", updateArea);
		}

		if (currentPage !== prevProps.currentPage && currentPage === 8) {
			this.map.setLayoutProperty("suseptibility-bahrabise", "visibility", "visible");
			this.map.setLayoutProperty("risk-fill-local", "visibility", "none");
			landslideYear.map((layer) => {
				this.map.setLayoutProperty(`${layer}`, "visibility", "none");
				return null;
			});
			landuseLayers.map((lyr) => {
				this.map.setLayoutProperty(lyr, "visibility", "none");
				return null;
			});
		}

		if (currentPage !== prevProps.currentPage && currentPage === 9) {
			this.map.setLayoutProperty("risk-fill-local", "visibility", "visible");
			this.map.moveLayer("risk-fill-local", "bahrabiseBuildings");

			this.map.setLayoutProperty("bahrabiseWardOutline", "visibility", "visible");
			this.map.setLayoutProperty("bahrabiseWardText", "visibility", "visible");
			this.map.setLayoutProperty("bahrabiseWardText", "visibility", "visible");
			this.map.setLayoutProperty("suseptibility-bahrabise", "visibility", "none");
		}

		if (hideCI !== prevProps.hideCI) {
			if (!hideCI) {
				this.state.resourceArr.map((layer) => {
					this.map.setLayoutProperty(`clusters-ci-${layer}`, "visibility", "visible");
					this.map.setLayoutProperty(`unclustered-ci-${layer}`, "visibility", "visible");
					this.map.setLayoutProperty(`clusters-count-ci-${layer}`, "visibility", "visible");

					return null;
				});
			} else {
				this.state.resourceArr.map((layer) => {
					this.map.setLayoutProperty(`clusters-ci-${layer}`, "visibility", "none");
					this.map.setLayoutProperty(`unclustered-ci-${layer}`, "visibility", "none");
					this.map.setLayoutProperty(`clusters-count-ci-${layer}`, "visibility", "none");

					return null;
				});
			}
		}

		if (hideOSMLayers !== prevProps.hideOSMLayers) {
			if (!hideOSMLayers) {
				landuseLayers.map((lyr) => {
					this.map.setLayoutProperty(lyr, "visibility", "visible");
					return null;
				});
				this.map.setLayoutProperty("bahrabiseHillshadeLocal", "visibility", "visible");
				this.map.setLayoutProperty("bahrabiseWardText", "visibility", "visible");
				this.map.setLayoutProperty("bahrabiseWardOutline", "visibility", "visible");
				this.map.setLayoutProperty("bahrabiseTitle", "visibility", "visible");
				this.generateYearsArr().map((layer) => null);
			} else {
				landuseLayers.map((lyr) => {
					this.map.setLayoutProperty(lyr, "visibility", "none");
					return null;
				});
			}
		}
	}

	public componentWillUnmount() {
		const { currentPage } = this.props;

		this.map.remove();
		if (currentPage === 6) {
			clearInterval(this.interval);
		}
	}

	public getSusceptibilityLayer = () =>
		[
			`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
			"&version=1.1.0",
			"&service=WMS",
			"&request=GetMap",
			"&layers=Bipad:barhabise_durham_susceptibility",
			"&tiled=true",
			"&width=256",
			"&height=256",
			"&srs=EPSG:3857",
			"&bbox={bbox-epsg-3857}",
			"&transparent=true",
			"&format=image/png",
		].join("");

	public getTitleFromLatLng = (featureObject, cidata) => {
		const latToCompare = featureObject.geometry.coordinates[1];
		const lngToCompare = featureObject.geometry.coordinates[0];
		const hT = cidata.filter(
			(fC) => fC.point.coordinates[0] === lngToCompare && fC.point.coordinates[1] === latToCompare
		)[0];

		if (hT) {
			return hT.resourceType;
		}
		return [];
	};

	public getYearfromLatLng = (featureObject, polyData) => {
		const latToCompare = featureObject.geometry.coordinates[1];
		const lngToCompare = featureObject.geometry.coordinates[0];
		const hT = polyData.features.filter(
			(fC) =>
				fC.geometry.coordinates[0] === lngToCompare && fC.geometry.coordinates[1] === latToCompare
		)[0];

		if (hT) {
			const e = hT.properties.Epoch;
			return e.substr(e.length - 4);
		}
		return "nodata";
	};

	public getObjFromLatLng = (lat, lng, polyData) => {
		const hT = polyData.features.filter(
			(fC) => fC.geometry.coordinates[0] === lng && fC.geometry.coordinates[1] === lat
		)[0];

		if (hT) {
			return hT;
		}
		return "nodata";
	};

	public resetClusters = () => {
		this.state.resourceArr.map((layer) => {
			this.map.setLayoutProperty(`unclustered-ci-${layer}`, "visibility", "none");
			this.map.setLayoutProperty(`clusters-ci-${layer}`, "visibility", "none");
			this.map.setLayoutProperty(`clusters-count-ci-${layer}`, "visibility", "none");

			return null;
		});
	};

	public generateYearsArr = () => {
		// const max = new Date().getFullYear() ;
		const max = 2020;
		const min = max - 6;
		const years = [];

		for (let i = max; i >= min; i--) {
			years.push(i);
		}

		return years;
	};

	public resetPolyLayers = () => {
		this.generateYearsArr().map((l) => {
			this.map.setLayoutProperty(`${l}`, "visibility", "none");
			return null;
		});
	};

	public getGeoJSON = (filterBy: string, data: any) => {
		const geoObj = {};
		geoObj.type = "FeatureCollection";
		geoObj.name = filterBy;
		geoObj.features = [];
		const d = data.features.filter((item) => item.properties.resourceType === filterBy);
		geoObj.features.push(...d);
		return geoObj;
	};

	public getRasterLayer = () =>
		[
			`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
			"&version=1.1.1",
			"&service=WMS",
			"&request=GetMap",
			"&layers=Bipad:Panchpokhari_hillshade",
			"&tiled=true",
			"&width=256",
			"&height=256",
			"&srs=EPSG:3857",
			"&bbox={bbox-epsg-3857}",
			"&transparent=true",
			"&format=image/png",
		].join("");

	public handlePlayPause = () => {
		this.setState((prevState) => ({ playState: !prevState.playState }));
		if (this.state.playState) {
			clearInterval(this.interval);
		} else {
			this.interval = setInterval(() => {
				this.setState((prevState) => {
					if (Number(prevState.incidentYear) < 10) {
						return { incidentYear: String(Number(prevState.incidentYear) + 1) };
					}
					return { incidentYear: "0" };
				});
			}, 1000);
		}
	};

	public filterOnMap = (val) => {
		const yearInt = new Date(`${2011 + Number(val)}-01-01`).getTime();
		const nextYear = new Date(`${2011 + Number(val) + 1}-01-01`).getTime();
		let filters = [];
		// if (this.props.clickedItem === 'all') {
		filters = ["all", [">", "date", yearInt], ["<", "date", nextYear]];
		// }

		// else {
		//     filters = ['all',
		//         ['>', 'incidentOn', yearInt],
		//         ['<', 'incidentOn', nextYear],
		//         ['==', 'hazardTitle', this.props.clickedItem]];
		// }
		// const hazardTitle = [...new Set(this.props.incidentList.features.map(
		//     item => item.properties.hazardTitle,
		// ))];
		const mapLayer = this.map.getLayer("bahrabiseBuildings");

		if (typeof mapLayer !== "undefined") {
			// hazardTitle.map((layer) => {
			this.map.setFilter("incidents-layer", filters);
			// return null;
			// });
		}
	};

	public handleInputChange = (e) => {
		const val = e.target.value;
		this.props.handleIncidentChange(val);
		this.filterOnMap(val);
		this.setState({ incidentYear: e.target.value });
	};

	public handleStateChange = () => {
		const val = this.state.incidentYear;
		this.props.handleIncidentChange(val);
		this.filterOnMap(val);
		// this.setState({ incidentYear: e.target.value });
	};

	public getSeverityScore = (incidentData) => {
		const pD = incidentData.loss.peopleDeathCount;
		if (pD === 0) {
			return 5;
		}
		if (pD > 0 && pD < 10) {
			return 10;
		}
		if (pD >= 10 && pD < 100) {
			return 15;
		}
		return 20;
	};

	public getHillshadeLayer = () =>
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
		].join("");

	public render() {
		const mapStyle = {
			position: "absolute",
			width: "70%",
			left: "calc(30% - 60px)",
			top: 0,
			// bottom: 0,
			height: "100vh",
		};

		return (
			<div>
				<div
					style={mapStyle}
					ref={(el) => {
						this.mapContainer = el;
					}}
				/>
				{this.props.currentPage === 6 && (
					<TimelineSlider
						onChange={this.handleInputChange}
						id="slider"
						type="range"
						min="0"
						max="10"
						step="1"
						value={this.state.incidentYear}
						playState={this.state.playState}
						onPlayBtnClick={this.handlePlayPause}
					/>
				)}
			</div>
		);
	}
}
export default connect(mapStateToProps)(FloodHistoryMap);
