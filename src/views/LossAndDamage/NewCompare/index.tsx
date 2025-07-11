/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { connect } from "react-redux";

import { _cs, isNotDefined } from "@togglecorp/fujs";
import Faram, { requiredCondition } from "@togglecorp/faram";
import * as HtmltoImage from "html-to-image";

import { Translation } from "react-i18next";
import domtoimage from "dom-to-image";
import Button from "#rsca/Button";
import Modal from "#rscv/Modal";

import LossDetails from "#components/LossDetails";
import GeoResolve from "#components/GeoResolve";

import Map from "#re-map";
import MapContainer from "#re-map/MapContainer";

import {
	mapStyleSelector,
	regionsSelector,
	provincesSelector,
	districtsSelector,
	municipalitiesSelector,
	wardsSelector,
	hazardTypesSelector,
} from "#selectors";

import { saveChart } from "#utils/common";

import { createSingleList } from "#components/RegionSelectInput/util.js";
import ChoroplethMap from "#components/ChoroplethMap";
import Icon from "#rscg/Icon";
import { getSanitizedIncidents, metricMap } from "../common";

import styles from "./styles.module.scss";
import AreaChartVisual from "../AreaChart";
import BarChartVisual from "../Barchart";
import HazardWise from "../HazardWise";
import Dropdown from "../DropDown";

import {
	tooltipRenderer,
	generateOverallDataset,
	colorGrade,
	generateColor,
	generateMapState,
	generatePaint,
} from "../utils/utils";
import { legendItems } from "../Legend";

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

class NewCompare extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	constructor(props) {
		super(props);
		this.imageDownloadRef = React.createRef();
		this.state = {
			faramValues: {},
			faramErrors: {},
			rightPaneExpanded: true,
			mapStateValueOptimized1: [],
			mapStateValueOptimized2: [],
			barchartData1: [],
			barchartData2: [],
			chartData1: [],
			chartData2: [],
			hazardSummary1: [],
			hazardSummary2: [],
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

	messageForNoData = (noData, language) => {
		const noOptionSelected = language === "en" ? "No comparison is made" : "तुलना भइरहेको छैन";
		return (
			<div className={styles.preComparisionMessage}>
				<h3 className={styles.headerText}>{noData ? "" : noOptionSelected}</h3>
				<p className={styles.textOption}>
					{language === "en"
						? `Select ${noData ? "a region" : "different sections"} to compare`
						: `तुलना गर्न  ${noData ? "क्षेत्र" : "विभिन्न खण्डहरू"} छनोट गर्नुहोस्`}
				</p>
			</div>
		);
	};

	render() {
		const {
			className,
			lossAndDamageList,
			mapStyle,
			minDate,
			regions,
			closeModal,
			getDataAggregatedByYear,
			selectOption,
			valueOnclick,
			getHazardsCount,
			hazardTypes,
			provinces,
			municipalities,
			districts,
			setSelectOption,
			setVAlueOnClick,
			currentSelection,
			language,
			regionRadio,
			incidentTypeData,
			finalFilters,
			dateTimeStamp,
		} = this.props;

		const {
			faramValues,
			faramErrors,
			rightPaneExpanded,
			mapStateValueOptimized1,
			mapStateValueOptimized2,
			barchartData1,
			barchartData2,
			chartData1,
			chartData2,
			hazardSummary1,
			hazardSummary2,
		} = this.state;

		const { region1, region2 } = faramValues;

		const region1Incidents = this.filterIncidents(lossAndDamageList, regions, region1);
		const region2Incidents = this.filterIncidents(lossAndDamageList, regions, region2);

		const RegionOptions = createSingleList(provinces, districts, municipalities).map((region) => ({
			adminLevel: region.adminLevel,
			geoarea: region.id,
			label: language === "en" ? region.title : region.title_ne,
		}));

		const dropDownClickHandler = (item, index, elementName) => {
			const data = { adminLevel: item.adminLevel, geoarea: item.geoarea };
			this.setState({ faramValues: { ...faramValues, [elementName]: data } });
			const summaryType =
				item.adminLevel === 1
					? "province_wise"
					: item.adminLevel === 2
					? "district_wise"
					: item.adminLevel === 3
					? "municipality_wise"
					: "ward_wise";
			const federalFilter =
				item.adminLevel === 1
					? `province=${item.geoarea}`
					: item.adminLevel === 2
					? `district=${item.geoarea}`
					: item.adminLevel === 3
					? `municipality=${item.geoarea}`
					: "province=";

			fetch(
				`${
					process.env.REACT_APP_API_SERVER_URL
				}/incident/analytics/?${federalFilter}&incident_type=incident_count&hazard=${finalFilters.hazard.join(
					","
				)}&summary_type=${summaryType}&incident_on__gt=${
					finalFilters.incident_on__gt.split("+")[0]
				}&incident_on__lt=${finalFilters.incident_on__lt.split("+")[0]}`
			)
				.then((res) => res.json())
				.then((response) => {
					const { data: finalData, dateWise, hazardWise } = response.results;
					const mapData = { id: finalData[0].federalId, value: finalData[0].count };
					const barchartData = {
						name: language === "en" ? finalData[0].federalTitleEn : finalData[0].federalTitleNe,
						value: finalData[0].count,
					};

					const chartDataFinal =
						dateWise &&
						dateWise.length &&
						dateWise
							.map((itm) => ({
								incidentMonthTimestamp: dateTimeStamp(itm.date),
								summary: { count: itm.count },
							}))
							.sort((x, y) => x.incidentMonthTimestamp - y.incidentMonthTimestamp);

					const hazardTypeData = Object.values(hazardTypes);
					const hazardSummaryData = {};
					const hazardSummaryDataCalculation =
						hazardWise &&
						hazardWise.length &&
						hazardWise.map((items, id) => {
							const selectedHazardDetails = hazardTypeData.find((itm) => itm.id === items.hazard);
							const datas = {
								hazardDetail: selectedHazardDetails,
								summary: { count: items.count },
							};
							hazardSummaryData[`${selectedHazardDetails.id}`] = datas;
							return null;
						});

					if (elementName === "region1") {
						this.setState({ mapStateValueOptimized1: [mapData] });
						this.setState({ barchartData1: [barchartData] });
						this.setState({ chartData1: chartDataFinal });
						this.setState({ hazardSummary1: hazardSummaryData });
					} else {
						this.setState({ mapStateValueOptimized2: [mapData] });
						this.setState({ barchartData2: [barchartData] });
						this.setState({ chartData2: chartDataFinal });
						this.setState({ hazardSummary2: hazardSummaryData });
					}
				});
		};

		const clearValues = (element: string) => {
			if (element === "region1") {
				this.setState({ mapStateValueOptimized1: [] });
				this.setState({ barchartData1: [] });
				this.setState({ chartData1: [] });
				this.setState({ hazardSummary1: [] });
			} else {
				this.setState({ mapStateValueOptimized2: [] });
				this.setState({ barchartData2: [] });
				this.setState({ chartData2: [] });
				this.setState({ hazardSummary2: [] });
			}
			this.setState({ faramValues: { ...faramValues, [element]: null } });
		};

		const filterGeoArea = (value) => {
			const totalData = createSingleList(provinces, districts, municipalities);
			if (value) {
				const filteredData = totalData.filter(
					(item) => item.adminLevel === value.adminLevel && item.id === value.geoarea
				);

				return filteredData;
			}
			return [];
		};
		const mapStateValue = (Region, Incidents) => {
			const geoareas = filterGeoArea(Region);
			const regionLevel = Region && Region.adminLevel;

			const { mapping, aggregatedStat } = generateOverallDataset(Incidents, regionLevel);

			const mapState = Object.values(mapping).map((item) => ({
				id: geoareas[0].id,
				value: item[currentSelection.key],
			}));
			return mapState;
		};

		const colorRange = [];

		for (const item of legendItems) {
			colorRange.push(item.value, item.color);
		}
		const colorPaint = generatePaint(colorRange);

		const handleDownload = async () => {
			if (this.imageDownloadRef.current) {
				const width = this.imageDownloadRef.current.scrollWidth;
				const height = this.imageDownloadRef.current.scrollHeight;
				await HtmltoImage.toPng(this.imageDownloadRef.current, { width, height }).then((img) => {
					const link = document.createElement("a");
					link.href = img;
					link.download = "Compare.png";
					link.click();
				});
			}
		};
		return (
			<Modal className={_cs(className, styles.comparative)}>
				<div className={styles.regionHead}>
					<h1 className={styles.compareText}>
						{language === "en" ? "COMPARE" : "तुलना गर्नुहोस्"}
					</h1>
					<Button
						title={language === "en" ? "Download Chart" : "चार्ट डाउनलोड गर्नुहोस्"}
						className={styles.chartDownload}
						transparent
						disabled={!region1 && !region2}
						onClick={handleDownload}
						iconName="download"
					/>
					<Button onClick={closeModal} iconName="close" className={styles.closeButton} />
				</div>
				<header className={styles.header}>
					<div className={styles.regionSelectionForm}>
						<Dropdown
							elementName="region1"
							label={language === "en" ? "Enter a Location to compare" : "स्थान छनोट गर्नुहोस्"}
							className={styles.regionInput}
							placeholder={language === "en" ? "Select an Option" : "विकल्प छनोट गर्नुहोस्"}
							dropdownOption={RegionOptions}
							icon={false}
							dropDownClickHandler={dropDownClickHandler}
							deleteicon
							clearValues={clearValues}
							inputSearch
						/>
						<Dropdown
							elementName="region2"
							label={language === "en" ? "Enter a Location to compare" : "स्थान छनोट गर्नुहोस्"}
							className={styles.regionInput}
							placeholder={language === "en" ? "Select an Option" : "विकल्प छनोट गर्नुहोस्"}
							dropdownOption={RegionOptions}
							icon={false}
							dropDownClickHandler={dropDownClickHandler}
							deleteicon
							clearValues={clearValues}
							inputSearch
						/>
					</div>
				</header>
				<div className={_cs(styles.content)}>
					{!region1 && !region2 ? (
						this.messageForNoData(false, language)
					) : (
						<div className={styles.comparisionContainer} ref={this.imageDownloadRef}>
							<div className={styles.mapContainer}>
								{mapStateValueOptimized1.length > 0 ? (
									<Map
										mapStyle={mapStyle}
										mapOptions={{
											logoPosition: "top-left",
											minZoom: 5,
											preserveDrawingBuffer: true,
										}}
										// debug

										scaleControlShown
										scaleControlPosition="bottom-right"
										navControlShown
										navControlPosition="bottom-right">
										<MapContainer className={styles.map1} />
										<ChoroplethMap
											sourceKey="comparative-first"
											paint={colorPaint}
											// mapState={mapStateValue(
											//   faramValues.region1,
											//   region1Incidents,
											// )}
											mapState={mapStateValueOptimized1}
											region={faramValues.region1}
											tooltipRenderer={(prop) =>
												tooltipRenderer(prop, currentSelection.name, regionRadio.id, language)
											}
											isDamageAndLoss
										/>
									</Map>
								) : (
									this.messageForNoData(true, language)
								)}
								{mapStateValueOptimized2.length > 0 ? (
									<Map
										mapStyle={mapStyle}
										mapOptions={{
											logoPosition: "top-left",
											minZoom: 5,
											preserveDrawingBuffer: true,
										}}
										// debug

										scaleControlShown
										scaleControlPosition="bottom-right"
										navControlShown
										navControlPosition="bottom-right">
										<MapContainer className={styles.map2} />
										<ChoroplethMap
											sourceKey="comparative-second"
											paint={colorPaint}
											// mapState={mapStateValue(
											//   faramValues.region2,
											//   region2Incidents,
											// )}
											mapState={mapStateValueOptimized2}
											region={faramValues.region2}
											tooltipRenderer={(prop) =>
												tooltipRenderer(prop, currentSelection.name, regionRadio.id, language)
											}
											isDamageAndLoss
										/>
									</Map>
								) : (
									this.messageForNoData(true, language)
								)}
							</div>
							<div className={styles.visualizations}>
								<div className={styles.otherVisualizations}>
									{barchartData1.length > 0 ? (
										<BarChartVisual
											className={styles.region1Container}
											data={barchartData1}
											regionRadio={region1}
											selectOption={selectOption}
											valueOnclick={valueOnclick}
											language={language}
											barChartData={barchartData1}
										/>
									) : (
										<div />
									)}
									{barchartData2.length > 0 ? (
										<BarChartVisual
											className={styles.region2Container}
											data={barchartData2}
											regionRadio={region2}
											selectOption={selectOption}
											valueOnclick={valueOnclick}
											language={language}
											barChartData={barchartData2}
										/>
									) : (
										<div />
									)}
								</div>
								<div className={styles.otherVisualizations}>
									{chartData1 && chartData1.length > 0 ? (
										<div className={styles.region1Container}>
											<AreaChartVisual
												// data={getDataAggregatedByYear(region1Incidents)}
												selectOption={selectOption}
												language={language}
												data={chartData1}
											/>
										</div>
									) : (
										<div />
									)}
									{chartData2 && chartData2.length > 0 ? (
										<div className={styles.region2Container}>
											<AreaChartVisual
												// data={getDataAggregatedByYear(region2Incidents)}
												selectOption={selectOption}
												language={language}
												data={chartData2}
											/>
										</div>
									) : (
										<div />
									)}
								</div>
								<div className={styles.otherVisualizations}>
									{hazardSummary1.length > 0 ? (
										<div className={styles.region1Container}>
											<HazardWise
												// data={getHazardsCount(region1Incidents, hazardTypes)}
												selectOption={selectOption}
												language={language}
												data={hazardSummary1}
											/>
										</div>
									) : (
										<div />
									)}
									{hazardSummary2.length > 0 ? (
										<div className={styles.region2Container}>
											<HazardWise
												// data={getHazardsCount(region2Incidents, hazardTypes)}
												selectOption={selectOption}
												language={language}
												data={hazardSummary2}
											/>
										</div>
									) : (
										<div />
									)}
								</div>
								{(barchartData1.length > 0 || barchartData2.length > 0) && (
									<Translation>
										{(t) => (
											<div className={styles.value}>
												<span className={styles.label}>{t("Data sources")}:</span>
												<span className={styles.source}>{t("Nepal Police")}</span>
												<div className={styles.source}>
													<span className={styles.text}>{t("DRR Portal")}</span>
													<a
														className={styles.link}
														target="_blank"
														rel="noopener noreferrer"
														href="http://drrportal.gov.np">
														<Icon name="externalLink" />
													</a>
												</div>
											</div>
										)}
									</Translation>
								)}
							</div>
						</div>
					)}
				</div>
			</Modal>
		);
	}
}

export default connect(mapStateToProps)(NewCompare);
