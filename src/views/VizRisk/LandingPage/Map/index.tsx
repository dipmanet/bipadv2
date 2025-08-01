import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";

import { AppState } from "#types";
import { mapSources, mapStyles } from "#constants";
import { hideMapLayers, showMapLayers } from "#views/VizRisk/RatnaNagar/utils";
import { provincesSelector, municipalitiesSelector } from "#selectors";
import { vzRiskMunicipalData, vzRiskProvinceData } from "../VzRiskData";

import styles from "./styles.module.scss";
import { checkIndicator, checkType, filterDataWithIndicator, vizRiskType } from "../utils";
import landingPageMapImages from "./mapImage";

const mapStateToProps = (state: AppState) => ({
	provinces: provincesSelector(state),
	municipalities: municipalitiesSelector(state),
});

const { VITE_APP_MAPBOX_ACCESS_TOKEN: TOKEN } = import.meta.env;

if (TOKEN) {
	mapboxgl.accessToken = TOKEN;
}
interface Props {
	vzLabel: string;
	provinces: any;
	municipalities: any;
	selctFieldCurrentValue: string;
	clickedVizrisk: string;
	setClickedVizrisk: React.Dispatch<React.SetStateAction<string>>;
	setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
	searchBbox: any;
}

let hoverId: number | undefined;

const Map = (props: Props) => {
	const mapContainerRef = useRef<React.MutableRefObject<HTMLElement | undefined>>();
	const updateMap = useRef<mapboxgl.Map>(null);

	const {
		vzLabel,
		provinces,
		municipalities,
		selctFieldCurrentValue,
		clickedVizrisk,
		setClickedVizrisk,
		setShowMenu,
		searchBbox,
	} = props;

	function noop() {}

	useEffect(() => {
		const { current: mapContainer } = mapContainerRef;
		if (!mapContainer) {
			return noop;
		}
		const provinceIdarray = vzRiskProvinceData.map((item) => item.id);

		const allData = provinces.map((data: any) => ({
			...data,
			value: !!provinceIdarray.includes(data.id),
			indicator: checkIndicator(vzRiskProvinceData, data),
		}));
		const array = vzRiskMunicipalData.map((item) => item.id);

		const allDataMunipal = municipalities.map((data: any) => ({
			...data,
			value: !!array.includes(data.id),
			indicator: checkIndicator(vzRiskMunicipalData, data),
		}));
		const allAvialableVizrisks = [...vzRiskMunicipalData, ...vzRiskProvinceData].map(
			(item) => item.id
		);

		const bounds = [
			[79.161987, 25.923467],
			[89.626465, 30.789037],
		];

		const landingPageMap = new mapboxgl.Map({
			container: mapContainer,
			// style: 'mapbox://styles/yilab/cl4npfhi4002x14l5jf8bn4d3',
			style: "mapbox://styles/yilab/ckr1mucvr7q3f1ao91578bqcq",
			logoPosition: "top-left",
			minZoom: 5,
			// makes initial map center to Nepal
			// center: {
			//     lng: 84.394226,
			//     lat: 28.384151,
			// },
			zoom: 7,
			// maxBounds: bounds,
		});

		if (updateMap) {
			updateMap.current = landingPageMap;
		}
		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false,
			className: "popup",
		});

		landingPageMapImages.forEach((img) => {
			landingPageMap.loadImage(img.url, (error: any, image: any) => {
				if (error) throw error;
				landingPageMap.addImage(img.name, image);
			});
		});

		landingPageMap.addControl(new mapboxgl.ScaleControl(), "bottom-left");

		landingPageMap.addControl(new mapboxgl.NavigationControl(), "top-right");

		landingPageMap.on("style.load", () => {
			landingPageMap.resize();
			landingPageMap.fitBounds(
				[
					[79.161987, 25.923467],
					[89.626465, 30.789037],
				],
				{ duration: 0 }
			);
			landingPageMap.addSource("base-outline", {
				type: "vector",
				url: mapSources.nepal.url,
			});
			allData.forEach((attribute: any) => {
				landingPageMap.setFeatureState(
					{
						id: attribute.id,
						source: "base-outline",
						sourceLayer: mapSources.nepal.layers.province,
					},
					{
						indicator: attribute.indicator,
						color: checkType(attribute.indicator),
					}
				);
			});

			// landingPageMap.addLayer({
			//     id: 'province-vizrisk',
			//     source: 'base-outline',
			//     'source-layer': mapSources.nepal.layers.province,
			//     type: 'fill',
			//     paint: {
			//         'fill-opacity': [
			//             'case',
			//             ['boolean', ['feature-state', 'hover'], false],
			//             0.8,
			//             1,
			//         ],
			//         'fill-color': ['feature-state', 'color'],
			//     },
			//     layout: {
			//         visibility: 'none',
			//     },
			// });

			// landingPageMap.addLayer({
			//     id: 'province-vizrisk-extrusion',
			//     source: 'base-outline',
			//     'source-layer': mapSources.nepal.layers.province,
			//     type: 'fill-extrusion',
			//     paint: {
			//         'fill-extrusion-color': ['feature-state', 'color'],

			//         'fill-extrusion-height':
			//             [
			//                 'interpolate', ['linear'], ['zoom'],
			//                 7, [
			//                     'case',
			//                     ['boolean', ['feature-state', 'hover'], false],
			//                     4000,
			//                     0,
			//                 ],

			//                 10, [
			//                     'case',
			//                     ['boolean', ['feature-state', 'hover'], false],
			//                     400,
			//                     0,
			//                 ],
			//             ],

			//         'fill-extrusion-base': 0,
			//     },
			//     layout: {
			//         visibility: 'none',
			//     },

			// });

			allDataMunipal.forEach((attribute: any) => {
				landingPageMap.setFeatureState(
					{
						id: attribute.id,
						source: "base-outline",
						sourceLayer: mapSources.nepal.layers.municipality,
					},
					{
						indicator: attribute.indicator,
						color: checkType(attribute.indicator),
					}
				);
			});

			landingPageMap.addLayer({
				id: "municipality-vizrisk",
				source: "base-outline",
				"source-layer": mapSources.nepal.layers.ward,
				type: "fill",
				paint: {
					"fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.8, 1],
					"fill-color": "transparent",
				},
			});
			// landingPageMap.addLayer({
			//     id: 'municipality-vizrisk-extrusion',
			//     source: 'base-outline',
			//     'source-layer': mapSources.nepal.layers.municipality,
			//     type: 'fill-extrusion',
			//     paint: {
			//         'fill-extrusion-color': ['feature-state', 'color'],

			//         'fill-extrusion-height':
			//             [
			//                 'interpolate', ['linear'], ['zoom'],
			//                 7, [
			//                     'case',
			//                     ['boolean', ['feature-state', 'hover'], false],
			//                     8000,
			//                     0,
			//                 ],

			//                 11, [
			//                     'case',
			//                     ['boolean', ['feature-state', 'hover'], false],
			//                     400,
			//                     0,
			//                 ],
			//             ],

			//         'fill-extrusion-base': 0,

			//     },
			//     layout: {
			//         visibility: 'visible',
			//     },

			// });

			landingPageMap.on("click", "municipality-vizrisk", (e) => {
				if (e && e.features && e.features[0]) {
					const name = e.features[0].properties.title;

					if (allAvialableVizrisks.includes(e.features[0].id)) {
						setClickedVizrisk(name);
						setShowMenu(false);
					}
				}
			});
			//     landingPageMap.on('mousemove', 'municipality-vizrisk', (e) => {
			//         landingPageMap.getCanvas().style.cursor = 'pointer';
			//         if (e && e.features && e.features[0] && e.features[0].properties) {
			//             const { lngLat } = e;
			//             const coordinates: number[] = [lngLat.lng, lngLat.lat];
			//             const name = e.features[0].properties.title;
			//             const type = e.features[0].state.indicator;

			//             popup.setLngLat(coordinates).setHTML(
			//                 `<div style="display : flex; flex-direction:column ;
			//                 align-items : center ;padding: 5px;
			//                 border-radius: 1px;background-color : rgb(3, 33, 46);">
			//                 <p style="margin:0px;padding:5px;color:cyan;
			//                 text-transform: uppercase;font-weight:bold;">${name}</p>
			//                 <p style="margin:0px;padding:5px;
			//                  color:white;font-weight:bold;">${vizRiskType(type)}</p>
			//                  </div>
			// `,
			//             ).addTo(landingPageMap);
			//             if (hoverId) {
			//                 landingPageMap.setFeatureState(
			//                     {
			//                         id: hoverId,
			//                         source: 'base-outline',
			//                         sourceLayer: mapSources.nepal.layers.municipality,
			//                     },
			//                     { hover: false },
			//                 );
			//             }
			//             hoverId = e.features[0].id;
			//             landingPageMap.setFeatureState(
			//                 {
			//                     id: hoverId,
			//                     source: 'base-outline',
			//                     sourceLayer: mapSources.nepal.layers.municipality,

			//                 },
			//                 { hover: true },
			//             );
			//         }
			//     });
			landingPageMap.on("mouseleave", "municipality-vizrisk", (e) => {
				landingPageMap.getCanvas().style.cursor = "";
				if (hoverId) {
					landingPageMap.setFeatureState(
						{
							source: "base-outline",
							id: hoverId,
							sourceLayer: mapSources.nepal.layers.municipality,
						},
						{ hover: false }
					);
				}
				hoverId = undefined;
				popup.remove();
			});
			landingPageMap.on("click", "province-vizrisk", (e) => {
				if (e && e.features && e.features[0]) {
					const name = e.features[0].properties.title;
					if (allAvialableVizrisks.includes(e.features[0].id)) {
						setClickedVizrisk(name);
						setShowMenu(false);
					}
				}
			});

			allData.forEach((attribute: any) => {
				landingPageMap.setFeatureState(
					{
						id: attribute.id,
						source: "base-outline",
						sourceLayer: mapSources.nepal.layers.province,
					},
					{ color: checkType(attribute.indicator), indicator: attribute.indicator }
				);
			});

			landingPageMap.addLayer({
				id: "province-outline",
				source: "base-outline",
				"source-layer": mapSources.nepal.layers.province,
				type: "line",
				paint: mapStyles.province.outline,
				layout: {
					visibility: "none",
				},
			});
			landingPageMap.addLayer({
				id: "municipality-outline",
				source: "base-outline",
				"source-layer": mapSources.nepal.layers.ward,
				type: "line",
				paint: {
					"line-color": "#03212e",
					"line-opacity": 0.5,
					"line-width": 1,
				},
				layout: {
					visibility: "visible",
				},
			});
			landingPageMap.addSource("pop-layer-province", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: vzRiskProvinceData.map((item) => ({
						type: "Feature",
						id: item.id,
						geometry: item.centroid,
						properties: {
							indicator: item.indicator,
							name: item.name,
						},
					})),
				},
			});

			landingPageMap.addLayer({
				id: "pop-image-layer-province",
				type: "symbol",
				source: "pop-layer-province",
				layout: {
					"icon-image": [
						"case",
						["==", ["get", "indicator"], 6],
						"flood",
						["==", ["get", "indicator"], 12],
						"landslide",
						["==", ["get", "indicator"], 14],
						"multihazard",
						"multihazard",
					],
					"icon-size": 0.2,
					"icon-anchor": "bottom",
					visibility: "none",
				},
			});
			landingPageMap.on("click", "pop-image-layer-province", (e) => {
				if (e && e.features && e.features[0]) {
					const { name } = e.features[0].properties;
					if (allAvialableVizrisks.includes(e.features[0].id)) {
						setClickedVizrisk(name);
						setShowMenu(false);
					}
				}
			});
			landingPageMap.on("mousemove", "pop-image-layer-province", (e) => {
				landingPageMap.getCanvas().style.cursor = "pointer";
				if (e && e.features && e.features[0] && e.features[0].properties) {
					const { lngLat } = e;
					const coordinates: number[] = [lngLat.lng, lngLat.lat];
					const { name } = e.features[0].properties;
					const type = e.features[0].properties.indicator;

					popup
						.setLngLat(coordinates)
						.setHTML(
							`<div style="display : flex;padding:5px;flex-direction:column;border:1px solid #0180d8;
                        align-items : center ;padding: 5px;border-radius: 1px;background-color : rgb(3, 33, 46);">
                        <p style="margin:0px;padding:5px;color:cyan;text-transform: uppercase;font-weight:bold;">${name}</p>
                        <p style="margin:0px 15px 8px 15px;padding: 3px 10px;color:white;font-weight:bold;background-color:#0180d8">${vizRiskType(
													type
												)}</p>
                         </div>
        `
						)
						.addTo(landingPageMap);
					if (hoverId) {
						landingPageMap.setFeatureState(
							{
								id: hoverId,
								source: "base-outline",
								sourceLayer: mapSources.nepal.layers.province,
							},
							{ hover: false }
						);
					}
					hoverId = e.features[0].id;
					landingPageMap.setFeatureState(
						{
							id: hoverId,
							source: "base-outline",
							sourceLayer: mapSources.nepal.layers.province,
						},
						{ hover: true }
					);
				}
			});
			landingPageMap.on("mouseleave", "pop-image-layer-province", (e) => {
				landingPageMap.getCanvas().style.cursor = "";
				if (hoverId) {
					landingPageMap.setFeatureState(
						{
							source: "base-outline",
							id: hoverId,
							sourceLayer: mapSources.nepal.layers.province,
						},
						{ hover: false }
					);
				}
				hoverId = undefined;
				popup.remove();
			});
			landingPageMap.addSource("pop-layer-municipal", {
				type: "geojson",
				data: {
					type: "FeatureCollection",
					features: vzRiskMunicipalData.map((item) => ({
						type: "Feature",
						id: item.id,
						geometry: item.centroid,
						properties: {
							indicator: item.indicator,
							name: item.name,
						},
					})),
				},
			});

			landingPageMap.addLayer({
				id: "pop-image-layer-municipal",
				type: "symbol",
				source: "pop-layer-municipal",
				layout: {
					"icon-image": [
						"case",
						["==", ["get", "indicator"], 6],
						"flood",
						["==", ["get", "indicator"], 12],
						"landslide",
						["==", ["get", "indicator"], 14],
						"multihazard",
						"multihazard",
					],
					"icon-size": 0.2,
					"icon-anchor": "bottom",
					visibility: "visible",
				},
			});
			landingPageMap.on("click", "pop-image-layer-municipal", (e) => {
				if (e && e.features && e.features[0]) {
					const { name } = e.features[0].properties;
					if (allAvialableVizrisks.includes(e.features[0].id)) {
						setClickedVizrisk(name);
						setShowMenu(false);
					}
				}
			});
			landingPageMap.on("mousemove", "pop-image-layer-municipal", (e) => {
				landingPageMap.getCanvas().style.cursor = "pointer";
				if (e && e.features && e.features[0] && e.features[0].properties) {
					const { lngLat } = e;
					const coordinates: number[] = [lngLat.lng, lngLat.lat];
					const { name } = e.features[0].properties;
					const type = e.features[0].properties.indicator;

					popup
						.setLngLat(coordinates)
						.setHTML(
							`<div style="display : flex;padding:5px;flex-direction:column;border:1px solid #0180d8;
                        align-items : center ;padding: 5px;border-radius: 1px;background-color : rgb(3, 33, 46);">
                        <p style="margin:0px;padding:5px;color:cyan;text-transform: uppercase;font-weight:bold;">${name}</p>
                        <p style="margin:0px 15px 8px 15px;padding: 3px 10px;color:white;font-weight:bold;background-color:#0180d8">${vizRiskType(
													type
												)}</p>
                         </div>
        `
						)
						.addTo(landingPageMap);
					if (hoverId) {
						landingPageMap.setFeatureState(
							{
								id: hoverId,
								source: "base-outline",
								sourceLayer: mapSources.nepal.layers.province,
							},
							{ hover: false }
						);
					}
					hoverId = e.features[0].id;
					landingPageMap.setFeatureState(
						{
							id: hoverId,
							source: "base-outline",
							sourceLayer: mapSources.nepal.layers.province,
						},
						{ hover: true }
					);
				}
			});
			landingPageMap.on("mouseleave", "pop-image-layer-municipal", (e) => {
				landingPageMap.getCanvas().style.cursor = "";
				if (hoverId) {
					landingPageMap.setFeatureState(
						{
							source: "base-outline",
							id: hoverId,
							sourceLayer: mapSources.nepal.layers.province,
						},
						{ hover: false }
					);
				}
				hoverId = undefined;
				popup.remove();
			});
		});

		return () => landingPageMap.remove();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (searchBbox.length > 0) {
			if (updateMap.current) {
				updateMap.current.fitBounds(searchBbox, { padding: 20 });
			}
		}
	}, [searchBbox]);

	useEffect(() => {
		const array = vzRiskMunicipalData.map((item) => item.id);
		const provinceIdarray = vzRiskProvinceData.map((item) => item.id);

		const allDataMunipal = municipalities.map((data: any) => ({
			...data,
			value: !!array.includes(data.id),
			indicator: checkIndicator(vzRiskMunicipalData, data),
		}));

		const allData = provinces.map((data: any) => ({
			...data,
			value: !!provinceIdarray.includes(data.id),
			indicator: checkIndicator(vzRiskProvinceData, data),
		}));

		const munFloodId = filterDataWithIndicator(allDataMunipal, 6);
		const munLandSlideId = filterDataWithIndicator(allDataMunipal, 12);
		const munMultiHazardId = filterDataWithIndicator(allDataMunipal, 14);
		const proFloodDataId = filterDataWithIndicator(allData, 6);
		const proLandSlideDataId = filterDataWithIndicator(allData, 12);
		const proMultiHazardDataId = filterDataWithIndicator(allData, 14);
		const proFloodId = proFloodDataId.length > 0 ? proFloodDataId : [8];
		const proLandSlideId = proLandSlideDataId.length > 0 ? proLandSlideDataId : [8];
		const proMultiHazardId = proMultiHazardDataId.length > 0 ? proMultiHazardDataId : [8];

		const allExposureId = [...proFloodId, ...proLandSlideId, ...proMultiHazardId];
		const allFilteredExposureId = allExposureId.filter((id) => id !== 8);
		if (updateMap.current && updateMap.current.isStyleLoaded()) {
			if (vzLabel === "province") {
				// showMapLayers('province-outline', updateMap);
				showMapLayers("pop-image-layer-province", updateMap);
				// showMapLayers('province-vizrisk-extrusion', updateMap);
				// updateMap.current.setFilter('province-vizrisk-extrusion',
				//     ['match', ['id'], provinceIdarray, true, false]);
				// switch (selctFieldCurrentValue) {
				//     case 'Flood Exposure':
				//         updateMap.current.setFilter('province-vizrisk',
				//             ['match', ['id'], proFloodId, true, false]);
				//         updateMap.current.setFilter('province-vizrisk-extrusion',
				//             ['match', ['id'], proFloodId, true, false]);
				//         break;
				//     case 'Landslide Exposure':
				//         updateMap.current.setFilter('province-vizrisk',
				//             ['match', ['id'], proLandSlideId, true, false]);
				//         updateMap.current.setFilter('province-vizrisk-extrusion',
				//             ['match', ['id'], proLandSlideId, true, false]);
				//         break;
				//     case 'Multi-hazard Exposure':
				//         updateMap.current.setFilter('province-vizrisk',
				//             ['match', ['id'], proMultiHazardId, true, false]);
				//         updateMap.current.setFilter('province-vizrisk-extrusion',
				//             ['match', ['id'], proMultiHazardId, true, false]);
				//         break;

				//     default:
				//         updateMap.current.setFilter('province-vizrisk',
				//             ['match', ['id'],
				//                 [...allFilteredExposureId],
				//                 true, false]);
				//         break;
				// }
			} else {
				hideMapLayers("pop-image-layer-province", updateMap);
				// hideMapLayers('province-vizrisk', updateMap);
				// hideMapLayers('province-vizrisk-extrusion', updateMap);
			}

			if (vzLabel === "municipality") {
				showMapLayers("pop-image-layer-municipal", updateMap);
				// showMapLayers('municipality-vizrisk', updateMap);
				// showMapLayers('municipality-vizrisk-extrusion', updateMap);
				// switch (selctFieldCurrentValue) {
				//     case 'Flood Exposure':
				//         updateMap.current.setFilter('municipality-vizrisk',
				//             ['match', ['id'], munFloodId, true, false]);
				//         updateMap.current.setFilter('municipality-vizrisk-extrusion',
				//             ['match', ['id'], munFloodId, true, false]);
				//         break;
				//     case 'Landslide Exposure':
				//         updateMap.current.setFilter('municipality-vizrisk',
				//             ['match', ['id'], munLandSlideId, true, false]);
				//         updateMap.current.setFilter('municipality-vizrisk-extrusion',
				//             ['match', ['id'], munLandSlideId, true, false]);
				//         break;
				//     case 'Multi-hazard Exposure':
				//         updateMap.current.setFilter('municipality-vizrisk',
				//             ['match', ['id'], munMultiHazardId, true, false]);
				//         updateMap.current.setFilter('municipality-vizrisk-extrusion',
				//             ['match', ['id'], munMultiHazardId, true, false]);
				//         break;

				//     default:
				//         updateMap.current.setFilter('municipality-vizrisk',
				// ['match', ['id'],
				//  [...munFloodId, ...munLandSlideId, ...munMultiHazardId], true, false]);
				//         break;
				// }
			} else {
				hideMapLayers("pop-image-layer-municipal", updateMap);
				// hideMapLayers('municipality-vizrisk', updateMap);
				// hideMapLayers('municipality-vizrisk-extrusion', updateMap);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vzLabel]);

	useEffect(() => {
		if (updateMap.current) {
			updateMap.current.fitBounds([
				[79.161987, 25.923467],
				[89.626465, 30.789037],
			]);
		}
	}, [vzLabel]);

	return (
		<div
			style={{ zIndex: clickedVizrisk && -1 }}
			ref={mapContainerRef}
			className={styles.landingPageMap}
		/>
	);
};

export default connect(mapStateToProps)(Map);
