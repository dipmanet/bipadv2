import React from "react";
import { connect } from "react-redux";
import { bbox, lineString } from "@turf/turf";
import memoize from "memoize-one";

import CommonMap from "#components/CommonMap";
import { getMapPaddings, mapStyles } from "#constants";
import { MapChildContext } from "#re-map/context";
import MapBounds from "#re-map/MapBounds";
import MapSource from "#re-map/MapSource";
import MapLayer from "#re-map/MapSource/MapLayer";
import MapTooltip from "#re-map/MapTooltip";
import { dataArchiveRainListSelector, rainFiltersSelector, rainStationsSelector } from "#selectors";
import { httpGet } from "#utils/common";
import styles from "./styles.module.scss";
import RainModal from "../../Modals/Rainwatch";

const mapStateToProps = (state) => ({
	rainFilters: rainFiltersSelector(state),
	rainList: dataArchiveRainListSelector(state),
	rainStation: rainStationsSelector(state),
});

const tileUrl = [
	`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
	"&version=1.1.0",
	"&service=WMS",
	"&request=GetMap",
	"&layers=Bipad:watershed-area",
	"&tiled=true",
	"&width=256",
	"&height=256",
	"&srs=EPSG:3857",
	"&bbox={bbox-epsg-3857}",
	"&transparent=true",
	"&format=image/png",
].join("");

// added
const GIS_URL = [
	`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/ows?`,
	"service=WFS",
	"&version=1.0.0",
	"&request=GetFeature",
	"&typeName=Bipad:watershed-area",
	"&outputFormat=application/json",
].join("");

const RainToolTip = ({ renderer: Renderer, params }) => <Renderer {...params} />;

const rainToGeojson = (rainList) => {
	const geojson = {
		type: "FeatureCollection",
		features: rainList
			.filter((rain) => rain.point)
			.map((rain) => ({
				id: rain.id,
				type: "Feature",
				geometry: {
					...rain.point,
				},
				properties: {
					...rain,
					rainId: rain.id,
					title: rain.title,
					description: rain.description,
					basin: rain.basin,
					status: rain.status,
				},
			})),
	};
	return geojson;
};

const rainStationToGeojson = (rainStation) => {
	const geojson = {
		type: "FeatureCollection",
		features: rainStation
			.filter((station) => station.point)
			.map((station) => ({
				id: station.id,
				type: "Feature",
				geometry: {
					...station.point,
				},
				properties: {
					...station,
					stationId: station.id,
					title: station.title,
					description: station.description,
					basin: station.basin,
					status: station.status,
					measuredOn: station.measuredOn,
					averages: station.averages,
				},
			})),
	};
	return geojson;
};

const compare = (a, b) => {
	if (a.measuredOn < b.measuredOn) {
		return 1;
	}
	if (a.measuredOn > b.measuredOn) {
		return -1;
	}
	return 0;
};

const zoomToData = (data) => {
	const coordsArray = data.map((item) => item.point.coordinates);
	if (coordsArray.length > 0) {
		const line = lineString(coordsArray);
		const boundbox = bbox(line);
		return boundbox;
	}
	return null;
};

class RainMap extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			tooltipRenderer: null,
			coordinates: undefined,
			tooltipParams: null,
			showModal: false,
			rasterLayers: [],
			gis: undefined,
		};
	}

	// added
	componentDidMount() {
		let result = "";
		try {
			result = JSON.parse(httpGet(GIS_URL));
			this.setState({ gis: result });
		} catch (error) {
			this.setState({ gis: undefined });
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.rainStation !== this.props.rainStation) {
			 
			let basinCoordinates = [];

			if (this.props.rainFilters.basin != null) {
				 
				const mydata = this.props.rainStation.filter(
					(item) => item.basin === this.props.rainFilters.basin.title
				);

				if (mydata.length > 0) {
					basinCoordinates = mydata[0].point.coordinates;
					const tile = [
						`${import.meta.env.VITE_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
						"&service=WMS",
						"&version=1.1.1",
						"&request=GetMap",
						"&layers=Bipad:watershed-area",
						"&tiled=true",
						"&width=256",
						"&height=256",
						"&srs=EPSG:3857",
						"&bbox={bbox-epsg-3857}",
						"&transparent=true",
						"&format=image/png",
						 
						`&CQL_FILTER=INTERSECTS(the_geom,%20POINT%20(${basinCoordinates[0]}%20${basinCoordinates[1]}))`,
					].join("");

					const ourAarray = [
						{
							key: `basin-${this.props.rainFilters.basin.title}`,
							layername: `layer-basin-${this.props.rainFilters.basin.title}`,
							tiles: tile,
						},
					];
					 
					if (!(this.props.rainFilters.basin && Object.keys(this.props.rainFilters.basin).length)) {
						// eslint-disable-next-line react/no-did-update-set-state
						this.setState({ rasterLayers: [] });
					} else {
						// eslint-disable-next-line react/no-did-update-set-state
						this.setState({
							rasterLayers: [ourAarray[0]],
						});
					}
				}
			}
			// }
		}
	}

	getRainFeatureCollection = memoize(rainToGeojson);

	getRainStationFeatureCollection = memoize(rainStationToGeojson);

	getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
		const mapPaddings = getMapPaddings();

		if (leftPaneExpanded && rightPaneExpanded) {
			return mapPaddings.bothPaneExpanded;
		}

		if (leftPaneExpanded) {
			return mapPaddings.leftPaneExpanded;
		}

		if (rightPaneExpanded) {
			return mapPaddings.rightPaneExpanded;
		}

		return mapPaddings.noPaneExpanded;
	});

	handleModalClose = () => {
		this.setState({
			tooltipRenderer: null,
			coordinates: undefined,
			tooltipParams: null,
			showModal: false,
		});
	};

	handleRainClick = (feature, lngLat) => {
		const {
			properties: { title, description, basin, status, stationId, measuredOn, averages },

			geometry,
		} = feature;
		const avg = averages ? JSON.parse(averages) : undefined;
		this.setState({
			tooltipRenderer: this.rainTooltipRenderer,
			tooltipParams: {
				title,
				description,
				basin,
				status,
				stationId,
				geometry,
				measuredOn,
				averages: avg,
			},

			coordinates: lngLat,
		});
		return true;
	};

	rainTooltipRenderer = ({ title, basin, measuredOn, averages }) => {
		const date = measuredOn.split("T")[0];
		const time = measuredOn.split("T")[1].split("+")[0];
		const timeOnly = time.split(":").slice(0, 2).join(":");

		const oneHourInterval = averages[0].value || "N/A";
		const threeHourInterval = averages[1].value || "N/A";
		const sixHourInterval = averages[2].value || "N/A";
		const twelveHourInterval = averages[3].value || "N/A";
		const twentyFourHourInterval = averages[4].value || "N/A";
		return (
			<div className={styles.mainWrapper}>
				<div className={styles.tooltip}>
					{/* <div className={styles.header}>
                    <h3>{`Heavy Rainfall at ${title || 'N/A'}`}</h3>
                </div> */}
					<div className={styles.description}>
						<div className={styles.key}>STATION NAME:</div>
						<div className={styles.value}>{title || "N/A"}</div>
					</div>
					<div className={styles.description}>
						<div className={styles.key}>BASIN:</div>
						<div className={styles.value}>{basin || "N/A"}</div>
					</div>
					<div className={styles.description}>
						<div className={styles.key}>Measured On:</div>
						<div className={styles.value}>{`${date} | ${timeOnly} (NPT)` || "N/A"}</div>
					</div>
					<div className={styles.rainfall}>
						<div className={styles.title}>Accumulated Rainfall:</div>
						<div className={styles.rainfallList}>
							<div className={styles.rainfallItem}>
								<div className={styles.hour}>1 Hour</div>
								<div className={styles.value}>{`${oneHourInterval} mm`}</div>
							</div>
							<div className={styles.rainfallItem}>
								<div className={styles.hour}>3 Hour</div>
								<div className={styles.value}>{`${threeHourInterval} mm`}</div>
							</div>
							<div className={styles.rainfallItem}>
								<div className={styles.hour}>6 Hour</div>
								<div className={styles.value}>{`${sixHourInterval} mm`}</div>
							</div>
							<div className={styles.rainfallItem}>
								<div className={styles.hour}>12 Hour</div>
								<div className={styles.value}>{`${twelveHourInterval} mm`}</div>
							</div>
							<div className={styles.rainfallItem}>
								<div className={styles.hour}>24 Hour</div>
								<div className={styles.value}>{`${twentyFourHourInterval} mm`}</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.line} />
				<div className={styles.getDetails}>
					<span onClick={() => this.setState({ showModal: true })} role="presentation">
						Get Details
					</span>
				</div>
			</div>
		);
	};

	handleTooltipClose = () => {
		this.setState({
			tooltipRenderer: null,
			coordinates: undefined,
			tooltipParams: null,
		});
	};

	render() {
		const { data, rainFilters, rightPaneExpanded, leftPaneExpanded } = this.props;
		const {
			tooltipRenderer,
			tooltipParams,
			coordinates,
			rasterLayers,
			// added
			gis,
		} = this.state;

		if (data) {
			data.sort(compare);
		}

		const rainFeatureCollection = this.getRainFeatureCollection(data);

		const rainStationFeatureCollection = this.getRainStationFeatureCollection(
			this.props.rainStation
		);

		const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);
		const {
			station: { point, municipality },
		} = rainFilters;
		const tooltipOptions = {
			closeOnClick: true,
			closeButton: false,
			offset: 8,
		};

		const { showModal } = this.state;

		// const bounds = zoomToData(data);

		const { title: stationName, stationId, geometry } = tooltipParams || {};
		const region = { adminLevel: 3, geoarea: municipality || undefined };
		return (
			<div className={styles.dataArchiveRainMap}>
				<CommonMap
					sourceKey="dataArchiveRain"
					boundsPadding={boundsPadding}
					region={municipality ? region : undefined}
				/>
				{/* {bounds && typeof this.props.rainFilters.basin !== 'object' && (
                    <MapBounds
                        bounds={bounds}
                        padding={boundsPadding}
                    />
                )} */}
				{coordinates && (
					<MapTooltip
						coordinates={coordinates}
						tooltipOptions={tooltipOptions}
						onHide={this.handleTooltipClose}>
						<RainToolTip renderer={tooltipRenderer} params={tooltipParams} />
					</MapTooltip>
				)}
				{/* added */}
				{gis && (
					<MapSource
						sourceKey="gis-layer"
						sourceOptions={{ type: "geojson" }}
						geoJson={gis}
						supportHover>
						<MapLayer
							layerKey="gis-outline"
							layerOptions={{
								type: "line",
								paint: {
									"line-color": "purple",
									"line-width": 1.5,
									"line-dasharray": [1, 2],
								},
							}}
						/>
					</MapSource>
				)}

				{rasterLayers.length === 0 && (
					<MapSource
						key="basin-rain-key"
						sourceKey="basin-rain-key"
						sourceOptions={{
							type: "raster",
							tiles: [tileUrl],
							tileSize: 256,
						}}>
						{/* <MapLayer
                                layerKey="raster-rain-layer"
                                layerOptions={{
                                    type: 'raster',
                                    paint: {
                                        'raster-opacity': 0.9,
                                    },
                                }}
                            /> */}
					</MapSource>
				)}
				{rasterLayers.map((layer) => (
					<MapSource
						key={`key${layer.key}`}
						sourceKey={`source${layer.key}`}
						sourceOptions={{
							type: "raster",
							tiles: [layer.tiles],
							tileSize: 256,
						}}>
						<MapLayer
							layerKey={`${layer.layername}`}
							layerOptions={{
								type: "raster",
								paint: {
									"raster-opacity": 0.9,
								},
							}}
						/>
					</MapSource>
				))}

				<MapSource
					sourceKey="real-time-rain-points"
					geoJson={rainStationFeatureCollection}
					sourceOptions={{ type: "geojson" }}
					supportHover>
					<React.Fragment>
						<MapLayer
							layerKey="real-time-rain-circle"
							onClick={this.handleRainClick}
							layerOptions={{
								type: "circle",
								// paint: mapStyles.rainPoint.paint,
								paint: mapStyles.rainPoint.circle,
							}}
						/>
						{/* added */}
						{/* <MapLayer
                            layerKey="real-time-rain-text"
                            layerOptions={{
                                type: 'symbol',
                                layout: mapStyles.rain24Text.layout,
                                paint: mapStyles.rain24Text.paint,
                            }}
                        /> */}
					</React.Fragment>
				</MapSource>
				{showModal && (
					<RainModal
						handleModalClose={this.handleModalClose}
						stationName={stationName}
						stationId={stationId}
						geometry={geometry}
					/>
				)}
			</div>
		);
	}
}
export default connect(mapStateToProps, [])(RainMap);
