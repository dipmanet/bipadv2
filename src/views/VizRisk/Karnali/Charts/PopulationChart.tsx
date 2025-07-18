import React from "react";
import {
	Label,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import styles from "../LeftPane/styles.module.scss";

export default function PopulationChart(props) {
	const { populationCustomTooltip, populationData, renderLegendPopulaion } = props;
	return (
		<div>
			<ResponsiveContainer width="100%" height={600}>
				<BarChart
					data={populationData}
					layout="vertical"
					margin={{ top: 30, bottom: 10, right: 20, left: 40 }}>
					<CartesianGrid strokeDasharray="3 3" stroke={"#436578"} />
					<XAxis
						type="number"
						tick={{ fill: "#94bdcf" }}
						tickFormatter={(tick) => tick.toLocaleString()}
					/>
					<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
					<Tooltip content={populationCustomTooltip} cursor={{ fill: "#1c333f" }} />
					{/* <Legend /> */}
					<Legend
						layout="horizontal"
						margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
						verticalAlign="top"
						iconType="square"
						iconSize={10}
						align="center"
						content={renderLegendPopulaion}
					/>
					<Bar dataKey="MalePop" fill="#ffbf00" stackId="a" barSize={15} />
					<Bar
						dataKey="FemalePop"
						radius={[0, 10, 10, 0]}
						stackId="a"
						fill="#347eff"
						barSize={15}
					/>
					<Bar dataKey="TotalHousehold" radius={[0, 10, 10, 0]} fill="#00d725" barSize={15} />
					{/* <Bar background label dataKey="foo" fill="#8884d8" /> */}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
