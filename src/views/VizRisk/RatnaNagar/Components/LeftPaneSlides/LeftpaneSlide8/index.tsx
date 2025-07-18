import React, { useContext, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { MainPageDataContext } from "#views/VizRisk/RatnaNagar/context";
import {
	generateSelectFieldValues,
	getHouseHoldDataColor,
	getHouseHoldDataStatus,
	percentageCalculator,
} from "#views/VizRisk/RatnaNagar/utils";
import { staticSelectFieldValues } from "#views/VizRisk/RatnaNagar/expressions";
import CommonBarChart from "../../Charts/Barcharts";
import StackChart from "../../Charts/StackChart";
import Factors from "../../Factors";
import SelectComponent from "../../SelectComponent";
import styles from "./styles.module.scss";
import RangeStatusLegend from "../../Legends/RangeStatusLegend";

const LeftpaneSlide8 = () => {
	const { keyValueHtmlData, householdData, householdChartData, setSelectFieldValue } =
		useContext(MainPageDataContext);
	const exposureChartData = householdChartData && householdChartData["Adaptive Capacity"];

	const [selctFieldCurrentValue, setSelctFieldCurrentValue] = useState("Hold Insurance Policy");

	const [curerntChartData, setCurerntChartData] = useState([]);
	useEffect(() => {
		setSelectFieldValue("Hold Insurance Policy");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const currentChartSelectedData = exposureChartData[selctFieldCurrentValue];

		setCurerntChartData(currentChartSelectedData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selctFieldCurrentValue]);

	const htmlDataTop =
		keyValueHtmlData &&
		keyValueHtmlData.filter(
			(item: any) => item.key === "vizrisk_ratnanagar_page9_htmldata_301_3_35_35007"
		)[0];
	const htmlDataBottom =
		keyValueHtmlData &&
		keyValueHtmlData.filter(
			(item: any) => item.key === "vizrisk_ratnanagar_page9_bottom_htmldata_301_3_35_35007"
		)[0];
	const stackBarChartTitle = "ADAPTIVE CAPACITY OF HOUSEHOLDS";

	const municipalityName = "Adaptive Capacity of Municipality ";
	const mainData = householdData.map((item) => item.adaptiveCapacity);
	const dataArr = percentageCalculator(mainData, householdData);

	const averageExposureScore: any = (
		mainData.reduce((total: number, singleData: number) => total + singleData) /
		householdData.length /
		10
	).toFixed(1);
	const selectFieldValues = generateSelectFieldValues(staticSelectFieldValues["Adaptive Capacity"]);

	const scoreStatus = getHouseHoldDataStatus(averageExposureScore);
	const color = getHouseHoldDataColor(averageExposureScore);

	return (
		<div className={styles.vrSideBar}>
			<div className="mainTitleDiv">
				{htmlDataTop && htmlDataTop.value && ReactHtmlParser(htmlDataTop.value)}
			</div>
			<Factors
				municipalityName={municipalityName}
				factorScore={averageExposureScore}
				scoreStatus={scoreStatus}
				color={color}
			/>

			<p>
				The adaptive capacity value of the municipality is moderate for Ratnanagar (
				{averageExposureScore}
				/10).The higher the value of adaptive capacity, the greater the ability to respond to the
				consequences of disasters.
			</p>
			{htmlDataBottom && htmlDataBottom.value && ReactHtmlParser(htmlDataBottom.value)}
			<StackChart stackBarChartTitle={stackBarChartTitle} dataArr={dataArr} />
			<SelectComponent
				selectFieldValues={selectFieldValues}
				selctFieldCurrentValue={selctFieldCurrentValue}
				setSelctFieldCurrentValue={setSelctFieldCurrentValue}
			/>
			{curerntChartData && curerntChartData.length > 0 && (
				<CommonBarChart barTitle={selctFieldCurrentValue} barData={curerntChartData} />
			)}
		</div>
	);
};

export default LeftpaneSlide8;
