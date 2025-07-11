import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Tabs from "#views/IBF/Components/Tabs/tab";
import TabPane from "#views/IBF/Components/Tabs/tab-pane";
import styles from "./styles.module.scss";
import { OverallFloodHazardType } from "./types";

interface ChartDataType {
	name: string;
	total: number;
}

interface Props {
	overallFloodHazard: OverallFloodHazardType[];
}

const PotentiallyExposed = ({ overallFloodHazard }: Props) => {
	const [totalBuilding, setTotalBuilding] = useState<number>();
	const [totalHighway, setTotalHighway] = useState<number>();
	const [totalLand, setTotalLand] = useState<number>();
	const [chartBuildingData, setChartBuildingData] = useState<ChartDataType[]>();
	const [chartHighwayData, setChartHighwayData] = useState<ChartDataType[]>();
	const [chartLandData, setChartLandData] = useState<ChartDataType[]>();

	const countBuilding = (building) => {
		let count;
		if (building && building !== undefined) {
			count = building.map((item) => item[Object.keys(item)[0]].totalCount).reduce((a, b) => a + b);
		}
		return count;
	};
	const countHighway = (highway) => {
		let count;
		if (highway && highway !== undefined) {
			count = highway.map((item) => item[Object.keys(item)[0]].totalLength).reduce((a, b) => a + b);
		}
		return count;
	};
	const countLand = (land) => {
		let count;
		if (land && land !== undefined) {
			count = land.map((item) => item[Object.keys(item)[0]].totalArea).reduce((a, b) => a + b);
		}
		return count;
	};

	const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);

	useEffect(() => {
		if (
			overallFloodHazard &&
			overallFloodHazard[0] &&
			Object.keys(overallFloodHazard[0].types).length > 0
		) {
			// Setting the building, highway and land data
			setTotalBuilding(countBuilding(overallFloodHazard[0].types.building));
			setTotalHighway(countHighway(overallFloodHazard[0].types.highway));
			setTotalLand(countLand(overallFloodHazard[0].types.landuse));

			// Building Data Calculation
			let chartbuildingdata;
			let house;
			if (overallFloodHazard[0].types.building) {
				house = overallFloodHazard[0].types.building.filter(
					(item) => Object.keys(item)[0] === "yes" || Object.keys(item)[0] === "house"
				);
			}

			if (overallFloodHazard[0].types.building) {
				chartbuildingdata = overallFloodHazard[0].types.building
					.filter((item) => Object.keys(item)[0] !== "yes")
					.map((item) => ({
						name: capitalize(
							Object.keys(item)[0] === "farmAuxiliary" ? "farmhouse" : Object.keys(item)[0]
						),
						total:
							Object.keys(item)[0] === "house"
								? countBuilding(house)
								: item[Object.keys(item)[0]].totalCount,
					}));
			}

			// Highway Data Calculation
			const others = overallFloodHazard[0].types.highway.filter(
				(item) => Object.keys(item)[0] === "unclassified" || Object.keys(item)[0] === "road"
			);
			const charthighwaydata = overallFloodHazard[0].types.highway
				.filter((item) => Object.keys(item)[0] !== "unclassified")
				.map((item) => ({
					name: capitalize(Object.keys(item)[0] === "road" ? "others" : Object.keys(item)[0]),

					total:
						Object.keys(item)[0] === "road"
							? Number((Number(countHighway(others)) / 1000).toFixed(2))
							: Number((Number(item[Object.keys(item)[0]].totalLength) / 1000).toFixed(2)),
				}));

			// Land Data Calculation
			const farmland = overallFloodHazard[0].types.landuse.filter(
				(item) => Object.keys(item)[0] === "farmland" || Object.keys(item)[0] === "farmyard"
			);
			const grassland = overallFloodHazard[0].types.landuse.filter(
				(item) => Object.keys(item)[0] === "grass" || Object.keys(item)[0] === "meadow"
			);

			const chartlanddata = overallFloodHazard[0].types.landuse
				.filter((item) => Object.keys(item)[0] !== "farmyard" && Object.keys(item)[0] !== "meadow")
				.map((item) => ({
					name: capitalize(
						Object.keys(item)[0] === "farmland"
							? "farmland"
							: Object.keys(item)[0] === "grass"
							? "greenland"
							: Object.keys(item)[0]
					),
					total:
						Object.keys(item)[0] === "farmland"
							? Number((Number(countLand(farmland)) * 1e-6).toFixed(2))
							: Object.keys(item)[0] === "grass"
							? Number((Number(countLand(grassland)) * 1e-6).toFixed(2))
							: Number((Number(item[Object.keys(item)[0]].totalArea) * 1e-6).toFixed(2)),
				}));

			// Use Chart Data

			setChartBuildingData(chartbuildingdata);
			setChartHighwayData(charthighwaydata);
			setChartLandData(chartlanddata);
		}
	}, [overallFloodHazard]);

	const chartData = [
		{
			name: "Buildings",
			total: totalBuilding || "",
			data: chartBuildingData,
		},
		{
			name: "Roads",
			total: (Number(totalHighway) / 1000).toFixed(2) || "",
			data: chartHighwayData,
		},
		{
			name: "Landuse",
			total: (Number(totalLand) * 1e-6).toFixed(2) || "",
			data: chartLandData,
		},
	];

	return (
		<div className={styles.exposedContainer}>
			<div className={styles.title}>
				<h1 className={styles.baseTitle}>Potentially Exposed</h1>
			</div>
			<div className={styles.content}>
				<Tabs>
					{chartData.length > 0 &&
						chartData.map((dataItem) => (
							<TabPane name={dataItem.name || ""} key="1" total={dataItem.total}>
								<BarChart
									width={300}
									height={300}
									data={dataItem.data}
									layout="vertical"
									margin={{ left: 35, right: 20, top: 20 }}>
									<CartesianGrid strokeDasharray="3 3" horizontal={false} />
									<XAxis type="number" tick={{ fill: "#94bdcf" }} />
									<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
									<Bar
										dataKey="total"
										fill="rgb(0,219,95)"
										barSize={15}
										label={{ position: "right", fill: "#ffffff" }}
										radius={[0, 15, 15, 0]}
									/>
								</BarChart>
							</TabPane>
						))}
				</Tabs>
			</div>
		</div>
	);
};

export default PotentiallyExposed;
