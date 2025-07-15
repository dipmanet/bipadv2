import React from "react";
import {
	Label,
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	LabelList,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { parseStringToNumber } from "../Functions";
import styles from "../LeftPane/styles.module.scss";

export default function EstimatedLossChart({ estimatedLossData, clickedHazardItem }) {
	const convertToInternationalCurrencySystem = (labelValue) =>
		Math.abs(Number(labelValue)) >= 1.0e9
			? `${(Math.abs(Number(labelValue)) / 1.0e9).toFixed(2)}B`
			: // Six Zeroes for Millions
			Math.abs(Number(labelValue)) >= 1.0e6
			? `${(Math.abs(Number(labelValue)) / 1.0e6).toFixed(2)}M`
			: // Three Zeroes for Thousands
			Math.abs(Number(labelValue)) >= 1.0e3
			? `${(Math.abs(Number(labelValue)) / 1.0e3).toFixed(2)}K`
			: Math.abs(Number(labelValue));

	const customToolTip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.customTooltip}>
					<h2>{payload[0].payload.name}</h2>
					<p>{`Total Loss: ${convertToInternationalCurrencySystem(
						payload[0].payload.totalEstimatedLoss
					)}`}</p>
				</div>
			);
		}

		return null;
	};

	const customLableList = (props) => {
		const { x, y, width, value } = props;
		const radius = -12;
		return (
			<g>
				<text
					x={x + width + 2}
					y={y - radius}
					fill="white"
					textAnchor="right"
					dominantBaseline="right">
					{convertToInternationalCurrencySystem(value)}
				</text>
			</g>
		);
	};
	return (
		<div>
			<ResponsiveContainer
				// className={styles.respContainer}
				width="100%"
				height={500}>
				<BarChart
					width={300}
					height={500}
					data={estimatedLossData}
					layout="vertical"
					margin={{ left: 15, right: 45, bottom: 25 }}>
					<CartesianGrid strokeDasharray="3 3" stroke={"#436578"} />
					<XAxis
						type="number"
						tick={{ fill: "#94bdcf" }}
						tickFormatter={(tick) => convertToInternationalCurrencySystem(tick)}
						domain={[1, "dataMax"]}
						scale={clickedHazardItem === "Flood Hazard" ? "log" : "linear"}>
						<Label
							value="Estimated Loss in Millions"
							offset={-10}
							position="insideBottom"
							style={{
								textAnchor: "middle",
								fill: "rgba(255, 255, 255, 0.87)",
								marginTop: 25,
							}}
						/>
					</XAxis>
					<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
					{/* <Legend /> */}
					<Tooltip cursor={{ fill: "#1c333f" }} content={customToolTip} />
					<Bar
						dataKey="totalEstimatedLoss"
						fill="green"
						barSize={18}
						tick={{ fill: "#94bdcf" }}
						radius={[0, 5, 5, 0]}>
						<LabelList dataKey="totalEstimatedLoss" position="right" content={customLableList} />
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
