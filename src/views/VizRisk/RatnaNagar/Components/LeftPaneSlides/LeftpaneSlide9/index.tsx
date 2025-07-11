import React from "react";
import SankeyChart from "../../Charts/SankeyChart";
import StackChart from "../../Charts/StackChart";
import styles from "./styles.module.scss";

const LeftpaneSlide9 = () => {
	const stackBarChartTitle = "HAZARD OF HOUSEHOLDS";

	const data = [
		{
			"Very High": 5,
			High: 30,
			Medium: 10,
			Low: 20,
			"Very Low": 35,
		},
	];

	return (
		<div className={styles.vrSideBar}>
			<h1>Risk</h1>
			<p>
				Ratnanagar Municipality is located in Sindhupalchok district of Bagmati province. The rural
				municipality has 7 wards covering a total area of 592 sq. km and is situated at an elevation
				of 800 m to 7000m AMSL.
			</p>
			<SankeyChart barData={[{}]} />
			<p>
				Ratnanagar Municipality is located in Sindhupalchok district of Bagmati province. The rural
				municipality has 7 wards covering a total area of 592 sq. km and is situated at an elevation
				of 800 m to 7000m AMSL.
			</p>
			<StackChart stackBarChartTitle={stackBarChartTitle} data={data} />
			<p>
				The value of individual households is calculated based on the scoring of the selected
				indicators. The indicators used to quantify hazard are
			</p>
		</div>
	);
};

export default LeftpaneSlide9;
