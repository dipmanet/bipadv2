import React from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import CustomLabel from "#views/VizRisk/Common/ChartComps/CustomLabel";
import CustomChartLegend from "#views/VizRisk/Common/ChartComps/CustomChartLegend";
import styles from "../../styles.module.scss";
import LandCover from "../../Data/LandCoverChartData";

const demoChartdata = LandCover.chartData;

interface Props {
	handleNext: () => void;
	handlePrev: () => void;
	pagenumber: number;
	totalPages: number;
	pending: boolean;
}

const LeftPane4 = (props: Props) => {
	const {
		data: { renderActiveShape, onPieEnter, customTooltip, activeIndex },
	} = props;

	return (
		<div className={styles.vrSideBar}>
			<h1>Land Cover</h1>
			<p className={styles.narrativeText}>
				Out of a total area of 278.31 square km, 61.18% of the land is covered by forests, 4.14% by
				farmland, 9.11% by meadow, 0.19% by water bodies and 0.13% by residential areas. Other areas
				in the municipality is covered by scree, sand, snow and scrubs.
			</p>
			<p className={styles.narrativeText}>Source: OpenStreetMap</p>
			<div className={styles.customChartLegend}>
				<ResponsiveContainer className={styles.respContainer} height={200}>
					<PieChart width={200} height={150} margin={{ top: 15, bottom: 15, left: 5, right: 5 }}>
						<Pie
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							data={demoChartdata}
							// cx={150}
							// cy={50}
							innerRadius={70}
							outerRadius={90}
							fill="#8884d8"
							paddingAngle={0}
							dataKey="value"
							onClick={onPieEnter}
							stroke="none">
							{demoChartdata.map((entry) => (
								<Cell key={`cell-${entry.name}`} fill={entry.color} />
							))}
							<Label
								width={30}
								position="center"
								content={
									<CustomLabel
										value1={`${demoChartdata[activeIndex].value.toFixed(1)} sq km`}
										value2={` / ${(
											(demoChartdata[activeIndex].value / demoChartdata[0].total) *
											100
										).toFixed(1)} sq km`}
									/>
								}
							/>
						</Pie>
						<Tooltip content={customTooltip} />
					</PieChart>
				</ResponsiveContainer>
			</div>
			<div className={styles.customChartLegend}>
				{demoChartdata.map((item, i) => (
					<CustomChartLegend
						text={item.name}
						barColor={item.color}
						background={"#777"}
						data={`${item.value} sq km / ${((item.value / item.total) * 100).toFixed(2)}`}
						selected={activeIndex === i}
					/>
				))}
			</div>
		</div>
	);
};

export default LeftPane4;
