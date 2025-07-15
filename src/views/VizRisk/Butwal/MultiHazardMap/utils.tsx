// eslint-disable-next-line import/prefer-default-export
export const getFloodRasterLayer = (layerName: string) =>
	[
		`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
		"&version=1.1.1",
		"&service=WMS",
		"&request=GetMap",
		`&layers=Bipad:${layerName}`,
		"&tiled=true",
		"&width=256",
		"&height=256",
		"&srs=EPSG:3857",
		"&bbox={bbox-epsg-3857}",
		"&transparent=true",
		"&format=image/png",
	].join("");

export const getCommonRasterLayer = (layer: string) =>
	[
		`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
		"&version=1.1.1",
		"&service=WMS",
		"&request=GetMap",
		`&layers=Bipad:${layer}`,
		"&tiled=true",
		"&width=256",
		"&height=256",
		"&srs=EPSG:3857",
		"&bbox={bbox-epsg-3857}",
		"&transparent=true",
		"&format=image/png",
	].join("");

export const getGeoJSONPH = (filterBy: string, data: any) => {
	const geoObj = {};
	geoObj.type = "FeatureCollection";
	geoObj.name = filterBy;
	geoObj.features = [];
	const d = data.features.filter((item) => item.properties.Type === filterBy);
	geoObj.features.push(...d);
	return geoObj;
};

export const drawStyles = [
	{
		id: "gl-draw-polygon-fill-inactive",
		type: "fill",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "Polygon"],
			["!=", "mode", "static"],
		],
		paint: {
			"fill-color": "#3bb2d0",
			"fill-outline-color": "#3bb2d0",
			"fill-opacity": 0.1,
		},
	},
	{
		id: "gl-draw-polygon-fill-active",
		type: "fill",
		filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
		paint: {
			"fill-color": "#fbb03b",
			"fill-outline-color": "#fbb03b",
			"fill-opacity": 0.1,
		},
	},
	{
		id: "gl-draw-polygon-midpoint",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
		paint: {
			"circle-radius": 3,
			"circle-color": "#fbb03b",
		},
	},
	{
		id: "gl-draw-polygon-stroke-inactive",
		type: "line",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "Polygon"],
			["!=", "mode", "static"],
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#3bb2d0",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-polygon-stroke-active",
		type: "line",
		filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#fbb03b",
			"line-dasharray": [0.2, 2],
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-line-inactive",
		type: "line",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "LineString"],
			["!=", "mode", "static"],
		],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#3bb2d0",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-line-active",
		type: "line",
		filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#fbb03b",
			"line-dasharray": [0.2, 2],
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
		type: "circle",
		filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
		paint: {
			"circle-radius": 5,
			"circle-color": "#fff",
		},
	},
	{
		id: "gl-draw-polygon-and-line-vertex-inactive",
		type: "circle",
		filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
		paint: {
			"circle-radius": 3,
			"circle-color": "#fbb03b",
		},
	},
	{
		id: "gl-draw-point-point-stroke-inactive",
		type: "circle",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "Point"],
			["==", "meta", "feature"],
			["!=", "mode", "static"],
		],
		paint: {
			"circle-radius": 5,
			"circle-opacity": 1,
			"circle-color": "#fff",
		},
	},
	{
		id: "gl-draw-point-inactive",
		type: "circle",
		filter: [
			"all",
			["==", "active", "false"],
			["==", "$type", "Point"],
			["==", "meta", "feature"],
			["!=", "mode", "static"],
		],
		paint: {
			"circle-radius": 3,
			"circle-color": "#3bb2d0",
		},
	},
	{
		id: "gl-draw-point-stroke-active",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["==", "active", "true"], ["!=", "meta", "midpoint"]],
		paint: {
			"circle-radius": 7,
			"circle-color": "#fff",
		},
	},
	{
		id: "gl-draw-point-active",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"], ["==", "active", "true"]],
		paint: {
			"circle-radius": 5,
			"circle-color": "#fbb03b",
		},
	},
	{
		id: "gl-draw-polygon-fill-static",
		type: "fill",
		filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
		paint: {
			"fill-color": "#404040",
			"fill-outline-color": "#404040",
			"fill-opacity": 0.1,
		},
	},
	{
		id: "gl-draw-polygon-stroke-static",
		type: "line",
		filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#404040",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-line-static",
		type: "line",
		filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": "#404040",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-point-static",
		type: "circle",
		filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
		paint: {
			"circle-radius": 5,
			"circle-color": "#404040",
		},
	},

	{
		id: "gl-draw-polygon-color-picker",
		type: "fill",
		// filter: ['all', ['==', '$type', 'Polygon'],
		//     ['has', 'user_portColor'],
		// ],
		paint: {
			"fill-color": "#ff0000",
			"fill-outline-color": "#ffffff",
			"fill-opacity": 0.1,
		},
	},
	{
		id: "gl-draw-line-color-picker",
		type: "line",
		// filter: ['all', ['==', '$type', 'LineString'],
		//     ['has', 'user_portColor'],
		// ],
		paint: {
			"line-color": "#ffffff",
			"line-width": 2,
		},
	},
	{
		id: "gl-draw-point-color-picker",
		type: "circle",
		// filter: ['all', ['==', '$type', 'Point'],
		//     ['has', 'user_portColor'],
		// ],
		paint: {
			"circle-radius": 3,
			"circle-color": "#ffffff",
		},
	},
];

export const getTitleFromLatLng = (featureObject, cidata) => {
	const latToCompare = featureObject.geometry.coordinates[1];
	const lngToCompare = featureObject.geometry.coordinates[0];
	const hT = cidata.features.filter(
		(fC) =>
			fC.geometry.coordinates[0] === lngToCompare && fC.geometry.coordinates[1] === latToCompare
	)[0];

	if (hT.properties) {
		return hT.properties.Type;
	}
	return [];
};

export const buildingColor = [
	"case",
	["all", ["==", ["feature-state", "vuln"], -1]],
	"#000000",
	["all", [">=", ["feature-state", "vuln"], 50], ["<=", ["feature-state", "vuln"], 60]],
	"#c1805a",
	["all", [">", ["feature-state", "vuln"], 60]],
	"#af4042",
	["all", ["<", ["feature-state", "vuln"], 50]],
	"#afaf40",
	"#d5d3d3",
];

export const getSingularBuildingData = (osmID: number, buildingsData: object) => {
	if (osmID) {
		const d = buildingsData.filter((o) => o.osmId === Number(osmID));
		if (d.length > 0) {
			return d[0];
		}
	}
	return {};
};

export const getOSMidFromHouseId = (houseID: string, buildings: object[]) => {
	const osmId = buildings.filter((item) => Number(item.houseOwnerId) === Number(houseID));

	if (osmId.length > 0) {
		return osmId[0].osmId;
	}
	return null;
};

export const getHouseId = (id: string, buildings: object[]) => {
	const houseID = buildings.filter((item) => item.osmId === id);
	if (houseID.length > 0) {
		return `House Owner Id: ${houseID[0].houseOwnerId}`;
	}
	return "OSM Id missing";
};
