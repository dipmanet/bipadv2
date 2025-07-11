import React from "react";
import {
	ResponsiveContainer,
	XAxis,
	YAxis,
	BarChart,
	Bar,
	LabelList,
	Legend,
	Tooltip,
	CartesianGrid,
	ReferenceLine,
} from "recharts";
import Button from "#rsca/Button";
import { saveChart } from "#utils/common";
import { ArchivePollution, ChartData, FaramValues } from "../types";
import { renderLegendName } from "../utils";
import NoData from "../NoData";
import CustomTooltip from "./Tooltip";
import Note from "./Note";
import styles from "./styles.module.scss";

interface Props {
	stationData: ArchivePollution[];
	filterWiseChartData?: ChartData[];
	parameterCode?: string;
	periodCode?: string;
	downloadId?: string;
	chartTitle?: string;
	isInitial?: boolean;
	stationName: string;
	filterValues: FaramValues;
}

const DEFAULT_CHART_TITLE = "Period Parameter Graph";
const DEFAULT_DOWNLOAD_ID = "pollutionPopUpChart";

const handleSaveClick = (downloadId?: string) => {
	saveChart(downloadId || DEFAULT_DOWNLOAD_ID, downloadId || DEFAULT_DOWNLOAD_ID);
};

// const shouldDisplayNote = (periodCode: string) => {
//     const status: {[key: string]: boolean} = {
//         hourly: false,
//         daily: true,
//         weekly: true,
//         monthly: true,
//     };
//     return status[periodCode];
// };

const getParameter = (parameterCode: string) => {
	const parameters: { [key: string]: string } = {
		aqi: "AQI",
		PM1_I: "PM 1",
		PM10_I: "PM 10",
		PM25_I: "PM 2.5",
		T: "Air Temparature",
		TSP_I: "Total Suspended Particulates",
		RH_I: "Relative Humidity",
		WS_I: "Wind Speed",
		WD_I: "Wind Direction",
	};
	return parameters[parameterCode];
};

const getPeriod = (periodCode: string) => {
	const periods: { [key: string]: string } = {
		hourly: "Hourly",
		daily: "Daily average",
		weekly: "Weekly average",
		monthly: "Monthly average",
	};
	return periods[periodCode];
};

const getChartTitle = (
	parameterCode: string,
	periodCode: string,
	stationName: string,
	date: string
) => {
	const parameter = getParameter(parameterCode);
	const period = getPeriod(periodCode);
	return `${period} ${parameter} readings, ${stationName}, ${date}`;
};

const Graph = (props: Props) => {
	const {
		stationData,
		filterWiseChartData,
		parameterCode,
		periodCode,
		chartTitle,
		downloadId,
		isInitial,
		stationName,
		filterValues: {
			dataDateRange: { startDate, endDate },
		},
	} = props;
	const code = parameterCode ? parameterCode.replace(".", "") : "";
	// const displayNote = shouldDisplayNote(periodCode || '');
	const date = `${startDate} to ${endDate}`;
	const calculatedTitle = getChartTitle(code || "", periodCode || "", stationName, date);
	if (stationData.length === 0) {
		return (
			<NoData
				title="Graph View"
				message={isInitial ? "Please select filter to view data" : undefined}
			/>
		);
	}
	return (
		<div className={styles.visualizations}>
			<div className={styles.periodParameterChart}>
				<header className={styles.header}>
					{/* {displayNote && <Note />} */}
					<Note />
					<div
						className={styles.downloadGroup}
						title="Download Chart"
						role="presentation"
						onClick={() => handleSaveClick(downloadId)}>
						<h4>Download</h4>
						<Button className={styles.chartDownload} transparent iconName="download" />
					</div>
				</header>
				<div className={styles.chartWrapper} id={downloadId || DEFAULT_DOWNLOAD_ID}>
					<h4 className={styles.heading}>{chartTitle || calculatedTitle || DEFAULT_CHART_TITLE}</h4>
					<div
						className={styles.chart}
						// id={downloadId || DEFAULT_DOWNLOAD_ID}
					>
						<ResponsiveContainer className={styles.container}>
							<BarChart
								data={filterWiseChartData}
								margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="label" />
								<YAxis />
								<Tooltip content={<CustomTooltip />} />
								<Legend verticalAlign="bottom" height={36} />
								<Bar name={renderLegendName(code)} dataKey={code} fill="#8884d8" />
								{code === "aqi" && (
									<ReferenceLine
										y={150}
										// label="Threshold"
										stroke="#89023E"
										strokeWidth={2}
										isFront
										strokeDasharray="3 2"
									/>
								)}
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Graph;
