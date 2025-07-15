const key = import.meta.env.VITE_APP_MAPTILER_ACCESS_TOKEN;
const style = {
	version: 8,
	name: "Raster OSM",
	sources: {
		"raster-tiles": {
			type: "raster",
			tiles: [
				"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
				"https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
				"https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
			],
			tileSize: 256,
		},
	},
	sprite: "https://maputnik.github.io/osm-liberty/sprites/osm-liberty",
	glyphs: "mapbox://fonts/adityakhatri/{fontstack}/{range}.pbf",
	layers: [
		{
			id: "simple-tiles",
			type: "raster",
			source: "raster-tiles",
			minzoom: 0,
			maxzoom: 22,
		},
	],
	id: "raster-osm",
};
export default style;
