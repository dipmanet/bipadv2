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

const LeftpaneSlide7 = () => {
	const { keyValueHtmlData, householdData, householdChartData, setSelectFieldValue } =
		useContext(MainPageDataContext);
	const exposureChartData = householdChartData && householdChartData.Sensitivity;

	const [selctFieldCurrentValue, setSelctFieldCurrentValue] = useState("Ethnicity");
	const [curerntChartData, setCurerntChartData] = useState([]);

	useEffect(() => {
		setSelectFieldValue("Ethnicity");
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
			(item: any) => item.key === "vizrisk_ratnanagar_page8_htmldata_301_3_35_35007"
		)[0];
	const htmlDataBottom =
		keyValueHtmlData &&
		keyValueHtmlData.filter(
			(item: any) => item.key === "vizrisk_ratnanagar_page8_bottom_htmldata_301_3_35_35007"
		)[0];

	const stackBarChartTitle = "SENSITIVITY OF HOUSEHOLDS";

	const municipalityName = "Sensitivity of Municipality ";
	const mainData = householdData.map((item) => item.sensitivity);
	const dataArr = percentageCalculator(mainData, householdData);

	const averageExposureScore: any = (
		mainData.reduce((total: number, singleData: number) => total + singleData) /
		householdData.length /
		10
	).toFixed(1);

	const scoreStatus = getHouseHoldDataStatus(averageExposureScore);
	const color = getHouseHoldDataColor(averageExposureScore);

	const selectFieldValues = generateSelectFieldValues(staticSelectFieldValues.Sensitivity);

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
				The sensitivity value of the municipality is moderate(
				{averageExposureScore}
				/10). The higher the value of sensitivity, the greater the potential impact.
			</p>
			{htmlDataBottom && htmlDataBottom.value && ReactHtmlParser(htmlDataBottom.value)}
			<StackChart stackBarChartTitle={stackBarChartTitle} dataArr={dataArr} />
			<SelectComponent
				selectFieldValues={selectFieldValues}
				selctFieldCurrentValue={selctFieldCurrentValue}
				setSelctFieldCurrentValue={setSelctFieldCurrentValue}
			/>{" "}
			{curerntChartData && curerntChartData.length > 0 && (
				<CommonBarChart barTitle={selctFieldCurrentValue} barData={curerntChartData} />
			)}
		</div>
	);
};

export default LeftpaneSlide7;
