import React from "react";
import {
	Sankey,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Legend,
	Tooltip,
} from "recharts";
import styles from "./styles.module.scss";

interface Props {
	barTitle?: string;
	barData: object[];
}

const SankeyChart = (props: Props) => {
	const { barTitle, barData } = props;
	const data0 = {
		nodes: [
			{
				name: "Visit",
			},
			{
				name: "Direct-Favourite",
			},
			{
				name: "Page-Click",
			},
			{
				name: "Detail-Favourite",
			},
			{
				name: "Lost",
			},
		],
		links: [
			{
				source: 0,
				target: 1,
				value: 6242,
			},
			{
				source: 0,
				target: 2,
				value: 6242,
			},
			{
				source: 0,
				target: 3,
				value: 6242,
			},
			{
				source: 0,
				target: 4,
				value: 6242,
			},
		],
	};
	return (
		<div className={styles.mainBarChart}>
			<h3 className={styles.barTitle}>{barTitle}</h3>
			<ResponsiveContainer height={150}>
				<Sankey
					width={200}
					nameKey
					dataKey
					linkWidth={25}
					height={180}
					data={data0}
					nodeWidth={80}
					node={{ stroke: "#77c878", strokeWidth: 0.5 }}
					margin={{ left: 15, right: 25 }}
					link={{ stroke: "#77c878" }}
				/>
			</ResponsiveContainer>
		</div>
	);
};

export default SankeyChart;
