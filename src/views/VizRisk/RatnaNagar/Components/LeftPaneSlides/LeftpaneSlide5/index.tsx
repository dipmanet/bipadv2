import React, { useContext, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { MainPageDataContext } from "#views/VizRisk/RatnaNagar/context";
import {
	getHouseHoldDataColor,
	getHouseHoldDataStatus,
	percentageCalculator,
} from "#views/VizRisk/RatnaNagar/utils";
import CommonBarChart from "../../Charts/Barcharts";
import StackChart from "../../Charts/StackChart";
import Factors from "../../Factors";
import SelectComponent from "../../SelectComponent";
import styles from "./styles.module.scss";

const LeftpaneSlide6 = () => {
	const {
		keyValueHtmlData,
		householdData,
		householdChartData,
		setSelectFieldValue,
		setCurrentRechartsItem,
	} = useContext(MainPageDataContext);
	const exposureChartData = householdChartData && householdChartData["Flood Hazard"];

	const [selctFieldCurrentValue, setSelctFieldCurrentValue] = useState("Flood return period");
	const [curerntChartData, setCurerntChartData] = useState([]);
	useEffect(() => {
		setSelectFieldValue("Flood return period");
		setCurrentRechartsItem("");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const filterChartSelectedData = (currentChartSelectedData: any) => {
		const filterData = currentChartSelectedData.filter(
			(data: any) => !data.name.toLowerCase().includes("total_population")
		);
		return filterData;
	};

	useEffect(() => {
		const currentChartSelectedData = exposureChartData[selctFieldCurrentValue];
		const filteredData = filterChartSelectedData(currentChartSelectedData);
		setCurerntChartData(filteredData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selctFieldCurrentValue]);

	const htmlDataTop =
		keyValueHtmlData &&
		keyValueHtmlData.filter(
			(item: any) => item.key === "vizrisk_ratnanagar_page7_htmldata_301_3_35_35007"
		)[0];
	const htmlDataBottom =
		keyValueHtmlData &&
		keyValueHtmlData.filter(
			(item: any) => item.key === "vizrisk_ratnanagar_page7_bottom_htmldata_301_3_35_35007"
		)[0];

	const stackBarChartTitle = "HAZARD OF HOUSEHOLDS";

	const municipalityName = "Flood Occurrrence in Municipality ";
	const mainData = householdData.map((item) => item.hazard);
	const dataArr = percentageCalculator(mainData, householdData);

	const averageExposureScore: any = (
		mainData.reduce((total: number, singleData: number) => total + singleData) /
		householdData.length /
		10
	).toFixed(1);

	const scoreStatus = getHouseHoldDataStatus(averageExposureScore);
	const color = getHouseHoldDataColor(averageExposureScore);

	const selectFieldValues = [
		{
			optionTitle: "",
			optionValues: exposureChartData && Object.keys(exposureChartData),
		},
	];
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
				The flood hazard value of the municipality is veryhigh ({averageExposureScore}
				/10). The higher the value of hazards, the greater is the chance of flood occurrence.
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

export default LeftpaneSlide6;
