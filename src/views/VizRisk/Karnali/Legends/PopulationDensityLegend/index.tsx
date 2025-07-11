import React, { useState } from "react";
import Hexagon from "react-hexagon";
import { parseStringToNumber } from "../../Functions";
import styles from "./styles.module.scss";

const PopulationDensityLegends = (props) => {
	const { populationDensityRange, leftElement, exposureElementArr } = props;
	const [showPopulationWard, setShowPopulationWard] = useState(true);

	const range1 = populationDensityRange.map((item) => item.range1)[0];
	const range2 = populationDensityRange.map((item) => item.range2)[1];
	const range3 = populationDensityRange.map((item) => item.range3)[2];
	const range4 = populationDensityRange.map((item) => item.range4)[3];
	const range5 = populationDensityRange.map((item) => item.range5)[4];

	return (
		<>
			<div
				className={
					leftElement === 3 && exposureElementArr[0] === 1
						? styles.mainDivForPopDensityExposure
						: styles.mainDivForPopDensity
				}>
				{showPopulationWard && (
					<div>
						<h4>Population Density</h4>
						<div className={styles.populationContainer}>
							<div className={styles.populationIndContainerShort}>
								<div className={styles.populationIndicator1} />
								<div className={styles.populationIndicator2} />
								<div className={styles.populationIndicator3} />
								<div className={styles.populationIndicator4} />
								<div className={styles.populationIndicator5} />
							</div>
							<div className={styles.populationTextContainer}>
								<div className={styles.populationText}>{`${parseStringToNumber(
									range5[0]
								)} - ${parseStringToNumber(range5[1])}`}</div>
								<div className={styles.populationText}>{`${parseStringToNumber(
									range4[0]
								)} - ${parseStringToNumber(range4[1])}`}</div>
								<div className={styles.populationText}>{`${parseStringToNumber(
									range3[0]
								)} - ${parseStringToNumber(range3[1])}`}</div>
								<div className={styles.populationText}>{`${parseStringToNumber(
									range2[0]
								)} - ${parseStringToNumber(range2[1])}`}</div>
								<div className={styles.populationText}>{`${parseStringToNumber(
									range1[0]
								)} - ${parseStringToNumber(range1[1])}`}</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default PopulationDensityLegends;
