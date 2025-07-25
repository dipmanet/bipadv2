import React, { useState } from "react";
import Hexagon from "react-hexagon";
import styles from "./styles.module.scss";

const DemoGraphicsLegends = (props) => {
	const { layer } = props;
	const susep = {
		title: "LandSlide Suseptibility",
		type: "square",
		legends: [
			{ key: 1, color: "rgb(8,120,188)", label: "0" },
			{ key: 2, color: "rgb(47,140,197)", label: "0.05" },
			{ key: 3, color: "#5FA1CB", label: "0.1" },
			{ key: 4, color: "rgb(120,180,213)", label: "0.15" },
			{ key: 5, color: "rgb(146,198,223)", label: "0.2" },
			{ key: 6, color: "rgb(171,217,233)", label: "0.25" },
			{ key: 7, color: "rgb(188,225,225)", label: "0.3" },
			{ key: 8, color: "rgb(205,233,217)", label: "0.35" },
			{ key: 9, color: "rgb(222,240,208)", label: "0.40" },
			{ key: 10, color: "rgb(239,248,200)", label: "0.45" },
			{ key: 11, color: "rgb(254,251,191)", label: "0.50" },
			{ key: 12, color: "rgb(254,239,172)", label: "0.55" },
			{ key: 13, color: "rgb(252,223,154)", label: "0.60" },
			{ key: 14, color: "rgb(249,207,135)", label: "0.65" },
			{ key: 15, color: "rgb(247,189,115)", label: "0.70" },
			{ key: 16, color: "rgb(245,173,96)", label: "0.75" },
			{ key: 17, color: "rgb(242,144,83)", label: "0.80" },
			{ key: 18, color: "rgb(238,114,69)", label: "0.85" },
			{ key: 19, color: "rgb(231,84,55)", label: "0.90" },
			{ key: 20, color: "rgb(223,55,47)", label: "0.95" },
			{ key: 21, color: "rgb(215,50,45)", label: "1" },
		],
	};

	return (
		<div className={styles.susLegend}>
			{layer === "ses" && (
				<div>
					<h2>Seismic hazard (g)</h2>
					<div className={styles.populationContainer}>
						<div className={styles.populationIndContainerShort}>
							<div className={styles.populationIndicator1}>0.08 - 0.13</div>
							<div className={styles.populationIndicator2}>0.13 - 0.2</div>
							<div className={styles.populationIndicator3}>0.2-0.35</div>
							<div className={styles.populationIndicator4}>0.35-0.55</div>
							<div className={styles.populationIndicator5}>0.55-0.9</div>
							<div className={styles.populationIndicator6}>0.9-1.5</div>
						</div>
					</div>
				</div>
			)}
			{layer === "sus" && (
				<div>
					<h2>Landslide Suseptibility</h2>

					<div className={styles.populationContainer}>
						{susep.legends.map((legend) => (
							<div key={legend.key} className={styles.legendsRow}>
								<div
									style={{
										backgroundColor: legend.color,
										marginBottom: 0,
									}}
									className={styles.populationIndicator2}>
									{legend.label}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DemoGraphicsLegends;
