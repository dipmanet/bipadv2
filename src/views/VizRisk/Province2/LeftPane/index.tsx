/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */

import React, { useEffect, useRef, useState } from "react";
import {
	Label,
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	ComposedChart,
	Legend,
	Area,
	Line,
	LabelList,
} from "recharts";
import Hexagon from "react-hexagon";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import TempIcon from "#resources/icons/Temp.svg";
import AvgRainFall from "#resources/icons/RainFall.svg";
import NavButtons from "../Components/NavButtons";
import CriticalInfraLegends from "../Legends/CriticalInfraLegends";
import styles from "./styles.module.scss";
import VRLegend from "../Components/VRLegend/index";
import DemoGraphicsLegends from "../Legends/DemographicsLegends/index";
import {
	renderLegendPopulaion,
	CustomTooltip,
	populationCustomTooltip,
	renderLegend,
	landCoverCustomTooltip,
	parseStringToNumber,
	cITooltip,
	customLableList,
	currentAverageTemp,
} from "../Functions/index";
import TempChart from "../Charts/TempChart";
import LandCoverChart from "../Charts/LandCoverChart";
import PopulationChart from "../Charts/PopulationChart";
import DemographicsPopInfo from "../Components/DemographicsPopInfo";
import VRLegendHazard from "../Components/VRLegendHazard/index";
import VRLegendFatality from "../Components/VRLegendFatality";
import VRLegendTemp from "../Components/VRLegendTemp";
import VRLegendPre from "../Components/VRLegendPre";
import DRRCountBox from "../Components/DRRCountBox/index";
import AlertsChart from "../Charts/AlertsChart";
import AlertsLegend from "../Legends/AlertLegends";
import { hdiData, hpiData } from "../Data/vulnerabilityData";
import CIChart from "../Charts/CIChart";
import EstimatedLossChart from "../Charts/EstimatedLossChart";
import FloodHistoryLegends from "../Legends/FloodHazardLegends";
import LandCoverLegends from "../Legends/LandCoverLegends";

interface State {
	showInfo: boolean;
}

interface RealTimeDataTypes {
	recordedDate: string;
	currentTemp: string;
	minimumTemp: string;
	maximumTemp: string;
	rainfall: string;
}

interface Props {
	introHtml: string;
	handleLegendClicked: (item: string) => void;
	totalFloodLossData: any;
	totalLandslideLossData: any;
	handleNext: any;
	handlePrev: any;
	disableNavLeftBtn: any;
	disableNavRightBtn: any;
	pagenumber: number;
	totalPages: number;
	pending: boolean;
	leftElement: number;
	legendElement: string;
	clickedFatalityInfraDamage: any;
	handleFatalityInfraLayer: (item: string, i: number) => void;
	tempData: any;
	tempChartData: any;
	landCoverData: any;
	setfloodLayer: any;
	hazardLegendClickedArr: [];
	populationData: [];
	criticalElement: any;
	handleCriticalInfra: () => void;
	alertsChartData: [];
	clickedArr: [];
	clickedHazardItem: any;
	handleMultipleHazardLayerDamageLoss: any;
	handleMultipleHazardLayer: any;
	exposureElementArr: number[];
	active: any;
	setActivePage: any;
	realTimeData: RealTimeDataTypes;
	page1Legend1InroHtml: string;
	page1Legend2InroHtml: string;
	page1Legend3InroHtml: string;
	legentItemDisabled: boolean;
	CIState: any;
	climateLineChartData: [];
	tempSelectedData: any;
	handleClimateTemp: (item: string) => void;
	prepSelectedData: any;
	handleClimatePrep: (item: string) => void;
	climateDataType: any;
	climateDataYearWise: any;
	districtIdIs: any;
	vulnrerability: any;
	setVulnerability: any;
	cI: any;
}
interface HdiDataType {
	id: number;
	provinceName: string;
	value: number;
}

type HdiData = HdiDataType[];

function Leftpane(props: Props) {
	const {
		introHtml,
		handleLegendClicked,
		totalFloodLossData,
		totalLandslideLossData,
		handleNext,
		handlePrev,
		disableNavLeftBtn,
		disableNavRightBtn,
		pagenumber,
		totalPages,
		pending,
		leftElement,
		legendElement,
		clickedFatalityInfraDamage,
		handleFatalityInfraLayer,
		tempData,
		tempChartData,
		landCoverData,
		setfloodLayer,
		hazardLegendClickedArr,
		populationData,
		criticalElement,
		handleCriticalInfra,
		alertsChartData,
		clickedArr,
		clickedHazardItem,
		handleMultipleHazardLayerDamageLoss,
		handleMultipleHazardLayer,
		exposureElementArr,
		active,
		setActivePage,
		realTimeData,
		page1Legend1InroHtml,
		page1Legend2InroHtml,
		page1Legend3InroHtml,
		legentItemDisabled,
		CIState,
		climateLineChartData,
		tempSelectedData,
		handleClimateTemp,
		prepSelectedData,
		handleClimatePrep,
		climateDataType,
		climateDataYearWise,
		districtIdIs,
		vulnrerability,
		setVulnerability,
		handleEarthQuakeRisk,
		earthquakeRisk,
		contactData,
	} = props;

	const [cIChartData, setcIChartData] = useState([]);
	const [cITypeName, setcITypeName] = useState([]);
	const [climateBarChartData, setclimateBarChartData] = useState([]);
	const [climateChartTitle, setclimateChartTitle] = useState("");
	const [vulChartData, setvulChartData] = useState<HdiData>([]);
	const [estimatedDataSelection, setestimatedDataSelection] = useState([]);
	const vrSideBarRef = useRef<HTMLDivElement>(null);

	const temperatureRefPeriod = [
		{
			name: "Reference Period(1981-2010)",
			value: "temp2010",
		},
		{
			name: "Medium Term(2016-2045)",
			value: "temp2045",
		},
		{
			name: "Long Term(2036-2065)",
			value: "temp2065",
		},
	];
	const precipationRefPeriod = [
		{
			name: "Reference Period(1981-2010)",
			value: "prep2010",
		},
		{
			name: "Medium Term(2016-2045)",
			value: "prep2045",
		},
		{
			name: "Long Term(2036-2065)",
			value: "prep2065",
		},
	];

	const districtIdToName = (id: number) => {
		if (id === 16) {
			return "Saptari";
		}
		if (id === 33) {
			return "Bara";
		}
		if (id === 34) {
			return "Parsa";
		}
		if (id === 17) {
			return "Dhanusa";
		}
		if (id === 18) {
			return "Mahottari";
		}
		if (id === 19) {
			return "Sarlahi";
		}
		if (id === 32) {
			return "Rautahat";
		}
		if (id === 15) {
			return "Siraha";
		}
		return "";
	};

	useEffect(() => {
		if (clickedHazardItem === "Landslide Hazard") {
			setestimatedDataSelection(totalLandslideLossData);
		} else {
			setestimatedDataSelection(totalFloodLossData);
		}
	}, [clickedHazardItem, totalFloodLossData, totalLandslideLossData]);

	useEffect(() => {
		const { cI } = props;
		if (cI) {
			const categoriesCriticalArr: any = [...new Set(cI.map((item: any) => item.resourceType))];
			setcITypeName(categoriesCriticalArr);
			setcIChartData(
				categoriesCriticalArr.map((item: any) => ({
					name: item.charAt(0).toUpperCase() + item.slice(1),
					value: cI.filter((ci: any) => ci.resourceType === item).length,
				}))
			);
		}
	}, [props]);

	useEffect(() => {
		if (vulnrerability === "Human Development Index") {
			setvulChartData(hdiData);
		} else {
			setvulChartData(hpiData);
		}
	}, [vulnrerability]);

	useEffect(() => {
		if (districtIdIs && vrSideBarRef.current) {
			vrSideBarRef.current.scrollTo({ top: 1000, behavior: "smooth" });
		}
	}, [districtIdIs]);

	useEffect(() => {
		if (tempSelectedData === "temp2010" && climateDataType === "Temperature") {
			setclimateBarChartData(
				climateDataYearWise.tempDataForMapUpto2010.map((item: any) => ({
					value: item.value,
					name: districtIdToName(item.id),
				}))
			);
			setclimateChartTitle("Temperature Reference Period(1981-2010)");
		}

		if (tempSelectedData === "temp2045" && climateDataType === "Temperature") {
			setclimateBarChartData(
				climateDataYearWise.tempDataForMapUpto2045.map((item: any) => ({
					value: item.value,
					name: districtIdToName(item.id),
				}))
			);
			setclimateChartTitle("Temperature Reference Period(2016-2045)");
		}
		if (tempSelectedData === "temp2065" && climateDataType === "Temperature") {
			setclimateBarChartData(
				climateDataYearWise.tempDataForMapUpto2065.map((item: any) => ({
					value: item.value,
					name: districtIdToName(item.id),
				}))
			);
			setclimateChartTitle("Temperature Reference Period(2036-2065)");
		}
		if (prepSelectedData === "prep2010" && climateDataType === "Precipitation") {
			setclimateBarChartData(
				climateDataYearWise.prepDataForMapUpto2010.map((item: any) => ({
					value: item.value,
					name: districtIdToName(item.id),
				}))
			);
			setclimateChartTitle("Precipitation Reference Period(1981-2010)");
		}
		if (prepSelectedData === "prep2045" && climateDataType === "Precipitation") {
			setclimateBarChartData(
				climateDataYearWise.prepDataForMapUpto2045.map((item: any) => ({
					value: item.value,
					name: districtIdToName(item.id),
				}))
			);
			setclimateChartTitle("Precipitation Reference Period(2016-2045)");
		}
		if (prepSelectedData === "prep2065" && climateDataType === "Precipitation") {
			setclimateBarChartData(
				climateDataYearWise.prepDataForMapUpto2065.map((item: any) => ({
					value: item.value,
					name: districtIdToName(item.id),
				}))
			);
			setclimateChartTitle("Precipitation Reference Period(2036-2065)");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tempSelectedData, prepSelectedData, climateDataType]);

	const firstpageLegendItems = ["Adminstrative Map", "Landcover", "Population By District"];
	const hazardIncidentLegendName = ["Flood Hazard", "Landslide Hazard"];

	return (
		<>
			<div className={styles.vrSideBar} ref={vrSideBarRef}>
				<div className={styles.leftTopBar} />
				<div
					style={{ textAlign: "initial" }}
					className={styles.mainIntroHtmlFromAPI}
					dangerouslySetInnerHTML={{
						__html: introHtml,
					}}
				/>

				{leftElement === 0 && legendElement === "Adminstrative Map" && (
					<>
						<div
							style={{ textAlign: "initial" }}
							dangerouslySetInnerHTML={{
								__html: page1Legend1InroHtml,
							}}
						/>
						<div className={styles.iconRow}>
							<div className={styles.infoIconsContainer}>
								<div className={styles.descriptionCotainer}>
									<div className={styles.iconTitleDate}>
										Recorderd Time:
										{"  "}
										{realTimeData !== undefined
											? realTimeData && realTimeData.recordedDate.slice(0, 10)
											: "Nodata"}
									</div>
								</div>
							</div>
						</div>
						<div className={styles.iconRow}>
							<div className={styles.infoIconsContainer}>
								<ScalableVectorGraphics className={styles.infoIconMax} src={TempIcon} />
								<div className={styles.descriptionCotainer}>
									<div className={styles.iconTitle}>
										{realTimeData !== undefined
											? currentAverageTemp(realTimeData.currentTemp)
											: "- "}
										℃
									</div>
									<div className={styles.iconText}>Current</div>
								</div>
							</div>
							<div className={styles.infoIconsContainer}>
								<ScalableVectorGraphics className={styles.infoIconMax} src={TempIcon} />
								<div className={styles.descriptionCotainer}>
									<div className={styles.iconTitle}>
										{realTimeData !== undefined ? realTimeData.maximumTemp : "- "}℃
									</div>
									<div className={styles.iconText}>Maximum</div>
								</div>
							</div>
							<div className={styles.infoIconsContainer}>
								<ScalableVectorGraphics className={styles.infoIconMax} src={TempIcon} />
								<div className={styles.descriptionCotainer}>
									<div className={styles.iconTitle}>
										{" "}
										{realTimeData !== undefined ? realTimeData.minimumTemp : "- "}℃
									</div>
									<div className={styles.iconText}>Minimum</div>
								</div>
							</div>
						</div>
						<div className={styles.iconRow}>
							<div className={styles.infoIconsContainer}>
								<ScalableVectorGraphics className={styles.infoIcon} src={AvgRainFall} />
								<div className={styles.descriptionCotainer}>
									<div className={styles.iconTitle}>
										{" "}
										{realTimeData !== undefined ? realTimeData.rainfall : "- "} mm
									</div>
									<div className={styles.iconText}>Daily Rainfall</div>
								</div>
							</div>
							<div className={styles.infoIconsContainer}>
								<ScalableVectorGraphics className={styles.infoIcon} src={AvgRainFall} />
								<div className={styles.descriptionCotainer}>
									<div className={styles.iconTitle}>
										{" "}
										{tempData &&
											parseStringToNumber(
												tempData
													.filter((rainfall: any) => rainfall.rainfall)
													.map((item: any) => item.rainfall)[0]
											)}{" "}
										mm
									</div>
									<div className={styles.iconText}>Annual Rainfall</div>
								</div>
							</div>
						</div>

						<div className={styles.climateChart}>
							<p
								style={{
									marginBottom: "0px",
									marginTop: "30px",
									fontWeight: "bold",
									fontSize: "22px",
								}}>
								Temperature
							</p>
							<TempChart
								tempChartData={tempChartData}
								renderLegend={renderLegend}
								CustomTooltip={CustomTooltip}
							/>
						</div>
					</>
				)}

				{leftElement === 0 && legendElement === "Landcover" && (
					<>
						<div
							style={{ textAlign: "initial" }}
							dangerouslySetInnerHTML={{
								__html: page1Legend2InroHtml,
							}}
						/>

						<p
							style={{
								fontWeight: "bold",
								textAlign: "center",
								fontSize: "21px",
								margin: "15px",
							}}
						/>
						<LandCoverChart
							landCoverData={landCoverData}
							landCoverCustomTooltip={landCoverCustomTooltip}
						/>
						<LandCoverLegends />
					</>
				)}
				{leftElement === 0 && legendElement === "Population By District" && (
					<>
						<div
							style={{ textAlign: "initial" }}
							dangerouslySetInnerHTML={{
								__html: page1Legend3InroHtml,
							}}
						/>
						<DemographicsPopInfo populationData={populationData} />
						<div className={styles.chartContainer}>
							<PopulationChart
								populationCustomTooltip={populationCustomTooltip}
								populationData={populationData}
								renderLegendPopulaion={renderLegendPopulaion}
							/>
							<DemoGraphicsLegends demographicsData={populationData} />
						</div>
					</>
				)}

				{/* Legend Section */}
				{leftElement === 0 && (
					<VRLegend>
						<div
							className={
								disableNavLeftBtn || disableNavRightBtn || legentItemDisabled
									? styles.incidentsLegendsContainerDisabled
									: styles.incidentsLegendsContainer
							}>
							{firstpageLegendItems.length > 0 &&
								firstpageLegendItems.map((item) => (
									<div className={styles.hazardItemContainer} key={item}>
										<button
											key={item}
											type="button"
											className={
												legendElement === item ? styles.legendBtnSelected : styles.legendBtn
											}
											onClick={() => handleLegendClicked(item)}
											disabled={disableNavLeftBtn || disableNavRightBtn || legentItemDisabled}>
											<Hexagon
												style={{
													stroke: "#fff",
													strokeWidth: 50,
													fill: legendElement === item ? "white" : "#036ef0",
												}}
												className={styles.educationHexagon}
											/>
											{item}
										</button>
									</div>
								))}
						</div>
					</VRLegend>
				)}
				{leftElement === 2 && (
					<>
						<h2 style={{ fontSize: "18px", marginBottom: "15px" }}>{"Alert's Count"}</h2>
						<AlertsChart buildingsChartData={alertsChartData} />
						<AlertsLegend />
					</>
				)}
				{leftElement === 3 && (
					<>
						<h2 style={{ fontSize: "18px", marginBottom: "15px" }}>
							{vulnrerability === "Human Development Index"
								? "Human Development Index"
								: "Human Poverty Index"}
						</h2>
						<CIChart buildingsChartData={vulChartData} vulnrerability={vulnrerability} />
					</>
				)}

				{leftElement === 3 && (
					<VRLegendFatality>
						{hazardIncidentLegendName.length > 0 &&
							["Human Poverty Index", "Human Development Index"].map((item, i) => (
								<div
									className={
										legentItemDisabled
											? styles.incidentsLegendsContainer3Disabled
											: styles.incidentsLegendsContainer3
									}
									key={item}>
									<div className={styles.hazardItemContainer3}>
										<button
											key={item}
											type="button"
											className={
												vulnrerability === item ? styles.legendBtnSelected3 : styles.legendBtn3
											}
											disabled={legentItemDisabled}
											onClick={() => setVulnerability(item)}>
											<Hexagon
												style={{
													innerHeight: 80,
													stroke: "#FFFFFF",
													strokeWidth: 30,
													fill: vulnrerability === item ? "white" : "transparent",
												}}
												className={styles.educationHexagon3}
											/>
											{item}
										</button>
									</div>
								</div>
							))}
					</VRLegendFatality>
				)}

				{(leftElement === 4 || leftElement === 6) && (
					<>
						<div className={styles.hazardContainer}>
							<h4
								className={styles.hazardElementHeaderStyle}
								style={{ opacity: "0.5", fontWeight: "700" }}>
								HAZARDS
							</h4>
							{["Flood Hazard", "Induntation", "Landslide Hazard"].map((item, i) => (
								<div
									className={
										legentItemDisabled
											? styles.incidentsLegendsContainer3Disabled
											: styles.incidentsLegendsContainer3
									}
									key={item}>
									<div className={styles.hazardItemContainer3}>
										<button
											key={item}
											type="button"
											className={
												hazardLegendClickedArr[i] === 1
													? styles.legendBtnSelected3
													: styles.legendBtn3
											}
											onClick={() => handleMultipleHazardLayer(item, i)}
											disabled={legentItemDisabled || disableNavRightBtn}>
											<Hexagon
												style={{
													innerHeight: 80,
													stroke: "#FFFFFF",
													strokeWidth: 30,
													fill: hazardLegendClickedArr[i] === 1 ? "white" : "transparent",
												}}
												className={styles.educationHexagon3}
												disabled={disableNavRightBtn}
											/>
											{item}
										</button>
									</div>
								</div>
							))}
						</div>
						<VRLegend>
							<h4
								className={styles.hazardElementHeaderStyle}
								style={{ opacity: "0.5", fontWeight: "700" }}>
								RISK
							</h4>
							{hazardIncidentLegendName.length > 0 &&
								["Earthquake Risk"].map((item, i) => (
									<div
										className={
											legentItemDisabled
												? styles.incidentsLegendsContainer3Disabled
												: styles.incidentsLegendsContainer3
										}
										key={item}>
										<div className={styles.hazardItemContainer3}>
											<button
												key={item}
												type="button"
												className={
													earthquakeRisk === item ? styles.legendBtnSelected3 : styles.legendBtn3
												}
												onClick={() => handleEarthQuakeRisk(item)}
												disabled={legentItemDisabled}>
												<Hexagon
													style={{
														innerHeight: 80,
														stroke: "#FFFFFF",
														strokeWidth: 30,
														fill: earthquakeRisk === item ? "white" : "transparent",
													}}
													className={styles.educationHexagon3}
												/>
												{item}
											</button>
										</div>
									</div>
								))}
						</VRLegend>
						<FloodHistoryLegends
							hazardLegendClickedArr={hazardLegendClickedArr}
							setfloodLayer={setfloodLayer}
						/>
					</>
				)}

				{leftElement === 6 && (
					<CriticalInfraLegends
						exposureElementArr={exposureElementArr}
						clickedArr={clickedArr}
						cITypeName={cITypeName}
						right
						hide={false}
						handleCritical={handleCriticalInfra}
						criticalFlood={criticalElement}
						leftElement={leftElement}
						CIState={CIState}
					/>
				)}
				{leftElement === 6 && (
					<>
						<ResponsiveContainer className={styles.respContainer} width="100%" height={"90%"}>
							<BarChart
								width={200}
								height={1000}
								data={cIChartData}
								layout="vertical"
								margin={{ left: 25, right: 45, bottom: 25 }}>
								<CartesianGrid strokeDasharray="3 3" stroke={"#436578"} />
								<XAxis
									type="number"
									tick={{ fill: "#94bdcf" }}
									domain={[0, "dataMax+1000"]}
									scale={"sqrt"}>
									<Label
										value="Critical Infrastructures"
										offset={-10}
										position="insideBottom"
										style={{
											textAnchor: "middle",
											fill: "rgba(255, 255, 255, 0.87)",
										}}
									/>
								</XAxis>
								<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
								<Tooltip content={cITooltip} cursor={{ fill: "#1c333f" }} />
								<Bar
									dataKey="value"
									fill="rgb(0,219,95)"
									barSize={15}
									tick={{ fill: "#94bdcf" }}
									radius={[0, 15, 15, 0]}>
									<LabelList dataKey="value" position="right" content={customLableList} />
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</>
				)}
				{leftElement === 1 && (
					<>
						<h2 style={{ fontSize: "18px", marginBottom: "15px" }}>
							{clickedHazardItem === "Flood Hazard"
								? "Estimated Loss due to Flood"
								: "Estimated Loss due to Landslide"}{" "}
						</h2>
						<EstimatedLossChart
							estimatedLossData={estimatedDataSelection}
							clickedHazardItem={clickedHazardItem}
						/>
						<VRLegendHazard>
							<h4
								className={styles.hazardElementHeaderStyle}
								style={{ opacity: "0.5", fontWeight: "700" }}>
								HAZARD LAYERS
							</h4>
							{hazardIncidentLegendName.length > 0 &&
								hazardIncidentLegendName.map((item, i) => (
									<div
										className={
											legentItemDisabled
												? styles.incidentsLegendsContainer3Disabled
												: styles.incidentsLegendsContainer3
										}
										key={item}>
										<div className={styles.hazardItemContainer3}>
											<button
												key={item}
												type="button"
												className={
													clickedHazardItem === item ? styles.legendBtnSelected3 : styles.legendBtn3
												}
												onClick={() => handleMultipleHazardLayerDamageLoss(item, i)}>
												<Hexagon
													style={{
														innerHeight: 80,
														stroke: "#FFFFFF",
														strokeWidth: 30,
														fill: clickedHazardItem === item ? "white" : "transparent",
													}}
													className={styles.educationHexagon3}
												/>
												{item}
											</button>
										</div>
									</div>
								))}
						</VRLegendHazard>

						<VRLegendFatality>
							{hazardIncidentLegendName.length > 0 &&
								["Fatality", "Infrastructure Damage"].map((item, i) => (
									<div
										className={
											legentItemDisabled
												? styles.incidentsLegendsContainer3Disabled
												: styles.incidentsLegendsContainer3
										}
										key={item}>
										<div className={styles.hazardItemContainer3}>
											<button
												key={item}
												type="button"
												className={
													clickedFatalityInfraDamage === item
														? styles.legendBtnSelected3
														: styles.legendBtn3
												}
												onClick={() => handleFatalityInfraLayer(item, i)}
												disabled={legentItemDisabled}>
												<Hexagon
													style={{
														innerHeight: 80,
														stroke: "#FFFFFF",
														strokeWidth: 30,
														fill: clickedFatalityInfraDamage === item ? "white" : "transparent",
													}}
													className={styles.educationHexagon3}
												/>
												{item}
											</button>
										</div>
									</div>
								))}
						</VRLegendFatality>
					</>
				)}

				{leftElement === 5 && (
					<>
						<VRLegendTemp>
							<h4
								className={styles.hazardElementHeaderStyle}
								style={{ opacity: "0.5", fontWeight: "700" }}>
								PRECIPITATION
							</h4>
							{precipationRefPeriod.length > 0 &&
								precipationRefPeriod.map((item, i) => (
									<div
										className={
											legentItemDisabled
												? styles.incidentsLegendsContainer3Disabled
												: styles.incidentsLegendsContainer3
										}
										key={item.value}>
										<div className={styles.hazardItemContainer3}>
											<button
												key={item.value}
												type="button"
												className={
													prepSelectedData === item.value && climateDataType === "Precipitation"
														? styles.legendBtnSelected3
														: styles.legendBtn3
												}
												onClick={() => handleClimatePrep(item.value)}>
												<Hexagon
													style={{
														innerHeight: 80,
														stroke: "#FFFFFF",
														strokeWidth: 30,
														fill:
															prepSelectedData === item.value && climateDataType === "Precipitation"
																? "white"
																: "transparent",
													}}
													className={styles.educationHexagon3}
												/>
												{item.name}
											</button>
										</div>
									</div>
								))}
						</VRLegendTemp>
						<VRLegendPre>
							<h4
								className={styles.hazardElementHeaderStyle}
								style={{ opacity: "0.5", fontWeight: "700" }}>
								TEMPERTAURE
							</h4>
							{temperatureRefPeriod.length > 0 &&
								temperatureRefPeriod.map((item, i) => (
									<div
										className={
											legentItemDisabled
												? styles.incidentsLegendsContainer3Disabled
												: styles.incidentsLegendsContainer3
										}
										key={item.value}>
										<div className={styles.hazardItemContainer3}>
											<button
												key={item.value}
												type="button"
												className={
													tempSelectedData === item.value && climateDataType === "Temperature"
														? styles.legendBtnSelected3
														: styles.legendBtn3
												}
												onClick={() => handleClimateTemp(item.value)}>
												<Hexagon
													style={{
														innerHeight: 80,
														stroke: "#FFFFFF",
														strokeWidth: 30,
														fill:
															tempSelectedData === item.value && climateDataType === "Temperature"
																? "white"
																: "transparent",
													}}
													className={styles.educationHexagon3}
												/>
												{item.name}
											</button>
										</div>
									</div>
								))}
						</VRLegendPre>
						<h2 style={{ fontSize: "18px", marginBottom: "15px" }}>{climateChartTitle}</h2>
						<ResponsiveContainer className={styles.respContainer} width="100%" height={"60%"}>
							<BarChart
								width={200}
								height={1000}
								data={climateBarChartData}
								layout="vertical"
								margin={{ left: 15, right: 70, bottom: 25 }}>
								<CartesianGrid strokeDasharray="3 3" stroke={"#436578"} />
								<XAxis
									type="number"
									tick={{ fill: "#94bdcf" }}
									domain={
										climateDataType === "Temperature"
											? [(dataMin) => parseInt(dataMin, 10), (dataMax) => parseInt(dataMax + 1, 10)]
											: [
													(dataMin) => Math.floor(dataMin - 100),
													(dataMax) => parseInt(dataMax + 100, 10),
											  ]
									}>
									{/* <Label
                                        value="Critical Infrastructures"
                                        offset={0}
                                        position="insideBottom"
                                        style={{
                                            textAnchor: 'middle',
                                            fill: 'rgba(255, 255, 255, 0.87)',
                                        }}
                                    /> */}
								</XAxis>
								<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
								<Tooltip content={cITooltip} cursor={{ fill: "#1c333f" }} />
								<Bar
									dataKey="value"
									fill="rgb(0,219,95)"
									barSize={15}
									tick={{ fill: "#94bdcf" }}
									radius={[0, 15, 15, 0]}>
									<LabelList dataKey="value" position="right" content={customLableList} />
								</Bar>
							</BarChart>
						</ResponsiveContainer>

						{districtIdIs && (
							<h2 style={{ fontSize: "14px", marginBottom: "15px" }}>
								Ensemble Mean of Annual{" "}
								{climateDataType === "Temperature" ? "Temperature" : "Precipitation"} of{" "}
								{districtIdToName(districtIdIs)}
							</h2>
						)}

						{climateLineChartData && climateLineChartData.length > 0 && (
							<ResponsiveContainer className={styles.chart}>
								<ComposedChart
									data={climateLineChartData}
									height={400}
									margin={{
										top: 25,
										right: 40,
										left: 0,
										bottom: 15,
									}}>
									<CartesianGrid fill="white" />

									<XAxis
										dataKey="year"
										type="number"
										scale="time"
										domain={["dataMin", "dataMax"]}
										angle={-30}>
										<Label value="Year" fill="white" offset={-5} position="insideBottom" />
									</XAxis>
									<YAxis type="number" domain={["auto", "auto"]} padding={{ top: 5, bottom: 0 }}>
										<Label
											value={
												climateDataType === "Temperature" ? "Temperature" : "Precipitation(mm/year)"
											}
											angle={270}
											offset={-10}
											fill="white"
											position="left"
											style={{ textAnchor: "middle" }}
										/>
									</YAxis>
									<Tooltip labelFormatter={(value) => `Year: ${value}`} />
									<Legend
										verticalAlign="top"
										wrapperStyle={{
											marginTop: "-16px",
										}}
									/>
									<Area
										type="monotone"
										dataKey="SD RCP 4.5"
										fill="red"
										fillOpacity={0.3}
										stroke="none"
										legendType="square"
									/>
									<Line
										strokeWidth={2}
										type="monotone"
										dataKey="RCP 4.5"
										stroke="#1f78b4"
										dot={false}
									/>
								</ComposedChart>
							</ResponsiveContainer>
						)}
					</>
				)}

				{leftElement === 7 && <DRRCountBox contactData={contactData} />}
				<div className={styles.leftBottomBar}>
					<NavButtons
						handleNext={handleNext}
						handlePrev={handlePrev}
						disableNavLeftBtn={disableNavLeftBtn}
						disableNavRightBtn={disableNavRightBtn}
						pagenumber={pagenumber}
						totalPages={totalPages}
						pending={pending}
						leftElement={leftElement}
						setActivePage={setActivePage}
						active={active}
					/>
				</div>
			</div>
		</>
	);
}

export default Leftpane;
