import React, { Fragment } from "react";
import { connect } from "react-redux";
import { isNotDefined } from "@togglecorp/fujs";
import memoize from "memoize-one";
import PropTypes from "prop-types";

import TextOutput from "#components/TextOutput";
import { mapSources, vizriskmapStyles } from "#constants";
import { MapChildContext as MapContext } from "#re-map/context";
import MapBounds from "#re-map/MapBounds";
import MapSource from "#re-map/MapSource";
import MapLayer from "#re-map/MapSource/MapLayer";
import MapState from "#re-map/MapSource/MapState";
import MapTooltip from "#re-map/MapTooltip";
import Button from "#rsca/Button";
import {
	boundsSelector,
	districtsSelector,
	// provincesSelector,
	municipalitiesSelector,
	regionLevelSelector,
	selectedDistrictIdSelector,
	selectedMunicipalityIdSelector,
	selectedProvinceIdSelector,
	wardsSelector,
} from "#selectors";
import {
	getDistrictFilter,
	getMunicipalityFilter,
	getProvinceFilter,
	getWardFilter,
} from "#utils/domain";
import styles from "./styles.module.scss";

const propTypes = {
	regionLevelFromAppState: PropTypes.number,
	regionLevel: PropTypes.number,

	// eslint-disable-next-line react/forbid-prop-types
	// provinces: PropTypes.array.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	districts: PropTypes.array.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	municipalities: PropTypes.array.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	wards: PropTypes.array.isRequired,

	// eslint-disable-next-line react/forbid-prop-types
	bounds: PropTypes.array.isRequired,
	selectedProvinceId: PropTypes.number,
	selectedDistrictId: PropTypes.number,
	selectedMunicipalityId: PropTypes.number,
	sourceKey: PropTypes.string,
	tooltipRenderer: PropTypes.func,
	tooltipParams: PropTypes.func,
	// eslint-disable-next-line react/forbid-prop-types
	paint: PropTypes.object.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	mapState: PropTypes.array.isRequired,
};

const defaultProps = {
	regionLevelFromAppState: undefined,
	regionLevel: undefined,
	selectedProvinceId: undefined,
	selectedDistrictId: undefined,
	selectedMunicipalityId: undefined,
	tooltipRenderer: undefined,
	tooltipParams: undefined,
	sourceKey: "country",
};

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

const visibleLayout = {
	visibility: "visible",
};
const noneLayout = {
	visibility: "none",
};

class VizriskMap extends React.PureComponent {
	static contextType = MapContext;

	constructor(props) {
		super(props);

		this.state = {
			feature: undefined,
			hoverLngLat: undefined,
			id: 0,
			selectedWardNo: 0,
			populationMale: 0,
			household: 0,
		};
	}

	static propTypes = propTypes;

	static defaultProps = defaultProps;

	getWardFilter = memoize(getWardFilter);

	getMunicipalityFilter = memoize(getMunicipalityFilter);

	getDistrictFilter = memoize(getDistrictFilter);

	getProvinceFilter = memoize(getProvinceFilter);

	// handleMouseEnter = (feature, lngLat, id) => {
	//     this.setState({
	//         feature,
	//         hoverLngLat: lngLat,
	//         id,
	//     });
	// }

	handleMouseEnter = (e) => {
		const { id } = e;
		const { selectWards, demographicsData } = this.props;
		const hoveredWard = selectWards.filter((item) => item.id === e.id);
		const { coordinates } = hoveredWard[0].centroid;
		const wardTitle = parseInt(hoveredWard[0].title, 10);
		const selectedwardName = demographicsData.filter(
			(item) => parseInt(item.name.split(" ")[1], 10) === wardTitle
		);
		// get title from hoveredWard and extract name from demographics data
		this.setState({
			id,
			hoverLngLat: coordinates,
			selectedWardNo: hoveredWard[0].title,
			populationMale: selectedwardName[0].MalePop,
			populationFemale: selectedwardName[0].FemalePop,
			household: selectedwardName[0].TotalHousehold,
		});
	};

	handleMouseLeave = () => {
		this.setState({
			feature: undefined,
			hoverLngLat: undefined,
		});
	};

	handleLayerClick = (e) => {
		this.setState({
			id: e.id,
		});
	};

	// getRasterTile = (layer) => {
	//     console.log('in function layername: ', layer.layerName);
	//     console.log('infunction: layer ', layer);
	//     const url = [
	//         `${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
	//         '&version=1.1.1',
	//         '&service=WMS',
	//         '&request=GetMap',
	//         `&layers=Bipad%3${layer.layerName}`,
	//         '&tiled=true',
	//         '&width=256',
	//         '&height=256',
	//         '&srs=EPSG:3857',
	//         '&bbox={bbox-epsg-3857}',
	//         '&transparent=true',
	//         '&format=image/png',
	//     ].join('');
	//     console.log(url);
	//     return encodeURI(url);
	// }

	getRasterTile = (layer) => {
		const url = [
			`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
			"&version=1.1.1",
			"&service=WMS",
			"&request=GetMap",
			`&layers=Bipad%3${layer}`,
			"&tiled=true",
			"&width=256",
			"&height=256",
			"&srs=EPSG:3857",
			"&bbox={bbox-epsg-3857}",
			"&transparent=true",
			"&format=image/png",
		].join("");

		return encodeURI(url);
	};
	// getRasterTile = (layer.layername) => {
	//     return [
	//         `${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
	//         '&version=1.1.1',
	//         '&service=WMS',
	//         '&request=GetMap',
	//         `&layers=Bipad:${layer.layername}`,
	//         '&tiled=true',
	//         '&width=256',
	//         '&height=256',
	//         '&srs=EPSG:3857',
	//         '&bbox={bbox-epsg-3857}',
	//         '&transparent=true',
	//         '&format=image/png',
	//     ].join('');

	//     // return tileUrl;
	// };

	render() {
		const {
			bounds,
			// provinces,
			districts,
			municipalities,
			wards,
			beneath,
			selectedProvinceId: provinceId,
			selectedDistrictId: districtId,
			selectedMunicipalityId: municipalityId,
			sourceKey,
			showTooltip,
			showRaster,
			paint,
			mapState,
			regionLevelFromAppState,
			regionLevel = regionLevelFromAppState,
			tooltipRenderer: TooltipRenderer,
			tooltipParams,
			demographicsData,
			showFirstLayer,
		} = this.props;
		const showProvince = isNotDefined(regionLevel) || regionLevel === 1;
		const showDistrict = [1, 2].includes(regionLevel);
		const showMunicipality = [2, 3].includes(regionLevel);
		const showWard = [3, 4].includes(regionLevel);

		const showProvinceFill = isNotDefined(regionLevel);
		const showDistrictFill = regionLevel === 1;
		const showMunicipalityFill = regionLevel === 2;
		const showWardFill = regionLevel === 3;

		const showProvinceLabel = showProvinceFill;
		const showDistrictLabel = showDistrictFill;
		const showMunicipalityLabel = showMunicipalityFill;
		const showWardLabel = showWardFill;

		const wardFilter = showWard
			? this.getWardFilter(provinceId, districtId, municipalityId, wards)
			: undefined;
		const municipalityFilter = showMunicipality
			? this.getMunicipalityFilter(provinceId, districtId, municipalityId, municipalities)
			: undefined;
		const districtFilter = showDistrict
			? this.getDistrictFilter(provinceId, districtId, districts)
			: undefined;
		const provinceFilter = showProvince ? this.getProvinceFilter(provinceId) : undefined;

		const provinceMapState = showProvinceFill ? mapState : undefined;
		const districtMapState = showDistrictFill ? mapState : undefined;
		const municipalityMapState = showMunicipalityFill ? mapState : undefined;
		const wardMapState = showWardFill ? mapState : undefined;

		const { ward, municipality, district, province } = mapSources.nepal.layers;

		const {
			hoverLngLat,
			feature,
			id,
			selectedWardNo,
			populationMale,
			populationFemale,
			household,
		} = this.state;

		const tooltipOptions = {
			closeOnClick: false,
			closeButton: false,
			offset: 8,
		};
		const rasterLayers = [
			{
				layerName: "fluvial_defended_1in5",
				id: 1,
				opacity: 0.7,
			},
			{
				layerName: "fluvial_defended_1in10",
				id: 2,
				opacity: 0.7,
			},
		];

		// const tileUrl = [
		//     `${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
		//     '&version=1.1.1',
		//     '&service=WMS',
		//     '&request=GetMap',
		//     '&layers=Bipad:fluvial_defended_1in5',
		//     '&tiled=true',
		//     '&width=256',
		//     '&height=256',
		//     '&srs=EPSG:3857',
		//     '&bbox={bbox-epsg-3857}',
		//     '&transparent=true',
		//     '&format=image/png',
		// ].join('');

		// const tileUrl1 = [
		//     `${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
		//     '&version=1.1.1',
		//     '&service=WMS',
		//     '&request=GetMap',
		//     '&layers=Bipad:fluvial_defended_1in10',
		//     '&tiled=true',
		//     '&width=256',
		//     '&height=256',
		//     '&srs=EPSG:3857',
		//     '&bbox={bbox-epsg-3857}',
		//     '&transparent=true',
		//     '&format=image/png',
		// ].join('');

		const tileUrl2 = [
			`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
			"&version=1.1.1",
			"&service=WMS",
			"&request=GetMap",
			"&layers=Bipad:fluvial_defended_1in10",
			"&tiled=true",
			"&width=256",
			"&height=256",
			"&srs=EPSG:3857",
			"&bbox={bbox-epsg-3857}",
			"&transparent=true",
			"&format=image/png",
		].join("");
		let extraParams = {};
		if (tooltipParams) {
			extraParams = tooltipParams();
		}
		return (
			<Fragment>
				<MapBounds bounds={bounds} padding={20} />
				{showFirstLayer && (
					<MapSource
						key={1}
						sourceKey={"fluvial_defended_1in10"}
						sourceOptions={{
							type: "raster",
							tiles: [tileUrl2],
							tileSize: 256,
						}}>
						<MapLayer
							layerKey="raster-layer"
							layerOptions={{
								type: "raster",
								paint: {
									"raster-opacity": 0.8,
								},
							}}
						/>
					</MapSource>
				)}
				{/* { rasterLayers.map((layer) => {
                    console.log('inMap:', layer.id, layer.layerName, layer);
                    return (
                        <MapSource
                            key={layer.id}
                            sourceKey={layer.layername}
                            sourceOptions={{
                                type: 'raster',
                                tiles: [this.getRasterTile(layer)],
                                tileSize: 256,
                            }}
                        >
                            <MapLayer
                                layerKey="raster-layer"
                                layerOptions={{
                                    type: 'raster',
                                    paint: {
                                        'raster-opacity': 0.8,
                                    },
                                }}
                            />
                        </MapSource>
                    );
                })} */}
				<MapSource
					sourceKey={`${sourceKey}-fills`}
					sourceOptions={{
						type: "vector",
						url: mapSources.nepal.url,
					}}>
					<MapLayer
						layerKey="ward-fill"
						onClick={this.handleMouseEnter}
						beneath={beneath || "water"}
						// onMouseLeave={this.handleMouseLeave}
						layerOptions={{
							type: "fill",
							"source-layer": mapSources.nepal.layers.ward,
							paint,
							layout: showWardFill ? visibleLayout : noneLayout,
							filter: wardFilter,
						}}
					/>
					{showTooltip && (
						<MapTooltip coordinates={hoverLngLat} tooltipOptions={tooltipOptions}>
							<div className={styles.tooltipContainer}>
								<h1>
									<span className={styles.field}>Ward No.</span>
									{selectedWardNo}
								</h1>
								<p>
									<span className={styles.field}>Population: </span>
									{populationFemale + populationMale}
								</p>
								<p>
									<span className={styles.field}>Household: </span>
									{household}
								</p>
							</div>
							{/* <TextOutput
                                    label="Male Population"
                                    value={populationMale}
                                />
                                <TextOutput
                                    label="Female Population"
                                    value={populationFemale}
                                />
                                <TextOutput
                                    label="Ward No"
                                    value={selectedWardNo}
                                /> */}
						</MapTooltip>
					)}

					<MapLayer
						layerKey="municipality-fill"
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}
						beneath="landuse copy"
						layerOptions={{
							type: "fill",
							"source-layer": mapSources.nepal.layers.municipality,
							paint,
							layout: showMunicipalityFill ? visibleLayout : noneLayout,
							filter: municipalityFilter,
						}}
					/>
					<MapLayer
						layerKey="district-fill"
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}
						beneath="water"
						layerOptions={{
							type: "fill",
							"source-layer": mapSources.nepal.layers.district,
							paint,
							layout: showDistrictFill ? visibleLayout : noneLayout,
							filter: districtFilter,
							beneath: "water",
						}}
					/>
					<MapLayer
						layerKey="province-fill"
						layerOptions={{
							type: "fill",
							"source-layer": mapSources.nepal.layers.province,
							paint,
							layout: showProvinceFill ? visibleLayout : noneLayout,
							filter: provinceFilter,
						}}
					/>
					<MapLayer
						layerKey="ward-outline"
						layerOptions={{
							"source-layer": mapSources.nepal.layers.ward,
							type: "line",
							paint: vizriskmapStyles.ward.outline,
							layout: showWard ? visibleLayout : noneLayout,
							filter: wardFilter,
						}}
					/>

					<MapLayer
						layerKey="municipality-outline"
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}
						layerOptions={{
							"source-layer": mapSources.nepal.layers.municipality,
							type: "line",
							paint: vizriskmapStyles.municipality.outline,
							layout: showMunicipality ? visibleLayout : noneLayout,
							filter: municipalityFilter,
						}}
					/>
					<MapLayer
						layerKey="district-outline"
						layerOptions={{
							"source-layer": mapSources.nepal.layers.district,
							type: "line",
							paint: vizriskmapStyles.district.outline,
							layout: showDistrict ? visibleLayout : noneLayout,
							filter: districtFilter,
						}}
					/>
					<MapLayer
						layerKey="province-outline"
						layerOptions={{
							"source-layer": mapSources.nepal.layers.province,
							type: "line",
							paint: vizriskmapStyles.province.outline,
							layout: showProvince ? visibleLayout : noneLayout,
							filter: provinceFilter,
						}}
					/>

					{TooltipRenderer && hoverLngLat && (
						<MapTooltip coordinates={hoverLngLat} tooltipOptions={tooltipOptions} trackPointer>
							<TooltipRenderer feature={feature} {...extraParams} />
						</MapTooltip>
					)}
					{wardMapState && (
						<MapState attributes={wardMapState} attributeKey="value" sourceLayer={ward} />
					)}
					{districtMapState && (
						<MapState attributes={districtMapState} attributeKey="value" sourceLayer={district} />
					)}
					{municipalityMapState && (
						<MapState
							attributes={municipalityMapState}
							attributeKey="value"
							sourceLayer={municipality}
						/>
					)}
					{provinceMapState && (
						<MapState attributes={provinceMapState} attributeKey="value" sourceLayer={province} />
					)}
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
							paint: vizriskmapStyles.provinceLabel.paint,
							layout: showProvinceLabel ? vizriskmapStyles.provinceLabel.layout : noneLayout,
							filter: provinceFilter,
						}}
					/>
					<MapLayer
						layerKey="district-label"
						layerOptions={{
							"source-layer": mapSources.nepalCentroid.layers.district,
							type: "symbol",
							paint: vizriskmapStyles.districtLabel.paint,
							layout: showDistrictLabel ? vizriskmapStyles.districtLabel.layout : noneLayout,
							filter: districtFilter,
						}}
					/>
					<MapLayer
						layerKey="municipality-label"
						layerOptions={{
							"source-layer": mapSources.nepalCentroid.layers.municipality,
							type: "symbol",
							paint: vizriskmapStyles.municipalityLabel.paint,
							layout: showMunicipalityLabel
								? vizriskmapStyles.municipalityLabel.layout
								: noneLayout,
							filter: municipalityFilter,
						}}
					/>
					<MapLayer
						layerKey="ward-label"
						layerOptions={{
							"source-layer": mapSources.nepalCentroid.layers.ward,
							type: "symbol",
							paint: vizriskmapStyles.wardLabel.paint,
							layout: showWardLabel ? vizriskmapStyles.wardLabel.layout : noneLayout,
							filter: wardFilter,
						}}
					/>
				</MapSource>
				{/* <MapSource
                    sourceKey="settlement-source"
                    sourceOptions={{
                        type: 'geojson',
                    }}
                    geoJson={settlementData}
                >
                    <MapLayer
                        layerKey="settlement-layer"
                        onClick={this.handlesettlementClick}
                            // NOTE: to set this layer as hoverable
                        layerOptions={{
                            type: 'circle',
                            paint: vizriskmapStyles.settlementPoints.circle,
                            // paint: isHovered
                            //     ? mapStyles.firePoint.circleDim
                            //     : mapStyles.firePoint.circle,
                        }}
                        // onMouseEnter={this.handleHazardEnter}
                        // onMouseLeave={this.handleHazardLeave}
                    />
                </MapSource> */}
			</Fragment>
		);
	}
}

export default connect(mapStateToProps)(VizriskMap);
