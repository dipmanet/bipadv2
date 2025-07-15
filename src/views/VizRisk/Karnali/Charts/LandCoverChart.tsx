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

export default function LandCoverChart(props) {
	const { landCoverCustomTooltip, landCoverData } = props;
	return (
		<div>
			<ResponsiveContainer
				// className={styles.respContainer}
				// width="100%"
				height={600}>
				<BarChart
					width={300}
					height={600}
					data={landCoverData}
					layout="vertical"
					margin={{ left: 15, right: 45, bottom: 25 }}>
					<CartesianGrid strokeDasharray="3 3" stroke={"#436578"} />
					<XAxis type="number" tick={{ fill: "#94bdcf" }}>
						<Label
							value="Coverage in Square Km"
							offset={-10}
							position="insideBottom"
							style={{
								textAnchor: "middle",
								fill: "rgba(255, 255, 255, 0.87)",
								// margin: '10px',
							}}
						/>
					</XAxis>

					<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
					{/* <Legend /> */}
					<Tooltip content={landCoverCustomTooltip} cursor={{ fill: "#1c333f" }} />
					<Bar
						dataKey="value"
						fill="red"
						barSize={22}
						// label={{ position: 'right', fill: '#ffffff' }}
						tick={{ fill: "#94bdcf" }}
						radius={[0, 5, 5, 0]}>
						{landCoverData.map((entry, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
