import React from "react";
import { Translation } from "react-i18next";
import { connect } from "react-redux";
import Faram, { requiredCondition } from "@togglecorp/faram";
import { _cs, isNotDefined } from "@togglecorp/fujs";

import Visualizations from "./Visualizations";

import styles from "./styles.module.scss";

import CommonMap from "#components/CommonMap";
import GeoResolve from "#components/GeoResolve";
import LossDetails from "#components/LossDetails";
import RegionSelectInput from "#components/RegionSelectInput";
import Map from "#re-map";
import MapContainer from "#re-map/MapContainer";
import Button from "#rsca/Button";
import Modal from "#rscv/Modal";
import {
	districtsSelector,
	hazardTypesSelector,
	languageSelector,
	mapStyleSelector,
	municipalitiesSelector,
	provincesSelector,
	regionsSelector,
	wardsSelector,
} from "#selectors";
import { saveChart } from "#utils/common";
import { getSanitizedIncidents } from "../common";

const propTypes = {};

const defaultProps = {};

const mapStateToProps = (state) => ({
	mapStyle: mapStyleSelector(state),
	regions: regionsSelector(state),
	provinces: provincesSelector(state),
	districts: districtsSelector(state),
	municipalities: municipalitiesSelector(state),
	wards: wardsSelector(state),
	hazardTypes: hazardTypesSelector(state),
	language: languageSelector(state),
});

const emptyList = [];

const isValidIncident = ({ ward, district, municipality, province }, { adminLevel, geoarea }) => {
	switch (adminLevel) {
		case 1:
			return geoarea === province;
		case 2:
			return geoarea === district;
		case 3:
			return geoarea === municipality;
		case 4:
			return geoarea === ward;
		default:
			return false;
	}
};

const isRegionValid = (region) => region && region.adminLevel && region.geoarea;

class Comparative extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);

		this.state = {
			faramValues: {},
			faramErrors: {},
			rightPaneExpanded: true,
			// comparisionStarted: false,
		};

		this.schema = {
			fields: {
				region1: [requiredCondition],
				region2: [requiredCondition],
			},
		};
	}

	componentDidMount() {
		const mapControlsBottomRight = document.getElementsByClassName("mapboxgl-ctrl-bottom-right")[0];
		const mapControlsTopLeft = document.getElementsByClassName("mapboxgl-ctrl-top-left")[0];

		if (mapControlsBottomRight) {
			this.mapControlsBottomRight = mapControlsBottomRight;
			this.previousMapControlBottomRightDisplay = mapControlsBottomRight.style.display;
			mapControlsBottomRight.style.display = "none";
		}

		if (mapControlsTopLeft) {
			this.mapControlsTopLeft = mapControlsTopLeft;
			this.previousMapControlTopLeftDisplay = mapControlsTopLeft.style.display;
			mapControlsTopLeft.style.display = "none";
		}
	}

	componentWillUnmount() {
		if (this.mapControlsBottomRight) {
			this.mapControlsBottomRight.style.display = this.previousMapControlBottomRightDisplay;
		}

		if (this.mapControlsTopLeft) {
			this.mapControlsTopLeft.style.display = this.previousMapControlTopLeftDisplay;
		}
	}

	handleSaveClick = () => {
		saveChart("comparative", "comparative");
	};

	filterIncidents = (incidents = emptyList, regions, region) => {
		if (!region) {
			return [];
		}

		const sanitizedIncidents = getSanitizedIncidents(incidents, regions, {}).filter(
			(params) =>
				isNotDefined(region) || isNotDefined(region.adminLevel) || isValidIncident(params, region)
		);

		return sanitizedIncidents;
	};

	handleFaramChange = (faramValues, faramErrors) => {
		this.setState({
			faramValues,
			faramErrors,
		});
	};

	handleFaramValidationSuccess = (faramValues) => {
		this.setState({
			faramValues,
			// comparisionStarted: true,
		});
	};

	handleFaramValidationFailure = (faramErrors) => {
		this.setState({ faramErrors });
	};

	render() {
		const {
			className,
			lossAndDamageList,
			mapStyle,
			minDate,
			regions,
			closeModal,
			language: { language },
		} = this.props;

		const { faramValues, faramErrors, rightPaneExpanded } = this.state;

		const { region1, region2 } = faramValues;

		const region1Incidents = this.filterIncidents(lossAndDamageList, regions, region1);
		const region2Incidents = this.filterIncidents(lossAndDamageList, regions, region2);

		return (
			<Modal
				className={_cs(className, styles.comparative, language === "np" && styles.languageFont)}>
				<header className={styles.header}>
					<Faram
						className={styles.regionSelectionForm}
						onChange={this.handleFaramChange}
						onValidationFailure={this.handleFaramValidationFailure}
						// onValidationSuccess={this.handleFaramValidationSuccess}
						schema={this.schema}
						value={faramValues}
						error={faramErrors}
						disabled={false}>
						<Translation>
							{(t) => (
								<>
									<RegionSelectInput
										label={t("First location")}
										placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
										className={styles.regionInput}
										faramElementName="region1"
										showHintAndError={false}
										// autoFocus
									/>
									<RegionSelectInput
										label={t("Second location")}
										placeholder={language === "en" ? "Select an option" : "विकल्प चयन गर्नुहोस्"}
										className={styles.regionInput}
										faramElementName="region2"
										showHintAndError={false}
										disabled={!faramValues.region1}
									/>
								</>
							)}
						</Translation>
					</Faram>
					<Button
						title="Download Chart"
						className={styles.chartDownload}
						transparent
						disabled={!region1 && !region2}
						onClick={this.handleSaveClick}
						iconName="download"
					/>
					<Button onClick={closeModal} iconName="close" className={styles.closeButton} />
				</header>
				<div className={styles.content}>
					{!region1 && !region2 ? (
						<div className={styles.preComparisionMessage}>
							<Translation>{(t) => <span>{t("SelectMessage")}</span>}</Translation>
						</div>
					) : (
						<div className={styles.comparisionContainer}>
							<div className={styles.titleContainer}>
								{isRegionValid(faramValues.region1) && (
									<h2>
										<GeoResolve data={region1} />
									</h2>
								)}
								{isRegionValid(faramValues.region2) && (
									<h2>
										<GeoResolve data={region2} />
									</h2>
								)}
							</div>
							<div className={styles.mapContainer}>
								{isRegionValid(faramValues.region1) && (
									<Map
										mapStyle={mapStyle}
										mapOptions={{
											logoPosition: "top-left",
											minZoom: 5,
										}}
										// debug

										scaleControlShown
										scaleControlPosition="bottom-right"
										navControlShown
										navControlPosition="bottom-right">
										<MapContainer className={styles.map1} />
										<CommonMap sourceKey="comparative-first" region={faramValues.region1} debug />
									</Map>
								)}
								{isRegionValid(faramValues.region2) && (
									<Map
										mapStyle={mapStyle}
										mapOptions={{
											logoPosition: "top-left",
											minZoom: 5,
										}}
										// debug

										scaleControlShown
										scaleControlPosition="bottom-right"
										navControlShown
										navControlPosition="bottom-right">
										<MapContainer className={styles.map2} />
										<CommonMap sourceKey="comparative-second" region={faramValues.region2} debug />
									</Map>
								)}
							</div>
							<div className={styles.visualizations} id="comparative">
								<div className={styles.aggregatedStats}>
									{isRegionValid(faramValues.region1) && (
										<LossDetails
											className={styles.aggregatedStat}
											data={region1Incidents}
											minDate={minDate}
										/>
									)}
									{isRegionValid(faramValues.region2) && (
										<LossDetails
											className={styles.aggregatedStat}
											data={region2Incidents}
											minDate={minDate}
										/>
									)}
								</div>
								<div className={styles.otherVisualizations}>
									{isRegionValid(faramValues.region1) && (
										<div className={styles.region1Container}>
											<Visualizations lossAndDamageList={region1Incidents} />
										</div>
									)}
									{isRegionValid(faramValues.region2) && (
										<div className={styles.region2Container}>
											<Visualizations lossAndDamageList={region2Incidents} />
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</Modal>
		);
	}
}

export default connect(mapStateToProps)(Comparative);
