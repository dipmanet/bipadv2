import React from "react";
import { MapBounds, MapSource, MapLayer } from "#re-map";
import { mapSources, mapStyles } from "#constants";

// Define types for bounds and styles
type Bounds = [number, number, number, number]; // [west, south, east, north]
interface Styles {
	[key: string]: any; // Replace with actual style type if known
}

interface ZoomMapProps {
	bounds: Bounds;
	boundsPadding?: number | object;
	sourceKey?: string;
	currentStyles?: Styles; // From connectWithStyles
	updatedStyles?: Styles; // From connectWithStyles
}

const ZoomMap: React.FC<ZoomMapProps> = ({
	bounds,
	boundsPadding,
	sourceKey = "country",
	currentStyles,
	updatedStyles,
}) => {
	return (
		<>
			<MapBounds bounds={bounds} padding={boundsPadding} />
			<MapSource
				sourceKey={`${sourceKey}-zoom-outlines`}
				sourceOptions={{
					type: "vector",
					url: mapSources.nepal.url,
				}}>
				<MapLayer
					layerKey="ward-outline"
					layerOptions={{
						"source-layer": mapSources.nepal.layers.ward,
						type: "line",
						paint: mapStyles.ward.outline,
						minzoom: 9,
					}}
				/>
				<MapLayer
					layerKey="municipality-outline"
					layerOptions={{
						"source-layer": mapSources.nepal.layers.municipality,
						type: "line",
						paint: mapStyles.municipality.outline,
						minzoom: 8,
					}}
				/>
				<MapLayer
					layerKey="district-outline"
					layerOptions={{
						"source-layer": mapSources.nepal.layers.district,
						type: "line",
						paint: mapStyles.district.outline,
						minzoom: 6,
					}}
				/>
				<MapLayer
					layerKey="province-outline"
					layerOptions={{
						"source-layer": mapSources.nepal.layers.province,
						type: "line",
						paint: mapStyles.province.outline,
					}}
				/>
			</MapSource>
			<MapSource
				sourceKey={`${sourceKey}-label`}
				sourceOptions={{
					type: "vector",
					url: mapSources.nepalCentroid.url,
				}}>
				<MapLayer
					layerKey="province-label"
					layerOptions={{
						"source-layer": mapSources.nepalCentroid.layers.province,
						type: "symbol",
						paint: mapStyles.provinceLabel.paint,
						layout: mapStyles.provinceLabel.layout,
					}}
				/>
				<MapLayer
					layerKey="district-label"
					layerOptions={{
						"source-layer": mapSources.nepalCentroid.layers.district,
						type: "symbol",
						paint: mapStyles.districtLabel.paint,
						layout: mapStyles.districtLabel.layout,
						minzoom: 6,
					}}
				/>
				<MapLayer
					layerKey="municipality-label"
					layerOptions={{
						"source-layer": mapSources.nepalCentroid.layers.municipality,
						type: "symbol",
						paint: mapStyles.municipalityLabel.paint,
						layout: mapStyles.municipalityLabel.layout,
						minzoom: 8,
					}}
				/>
				<MapLayer
					layerKey="ward-label"
					layerOptions={{
						"source-layer": mapSources.nepalCentroid.layers.ward,
						type: "symbol",
						paint: mapStyles.wardLabel.paint,
						layout: mapStyles.wardLabel.layout,
						minzoom: 9,
					}}
				/>
			</MapSource>
		</>
	);
};

export default ZoomMap;
