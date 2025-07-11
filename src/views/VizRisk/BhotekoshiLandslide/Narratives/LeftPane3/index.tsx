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
	renderLegend: () => void;
	customTooltip: () => void;
	renderLegendRainfall: () => void;
	customTooltipRain: () => void;
}

const LeftPane3 = (props: Props) => {
	const { renderLegend, customTooltip, renderLegendRainfall, customTooltipRain } = props;

	return (
		<div className={styles.vrSideBar}>
			<h1>Bhotekoshi Municipality</h1>
			<p className={styles.narrativeText}>
				Bhotekoshi Rural Municipality is located in Sindhupalchowk district of Bagmati province. The
				municipality has 5 wards and covers an area of 278.31 sq.km and is situated in the altitude
				range of 1183 to 5371 m above sea level.
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
				<ResponsiveContainer height={"100%"} width={"100%"}>
					<LineChart margin={{ top: 0, right: 0, left: 0, bottom: 10 }} data={lineData}>
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
						<Legend iconType="square" iconSize={10} align="center" content={renderLegend} />
						<Tooltip content={customTooltip} />
						<Line type="monotone" dataKey="Max" stroke="#ffbf00" />
						<Line type="monotone" dataKey="Avg" stroke="#00d725" />
						<Line type="monotone" dataKey="Min" stroke="#347eff" />
					</LineChart>
				</ResponsiveContainer>
			</div>
			<div className={styles.climateChart}>
				<p style={{ marginBottom: "0px", marginTop: "30px", fontWeight: "bold" }}> Rainfall</p>
				<ResponsiveContainer height={"100%"} width={"100%"}>
					<LineChart margin={{ top: 0, right: 0, left: 0, bottom: 10 }} data={rainfallData}>
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
						<Legend iconType="square" iconSize={10} align="center" content={renderLegendRainfall} />
						<Tooltip content={customTooltipRain} />
						<Line type="monotone" dataKey="Rainfall" stroke="#ffbf00" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default LeftPane3;
