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
// import NavButtons from '#views/VizRisk/Common/NavButtons';
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import TempIcon from "#resources/icons/Temp.svg";
import AvgRainFall from "#resources/icons/RainFall.svg";
import ElevationIcon from "#resources/icons/ElevationFromSea.svg";
import NavButtons from "../../Components/NavButtons";
import { lineData, rainfallData } from "../../Data/temperatureData";
import styles from "../styles.module.scss";

interface State {
	showInfo: boolean;
}

interface ComponentProps {}

class RightPane1 extends React.PureComponent<Props, State> {
	public renderLegend = () => (
		<div className={styles.climateLegendContainer}>
			<div className={styles.climatelegend}>
				<div className={styles.legendMax} />
				<div className={styles.legendText}>Avg Max</div>
			</div>
			<div className={styles.climatelegend}>
				<div className={styles.legendMin} />
				<div className={styles.legendText}>Avg Min</div>
			</div>
			<div className={styles.climatelegend}>
				<div className={styles.legendDaily} />
				<div className={styles.legendText}>Daily Avg</div>
			</div>
		</div>
	);

	public CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.customTooltip}>
					<h2>{payload[0].payload.name}</h2>
					<p>{`Avg Max: ${payload[0].payload.Max} ℃`}</p>
					<p>{`Avg Min: ${payload[0].payload.Min} ℃`}</p>
					<p>{`Daily Avg: ${payload[0].payload.Avg} ℃`}</p>
				</div>
			);
		}

		return null;
	};

	public CustomTooltipRain = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.customTooltip}>
					<h2>{payload[0].payload.name}</h2>
					<p>{`Avg Rainfall: ${payload[0].payload.Rainfall} mm`}</p>
				</div>
			);
		}

		return null;
	};

	public render() {
		const {
			handleNext,
			handlePrev,
			disableNavLeftBtn,
			disableNavRightBtn,
			pagenumber,
			totalPages,
			pending,
		} = this.props;

		return (
			<div className={styles.vrSideBar}>
				<h1> Jugal Rural Municipality</h1>
				<p>
					Jugal Rural Municipality is located in Sindhupalchok district of Bagmati province. The
					rural municipality has 7 wards covering a total area of 592 sq. km and is situated at an
					elevation of 800 m to 7000m MASL.
				</p>

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

				<div className={styles.climateChart}>
					<p style={{ marginBottom: "0px", marginTop: "30px", fontWeight: "bold" }}> Temperature</p>
					<ResponsiveContainer className={styles.chartContainer} height={300}>
						<LineChart margin={{ top: 0, right: 10, left: 10, bottom: 10 }} data={lineData}>
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
							<Legend iconType="square" iconSize={10} align="center" content={this.renderLegend} />
							<Tooltip content={this.CustomTooltip} />
							<Line type="monotone" dataKey="Max" stroke="#ffbf00" />
							<Line type="monotone" dataKey="Avg" stroke="#00d725" />
							<Line type="monotone" dataKey="Min" stroke="#347eff" />
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className={styles.climateChart}>
					<p style={{ marginBottom: "0px", marginTop: "30px", fontWeight: "bold" }}> Rainfall</p>
					<ResponsiveContainer className={styles.chartContainer} height={300}>
						<LineChart margin={{ top: 0, right: 10, left: 10, bottom: 10 }} data={rainfallData}>
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
								content={this.renderLegendRainfall}
							/>
							<Tooltip content={this.CustomTooltipRain} />
							<Line type="monotone" dataKey="Rainfall" stroke="#ffbf00" />
						</LineChart>
					</ResponsiveContainer>
				</div>

				<NavButtons
					handleNext={handleNext}
					handlePrev={handlePrev}
					disableNavLeftBtn={disableNavLeftBtn}
					disableNavRightBtn={disableNavRightBtn}
					pagenumber={pagenumber}
					totalPages={totalPages}
					pending={pending}
				/>
			</div>
		);
	}
}

export default RightPane1;
