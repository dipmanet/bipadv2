import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import ManWoman from "#views/VizRisk/Tikapur/Icons/ManWoman.svg";
import Male from "#views/VizRisk/Tikapur/Icons/male.svg";
import Female from "#views/VizRisk/Tikapur/Icons/female.svg";
import Home from "#views/VizRisk/Tikapur/Icons/home.svg";
import Demo from "../../Data/demographicsData";
import styles from "../../styles.module.scss";

const demoChartdata = Demo.demographicsData;

interface Props {
	handleNext: () => void;
	handlePrev: () => void;
	pagenumber: number;
	totalPages: number;
	pending: boolean;
}

const LeftPane4 = (props: Props) => {
	// const { data: {
	//     renderLegendDemo,
	// } } = props;

	const renderLegendDemo = () => (
		<div className={styles.climateLegendContainer}>
			<div className={styles.climatelegend}>
				<div className={styles.legendMale} />
				<div className={styles.legendText}>
					Male Pop
					<sup>n</sup>
				</div>
			</div>
			<div className={styles.climatelegend}>
				<div className={styles.legendFemale} />
				<div className={styles.legendText}>
					Female Pop
					<sup>n</sup>
				</div>
			</div>
			<div className={styles.climatelegend}>
				<div className={styles.legendTotHH} />
				<div className={styles.legendText}>Total Household</div>
			</div>
		</div>
	);

	return (
		<div className={styles.vrSideBar}>
			<h1>Demography</h1>
			<p className={styles.narrativeText}>
				Bhotekoshi Rural Municipality has a total population of 13,396 with 6470 males and 6908
				females residing in a total of 2586 households. Ward 4 has the largest number of households
				(677) while ward 3 has the least number of households(187). (Data Source: Municipal Profile,
				2075)
			</p>
			<div className={styles.iconRow}>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIcon} src={ManWoman} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>16,631</div>
						<div className={styles.iconText}>Total Population</div>
					</div>
				</div>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIconHH} src={Home} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>4,183</div>
						<div className={styles.iconText}>Total Family Count</div>
					</div>
				</div>
			</div>

			<div className={styles.iconRow}>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIcon} src={Male} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>8,431</div>
						<div className={styles.iconText}>Male Population</div>
					</div>
				</div>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIcon} src={Female} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>8,200</div>
						<div className={styles.iconText}>Female Population</div>
					</div>
				</div>
			</div>

			<div className={styles.climateChart}>
				<ResponsiveContainer height={"100%"} width={"100%"}>
					<BarChart
						data={demoChartdata}
						layout="vertical"
						margin={{ top: 0, bottom: 10, right: 0, left: 0 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis type="number" tick={{ fill: "#94bdcf" }} />
						<YAxis type="category" dataKey="name" tick={{ fill: "#94bdcf" }} />
						<Tooltip />
						<Legend iconType="square" iconSize={10} align="center" content={renderLegendDemo} />
						<Bar dataKey="MalePop" fill="#ffbf00" barSize={10} stackId="a" />
						<Bar
							dataKey="FemalePop"
							radius={[0, 10, 10, 0]}
							fill="#00d725"
							barSize={10}
							stackId="a"
						/>
						<Bar dataKey="FamilyCount" radius={[0, 10, 10, 0]} fill="#347eff" barSize={10} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default LeftPane4;
