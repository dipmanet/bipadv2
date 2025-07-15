import React from "react";
import { connect } from "react-redux";
import { isDefined, unique } from "@togglecorp/fujs";
import memoize from "memoize-one";
import PropTypes from "prop-types";

import {
	patchIncidentActionIP,
	removeIncidentActionIP,
	setIncidentActionIP,
} from "#actionCreators";
import { getParams } from "#components/Cloak";
// import SVGMapIcon from '#components/SVGMapIcon';
import CommonMap from "#components/CommonMap";
import IncidentInfo from "#components/IncidentInfo";
import ProvinceMap from "#components/ProvinceMap";
import { mapStyles } from "#constants";
import MapSource from "#re-map/MapSource";
import MapLayer from "#re-map/MapSource/MapLayer";
import MapState from "#re-map/MapSource/MapState";
import MapTooltip from "#re-map/MapTooltip";
import { createRequestClient, methods } from "#request";
import {
	districtsMapSelector,
	hazardTypesSelector,
	languageSelector,
	municipalitiesMapSelector,
	provincesMapSelector,
	userSelector,
	wardsMapSelector,
} from "#selectors";
import { framize, getImage, getYesterday } from "#utils/common";
import { incidentPointToGeojson, incidentPolygonToGeojson } from "#utils/domain";
import styles from "./styles.module.scss";
import AddIncidentForm from "../LeftPane/AddIncidentForm";

const propTypes = {
	incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
	hazards: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	recentDay: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types
	onIncidentHover: PropTypes.func,
	mapHoverAttributes: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
	wardsMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	provincesMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	districtsMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	municipalitiesMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	setIncident: PropTypes.func.isRequired,
	// eslint-disable-next-line react/no-unused-prop-types
	removeIncident: PropTypes.func.isRequired,
	patchIncident: PropTypes.func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
	requests: PropTypes.object.isRequired,
	sourceKey: PropTypes.string,
	isProviceOnlyMap: PropTypes.bool,
	// eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
	user: PropTypes.object,
};

const defaultProps = {
	sourceKey: "incidents",
	isProviceOnlyMap: false,
	user: undefined,
	onIncidentHover: undefined,
};

const mapStateToProps = (state) => ({
	hazards: hazardTypesSelector(state),
	provincesMap: provincesMapSelector(state),
	districtsMap: districtsMapSelector(state),
	municipalitiesMap: municipalitiesMapSelector(state),
	wardsMap: wardsMapSelector(state),
	user: userSelector(state),
	language: languageSelector(state),
});

const visibleLayout = {
	visibility: "visible",
};
const noneLayout = {
	visibility: "none",
};

const mapDispatchToProps = (dispatch) => ({
	patchIncident: (params) => dispatch(patchIncidentActionIP(params)),
	setIncident: (params) => dispatch(setIncidentActionIP(params)),
	removeIncident: (params) => dispatch(removeIncidentActionIP(params)),
});

const requestOptions = {
	incidentDeleteRequest: {
		url: ({ params: { incidentId } }) => `/incident/${incidentId}/`,
		method: methods.DELETE,
		onSuccess: ({ props: { removeIncident }, params: { incidentId, onIncidentRemove } }) => {
			removeIncident({ incidentId });
			onIncidentRemove();
		},
	},
};

class IncidentMap extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);
		this.prevTimestamp = undefined;
		this.state = {};
	}

	getUserParams = memoize(getParams);

	getPointFeatureCollection = memoize(incidentPointToGeojson);

	getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

	getFilter = memoize((timestamp) => [">", ["get", "incidentOn"], timestamp]);

	handleAnimationKeyframe = framize((percent) => {
		const p = percent;
		const radius = p * 20;
		const opacity = 1 - p;
		return {
			"circle-radius": radius,
			// 'circle-radius': ['+', mapStyles.incidentPoint.fill['circle-radius'], radius],
			"circle-opacity": opacity,
		};
	});

	handleIncidentMouseEnter = (feature) => {
		const { onIncidentHover } = this.props;

		if (onIncidentHover) {
			onIncidentHover(feature.id);
		}
	};

	handleIncidentMouseLeave = () => {
		const { onIncidentHover } = this.props;

		if (onIncidentHover) {
			onIncidentHover(undefined);
		}
	};

	handleIncidentClick = (feature, lngLat) => {
		const { id } = feature;
		const { incidentList } = this.props;
		const incident = incidentList.find((item) => item.id === id);
		this.setState({
			incident,
			incidentLngLat: lngLat,
		});
	};

	handleIncidentClose = () => {
		this.setState({
			incident: undefined,
			incidentLngLat: undefined,
		});
	};

	handleEditIncidentClick = () => {
		this.setState({ showEditIncidentModal: true });
	};

	handleCloseEditModal = () => {
		this.setState({ showEditIncidentModal: false });
	};

	handleIncidentEdit = (incident) => {
		const { setIncident } = this.props;

		if (isDefined(incident)) {
			setIncident({ incident });
		}
	};

	handleLossEdit = (loss, incident) => {
		const { patchIncident } = this.props;

		patchIncident({
			incident: {
				loss,
			},
			incidentId: incident.id,
		});
	};

	handleIncidentDelete = () => {
		const {
			incident: { id: incidentId },
		} = this.state;
		const {
			requests: { incidentDeleteRequest },
		} = this.props;

		incidentDeleteRequest.do({
			incidentId,
			onIncidentRemove: this.handleIncidentClose,
		});
	};

	mapImageRendererParams = (_, hazard) => {
		const image = getImage(hazard.icon).setAttribute("crossOrigin", "");

		return { name: hazard.title, image };
	};

	render() {
		const {
			incidentList,
			hazards,
			recentDay,
			mapHoverAttributes,
			wardsMap,
			provincesMap,
			districtsMap,
			municipalitiesMap,
			user,
			pending,
			isHovered,
			requests: {
				incidentDeleteRequest: { pending: incidentDeletePending },
			},
			sourceKey,
			isProviceOnlyMap,
			language: { language },
		} = this.props;

		const icons = unique(
			incidentList
				.filter((incident) => incident.hazardInfo && incident.hazardInfo.icon)
				.map((incident) => incident.hazardInfo.icon),
			(icon) => icon
		);

		const pointFeatureCollection = this.getPointFeatureCollection(incidentList, hazards);
		const polygonFeatureCollection = this.getPolygonFeatureCollection(incidentList, hazards);
		const recentTimestamp = getYesterday(recentDay);
		const filter = this.getFilter(recentTimestamp);

		const { incident, incidentLngLat, showEditIncidentModal } = this.state;

		const tooltipOptions = {
			closeOnClick: true,
			closeButton: false,
			offset: 8,
		};

		const lossServerId = incident && incident.loss && incident.loss.id;
		const incidentServerId = incident && incident.id;
		const Map = isProviceOnlyMap ? ProvinceMap : CommonMap;
		const params = this.getUserParams(user);
		const showEditIncident = !!(params && params.change_incident);
		const showDeleteIncident = !!(params && params.delete_incident);

		return (
			<React.Fragment>
				<Map sourceKey={sourceKey} />
				{/* icons.map(icon => (
                    <SVGMapIcon
                        key={icon}
                        src={icon}
                        name={icon}
                        fillColor="#222222"
                    />
                )) */}
				<MapSource
					sourceKey="incident-polygons"
					sourceOptions={{ type: "geojson" }}
					geoJson={polygonFeatureCollection}>
					<MapLayer
						layerKey="incident-polygon-fill"
						layerOptions={{
							type: "fill",
							paint: mapStyles.incidentPolygon.fill,
						}}
					/>
				</MapSource>
				{!pending && (
					<MapSource
						sourceKey="incident-points"
						sourceOptions={{ type: "geojson" }}
						geoJson={pointFeatureCollection}>
						<MapLayer
							layerKey="incident-points-animate"
							layerOptions={{
								type: "circle",
								filter,
								paint: mapStyles.incidentPoint.animatedFill,
								layout: isHovered ? noneLayout : visibleLayout,
							}}
							onAnimationFrame={this.handleAnimationKeyframe}
						/>
						<MapLayer
							layerKey="incident-points-fill"
							layerOptions={{
								type: "circle",
								paint: isHovered ? mapStyles.incidentPoint.dimFill : mapStyles.incidentPoint.fill,
							}}
							onClick={this.handleIncidentClick}
							onMouseEnter={this.handleIncidentMouseEnter}
							onMouseLeave={this.handleIncidentMouseLeave}
						/>
						{/*
                    <MapLayer
                        layerKey="incident-point-icon"
                        layerOptions={{
                            type: 'symbol',
                            layout: {
                                'icon-image': ['get', 'hazardIcon'],
                                'icon-size': 0.2,
                            },
                            paint: isHovered
                                ? { 'icon-opacity': 0.1 }
                                : { 'icon-opacity': 0.9 },
                        }}
                    />
                    */}
						{incidentLngLat && (
							<MapTooltip
								coordinates={incidentLngLat}
								tooltipOptions={tooltipOptions}
								onHide={this.handleIncidentClose}>
								<IncidentInfo
									incident={incident}
									wardsMap={wardsMap}
									provincesMap={provincesMap}
									districtsMap={districtsMap}
									municipalitiesMap={municipalitiesMap}
									className={styles.incidentInfo}
									showEditIncident={showEditIncident}
									showDeleteIncident={showDeleteIncident}
									onEditIncident={this.handleEditIncidentClick}
									onDeleteIncident={this.handleIncidentDelete}
									incidentDeletePending={incidentDeletePending}
									language={language}
								/>
							</MapTooltip>
						)}
						<MapState attributes={mapHoverAttributes} attributeKey="hover" />
					</MapSource>
				)}

				{showEditIncidentModal && (
					<AddIncidentForm
						lossServerId={lossServerId}
						incidentServerId={incidentServerId}
						incidentDetails={incident}
						onIncidentChange={this.handleIncidentEdit}
						onLossChange={this.handleLossEdit}
						closeModal={this.handleCloseEditModal}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createRequestClient(requestOptions)(IncidentMap));
