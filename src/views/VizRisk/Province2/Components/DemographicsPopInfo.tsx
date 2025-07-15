import React from "react";
import ScalableVectorGraphics from "#rscv/ScalableVectorGraphics";
import ManWoman from "#views/VizRisk/Tikapur/Icons/ManWoman.svg";
import Male from "#views/VizRisk/Tikapur/Icons/male.svg";
import Female from "#views/VizRisk/Tikapur/Icons/female.svg";
import Home from "#views/VizRisk/Tikapur/Icons/home.svg";
import styles from "../LeftPane/styles.module.scss";
import { parseStringToNumber } from "../Functions";

export default function DemographicsPopInfo(props) {
	const { populationData } = props;
	const totalMalePop = populationData.map((pop) => pop.MalePop).reduce((a, b) => a + b);
	const totalFemalePop = populationData.map((pop) => pop.FemalePop).reduce((a, b) => a + b);
	const totalFamily = populationData.map((pop) => pop.TotalHousehold).reduce((a, b) => a + b);
	const totalPopulation = totalMalePop + totalFemalePop;

	return (
		<>
			<div className={styles.iconRow}>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIcon} src={ManWoman} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>{parseStringToNumber(totalPopulation)}</div>
						<div className={styles.iconText}>Total Population</div>
					</div>
				</div>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIconFamily} src={Home} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>{parseStringToNumber(totalFamily)}</div>
						<div className={styles.iconText}>Total Family Count</div>
					</div>
				</div>
			</div>

			<div className={styles.iconRow}>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIcon} src={Male} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>{parseStringToNumber(totalMalePop)}</div>
						<div className={styles.iconText}>Male Population</div>
					</div>
				</div>
				<div className={styles.infoIconsContainer}>
					<ScalableVectorGraphics className={styles.infoIcon} src={Female} />
					<div className={styles.descriptionCotainer}>
						<div className={styles.iconTitle}>{parseStringToNumber(totalFemalePop)}</div>
						<div className={styles.iconText}>Female Population</div>
					</div>
				</div>
			</div>
		</>
	);
}
