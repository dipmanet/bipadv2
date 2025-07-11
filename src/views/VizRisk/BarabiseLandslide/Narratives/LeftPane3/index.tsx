import React from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import TempIcon from "#resources/icons/Temp.svg";
import AvgRainFall from "#resources/icons/RainFall.svg";
import ElevationIcon from "#resources/icons/ElevationFromSea.svg";
import { lineData, rainfallData } from "../../Data/temperatureData";
import styles from "../../styles.module.scss";

interface Props {
	handleNext: () => void;
	handlePrev: () => void;
	pagenumber: number;
	totalPages: number;
	pending: boolean;
}

const LeftPane3 = (props: Props) => {
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.customTooltip}>
					<h2>{payload[0].payload.name}</h2>
					<p>{`Max: ${payload[0].payload.Max} ℃`}</p>
					<p>{`Min: ${payload[0].payload.Min} ℃`}</p>
					<p>{`Avg: ${payload[0].payload.Avg} ℃`}</p>
				</div>
			);
		}

		return null;
	};

	const CustomTooltipRain = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.customTooltip}>
					<h2>{payload[0].payload.name}</h2>
					<p>{`Rainfall: ${payload[0].payload.Rainfall}mm`}</p>
				</div>
			);
		}

		return null;
	};

	return (
		<div className={styles.vrSideBar}>
			<h1>Bahrabise Municipality</h1>
			<p className={styles.narrativeText}>
				Barhabise Municipality is located in Sindhupalchowk district of Bagmati province. The
				municipality has 9 wards and covers an area of 134.8 sq.km and is situated in the altitude
				range of 500 to 4000 m above sea level.
			</p>
			<p className={styles.narrativeText}>Source: Department of Hydrology and Meteorology</p>
			<div className={styles.iconRow}>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIcon} src={TempIcon} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>32.1℃</div>
						<div className={styles.iconText}>
							Maximum
							<br />
							Temperature in Summer
						</div>
					</div>
				</div>
				<div className={styles.infoIconsContainer}>
					{/* <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={TempIcon}
                        /> */}
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>4℃</div>
						<div className={styles.iconText}>
							Minimum
							<br />
							Temperature in Winter
						</div>
					</div>
				</div>
			</div>
			<div className={styles.iconRow}>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIcon} src={AvgRainFall} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>3949.5 mm</div>
						<div className={styles.iconText}>Annual Rainfall</div>
					</div>
				</div>
				<div className={styles.infoIconsContainerHidden}>
					<ScalableVectorGraphics className={styles.infoIcon} src={ElevationIcon} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>142m - 154m</div>
						<div className={styles.iconText}>Elevation from Sea Level</div>
					</div>
				</div>
			</div>
			<p style={{ marginBottom: "0px", marginTop: "30px", fontWeight: "bold" }}> Temperature</p>
			<div className={styles.climateChart}>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart margin={{ top: 10, right: 0, left: 0, bottom: 10 }} data={lineData}>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis dataKey="name" interval="preserveStart" tick={{ fill: "#94bdcf" }} />
						<YAxis
							unit={"℃"}
							axisLine={false}
							domain={[0, 40]}
							padding={{ top: 20 }}
							tick={{ fill: "#94bdcf" }}
							tickCount={10}
							interval="preserveEnd"
							allowDataOverflow
						/>
						<Legend iconType="square" iconSize={10} align="center" content={props.renderLegend} />
						<Tooltip content={CustomTooltip} />
						<Line type="monotone" dataKey="Max" stroke="#ffbf00" />
						<Line type="monotone" dataKey="Avg" stroke="#00d725" />
						<Line type="monotone" dataKey="Min" stroke="#347eff" />
					</LineChart>
				</ResponsiveContainer>
			</div>
			<div className={styles.climateChart}>
				<p style={{ marginBottom: "0px", marginTop: "30px", fontWeight: "bold" }}> Rainfall</p>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart margin={{ top: 10, right: 0, left: 0, bottom: 10 }} data={rainfallData}>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis dataKey="name" interval="preserveStart" tick={{ fill: "#94bdcf" }} />
						<YAxis
							unit={"mm"}
							axisLine={false}
							domain={[0, 1150]}
							padding={{ top: 20 }}
							tick={{ fill: "#94bdcf" }}
							tickCount={10}
							interval="preserveEnd"
							allowDataOverflow
						/>
						<Legend
							iconType="square"
							iconSize={10}
							align="center"
							content={props.renderLegendRainfall}
						/>
						<Tooltip content={CustomTooltipRain} />
						<Line type="monotone" dataKey="Rainfall" stroke="#ffbf00" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default LeftPane3;
