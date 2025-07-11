import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import styles from "../../styles.module.scss";

interface Props {
	handleNext: () => void;
	handlePrev: () => void;
	pagenumber: number;
	totalPages: number;
	pending: boolean;
}

const ciRef = {
	health: "Hospital",
	finance: "Financial Institution",
	education: "Education Institution",
};

const generateYearsArr = () => {
	const max = new Date().getFullYear();
	const min = 2011;
	const years = [];

	for (let i = max; i >= min; i--) {
		years.push(i);
	}

	return years;
};

const getTotalLoss = (year, arr) => {
	const temp = arr
		.filter((incident) => {
			const yearInt = new Date(`${year}-01-01`).getTime();
			const nextYear = new Date(`${Number(year) + 1}-01-01`).getTime();
			return incident.date > yearInt && incident.date < nextYear;
		})
		.map((l) => l.loss);
	if (temp.length > 0) {
		return temp.reduce((a, b) => ({
			peopleDeathCount: (Number(b.peopleDeathCount) || 0) + (Number(a.peopleDeathCount) || 0),
		})).peopleDeathCount;
	}

	return 0;
};

const LeftPane10 = (props: Props) => {
	const [incidentChart, setIncidentChart] = useState([]);
	const [lossChart, setLossChart] = useState([]);
	const [cichartData, setCIChartData] = useState([]);
	const [reset, setReset] = useState(true);
	const [lschartData, setLschartData] = useState(true);
	const { drawData, landSlide, chartReset, ci, buildingCount, overallBuildingsCount } = props;

	useEffect(() => {
		if (landSlide) {
			const yearsArr = generateYearsArr();
			const noIncidentsChart = yearsArr.map((item) => ({
				name: item,
				Total: landSlide.filter((incident) => {
					const yearInt = new Date(`${item}-01-01`).getTime();
					const nextYear = new Date(`${Number(item) + 1}-01-01`).getTime();
					const inciDate = new Date(incident.date).getTime();
					return inciDate > yearInt && inciDate < nextYear;
				}).length,
			}));

			const loss = yearsArr.map((item) => ({
				name: item,
				Total: getTotalLoss(item, landSlide),
			}));
			setIncidentChart(noIncidentsChart);
			setLossChart(loss);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (drawData) {
			const hazardArr = [...new Set(drawData.map((h) => h.hazardTitle))].filter(
				(i) => i !== undefined
			);
			const cD = hazardArr.map((hazard) => ({
				name: hazard,
				Total: drawData.filter((item) => item.hazardTitle === hazard).length,
			}));
			setCIChartData(cD);
			setReset(false);
		}
	}, [drawData]);

	useEffect(() => {
		if (buildingCount) {
			const hazardArr = [...new Set(drawData.map((h) => h.hazardTitle))].filter(
				(i) => i !== undefined
			);
			const cD = hazardArr.map((hazard) => ({
				name: hazard,
				Total: drawData.filter((item) => item.hazardTitle === hazard).length,
			}));
			cD.push({ name: "Buildings", Total: buildingCount.count });
			setCIChartData(cD);
			setReset(false);
		}
	}, [buildingCount, drawData]);

	useEffect(() => {
		if (ci) {
			const resArr = [...new Set(ci.map((h) => h.resourceType))].filter((i) => i !== undefined);
			const cD = resArr.map((res) => ({
				name: ciRef[res],
				Total: ci.filter((item) => item.resourceType === res).length,
			}));
			cD.push({ name: "Buildings", Total: overallBuildingsCount });
			setCIChartData(cD);
			setReset(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chartReset, ci]);

	useEffect(() => {
		if (ci) {
			const resArr = [...new Set(ci.map((h) => h.resourceType))].filter((i) => i !== undefined);
			const cD = resArr.map((res) => ({
				name: ciRef[res],
				Total: ci.filter((item) => item.resourceType === res).length,
			}));
			cD.push({ name: "Buildings", Total: overallBuildingsCount });
			setCIChartData(cD);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={styles.vrSideBar}>
			<h1>Landslide Risk</h1>
			<p className={styles.narrativeText}>
				The map shows the ward level risk of landslide in Barhabise Municipality. The municipality
				lies in hilly region of the country, highly susceptible to landslides . Out of the 9 wards,
				ward 4 possess the higher risk of landslide.
			</p>
			<p className={styles.narrativeText}>Source: Durham University</p>
			<p className={styles.narrativeText}>
				COMMUNITY INFRASTRUCTURE
				{reset ? " (Municipality) " : " (Selected Area) "}
			</p>
			<div className={styles.climateChart}>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<BarChart data={cichartData} layout="vertical" margin={{ left: 5, right: 30 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" />
						<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
						<Bar
							dataKey="Total"
							fill="rgb(0,219,95)"
							barSize={20}
							label={{ position: "right", fill: "#ffffff" }}
							tick={{ fill: "#94bdcf" }}
							radius={[0, 20, 20, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default LeftPane10;
