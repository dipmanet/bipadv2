import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Label,
	LabelList,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import styles from "../LeftPan./styles.module.scss";

export default function BuildingChart(props) {
	const { buildingsChartData } = props;

	const buildingToolTip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.customTooltip}>
					<h2>{payload[0].payload.name}</h2>
					<p>{`Count: ${payload[0].payload.count}`}</p>
				</div>
			);
		}

		return null;
	};
	return (
		<div>
			<ResponsiveContainer
				// className={styles.respContainer}
				width="100%"
				height={300}>
				<BarChart
					width={300}
					height={300}
					data={buildingsChartData}
					layout="vertical"
					margin={{ left: 15, right: 45, bottom: 25 }}>
					<CartesianGrid strokeDasharray="3 3" stroke={"#436578"} />
					<XAxis type="number" tick={{ fill: "#94bdcf" }}>
						<Label
							value="Alert's Count"
							offset={-10}
							position="insideBottom"
							style={{
								textAnchor: "middle",
								fill: "rgba(255, 255, 255, 0.87)",
							}}
						/>
					</XAxis>
					<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
					{/* <Legend /> */}
					<Tooltip content={buildingToolTip} cursor={{ fill: "#1c333f" }} />
					<Bar
						dataKey="count"
						fill="green"
						barSize={18}
						tick={{ fill: "#94bdcf" }}
						radius={[0, 5, 5, 0]}>
						{" "}
						{buildingsChartData.map((entry, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
						<LabelList dataKey="count" position="right" />
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
